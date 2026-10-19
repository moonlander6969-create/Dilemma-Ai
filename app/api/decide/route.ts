import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { Type } from "@google/genai";
import { DecisionRequest, DecisionResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: DecisionRequest = await req.json();
    const { situation, options, riskTolerance, timeHorizon, framework } = body;

    if (!situation || !situation.trim()) {
      return NextResponse.json({ error: "Please describe the situation or dilemma." }, { status: 400 });
    }

    if (!options || options.length < 2) {
      return NextResponse.json({ error: "Please provide at least 2 options to compare (e.g., Choice A and Choice B)." }, { status: 400 });
    }

    const optionsText = options
      .map(
        (opt, idx) =>
          `[ID: ${opt.id}] ${opt.label || `Option ${idx + 1}`}: "${opt.title || 'Untitled Option'}"\nDescription: ${
            opt.description || 'No description provided'
          }${opt.pros && opt.pros.length ? `\nPros noted: ${opt.pros.join(', ')}` : ''}${
            opt.cons && opt.cons.length ? `\nCons/Risks noted: ${opt.cons.join(', ')}` : ''
          }`
      )
      .join("\n\n");

    const prompt = `
Analyze the following decision situation and select the definitive winning choice among all provided options.

SITUATION & CONTEXT:
"${situation.trim()}"

USER CONSTRAINTS & PREFERENCES:
- Risk Tolerance: ${riskTolerance || 'balanced'}
- Time Horizon: ${timeHorizon || 'medium_term'}
- Analytical Framework lens: ${framework || 'comprehensive'}

OPTIONS TO ARBITRATE BETWEEN:
${optionsText}

MISSION & RULES:
1. Make a CLEAR, DEFINITIVE VERDICT. Do not say "it depends on what you value" or give a tie. You MUST pick ONE winning option id from the provided options.
2. Provide a compelling, razor-sharp executive rationale explaining why this choice is strategically superior.
3. Quantify scores (0-100 overall, and 0-10 for feasibility, upside, riskSafety, longTermAlignment).
4. Evaluate pros and cons for each option with explicit weight/magnitude scores (1 to 10) representing the true impact of each advantage and severity of each risk/con. The overall confidenceScore must reflect how strongly the pros outweigh the cons for the chosen path.
5. For all other options, explain exactly WHY they were rejected or fell short.
5. Identify hidden assumptions, blindspots, and a devil's advocate stress-test.
6. Provide a concrete 3-step action roadmap to execute the winning choice with confidence.
7. Provide 2 contingency triggers ("If X happens within Y time, pivot to Z").
8. End with a reflective gut-check question.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a master decision strategist, behavioral economist, and executive arbitrator. You deliver decisive, highly reasoned verdicts for difficult life, career, business, and tactical dilemmas. Avoid fluff or evasiveness; pick the superior option with clarity and actionable realism.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.OBJECT,
              properties: {
                chosenOptionId: { type: Type.STRING },
                chosenOptionLabel: { type: Type.STRING },
                chosenOptionTitle: { type: Type.STRING },
                confidenceScore: { type: Type.INTEGER, description: "Confidence score between 50 and 99" },
                headlineVerdict: { type: Type.STRING, description: "A punchy, clear recommendation sentence" },
                executiveSummary: { type: Type.STRING, description: "2 to 3 paragraphs detailing the core argument" },
                decisiveFactor: { type: Type.STRING, description: "The single pivotal factor that clinches the decision" },
              },
              required: [
                "chosenOptionId",
                "chosenOptionLabel",
                "chosenOptionTitle",
                "confidenceScore",
                "headlineVerdict",
                "executiveSummary",
                "decisiveFactor",
              ],
            },
            optionsEvaluation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionId: { type: Type.STRING },
                  optionLabel: { type: Type.STRING },
                  optionTitle: { type: Type.STRING },
                  overallScore: { type: Type.INTEGER, description: "Score out of 100" },
                  scores: {
                    type: Type.OBJECT,
                    properties: {
                      feasibility: { type: Type.INTEGER, description: "0-10 rating" },
                      upside: { type: Type.INTEGER, description: "0-10 rating" },
                      riskSafety: { type: Type.INTEGER, description: "0-10 rating" },
                      longTermAlignment: { type: Type.INTEGER, description: "0-10 rating" },
                    },
                    required: ["feasibility", "upside", "riskSafety", "longTermAlignment"],
                  },
                  keyAdvantages: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  criticalRisksOrDownsides: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  prosArguments: {
                    type: Type.ARRAY,
                    description: "Explicit weighted pros/arguments with weight from 1 to 10",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        weight: { type: Type.INTEGER, description: "Strength/impact weight from 1 to 10" },
                        category: { type: Type.STRING, description: "Category e.g. Upside, Growth, Stability, Alignment" },
                      },
                      required: ["text", "weight"],
                    },
                  },
                  consArguments: {
                    type: Type.ARRAY,
                    description: "Explicit weighted cons/drawbacks with severity weight from 1 to 10",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        weight: { type: Type.INTEGER, description: "Severity/risk weight from 1 to 10" },
                        category: { type: Type.STRING, description: "Category e.g. Risk, Stress, Friction, Financial" },
                      },
                      required: ["text", "weight"],
                    },
                  },
                  whyRejectedOrSecondary: { type: Type.STRING },
                  regretPotential: { type: Type.STRING },
                },
                required: [
                  "optionId",
                  "optionLabel",
                  "optionTitle",
                  "overallScore",
                  "scores",
                  "keyAdvantages",
                  "criticalRisksOrDownsides",
                  "whyRejectedOrSecondary",
                  "regretPotential",
                ],
              },
            },
            headToHeadComparison: {
              type: Type.OBJECT,
              properties: {
                tradeOffSummary: { type: Type.STRING },
                hiddenAssumptionsExposed: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                devilsAdvocateCounterpoint: { type: Type.STRING },
              },
              required: ["tradeOffSummary", "hiddenAssumptionsExposed", "devilsAdvocateCounterpoint"],
            },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  details: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                },
                required: ["step", "title", "details", "timeframe"],
              },
            },
            contingencyTriggers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  triggerCondition: { type: Type.STRING },
                  fallbackAction: { type: Type.STRING },
                },
                required: ["triggerCondition", "fallbackAction"],
              },
            },
            gutCheckQuestion: { type: Type.STRING },
          },
          required: [
            "verdict",
            "optionsEvaluation",
            "headToHeadComparison",
            "actionPlan",
            "contingencyTriggers",
            "gutCheckQuestion",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: "Empty response from Gemini decision engine." }, { status: 500 });
    }

    const parsedData = JSON.parse(text);

    // Double-check chosenOptionId matches one of the provided options
    const matchedOption = options.find((o) => o.id === parsedData.verdict.chosenOptionId);
    if (!matchedOption && options.length > 0) {
      parsedData.verdict.chosenOptionId = options[0].id;
      parsedData.verdict.chosenOptionLabel = options[0].label;
      parsedData.verdict.chosenOptionTitle = options[0].title;
    }

    const decisionResult: DecisionResult = {
      id: "dec_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      situation,
      options,
      ...parsedData,
    };

    return NextResponse.json(decisionResult);
  } catch (error: any) {
    console.error("Decision engine API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process decision arbitration. Please try again." },
      { status: 500 }
    );
  }
}

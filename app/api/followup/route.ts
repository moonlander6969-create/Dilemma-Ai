import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { DecisionResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { question, decisionResult, chatHistory } = await req.json();

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Question cannot be empty." }, { status: 400 });
    }

    const decision: DecisionResult = decisionResult;
    const previousConversation = Array.isArray(chatHistory)
      ? chatHistory.map((m: any) => `${m.role === "user" ? "User" : "Decider Engine"}: ${m.content}`).join("\n")
      : "";

    const prompt = `
You are the master arbitrator who already evaluated this dilemma:

SITUATION:
"${decision.situation}"

OPTIONS CONSIDERED:
${decision.options.map((o) => `- [${o.label}] ${o.title}: ${o.description}`).join("\n")}

YOUR PREVIOUS VERDICT:
- Winner: ${decision.verdict.chosenOptionLabel} (${decision.verdict.chosenOptionTitle})
- Headline: ${decision.verdict.headlineVerdict}
- Decisive Factor: ${decision.verdict.decisiveFactor}

PREVIOUS FOLLOW-UP CONVERSATION:
${previousConversation || "None yet."}

NEW QUESTION FROM USER:
"${question.trim()}"

TASK:
Provide a razor-sharp, objective, and direct answer to the user's specific challenge or question.
- If their new scenario ("what if X happens?") genuinely shifts the optimal choice, state clearly whether it tips the balance toward another option and why.
- If the current winning choice remains solid, explain how to absorb or mitigate their specific concern.
- Keep the tone candid, supportive, analytical, and direct. Do not hedge unnecessarily.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an elite rational decision coach. Answer with strategic clarity, practical wisdom, and directness.",
      },
    });

    const reply = response.text || "No response generated.";
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Follow-up question API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process follow-up question." },
      { status: 500 }
    );
  }
}

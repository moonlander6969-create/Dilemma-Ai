export interface DecisionOption {
  id: string;
  label: string; // e.g., "Option A", "Option B", "Option C"
  title: string;
  description: string;
  pros?: string[];
  cons?: string[];
}

export interface DecisionCriterion {
  id: string;
  name: string;
  weight: number; // 1 to 5
}

export type RiskTolerance = 'conservative' | 'balanced' | 'aggressive';
export type TimeHorizon = 'short_term' | 'medium_term' | 'long_term';
export type DecisionFramework = 'comprehensive' | 'regret_minimization' | 'matrix' | 'devils_advocate' | 'ten_ten_ten';

export interface DecisionRequest {
  situation: string;
  options: DecisionOption[];
  criteria?: DecisionCriterion[];
  riskTolerance?: RiskTolerance;
  timeHorizon?: TimeHorizon;
  framework?: DecisionFramework;
}

export interface OptionScore {
  feasibility: number; // 0-10
  upside: number; // 0-10
  riskSafety: number; // 0-10
  longTermAlignment: number; // 0-10
}

export interface WeightedArgument {
  text: string;
  weight: number; // 1 to 10
  category?: string;
}

export interface EvaluatedOption {
  optionId: string;
  optionLabel: string;
  optionTitle: string;
  overallScore: number; // 0-100
  scores: OptionScore;
  keyAdvantages: string[];
  criticalRisksOrDownsides: string[];
  prosArguments?: WeightedArgument[];
  consArguments?: WeightedArgument[];
  whyRejectedOrSecondary: string;
  regretPotential: string;
}

export interface ActionStep {
  step: number;
  title: string;
  details: string;
  timeframe: string;
}

export interface ContingencyTrigger {
  triggerCondition: string;
  fallbackAction: string;
}

export interface DecisionResult {
  id: string;
  timestamp: number;
  situation: string;
  options: DecisionOption[];
  criteria?: DecisionCriterion[];
  verdict: {
    chosenOptionId: string;
    chosenOptionLabel: string;
    chosenOptionTitle: string;
    confidenceScore: number; // 0-100
    headlineVerdict: string;
    executiveSummary: string;
    decisiveFactor: string;
  };
  optionsEvaluation: EvaluatedOption[];
  headToHeadComparison: {
    tradeOffSummary: string;
    hiddenAssumptionsExposed: string[];
    devilsAdvocateCounterpoint: string;
  };
  actionPlan: ActionStep[];
  contingencyTriggers: ContingencyTrigger[];
  gutCheckQuestion: string;
}

export interface FollowUpMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

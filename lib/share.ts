import LZString from 'lz-string';
import { DecisionResult } from './types';

export interface SharedDecisionPayload {
  v: 1;
  id: string;
  createdAt: number;
  expiresAt: number;
  situation: string;
  verdict: {
    chosenOptionId: string;
    chosenOptionLabel: string;
    chosenOptionTitle: string;
    confidenceScore: number;
    headlineVerdict: string;
    decisiveFactor: string;
    executiveSummary: string;
  };
  options: Array<{
    id: string;
    label: string;
    title: string;
    description: string;
    pros?: string[];
    cons?: string[];
  }>;
  optionsEvaluation: Array<{
    optionId: string;
    optionLabel: string;
    optionTitle: string;
    overallScore: number;
    scores: {
      feasibility: number;
      upside: number;
      riskSafety: number;
      longTermAlignment: number;
    };
    keyAdvantages: string[];
    criticalRisksOrDownsides: string[];
    whyRejectedOrSecondary: string;
    regretPotential: string;
  }>;
  headToHeadComparison: {
    tradeOffSummary: string;
    hiddenAssumptionsExposed: string[];
    devilsAdvocateCounterpoint: string;
  };
  actionPlan: Array<{
    step: number;
    title: string;
    details: string;
    timeframe: string;
  }>;
  contingencyTriggers: Array<{
    triggerCondition: string;
    fallbackAction: string;
  }>;
  gutCheckQuestion: string;
}

export function createShareableUrl(result: DecisionResult, daysValid = 7): { url: string; expiresAt: number } {
  const expiresAt = Date.now() + daysValid * 24 * 60 * 60 * 1000;

  const payload: SharedDecisionPayload = {
    v: 1,
    id: result.id,
    createdAt: Date.now(),
    expiresAt,
    situation: result.situation,
    verdict: result.verdict,
    options: result.options,
    optionsEvaluation: result.optionsEvaluation,
    headToHeadComparison: result.headToHeadComparison,
    actionPlan: result.actionPlan,
    contingencyTriggers: result.contingencyTriggers,
    gutCheckQuestion: result.gutCheckQuestion,
  };

  const jsonStr = JSON.stringify(payload);
  const compressed = LZString.compressToEncodedURIComponent(jsonStr);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const url = `${origin}${pathname}?share=${compressed}`;

  return { url, expiresAt };
}

export function parseShareablePayload(
  encoded: string
): { data: DecisionResult | null; isExpired: boolean; expiresAt?: number } {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (!decompressed) {
      return { data: null, isExpired: false };
    }

    const payload: SharedDecisionPayload = JSON.parse(decompressed);

    const isExpired = Date.now() > payload.expiresAt;

    const result: DecisionResult = {
      id: payload.id || `share_${Date.now()}`,
      timestamp: payload.createdAt,
      situation: payload.situation,
      options: payload.options,
      verdict: payload.verdict,
      optionsEvaluation: payload.optionsEvaluation,
      headToHeadComparison: payload.headToHeadComparison,
      actionPlan: payload.actionPlan,
      contingencyTriggers: payload.contingencyTriggers,
      gutCheckQuestion: payload.gutCheckQuestion,
    };

    return { data: result, isExpired, expiresAt: payload.expiresAt };
  } catch (e) {
    console.error('Failed to parse shareable link:', e);
    return { data: null, isExpired: false };
  }
}

import { DecisionResult } from './types';
import { getOptionArguments } from './argumentUtils';

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  // If string contains comma, quote, or newline, escape quotes and wrap in quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function generateDecisionHistoryCSV(history: DecisionResult[]): string {
  const headers = [
    'Decision_ID',
    'Date',
    'Timestamp_ISO',
    'Situation_Context',
    'Recommended_Option_Label',
    'Recommended_Option_Title',
    'Confidence_Score_Pct',
    'Headline_Verdict',
    'Decisive_Factor',
    'Winning_Overall_Score',
    'Feasibility_Score_0_10',
    'Upside_Score_0_10',
    'Risk_Safety_Score_0_10',
    'Long_Term_Alignment_0_10',
    'Total_Pros_Weight',
    'Total_Cons_Weight',
    'Net_Strategic_Spread',
    'Options_Count',
    'All_Evaluated_Options',
    'Action_Roadmap_Steps',
    'Contingency_Tripwires',
    'Executive_Summary',
  ];

  const rows = history.map((item) => {
    const winningOption =
      item.optionsEvaluation.find((o) => o.optionId === item.verdict.chosenOptionId) ||
      item.optionsEvaluation[0];

    const args = winningOption ? getOptionArguments(winningOption) : { pros: [], cons: [] };
    const totalProsWeight = args.pros.reduce((sum, p) => sum + p.weight, 0);
    const totalConsWeight = args.cons.reduce((sum, c) => sum + c.weight, 0);
    const netSpread = totalProsWeight - totalConsWeight;

    const allOptionsSummary = item.optionsEvaluation
      .map((o) => `${o.optionLabel}: "${o.optionTitle}" (${o.overallScore}/100)`)
      .join(' | ');

    const actionSteps = item.actionPlan
      .map((s) => `Step ${s.step} [${s.timeframe}]: ${s.title} - ${s.details}`)
      .join(' ; ');

    const tripwires = item.contingencyTriggers
      .map((t) => `IF: ${t.triggerCondition} -> PIVOT: ${t.fallbackAction}`)
      .join(' ; ');

    const dateStr = new Date(item.timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return [
      escapeCSV(item.id),
      escapeCSV(dateStr),
      escapeCSV(new Date(item.timestamp).toISOString()),
      escapeCSV(item.situation),
      escapeCSV(item.verdict.chosenOptionLabel),
      escapeCSV(item.verdict.chosenOptionTitle),
      escapeCSV(item.verdict.confidenceScore),
      escapeCSV(item.verdict.headlineVerdict),
      escapeCSV(item.verdict.decisiveFactor),
      escapeCSV(winningOption ? winningOption.overallScore : ''),
      escapeCSV(winningOption ? winningOption.scores.feasibility : ''),
      escapeCSV(winningOption ? winningOption.scores.upside : ''),
      escapeCSV(winningOption ? winningOption.scores.riskSafety : ''),
      escapeCSV(winningOption ? winningOption.scores.longTermAlignment : ''),
      escapeCSV(totalProsWeight),
      escapeCSV(totalConsWeight),
      escapeCSV(netSpread),
      escapeCSV(item.optionsEvaluation.length),
      escapeCSV(allOptionsSummary),
      escapeCSV(actionSteps),
      escapeCSV(tripwires),
      escapeCSV(item.verdict.executiveSummary),
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) ensures proper decoding in Excel & Sheets
  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}

export function downloadDecisionHistoryCSV(history: DecisionResult[]): void {
  if (!history || history.length === 0) return;

  const csvContent = generateDecisionHistoryCSV(history);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const dateTag = new Date().toISOString().split('T')[0];
  const filename = `dilemna_ai_decisions_${dateTag}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

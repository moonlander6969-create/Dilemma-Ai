import { jsPDF } from 'jspdf';
import { DecisionResult } from './types';

export interface PDFExportOptions {
  includeComparisonTable?: boolean;
  includeDevilsAdvocate?: boolean;
  includeActionRoadmap?: boolean;
  includeTripwires?: boolean;
  includeSignOff?: boolean;
  decisionMakerName?: string;
  notes?: string;
}

export function generateDecisionPDF(
  result: DecisionResult,
  options: PDFExportOptions = {}
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin;
      renderPageHeader();
    }
  };

  const renderPageHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('EXECUTIVE DECISION ARBITRATION DOSSIER', margin, 10);
    doc.setFont('helvetica', 'normal');
    doc.text(`ID: ${result.id.slice(0, 14)}`, pageWidth - margin, 10, { align: 'right' });
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 12, pageWidth - margin, 12);
  };

  // --- Document Cover / Top Header Banner ---
  renderPageHeader();
  y = 16;

  // Dark Header Bar with Neon Green Accent line
  doc.setFillColor(18, 21, 28); // #12151c
  doc.rect(margin, y, contentWidth, 22, 'F');

  // Neon Green Top Bar Accent
  doc.setFillColor(0, 255, 102); // #00ff66 neon green
  doc.rect(margin, y, contentWidth, 1.8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('DILEMMA DECISION ARBITRATION DOSSIER', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  const formattedDate = new Date(result.timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Recorded Date: ${formattedDate}  |  Dossier: Dilemna Ai Decision Guidance`, margin + 6, y + 16);

  y += 27;

  // --- Section 1: The Situation ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('1. THE SITUATION & DILEMMA CONTEXT', margin, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const situationLines = doc.splitTextToSize(result.situation, contentWidth);
  doc.text(situationLines, margin, y);
  y += situationLines.length * 4.2 + 6;

  // --- Section 2: Definitive Verdict Callout Box ---
  checkPageBreak(42);
  const verdictBoxHeight = 36;
  doc.setFillColor(248, 250, 252); // soft off-white/grey
  doc.setDrawColor(0, 200, 80); // green border
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, verdictBoxHeight, 2, 2, 'FD');

  // Green ribbon tag
  doc.setFillColor(0, 255, 102);
  doc.roundedRect(margin + 4, y + 4, 34, 5.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text('OFFICIAL VERDICT', margin + 6, y + 7.8);

  // Conviction Score Badge on right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Conviction: ${result.verdict.confidenceScore}%`, pageWidth - margin - 6, y + 8, { align: 'right' });

  // Main Winning Recommendation Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  const winTitle = `RECOMMENDATION: ${result.verdict.chosenOptionLabel} - ${result.verdict.chosenOptionTitle}`;
  const winTitleLines = doc.splitTextToSize(winTitle, contentWidth - 12);
  doc.text(winTitleLines, margin + 4, y + 14);

  // Core Rationale Headline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const headlineLines = doc.splitTextToSize(`"${result.verdict.headlineVerdict}"`, contentWidth - 12);
  doc.text(headlineLines, margin + 4, y + 21);

  // Decisive Factor
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 120, 50);
  const factorText = `Pivotal Pivot Factor: ${result.verdict.decisiveFactor}`;
  const factorLines = doc.splitTextToSize(factorText, contentWidth - 12);
  doc.text(factorLines, margin + 4, y + 29);

  y += verdictBoxHeight + 7;

  // --- Section 3: Executive Strategic Rationale ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('2. STRATEGIC RATIONALE & EXECUTIVE SYNTHESIS', margin, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(result.verdict.executiveSummary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4 + 7;

  // --- Section 4: Comparative Options Table ---
  if (options.includeComparisonTable !== false && result.optionsEvaluation.length > 0) {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('3. MULTI-OPTION COMPARATIVE SCORECARD', margin, y);
    y += 4.5;

    // Table Header
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('Option', margin + 3, y + 4.8);
    doc.text('Status', margin + 42, y + 4.8);
    doc.text('Score', margin + 65, y + 4.8);
    doc.text('Feas.', margin + 80, y + 4.8);
    doc.text('Upside', margin + 95, y + 4.8);
    doc.text('Safety', margin + 112, y + 4.8);
    doc.text('Long-term', margin + 130, y + 4.8);
    doc.text('Key Assessment', margin + 152, y + 4.8);
    y += 7;

    result.optionsEvaluation.forEach((opt, idx) => {
      checkPageBreak(12);
      const isWinner = opt.optionId === result.verdict.chosenOptionId;
      const rowBg = isWinner ? [240, 253, 244] : idx % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
      doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
      doc.rect(margin, y, contentWidth, 9, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(margin, y + 9, margin + contentWidth, y + 9);

      doc.setFont('helvetica', isWinner ? 'bold' : 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);

      // Label & Title truncated
      const labelStr = `${opt.optionLabel}: ${opt.optionTitle.slice(0, 18)}`;
      doc.text(labelStr, margin + 3, y + 6);

      // Status
      if (isWinner) {
        doc.setTextColor(0, 120, 50);
        doc.text('WINNER', margin + 42, y + 6);
      } else {
        doc.setTextColor(100, 116, 139);
        doc.text('Alternative', margin + 42, y + 6);
      }

      doc.setTextColor(15, 23, 42);
      doc.text(`${opt.overallScore}/100`, margin + 65, y + 6);
      doc.text(`${opt.scores.feasibility}/10`, margin + 80, y + 6);
      doc.text(`${opt.scores.upside}/10`, margin + 95, y + 6);
      doc.text(`${opt.scores.riskSafety}/10`, margin + 112, y + 6);
      doc.text(`${opt.scores.longTermAlignment}/10`, margin + 130, y + 6);

      // Assessment snippet
      const assess = opt.whyRejectedOrSecondary.slice(0, 24) + '...';
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text(assess, margin + 152, y + 6);

      y += 9;
    });

    y += 6;
  }

  // --- Section 5: Devil's Advocate & Trade-offs ---
  if (options.includeDevilsAdvocate !== false) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("4. STRESS-TEST: THE DEVIL'S ADVOCATE COUNTER-DEFENSE", margin, y);
    y += 4.5;

    doc.setFillColor(254, 242, 242); // very soft rose/amber
    doc.setDrawColor(248, 113, 113);
    doc.setLineWidth(0.4);
    const daText = result.headToHeadComparison.devilsAdvocateCounterpoint;
    const daLines = doc.splitTextToSize(daText, contentWidth - 8);
    const boxHeight = daLines.length * 3.8 + 6;
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(daLines, margin + 4, y + 5);
    y += boxHeight + 6;
  }

  // --- Section 6: Action Plan (Execution Roadmap) ---
  if (options.includeActionRoadmap !== false && result.actionPlan.length > 0) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('5. IMMEDIATE EXECUTION ROADMAP', margin, y);
    y += 4.5;

    result.actionPlan.forEach((step) => {
      checkPageBreak(14);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'F');

      // Step Number circle/box
      doc.setFillColor(15, 23, 42);
      doc.circle(margin + 5, y + 6, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(String(step.step), margin + 5, y + 7.2, { align: 'center' });

      // Title & timeframe
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(step.title, margin + 11, y + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Timeframe: ${step.timeframe}`, pageWidth - margin - 4, y + 4.8, { align: 'right' });

      // Details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const detailLines = doc.splitTextToSize(step.details, contentWidth - 16);
      doc.text(detailLines.slice(0, 2), margin + 11, y + 9.5);

      y += 14;
    });

    y += 4;
  }

  // --- Section 7: Tripwires & Contingencies ---
  if (options.includeTripwires !== false && result.contingencyTriggers.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('6. CONTINGENCY TRIPWIRES & PIVOT TRIGGERS', margin, y);
    y += 4.5;

    result.contingencyTriggers.forEach((trig) => {
      checkPageBreak(12);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 10, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(225, 29, 72);
      doc.text('IF TRIGGER:', margin + 4, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const condText = trig.triggerCondition.slice(0, 90);
      doc.text(condText, margin + 26, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 150, 60);
      doc.text('THEN PIVOT:', margin + 4, y + 8.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const actText = trig.fallbackAction.slice(0, 90);
      doc.text(actText, margin + 26, y + 8.5);

      y += 12;
    });

    y += 4;
  }

  // --- Section 8: Formal Record-Keeping Sign-Off ---
  if (options.includeSignOff !== false) {
    checkPageBreak(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('7. FORMAL DECISION RECORD & AUDIT SIGN-OFF', margin, y);
    y += 5;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'FD');

    const signer = options.decisionMakerName || 'Authorized Decision Maker';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('DECISION MAKER:', margin + 5, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(signer, margin + 35, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('DATE ADOPTED:', margin + 5, y + 14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(formattedDate, margin + 35, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('SIGNATURE / APPROVAL:', margin + 95, y + 7);
    doc.setDrawColor(148, 163, 184);
    doc.line(margin + 95, y + 18, pageWidth - margin - 5, y + 18);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Sign above for official corporate or personal archive', margin + 95, y + 22);

    y += 30;
  }

  // Add Page Numbers at bottom of all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `PatCheeks LLC · Dilemna Ai · Confidential Decision Archive · Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc;
}

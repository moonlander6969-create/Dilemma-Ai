'use client';

import React, { useState } from 'react';
import { DecisionResult, FollowUpMessage } from '@/lib/types';
import {
  CheckCircle2,
  AlertTriangle,
  Scale,
  TrendingUp,
  ShieldAlert,
  Flame,
  HelpCircle,
  Copy,
  Printer,
  RotateCcw,
  MessageSquare,
  Send,
  Compass,
  Check,
  FileDown,
  Clock,
  Share2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ExportPDFModal } from './ExportPDFModal';
import { ShareModal } from './ShareModal';
import { ProsConsChart } from './ProsConsChart';
import { ConfidenceScoreVisualizer } from './ConfidenceScoreVisualizer';
import { RadarWeightChart } from './RadarWeightChart';
import { DisclaimerModal } from './DisclaimerModal';
import { DilemnaLogo } from './DilemnaLogo';
import { getOptionArguments } from '@/lib/argumentUtils';

interface VerdictDisplayProps {
  result: DecisionResult;
  onReset: () => void;
  onEdit: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const verdictCardVariants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.97,
    filter: 'blur(12px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.25,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export function VerdictDisplay({ result, onReset, onEdit }: VerdictDisplayProps) {
  const [activeOptionTab, setActiveOptionTab] = useState<string>(
    result.verdict.chosenOptionId
  );
  const [copied, setCopied] = useState(false);
  const [isExportPDFOpen, setIsExportPDFOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Follow-up Q&A state
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [chatMessages, setChatMessages] = useState<FollowUpMessage[]>([]);
  const [followUpError, setFollowUpError] = useState<string | null>(null);

  const copySummary = () => {
    const text = `DILEMMA ARBITRATION REPORT
Situation: ${result.situation}

VERDICT: ${result.verdict.chosenOptionLabel} - ${result.verdict.chosenOptionTitle} (${result.verdict.confidenceScore}% Conviction)
Headline: ${result.verdict.headlineVerdict}

Decisive Pivot Factor:
${result.verdict.decisiveFactor}

Executive Summary:
${result.verdict.executiveSummary}

Action Roadmap:
${result.actionPlan.map((step) => `${step.step}. ${step.title} (${step.timeframe}): ${step.details}`).join('\n')}

Tripwires:
${result.contingencyTriggers.map((t) => `- Trigger: ${t.triggerCondition} -> Action: ${t.fallbackAction}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim() || isAsking) return;

    const userQ = followUpQuestion.trim();
    setFollowUpQuestion('');
    setFollowUpError(null);

    const userMessage: FollowUpMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: userQ,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsAsking(true);

    try {
      const res = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQ,
          decisionResult: result,
          chatHistory: chatMessages,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get follow-up answer.');
      }

      const data = await res.json();
      const modelMessage: FollowUpMessage = {
        id: `msg_${Date.now()}_m`,
        role: 'model',
        content: data.reply,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      setFollowUpError(err.message || 'Something went wrong answering your question.');
    } finally {
      setIsAsking(false);
    }
  };

  const winningOption =
    result.optionsEvaluation.find((o) => o.optionId === result.verdict.chosenOptionId) ||
    result.optionsEvaluation[0];
  const winningArguments = winningOption
    ? getOptionArguments(winningOption)
    : { pros: [], cons: [] };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 text-white relative"
    >
      {/* Interactive Web UI - Automatically hidden when printing/exporting to PDF */}
      <div className="space-y-8 print:hidden">
        {/* Top Header Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#242a38]"
        >
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#cbd5e1] hover:text-[#00ff66] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#00ff66]" />
            Re-examine Choices
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download Report Button that uses browser's print functionality to generate a clean, formatted PDF */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-[#00ff66] hover:bg-[#22ff77] rounded-lg shadow-sm shadow-[#00ff66]/20 transition-all cursor-pointer"
              title="Download formatted PDF report via browser print"
            >
              <FileDown className="w-3.5 h-3.5 text-black" />
              <span>Download Report</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#151922] border border-[#242a38] hover:border-[#00ff66]/50 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Generate temporary URL to share this dilemma summary"
            >
              <Share2 className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>Share Link</span>
            </button>

            <button
              onClick={copySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#151922] border border-[#242a38] hover:border-[#00ff66]/50 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span className="text-[#00ff66] font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#9ca3af]" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-[#151922] border border-amber-500/40 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Official Decision Responsibility Disclaimer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Disclaimer</span>
            </button>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1a1f2c] hover:bg-[#242b3d] border border-[#2e374d] rounded-lg transition-colors cursor-pointer"
            >
              New Dilemma
            </button>
          </div>
        </motion.div>

      {/* 1. Definitive Verdict Callout with Ethereal Fate Reveal */}
      <motion.div
        variants={verdictCardVariants}
        className="bg-gradient-to-br from-[#151922] via-[#10131a] to-[#0c1812] text-white rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[#00ff66]/40 space-y-6 relative overflow-hidden group"
      >
        {/* Ethereal Fate Aura Bloom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{
            opacity: [0, 0.45, 0.22],
            scale: [0.8, 1.15, 1],
          }}
          transition={{
            duration: 2.4,
            ease: 'easeOut',
          }}
          className="absolute -top-16 -right-16 w-[32rem] h-[32rem] bg-gradient-to-br from-[#00ff66]/25 via-emerald-400/10 to-transparent rounded-full blur-3xl pointer-events-none"
        />

        {/* Ethereal Light Sweep */}
        <motion.div
          initial={{ x: '-120%', opacity: 0 }}
          animate={{ x: '180%', opacity: [0, 0.35, 0] }}
          transition={{
            duration: 2.2,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.25,
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff66]/18 to-transparent skew-x-12 pointer-events-none"
        />

        {/* Ambient Shimmering Starlight Accent */}
        <div className="absolute top-4 right-6 pointer-events-none opacity-40">
          <Sparkles className="w-10 h-10 text-[#00ff66] animate-pulse" style={{ animationDuration: '4s' }} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242a38] pb-5 relative z-10">
          <div className="flex items-center gap-3.5">
            <DilemnaLogo variant="emblem" className="w-14 h-14 rounded-xl shadow-lg ring-1 ring-[#D4AF37]/30 shrink-0" />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#F3CA52]">
                <Sparkles className="w-4 h-4 text-[#F3CA52]" />
                <span>Destiny &amp; Clarity Revealed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Fate Reveals Your Path: {result.verdict.chosenOptionLabel} — {result.verdict.chosenOptionTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-[#0c0e13] px-4 py-2.5 rounded-xl border border-[#00ff66]/40 shadow-sm shadow-[#00ff66]/10">
            <div className="text-right">
              <div className="text-[10px] text-[#9ca3af] font-mono uppercase tracking-wider">Intuition & Confidence</div>
              <div className="text-xl font-extrabold text-[#00ff66] font-mono">
                {result.verdict.confidenceScore}%
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#00ff66]/50 flex items-center justify-center bg-[#00ff66]/15">
              <Sparkles className="w-5 h-5 text-[#00ff66]" />
            </div>
          </div>
        </div>

        {/* Visual Confidence Score & Intuition Meter Progress Bar based on LLM Analysis */}
        <div className="bg-[#0b0e14]/90 border border-[#00ff66]/30 rounded-xl p-4 relative z-10 space-y-2.5 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
              LLM Intuition Meter & Confidence Score
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30">
                {result.verdict.confidenceScore >= 85
                  ? 'Decisive Intuition'
                  : result.verdict.confidenceScore >= 70
                  ? 'Strong Conviction'
                  : 'Balanced Preference'}
              </span>
              <span className="font-mono text-xs font-extrabold text-[#00ff66]">
                {result.verdict.confidenceScore}% Certainty
              </span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="h-3.5 w-full bg-[#141923] rounded-full overflow-hidden p-0.5 border border-[#242d3d] relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.verdict.confidenceScore}%` }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-[#00cc52] to-[#00ff66] shadow-[0_0_14px_rgba(0,255,102,0.4)] relative"
            >
              <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/70 rounded-full animate-pulse" />
            </motion.div>
          </div>

          {/* Calibrated Meter Ticks */}
          <div className="flex justify-between items-center text-[10px] font-mono text-[#9ca3af] px-1">
            <span>0% Uncertain</span>
            <span>50% Neutral</span>
            <span>75% Strong Conviction</span>
            <span className="text-[#00ff66] font-semibold">100% Absolute Intuition</span>
          </div>
        </div>

        {/* Headline & Pivotal Factor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          <div className="md:col-span-2 space-y-2">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9ca3af] block">
              Guiding Truth
            </span>
            <p className="text-base sm:text-lg font-medium text-white leading-snug">
              {result.verdict.headlineVerdict}
            </p>
          </div>

          <div className="bg-[#0b1410] border border-[#00ff66]/30 rounded-xl p-4 text-xs space-y-1.5">
            <span className="font-bold text-[#00ff66] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
              The Decisive Turning Point
            </span>
            <p className="text-[#d1d5db] leading-relaxed">
              {result.verdict.decisiveFactor}
            </p>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="pt-2 border-t border-[#242a38] space-y-3 relative z-10">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#9ca3af] block">
            Wisdom & Deep Perspective
          </span>
          <div className="text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line space-y-3 font-normal">
            {result.verdict.executiveSummary}
          </div>
        </div>
      </motion.div>

      {/* Confidence Score Visualization based on Pros vs Cons */}
      <motion.div variants={itemVariants}>
        <ConfidenceScoreVisualizer
          confidenceScore={result.verdict.confidenceScore}
          chosenOptionLabel={result.verdict.chosenOptionLabel}
          chosenOptionTitle={result.verdict.chosenOptionTitle}
          pros={winningArguments.pros}
          cons={winningArguments.cons}
        />
      </motion.div>

      {/* D3 Radar Chart: Multidimensional Pros & Cons Weight Comparison */}
      <motion.div variants={itemVariants}>
        <RadarWeightChart
          result={result}
          activeOptionId={activeOptionTab}
          onSelectOption={(optId) => setActiveOptionTab(optId)}
        />
      </motion.div>

      {/* 2. Options Scorecard & Head-to-Head Comparison */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Deep Balance & Alignment of Paths
          </h3>
          <p className="text-xs text-[#9ca3af]">
            Select an option to explore how fate, feasibility, upside, and long-term peace of mind compare.
          </p>
        </div>

        {/* Tabs for each option */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#0c0e12] border border-[#242a38] rounded-xl">
          {result.optionsEvaluation.map((opt) => {
            const isWinner = opt.optionId === result.verdict.chosenOptionId;
            const isSelected = activeOptionTab === opt.optionId;

            return (
              <button
                key={opt.optionId}
                onClick={() => setActiveOptionTab(opt.optionId)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1e2432] text-white border border-[#00ff66]/50 shadow-sm'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#151922]'
                }`}
              >
                <span>{opt.optionLabel}</span>
                {isWinner && (
                  <span className="px-1.5 py-0.5 bg-[#00ff66] text-black text-[10px] rounded-md font-extrabold uppercase tracking-wider">
                    Destined Path
                  </span>
                )}
                <span className="text-[11px] text-[#64748b] font-mono ml-1">
                  {opt.overallScore}/100
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Option Detail Card */}
        {(() => {
          const opt =
            result.optionsEvaluation.find((o) => o.optionId === activeOptionTab) ||
            result.optionsEvaluation[0];
          if (!opt) return null;
          const isWinner = opt.optionId === result.verdict.chosenOptionId;
          const optArgs = getOptionArguments(opt);

          return (
            <div
              className={`bg-[#151922] border rounded-2xl p-6 shadow-sm space-y-6 ${
                isWinner ? 'border-2 border-[#00ff66]/70 shadow-lg shadow-[#00ff66]/10' : 'border-[#242a38]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#242a38]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#0c0e12] border border-[#242a38] text-white rounded">
                      {opt.optionLabel}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {opt.optionTitle}
                    </h4>
                    {isWinner && (
                      <span className="px-2.5 py-0.5 bg-[#00ff66] text-black text-[11px] font-extrabold rounded-md shadow-xs shadow-[#00ff66]/30">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-1">
                    {isWinner
                      ? 'Selected as the mathematically and strategically dominant choice.'
                      : 'Evaluated alternative path.'}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-[#9ca3af] font-mono uppercase">Overall Score</div>
                  <div className="text-2xl font-bold font-mono text-white">
                    <span className="text-[#00ff66]">{opt.overallScore}</span>
                    <span className="text-xs font-normal text-[#64748b]">/100</span>
                  </div>
                </div>
              </div>

              {/* Dimensional Metrics Grid with Neon Green Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Feasibility', val: opt.scores.feasibility },
                  { label: 'Upside Potential', val: opt.scores.upside },
                  { label: 'Risk Safety', val: opt.scores.riskSafety },
                  { label: 'Long-term Alignment', val: opt.scores.longTermAlignment },
                ].map((scoreItem) => (
                  <div
                    key={scoreItem.label}
                    className="p-3 bg-[#0c0e12] rounded-xl border border-[#242a38] space-y-1.5"
                  >
                    <div className="text-[11px] font-medium text-[#cbd5e1]">
                      {scoreItem.label}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-[#1e2330] h-2 rounded-full overflow-hidden mr-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            scoreItem.val >= 7
                              ? 'bg-[#00ff66] shadow-xs shadow-[#00ff66]'
                              : scoreItem.val >= 4
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, scoreItem.val * 10)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold font-mono text-white">
                        {scoreItem.val}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Side-by-Side Pros and Cons Comparison Chart using Recharts */}
              <div className="pt-2">
                <ProsConsChart
                  optionLabel={opt.optionLabel}
                  optionTitle={opt.optionTitle}
                  isWinningOption={isWinner}
                  pros={optArgs.pros}
                  cons={optArgs.cons}
                />
              </div>

              {/* Verdict specific analysis: Why Chosen or Why Rejected */}
              <div className="pt-2 border-t border-[#242a38] grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#0c0e12] border border-[#242a38] rounded-xl text-xs space-y-1">
                  <span className="font-bold text-white block">
                    {isWinner ? 'Why This Won Over Other Choices' : 'Why This Option Fell Short'}
                  </span>
                  <p className="text-[#cbd5e1] leading-relaxed">
                    {opt.whyRejectedOrSecondary}
                  </p>
                </div>

                <div className="p-3.5 bg-[#0c0e12] border border-[#242a38] rounded-xl text-xs space-y-1">
                  <span className="font-bold text-white block">
                    Future Regret Assessment
                  </span>
                  <p className="text-[#cbd5e1] leading-relaxed">
                    {opt.regretPotential}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </motion.div>

      {/* 3. Strategic Trade-offs & Devil's Advocate */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Trade-Off Synthesis & Hidden Assumptions */}
        <div className="bg-[#151922] border border-[#242a38] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#00ff66]" />
            <h4 className="text-sm font-bold text-white">
              Trade-Off Reality & Hidden Assumptions
            </h4>
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            {result.headToHeadComparison.tradeOffSummary}
          </p>

          <div className="pt-2 border-t border-[#242a38] space-y-2">
            <span className="text-[11px] font-mono uppercase text-[#9ca3af] font-semibold block">
              Hidden Assumptions Exposed
            </span>
            <ul className="space-y-1.5">
              {result.headToHeadComparison.hiddenAssumptionsExposed.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-white flex items-start gap-2 bg-[#0c0e12] border border-[#242a38] p-2 rounded-lg"
                >
                  <span className="text-[#00ff66] font-mono text-[10px] mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Devil's Advocate Counterpoint */}
        <div className="bg-[#151922] border border-[#242a38] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              The Devil&apos;s Advocate Counter-Defense
            </h4>
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Even though {result.verdict.chosenOptionLabel} is the winning recommendation, here is the strongest possible counterargument against it, and how to defend against it:
          </p>
          <div className="bg-[#0c0e12] border border-[#242a38] p-3.5 rounded-xl text-xs text-[#e2e8f0] leading-relaxed border-l-2 border-l-[#00ff66]">
            {result.headToHeadComparison.devilsAdvocateCounterpoint}
          </div>
        </div>
      </motion.div>

      {/* 4. Action Roadmap & Tripwires */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Action Roadmap */}
        <div className="bg-[#151922] border border-[#242a38] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00ff66]" />
            <h4 className="text-sm font-bold text-white">
              Immediate Execution Roadmap
            </h4>
          </div>
          <p className="text-xs text-[#9ca3af]">
            Three concrete next steps to execute the winning choice with clarity and momentum:
          </p>

          <div className="space-y-3">
            {result.actionPlan.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-3 p-3 bg-[#0c0e12] rounded-xl border border-[#242a38]"
              >
                <div className="w-6 h-6 rounded-full bg-[#00ff66] text-black font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs shadow-[#00ff66]/30">
                  {step.step}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-[#9ca3af] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00ff66]" />
                      {step.timeframe}
                    </span>
                  </div>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contingency Triggers & Tripwires */}
        <div className="bg-[#151922] border border-[#242a38] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#00ff66]" />
            <h4 className="text-sm font-bold text-white">
              Tripwire Conditions & Pivot Triggers
            </h4>
          </div>
          <p className="text-xs text-[#9ca3af]">
            Decisions are not forever. If any of these conditions occur, execute the fallback:
          </p>

          <div className="space-y-3">
            {result.contingencyTriggers.map((trig, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#0c0e12] rounded-xl border border-[#242a38] text-xs space-y-2"
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-rose-400 shrink-0">IF:</span>
                  <span className="text-white font-medium">{trig.triggerCondition}</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-[#242a38]">
                  <span className="font-bold text-[#00ff66] shrink-0">PIVOT:</span>
                  <span className="text-[#cbd5e1]">{trig.fallbackAction}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Gut-Check Closing */}
          <div className="p-3.5 bg-[#0c0e12] border border-[#00ff66]/40 rounded-xl text-xs space-y-1">
            <span className="font-bold text-[#00ff66] flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#00ff66]" />
              Emotional Gut-Check Reflection
            </span>
            <p className="text-white italic leading-relaxed">
              &ldquo;{result.gutCheckQuestion}&rdquo;
            </p>
          </div>
        </div>
      </motion.div>

      {/* 5. Interactive Interrogation / Follow-up Q&A */}
      <motion.div variants={itemVariants} className="bg-[#151922] border border-[#242a38] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#00ff66]" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Explore What-If Questions & Deeper Clarity
              </h4>
              <p className="text-xs text-[#9ca3af]">
                Explore edge cases and doubts: &ldquo;What if circumstances change?&rdquo;, &ldquo;How do I explain this to others?&rdquo;, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Q&A messages */}
        {chatMessages.length > 0 && (
          <div className="space-y-3 pt-2">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1e2432] text-white ml-6 border border-[#2e374d]'
                    : 'bg-[#0c0e12] text-[#e2e8f0] mr-6 border border-[#00ff66]/30 shadow-xs'
                }`}
              >
                <div className="font-bold font-mono text-[10px] text-[#00ff66] uppercase mb-1">
                  {msg.role === 'user' ? 'You Asked' : 'Decision Guide'}
                </div>
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>
            ))}
          </div>
        )}

        {followUpError && (
          <div className="p-3 bg-red-950/70 border border-red-500/40 text-red-200 text-xs rounded-xl">
            {followUpError}
          </div>
        )}

        {/* Follow-up question form */}
        <form onSubmit={handleFollowUpSubmit} className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={followUpQuestion}
            onChange={(e) => setFollowUpQuestion(e.target.value)}
            disabled={isAsking}
            placeholder="Ask a what-if question to test this verdict..."
            className="flex-1 px-4 py-2.5 text-xs text-white bg-[#0c0e12] border border-[#282f3f] rounded-xl focus:border-[#00ff66] focus:outline-none placeholder-[#64748b]"
          />
          <button
            type="submit"
            disabled={!followUpQuestion.trim() || isAsking}
            className="px-4 py-2.5 text-xs font-bold text-black bg-[#00ff66] hover:bg-[#22ff77] rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs shadow-[#00ff66]/20"
          >
            {isAsking ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Suggested Quick Questions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] text-[#9ca3af]">Try asking:</span>
          {[
            'What if the compensation offer is negotiated +15%?',
            'What is the worst-case scenario if I choose Option B?',
            'How should I break the news to the team/stakeholders?',
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFollowUpQuestion(prompt)}
              className="text-[11px] text-white bg-[#0c0e12] hover:bg-[#1f2430] border border-[#242a38] hover:border-[#00ff66]/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </motion.div>

      {/* On-Screen Decision Disclaimer Footer */}
      <div className="pt-4 border-t border-[#1e2330] text-center text-[11px] text-[#64748b] flex flex-wrap items-center justify-center gap-2">
        <span>Dilemna Ai provides heuristic decision-support. We are not responsible for any decisions the user makes.</span>
        <button
          onClick={() => setIsDisclaimerOpen(true)}
          className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
        >
          Read Full Disclaimer Document
        </button>
      </div>

      {/* Export PDF Modal */}
      <ExportPDFModal
        isOpen={isExportPDFOpen}
        onClose={() => setIsExportPDFOpen(false)}
        result={result}
      />

      {/* Shareable Link Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={result}
      />

      {/* Decision Responsibility Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>

    {/* Dedicated High-Contrast Printable Report for Browser Print-to-PDF */}
    <div className="hidden print:block bg-white text-slate-900 p-2 space-y-6 printable-report">
      {/* Print Document Header */}
      <div className="border-b-2 border-slate-900 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
              Official Decision Dossier
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              EXECUTIVE DECISION ARBITRATION REPORT
            </h1>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono">
            <div>Record ID: {result.id}</div>
            <div>Date: {new Date(result.timestamp).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Situation */}
      <div className="space-y-1 print-page-break-avoid">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          1. The Situation & Dilemma Context
        </h2>
        <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
          {result.situation}
        </p>
      </div>

      {/* Verdict Callout with Confidence & Weight Analysis */}
      <div className="border-2 border-slate-900 bg-slate-50 p-4 rounded-lg space-y-3 print-page-break-avoid">
        <div className="flex justify-between items-center border-b border-slate-300 pb-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Official Recommendation
            </span>
            <h3 className="text-lg font-bold text-slate-950 mt-1">
              {result.verdict.chosenOptionLabel}: {result.verdict.chosenOptionTitle}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">AI Recommendation Confidence</span>
            <span className="text-xl font-bold text-slate-900 font-mono">
              {result.verdict.confidenceScore}%
            </span>
          </div>
        </div>

        <div className="text-xs space-y-2">
          <p className="font-semibold text-slate-900">
            {result.verdict.headlineVerdict}
          </p>
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950 font-medium">
            <strong>Decisive Pivot Factor:</strong> {result.verdict.decisiveFactor}
          </div>
          <div className="p-2 bg-slate-100 border border-slate-300 rounded text-xs text-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span><strong>Confidence & Intuition Basis:</strong> LLM analysis weighting multi-factor trade-offs and risks</span>
              <span className="font-mono text-xs font-bold text-slate-900">
                +{winningArguments.pros.reduce((s, p) => s + p.weight, 0)} Pros Weight vs -{winningArguments.cons.reduce((s, c) => s + c.weight, 0)} Cons Drag
              </span>
            </div>
            {/* Printable Progress Bar */}
            <div className="space-y-0.5">
              <div className="h-2 w-full bg-slate-200 border border-slate-400 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${result.verdict.confidenceScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>0% Baseline</span>
                <span>50% Neutral</span>
                <span>75% Strong Conviction</span>
                <span className="font-bold text-slate-700">100% Absolute ({result.verdict.confidenceScore}%)</span>
              </div>
            </div>
          </div>
          <div className="text-slate-700 leading-relaxed whitespace-pre-line text-xs pt-1">
            {result.verdict.executiveSummary}
          </div>
        </div>
      </div>

      {/* Options Evaluation Table */}
      <div className="space-y-2 print-page-break-avoid">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          2. Multi-Option Comparative Scorecard
        </h2>
        <table className="w-full text-left text-xs border border-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white font-bold text-[11px]">
              <th className="p-2 border border-slate-400">Option</th>
              <th className="p-2 border border-slate-400">Status</th>
              <th className="p-2 border border-slate-400">Score</th>
              <th className="p-2 border border-slate-400">Feas.</th>
              <th className="p-2 border border-slate-400">Upside</th>
              <th className="p-2 border border-slate-400">Safety</th>
              <th className="p-2 border border-slate-400">Long-term</th>
            </tr>
          </thead>
          <tbody>
            {result.optionsEvaluation.map((opt) => {
              const isWinner = opt.optionId === result.verdict.chosenOptionId;
              return (
                <tr key={opt.optionId} className={isWinner ? 'bg-emerald-50 font-semibold' : 'bg-white'}>
                  <td className="p-2 border border-slate-300">
                    {opt.optionLabel}: {opt.optionTitle}
                  </td>
                  <td className="p-2 border border-slate-300">
                    {isWinner ? 'RECOMMENDED' : 'Alternative'}
                  </td>
                  <td className="p-2 border border-slate-300 font-mono">{opt.overallScore}/100</td>
                  <td className="p-2 border border-slate-300 font-mono">{opt.scores.feasibility}/10</td>
                  <td className="p-2 border border-slate-300 font-mono">{opt.scores.upside}/10</td>
                  <td className="p-2 border border-slate-300 font-mono">{opt.scores.riskSafety}/10</td>
                  <td className="p-2 border border-slate-300 font-mono">{opt.scores.longTermAlignment}/10</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Weighted Pros & Cons Breakdown Table */}
      <div className="space-y-3 print-page-break-avoid">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          3. Side-by-Side Weighted Pros & Cons (Impact Magnitude Scores 1–10)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {result.optionsEvaluation.map((opt) => {
            const isWinner = opt.optionId === result.verdict.chosenOptionId;
            const args = getOptionArguments(opt);
            const totalP = args.pros.reduce((s, p) => s + p.weight, 0);
            const totalC = args.cons.reduce((s, c) => s + c.weight, 0);

            return (
              <div
                key={opt.optionId}
                className={`p-3 border rounded text-xs space-y-2 ${
                  isWinner ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-center border-b border-slate-200 pb-1 font-bold">
                  <span>{opt.optionLabel}: {opt.optionTitle} {isWinner ? '★' : ''}</span>
                  <span className="font-mono text-[10px]">
                    +{totalP} Pros / -{totalC} Cons ({totalP - totalC >= 0 ? `+${totalP - totalC}` : totalP - totalC} Net)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-[10px] text-emerald-800 uppercase block">Advantages:</span>
                  <ul className="space-y-0.5">
                    {args.pros.map((p, i) => (
                      <li key={i} className="text-slate-800 flex items-start gap-1.5 text-[11px]">
                        <span className="font-mono font-bold text-emerald-700 text-[10px] shrink-0">+{p.weight}/10</span>
                        <span>{p.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-100">
                  <span className="font-bold text-[10px] text-rose-800 uppercase block">Risks & Downsides:</span>
                  <ul className="space-y-0.5">
                    {args.cons.map((c, i) => (
                      <li key={i} className="text-slate-800 flex items-start gap-1.5 text-[11px]">
                        <span className="font-mono font-bold text-rose-700 text-[10px] shrink-0">-{c.weight}/10</span>
                        <span>{c.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Devil's Advocate */}
      <div className="space-y-1 print-page-break-avoid">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          4. Devil&apos;s Advocate Counter-Defense
          </h2>
          <p className="text-xs text-slate-800 bg-amber-50 p-3 rounded border border-amber-200 leading-relaxed">
            {result.headToHeadComparison.devilsAdvocateCounterpoint}
          </p>
        </div>

        {/* Action Roadmap */}
        <div className="space-y-2 print-page-break-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            5. Execution Roadmap (Next 3 Steps)
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {result.actionPlan.map((step) => (
              <div key={step.step} className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs flex gap-2">
                <span className="font-bold text-slate-900 shrink-0">Step {step.step}:</span>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{step.title} ({step.timeframe})</div>
                  <div className="text-slate-700">{step.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tripwires */}
        <div className="space-y-2 print-page-break-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            6. Contingency Tripwires
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {result.contingencyTriggers.map((trig, idx) => (
              <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                <span className="font-bold text-rose-700">IF: </span>
                <span className="text-slate-800">{trig.triggerCondition} </span>
                <span className="font-bold text-emerald-700">| THEN PIVOT: </span>
                <span className="text-slate-800">{trig.fallbackAction}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off Block */}
        <div className="border border-slate-300 p-4 rounded bg-slate-50 space-y-4 print-page-break-avoid mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            7. Decision Record Sign-Off & Archival
          </h2>
          <div className="grid grid-cols-2 gap-8 text-xs pt-2">
            <div className="space-y-6">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Decision Maker:</span>
                <div className="border-b border-slate-400 pb-1 font-semibold text-slate-900">
                  Authorized Decision Maker
                </div>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Adoption Date:</span>
                <div className="border-b border-slate-400 pb-1 font-semibold text-slate-900" suppressHydrationWarning>
                  {new Date(result.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Official Signature:</span>
                <div className="border-b border-slate-400 h-6"></div>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Re-Evaluation Review Date:</span>
                <div className="border-b border-slate-400 pb-1 font-semibold text-slate-900">
                  90 Days Post-Execution
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Report Footer with Legal Disclaimer */}
        <div className="pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500 font-mono space-y-1">
          <div>PatCheeks LLC · Dilemna Ai · Confidential Decision Archive</div>
          <div className="text-[9px] text-slate-400 max-w-xl mx-auto leading-tight">
            DISCLAIMER: PatCheeks LLC and Dilemna Ai are not responsible for any decisions made by the user. Analysis and scores are automated heuristics provided solely for reflective purposes.
          </div>
        </div>
      </div>
    </motion.div>
  );
}

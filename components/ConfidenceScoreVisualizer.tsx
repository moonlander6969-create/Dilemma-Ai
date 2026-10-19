'use client';

import React from 'react';
import { WeightedArgument } from '@/lib/types';
import { Sparkles, Scale, ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ConfidenceScoreVisualizerProps {
  confidenceScore: number;
  chosenOptionLabel: string;
  chosenOptionTitle: string;
  pros: WeightedArgument[];
  cons: WeightedArgument[];
}

export function ConfidenceScoreVisualizer({
  confidenceScore,
  chosenOptionLabel,
  chosenOptionTitle,
  pros,
  cons,
}: ConfidenceScoreVisualizerProps) {
  const totalProsWeight = pros.reduce((sum, p) => sum + p.weight, 0);
  const totalConsWeight = cons.reduce((sum, c) => sum + c.weight, 0);
  const netSpread = totalProsWeight - totalConsWeight;
  const ratio = (totalProsWeight / Math.max(1, totalConsWeight)).toFixed(1);
  const totalCombined = totalProsWeight + totalConsWeight || 1;
  const proShare = Math.round((totalProsWeight / totalCombined) * 100);

  // Conviction level categorization
  const getConvictionTier = (score: number) => {
    if (score >= 85) {
      return {
        label: 'Decisive Intuition',
        description: 'Pros overwhelmingly outweigh potential downsides with peak strategic alignment',
        badgeColor: 'bg-[#00ff66]/20 text-[#00ff66] border-[#00ff66]/50',
      };
    }
    if (score >= 70) {
      return {
        label: 'Strong Conviction',
        description: 'Substantial strategic edge and clear upside over manageable risks',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      };
    }
    if (score >= 55) {
      return {
        label: 'Balanced Preference',
        description: 'Meaningful advantages present despite distinct trade-offs',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    }
    return {
      label: 'Marginal Edge',
      description: 'Closely matched pros and cons requiring heightened vigilance',
      badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    };
  };

  const tier = getConvictionTier(confidenceScore);

  return (
    <div className="bg-[#0f1219] border border-[#00ff66]/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-6">
      {/* Subtle Ethereal Ambient Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />

      {/* Header with Title and Conviction Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242a38] pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#00ff66]">
            <Sparkles className="w-4 h-4 text-[#00ff66] animate-pulse" />
            LLM Confidence Score & Intuition Meter
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
            Intuition Strength: {tier.label}
          </h3>
          <p className="text-xs text-[#9ca3af]">
            Visual progress meter gauging how decisively the LLM analysis recommends{' '}
            <span className="text-white font-medium">{chosenOptionLabel}: {chosenOptionTitle}</span>.
          </p>
        </div>

        <div className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border shrink-0 ${tier.badgeColor}`}>
          {tier.label} · {confidenceScore}% Score
        </div>
      </div>

      {/* Main Intuition Meter Progress Bar */}
      <div className="bg-[#141822] p-4 sm:p-5 rounded-xl border border-[#242a38] relative z-10 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
            Recommendation Confidence Progress Bar
          </span>
          <span className="font-mono text-sm font-extrabold text-[#00ff66]">
            {confidenceScore}%
          </span>
        </div>

        {/* The Animated Progress Bar */}
        <div className="h-5 w-full bg-[#0c0e13] rounded-full overflow-hidden p-0.5 border border-[#2e374d] relative shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidenceScore}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-[#00cc52] to-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.5)] relative flex items-center justify-end pr-2"
          >
            {/* Shimmering pulse flare on the leading tip */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/80 rounded-full blur-[1px] animate-pulse" />
            {confidenceScore >= 20 && (
              <span className="text-[10px] font-mono font-bold text-black leading-none drop-shadow-xs">
                {confidenceScore}%
              </span>
            )}
          </motion.div>
        </div>

        {/* Calibrated Benchmark Milestones */}
        <div className="grid grid-cols-4 text-[10px] font-mono text-[#9ca3af] pt-1 border-t border-[#1e2433]">
          <div>
            <span className="block text-slate-500">0%–49%</span>
            <span>Contested</span>
          </div>
          <div className="text-center">
            <span className="block text-slate-500">50%–69%</span>
            <span>Balanced</span>
          </div>
          <div className="text-center">
            <span className="block text-emerald-400 font-semibold">70%–84%</span>
            <span className="text-emerald-300">Strong</span>
          </div>
          <div className="text-right">
            <span className="block text-[#00ff66] font-bold">85%–100%</span>
            <span className="text-[#00ff66] font-bold">Decisive ★</span>
          </div>
        </div>
      </div>

      {/* Strategic Pros vs Cons Breakdown Underlying the Score */}
      <div className="bg-[#141822] p-4 sm:p-5 rounded-xl border border-[#242a38] relative z-10 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#00ff66]" />
            Underlying Argument Weight Balance (Pros vs. Cons)
          </span>
          <span className="font-mono text-xs font-semibold text-white">
            <span className="text-[#00ff66]">+{totalProsWeight} Pros Impact</span>
            <span className="text-[#64748b] mx-1.5">vs</span>
            <span className="text-rose-400">-{totalConsWeight} Cons Drag</span>
          </span>
        </div>

        {/* Pro vs Con Weight Balance Bar */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full bg-[#0c0e12] rounded-full overflow-hidden flex border border-[#2e374d] p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-[#00cc52] to-[#00ff66] transition-all duration-700 h-full rounded-l-full flex items-center justify-end pr-1.5"
              style={{ width: `${proShare}%` }}
            >
              {proShare >= 25 && (
                <span className="text-[9px] font-mono font-bold text-black leading-none">
                  {proShare}%
                </span>
              )}
            </div>
            <div
              className="bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-700 h-full rounded-r-full flex items-center justify-start pl-1.5"
              style={{ width: `${100 - proShare}%` }}
            >
              {100 - proShare >= 20 && (
                <span className="text-[9px] font-mono font-bold text-white leading-none">
                  {100 - proShare}%
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#9ca3af]">
            <span>Pros Weight: {totalProsWeight} pts ({proShare}%)</span>
            <span>Cons Drag: {totalConsWeight} pts ({100 - proShare}%)</span>
          </div>
        </div>

        {/* Narrative Conclusion Box */}
        <div className="p-3 bg-[#0c0e12] rounded-xl border border-[#282f40] flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-4 h-4 text-[#00ff66] shrink-0" />
            <span className="text-[#cbd5e1] text-xs leading-relaxed">
              LLM analysis confirms advantages outweigh risks by{' '}
              <strong className="text-white font-mono">{ratio}x</strong> ({netSpread >= 0 ? `+${netSpread}` : netSpread} net strategic spread), establishing a{' '}
              <strong className="text-[#00ff66]">{confidenceScore}% confidence</strong> verdict.
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-[#00ff66]/15 text-[#00ff66] font-bold shrink-0 border border-[#00ff66]/30">
            {proShare}% Dominant
          </span>
        </div>
      </div>
    </div>
  );
}

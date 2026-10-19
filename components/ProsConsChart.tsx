'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { WeightedArgument } from '@/lib/types';
import { TrendingUp, AlertTriangle, Scale, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ProsConsChartProps {
  optionLabel: string;
  optionTitle: string;
  isWinningOption: boolean;
  pros: WeightedArgument[];
  cons: WeightedArgument[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      shortLabel: string;
      fullText: string;
      weight: number;
      category: string;
    };
  }>;
  type: 'pro' | 'con';
}

function CustomTooltip({ active, payload, type }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  const isPro = type === 'pro';

  return (
    <div className="bg-[#0c0e12] border border-[#2e374d] rounded-xl p-3 shadow-xl max-w-xs text-xs space-y-1.5 z-50">
      <div className="flex items-center justify-between gap-2 border-b border-[#242a38] pb-1.5">
        <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-[#9ca3af]">
          {item.category}
        </span>
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold ${
            isPro
              ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
          }`}
        >
          {isPro ? `+${item.weight}/10 Impact` : `-${item.weight}/10 Severity`}
        </span>
      </div>
      <p className="text-white leading-relaxed font-normal">{item.fullText}</p>
    </div>
  );
}

export function ProsConsChart({
  optionLabel,
  optionTitle,
  isWinningOption,
  pros,
  cons,
}: ProsConsChartProps) {
  const prosData = pros.map((p, idx) => {
    // Truncate text for label if needed
    const preview = p.text.length > 22 ? `${p.text.slice(0, 20)}…` : p.text;
    return {
      id: `pro-${idx}`,
      shortLabel: p.category ? p.category : `Advantage ${idx + 1}`,
      previewLabel: preview,
      fullText: p.text,
      weight: p.weight,
      category: p.category || 'Advantage',
    };
  });

  const consData = cons.map((c, idx) => {
    const preview = c.text.length > 22 ? `${c.text.slice(0, 20)}…` : c.text;
    return {
      id: `con-${idx}`,
      shortLabel: c.category ? c.category : `Risk ${idx + 1}`,
      previewLabel: preview,
      fullText: c.text,
      weight: c.weight,
      category: c.category || 'Downside/Risk',
    };
  });

  const totalProsWeight = pros.reduce((sum, p) => sum + p.weight, 0);
  const totalConsWeight = cons.reduce((sum, c) => sum + c.weight, 0);
  const netWeight = totalProsWeight - totalConsWeight;
  const totalCombined = totalProsWeight + totalConsWeight || 1;
  const prosPercentage = Math.round((totalProsWeight / totalCombined) * 100);
  const consPercentage = 100 - prosPercentage;

  // Dynamic height based on number of items (minimum 160px)
  const prosChartHeight = Math.max(160, prosData.length * 44 + 40);
  const consChartHeight = Math.max(160, consData.length * 44 + 40);

  return (
    <div className="bg-[#11141b] border border-[#242a38] rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header & Net Spread Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242a38] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#00ff66]" />
            <h4 className="text-sm font-bold text-white">
              Side-by-Side Pros & Cons Weight Analysis
            </h4>
            {isWinningOption && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30">
                Winning Choice
              </span>
            )}
          </div>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Visualizing the strategic impact weight (1–10) evaluated by Gemini for{' '}
            <span className="text-white font-medium">{optionLabel}: {optionTitle}</span>
          </p>
        </div>

        {/* Aggregate Net Weight Pill */}
        <div className="flex items-center gap-3 bg-[#0c0e12] px-3.5 py-2 rounded-xl border border-[#282f40] shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#9ca3af] block">
              Net Strategic Spread
            </span>
            <span
              className={`text-sm font-mono font-extrabold ${
                netWeight >= 0 ? 'text-[#00ff66]' : 'text-rose-400'
              }`}
            >
              {netWeight >= 0 ? `+${netWeight} pts` : `${netWeight} pts`}
            </span>
          </div>
          <div className="h-7 w-px bg-[#242a38]" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#9ca3af] block">
              Pros vs Cons Ratio
            </span>
            <span className="text-sm font-mono font-bold text-white">
              {prosPercentage}% / {consPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Weight Distribution Meter Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#00ff66] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff66]" />
            Advantage Weight: {totalProsWeight} pts ({prosPercentage}%)
          </span>
          <span className="text-rose-400 font-semibold flex items-center gap-1.5">
            Risk & Drag Weight: {totalConsWeight} pts ({consPercentage}%)
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          </span>
        </div>
        <div className="h-2.5 w-full bg-[#0c0e12] rounded-full overflow-hidden flex border border-[#242a38]">
          <div
            className="bg-gradient-to-r from-[#00cc52] to-[#00ff66] transition-all duration-700 h-full"
            style={{ width: `${prosPercentage}%` }}
          />
          <div
            className="bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-700 h-full"
            style={{ width: `${consPercentage}%` }}
          />
        </div>
      </div>

      {/* Side-by-Side Dual Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Pros Bar Chart */}
        <div className="bg-[#151922] border border-[#242a38] rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#242a38] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#00ff66]/15 flex items-center justify-center text-[#00ff66]">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  Pros & Key Advantages
                </h5>
                <span className="text-[10px] text-[#9ca3af]">
                  Impact magnitude score (1 to 10)
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40">
              +{totalProsWeight} pts
            </span>
          </div>

          {prosData.length > 0 ? (
            <div style={{ height: prosChartHeight }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={prosData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#242a38"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    stroke="#94a3b8"
                    fontSize={11}
                    width={90}
                    tickLine={false}
                    axisLine={{ stroke: '#242a38' }}
                  />
                  <Tooltip
                    content={<CustomTooltip type="pro" />}
                    cursor={{ fill: 'rgba(0, 255, 102, 0.05)' }}
                  />
                  <Bar
                    dataKey="weight"
                    fill="#00ff66"
                    radius={[0, 6, 6, 0]}
                    barSize={18}
                  >
                    {prosData.map((entry, index) => (
                      <Cell
                        key={`cell-pro-${index}`}
                        fill="url(#proGradient)"
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="proGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#00ff66" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-[#9ca3af] py-6 text-center italic">
              No distinct advantages evaluated for this option.
            </p>
          )}

          {/* Argument Statements Breakdown */}
          <div className="space-y-2 pt-2 border-t border-[#242a38]">
            {pros.map((p, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 bg-[#0c0e12] rounded-lg border border-[#242a38] text-xs leading-relaxed"
              >
                <div className="px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30 shrink-0 mt-0.5">
                  +{p.weight}/10
                </div>
                <div className="flex-1">
                  {p.category && (
                    <span className="text-[10px] font-mono uppercase text-[#9ca3af] block mb-0.5">
                      {p.category}
                    </span>
                  )}
                  <span className="text-[#e2e8f0]">{p.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Cons Bar Chart */}
        <div className="bg-[#151922] border border-[#242a38] rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#242a38] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  Cons & Risks / Drag
                </h5>
                <span className="text-[10px] text-[#9ca3af]">
                  Severity & friction score (1 to 10)
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              -{totalConsWeight} pts
            </span>
          </div>

          {consData.length > 0 ? (
            <div style={{ height: consChartHeight }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={consData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#242a38"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    stroke="#94a3b8"
                    fontSize={11}
                    width={90}
                    tickLine={false}
                    axisLine={{ stroke: '#242a38' }}
                  />
                  <Tooltip
                    content={<CustomTooltip type="con" />}
                    cursor={{ fill: 'rgba(244, 63, 94, 0.05)' }}
                  />
                  <Bar
                    dataKey="weight"
                    fill="#f43f5e"
                    radius={[0, 6, 6, 0]}
                    barSize={18}
                  >
                    {consData.map((entry, index) => (
                      <Cell
                        key={`cell-con-${index}`}
                        fill="url(#conGradient)"
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="conGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#be123c" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-[#9ca3af] py-6 text-center italic">
              No significant downsides or risks recorded for this option.
            </p>
          )}

          {/* Argument Statements Breakdown */}
          <div className="space-y-2 pt-2 border-t border-[#242a38]">
            {cons.map((c, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 bg-[#0c0e12] rounded-lg border border-[#242a38] text-xs leading-relaxed"
              >
                <div className="px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold bg-rose-500/15 text-rose-300 border border-rose-500/30 shrink-0 mt-0.5">
                  -{c.weight}/10
                </div>
                <div className="flex-1">
                  {c.category && (
                    <span className="text-[10px] font-mono uppercase text-[#9ca3af] block mb-0.5">
                      {c.category}
                    </span>
                  )}
                  <span className="text-[#e2e8f0]">{c.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

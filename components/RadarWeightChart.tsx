'use client';

import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { EvaluatedOption, DecisionResult } from '@/lib/types';
import { getOptionArguments } from '@/lib/argumentUtils';
import {
  Radar,
  Sparkles,
  Scale,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Layers,
  Info,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface RadarWeightChartProps {
  result: DecisionResult;
  activeOptionId?: string;
  onSelectOption?: (optionId: string) => void;
}

// Color palette for options on the radar chart
const OPTION_COLORS = [
  { stroke: '#00ff66', fill: '#00ff66', name: 'Destined Path (Neon Emerald)' },
  { stroke: '#38bdf8', fill: '#38bdf8', name: 'Sky Cyan' },
  { stroke: '#c084fc', fill: '#c084fc', name: 'Violet Purple' },
  { stroke: '#fbbf24', fill: '#fbbf24', name: 'Amber Gold' },
  { stroke: '#f43f5e', fill: '#f43f5e', name: 'Rose Red' },
];

interface RadarAxis {
  key: string;
  label: string;
  shortLabel: string;
  description: string;
  getValue: (opt: EvaluatedOption) => number; // Returns 0 - 10
}

export function RadarWeightChart({
  result,
  activeOptionId,
  onSelectOption,
}: RadarWeightChartProps) {
  // Chart Modes: 'cross_options' (overlay all options) or 'pros_vs_cons' (pros vs cons for chosen option)
  const [viewMode, setViewMode] = useState<'cross_options' | 'pros_vs_cons'>('cross_options');
  const [selectedOptId, setSelectedOptId] = useState<string>(
    activeOptionId || result.verdict.chosenOptionId
  );
  const [visibleOptions, setVisibleOptions] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    result.optionsEvaluation.forEach((opt) => {
      init[opt.optionId] = true;
    });
    return init;
  });

  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    axisLabel: string;
    optionLabel: string;
    value: number;
    description: string;
    seriesType?: 'pro' | 'con' | 'option';
  } | null>(null);

  // Pre-calculate pros & cons statistics for each option
  const optionsStats = useMemo(() => {
    return result.optionsEvaluation.map((opt) => {
      const args = getOptionArguments(opt);
      const totalProsWeight = args.pros.reduce((sum, p) => sum + p.weight, 0);
      const avgProsWeight = args.pros.length > 0 ? totalProsWeight / args.pros.length : 5;
      const totalConsWeight = args.cons.reduce((sum, c) => sum + c.weight, 0);
      const avgConsWeight = args.cons.length > 0 ? totalConsWeight / args.cons.length : 5;

      // Risk Shield: 10 - severity of cons (higher is safer/less risk)
      const riskShield = Math.max(0, Math.min(10, 10 - avgConsWeight));

      // Net strategic advantage normalized on 0-10 scale
      const netSpread = avgProsWeight - avgConsWeight;
      const netStrategicMomentum = Math.max(0, Math.min(10, 5 + netSpread / 2));

      return {
        option: opt,
        args,
        totalProsWeight,
        avgProsWeight: Number(avgProsWeight.toFixed(1)),
        totalConsWeight,
        avgConsWeight: Number(avgConsWeight.toFixed(1)),
        riskShield: Number(riskShield.toFixed(1)),
        netStrategicMomentum: Number(netStrategicMomentum.toFixed(1)),
      };
    });
  }, [result.optionsEvaluation]);

  // Define Cross-Option Radar Axes (6 balanced analytical spokes)
  const crossOptionAxes: RadarAxis[] = useMemo(
    () => [
      {
        key: 'prosWeight',
        label: 'Pros Impact Weight',
        shortLabel: 'Pros Impact',
        description: 'Average magnitude weight of evaluated advantages (1-10)',
        getValue: (opt) => {
          const stats = optionsStats.find((s) => s.option.optionId === opt.optionId);
          return stats ? stats.avgProsWeight : 5;
        },
      },
      {
        key: 'feasibility',
        label: 'Execution Feasibility',
        shortLabel: 'Feasibility',
        description: 'Practicality, realistic timeline, and operational friction',
        getValue: (opt) => opt.scores.feasibility,
      },
      {
        key: 'upside',
        label: 'Strategic Upside',
        shortLabel: 'Upside',
        description: 'Peak opportunity, growth potential, and breakthrough upside',
        getValue: (opt) => opt.scores.upside,
      },
      {
        key: 'longTermAlignment',
        label: 'Long-Term Alignment',
        shortLabel: 'Alignment',
        description: 'Congruence with ultimate vision and future peace of mind',
        getValue: (opt) => opt.scores.longTermAlignment,
      },
      {
        key: 'riskShield',
        label: 'Risk Shield / Safety',
        shortLabel: 'Risk Shield',
        description: 'Resilience against downside friction (10 minus cons severity)',
        getValue: (opt) => {
          const stats = optionsStats.find((s) => s.option.optionId === opt.optionId);
          return stats ? stats.riskShield : opt.scores.riskSafety;
        },
      },
      {
        key: 'netMomentum',
        label: 'Net Strategic Advantage',
        shortLabel: 'Net Momentum',
        description: 'Overall strategic spread: pros weight vs cons resistance',
        getValue: (opt) => {
          const stats = optionsStats.find((s) => s.option.optionId === opt.optionId);
          return stats ? stats.netStrategicMomentum : 5;
        },
      },
    ],
    [optionsStats]
  );

  // Define Pros vs Cons Deep-Dive Axes for a single option
  const prosConsAxes = useMemo(
    () => [
      {
        key: 'feasibility_dim',
        label: 'Feasibility & Pragmatism',
        shortLabel: 'Feasibility',
        proLabel: 'Execution Ease',
        conLabel: 'Execution Friction',
      },
      {
        key: 'upside_dim',
        label: 'Upside vs Downside Exposure',
        shortLabel: 'Upside / Exposure',
        proLabel: 'Upside Gain',
        conLabel: 'Downside Exposure',
      },
      {
        key: 'safety_dim',
        label: 'Stability vs Risk Volatility',
        shortLabel: 'Stability / Risk',
        proLabel: 'Safety Anchor',
        conLabel: 'Risk Vulnerability',
      },
      {
        key: 'alignment_dim',
        label: 'Long-Term Peace of Mind',
        shortLabel: 'Long-Term Fit',
        proLabel: 'Value Alignment',
        conLabel: 'Regret / Drag',
      },
      {
        key: 'weight_volume',
        label: 'Total Argument Weight',
        shortLabel: 'Impact Weight',
        proLabel: 'Total Pros Weight',
        conLabel: 'Total Cons Weight',
      },
      {
        key: 'conviction_dim',
        label: 'Strategic Dominance',
        shortLabel: 'Dominance',
        proLabel: 'Decisive Edge',
        conLabel: 'Resistance Factor',
      },
    ],
    []
  );

  // SVG dimensions & D3 radial geometry setup
  const width = 480;
  const height = 440;
  const centerX = width / 2;
  const centerY = height / 2 - 10;
  const radius = 150;
  const levels = [2, 4, 6, 8, 10]; // Concentric tick circles

  // D3 linear scale: 0 to 10 mapped to [0, radius]
  const radialScale = useMemo(() => {
    return d3.scaleLinear().domain([0, 10]).range([0, radius]);
  }, [radius]);

  // Active option data for Pros vs Cons mode
  const currentOpt = useMemo(() => {
    return (
      result.optionsEvaluation.find((o) => o.optionId === selectedOptId) ||
      result.optionsEvaluation[0]
    );
  }, [result.optionsEvaluation, selectedOptId]);

  const currentOptStats = useMemo(() => {
    return optionsStats.find((s) => s.option.optionId === currentOpt.optionId);
  }, [optionsStats, currentOpt]);

  // Compute coordinates helper
  const getCoordinates = (index: number, totalAxes: number, value: number) => {
    const angle = (Math.PI * 2 * index) / totalAxes - Math.PI / 2;
    const r = radialScale(Math.max(0, Math.min(10, value)));
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
      angle,
    };
  };

  // Generate SVG polygon points string from an array of values
  const getPolygonPoints = (values: number[]) => {
    const totalAxes = values.length;
    return values
      .map((val, i) => {
        const { x, y } = getCoordinates(i, totalAxes, val);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  // Helper to toggle visibility of an option
  const toggleOption = (id: string) => {
    setVisibleOptions((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      // Keep at least one option visible
      const anyVisible = Object.values(next).some((v) => v);
      return anyVisible ? next : prev;
    });
  };

  return (
    <div className="bg-[#11141b] border border-[#242a38] rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff66]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242a38] pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00ff66]/15 flex items-center justify-center text-[#00ff66] border border-[#00ff66]/30">
              <Radar className="w-4 h-4 animate-spin-slow" />
            </div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              D3 Radar Weight Spectrum
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00ff66]/15 text-[#00ff66] border border-[#00ff66]/30">
                AI Dimension Engine
              </span>
            </h4>
          </div>
          <p className="text-xs text-[#9ca3af] mt-1">
            Multidimensional radar mapping the pros and cons weightings provided by Gemini across each alternative.
          </p>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center bg-[#0c0e12] p-1 rounded-xl border border-[#242a38] shrink-0">
          <button
            onClick={() => setViewMode('cross_options')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'cross_options'
                ? 'bg-[#1e2432] text-white border border-[#00ff66]/40 shadow-xs'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>Cross-Option Overlay</span>
          </button>
          <button
            onClick={() => setViewMode('pros_vs_cons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'pros_vs_cons'
                ? 'bg-[#1e2432] text-white border border-[#00ff66]/40 shadow-xs'
                : 'text-[#9ca3af] hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Pros vs Cons Profile</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Option Selector if in 'pros_vs_cons' mode, or Option Toggle Pills in 'cross_options' */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c0e12] p-3 rounded-xl border border-[#242a38] relative z-10">
        {viewMode === 'cross_options' ? (
          <>
            <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
              <Sliders className="w-3.5 h-3.5 text-[#00ff66]" />
              <span className="font-mono text-[11px] uppercase tracking-wider">
                Compare Series:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {result.optionsEvaluation.map((opt, idx) => {
                const color = OPTION_COLORS[idx % OPTION_COLORS.length];
                const isWinner = opt.optionId === result.verdict.chosenOptionId;
                const isVisible = visibleOptions[opt.optionId] !== false;

                return (
                  <button
                    key={opt.optionId}
                    onClick={() => toggleOption(opt.optionId)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isVisible
                        ? 'bg-[#151922] text-white'
                        : 'bg-transparent text-[#64748b] border-dashed border-[#242a38] opacity-50'
                    }`}
                    style={{
                      borderColor: isVisible ? color.stroke : '#242a38',
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: isVisible ? color.stroke : '#64748b',
                        boxShadow: isVisible ? `0 0 8px ${color.stroke}` : 'none',
                      }}
                    />
                    <span>{opt.optionLabel}</span>
                    {isWinner && (
                      <span className="text-[9px] font-mono font-bold px-1 bg-[#00ff66]/20 text-[#00ff66] rounded">
                        Winner
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
              <Scale className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="font-mono text-[11px] uppercase tracking-wider">
                Examine Option:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {result.optionsEvaluation.map((opt, idx) => {
                const isSelected = opt.optionId === selectedOptId;
                const isWinner = opt.optionId === result.verdict.chosenOptionId;

                return (
                  <button
                    key={opt.optionId}
                    onClick={() => {
                      setSelectedOptId(opt.optionId);
                      if (onSelectOption) onSelectOption(opt.optionId);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1e2432] text-white border-[#00ff66] shadow-xs shadow-[#00ff66]/20'
                        : 'bg-[#151922] text-[#9ca3af] border-[#242a38] hover:text-white'
                    }`}
                  >
                    <span>{opt.optionLabel}</span>
                    {isWinner && (
                      <span className="text-[9px] font-mono font-bold px-1 bg-[#00ff66] text-black rounded">
                        Winner
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Main D3 Radar Chart Container */}
      <div className="relative flex flex-col items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[480px] h-auto overflow-visible select-none"
        >
          <defs>
            {/* Glow filters for vibrant neon series strokes */}
            <filter id="radarEmeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00ff66" floodOpacity="0.6" />
            </filter>
            <filter id="radarCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#38bdf8" floodOpacity="0.5" />
            </filter>
            <filter id="radarRoseGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.6" />
            </filter>

            {/* Radial Gradient for central web backdrop */}
            <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ff66" stopOpacity="0.08" />
              <stop offset="65%" stopColor="#0b0e14" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#0b0e14" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central subtle ambient glow */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="url(#radarCenterGlow)"
          />

          {/* Concentric Web Grid Polygons (levels 2, 4, 6, 8, 10) */}
          {levels.map((level) => {
            const currentAxes = viewMode === 'cross_options' ? crossOptionAxes : prosConsAxes;
            const points = getPolygonPoints(currentAxes.map(() => level));

            return (
              <g key={`level-${level}`}>
                <polygon
                  points={points}
                  fill="none"
                  stroke={level === 10 ? '#2e384d' : '#1f2635'}
                  strokeWidth={level === 10 ? 1.5 : 1}
                  strokeDasharray={level === 10 ? 'none' : '2,3'}
                />
                {/* Level Value Tick Label */}
                <text
                  x={centerX + 6}
                  y={centerY - radialScale(level) + 4}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {level === 10 ? '10 (Max)' : level}
                </text>
              </g>
            );
          })}

          {/* Radial Spokes (Lines from center to vertices) */}
          {(() => {
            const currentAxes = viewMode === 'cross_options' ? crossOptionAxes : prosConsAxes;
            const numAxes = currentAxes.length;

            return currentAxes.map((axis, i) => {
              const { x, y, angle } = getCoordinates(i, numAxes, 10);
              // Label position pushed slightly outside radius
              const labelDistance = radius + 26;
              const lx = centerX + labelDistance * Math.cos(angle);
              const ly = centerY + labelDistance * Math.sin(angle);

              // Text anchor calculation based on angle
              let textAnchor: 'start' | 'middle' | 'end' = 'middle';
              if (Math.cos(angle) > 0.3) textAnchor = 'start';
              else if (Math.cos(angle) < -0.3) textAnchor = 'end';

              return (
                <g key={`axis-spoke-${i}`}>
                  {/* Spoke Line */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="#242d3d"
                    strokeWidth="1.2"
                  />

                  {/* Outer Axis Indicator Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill="#3b4252"
                  />

                  {/* Axis Label */}
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={textAnchor}
                    fill="#cbd5e1"
                    fontSize="11"
                    fontWeight="600"
                    className="cursor-pointer hover:fill-[#00ff66] transition-colors"
                  >
                    {axis.shortLabel}
                  </text>
                </g>
              );
            });
          })()}

          {/* MODE 1: CROSS-OPTION OVERLAY POLYGONS */}
          {viewMode === 'cross_options' && (
            <>
              {result.optionsEvaluation.map((opt, optIdx) => {
                if (visibleOptions[opt.optionId] === false) return null;

                const color = OPTION_COLORS[optIdx % OPTION_COLORS.length];
                const isWinner = opt.optionId === result.verdict.chosenOptionId;
                const values = crossOptionAxes.map((axis) => axis.getValue(opt));
                const points = getPolygonPoints(values);

                return (
                  <g key={`option-radar-${opt.optionId}`} className="transition-all duration-300">
                    {/* Filled Area */}
                    <polygon
                      points={points}
                      fill={color.fill}
                      fillOpacity={isWinner ? 0.28 : 0.16}
                      stroke={color.stroke}
                      strokeWidth={isWinner ? 2.5 : 1.8}
                      filter={isWinner ? 'url(#radarEmeraldGlow)' : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Vertex Data Markers */}
                    {crossOptionAxes.map((axis, axisIdx) => {
                      const val = axis.getValue(opt);
                      const { x, y } = getCoordinates(axisIdx, crossOptionAxes.length, val);

                      return (
                        <circle
                          key={`vertex-${opt.optionId}-${axisIdx}`}
                          cx={x}
                          cy={y}
                          r={isWinner ? 4.5 : 3.5}
                          fill="#0c0e12"
                          stroke={color.stroke}
                          strokeWidth={2}
                          className="cursor-pointer hover:scale-150 transition-transform"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredPoint({
                              x: rect.x + rect.width / 2,
                              y: rect.y - 10,
                              axisLabel: axis.label,
                              optionLabel: `${opt.optionLabel}: ${opt.optionTitle}`,
                              value: val,
                              description: axis.description,
                              seriesType: 'option',
                            });
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </>
          )}

          {/* MODE 2: PROS VS CONS PROFILE FOR SELECTED OPTION */}
          {viewMode === 'pros_vs_cons' && currentOpt && (
            <>
              {(() => {
                const stats = currentOptStats;
                // Generate balanced 6-dimensional metrics for Pros Profile vs Cons Profile
                // Pros values (0-10)
                const prosValues = [
                  currentOpt.scores.feasibility, // Feasibility
                  currentOpt.scores.upside, // Strategic Upside
                  currentOpt.scores.riskSafety, // Safety
                  currentOpt.scores.longTermAlignment, // Alignment
                  stats ? Math.min(10, Math.max(1, stats.avgProsWeight)) : 7, // Impact Weight
                  stats && stats.avgProsWeight >= stats.avgConsWeight ? 9 : 6, // Dominance
                ];

                // Cons values (0-10) - magnitude of downside/drag
                const consValues = [
                  10 - currentOpt.scores.feasibility, // Execution Friction
                  10 - currentOpt.scores.upside, // Missed Opportunity
                  10 - currentOpt.scores.riskSafety, // Risk Vulnerability
                  10 - currentOpt.scores.longTermAlignment, // Regret / Drag
                  stats ? Math.min(10, Math.max(1, stats.avgConsWeight)) : 5, // Cons Weight
                  stats && stats.avgConsWeight > stats.avgProsWeight ? 8 : 4, // Resistance Factor
                ];

                const prosPoints = getPolygonPoints(prosValues);
                const consPoints = getPolygonPoints(consValues);

                return (
                  <g>
                    {/* Cons Polygon (Rose) */}
                    <polygon
                      points={consPoints}
                      fill="#f43f5e"
                      fillOpacity={0.24}
                      stroke="#f43f5e"
                      strokeWidth={2.2}
                      filter="url(#radarRoseGlow)"
                    />

                    {/* Pros Polygon (Emerald) */}
                    <polygon
                      points={prosPoints}
                      fill="#00ff66"
                      fillOpacity={0.28}
                      stroke="#00ff66"
                      strokeWidth={2.5}
                      filter="url(#radarEmeraldGlow)"
                    />

                    {/* Pros Vertex Dots */}
                    {prosValues.map((val, idx) => {
                      const { x, y } = getCoordinates(idx, prosConsAxes.length, val);
                      const axis = prosConsAxes[idx];

                      return (
                        <circle
                          key={`pros-dot-${idx}`}
                          cx={x}
                          cy={y}
                          r={4.5}
                          fill="#0c0e12"
                          stroke="#00ff66"
                          strokeWidth={2}
                          className="cursor-pointer hover:scale-150 transition-transform"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredPoint({
                              x: rect.x + rect.width / 2,
                              y: rect.y - 10,
                              axisLabel: axis.proLabel,
                              optionLabel: `${currentOpt.optionLabel} Advantage`,
                              value: val,
                              description: `Advantage impact strength: ${val}/10`,
                              seriesType: 'pro',
                            });
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}

                    {/* Cons Vertex Dots */}
                    {consValues.map((val, idx) => {
                      const { x, y } = getCoordinates(idx, prosConsAxes.length, val);
                      const axis = prosConsAxes[idx];

                      return (
                        <circle
                          key={`cons-dot-${idx}`}
                          cx={x}
                          cy={y}
                          r={4.5}
                          fill="#0c0e12"
                          stroke="#f43f5e"
                          strokeWidth={2}
                          className="cursor-pointer hover:scale-150 transition-transform"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredPoint({
                              x: rect.x + rect.width / 2,
                              y: rect.y - 10,
                              axisLabel: axis.conLabel,
                              optionLabel: `${currentOpt.optionLabel} Risk / Friction`,
                              value: val,
                              description: `Downside severity & resistance: ${val}/10`,
                              seriesType: 'con',
                            });
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    })}
                  </g>
                );
              })()}
            </>
          )}

          {/* Center Origin Dot */}
          <circle cx={centerX} cy={centerY} r={3} fill="#00ff66" />
        </svg>

        {/* Floating Tooltip when vertex hovered */}
        {hoveredPoint && (
          <div
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-[#0c0e12] border border-[#2e374d] rounded-xl p-3 shadow-2xl text-xs space-y-1 max-w-xs"
            style={{ left: hoveredPoint.x, top: hoveredPoint.y }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#242a38] pb-1">
              <span className="font-bold text-white text-[11px]">
                {hoveredPoint.axisLabel}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                  hoveredPoint.seriesType === 'con'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40'
                }`}
              >
                {hoveredPoint.value}/10
              </span>
            </div>
            <div className="text-[10px] text-[#9ca3af] font-mono">
              {hoveredPoint.optionLabel}
            </div>
            <p className="text-[11px] text-[#cbd5e1] leading-snug">
              {hoveredPoint.description}
            </p>
          </div>
        )}
      </div>

      {/* Footer Insight Legend & Strategic Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#242a38]">
        {/* Metric 1 */}
        <div className="bg-[#0c0e12] border border-[#242a38] rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#9ca3af]">
            <TrendingUp className="w-3 h-3 text-[#00ff66]" />
            <span>Highest Pros Impact</span>
          </div>
          {(() => {
            const topProsOpt = [...optionsStats].sort(
              (a, b) => b.avgProsWeight - a.avgProsWeight
            )[0];
            return (
              <div className="text-xs font-bold text-white">
                {topProsOpt.option.optionLabel} ({topProsOpt.avgProsWeight}/10)
                <span className="text-[10px] text-[#64748b] block font-normal truncate">
                  {topProsOpt.option.optionTitle}
                </span>
              </div>
            );
          })()}
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0c0e12] border border-[#242a38] rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#9ca3af]">
            <ShieldCheck className="w-3 h-3 text-[#38bdf8]" />
            <span>Strongest Risk Shield</span>
          </div>
          {(() => {
            const safestOpt = [...optionsStats].sort(
              (a, b) => b.riskShield - a.riskShield
            )[0];
            return (
              <div className="text-xs font-bold text-white">
                {safestOpt.option.optionLabel} ({safestOpt.riskShield}/10)
                <span className="text-[10px] text-[#64748b] block font-normal truncate">
                  Lowest AI friction penalty
                </span>
              </div>
            );
          })()}
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0c0e12] border border-[#242a38] rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#9ca3af]">
            <Sparkles className="w-3 h-3 text-[#00ff66]" />
            <span>Destined Recommendation</span>
          </div>
          <div className="text-xs font-bold text-[#00ff66]">
            {result.verdict.chosenOptionLabel} ({result.verdict.confidenceScore}%)
            <span className="text-[10px] text-[#64748b] block font-normal truncate">
              {result.verdict.chosenOptionTitle}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

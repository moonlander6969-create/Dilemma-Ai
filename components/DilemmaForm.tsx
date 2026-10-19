'use client';

import React, { useState } from 'react';
import {
  DecisionOption,
  RiskTolerance,
  TimeHorizon,
  DecisionFramework,
  DecisionRequest,
} from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { DilemnaLogo } from './DilemnaLogo';
import {
  Plus,
  Trash2,
  Sparkles,
  Sliders,
  Coins,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Layers,
  ArrowRight,
  Shield,
  Hourglass,
  Scale,
} from 'lucide-react';

interface DilemmaFormProps {
  onSubmit: (data: DecisionRequest) => void;
  isLoading: boolean;
  initialValues?: Partial<DecisionRequest>;
  onOpenCoinFlip: (optionA?: string, optionB?: string) => void;
  onOpenDisclaimer?: () => void;
}

const OPTION_ACCENTS = [
  { border: 'border-[#00ff66]', badge: 'bg-[#00ff66]/15 text-[#00ff66] border-[#00ff66]/40' },
  { border: 'border-white/80', badge: 'bg-white/10 text-white border-white/30' },
  { border: 'border-[#38bdf8]', badge: 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/40' },
  { border: 'border-[#a3e635]', badge: 'bg-[#a3e635]/15 text-[#a3e635] border-[#a3e635]/40' },
  { border: 'border-[#f43f5e]', badge: 'bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/40' },
  { border: 'border-[#e2e8f0]', badge: 'bg-[#e2e8f0]/15 text-[#e2e8f0] border-[#e2e8f0]/40' },
];

export function DilemmaForm({
  onSubmit,
  isLoading,
  initialValues,
  onOpenCoinFlip,
  onOpenDisclaimer,
}: DilemmaFormProps) {
  const { theme } = useTheme();

  const [situation, setSituation] = useState(
    initialValues?.situation || ''
  );

  const [options, setOptions] = useState<DecisionOption[]>(
    initialValues?.options && initialValues.options.length >= 2
      ? initialValues.options
      : [
          {
            id: 'opt_a',
            label: 'Option A',
            title: '',
            description: '',
            pros: [],
            cons: [],
          },
          {
            id: 'opt_b',
            label: 'Option B',
            title: '',
            description: '',
            pros: [],
            cons: [],
          },
        ]
  );

  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(
    initialValues?.riskTolerance || 'balanced'
  );
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>(
    initialValues?.timeHorizon || 'medium_term'
  );
  const [framework, setFramework] = useState<DecisionFramework>(
    initialValues?.framework || 'comprehensive'
  );

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Option actions
  const getNextOptionLabel = (index: number) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (index < letters.length) {
      return `Option ${letters[index]}`;
    }
    return `Option ${index + 1}`;
  };

  const addOption = () => {
    const nextIndex = options.length;
    const label = getNextOptionLabel(nextIndex);
    const newOption: DecisionOption = {
      id: `opt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
      label,
      title: '',
      description: '',
      pros: [],
      cons: [],
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      setErrorMsg('A decision requires at least 2 options (Choice A and Choice B).');
      return;
    }
    const filtered = options.filter((_, i) => i !== index);
    const relabeled = filtered.map((opt, i) => ({
      ...opt,
      label: getNextOptionLabel(i),
    }));
    setOptions(relabeled);
  };

  const updateOption = (index: number, field: keyof DecisionOption, value: any) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!situation.trim()) {
      setErrorMsg('Please describe the situation or dilemma you are facing.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (options.length < 2) {
      setErrorMsg('You must provide at least 2 options.');
      return;
    }

    const invalidOption = options.find((opt) => !opt.title.trim() && !opt.description.trim());
    if (invalidOption) {
      setErrorMsg(`Please provide a title or description for ${invalidOption.label}.`);
      return;
    }

    onSubmit({
      situation: situation.trim(),
      options: options.map((opt) => ({
        ...opt,
        title: opt.title.trim() || opt.label,
        description: opt.description.trim(),
      })),
      riskTolerance,
      timeHorizon,
      framework,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Hero Intro Banner with Official Dilemna AI Gold Crossroads Emblem */}
      <div className="bg-gradient-to-br from-[#161a23] via-[#11141b] to-[#0c1611] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle Gold & Emerald Ambient Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <DilemnaLogo
            variant="emblem"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-2xl shadow-black/80 ring-1 ring-[#D4AF37]/30 shrink-0"
          />

          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#F3CA52]">
              <Sparkles className="w-3.5 h-3.5 text-[#F3CA52]" />
              <span>Destined Clarity &amp; Crossroads Guidance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white leading-tight">
              Torn between paths? Let fate and clarity illuminate your choice.
            </h1>
            <p className="text-[#cbd5e1] text-sm sm:text-base leading-relaxed">
              When you stand at life&apos;s crossroads, take comfort in knowing that clarity is within reach. Share your dilemma and the options before you — let fate, intuition, and heartfelt perspective reveal the journey you were destined to take.
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
        </div>
      )}

      {/* 1. Situation Section in Grey, White, Neon Green */}
      <div className="bg-[#151922] border border-[#242a38] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="situation" className="block text-sm font-semibold text-white">
            1. The Situation & Dilemma Context
          </label>
          <span className="text-xs font-mono text-[#9ca3af]">
            {situation.length} characters
          </span>
        </div>
        <p className="text-xs text-[#cbd5e1]">
          Describe the background, stakes, time pressure, emotional or financial constraints, and what makes this decision so challenging.
        </p>
        <textarea
          id="situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={4}
          placeholder="e.g. I have been at my current company for 4 years making $140k. I love my team and work 35 hrs/wk, but I was just offered a Director role at an exciting venture-backed startup for $195k + equity, but with high stress and 55-hour weeks..."
          className="w-full px-4 py-3 text-sm rounded-xl transition-all leading-relaxed bg-[#0c0e12] border border-[#282f3f] text-white placeholder-[#64748b] focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66]/30 focus:outline-none"
          required
        />
      </div>

      {/* 2. Options Grid (Infinite options support) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">
              2. Competing Options (Choice A vs Choice B & more)
            </h2>
            <p className="text-xs mt-0.5 text-[#9ca3af]">
              Input at least 2 choices. Add as many alternative options as you want.
            </p>
          </div>
          <button
            type="button"
            onClick={addOption}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#2e374d] bg-[#1a1f2c] hover:bg-[#242b3d] text-white hover:border-[#00ff66]/50 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#00ff66]" />
            Add Another Option
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, idx) => {
            const accent = OPTION_ACCENTS[idx % OPTION_ACCENTS.length];
            return (
              <div
                key={opt.id}
                className={`bg-[#151922] border-2 ${accent.border} rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 transition-all relative group`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-bold font-mono rounded-md border ${accent.badge}`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-xs font-medium text-[#9ca3af]">
                      Choice #{idx + 1}
                    </span>
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="text-[#64748b] hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer"
                      title="Remove Option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-white">
                    Option Title / Name
                  </label>
                  <input
                    type="text"
                    value={opt.title}
                    onChange={(e) => updateOption(idx, 'title', e.target.value)}
                    placeholder={
                      idx === 0
                        ? 'e.g. Join Series A Startup'
                        : idx === 1
                        ? 'e.g. Stay at Current Job & Seek Promotion'
                        : `e.g. Alternative Path ${idx + 1}`
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border font-medium bg-[#0c0e12] border-[#282f3f] text-white placeholder-[#64748b] focus:border-[#00ff66] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#cbd5e1]">
                    Description & Key Terms
                  </label>
                  <textarea
                    value={opt.description}
                    onChange={(e) => updateOption(idx, 'description', e.target.value)}
                    rows={3}
                    placeholder="Provide specifics: salary, commute, role autonomy, financial cost, lifestyle implications..."
                    className="w-full px-3 py-2 text-xs rounded-lg border leading-relaxed bg-[#0c0e12] border-[#282f3f] text-white placeholder-[#64748b] focus:border-[#00ff66] focus:outline-none"
                  />
                </div>

                {/* Pros & Cons Quick Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#242a38] text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-[#00ff66] block mb-1">
                      Key Advantage / Pro
                    </span>
                    <input
                      type="text"
                      value={opt.pros?.[0] || ''}
                      onChange={(e) => {
                        const newPros = [...(opt.pros || [])];
                        newPros[0] = e.target.value;
                        updateOption(idx, 'pros', newPros.filter(Boolean));
                      }}
                      placeholder="e.g. Higher equity upside"
                      className="w-full px-2.5 py-1.5 text-xs rounded-md border bg-[#0c0e12] border-[#282f3f] text-white placeholder-[#64748b] focus:border-[#00ff66] focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-rose-400 block mb-1">
                      Main Risk / Con
                    </span>
                    <input
                      type="text"
                      value={opt.cons?.[0] || ''}
                      onChange={(e) => {
                        const newCons = [...(opt.cons || [])];
                        newCons[0] = e.target.value;
                        updateOption(idx, 'cons', newCons.filter(Boolean));
                      }}
                      placeholder="e.g. High burn & long hours"
                      className="w-full px-2.5 py-1.5 text-xs rounded-md border bg-[#0c0e12] border-[#282f3f] text-white placeholder-[#64748b] focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add option bar & subtle coin gut-check */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={addOption}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-[#2e374d] bg-[#141822] hover:bg-[#1a202d] text-white hover:border-[#00ff66]/50 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#00ff66]" />
            Add Option {getNextOptionLabel(options.length).replace('Option ', '')}
          </button>

          <button
            type="button"
            onClick={() =>
              onOpenCoinFlip(
                options[0]?.title || undefined,
                options[1]?.title || undefined
              )
            }
            className="inline-flex items-center gap-1.5 text-xs text-[#9ca3af] hover:text-[#00ff66] transition-colors cursor-pointer px-2 py-1"
          >
            <Coins className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>50/50 Subconscious Coin Toss</span>
          </button>
        </div>
      </div>

      {/* 3. Advanced Strategy & Decision Calibration */}
      <div className="bg-[#151922] border border-[#242a38] rounded-2xl overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#1a1f2b] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#00ff66]" />
            <div>
              <span className="text-sm font-semibold block text-white">
                Decision Calibration & Strategic Lens (Optional)
              </span>
              <span className="text-xs block text-[#9ca3af]">
                Fine-tune risk tolerance, time horizon, and philosophical analytical model
              </span>
            </div>
          </div>
          <div className="text-[#9ca3af] p-1">
            {showAdvanced ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
          </div>
        </button>

        {showAdvanced && (
          <div className="p-5 pt-2 border-t border-[#242a38] space-y-6">
            {/* Risk Tolerance & Horizon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Risk Tolerance */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold flex items-center gap-1.5 text-white">
                  <Shield className="w-3.5 h-3.5 text-[#00ff66]" />
                  Risk Tolerance
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl border bg-[#0c0e12] border-[#242a38]">
                  {(['conservative', 'balanced', 'aggressive'] as RiskTolerance[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setRiskTolerance(mode)}
                      className={`py-1.5 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                        riskTolerance === mode
                          ? 'bg-[#00ff66] text-black shadow-sm'
                          : 'text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#9ca3af]">
                  {riskTolerance === 'conservative'
                    ? 'Prioritizes safety, minimal downside, and stress reduction.'
                    : riskTolerance === 'aggressive'
                    ? 'Prioritizes asymmetric upside, ambitious growth, and bold bets.'
                    : 'Weighs upside potential evenly against realistic failure modes.'}
                </p>
              </div>

              {/* Time Horizon */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold flex items-center gap-1.5 text-white">
                  <Hourglass className="w-3.5 h-3.5 text-[#00ff66]" />
                  Time Horizon Focus
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl border bg-[#0c0e12] border-[#242a38]">
                  {[
                    { key: 'short_term', label: '< 6 Mos' },
                    { key: 'medium_term', label: '1 - 3 Yrs' },
                    { key: 'long_term', label: '5+ Years' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTimeHorizon(item.key as TimeHorizon)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        timeHorizon === item.key
                          ? 'bg-[#00ff66] text-black shadow-sm'
                          : 'text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#9ca3af]">
                  Defines whether immediate gratification or multi-year compounding governs the verdict.
                </p>
              </div>

              {/* Decision Framework */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold flex items-center gap-1.5 text-white">
                  <Layers className="w-3.5 h-3.5 text-[#00ff66]" />
                  Analytical Lens
                </label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value as DecisionFramework)}
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-[#0c0e12] border-[#242a38] text-white focus:border-[#00ff66] focus:outline-none"
                >
                  <option value="comprehensive">Comprehensive Multi-Vector</option>
                  <option value="regret_minimization">Regret Minimization (Bezos)</option>
                  <option value="matrix">Comprehensive Trade-Off Matrix</option>
                  <option value="devils_advocate">Adversarial Devil&apos;s Advocate</option>
                  <option value="ten_ten_ten">10/10/10 Rule (10 min / 10 mo / 10 yr)</option>
                </select>
                <p className="text-[11px] text-[#9ca3af]">
                  Selects the philosophical reasoning framework applied to reveal your decision.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submission CTA in Radiant Neon Green */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 text-base font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer bg-[#00ff66] hover:bg-[#24ff7b] text-black shadow-[#00ff66]/25 hover:shadow-2xl hover:shadow-[#00ff66]/35"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              <span>Weighing Your Paths & Consulting Fate...</span>
            </>
          ) : (
            <>
              <Scale className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
              <span>Reveal Your Destined Path</span>
              <ArrowRight className="w-4 h-4 ml-1 text-black/80 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
        <div className="text-center text-xs mt-2.5 space-y-1 text-[#9ca3af]">
          <p>
            Dilemna Ai weighs each path with wisdom, clarity, and peace of mind to guide you forward.
          </p>
          <p className="text-[11px] text-[#64748b]">
            Decisions are made solely at your own discretion and risk.{' '}
            {onOpenDisclaimer ? (
              <button
                type="button"
                onClick={onOpenDisclaimer}
                className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                Decision Disclaimer
              </button>
            ) : (
              <a
                href="/disclaimer"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 underline font-medium"
              >
                Decision Disclaimer
              </a>
            )}
          </p>
        </div>
      </div>
    </form>
  );
}

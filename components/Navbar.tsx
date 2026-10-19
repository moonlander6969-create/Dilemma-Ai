'use client';

import React from 'react';
import { History, PlusCircle, Palette, Coins, ShieldAlert } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { DilemnaLogo } from './DilemnaLogo';

interface NavbarProps {
  onNewDecision: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onOpenCoinFlip: () => void;
  onOpenTheme: () => void;
  onOpenDisclaimer?: () => void;
}

export function Navbar({
  onNewDecision,
  onOpenHistory,
  historyCount,
  onOpenCoinFlip,
  onOpenTheme,
  onOpenDisclaimer,
}: NavbarProps) {
  const { theme } = useTheme();

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${theme.colors.headerBg} ${theme.colors.headerBorder}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNewDecision}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            title="Start New Dilemma"
          >
            <DilemnaLogo
              variant="emblem"
              className="w-11 h-11 rounded-xl shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-bold tracking-tight text-base sm:text-lg block leading-tight text-white group-hover:text-[#F3CA52] transition-colors whitespace-nowrap">
                Dilemna Ai
              </span>
              <span className="text-[11px] tracking-wide text-[#9ca3af] block whitespace-nowrap">
                Fate, Clarity &amp; Crossroads Guidance
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subtle Coin Flip Gut-Check Button */}
          <button
            onClick={onOpenCoinFlip}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#262c3b] bg-[#141822] hover:bg-[#1a202d] text-[#cbd5e1] hover:text-white transition-colors cursor-pointer"
            title="Subconscious Coin Flip"
          >
            <Coins className="w-3.5 h-3.5 text-[#00ff66]" />
            <span className="hidden sm:inline">Coin Toss</span>
          </button>

          {/* Theme Palette Switcher */}
          <button
            onClick={onOpenTheme}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#262c3b] bg-[#141822] hover:bg-[#1a202d] text-white hover:border-[#00ff66]/50 transition-colors cursor-pointer"
            title="Switch Theme"
          >
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] shadow-xs shadow-[#00ff66]" />
              <Palette className="w-3.5 h-3.5 text-[#9ca3af]" />
            </div>
            <span className="hidden md:inline text-xs text-[#d1d5db]">Theme</span>
          </button>

          {/* Decision Responsibility Disclaimer Button */}
          {onOpenDisclaimer && (
            <button
              onClick={onOpenDisclaimer}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#262c3b] bg-[#141822] hover:bg-[#1a202d] text-[#cbd5e1] hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer"
              title="Decision Responsibility Disclaimer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline text-xs">Disclaimer</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#262c3b] bg-[#141822] hover:bg-[#1a202d] text-[#d1d5db] hover:text-white transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span>Saved</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#00ff66] text-[#090b0e] text-[10px] font-bold rounded-full">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onNewDecision}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-md bg-[#00ff66] text-black hover:bg-[#22ff77] hover:shadow-[#00ff66]/30 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-black" />
            <span>New Dilemma</span>
          </button>
        </div>
      </div>
    </header>
  );
}

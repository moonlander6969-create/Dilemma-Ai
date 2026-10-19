'use client';

import React, { useState } from 'react';
import { X, Coins, RotateCw, Sparkles } from 'lucide-react';

interface CoinFlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  optionA?: string;
  optionB?: string;
}

export function CoinFlipModal({
  isOpen,
  onClose,
  optionA = 'Option A',
  optionB = 'Option B',
}: CoinFlipModalProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'A' | 'B' | null>(null);

  if (!isOpen) return null;

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'A' : 'B';
      setResult(outcome);
      setIsFlipping(false);
    }, 1800);
  };

  const hasFlipped = result !== null && !isFlipping;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12151c] text-white rounded-2xl max-w-md w-full shadow-2xl border border-[#242a38] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#242a38] flex items-center justify-between bg-[#0e1117]">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#00ff66]" />
            <h3 className="text-sm font-bold text-white">
              The Subconscious Coin Flip
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6">
          <p className="text-xs text-[#cbd5e1] leading-relaxed max-w-xs mx-auto">
            <span className="font-bold text-white">Trust Your Intuition:</span> The coin doesn&apos;t choose for you — but the moment it is in the air, your heart secretly reveals which path you truly want.
          </p>

          {/* Options Display with glowing winner indicator */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div
              className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                hasFlipped && result === 'A'
                  ? 'bg-[#00ff66]/20 border-2 border-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.4)] scale-[1.02]'
                  : 'bg-[#0c0e12] border-[#242a38] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#00ff66] block text-[10px]">HEADS</span>
                {hasFlipped && result === 'A' && (
                  <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66] animate-pulse" />
                )}
              </div>
              <span className="font-bold text-white line-clamp-1 mt-0.5">{optionA}</span>
            </div>

            <div
              className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                hasFlipped && result === 'B'
                  ? 'bg-[#00ff66]/20 border-2 border-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.4)] scale-[1.02]'
                  : 'bg-[#0c0e12] border-[#242a38] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#00ff66] block text-[10px]">TAILS</span>
                {hasFlipped && result === 'B' && (
                  <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66] animate-pulse" />
                )}
              </div>
              <span className="font-bold text-white line-clamp-1 mt-0.5">{optionB}</span>
            </div>
          </div>

          {/* Coin Animation Area with Radiant Neon Green Glow After Flipped */}
          <div className="py-6 flex flex-col items-center justify-center relative">
            {/* Luminous Pulsing Ambient Aura when flipped */}
            {hasFlipped && (
              <div
                className="absolute w-44 h-44 rounded-full bg-[#00ff66]/25 blur-2xl animate-pulse pointer-events-none"
                style={{ animationDuration: '2s' }}
              />
            )}

            {/* Radiant Ripple Ring when flipped */}
            {hasFlipped && (
              <div className="absolute w-36 h-36 rounded-full border-2 border-[#00ff66]/60 animate-ping pointer-events-none opacity-40" />
            )}

            {/* The Coin */}
            <div
              className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center text-black font-extrabold font-mono text-2xl tracking-wider select-none transition-all duration-500 ${
                isFlipping
                  ? 'animate-bounce scale-110 rotate-360 border-4 border-[#00ff66] bg-gradient-to-br from-[#00ff66] via-[#10e668] to-[#04a841] shadow-lg shadow-[#00ff66]/30'
                  : hasFlipped
                  ? 'border-4 border-[#00ff66] bg-gradient-to-br from-[#4dff8f] via-[#00ff66] to-[#00cc52] shadow-[0_0_50px_#00ff66,0_0_100px_rgba(0,255,102,0.8),0_0_140px_rgba(0,255,102,0.4)] ring-4 ring-[#00ff66] ring-offset-4 ring-offset-[#12151c] scale-105'
                  : 'border-4 border-[#262c3b] bg-gradient-to-br from-[#1c2230] to-[#12151c] text-white hover:border-[#00ff66]/50 shadow-md'
              }`}
            >
              {isFlipping ? '...' : result ? (result === 'A' ? 'HEADS' : 'TAILS') : 'FLIP'}
            </div>

            {/* Flipped Outcome Badge */}
            {hasFlipped && (
              <div className="mt-5 animate-fadeIn space-y-1.5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff66]/15 border border-[#00ff66]/50 shadow-[0_0_15px_rgba(0,255,102,0.25)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span className="text-xs font-bold text-white">
                    Landed on:{' '}
                    <span className="text-[#00ff66] font-extrabold">
                      {result === 'A' ? `${optionA} (Heads)` : `${optionB} (Tails)`}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-[#9ca3af] italic max-w-xs mx-auto">
                  Notice your instant visceral reaction: relief confirms your genuine choice; regret means pick the other!
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleFlip}
              disabled={isFlipping}
              className={`w-full py-3.5 px-4 text-black text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                hasFlipped
                  ? 'bg-[#00ff66] hover:bg-[#22ff77] shadow-[0_0_25px_rgba(0,255,102,0.35)]'
                  : 'bg-[#00ff66] hover:bg-[#22ff77] shadow-md shadow-[#00ff66]/20'
              }`}
            >
              {isFlipping ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin text-black" />
                  <span>Coin is in the air...</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 text-black" />
                  <span>{result ? 'Flip Again' : 'Toss the Coin'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

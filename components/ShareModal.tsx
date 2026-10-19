'use client';

import React, { useState, useMemo } from 'react';
import { DecisionResult } from '@/lib/types';
import { createShareableUrl } from '@/lib/share';
import {
  X,
  Link2,
  Copy,
  Check,
  Calendar,
  Share2,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DecisionResult;
}

export function ShareModal({ isOpen, onClose, result }: ShareModalProps) {
  const [expiryDays, setExpiryDays] = useState(7);
  const [copied, setCopied] = useState(false);

  const { url: shareUrl, expiresAt } = useMemo(() => {
    return createShareableUrl(result, expiryDays);
  }, [result, expiryDays]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Dilemma Verdict: ${result.verdict.chosenOptionLabel} - ${result.verdict.chosenOptionTitle}`,
          text: `Check out this decision arbitration: ${result.verdict.headlineVerdict}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const formattedExpiry = new Date(expiresAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12151c] text-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#242a38] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#242a38] flex items-center justify-between bg-[#0e1117]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00ff66]/15 text-[#00ff66] flex items-center justify-center border border-[#00ff66]/30">
              <Share2 className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Share Decision Summary</h3>
              <p className="text-xs text-[#9ca3af]">Generate a temporary URL to share this dilemma with others</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#9ca3af] hover:text-white hover:bg-[#1f2430] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary Preview Box */}
          <div className="p-3.5 bg-[#151922] border border-[#242a38] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#00ff66] font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
                Shared Verdict Preview
              </span>
              <span className="text-[11px] font-mono text-white bg-[#0c0e12] px-2 py-0.5 rounded border border-[#242a38]">
                {result.verdict.confidenceScore}% Conviction
              </span>
            </div>
            <p className="text-sm font-bold text-white leading-snug">
              {result.verdict.chosenOptionLabel}: {result.verdict.chosenOptionTitle}
            </p>
            <p className="text-xs text-[#cbd5e1] line-clamp-2">
              {result.verdict.headlineVerdict}
            </p>
          </div>

          {/* Expiration Duration Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00ff66]" />
                Link Expiration Window
              </span>
              <span className="text-[11px] text-[#9ca3af] font-mono">
                Valid until {formattedExpiry}
              </span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#0c0e12] border border-[#242a38] rounded-xl">
              {[
                { label: '24 Hours', days: 1 },
                { label: '3 Days', days: 3 },
                { label: '7 Days', days: 7 },
                { label: '30 Days', days: 30 },
              ].map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setExpiryDays(opt.days)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    expiryDays === opt.days
                      ? 'bg-[#00ff66] text-black shadow-xs'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shareable Link Input with Copy Button */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white">
              Temporary Share URL
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-mono bg-[#0c0e12] border border-[#282f3f] rounded-xl text-[#cbd5e1] focus:border-[#00ff66] focus:outline-none"
                />
                <Link2 className="w-4 h-4 text-[#9ca3af] absolute left-3 top-3" />
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2.5 text-xs font-bold text-black bg-[#00ff66] hover:bg-[#22ff77] rounded-xl transition-all cursor-pointer shadow-sm shadow-[#00ff66]/20 flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-black" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-black" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#9ca3af] pt-1">
            <ShieldCheck className="w-4 h-4 text-[#00ff66] shrink-0" />
            <span>
              Anyone with this link can view the complete decision summary, option scores, and action roadmap until it expires.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#242a38] bg-[#0e1117] flex items-center justify-between gap-3">
          {typeof navigator !== 'undefined' && 'share' in navigator ? (
            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1a1f2c] hover:bg-[#242b3d] border border-[#2e374d] rounded-xl transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>Share via Apps...</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2 text-xs font-bold text-black bg-[#00ff66] hover:bg-[#22ff77] rounded-xl transition-all cursor-pointer shadow-sm shadow-[#00ff66]/20 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Shareable Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

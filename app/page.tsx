'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { DilemmaForm } from '@/components/DilemmaForm';
import { VerdictDisplay } from '@/components/VerdictDisplay';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { CoinFlipModal } from '@/components/CoinFlipModal';
import { ThemeSelectorModal } from '@/components/ThemeSelectorModal';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { ThemeProvider, useTheme } from '@/lib/theme';
import { DecisionRequest, DecisionResult } from '@/lib/types';
import { parseShareablePayload } from '@/lib/share';
import { Share2, ShieldAlert } from 'lucide-react';
import { DilemnaLogo } from '@/components/DilemnaLogo';

const STORAGE_KEY = 'dilemma_decider_history_v2';

let historyCache: DecisionResult[] = [];
let lastRawHistory: string | null = null;

function subscribeHistory(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('dilemma-history-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('dilemma-history-change', callback);
  };
}

function getHistorySnapshot(): DecisionResult[] {
  if (typeof window === 'undefined') return emptyHistory;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== lastRawHistory) {
      lastRawHistory = raw;
      historyCache = raw ? JSON.parse(raw) : [];
    }
    return historyCache;
  } catch {
    return historyCache;
  }
}

const emptyHistory: DecisionResult[] = [];
function getServerHistorySnapshot(): DecisionResult[] {
  return emptyHistory;
}

const emptySubscribe = () => () => {};

function MainApp() {
  const { theme } = useTheme();
  const [currentResult, setCurrentResult] = useState<DecisionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState<Partial<DecisionRequest> | undefined>(undefined);
  const [formKey, setFormKey] = useState(0);
  const history = React.useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getServerHistorySnapshot
  );
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [sharedMeta, setSharedMeta] = useState<{ isShared: boolean; isExpired: boolean; expiresAt?: number } | null>(null);

  useEffect(() => {
    // Parse share param from URL query safely after initial mount
    try {
      const params = new URLSearchParams(window.location.search);
      const shareParam = params.get('share');
      if (shareParam) {
        const { data, isExpired, expiresAt } = parseShareablePayload(shareParam);
        if (data) {
          setTimeout(() => {
            setCurrentResult(data);
            setSharedMeta({ isShared: true, isExpired, expiresAt });
          }, 0);
        }
      }
    } catch (e) {
      console.error('Failed to parse share parameter', e);
    }
  }, []);

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCoinFlipOpen, setIsCoinFlipOpen] = useState(false);
  const [coinFlipOptions, setCoinFlipOptions] = useState<{ optionA: string; optionB: string }>({
    optionA: 'Option A',
    optionB: 'Option B',
  });
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleOpenCoinFlip = (optionA?: string, optionB?: string) => {
    setCoinFlipOptions({
      optionA: optionA || formInitialValues?.options?.[0]?.title || 'Option A',
      optionB: optionB || formInitialValues?.options?.[1]?.title || 'Option B',
    });
    setIsCoinFlipOpen(true);
  };

  const saveToHistory = (result: DecisionResult) => {
    try {
      const current = getHistorySnapshot();
      const updated = [result, ...current.filter((h) => h.id !== result.id)].slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('dilemma-history-change'));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('dilemma-history-change'));
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  const handleDeleteOne = (id: string) => {
    try {
      const current = getHistorySnapshot();
      const updated = current.filter((h) => h.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('dilemma-history-change'));
    } catch (e) {
      console.error('Failed to delete history item', e);
    }
  };

  const handleFormSubmit = async (data: DecisionRequest) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const res = await fetch('/api/decide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to arbitrate decision.');
      }

      const result: DecisionResult = await res.json();
      setCurrentResult(result);
      saveToHistory(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Decision request failed:', err);
      setApiError(err.message || 'Something went wrong arbitrating your dilemma. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDecision = () => {
    setCurrentResult(null);
    setSharedMeta(null);
    if (typeof window !== 'undefined' && window.location.search.includes('share=')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setFormInitialValues({
      situation: '',
      options: [
        { id: 'opt_a', label: 'Option A', title: '', description: '', pros: [], cons: [] },
        { id: 'opt_b', label: 'Option B', title: '', description: '', pros: [], cons: [] },
      ],
    });
    setFormKey((prev) => prev + 1);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditInputs = () => {
    if (currentResult) {
      setFormInitialValues({
        situation: currentResult.situation,
        options: currentResult.options,
      });
      setFormKey((prev) => prev + 1);
      setCurrentResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen ${theme.colors.pageBg} text-white flex flex-col font-sans transition-colors duration-200 selection:bg-[#00ff66] selection:text-black`}>
      <Navbar
        onNewDecision={handleNewDecision}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={isClient ? history.length : 0}
        onOpenCoinFlip={() => handleOpenCoinFlip()}
        onOpenTheme={() => setIsThemeOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Shared Dilemma Banner */}
        {sharedMeta?.isShared && (
          <div
            className={`p-4 rounded-2xl border mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              sharedMeta.isExpired
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-[#151922] border-[#00ff66]/40 text-white shadow-md shadow-[#00ff66]/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  sharedMeta.isExpired ? 'bg-amber-500/20 text-amber-300' : 'bg-[#00ff66]/15 text-[#00ff66]'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Viewing Shared Dilemma Dossier</span>
                  {sharedMeta.isExpired ? (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      Link Expired (Snapshot View)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/30 font-bold">
                      Active Share Link
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9ca3af]" suppressHydrationWarning>
                  {sharedMeta.expiresAt ? `Temporary link valid until ${new Date(sharedMeta.expiresAt).toLocaleDateString()}` : 'Temporary share'} · Created with Dilemna Ai
                </p>
              </div>
            </div>

            <button
              onClick={handleNewDecision}
              className="px-3.5 py-1.5 text-xs font-bold text-black bg-[#00ff66] hover:bg-[#22ff77] rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs shadow-[#00ff66]/20"
            >
              Arbitrate Your Own Dilemma
            </button>
          </div>
        )}

        {apiError && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-500/50 rounded-2xl text-red-200 text-sm">
            <span className="font-bold block mb-0.5">Decision Engine Error</span>
            <span>{apiError}</span>
          </div>
        )}

        {currentResult ? (
          <VerdictDisplay
            result={currentResult}
            onReset={handleNewDecision}
            onEdit={handleEditInputs}
          />
        ) : (
          <DilemmaForm
            key={formKey}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            initialValues={formInitialValues}
            onOpenCoinFlip={handleOpenCoinFlip}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e2330] bg-[#0c0e12] py-6 text-center text-xs text-[#9ca3af]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <DilemnaLogo variant="mark" className="w-6 h-6 rounded-md" />
            <span className="text-white font-bold">PatCheeks LLC</span>
            <span className="text-[#3b4252]">·</span>
            <span className="text-[#F3CA52] font-semibold">Dilemna Ai</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[#9ca3af]">
            <span>Guided by Fate &amp; Intuition</span>
            <span>·</span>
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="text-amber-400 hover:text-amber-300 hover:underline cursor-pointer font-semibold flex items-center gap-1"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Decision Disclaimer</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsThemeOpen(true)}
              className="text-[#00ff66] hover:underline cursor-pointer font-semibold"
            >
              Theme Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDecision={(dec) => {
          setCurrentResult(dec);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onClearHistory={handleClearHistory}
        onDeleteOne={handleDeleteOne}
      />

      <CoinFlipModal
        isOpen={isCoinFlipOpen}
        onClose={() => setIsCoinFlipOpen(false)}
        optionA={coinFlipOptions.optionA}
        optionB={coinFlipOptions.optionB}
      />

      <ThemeSelectorModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

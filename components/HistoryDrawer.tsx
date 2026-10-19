'use client';

import React, { useState } from 'react';
import { DecisionResult } from '@/lib/types';
import { X, Trash2, History, Calendar, CheckCircle2, FileSpreadsheet, Check } from 'lucide-react';
import { downloadDecisionHistoryCSV } from '@/lib/csvExport';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DecisionResult[];
  onSelectDecision: (decision: DecisionResult) => void;
  onClearHistory: () => void;
  onDeleteOne: (id: string) => void;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectDecision,
  onClearHistory,
  onDeleteOne,
}: HistoryDrawerProps) {
  const [copiedCSV, setCopiedCSV] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (!history.length) return;
    downloadDecisionHistoryCSV(history);
    setCopiedCSV(true);
    setTimeout(() => setCopiedCSV(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12151c] text-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#242a38]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#242a38] flex items-center justify-between bg-[#0e1117]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#00ff66]" />
            <h3 className="text-sm font-bold text-white">
              Saved Dilemmas ({history.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#1a202d] text-[#00ff66] border border-[#00ff66]/30 hover:bg-[#00ff66]/10 transition-colors cursor-pointer"
                  title="Export all decision records as a CSV file for personal analytics"
                >
                  {copiedCSV ? (
                    <>
                      <Check className="w-3 h-3 text-[#00ff66]" />
                      <span>Exported!</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-3 h-3 text-[#00ff66]" />
                      <span>Export CSV</span>
                    </>
                  )}
                </button>
                <button
                  onClick={onClearHistory}
                  className="text-[11px] text-[#9ca3af] hover:text-red-400 transition-colors cursor-pointer px-1"
                  title="Clear all saved history"
                >
                  Clear All
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 px-4 text-[#9ca3af] space-y-2">
              <History className="w-8 h-8 mx-auto text-[#374151]" />
              <p className="text-xs text-white">No saved decisions yet.</p>
              <p className="text-[11px] text-[#9ca3af]">
                Any dilemma you explore with Dilemna Ai will automatically be saved here for your peace of mind.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-[#151922] border border-[#242a38] hover:border-[#00ff66]/50 rounded-xl transition-all space-y-2 relative group"
              >
                <div className="flex items-center justify-between text-[11px] text-[#9ca3af] font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#9ca3af]" />
                    {new Date(item.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOne(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[#9ca3af] hover:text-red-400 transition-opacity p-0.5 cursor-pointer"
                    title="Delete this record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div
                  onClick={() => {
                    onSelectDecision(item);
                    onClose();
                  }}
                  className="cursor-pointer space-y-1.5"
                >
                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                    {item.situation}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#242a38]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#00ff66]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                      <span>{item.verdict.chosenOptionLabel}: {item.verdict.chosenOptionTitle}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-white">
                      {item.verdict.confidenceScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Actions Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-[#242a38] bg-[#0e1117] space-y-2">
            <button
              onClick={handleExportCSV}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#00ff66] text-black hover:bg-[#22ff77] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#00ff66]/20"
            >
              {copiedCSV ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>CSV File Downloaded!</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-black" />
                  <span>Export All Decisions as CSV</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-[#9ca3af]">
              Includes full scores, pros/cons weights, roadmaps, and confidence scores for spreadsheets & analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

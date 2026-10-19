'use client';

import React, { useState } from 'react';
import { DecisionResult } from '@/lib/types';
import { generateDecisionPDF, PDFExportOptions } from '@/lib/pdfGenerator';
import {
  X,
  FileDown,
  Printer,
  CheckCircle2,
  Sliders,
  Shield,
  Layers,
  TrendingUp,
  FileText,
  UserCheck,
} from 'lucide-react';

interface ExportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DecisionResult;
}

export function ExportPDFModal({ isOpen, onClose, result }: ExportPDFModalProps) {
  const [decisionMakerName, setDecisionMakerName] = useState('');
  const [includeComparisonTable, setIncludeComparisonTable] = useState(true);
  const [includeDevilsAdvocate, setIncludeDevilsAdvocate] = useState(true);
  const [includeActionRoadmap, setIncludeActionRoadmap] = useState(true);
  const [includeTripwires, setIncludeTripwires] = useState(true);
  const [includeSignOff, setIncludeSignOff] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const getExportOptions = (): PDFExportOptions => ({
    decisionMakerName: decisionMakerName.trim() || undefined,
    includeComparisonTable,
    includeDevilsAdvocate,
    includeActionRoadmap,
    includeTripwires,
    includeSignOff,
  });

  const handleDownloadPDF = () => {
    try {
      setIsGenerating(true);
      const doc = generateDecisionPDF(result, getExportOptions());
      const sanitizedTitle = result.verdict.chosenOptionTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 30);
      const filename = `decision-dossier-${sanitizedTitle}-${new Date(result.timestamp)
        .toISOString()
        .slice(0, 10)}.pdf`;

      doc.save(filename);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBrowserPrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#12151c] text-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#242a38] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#242a38] flex items-center justify-between bg-[#0e1117]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00ff66]/15 text-[#00ff66] flex items-center justify-center border border-[#00ff66]/30">
              <FileDown className="w-4 h-4 text-[#00ff66]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Export Executive Decision PDF
              </h3>
              <p className="text-xs text-[#9ca3af]">
                Generate a formal, archival PDF dossier for organizational or personal record-keeping
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#9ca3af] hover:text-white hover:bg-[#1f2430] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Document Summary Card */}
          <div className="p-4 bg-[#151922] border border-[#242a38] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00ff66] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                Target Recommendation
              </span>
              <span className="text-xs font-mono font-bold text-white bg-[#0c0e12] px-2 py-0.5 rounded border border-[#242a38]">
                {result.verdict.confidenceScore}% Conviction
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {result.verdict.chosenOptionLabel}: {result.verdict.chosenOptionTitle}
            </h4>
            <p className="text-xs text-[#cbd5e1] line-clamp-2">
              {result.verdict.headlineVerdict}
            </p>
          </div>

          {/* Configuration Form */}
          <div className="space-y-4">
            <h5 className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#00ff66]" />
              Dossier Customization & Record-Keeping
            </h5>

            {/* Decision Maker Name */}
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Decision Maker / Signer Name (Optional)
              </label>
              <input
                type="text"
                value={decisionMakerName}
                onChange={(e) => setDecisionMakerName(e.target.value)}
                placeholder="e.g. Alex Mercer, VP of Strategy"
                className="w-full px-3 py-2 text-xs rounded-lg border bg-[#0c0e12] border-[#242a38] text-white placeholder-[#64748b] focus:border-[#00ff66] focus:outline-none"
              />
              <p className="text-[11px] text-[#9ca3af] mt-1">
                Will be populated in the formal signature & audit block at the end of the dossier.
              </p>
            </div>

            {/* Section Toggles */}
            <div className="space-y-2 pt-1">
              <span className="block text-xs font-semibold text-white mb-1.5">
                Included Sections:
              </span>

              <label className="flex items-center gap-2.5 p-2.5 bg-[#0c0e12] border border-[#242a38] rounded-lg cursor-pointer hover:border-[#374151] transition-colors">
                <input
                  type="checkbox"
                  checked={includeComparisonTable}
                  onChange={(e) => setIncludeComparisonTable(e.target.checked)}
                  className="w-4 h-4 rounded border-[#374151] text-[#00ff66] focus:ring-[#00ff66] accent-[#00ff66] cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#00ff66]" />
                    Comparative Options Scorecard Table
                  </span>
                  <span className="text-[11px] text-[#9ca3af] block">
                    Matrix of all {result.options.length} options with feasibility, upside, risk, and rejection rationales.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-[#0c0e12] border border-[#242a38] rounded-lg cursor-pointer hover:border-[#374151] transition-colors">
                <input
                  type="checkbox"
                  checked={includeDevilsAdvocate}
                  onChange={(e) => setIncludeDevilsAdvocate(e.target.checked)}
                  className="w-4 h-4 rounded border-[#374151] text-[#00ff66] focus:ring-[#00ff66] accent-[#00ff66] cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#00ff66]" />
                    Devil&apos;s Advocate Counter-Defense
                  </span>
                  <span className="text-[11px] text-[#9ca3af] block">
                    Stress-tests vulnerabilities and provides the explicit defense against failure modes.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-[#0c0e12] border border-[#242a38] rounded-lg cursor-pointer hover:border-[#374151] transition-colors">
                <input
                  type="checkbox"
                  checked={includeActionRoadmap}
                  onChange={(e) => setIncludeActionRoadmap(e.target.checked)}
                  className="w-4 h-4 rounded border-[#374151] text-[#00ff66] focus:ring-[#00ff66] accent-[#00ff66] cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#00ff66]" />
                    Immediate 3-Step Execution Roadmap
                  </span>
                  <span className="text-[11px] text-[#9ca3af] block">
                    Actionable milestones with timeframes to execute the winning decision.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-[#0c0e12] border border-[#242a38] rounded-lg cursor-pointer hover:border-[#374151] transition-colors">
                <input
                  type="checkbox"
                  checked={includeSignOff}
                  onChange={(e) => setIncludeSignOff(e.target.checked)}
                  className="w-4 h-4 rounded border-[#374151] text-[#00ff66] focus:ring-[#00ff66] accent-[#00ff66] cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#00ff66]" />
                    Formal Record-Keeping & Sign-Off Block
                  </span>
                  <span className="text-[11px] text-[#9ca3af] block">
                    Official signature line, adoption date, and archival audit fields.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#242a38] bg-[#0e1117] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBrowserPrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1a1f2c] hover:bg-[#242b3d] border border-[#2e374d] rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#9ca3af]" />
            <span>Browser Print / Save PDF</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-black bg-[#00ff66] hover:bg-[#22ff77] rounded-xl shadow-md shadow-[#00ff66]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Downloaded PDF!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-black" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

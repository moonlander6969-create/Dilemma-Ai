'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Scale,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DISCLAIMER_DOCUMENT_TEXT = `OFFICIAL DECISION RESPONSIBILITY & LIMITATION OF LIABILITY DISCLAIMER
PatCheeks LLC · Dilemna Ai
Effective Date: Permanent / In Perpetuity

1. GENERAL DISCLAIMER OF RESPONSIBILITY FOR USER DECISIONS
Dilemna Ai ("the Application"), developed and operated by PatCheeks LLC ("Company", "we", "us", or "our"), is an artificial intelligence-powered exploratory decision-support, trade-off analysis, and cognitive reflection aid. 

UNDER NO CIRCUMSTANCES SHALL PATCHEEKS LLC, ITS FOUNDERS, OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AFFILIATES, AGENTS, LICENSORS, OR LLM PROVIDERS BE HELD RESPONSIBLE OR LIABLE, LEGALLY, FINANCIALLY, OR MORALLY, FOR ANY CHOICES, DECISIONS, ACTIONS, OMISSIONS, OR BEHAVIORS THAT YOU OR ANY USER MAKES, EXECUTES, OR REFRAINS FROM MAKING.

YOU ACKNOWLEDGE AND AGREE THAT YOU ALONE BEAR 100% SOLE AND EXCLUSIVE RESPONSIBILITY FOR ANY AND ALL DECISIONS YOU REACH, AND FOR ANY CONSEQUENCES, LOSSES, DAMAGES, REGRETS, OR OUTCOMES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THIS APPLICATION.

2. NATURE OF AI-GENERATED OUTPUTS (INFORMATIONAL & HEURISTIC ONLY)
All verdicts, confidence scores, intuition meters, pros and cons weightings, radar spectrum charts, action roadmaps, tripwires, and follow-up replies produced by Dilemna Ai are generated through automated artificial intelligence algorithms (including large language models). 
- These outputs reflect probabilistic calculations, heuristics, and natural-language synthesis.
- They DO NOT constitute infallible foresight, deterministic prophecy, guaranteed results, or professional counsel.
- AI models may misinterpret context, experience hallucinations, or omit critical real-world nuances.

3. NO PROFESSIONAL, FINANCIAL, LEGAL, MEDICAL, OR PSYCHOLOGICAL COUNSEL
Dilemna Ai DOES NOT provide legal, medical, psychiatric, investment, tax, financial, marital, or career advisory services. 
- No fiduciary, doctor-patient, attorney-client, or professional-client relationship is formed through your use of this application.
- If your dilemma involves high-stakes situations—such as medical emergencies, mental health, legal disputes, substantial financial or real-estate transactions, or physical safety—YOU ARE STRONGLY ADVISED TO CONSULT A LICENSED, QUALIFIED HUMAN PROFESSIONAL before taking any action.

4. VOLUNTARY ASSUMPTION OF RISK & "AS-IS" PROVISION
The application and all generated content are provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind, whether express, statutory, or implied. You voluntarily assume all risks associated with any choices you evaluate or implement.

5. INDEMNIFICATION & LIMITATION OF LIABILITY
By using Dilemna Ai, you agree to release, waive, defend, indemnify, and hold harmless PatCheeks LLC and its affiliates from any claims, suits, liabilities, losses, damages, costs, or expenses (including attorney fees) arising from:
a) Any decision or action taken or not taken based on application outputs;
b) Any unexpected, adverse, or regrettable outcomes resulting from such decisions;
c) Any technical inaccuracies, service interruptions, or model errors.

6. SOLE AGENCY OF THE INDIVIDUAL
Dilemna Ai is designed as an interactive mirror to stimulate clear thinking, expose hidden blindspots, and bring emotional peace of mind. The ultimate steering wheel of your life remains exclusively in your own hands.`;

export function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(DISCLAIMER_DOCUMENT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0e121a] border border-[#263042] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#242d3e] bg-[#121622] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                Official Legal Disclosure
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Decision Responsibility Disclaimer
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-[#181e2b] border border-[#2a3447] text-[#cbd5e1] hover:text-white hover:border-[#00ff66]/50 transition-colors cursor-pointer"
              title="Copy Disclaimer Text"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#00ff66]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-[#181e2b] border border-[#2a3447] text-[#cbd5e1] hover:text-white hover:border-[#00ff66]/50 transition-colors cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#181e2b] border border-[#2a3447] text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prominent High-Contrast Statement Banner */}
        <div className="p-4 bg-amber-950/40 border-b border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">
            <strong className="text-amber-300 font-bold block mb-0.5">
              CRITICAL NOTICE: WE ARE NOT RESPONSIBLE FOR ANY DECISIONS YOU MAKE
            </strong>
            PatCheeks LLC and Dilemna Ai provide automated analytical heuristics and reflective frameworks for personal clarity only. You retain 100% sole agency, discretion, and responsibility for all life, career, personal, and financial choices.
          </div>
        </div>

        {/* Scrollable Formal Document Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-[#cbd5e1] leading-relaxed font-sans">
          {/* Section 1 */}
          <div className="space-y-1.5 bg-[#141924] p-4 rounded-xl border border-[#232b3c]">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#00ff66]" />
              1. Sole User Agency & Absolute Waiver of Liability
            </h3>
            <p>
              Under no circumstances shall <strong>PatCheeks LLC</strong>, its creators, operators, contributors, or AI service providers be liable for any choice, decision, action, inaction, consequence, damage, loss, injury, or regret resulting from your use of this platform. All outputs are for self-reflection and decision exploration. You are solely responsible for exercising your own judgment.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-1.5 bg-[#141924] p-4 rounded-xl border border-[#232b3c]">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
              2. Informational & Heuristic Decision-Support Only
            </h3>
            <p>
              Arbitrations, confidence meters, pros/cons weighting matrices, and radar graphs are synthesized through artificial intelligence models. They reflect algorithmic heuristics and trade-off simulations, not absolute certainties or professional directives. Real-world conditions can evolve unpredictably.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-1.5 bg-[#141924] p-4 rounded-xl border border-[#232b3c]">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              3. Not Professional, Financial, Legal, or Medical Advice
            </h3>
            <p>
              Dilemna Ai does not replace certified attorneys, certified financial planners, licensed physicians, therapists, or fiduciaries. Do not use this tool as the sole basis for high-stakes medical, legal, or financial commitments without independent professional human verification.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-1.5 bg-[#141924] p-4 rounded-xl border border-[#232b3c]">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              4. Complete &ldquo;AS-IS&rdquo; Provision & Indemnification
            </h3>
            <p>
              This service is provided &ldquo;as-is&rdquo; without warranties of merchantability, fitness for a particular purpose, or error-free operation. You agree to hold harmless and indemnify PatCheeks LLC from any disputes or third-party claims arising out of decisions made using this application.
            </p>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="p-4 bg-[#121622] border-t border-[#242d3e] flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 text-xs">
          <Link
            href="/disclaimer"
            target="_blank"
            className="text-[#9ca3af] hover:text-[#00ff66] flex items-center gap-1.5 transition-colors font-mono text-[11px]"
          >
            <span>Open Permanent Document Link (/disclaimer)</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#1a202d] text-[#cbd5e1] hover:text-white border border-[#2a3447] transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00ff66]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-black bg-[#00ff66] hover:bg-[#22ff77] rounded-xl transition-all cursor-pointer shadow-md shadow-[#00ff66]/20"
            >
              I Understand & Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

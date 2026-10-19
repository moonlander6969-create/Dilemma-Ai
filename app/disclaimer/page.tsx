'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  Scale,
  AlertTriangle,
  FileText,
  Lock,
} from 'lucide-react';
import { DISCLAIMER_DOCUMENT_TEXT } from '@/components/DisclaimerModal';

export default function DisclaimerPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DISCLAIMER_DOCUMENT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-[#cbd5e1] font-sans antialiased py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2330]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9ca3af] hover:text-[#00ff66] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dilemna Ai App</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#141822] border border-[#242b3b] text-xs font-medium text-white hover:border-[#00ff66]/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#141822] border border-[#242b3b] text-xs font-medium text-white hover:border-[#00ff66]/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
          </div>
        </div>

        {/* Document Header Card */}
        <div className="bg-[#11141c] border border-[#242b3b] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
                Official Legal Disclosure Document
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Decision Responsibility & Limitation of Liability Disclaimer
              </h1>
            </div>
          </div>

          <div className="text-xs text-[#9ca3af] font-mono flex flex-wrap gap-4 pt-2 border-t border-[#1e2330]">
            <div>Entity: <span className="text-white">PatCheeks LLC</span></div>
            <div>Product: <span className="text-[#00ff66]">Dilemna Ai</span></div>
            <div>Classification: <span className="text-white">User Responsibility & Assumption of Risk</span></div>
          </div>
        </div>

        {/* Primary Disclaimer Banner Box */}
        <div className="p-5 bg-amber-950/40 border-2 border-amber-500/40 rounded-2xl text-amber-200 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300 uppercase tracking-wider text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Core Statement of Non-Responsibility
          </div>
          <p className="leading-relaxed font-medium">
            <strong>PatCheeks LLC, Dilemna Ai, and its operators ARE NOT RESPONSIBLE FOR ANY DECISIONS, ACTIONS, OMISSIONS, OR OUTCOMES MADE BY THE USER.</strong> All verdicts, intuition meters, confidence scores, pros/cons weights, and strategic recommendations are probabilistic artificial intelligence simulations provided strictly for heuristic self-reflection. You retain 100% sole agency, judgment, and personal responsibility.
          </p>
        </div>

        {/* Document Body */}
        <div className="bg-[#11141c] border border-[#242b3b] rounded-2xl p-6 sm:p-8 space-y-6 text-xs text-[#cbd5e1] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#00ff66]" />
              1. General Disclaimer of Responsibility for User Decisions
            </h2>
            <p>
              Dilemna Ai is an automated artificial intelligence-powered exploratory decision-support and trade-off analysis tool. Under no circumstances shall PatCheeks LLC, its owners, directors, contributors, licensors, or artificial intelligence providers be held liable for any choices, transactions, commitments, life decisions, or omissions made by users.
            </p>
            <p>
              The user understands that life decisions are inherently subject to uncertainty and real-world variance. You voluntarily assume full and sole liability for any results, financial impacts, emotional states, or consequences stemming from decisions you make.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-[#1e2330]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#38bdf8]" />
              2. Nature of AI-Generated Arbitrations & Weightings
            </h2>
            <p>
              All output texts, radar spectra, confidence scores, pros vs cons weightings, and action roadmaps are computational model outputs generated through automated language processing algorithms. They do not constitute guaranteed advice, predictive certainty, or infallible logic.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-[#1e2330]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              3. Exclusion of Professional, Legal, Medical, or Financial Advisory
            </h2>
            <p>
              Dilemna Ai does not practice law, medicine, certified financial planning, or psychotherapy. No fiduciary or professional-client relationship is established. High-stakes dilemmas involving health, legal liability, large capital allocation, or personal safety must always be reviewed by licensed human professionals.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-[#1e2330]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              4. Complete &ldquo;AS-IS&rdquo; Warranty Waiver & Indemnification
            </h2>
            <p>
              This service is provided &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; without warranties of any kind. You agree to defend, indemnify, and hold harmless PatCheeks LLC from any claims or damages resulting directly or indirectly from your usage.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-[#1e2330]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#00ff66]" />
              5. Final Acknowledgment
            </h2>
            <p>
              By accessing, browsing, or running dilemmas through Dilemna Ai, you explicitly affirm that you have read, understood, and agreed to this Decision Responsibility Disclaimer in its entirety.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#64748b] py-6 space-y-2">
          <p>© {new Date().getFullYear()} PatCheeks LLC · Dilemna Ai · All Rights Reserved.</p>
          <Link href="/" className="text-[#00ff66] hover:underline font-semibold">
            Return to Dilemna Ai Home
          </Link>
        </div>
      </div>
    </div>
  );
}

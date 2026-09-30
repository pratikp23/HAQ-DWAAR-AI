import React from "react";
import { ShieldCheck, AlertCircle, ExternalLink, Lock } from "lucide-react";

/**
 * HAQ DWAAR AI — Civic Information & Trust Panel
 * 
 * Non-agency civic notice, official portal guidance, and zero-monetization architecture.
 * Strictly adheres to truth in advertising without misleading claims.
 */
export default function TrustInformationCard() {
  return (
    <section 
      aria-label="Civic Platform Notice and Trust Guidelines"
      className="rounded-3xl bg-[#fbf9fe] border border-[#e9e1f5] p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-600"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e9e1f5]">
        <div className="flex items-center gap-2 text-slate-900">
          <ShieldCheck className="w-5 h-5 text-[#2b0f4c] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-normal">
            Civic Platform Notice &amp; Trust Guidelines
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Data Selling</span>
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
            <span>Independent Citizen Tool</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed">
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
            Role of HAQ DWAAR AI:
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            HAQ DWAAR helps citizens discover and prepare for government benefits through structured profile matching and document health checks. It does not replace the official government application portal, nor does it conduct official statutory verification.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
            Official Source Verification:
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            <strong>Always verify final eligibility and application requirements on the official scheme source.</strong> All official applications must be submitted through designated ministry websites, state portals, or authorized Common Service Centres (CSC).
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-[#e9e1f5] flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5 text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Informational guidance only. No government affiliation or guaranteed benefits claimed.</span>
        </div>

        <a
          href="https://www.india.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#2b0f4c] hover:text-[#591d8f] hover:underline"
        >
          <span>National Portal of India</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}

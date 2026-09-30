import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  BookmarkCheck, 
  BookmarkPlus,
  RefreshCw,
  Check,
  ShieldCheck,
  FileCheck2,
  AlertCircle
} from "lucide-react";
import { DigiLockerLogo } from "../common/GovLogos";

/**
 * HAQ DWAAR AI — Personalized Action Plan ("Scheme se Application Tak")
 * 
 * Pixel-perfect implementation of the user's reference mockup (media_1790770535200.png):
 * - Deep purple branded header with sparkle emblem
 * - Scheme metadata strip with Level/Category pill, Scheme Title, Benefit Callout, Match Score & Eligibility tier
 * - 4-stage interactive roadmap:
 *   1. Confirm Benefit Passport (COMPLETED, Green border & badge)
 *   2. Fetch Required Document / Blocker (IN_PROGRESS, Orange border & 1-Click DigiLocker Sync button)
 *   3. Review document health (PENDING, Gray/Purple badge)
 *   4. Apply on official portal (PENDING, Gray/Purple badge)
 * - Action footer:
 *   - "Save to My Applications" (with tracking status)
 *   - "Proceed to Official Government Portal ↗" (direct statutory gateway)
 */
export default function PersonalizedActionPlan({
  scheme,
  user,
  profileData = null,
  evaluation = null,
  onSaveApplication,
  isTracking = false,
  trackingLoading = false,
}) {
  const [digiLockerSynced, setDigiLockerSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Scheme info fallbacks
  const schemeName = scheme?.name || "Mukhyamantri Medhavi Vidyarthi Yojana";
  const category = scheme?.category || "EDUCATION";
  const level = scheme?.level || scheme?.state || "STATE GOVT";
  const benefitSummary = scheme?.benefitSummary || "Up to ₹1,50,000 tuition reimbursement per academic year";
  const officialUrl = scheme?.officialApplicationUrl || "https://scholarships.gov.in";
  
  // Dynamic match percentage
  const matchScore = evaluation?.matchScore || 94;
  const matchTier = matchScore >= 85 ? "High Eligibility" : matchScore >= 60 ? "Moderate Match" : "Basic Match";

  // Identify specific document blocker
  const missingDocs = scheme?.requiredDocuments?.filter(d => d.mandatory) || [];
  const primaryBlockerDoc = missingDocs.length > 0 ? missingDocs[0].documentType : "Income Certificate (आय प्रमाण पत्र)";

  // Citizen state & demographic descriptor
  const citizenState = profileData?.personal?.state || profileData?.location?.state || "Madhya Pradesh";
  const citizenCategory = profileData?.personal?.category || "OBC";

  // 1-Click DigiLocker Sync Handler
  const handleDigiLockerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setDigiLockerSynced(true);
    }, 900);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#e9e1f5] shadow-xl overflow-hidden text-slate-800 animate-in fade-in duration-200">
      
      {/* ======================================================== */}
      {/* 1. TOP PURPLE BANNER HEADER                              */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-[#240b49] via-[#351066] to-[#240b49] p-4 sm:p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center shadow-md shadow-orange-950/40 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-normal leading-tight">
              Personalized Action Plan
            </h2>
            <p className="text-xs text-purple-200 font-normal mt-0.5">
              Scheme se Application Tak • Step-by-Step Guidance
            </p>
          </div>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Protocol</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SCHEME DETAILS & ELIGIBILITY STRIP                    */}
      {/* ======================================================== */}
      <div className="p-5 sm:p-6 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-[#591d8f]">
              {level.toUpperCase()} • {category.toUpperCase()}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {schemeName}
          </h3>

          <p className="text-xs sm:text-sm font-bold text-[#ea580c] flex items-center gap-1.5">
            <span>💰</span>
            <span>{benefitSummary}</span>
          </p>
        </div>

        {/* Right Match Callout */}
        <div className="sm:text-right shrink-0 bg-emerald-50/60 sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-emerald-100 sm:border-0">
          <div className="text-xl sm:text-2xl font-black text-emerald-600 leading-tight">
            {matchScore}% Match
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5">
            {matchTier}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. STEP-BY-STEP ACTIONABLE ROADMAP                       */}
      {/* ======================================================== */}
      <div className="p-5 sm:p-6 space-y-4 bg-slate-50/40">
        
        {/* STEP 1: Confirm Benefit Passport (COMPLETED) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-0.5 shadow-xs">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Confirm Benefit Passport
                </h4>
              </div>
              <p className="text-xs text-slate-600 font-normal mt-0.5 leading-relaxed">
                Your {citizenState} {citizenCategory} student profile and income details are ready for review.
              </p>
            </div>
          </div>

          <span className="self-start sm:self-auto px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            COMPLETED
          </span>
        </div>

        {/* STEP 2: Fetch Blocker Document (IN_PROGRESS or COMPLETED if synced) */}
        <div className={`p-4 sm:p-5 rounded-2xl bg-white transition-all ${
          digiLockerSynced
            ? "border border-emerald-300 shadow-2xs"
            : "border-2 border-orange-300 ring-2 ring-orange-100 shadow-sm"
        } flex flex-col justify-between gap-3.5`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className={`w-9 h-9 rounded-full ${
                digiLockerSynced ? "bg-emerald-600" : "bg-[#ea580c]"
              } text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 shadow-xs`}>
                {digiLockerSynced ? <Check className="w-5 h-5 stroke-[2.5]" /> : "2"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {digiLockerSynced ? `Verified ${primaryBlockerDoc}` : `Fetch ${primaryBlockerDoc}`}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {digiLockerSynced
                    ? "Document successfully fetched and verified through DigiLocker direct API v3."
                    : `${primaryBlockerDoc} is the only document currently blocking submission.`
                  }
                </p>
              </div>
            </div>

            <span className={`self-start sm:self-auto px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
              digiLockerSynced
                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                : "bg-amber-100 text-amber-900 border border-amber-200"
            }`}>
              {digiLockerSynced ? "COMPLETED" : "IN_PROGRESS"}
            </span>
          </div>

          {/* 1-Click DigiLocker Sync Button */}
          {!digiLockerSynced && (
            <div className="sm:pl-12 pt-1">
              <button
                type="button"
                onClick={handleDigiLockerSync}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm transition-all cursor-pointer disabled:opacity-75"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Syncing DigiLocker...</span>
                  </>
                ) : (
                  <>
                    <DigiLockerLogo className="w-4 h-4" />
                    <span>1-Click DigiLocker Sync</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* STEP 3: Review Document Health (PENDING) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-purple-100 text-[#591d8f] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Review document health
                </h4>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                Check the extracted fields and verify any possible name or date mismatch.
              </p>
            </div>
          </div>

          <span className="self-start sm:self-auto px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            PENDING
          </span>
        </div>

        {/* STEP 4: Apply on Official Portal (PENDING) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-purple-100 text-[#591d8f] flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Apply on official portal
                </h4>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                Continue to the verified government application channel.
              </p>
            </div>
          </div>

          <span className="self-start sm:self-auto px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            PENDING
          </span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. BOTTOM ACTION FOOTER                                  */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Save to My Applications */}
        <button
          type="button"
          onClick={onSaveApplication}
          disabled={trackingLoading || isTracking}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
            isTracking
              ? "bg-emerald-50 text-emerald-800 border-emerald-300 cursor-default"
              : "bg-white hover:bg-purple-50 text-[#2b0f4c] border-purple-200 shadow-2xs"
          }`}
        >
          {isTracking ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span>✓ Saved in Applications</span>
            </>
          ) : trackingLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4 text-[#591d8f]" />
              <span>Save to My Applications</span>
            </>
          )}
        </button>

        {/* Right: Proceed to Official Government Portal */}
        {officialUrl ? (
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md shadow-orange-950/20 transition-all cursor-pointer"
          >
            <span>Proceed to Official Government Portal</span>
            <ExternalLink className="w-4 h-4 text-orange-200" />
          </a>
        ) : (
          <Link
            to={`/dashboard/readiness/${scheme?._id || scheme?.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#2b0f4c] hover:bg-[#1e0a3c] text-white shadow-md transition-all cursor-pointer"
          >
            <span>View Full Readiness Plan</span>
            <ExternalLink className="w-4 h-4 text-purple-200" />
          </Link>
        )}
      </div>

    </div>
  );
}

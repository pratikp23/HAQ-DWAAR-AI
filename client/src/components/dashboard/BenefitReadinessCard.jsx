import React from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck, 
  UserCheck, 
  ExternalLink,
  Sparkles,
  Info
} from "lucide-react";

/**
 * HAQ DWAAR AI — Benefit Readiness Card Component (Compact & Clean)
 * 
 * Sleek, highly legible civic readiness summary:
 * - Immediate status badge (82% Ready • 1 Item Pending)
 * - Target scheme context strip
 * - 3 clean checklist rows with plain-language status
 * - One-line actionable next step with direct link
 * - Compact primary CTA
 */
export default function BenefitReadinessCard({
  readinessData = null,
  targetScheme = null,
  profileCompleteness = 80,
  vaultDocuments = [],
  loading = false,
}) {
  const hasSchemeReadiness = Boolean(readinessData && readinessData.breakdown);

  let overallScore = 82;
  let overallLabel = "Partially Ready";
  let profileScore = 100;
  let docScore = 60;
  let actionScore = 100;
  let schemeName = targetScheme?.name || "Post-Matric Scholarship for Girls (Higher Education)";
  let schemeId = targetScheme?._id || targetScheme?.id || targetScheme?.schemeId || "scheme-post-matric-scholarship";

  if (hasSchemeReadiness) {
    overallScore = Math.round(readinessData.readinessScore || 0);
    overallLabel = readinessData.label || "Partially Ready";
    
    const b = readinessData.breakdown;
    profileScore = b.profile?.maxScore ? Math.round((b.profile.score / b.profile.maxScore) * 100) : 100;
    docScore = b.documents?.maxScore ? Math.round((b.documents.score / b.documents.maxScore) * 100) : 60;
    actionScore = b.action?.maxScore ? Math.round((b.action.score / b.action.maxScore) * 100) : 100;
  } else if (profileCompleteness > 0 || vaultDocuments.length > 0) {
    profileScore = profileCompleteness >= 75 ? 100 : Math.round(profileCompleteness);
    const validDocs = vaultDocuments.filter((d) => d.healthStatus === "VALID").length;
    docScore = vaultDocuments.length > 0 ? Math.round((validDocs / vaultDocuments.length) * 100) : 60;
    actionScore = 100;
    overallScore = Math.round((profileScore * 0.4) + (docScore * 0.4) + (actionScore * 0.2)) || 82;
  }

  const isFullyReady = overallScore >= 90;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between h-full space-y-3.5">
      
      {/* 1. Header: Title & Current Readiness Badge */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-normal">
                Benefit Readiness
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              आवेदन तैयारी • Readiness Report
            </p>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-[13px] font-semibold border shrink-0 ${
            isFullyReady
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-amber-50 text-amber-900 border-amber-200"
          }`}>
            {isFullyReady ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>{overallScore}% Ready • {isFullyReady ? "Ready to Apply" : "1 Item Pending"}</span>
          </span>
        </div>

        {/* 2. Target Scheme Context Strip */}
        <div className="py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide block">
              Target Welfare Scheme
            </span>
            <p className="text-sm sm:text-base font-semibold text-slate-900 truncate mt-0.5">
              {schemeName}
            </p>
          </div>
          <span className="text-xs sm:text-[13px] font-semibold px-2.5 py-0.5 rounded bg-purple-50 text-[#591d8f] border border-purple-200 shrink-0">
            Direct DBT
          </span>
        </div>

        {/* 3. Three Sleek, High-Readability Checklist Rows */}
        <div className="space-y-2">
          
          {/* Row 1: Profile & Criteria */}
          <div className="py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-800 truncate text-xs sm:text-[13px]">
                1. Citizen Profile Criteria
              </span>
              <span className="hidden sm:inline text-xs sm:text-[13px] text-slate-500 font-normal">
                • OBC, Age &amp; Domicile match
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
              ✓ 100% Eligible
            </span>
          </div>

          {/* Row 2: Documents in Vault */}
          <div className="py-2 px-3 rounded-xl bg-amber-50/40 border border-amber-200/60 flex items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <FileCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-semibold text-slate-800 truncate text-xs sm:text-[13px]">
                2. Documents in Vault
              </span>
              <span className="hidden sm:inline text-xs sm:text-[13px] text-amber-900 font-normal">
                • 4 of 5 ready (Income Cert. needed)
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
              ⚠️ 60% Ready
            </span>
          </div>

          {/* Row 3: Application Gateway */}
          <div className="py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-slate-800 truncate text-xs sm:text-[13px]">
                3. Application Channel
              </span>
              <span className="hidden sm:inline text-xs sm:text-[13px] text-slate-500 font-normal">
                • MahaDBT Portal Open
              </span>
            </div>
            <span className="text-xs sm:text-[13px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
              ✓ Ready to Apply
            </span>
          </div>

        </div>

        {/* 4. Actionable Next Step Banner */}
        <div className="py-2 px-3 rounded-xl bg-orange-50/80 border border-orange-200/80 text-xs sm:text-[13px] text-orange-950 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="font-medium truncate">
              Renew Income Certificate in Vault to reach 100% readiness.
            </span>
          </div>
          <Link
            to="/dashboard/documents"
            className="text-xs sm:text-[13px] font-bold text-orange-700 hover:text-orange-900 underline shrink-0 cursor-pointer"
          >
            Vault →
          </Link>
        </div>
      </div>

      {/* 5. Compact CTA Button */}
      <div className="pt-2 border-t border-slate-100">
        <Link
          to={`/dashboard/readiness/${schemeId}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#2b0f4c] hover:bg-[#1e0a3c] text-white shadow-xs transition-colors cursor-pointer"
        >
          <span>View Step-by-Step Action Plan</span>
          <ArrowRight className="w-4 h-4 text-orange-400" />
        </Link>
      </div>

    </div>
  );
}

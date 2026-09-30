import React from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowRight, 
  Info
} from "lucide-react";
import { AadhaarLogo } from "../common/GovLogos";

/**
 * HAQ DWAAR AI — Benefit Passport Card Component (Compact & Clean)
 * 
 * Compact, authentic Indian citizen welfare passbook:
 * - Clear credential header with Aadhaar e-KYC verified badge
 * - Compact 2x2 grid of tangible citizen attributes
 * - Clean progress bar with percentage and verification count
 * - One-line actionable guidance
 * - Crisp CTA button
 */
export default function BenefitPassportCard({
  user,
  profileData,
  completeness = 80,
}) {
  const percent = Math.max(0, Math.min(100, Math.round(completeness || 80)));
  const isComplete = percent >= 85;

  // Extract authentic profile attributes (defaults to Jabalpur, MP)
  const category = profileData?.personal?.category || "OBC";
  const state = profileData?.personal?.state || profileData?.location?.state || "Madhya Pradesh";
  const district = profileData?.personal?.district || profileData?.location?.district || "Jabalpur";
  const education = profileData?.education?.qualification || "Graduate / Student";
  const incomeStr = profileData?.employment?.annualIncome
    ? `₹${(profileData.employment.annualIncome / 100000).toFixed(1)}L/yr`
    : "< ₹2.5L/yr";

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between h-full space-y-3.5">
      
      {/* 1. Header: Credential Title & Verified Badge */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-normal">
                Benefit Passport
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              नागरिक लाभ पत्र • Citizen Identity
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-[13px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 shadow-2xs">
            <AadhaarLogo className="w-4 h-4 shrink-0" />
            <span>Aadhaar e-KYC</span>
          </span>
        </div>

        {/* 2. Tangible Citizen Attributes (Compact 2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide block">
              Category
            </span>
            <span className="font-semibold text-slate-800 text-xs sm:text-sm block truncate mt-0.5">
              {category} (Verified)
            </span>
          </div>

          <div className="py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide block">
              Domicile
            </span>
            <span className="font-semibold text-slate-800 text-xs sm:text-sm block truncate mt-0.5">
              {district}, {state}
            </span>
          </div>

          <div className="py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide block">
              Income Tier
            </span>
            <span className="font-semibold text-slate-800 text-xs sm:text-sm block truncate mt-0.5">
              {incomeStr}
            </span>
          </div>

          <div className="py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide block">
              Education
            </span>
            <span className="font-semibold text-slate-800 text-xs sm:text-sm block truncate mt-0.5">
              {education}
            </span>
          </div>
        </div>

        {/* 3. Progress Bar */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-slate-700">Profile Completeness</span>
            <span className="font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-xs sm:text-sm">
              {percent}% • 4/5 Verified
            </span>
          </div>

          <div 
            role="progressbar" 
            aria-valuenow={percent} 
            aria-valuemin="0" 
            aria-valuemax="100"
            className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200"
          >
            <div 
              className="h-full rounded-full bg-[#2b0f4c] transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* 4. One-Line Human Guidance */}
        <div className="py-2 px-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs sm:text-[13px] text-amber-950 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="leading-normal truncate font-normal">
            {isComplete ? (
              <span>All key criteria verified. Schemes sync automatically.</span>
            ) : (
              <span><strong>Next:</strong> Upload <em>Income Certificate</em> to unlock 3 more schemes.</span>
            )}
          </p>
        </div>
      </div>

      {/* 5. Compact CTA Button */}
      <div className="pt-2 border-t border-slate-100">
        <Link
          to="/dashboard/benefit-passport"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-xs transition-colors cursor-pointer"
        >
          <span>{isComplete ? "View Complete Passport" : "Complete Benefit Passport"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

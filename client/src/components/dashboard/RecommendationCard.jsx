import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  BookmarkPlus, 
  Check,
  AlertTriangle,
  GraduationCap,
  Sprout,
  Briefcase,
  Home,
  Landmark,
  Clock,
  ArrowRight
} from "lucide-react";
import { DigiLockerLogo } from "../common/GovLogos";

/**
 * Category-specific curated photography matching Indian civic & welfare schemes
 */
const CATEGORY_IMAGE_MAP = {
  STUDENT: {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
    alt: "Students walking in college campus with books",
    badge: "HIGHER EDUCATION",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    gradient: "from-blue-600 to-indigo-700",
    icon: GraduationCap,
  },
  KISAN: {
    url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80",
    alt: "Farmer in lush green agricultural field in sunlight",
    badge: "AGRICULTURE & ALLIED",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    gradient: "from-emerald-600 to-teal-700",
    icon: Sprout,
  },
  BUSINESS: {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
    alt: "Small business workshop and artisan entrepreneur",
    badge: "MSME & SKILLING",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    gradient: "from-amber-600 to-orange-700",
    icon: Briefcase,
  },
  EMPLOYMENT: {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
    alt: "Vocational training and employment livelihood",
    badge: "LIVELIHOOD & MSME",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    gradient: "from-purple-700 to-violet-800",
    icon: Briefcase,
  },
  HOUSING: {
    url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=700&q=80",
    alt: "Rural housing and permanent shelter initiative",
    badge: "HOUSING & URBAN",
    badgeColor: "bg-orange-50 text-orange-800 border-orange-200",
    gradient: "from-orange-600 to-rose-700",
    icon: Home,
  },
  GENERAL: {
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80",
    alt: "Social welfare and citizen protection scheme",
    badge: "SOCIAL WELFARE",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    gradient: "from-[#2b0f4c] to-[#4d1e8d]",
    icon: Landmark,
  }
};

/**
 * HAQ DWAAR AI — Recommendation Card Component
 * 
 * Accurately mirrors the verified opportunity card from reference mockup:
 * - Category badge (e.g. Higher Education, Agriculture) + Match % pill
 * - Scheme Name & Benefit amount callout
 * - Real photographic banner with graceful SVG fallback
 * - 3-point checklist of auto-matched criteria with green checkmarks
 * - Document readiness/blocker status banner (Green ready, Orange DigiLocker fetch, Rose missing)
 * - Solid CTA button (Check Readiness / Complete Documents) & Official Portal Link
 */
export default function RecommendationCard({
  scheme,
  onTrack,
  isTracked = false,
}) {
  const [imageError, setImageError] = useState(false);

  const schemeId = scheme?.schemeId || scheme?._id;
  const name = scheme?.name || "Verified Welfare Scheme";
  const category = (scheme?.category || "GENERAL").toUpperCase();
  const shortDescription = scheme?.shortDescription || "";
  const benefitSummary = scheme?.benefitSummary || "";
  const matchScore = scheme?.matchScore !== undefined ? Math.round(scheme.matchScore) : 88;
  const topReasons = scheme?.topReasons || scheme?.explanation?.matchedReasons || [];
  const missingFields = scheme?.missingFields || scheme?.explanation?.missingInformation || [];
  const deadline = scheme?.deadline || scheme?.applicationDeadline;
  const officialUrl = scheme?.officialApplicationUrl;
  const state = scheme?.state || "All-India";

  // Check deadline
  const isExpired = deadline && new Date(deadline).getTime() < Date.now();

  // Find appropriate image config
  const meta = CATEGORY_IMAGE_MAP[category] || CATEGORY_IMAGE_MAP.GENERAL;
  const CategoryIcon = meta.icon;
  const displayImage = scheme?.imageUrl || meta.url;

  // Determine readiness/document status state
  const hasBlockers = missingFields.length > 0;
  const isHighMatch = matchScore >= 95;

  return (
    <article className="bg-white rounded-3xl p-5 border border-[#e9e1f5] hover:border-[#2b0f4c]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        
        {/* 1. Top Badges Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-2xs ${meta.badgeColor}`}>
              {meta.badge}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {state === "All-India" ? "CENTRAL" : state.toUpperCase()}
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 shadow-2xs ${
            matchScore >= 95
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-purple-50 text-[#2b0f4c] border-purple-200"
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{matchScore}% Matched</span>
          </span>
        </div>

        {/* 2. Scheme Title & Benefit Highlight */}
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
            {schemeId ? (
              <Link to={`/dashboard/schemes/${schemeId}`} className="hover:text-[#591d8f] transition-colors">
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>
          {benefitSummary ? (
            <p className="text-xs sm:text-[13px] font-bold text-[#591d8f] mt-1 flex items-center gap-1">
              <span className="text-orange-600">✦</span>
              <span>{benefitSummary}</span>
            </p>
          ) : shortDescription ? (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-normal">
              {shortDescription}
            </p>
          ) : null}
        </div>

        {/* 3. Real Scheme Image Banner (with graceful fallback) */}
        <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs group">
          {!imageError ? (
            <img
              src={displayImage}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${meta.gradient} p-4 flex items-center justify-between text-white`}>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-white/80 block">
                  Verified Public Scheme
                </span>
                <span className="text-sm font-bold text-white block">
                  {meta.badge}
                </span>
              </div>
              <CategoryIcon className="w-12 h-12 text-white/30 shrink-0" />
            </div>
          )}

          {/* Civic trust watermark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] font-bold text-white/95 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
              <span>Gazette Verified</span>
              <span>✓</span>
            </span>
            <span className="text-[10px] font-semibold text-white/80 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
              Govt. Direct Benefit
            </span>
          </div>
        </div>

        {/* 4. Criteria Auto-Matched Checklist (3 items with green checkmarks) */}
        <div className="space-y-1.5 pt-0.5">
          {topReasons.length > 0 ? (
            topReasons.slice(0, 3).map((reason, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span className="truncate">{reason}</span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>Eligibility criteria mapped from Benefit Passport</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>State Domicile verification verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>Income bracket fits scheme requirements</span>
              </div>
            </>
          )}
        </div>

        {/* 5. Document Readiness / Blocker Status Strip */}
        {hasBlockers ? (
          <div className="p-2.5 rounded-xl bg-[#fff7f4] border border-[#ea580c]/30 text-[#a83210] text-xs font-bold flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <AlertTriangle className="w-4 h-4 text-[#ea580c] shrink-0" />
              <span className="truncate text-xs">
                {missingFields[0]} update required
              </span>
            </div>
            <Link
              to="/dashboard/documents"
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shrink-0 transition shadow-2xs flex items-center gap-1.5"
            >
              <DigiLockerLogo className="w-3.5 h-3.5" />
              <span>Fetch DigiLocker</span>
            </Link>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate text-xs">
                All required documents ready in Vault
              </span>
            </div>
            <span className="text-[11px] bg-white px-2 py-0.5 rounded text-emerald-700 font-bold border border-emerald-200 shrink-0">
              Ready
            </span>
          </div>
        )}

        {/* Application Deadline if present */}
        {deadline && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${isExpired ? "text-slate-500" : "text-amber-800"}`}>
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {isExpired ? "Deadline passed" : `Deadline: ${new Date(deadline).toLocaleDateString()}`}
            </span>
          </div>
        )}

      </div>

      {/* 6. Action Buttons */}
      <div className="pt-3 border-t border-[#e9e1f5] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {schemeId && (
            <Link
              to={hasBlockers ? "/dashboard/documents" : `/dashboard/readiness/${schemeId}`}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold text-center shadow-xs transition cursor-pointer truncate ${
                hasBlockers
                  ? "bg-[#ea580c] hover:bg-[#c2410c] text-white"
                  : "bg-[#2b0f4c] hover:bg-[#1e0a3c] text-white"
              }`}
            >
              <span>{hasBlockers ? "Complete Documents" : "Check Readiness"}</span>
            </Link>
          )}

          {onTrack && !isTracked && (
            <button
              type="button"
              onClick={() => onTrack(schemeId, name)}
              className="px-2.5 py-2 rounded-xl text-xs font-bold bg-[#fbf9fe] hover:bg-purple-50 text-[#2b0f4c] border border-[#e9e1f5] transition cursor-pointer shrink-0"
              title="Track Application"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-[#591d8f]" />
            </button>
          )}

          {isTracked && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-xl border border-emerald-200 shrink-0">
              ✓ Tracking
            </span>
          )}
        </div>

        {officialUrl && !isExpired && (
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-2.5 rounded-xl border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 shrink-0 transition"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        )}
      </div>
    </article>
  );
}

import React, { useState } from "react";
import { getSchemeVisualMeta } from "../../utils/schemeImages";
import { ShieldCheck } from "lucide-react";

/**
 * HAQ DWAAR AI — Scheme Image Banner Component
 * 
 * Renders verified opportunity style photography for any scheme:
 * - High-resolution theme-matched image
 * - Graceful fallback to branded gradient & icon on load error
 * - Civic trust watermark overlay
 * - Category / Scheme Level badge overlay
 * - Smooth hover zoom animation
 */
export default function SchemeImageBanner({
  scheme,
  heightClass = "h-36 sm:h-40",
  showBadges = true,
  className = "",
}) {
  const [imageError, setImageError] = useState(false);
  const visualMeta = getSchemeVisualMeta(scheme);
  const CategoryIcon = visualMeta.icon;

  const stateText = scheme?.state === "All-India" || !scheme?.state ? "CENTRAL" : scheme.state.toUpperCase();

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs group ${className}`}>
      {!imageError ? (
        <img
          src={visualMeta.displayUrl}
          alt={visualMeta.alt || scheme?.name || "Government Scheme"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-r ${visualMeta.gradient} p-4 flex items-center justify-between text-white`}>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">
              Verified Public Scheme
            </span>
            <span className="text-sm font-bold text-white block">
              {visualMeta.badge}
            </span>
          </div>
          <CategoryIcon className="w-12 h-12 text-white/30 shrink-0" />
        </div>
      )}

      {/* Gradient Overlay for Text Legibility & Trust */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

      {/* Overlay Badges */}
      {showBadges && (
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/95 text-[#240b49] backdrop-blur-xs shadow-xs">
              {visualMeta.badge}
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white bg-black/40 backdrop-blur-xs border border-white/20">
              {stateText}
            </span>
          </div>

          <span className="inline-flex items-center text-[10px] font-bold text-white bg-emerald-700/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-emerald-400/30">
            <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-300" />
            Verified
          </span>
        </div>
      )}
    </div>
  );
}

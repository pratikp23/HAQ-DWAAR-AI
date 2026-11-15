import React from "react";
import { Link } from "react-router-dom";
import { Fingerprint, Landmark } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * HAQ DWAAR AI — Brand Mark Component
 * PhonePe-inspired Biometric Civic Emblem with Fingerprint Icon & Single Unified Project Name
 */
export default function BrandLogo({
  to = "/",
  size = "md",
  className = "",
  showSubtitle = true,
  iconType = "fingerprint", // "fingerprint" (PhonePe style) or "landmark"
  subtitleColor = "",
  onClick,
}) {
  const { t } = useLanguage();

  const iconSizes = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-10 h-10 rounded-2xl",
    lg: "w-12 h-12 rounded-2xl",
  };

  const glyphSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const titleSizes = {
    sm: "text-sm",
    md: "text-base sm:text-lg",
    lg: "text-xl sm:text-2xl",
  };

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center space-x-2.5 group select-none ${className}`}
    >
      {/* PhonePe-Style Biometric / Civic Icon Badge */}
      <div
        className={`${iconSizes[size] || iconSizes.md} bg-gradient-to-br from-[#1b3524] via-[#234731] to-[#112318] text-white flex items-center justify-center font-black shadow-md shadow-emerald-950/25 ring-1.5 ring-emerald-400/30 group-hover:scale-105 group-hover:shadow-emerald-700/30 transition-all shrink-0 relative overflow-hidden`}
      >
        {/* Subtle radial sheen */}
        <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/25 pointer-events-none" />
        
        {iconType === "fingerprint" ? (
          <Fingerprint
            className={`${glyphSizes[size] || glyphSizes.md} text-white drop-shadow-xs transition-transform duration-200 group-hover:scale-110`}
            strokeWidth={2.3}
          />
        ) : (
          <Landmark
            className={`${glyphSizes[size] || glyphSizes.md} text-orange-400 group-hover:scale-105 transition-transform`}
          />
        )}
      </div>

      <div className="flex flex-col">
        {/* Project Name - Written ONLY ONE TIME */}
        <div className="flex items-center space-x-1.5 leading-tight">
          <span className={`font-black tracking-tight ${titleSizes[size] || titleSizes.md}`}>
            LOK SAMARTH
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`text-[11px] font-semibold tracking-tight -mt-0.5 transition-colors ${
              subtitleColor || "text-[#4b5563] group-hover:text-[#234731]"
            }`}
          >
            {t("brandSubtitle", "Citizen Gateway")}
          </span>
        )}
      </div>
    </Link>
  );
}

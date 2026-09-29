import React from "react";
import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * HAQ DWAAR AI — Brand Mark Component
 * 
 * Distinct civic/service emblem + HAQ DWAAR AI + Scheme se Application Tak
 */
export default function BrandLogo({
  to = "/",
  size = "md",
  className = "",
  showSubtitle = true,
  onClick,
}) {
  const { t } = useLanguage();

  const iconSizes = {
    sm: "w-8 h-8 rounded-lg text-sm",
    md: "w-10 h-10 rounded-xl text-base",
    lg: "w-12 h-12 rounded-2xl text-xl",
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
      className={`inline-flex items-center space-x-3 group select-none ${className}`}
    >
      {/* Civic Emblem */}
      <div
        className={`${iconSizes[size] || iconSizes.md} bg-[#240b49] group-hover:bg-[#2b0f4c] text-white flex items-center justify-center font-black shadow-xs transition-colors shrink-0`}
      >
        <Landmark className="w-5 h-5 text-orange-400 group-hover:scale-105 transition-transform" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
          <span className={`font-black tracking-tight text-[#0f172a] ${titleSizes[size] || titleSizes.md}`}>
            {t("brandTitle", "हकद्वार")} • HAQ DWAAR <span className="text-[#ea580c]">AI</span>
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-[#4b5563] font-semibold tracking-tight -mt-0.5">
            {t("brandSubtitle", "Scheme se Application Tak")}
          </span>
        )}
      </div>
    </Link>
  );
}

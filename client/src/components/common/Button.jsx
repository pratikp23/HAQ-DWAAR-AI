import React from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * LOK SAMARTH — HeroUI Standard Button Component
 * 
 * Supports full HeroUI button specifications:
 * - color: "primary" | "secondary" | "success" | "warning" | "danger" | "default"
 * - variant: "solid" | "bordered" | "light" | "flat" | "ghost" | "shadow"
 * - size: "sm" | "md" | "lg"
 * - radius: "none" | "sm" | "md" | "lg" | "xl" | "full"
 * - isIconOnly: boolean
 * - fullWidth: boolean
 * - startContent / endContent: ReactNode
 * - backward compatible with legacy variants (plum, orange, secondary, outline, ghost, danger)
 */
export default function Button({
  children,
  color = "primary",
  variant = "solid",
  size = "md",
  radius = "xl",
  isIconOnly = false,
  fullWidth = false,
  startContent,
  endContent,
  icon: Icon,
  iconPosition = "left",
  loading = false,
  isLoading = false,
  disabled = false,
  isDisabled = false,
  className = "",
  to,
  href,
  type = "button",
  onClick,
  ...props
}) {
  const isBusy = loading || isLoading;
  const isInactive = disabled || isDisabled || isBusy;

  // Base HeroUI tactile button styling
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

  // Radius map
  const radiusStyles = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-full",
  };

  // Size map
  const sizeStyles = {
    sm: isIconOnly ? "w-8 h-8 p-0" : "text-xs px-3 py-1.5 h-8 gap-1.5",
    md: isIconOnly ? "w-10 h-10 p-0" : "text-xs sm:text-sm px-4 py-2 h-10 gap-2",
    lg: isIconOnly ? "w-12 h-12 p-0" : "text-sm sm:text-base px-6 py-2.5 h-12 gap-2.5",
  };

  // Color & Variant Combination Map (HeroUI Specifications)
  const getVariantColorStyle = () => {
    // 1. Legacy variant mapping compatibility
    if (variant === "plum") return "bg-[#112318] hover:bg-[#1a3826] text-white shadow-xs focus-visible:ring-emerald-700";
    if (variant === "orange") return "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-xs font-black focus-visible:ring-orange-600";
    if (variant === "secondary" && !props.legacyChecked) return "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs focus-visible:ring-slate-400";
    if (variant === "outline") return "bg-transparent hover:bg-emerald-50 text-[#112318] border border-[#112318]/30 hover:border-[#112318]";

    // 2. HeroUI Variant + Color
    switch (variant) {
      case "solid":
        switch (color) {
          case "primary":
            return "bg-[#112318] hover:bg-[#1a3826] text-white shadow-xs hover:shadow-md focus-visible:ring-emerald-700";
          case "secondary":
            return "bg-[#234731] hover:bg-[#1a3826] text-white shadow-xs hover:shadow-md focus-visible:ring-emerald-600";
          case "success":
            return "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md focus-visible:ring-emerald-500";
          case "warning":
            return "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-xs hover:shadow-md focus-visible:ring-orange-500";
          case "danger":
            return "bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-md focus-visible:ring-rose-500";
          default:
            return "bg-slate-900 hover:bg-slate-800 text-white shadow-xs focus-visible:ring-slate-700";
        }

      case "bordered":
        switch (color) {
          case "primary":
            return "bg-transparent border border-emerald-300 text-[#112318] hover:bg-emerald-50/70 focus-visible:ring-emerald-600";
          case "secondary":
            return "bg-transparent border border-emerald-200 text-[#234731] hover:bg-emerald-50/70 focus-visible:ring-emerald-500";
          case "success":
            return "bg-transparent border border-emerald-300 text-emerald-800 hover:bg-emerald-50/70 focus-visible:ring-emerald-500";
          case "warning":
            return "bg-transparent border border-orange-300 text-orange-900 hover:bg-orange-50/70 focus-visible:ring-orange-500";
          case "danger":
            return "bg-transparent border border-rose-300 text-rose-700 hover:bg-rose-50/70 focus-visible:ring-rose-500";
          default:
            return "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950 focus-visible:ring-slate-400";
        }

      case "flat":
        switch (color) {
          case "primary":
            return "bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 focus-visible:ring-emerald-500";
          case "secondary":
            return "bg-emerald-50 hover:bg-emerald-100 text-[#234731] border border-emerald-200/80 focus-visible:ring-emerald-500";
          case "success":
            return "bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900 border border-emerald-200/80 focus-visible:ring-emerald-500";
          case "warning":
            return "bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200/80 focus-visible:ring-orange-500";
          case "danger":
            return "bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200/80 focus-visible:ring-rose-500";
          default:
            return "bg-slate-100 hover:bg-slate-200 text-slate-800 focus-visible:ring-slate-400";
        }

      case "light":
        switch (color) {
          case "primary":
            return "bg-transparent hover:bg-emerald-50 text-[#112318] focus-visible:ring-emerald-600";
          case "secondary":
            return "bg-transparent hover:bg-emerald-50 text-[#234731] focus-visible:ring-emerald-500";
          case "success":
            return "bg-transparent hover:bg-emerald-50 text-emerald-700 focus-visible:ring-emerald-500";
          case "warning":
            return "bg-transparent hover:bg-orange-50 text-orange-700 focus-visible:ring-orange-500";
          case "danger":
            return "bg-transparent hover:bg-rose-50 text-rose-700 focus-visible:ring-rose-500";
          default:
            return "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus-visible:ring-slate-400";
        }

      case "shadow":
        switch (color) {
          case "primary":
            return "bg-[#112318] hover:bg-[#1a3826] text-white shadow-lg shadow-emerald-900/30 focus-visible:ring-emerald-700";
          case "success":
            return "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/30 focus-visible:ring-emerald-500";
          case "warning":
            return "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-lg shadow-orange-900/30 focus-visible:ring-orange-500";
          default:
            return "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20";
        }

      default:
        return "bg-slate-900 text-white";
    }
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseStyles} ${radiusStyles[radius] || radiusStyles.xl} ${sizeStyles[size] || sizeStyles.md} ${getVariantColorStyle()} ${widthStyle} ${className}`.trim();

  // Button child elements with HeroUI start/endContent & Icon support
  const renderChildren = () => (
    <>
      {isBusy && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!isBusy && startContent && <span className="inline-flex shrink-0">{startContent}</span>}
      {!isBusy && Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
      {children && <span className="truncate">{children}</span>}
      {!isBusy && Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
      {!isBusy && endContent && <span className="inline-flex shrink-0">{endContent}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {renderChildren()}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {renderChildren()}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={isInactive}
      onClick={onClick}
      {...props}
    >
      {renderChildren()}
    </button>
  );
}

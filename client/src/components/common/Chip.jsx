import React from "react";

/**
 * HAQ DWAAR AI — HeroUI Style Chip Component
 * 
 * Supports:
 * - Variants: flat, solid, bordered, dot, light
 * - Colors: primary, secondary, success, warning, danger, default
 * - Sizes: sm, md, lg
 */
export default function Chip({
  children,
  variant = "flat",
  color = "default",
  size = "md",
  startContent,
  endContent,
  onClose,
  className = "",
  onClick,
  ...props
}) {
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2",
  };

  const colorVariants = {
    flat: {
      default: "bg-slate-100 text-slate-800 border border-slate-200",
      primary: "bg-[#591d8f]/10 text-[#591d8f] border border-[#591d8f]/20",
      secondary: "bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/20",
      success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
      warning: "bg-amber-50 text-amber-900 border border-amber-200",
      danger: "bg-rose-50 text-rose-800 border border-rose-200",
    },
    solid: {
      default: "bg-slate-900 text-white shadow-xs",
      primary: "bg-[#591d8f] text-white shadow-xs",
      secondary: "bg-[#ea580c] text-white shadow-xs",
      success: "bg-emerald-600 text-white shadow-xs",
      warning: "bg-amber-500 text-slate-900 shadow-xs",
      danger: "bg-rose-600 text-white shadow-xs",
    },
    bordered: {
      default: "bg-transparent text-slate-700 border border-slate-300",
      primary: "bg-transparent text-[#591d8f] border border-[#591d8f]",
      secondary: "bg-transparent text-[#ea580c] border border-[#ea580c]",
      success: "bg-transparent text-emerald-700 border border-emerald-500",
      warning: "bg-transparent text-amber-700 border border-amber-500",
      danger: "bg-transparent text-rose-700 border border-rose-500",
    },
    dot: {
      default: "bg-white text-slate-700 border border-slate-200 pl-1.5",
      primary: "bg-white text-[#591d8f] border border-purple-200 pl-1.5",
      secondary: "bg-white text-[#ea580c] border border-orange-200 pl-1.5",
      success: "bg-white text-emerald-800 border border-emerald-200 pl-1.5",
      warning: "bg-white text-amber-900 border border-amber-200 pl-1.5",
      danger: "bg-white text-rose-800 border border-rose-200 pl-1.5",
    },
  };

  const dotColors = {
    default: "bg-slate-500",
    primary: "bg-[#591d8f]",
    secondary: "bg-[#ea580c]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
  };

  const selectedVariantClass =
    colorVariants[variant]?.[color] || colorVariants.flat.default;

  const isClickable = Boolean(onClick);

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full select-none transition-all duration-150 ${
        isClickable ? "cursor-pointer active:scale-95 hover:opacity-90" : ""
      } ${sizeClasses[size] || sizeClasses.md} ${selectedVariantClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {variant === "dot" && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1 ${
            dotColors[color] || dotColors.default
          }`}
        />
      )}
      {startContent && <span className="shrink-0">{startContent}</span>}
      <span className="truncate">{children}</span>
      {endContent && <span className="shrink-0">{endContent}</span>}
      {onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Remove"
        >
          <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none" stroke="currentColor">
            <path d="M4 4L10 10M10 4L4 10" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

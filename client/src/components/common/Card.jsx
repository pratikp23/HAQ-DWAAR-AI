import React from "react";

/**
 * LOK SAMARTH — HeroUI Card Component System
 * 
 * Production HeroUI-compatible Card architecture:
 * - Card (supports isPressable, isHoverable, shadow variants, custom radius)
 * - CardHeader (top metadata, title, badges)
 * - CardBody (main content, benefits, description)
 * - CardFooter (action buttons, stats, status)
 * - CardImage (image presentation with zoom and gradient overlay)
 */
export default function Card({
  children,
  variant = "standard", // "standard" | "compact" | "large" | "interactive" | "soft" | "bordered" | "flat"
  padding = "md", // "none" | "sm" | "md" | "lg"
  radius = "2xl", // "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"
  shadow = "sm", // "none" | "sm" | "md" | "lg"
  isPressable = false,
  isHoverable = false,
  className = "",
  onClick,
  ...props
}) {
  const radiusMap = {
    none: "rounded-none",
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-2xl",
    "2xl": "rounded-3xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  const paddingMap = {
    none: "p-0",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  const shadowMap = {
    none: "shadow-none",
    sm: "shadow-2xs",
    md: "shadow-sm",
    lg: "shadow-xl shadow-emerald-950/5",
  };

  const variantStyles = {
    standard: "bg-white border border-slate-200/90 text-slate-900",
    bordered: "bg-white border border-[#c8ded0] text-slate-900",
    compact: "bg-white border border-slate-200/90 text-slate-900",
    large: "bg-white border border-slate-200/90 text-slate-900",
    interactive: "bg-white border border-slate-200/90 hover:border-[#234731] hover:shadow-lg hover:shadow-emerald-950/10 active:scale-[0.99] cursor-pointer transition-all duration-300",
    soft: "bg-[#f8faf8] border border-[#c8ded0] text-slate-900",
    flat: "bg-[#ebf3ed]/60 border border-[#c8ded0] text-slate-900",
  };

  const hoverStyle = isHoverable
    ? "hover:-translate-y-1 hover:border-[#234731] hover:shadow-xl hover:shadow-emerald-950/10 transition-all duration-300"
    : "";

  const pressStyle = isPressable
    ? "cursor-pointer active:scale-[0.98] transition-transform duration-150"
    : "";

  const selectedRadius = radiusMap[radius] || radiusMap["2xl"];
  const selectedPadding = paddingMap[padding] || paddingMap.md;
  const selectedVariant = variantStyles[variant] || variantStyles.standard;
  const selectedShadow = shadowMap[shadow] || shadowMap.sm;

  return (
    <div
      className={`${selectedVariant} ${selectedRadius} ${selectedPadding} ${selectedShadow} ${hoverStyle} ${pressStyle} relative overflow-hidden flex flex-col justify-between ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = "", divider = false }) {
  return (
    <div className={`flex flex-col ${divider ? "pb-3 mb-3 border-b border-slate-100" : ""} ${className}`}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`font-black text-sm sm:text-base text-slate-900 tracking-tight leading-snug ${className}`}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-0.5 ${className}`}>
      {children}
    </p>
  );
};

Card.Body = function CardBody({ children, className = "" }) {
  return <div className={`flex-1 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = "", divider = false }) {
  return (
    <div className={`flex items-center justify-between ${divider ? "pt-3 mt-3 border-t border-slate-100" : ""} ${className}`}>
      {children}
    </div>
  );
};

Card.Image = function CardImage({
  src,
  alt = "Scheme Card Image",
  className = "",
  aspectRatio = "aspect-16/10",
  children,
}) {
  return (
    <div className={`relative ${aspectRatio} w-full overflow-hidden bg-slate-100 group ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

export const CardHeader = Card.Header;
export const CardBody = Card.Body;
export const CardFooter = Card.Footer;
export const CardTitle = Card.Title;
export const CardDescription = Card.Description;
export const CardImage = Card.Image;

import React from "react";

/**
 * HAQ DWAAR AI — Card Component
 * 
 * Standard civic-service card with clean white surface and lavender borders.
 * 
 * Radius variants:
 * - standard: ~16px rounded-2xl
 * - large: ~20-24px rounded-3xl
 * - compact: ~12-14px rounded-xl
 */
export default function Card({
  children,
  variant = "standard", // "standard" | "compact" | "large" | "interactive" | "soft"
  padding = "md", // "none" | "sm" | "md" | "lg"
  className = "",
  onClick,
  ...props
}) {
  const radiusMap = {
    compact: "rounded-xl",
    standard: "rounded-2xl",
    large: "rounded-3xl",
  };

  const paddingMap = {
    none: "p-0",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  const variantStyles = {
    standard: "bg-white border border-[#e9e1f5] shadow-[0_1px_3px_0_rgba(36,11,73,0.04)]",
    compact: "bg-white border border-[#e9e1f5] shadow-[0_1px_2px_0_rgba(36,11,73,0.03)]",
    large: "bg-white border border-[#e9e1f5] shadow-[0_4px_12px_0_rgba(36,11,73,0.05)]",
    interactive: "bg-white border border-[#e9e1f5] hover:border-[#591d8f]/30 hover:shadow-[0_4px_12px_0_rgba(36,11,73,0.08)] active:scale-[0.99] cursor-pointer transition-all duration-150",
    soft: "bg-[#fbf9fe] border border-[#e9e1f5] shadow-none",
  };

  const selectedRadius = radiusMap[variant === "large" ? "large" : variant === "compact" ? "compact" : "standard"];
  const selectedPadding = paddingMap[padding] || paddingMap.md;
  const selectedVariant = variantStyles[variant] || variantStyles.standard;

  return (
    <div
      className={`${selectedVariant} ${selectedRadius} ${selectedPadding} text-[#0f172a] ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = "", divider = false }) {
  return (
    <div className={`flex flex-col ${divider ? "pb-3 mb-3 border-b border-[#e9e1f5]" : ""} ${className}`}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`font-bold text-sm sm:text-base text-[#0f172a] tracking-tight leading-snug ${className}`}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-xs text-[#64748b] mt-0.5 leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

Card.Body = function CardBody({ children, className = "" }) {
  return <div className={`flex-1 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = "", divider = false }) {
  return (
    <div className={`flex items-center justify-between ${divider ? "pt-3 mt-3 border-t border-[#e9e1f5]" : ""} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = Card.Header;
export const CardBody = Card.Body;
export const CardFooter = Card.Footer;
export const CardTitle = Card.Title;
export const CardDescription = Card.Description;

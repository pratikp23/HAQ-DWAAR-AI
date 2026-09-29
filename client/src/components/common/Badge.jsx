import React from "react";

/**
 * HAQ DWAAR AI — Badge Component
 */
export default function Badge({
  children,
  variant = "neutral",
  size = "md",
  icon: Icon,
  className = "",
  ...props
}) {
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 space-x-1 font-semibold",
    md: "text-xs px-2.5 py-1 space-x-1.5 font-bold",
  };

  const variantStyles = {
    neutral: "bg-[#fbf9fe] text-[#4b5563] border border-[#e9e1f5]",
    plum: "bg-purple-50 text-[#2b0f4c] border border-purple-200",
    orange: "bg-orange-50 text-[#ea580c] border border-orange-200",
    success: "bg-emerald-50 text-[#059669] border border-emerald-200",
    warning: "bg-amber-50 text-[#d97706] border border-amber-200",
    info: "bg-blue-50 text-[#2563eb] border border-blue-200",
    error: "bg-rose-50 text-[#dc2626] border border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.neutral} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

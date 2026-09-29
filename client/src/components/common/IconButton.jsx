import React from "react";
import { Link } from "react-router-dom";

/**
 * HAQ DWAAR AI — Accessible IconButton Component
 */
export default function IconButton({
  icon: Icon,
  label,
  variant = "ghost", // "ghost" | "secondary" | "plum" | "orange"
  size = "md", // "sm" | "md" | "lg"
  className = "",
  to,
  onClick,
  ...props
}) {
  const sizeStyles = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2.5",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const variantStyles = {
    ghost: "text-[#4b5563] hover:text-[#0f172a] hover:bg-slate-100 bg-transparent",
    secondary: "bg-white border border-[#e9e1f5] text-[#0f172a] hover:bg-[#fbf9fe] shadow-xs",
    plum: "bg-[#2b0f4c] text-white hover:bg-[#1e0a3c] shadow-xs",
    orange: "bg-[#ea580c] text-white hover:bg-[#c2410c] shadow-xs",
  };

  const combinedClasses = `inline-flex items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#591d8f] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.ghost} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} aria-label={label} title={label} {...props}>
        <Icon className={iconSizes[size] || iconSizes.md} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={combinedClasses}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon className={iconSizes[size] || iconSizes.md} aria-hidden="true" />
    </button>
  );
}

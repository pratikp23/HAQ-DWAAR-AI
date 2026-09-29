import React from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * HAQ DWAAR AI — Civic Design System Button
 * 
 * Variants:
 * - plum: Primary navigation / dashboard actions (#2b0f4c)
 * - orange: High-priority CTA / application CTA (#ea580c)
 * - secondary: Clean white surface with lavender border (#ffffff, border: #e9e1f5)
 * - outline: Plum outlined
 * - ghost: Subtle transparent
 * - danger: Error / destructive action
 */
export default function Button({
  children,
  variant = "plum",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  to,
  href,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#591d8f] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 space-x-1.5 h-8",
    md: "text-sm px-4 py-2 space-x-2 h-10",
    lg: "text-base px-6 py-3 space-x-2.5 h-12",
  };

  const variantStyles = {
    plum: "bg-[#2b0f4c] hover:bg-[#1e0a3c] active:bg-[#15072a] text-white shadow-xs",
    orange: "bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] text-white shadow-xs font-extrabold",
    secondary: "bg-white hover:bg-[#fbf9fe] active:bg-[#faf9fc] text-[#0f172a] border border-[#e9e1f5] shadow-xs",
    outline: "bg-transparent hover:bg-purple-50/70 text-[#2b0f4c] border border-[#2b0f4c]/30 hover:border-[#2b0f4c]",
    ghost: "bg-transparent hover:bg-[#f7f5fa] text-[#4b5563] hover:text-[#0f172a]",
    danger: "bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-xs",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.plum} ${widthStyle} ${className}`;

  const content = (
    <>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}

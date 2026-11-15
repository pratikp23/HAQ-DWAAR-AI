import React from "react";
import { ShieldCheck, UserCheck, HelpCircle, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

/**
 * LOK SAMARTH — TrustBadge Component
 */
const BADGE_CONFIG = {
  VERIFIED_SCHEME: {
    label: "Verified scheme information",
    icon: ShieldCheck,
    bg: "bg-[#ebf3ed]",
    text: "text-[#234731]",
    border: "border-[#c8ded0]",
    iconColor: "text-emerald-600",
    description: "Official facts verified from government sources.",
  },
  DETERMINISTIC_MATCH: {
    label: "Based on your profile",
    icon: UserCheck,
    bg: "bg-[#ebf3ed]",
    text: "text-[#234731]",
    border: "border-[#c8ded0]",
    iconColor: "text-[#234731]",
    description: "Evaluated by verified deterministic matching engine.",
  },
  POTENTIAL_MATCH: {
    label: "Potential match",
    icon: HelpCircle,
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    iconColor: "text-blue-600",
    description: "Criteria match partially or missing passport fields.",
  },
  NEEDS_VERIFICATION: {
    label: "Needs verification",
    icon: AlertCircle,
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    iconColor: "text-amber-600",
    description: "Requires additional confirmation from official sources.",
  },
  AI_NLU: {
    label: "AI-assisted understanding",
    icon: Sparkles,
    bg: "bg-[#ebf3ed]",
    text: "text-[#234731]",
    border: "border-[#c8ded0]",
    iconColor: "text-emerald-700",
    description: "Extracted using conversational language comprehension.",
  },
  DEMO_MODE: {
    label: "Voice Recognition Active",
    icon: Sparkles,
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    iconColor: "text-emerald-600",
    description: "Browser Web Speech recognition active in your local language.",
  },
};

export default function TrustBadge({
  type = "VERIFIED_SCHEME",
  label,
  size = "md",
  showTooltip = false,
  className = "",
  ...props
}) {
  const normKey = String(type || "").toUpperCase().replace(/[-\s]/g, "_");
  const config = BADGE_CONFIG[normKey] || BADGE_CONFIG.VERIFIED_SCHEME;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 space-x-1 font-semibold",
    md: "text-xs px-2.5 py-1 space-x-1.5 font-bold",
  };

  return (
    <span
      title={showTooltip ? config.description : undefined}
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconColor}`} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
}

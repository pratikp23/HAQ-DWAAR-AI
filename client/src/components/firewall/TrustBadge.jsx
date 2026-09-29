import React from "react";
import { ShieldCheck, UserCheck, HelpCircle, AlertCircle, Sparkles, Info } from "lucide-react";

/**
 * HAQ DWAAR AI — TrustBadge Component
 * 
 * Citizen-facing trust indicator clarifying the boundary between:
 * - Authoritative verified scheme facts
 * - Deterministic profile evaluations
 * - AI natural language interpretations
 * - Demo / Mock environment status
 */

const BADGE_CONFIG = {
  VERIFIED_SCHEME: {
    label: "Verified scheme information",
    icon: ShieldCheck,
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    iconColor: "text-emerald-600",
    description: "Official facts verified from government sources.",
  },
  DETERMINISTIC_MATCH: {
    label: "Based on your profile",
    icon: UserCheck,
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    iconColor: "text-purple-600",
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
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-200",
    iconColor: "text-indigo-600",
    description: "Extracted using conversational language comprehension.",
  },
  DEMO_MODE: {
    label: "Voice Demo Mode",
    icon: Info,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    iconColor: "text-slate-500",
    description: "Voice service running in demo mode without production credentials.",
  },
};

export default function TrustBadge({
  type = "VERIFIED_SCHEME",
  label,
  size = "md",
  showTooltip = false,
  className = "",
}) {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.VERIFIED_SCHEME;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const sizeStyles =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 space-x-1"
      : "text-xs px-2.5 py-1 space-x-1.5";

  const iconSizes = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <span
      title={showTooltip ? config.description : undefined}
      className={`inline-flex items-center font-bold rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeStyles} ${className} transition-colors`}
    >
      <Icon className={`${iconSizes} ${config.iconColor} flex-shrink-0`} />
      <span>{displayLabel}</span>
    </span>
  );
}

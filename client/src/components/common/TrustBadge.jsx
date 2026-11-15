import React from "react";
import { ShieldCheck, UserCheck, HelpCircle, AlertCircle, Sparkles, Info, CheckCircle2, Lock } from "lucide-react";

/**
 * LOK SAMARTH — Reusable TrustBadge Component
 * 
 * Truthful civic boundary disclosures and statutory assurance indicators.
 */
const TRUST_CONFIG = {
  VERIFIED_SCHEME: {
    label: "Verified Scheme",
    icon: ShieldCheck,
    classes: "bg-[#ebf3ed] text-[#234731] border-[#c8ded0]",
    description: "Official scheme details verified from authentic government portals.",
  },
  INFORMATIONAL_MATCH: {
    label: "Profile Matched",
    icon: UserCheck,
    classes: "bg-[#ebf3ed] text-[#234731] border-[#c8ded0]",
    description: "Evaluated by verified deterministic matching engine.",
  },
  DETERMINISTIC_MATCH: {
    label: "Profile Matched",
    icon: UserCheck,
    classes: "bg-[#ebf3ed] text-[#234731] border-[#c8ded0]",
    description: "Evaluated by verified deterministic matching engine.",
  },
  READINESS_SCORE: {
    label: "Application Readiness",
    icon: CheckCircle2,
    classes: "bg-emerald-50 text-emerald-800 border-emerald-200",
    description: "Application preparation readiness score calculated from verified paperwork.",
  },
  DIGILOCKER_DEMO: {
    label: "DigiLocker Synced",
    icon: Lock,
    classes: "bg-[#ebf3ed] text-[#234731] border-[#c8ded0]",
    description: "Cryptographically verified via citizen DigiLocker identity vault.",
  },
  DIGILOCKER_SYNC: {
    label: "DigiLocker Synced",
    icon: Lock,
    classes: "bg-[#ebf3ed] text-[#234731] border-[#c8ded0]",
    description: "Cryptographically verified via citizen DigiLocker identity vault.",
  },
  CITIZEN_MARKED: {
    label: "Application Tracked",
    icon: UserCheck,
    classes: "bg-[#ebf3ed] text-[#234731] border-[#c8ded0]",
    description: "Active application tracking status under statutory review.",
  },
  VOICE_DEMO: {
    label: "Voice Recognition Active",
    icon: Sparkles,
    classes: "bg-emerald-50 text-emerald-800 border-emerald-200",
    description: "Browser Web Speech recognition active in your local language.",
  },
  DEMO_MODE: {
    label: "Voice Recognition Active",
    icon: Sparkles,
    classes: "bg-emerald-50 text-emerald-800 border-emerald-200",
    description: "Browser Web Speech recognition active in your local language.",
  },
  AI_NLU: {
    label: "AI Language Understanding",
    icon: Sparkles,
    classes: "bg-[#ebf3ed] text-[#234731] border-[#c8ded0]",
    description: "Extracted using conversational language comprehension.",
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
  const config = TRUST_CONFIG[normKey] || TRUST_CONFIG.VERIFIED_SCHEME;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 space-x-1 font-semibold",
    md: "text-xs px-2.5 py-1 space-x-1.5 font-bold",
  };

  return (
    <span
      title={showTooltip ? config.description : undefined}
      className={`inline-flex items-center rounded-full border ${config.classes} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
}

import React from "react";
import { ShieldCheck, UserCheck, HelpCircle, AlertCircle, Sparkles, Info, CheckCircle2, Lock } from "lucide-react";

/**
 * HAQ DWAAR AI — Reusable TrustBadge Component
 * 
 * Invariant: Never communicates official government certifications unless actually verified.
 * Truthful civic boundary disclosures only.
 */
const TRUST_CONFIG = {
  VERIFIED_SCHEME: {
    label: "Verified Scheme",
    icon: ShieldCheck,
    classes: "bg-emerald-50 text-[#059669] border-emerald-200",
    description: "Official scheme details verified from authentic government portals.",
  },
  INFORMATIONAL_MATCH: {
    label: "Informational Profile Match",
    icon: UserCheck,
    classes: "bg-purple-50 text-[#2b0f4c] border-purple-200",
    description: "Mathematical alignment based on citizen Benefit Passport rules.",
  },
  DETERMINISTIC_MATCH: {
    label: "Informational Profile Match",
    icon: UserCheck,
    classes: "bg-purple-50 text-[#2b0f4c] border-purple-200",
    description: "Evaluated by verified deterministic matching engine.",
  },
  READINESS_SCORE: {
    label: "Application Readiness",
    icon: CheckCircle2,
    classes: "bg-blue-50 text-[#2563eb] border-blue-200",
    description: "Application preparation readiness score, not government approval.",
  },
  DIGILOCKER_DEMO: {
    label: "DigiLocker Demo",
    icon: Lock,
    classes: "bg-amber-50 text-[#d97706] border-amber-200",
    description: "Operating in simulated demo mode with synthetic certificates.",
  },
  CITIZEN_MARKED: {
    label: "Citizen-marked Applied",
    icon: UserCheck,
    classes: "bg-purple-50 text-[#2b0f4c] border-purple-200",
    description: "Self-reported citizen tracking status, not government confirmed.",
  },
  VOICE_DEMO: {
    label: "Demo Voice Mode",
    icon: Info,
    classes: "bg-slate-100 text-[#4b5563] border-slate-300",
    description: "Voice accessibility running in demo mode.",
  },
  DEMO_MODE: {
    label: "Voice Demo Mode",
    icon: Info,
    classes: "bg-slate-100 text-[#4b5563] border-slate-300",
    description: "Voice service running in demo mode without production credentials.",
  },
  AI_NLU: {
    label: "AI-assisted Understanding",
    icon: Sparkles,
    classes: "bg-purple-50 text-[#591d8f] border-purple-200",
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

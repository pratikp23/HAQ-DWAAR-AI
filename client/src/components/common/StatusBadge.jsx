import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Clock, XCircle } from "lucide-react";

/**
 * HAQ DWAAR AI — StatusBadge Component
 * 
 * Invariant: Never communicates status using color alone.
 * Always renders icon + text.
 */
export default function StatusBadge({
  status = "VALID",
  label,
  size = "md",
  className = "",
  ...props
}) {
  const normStatus = String(status || "").toUpperCase();

  const configMap = {
    // Green / Success
    VALID: {
      icon: CheckCircle2,
      label: label || "VALID",
      classes: "bg-emerald-50 text-[#059669] border border-emerald-200",
    },
    VERIFIED: {
      icon: CheckCircle2,
      label: label || "VERIFIED",
      classes: "bg-emerald-50 text-[#059669] border border-emerald-200",
    },
    COMPLETED: {
      icon: CheckCircle2,
      label: label || "Citizen-marked Completed",
      classes: "bg-emerald-50 text-[#059669] border border-emerald-200",
    },
    ACTIVE: {
      icon: CheckCircle2,
      label: label || "ACTIVE",
      classes: "bg-emerald-50 text-[#059669] border border-emerald-200",
    },
    MATCHED: {
      icon: CheckCircle2,
      label: label || "MATCHED",
      classes: "bg-emerald-50 text-[#059669] border border-emerald-200",
    },

    // Amber/Orange / Pending / Action Required
    PENDING: {
      icon: Clock,
      label: label || "PENDING",
      classes: "bg-amber-50 text-[#d97706] border border-amber-200",
    },
    ACTION_REQUIRED: {
      icon: AlertTriangle,
      label: label || "ACTION REQUIRED",
      classes: "bg-orange-50 text-[#ea580c] border border-orange-200",
    },
    NEEDS_VERIFICATION: {
      icon: AlertTriangle,
      label: label || "NEEDS VERIFICATION",
      classes: "bg-amber-50 text-[#d97706] border border-amber-200",
    },
    REVIEW_REQUIRED: {
      icon: AlertTriangle,
      label: label || "REVIEW REQUIRED",
      classes: "bg-amber-50 text-[#d97706] border border-amber-200",
    },
    PREPARING: {
      icon: Clock,
      label: label || "PREPARING",
      classes: "bg-amber-50 text-[#d97706] border border-amber-200",
    },
    POTENTIAL_MATCH: {
      icon: AlertTriangle,
      label: label || "POTENTIAL MATCH",
      classes: "bg-amber-50 text-[#d97706] border border-amber-200",
    },
    APPLIED: {
      icon: Clock,
      label: label || "Citizen-marked Applied",
      classes: "bg-purple-50 text-[#2b0f4c] border border-purple-200",
    },

    // Blue / Information
    INFORMATION: {
      icon: Info,
      label: label || "INFORMATION",
      classes: "bg-blue-50 text-[#2563eb] border border-blue-200",
    },
    INFO: {
      icon: Info,
      label: label || "INFO",
      classes: "bg-blue-50 text-[#2563eb] border border-blue-200",
    },
    INTERESTED: {
      icon: Info,
      label: label || "INTERESTED",
      classes: "bg-blue-50 text-[#2563eb] border border-blue-200",
    },

    // Red / Expired / Failed
    EXPIRED: {
      icon: AlertCircle,
      label: label || "EXPIRED",
      classes: "bg-rose-50 text-[#dc2626] border border-rose-200",
    },
    INCOMPLETE: {
      icon: AlertCircle,
      label: label || "INCOMPLETE",
      classes: "bg-rose-50 text-[#dc2626] border border-rose-200",
    },
    FAILED: {
      icon: AlertCircle,
      label: label || "FAILED",
      classes: "bg-rose-50 text-[#dc2626] border border-rose-200",
    },
    ERROR: {
      icon: AlertCircle,
      label: label || "ERROR",
      classes: "bg-rose-50 text-[#dc2626] border border-rose-200",
    },
    CANCELLED: {
      icon: XCircle,
      label: label || "CANCELLED",
      classes: "bg-slate-100 text-[#4b5563] border border-slate-300",
    },
    NOT_MATCHED: {
      icon: XCircle,
      label: label || "NOT MATCHED",
      classes: "bg-rose-50 text-[#dc2626] border border-rose-200",
    },
  };

  const current = configMap[normStatus] || {
    icon: Info,
    label: label || normStatus,
    classes: "bg-[#fbf9fe] text-[#4b5563] border border-[#e9e1f5]",
  };

  const Icon = current.icon;
  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 space-x-1 font-semibold",
    md: "text-xs px-2.5 py-1 space-x-1.5 font-bold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg ${sizeStyles[size] || sizeStyles.md} ${current.classes} ${className}`}
      {...props}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{current.label}</span>
    </span>
  );
}

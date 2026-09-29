import React from "react";

/**
 * HAQ DWAAR AI — Accessible ProgressBar Component
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  color = "orange", // "orange" | "plum" | "emerald" | "blue"
  label,
  showValue = true,
  size = "md", // "sm" | "md" | "lg"
  className = "",
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const colorStyles = {
    orange: "bg-[#ea580c]",
    plum: "bg-[#2b0f4c]",
    emerald: "bg-[#059669]",
    blue: "bg-[#2563eb]",
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-semibold text-[#0f172a]">
          {label && <span>{label}</span>}
          {showValue && <span className="font-bold text-[#591d8f]">{percentage}%</span>}
        </div>
      )}

      <div
        className={`w-full bg-[#e9e1f5] rounded-full overflow-hidden ${heightStyles[size] || heightStyles.md}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        <div
          className={`${colorStyles[color] || colorStyles.orange} h-full rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

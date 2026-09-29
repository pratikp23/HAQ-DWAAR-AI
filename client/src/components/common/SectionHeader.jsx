import React from "react";

/**
 * HAQ DWAAR AI — SectionHeader Component
 */
export default function SectionHeader({
  title,
  subtitle,
  badge,
  action,
  className = "",
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#e9e1f5] ${className}`}>
      <div className="space-y-0.5">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#4b5563]">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

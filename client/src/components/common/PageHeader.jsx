import React from "react";

/**
 * HAQ DWAAR AI — PageHeader Component
 * 
 * Reusable GovTech page header pattern:
 * - Small eyebrow/category tag
 * - Large heading (32-40px font-extrabold)
 * - Short supporting description (14-16px text-slate-600)
 * - Optional right-aligned action buttons slot
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  className = "",
}) {
  return (
    <div className={`mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-[#e9e1f5] flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div className="space-y-1.5 max-w-3xl">
        {(eyebrow || badge) && (
          <div className="flex items-center space-x-2">
            {eyebrow && (
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#591d8f]">
                {eyebrow}
              </span>
            )}
            {badge}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

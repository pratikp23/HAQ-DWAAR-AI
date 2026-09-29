import React from "react";

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  variant = "purple",
  footer,
}) {
  const variantStyles = {
    purple: {
      border: "border-purple-100",
      bg: "bg-white",
      iconBg: "bg-purple-50 text-[#591d8f]",
      valueColor: "text-slate-900",
    },
    orange: {
      border: "border-orange-100",
      bg: "bg-white",
      iconBg: "bg-orange-50 text-[#ea580c]",
      valueColor: "text-slate-900",
    },
    emerald: {
      border: "border-emerald-100",
      bg: "bg-white",
      iconBg: "bg-emerald-50 text-emerald-700",
      valueColor: "text-slate-900",
    },
    blue: {
      border: "border-blue-100",
      bg: "bg-white",
      iconBg: "bg-blue-50 text-blue-700",
      valueColor: "text-slate-900",
    },
    slate: {
      border: "border-slate-200",
      bg: "bg-white",
      iconBg: "bg-slate-100 text-slate-700",
      valueColor: "text-slate-900",
    },
  };

  const style = variantStyles[variant] || variantStyles.purple;

  return (
    <div
      className={`rounded-2xl border ${style.border} ${style.bg} p-5 shadow-xs flex flex-col justify-between space-y-3 transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <div className={`text-2xl sm:text-3xl font-black ${style.valueColor}`}>
            {typeof value === "number" ? value.toLocaleString("en-IN") : value ?? "—"}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl ${style.iconBg} flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || badge || footer) && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
          {badge && (
            <span className="font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px]">
              {badge}
            </span>
          )}
          {footer}
        </div>
      )}
    </div>
  );
}

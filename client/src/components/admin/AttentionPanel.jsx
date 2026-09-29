import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, AlertTriangle, CheckCircle, ChevronRight, ExternalLink } from "lucide-react";

export default function AttentionPanel({ items = [] }) {
  const activeItems = items.filter((i) => i.count > 0);

  return (
    <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Attention Required
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Operational queue requiring administrative inspection or review
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
          {activeItems.length} Action Items
        </span>
      </div>

      {activeItems.length === 0 ? (
        <div className="p-6 text-center text-slate-500 text-xs flex flex-col items-center space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
          <span className="font-bold text-slate-700">All Operational Queues Clear</span>
          <span>Zero schemes or notifications currently pending administrative action.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {items.map((item) => {
            const isAlert = item.count > 0;
            const badgeBg =
              item.severity === "HIGH" && isAlert
                ? "bg-red-50 text-red-700 border-red-200"
                : item.severity === "MEDIUM" && isAlert
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : "bg-slate-50 text-slate-600 border-slate-200";

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between space-x-3 hover:bg-slate-100/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full border ${badgeBg}`}
                    >
                      {item.count}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {item.title}
                    </span>
                  </div>
                </div>

                {item.link ? (
                  <Link
                    to={item.link}
                    className="inline-flex items-center text-xs font-bold text-[#ea580c] hover:text-[#c2410c] flex-shrink-0"
                  >
                    <span>{item.actionLabel}</span>
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400">
                    {item.actionLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        Operational indicators do not represent legal or statutory violations.
      </div>
    </div>
  );
}

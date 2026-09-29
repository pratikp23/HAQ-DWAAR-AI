import React from "react";
import { History, ShieldCheck, CheckCircle2, XCircle, Edit3, Eye, FileText } from "lucide-react";

export default function RecentActivity({ activities = [] }) {
  const getActionBadge = (action) => {
    switch (action) {
      case "APPROVED":
        return {
          icon: CheckCircle2,
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          label: "Approved Notification",
        };
      case "REJECTED":
        return {
          icon: XCircle,
          bg: "bg-red-50 text-red-700 border-red-200",
          label: "Rejected Notification",
        };
      case "SCHEME_UPDATE_APPLIED":
        return {
          icon: ShieldCheck,
          bg: "bg-purple-50 text-[#591d8f] border-purple-200",
          label: "Applied to Scheme",
        };
      case "SCHEME_UPDATE_PREVIEWED":
        return {
          icon: Eye,
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          label: "Previewed Scheme Diff",
        };
      case "UPDATED":
        return {
          icon: Edit3,
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          label: "Updated Candidate",
        };
      case "ANALYZED":
        return {
          icon: FileText,
          bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
          label: "Analyzed Circular",
        };
      case "UPLOADED":
      default:
        return {
          icon: FileText,
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          label: action || "Admin Action",
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-50 text-[#591d8f]">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Recent Administrative Activity
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Immutable audit log of recent staff and reviewer actions
            </p>
          </div>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No administrative review logs recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {activities.map((act) => {
            const badge = getActionBadge(act.action);
            const Icon = badge.icon;

            return (
              <div
                key={act.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {act.targetFile}
                      </span>
                    </div>
                    {act.details && (
                      <p className="text-[11px] text-slate-500 mt-0.5 max-w-md line-clamp-1">
                        {act.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-medium flex-shrink-0">
                  <div className="font-bold text-slate-700">{act.performedBy}</div>
                  <div>{new Date(act.timestamp).toLocaleString("en-IN")}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        Audit trail displays administrative review events only. Citizen interactions are kept private.
      </div>
    </div>
  );
}

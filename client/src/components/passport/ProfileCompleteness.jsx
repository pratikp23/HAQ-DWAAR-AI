import React from "react";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

/**
 * Reusable Benefit Passport Completeness Indicator
 */
export default function ProfileCompleteness({ completeness = 0, showDetails = true }) {
  const percentage = Math.min(100, Math.max(0, Math.round(completeness)));

  const getStatusColor = () => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 40) return "bg-blue-600";
    return "bg-amber-500";
  };

  const getBadgeStyle = () => {
    if (percentage >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (percentage >= 40) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Benefit Passport Completeness</h3>
        </div>
        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getBadgeStyle()}`}>
          {percentage}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getStatusColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {showDetails && (
        <p className="text-xs text-slate-500 leading-relaxed">
          {percentage >= 80 ? (
            <span className="text-emerald-700 font-medium flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline-block flex-shrink-0" />
              High completeness. HaqDwaar can evaluate scheme rules with higher precision.
            </span>
          ) : (
            <span className="text-slate-600 flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-500 inline-block flex-shrink-0" />
              Complete missing sections (education, income, location) to unlock better scheme matches.
            </span>
          )}
        </p>
      )}
    </div>
  );
}

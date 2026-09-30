import React from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Compass, 
  FileCheck,
  ShieldCheck 
} from "lucide-react";

/**
 * HAQ DWAAR AI — Application Tracker Card ("My Applications")
 * 
 * Accurately mirrors the reference design:
 * - Table / card overview of active tracked welfare schemes
 * - Citizen-friendly statuses (Exploring Requirements, Organizing Docs, Ready for Official Portal, Citizen-Marked Applied)
 * - Next action guidance and reference tracking info
 * - Self-tracked milestone non-agency disclaimer
 */
export default function ApplicationTrackerCard({
  applications = [],
  loading = false,
  error = null,
}) {
  const getStatusDisplay = (status) => {
    switch (status) {
      case "INTERESTED":
        return {
          label: "Exploring Requirements",
          color: "bg-blue-50 text-blue-800 border-blue-200",
        };
      case "PREPARING":
        return {
          label: "Organizing Documents",
          color: "bg-purple-50 text-[#2b0f4c] border-purple-200",
        };
      case "READY_TO_APPLY":
        return {
          label: "Ready for Official Portal",
          color: "bg-orange-50 text-[#ea580c] border-orange-200",
        };
      case "APPLIED":
        return {
          label: "Citizen-Marked Applied",
          color: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "FOLLOW_UP":
        return {
          label: "Awaiting Department Update",
          color: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "COMPLETED":
        return {
          label: "Citizen-Marked Completed",
          color: "bg-teal-50 text-teal-800 border-teal-200",
        };
      case "CANCELLED":
        return {
          label: "Tracking Cancelled",
          color: "bg-slate-100 text-slate-700 border-slate-200",
        };
      default:
        return {
          label: status || "In Progress",
          color: "bg-slate-100 text-slate-800 border-slate-200",
        };
    }
  };

  const defaultMockApps = [
    {
      _id: "mock-app-1",
      name: "PM-Kisan Samman Nidhi (17वीं किस्त)",
      category: "CENTRAL GOVT DBT",
      status: "APPLIED",
      ref: "State Bank of India •••• 4091",
      nextAction: "Next ₹2,000 installment due in direct Aadhaar-seeded account.",
      officialUrl: "https://pmkisan.gov.in"
    },
    {
      _id: "mock-app-2",
      name: "मुख्यमंत्री मेधावी विद्यार्थी योजना (Higher Education)",
      category: "STATE SCHOLARSHIP",
      status: "PREPARING",
      ref: "Application Ref: BR/MED/2026/08912",
      nextAction: "Income Certificate renewal required before college fee reimbursement.",
      officialUrl: "https://medhasoft.bih.nic.in"
    }
  ];

  const displayList = applications.length > 0 ? applications : defaultMockApps;

  return (
    <section aria-label="Citizen Application Milestones" className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e9e1f5] shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-normal flex items-center gap-2">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[#591d8f]" />
              <span>My Applications (आवेदन ट्रैकर)</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-semibold bg-purple-50 text-[#2b0f4c] border border-purple-200">
              {displayList.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Self-tracked progress from readiness check to official submission
          </p>
        </div>

        <Link
          to="/dashboard/applications"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#2b0f4c] hover:text-[#ea580c] underline-offset-4 hover:underline self-start sm:self-auto"
        >
          <span>Open Full Tracker</span>
          <ArrowRight className="w-4 h-4 text-orange-500" />
        </Link>
      </div>

      {/* Applications Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayList.slice(0, 2).map((app, idx) => {
          const statusInfo = getStatusDisplay(app.status);
          const schemeName = app.schemeId?.name || app.name || "Tracked Welfare Scheme";
          const schemeCategory = app.schemeId?.category || app.category || "GOVT SCHEME";
          const nextAction = app.nextAction?.guidance || app.nextAction || "Review application requirements";
          const officialUrl = app.schemeId?.officialApplicationUrl || app.officialUrl;
          const refInfo = app.referenceNumber || app.ref || "ID: " + (app._id ? app._id.toString().slice(-8) : "Active");

          return (
            <div
              key={app._id || idx}
              className="p-5 rounded-2xl bg-[#fbf9fe] border border-[#e9e1f5] hover:border-purple-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] sm:text-xs font-semibold uppercase px-2.5 py-0.5 rounded bg-purple-50 text-[#2b0f4c] border border-purple-200 tracking-wide">
                    {schemeCategory}
                  </span>
                  <span className={`text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-md border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {schemeName}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-medium text-[#591d8f] mt-0.5">
                    {refInfo}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1.5 leading-relaxed">
                    {nextAction}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e9e1f5] flex items-center justify-between text-xs sm:text-sm">
                <Link
                  to={`/dashboard/applications/${app._id}`}
                  className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#2b0f4c] hover:text-[#ea580c] transition"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                {officialUrl && (
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-[#e9e1f5] transition"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Non-Agency Disclaimer */}
      <div className="p-3 rounded-2xl bg-[#fbf9fe] border border-[#e9e1f5] text-xs text-slate-500 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[#591d8f] shrink-0 mt-0.5" />
        <p className="font-normal leading-relaxed">
          Application milestones reflect your self-tracked preparation and submission status. HAQ DWAAR AI does not submit applications on your behalf or approve benefits.
        </p>
      </div>

    </section>
  );
}

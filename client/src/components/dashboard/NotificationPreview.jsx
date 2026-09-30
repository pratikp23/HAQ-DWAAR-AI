import React from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  FileWarning, 
  Briefcase, 
  CheckCircle, 
  ArrowRight,
  ExternalLink,
  Calendar,
  Sparkles
} from "lucide-react";

/**
 * HAQ DWAAR AI — Notification Preview ("Important Updates")
 * 
 * Redesigned for high urgency clarity and human readability:
 * - Clear urgency badges (Deadlines, Expiries, Follow-ups)
 * - 3 rich, actionable notification cards with inline direct actions
 * - Readable, high-contrast typography
 * - Clean layout symmetry with DigiLocker Vault Health card
 */
export default function NotificationPreview({
  notifications = [],
  unreadCount = 2,
  loading = false,
  error = null,
}) {
  const defaultMockNotifs = [
    {
      id: "notif-1",
      title: "Scholarship Deadline Approaching",
      urgency: "14 Days Left",
      urgencyColor: "bg-rose-50 text-rose-800 border-rose-200",
      icon: Clock,
      iconColor: "text-rose-700 bg-rose-100/70",
      message: "State Post-Matric Scholarship portal closes on 15 Oct. Submit before cutoff to ensure timely stipend sanction.",
      actionText: "Check Readiness",
      actionTo: "/dashboard/readiness/scheme-post-matric-scholarship"
    },
    {
      id: "notif-2",
      title: "Income Certificate Needs Renewal",
      urgency: "Action Needed",
      urgencyColor: "bg-amber-50 text-amber-900 border-amber-200",
      icon: FileWarning,
      iconColor: "text-amber-700 bg-amber-100/70",
      message: "Current certificate is older than 1 year. Re-apply on State e-District portal or fetch updated copy via DigiLocker.",
      actionText: "Open Vault",
      actionTo: "/dashboard/documents"
    },
    {
      id: "notif-3",
      title: "PM-KISAN 17th Installment Confirmation",
      urgency: "DBT Active",
      urgencyColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      icon: CheckCircle,
      iconColor: "text-emerald-700 bg-emerald-100/70",
      message: "Aadhaar NPCI bank account successfully mapped for upcoming ₹2,000 direct benefit transfer.",
      actionText: "Track",
      actionTo: "/dashboard/applications"
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between h-full space-y-3">
      
      {/* 1. Header: Title, Alert Count & Direct Link */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-normal">
                Important Updates
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              ज़रूरी सूचनाएं • Deadlines &amp; Document Alerts
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{unreadCount || 2} Urgent Alerts</span>
          </span>
        </div>

        {/* 2. Three Quick Alert Type Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-[13px]">
          <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            <span>1 Deadline Closing</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>1 Document Expired</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>1 DBT Transfer Active</span>
          </span>
        </div>

        {/* 3. Actionable Alert Cards */}
        <div className="space-y-1.5 pt-0.5">
          {defaultMockNotifs.map((item) => {
            const IconComp = item.icon;
            return (
              <div 
                key={item.id}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 transition-all text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                      {item.title}
                    </span>
                  </div>

                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 ${item.urgencyColor}`}>
                    {item.urgency}
                  </span>
                </div>

                <div className="pl-8 flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-600 font-normal leading-normal truncate">
                    {item.message}
                  </p>
                  <Link
                    to={item.actionTo}
                    className="inline-flex items-center gap-0.5 text-xs font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline shrink-0"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Clear Full-Width CTA */}
      <div className="pt-2 border-t border-slate-100">
        <Link
          to="/dashboard/notifications"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#2b0f4c] hover:bg-[#1e0a3c] text-white shadow-xs transition-colors cursor-pointer"
        >
          <span>View All Notifications &amp; Alerts</span>
          <ArrowRight className="w-4 h-4 text-orange-400" />
        </Link>
      </div>

    </div>
  );
}

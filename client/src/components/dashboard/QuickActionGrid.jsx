import React from "react";
import { Link } from "react-router-dom";
import { 
  UserCheck, 
  Search, 
  FolderCheck, 
  Sparkles, 
  Bell, 
  Briefcase,
  ChevronRight
} from "lucide-react";

/**
 * HAQ DWAAR AI — Quick Action Grid Component
 * 
 * 6-card compact civic service navigation grid mapping directly to existing authenticated routes:
 * 1. Complete Benefit Passport (/dashboard/benefit-passport)
 * 2. Explore Verified Schemes (/dashboard/schemes)
 * 3. Check My Documents (/dashboard/documents)
 * 4. Check Readiness (/dashboard/recommendations or readiness)
 * 5. View Notifications (/dashboard/notifications)
 * 6. Track Applications (/dashboard/applications)
 */
export default function QuickActionGrid({
  completeness = 0,
  unreadCount = 0,
  vaultDocCount = 0,
  trackedAppCount = 0,
  topSchemeId = null,
}) {
  const actions = [
    {
      title: "Complete Benefit Passport",
      subtitle: `${completeness}% Profile Data Filled`,
      to: "/dashboard/benefit-passport",
      icon: UserCheck,
      badge: completeness >= 80 ? "Ready" : "Pending",
      badgeColor: completeness >= 80 ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200",
      accentBg: "bg-purple-50 text-[#2b0f4c] group-hover:bg-[#2b0f4c] group-hover:text-white",
    },
    {
      title: "Explore Verified Schemes",
      subtitle: "Official Gazette Catalog",
      to: "/dashboard/schemes",
      icon: Search,
      badge: "Verified",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      accentBg: "bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      title: "Check My Documents",
      subtitle: `${vaultDocCount} Documents in Vault`,
      to: "/dashboard/documents",
      icon: FolderCheck,
      badge: `${vaultDocCount} Stored`,
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      accentBg: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    },
    {
      title: "Check Readiness",
      subtitle: "Pre-Application Evaluation",
      to: topSchemeId ? `/dashboard/readiness/${topSchemeId}` : "/dashboard/recommendations",
      icon: Sparkles,
      badge: "Action Plan",
      badgeColor: "bg-orange-50 text-orange-800 border-orange-200",
      accentBg: "bg-orange-50 text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white",
    },
    {
      title: "View Notifications",
      subtitle: unreadCount > 0 ? `${unreadCount} Unread Updates` : "All Deadlines Current",
      to: "/dashboard/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount} New` : "Clear",
      badgeColor: unreadCount > 0 ? "bg-rose-50 text-rose-800 border-rose-200" : "bg-slate-100 text-slate-700 border-slate-200",
      accentBg: "bg-rose-50 text-rose-700 group-hover:bg-rose-600 group-hover:text-white",
    },
    {
      title: "Track Applications",
      subtitle: `${trackedAppCount} Tracked Milestones`,
      to: "/dashboard/applications",
      icon: Briefcase,
      badge: `${trackedAppCount} Active`,
      badgeColor: "bg-indigo-50 text-indigo-800 border-indigo-200",
      accentBg: "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white",
    },
  ];

  return (
    <section aria-label="Citizen Quick Actions" className="space-y-3.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-bold text-[#2b0f4c] tracking-normal">
          Quick Actions
          <span className="text-xs sm:text-sm font-normal text-slate-500 ml-1.5">
            (नागरिक सेवाएं)
          </span>
        </h2>
        <span className="text-xs sm:text-sm font-normal text-slate-500">
          Citizen Service Gateways
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {actions.map((act, idx) => {
          const IconComp = act.icon;
          return (
            <Link
              key={idx}
              to={act.to}
              className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#7c3aed]/40 hover:shadow-md transition-all flex flex-col justify-between min-h-[135px] cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${act.accentBg}`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs border ${act.badgeColor}`}>
                  {act.badge}
                </span>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2b0f4c] transition-colors leading-snug">
                  {act.title}
                </h3>
                <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
                  {act.subtitle}
                </p>
                <div className="flex items-center text-xs font-semibold text-[#7c3aed] mt-1.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Open</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

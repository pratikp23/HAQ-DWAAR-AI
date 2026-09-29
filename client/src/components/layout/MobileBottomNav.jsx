import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, Mic, FolderCheck, Briefcase } from "lucide-react";

/**
 * HAQ DWAAR AI — Citizen Mobile Bottom Navigation
 * 
 * Compact bottom bar for mobile viewports (hidden on desktop md+):
 * - Home (/dashboard)
 * - Benefits (/dashboard/recommendations)
 * - Voice (raised circular orange button with Lucide Mic -> /dashboard/life-situation)
 * - Documents (/dashboard/documents)
 * - Applications (/dashboard/applications)
 */
export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    {
      label: "Home",
      to: "/dashboard",
      icon: Home,
      active: location.pathname === "/dashboard",
    },
    {
      label: "Benefits",
      to: "/dashboard/recommendations",
      icon: Sparkles,
      active:
        location.pathname === "/dashboard/recommendations" ||
        location.pathname.startsWith("/dashboard/schemes"),
    },
    {
      // Raised circular voice button
      isVoice: true,
      label: "Voice",
      to: "/dashboard/life-situation",
      icon: Mic,
      active: location.pathname === "/dashboard/life-situation",
    },
    {
      label: "Docs",
      to: "/dashboard/documents",
      icon: FolderCheck,
      active: location.pathname.startsWith("/dashboard/documents"),
    },
    {
      label: "Apps",
      to: "/dashboard/applications",
      icon: Briefcase,
      active: location.pathname.startsWith("/dashboard/applications"),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-[#e9e1f5] shadow-[0_-2px_10px_0_rgba(36,11,73,0.05)] pb-safe"
      aria-label="Mobile citizen navigation"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto relative">
        {navItems.map((item, idx) => {
          const Icon = item.icon;

          if (item.isVoice) {
            return (
              <div key={idx} className="relative -top-4 flex flex-col items-center">
                <Link
                  to={item.to}
                  className={`w-13 h-13 rounded-full flex items-center justify-center bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-[0_4px_14px_0_rgba(234,88,12,0.4)] border-3 border-white active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 ${
                    item.active ? "ring-2 ring-[#ea580c]" : ""
                  }`}
                  aria-label="Bhashini Voice Assistant"
                  title="Speak your situation (Voice Access)"
                >
                  <Icon className="w-6 h-6 animate-pulse" />
                </Link>
                <span className="text-[10px] font-bold text-[#0f172a] mt-0.5">
                  Voice
                </span>
              </div>
            );
          }

          return (
            <Link
              key={idx}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] rounded-xl transition-colors ${
                item.active
                  ? "text-[#2b0f4c] font-bold"
                  : "text-[#4b5563] hover:text-[#0f172a]"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-0.5 ${
                  item.active ? "text-[#2b0f4c] stroke-[2.5]" : "text-[#4b5563]"
                }`}
              />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Mic, FolderCheck, UserCheck } from "lucide-react";

/**
 * HAQ DWAAR AI — Citizen Mobile Bottom Navigation
 * 
 * Fixed bottom navigation bar for mobile viewports (hidden on desktop md+ / lg+):
 * - Home (/dashboard)
 * - Schemes (/dashboard/schemes)
 * - MITTRA Voice (raised circular orange button -> /dashboard/life-situation)
 * - Documents (/dashboard/documents)
 * - Profile (/dashboard/benefit-passport)
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
      label: "Schemes",
      to: "/dashboard/schemes",
      icon: Search,
      active:
        location.pathname.startsWith("/dashboard/schemes") ||
        location.pathname.startsWith("/browse-schemes") ||
        location.pathname.startsWith("/dashboard/recommendations"),
    },
    {
      isVoice: true,
      label: "MITTRA",
      to: "/dashboard/life-situation",
      icon: Mic,
      active: location.pathname.startsWith("/dashboard/life-situation"),
    },
    {
      label: "Documents",
      to: "/dashboard/documents",
      icon: FolderCheck,
      active: location.pathname.startsWith("/dashboard/documents"),
    },
    {
      label: "Profile",
      to: "/dashboard/benefit-passport",
      icon: UserCheck,
      active: location.pathname.startsWith("/dashboard/benefit-passport"),
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-[#e9e1f5] shadow-[0_-2px_10px_0_rgba(36,11,73,0.06)] pb-safe"
      aria-label="Citizen mobile quick navigation"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto relative">
        {navItems.map((item, idx) => {
          const IconComp = item.icon;

          if (item.isVoice) {
            return (
              <div key={idx} className="relative -top-3.5 flex flex-col items-center">
                <Link
                  to={item.to}
                  className={`w-13 h-13 rounded-full flex items-center justify-center bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-[0_4px_14px_0_rgba(234,88,12,0.45)] border-3 border-white active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-[#ea580c] focus-visible:ring-offset-2 cursor-pointer ${
                    item.active ? "ring-3 ring-[#ea580c]" : ""
                  }`}
                  aria-label="MITTRA Voice Assistant"
                  title="Speak your situation to MITTRA"
                >
                  <IconComp className="w-6 h-6 animate-pulse" />
                </Link>
                <span className="text-[10px] font-black text-[#ea580c] mt-0.5">
                  MITTRA
                </span>
              </div>
            );
          }

          return (
            <Link
              key={idx}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1.5 px-2 min-w-[56px] rounded-xl transition-colors cursor-pointer ${
                item.active
                  ? "text-[#2b0f4c] font-black"
                  : "text-[#4b5563] hover:text-[#0f172a]"
              }`}
            >
              <IconComp
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

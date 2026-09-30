import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  LayoutDashboard, 
  Search, 
  Mic, 
  UserCheck,
  FolderCheck, 
  Briefcase,
  Compass,
  Info,
  HelpCircle,
  LogIn
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

/**
 * HAQ DWAAR AI — Complete Mobile Bottom Navigation
 * 
 * Houses ALL navbar destinations on mobile viewports (< lg):
 * 
 * Authenticated Citizen Mode (3 Left + Center Raised Mic + 3 Right):
 * 1. Home (Public portal /)
 * 2. Dashboard (/dashboard)
 * 3. Explore Schemes (/dashboard/schemes)
 * [ 🎙️ AI MITTRA ] (Prominent Center Raised Voice Mic)
 * 4. Benefit Passport (/dashboard/benefit-passport)
 * 5. Documents Vault (/dashboard/documents)
 * 6. Applications (/dashboard/applications)
 * 
 * Public Visitor Mode (3 Left + Center Raised Mic + 3 Right):
 * 1. Home (/)
 * 2. Browse Schemes (/browse-schemes)
 * 3. Benefits (/browse-schemes)
 * [ 🎙️ AI MITTRA ] (Center Raised Voice Mic)
 * 4. How It Works (/#how-it-works)
 * 5. About (/#about)
 * 6. Sign In (/login)
 */
export default function MobileBottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const citizenNavItems = [
    {
      label: "Home",
      shortLabel: "Home",
      to: "/",
      icon: Home,
      active: location.pathname === "/",
    },
    {
      label: "Dashboard",
      shortLabel: "Dash",
      to: "/dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard",
    },
    {
      label: "Schemes",
      shortLabel: "Schemes",
      to: "/dashboard/schemes",
      icon: Search,
      active:
        location.pathname.startsWith("/dashboard/schemes") ||
        location.pathname.startsWith("/browse-schemes") ||
        location.pathname.startsWith("/dashboard/recommendations"),
    },
    {
      isVoice: true,
      label: "AI MITTRA",
      subLabel: "AI MITTRA",
      to: "/dashboard/life-situation",
      icon: Mic,
      active: location.pathname.startsWith("/dashboard/life-situation"),
    },
    {
      label: "Benefit Passport",
      shortLabel: "Passport",
      to: "/dashboard/benefit-passport",
      icon: UserCheck,
      active: location.pathname.startsWith("/dashboard/benefit-passport"),
    },
    {
      label: "Document Vault",
      shortLabel: "Vault",
      to: "/dashboard/documents",
      icon: FolderCheck,
      active: location.pathname.startsWith("/dashboard/documents"),
    },
    {
      label: "Applications",
      shortLabel: "Tracker",
      to: "/dashboard/applications",
      icon: Briefcase,
      active: location.pathname.startsWith("/dashboard/applications"),
    },
  ];

  const publicNavItems = [
    {
      label: "Home",
      shortLabel: "Home",
      to: "/",
      icon: Home,
      active: location.pathname === "/",
    },
    {
      label: "Browse Schemes",
      shortLabel: "Schemes",
      to: "/browse-schemes",
      icon: Search,
      active: location.pathname.startsWith("/browse-schemes") || location.pathname.startsWith("/schemes/"),
    },
    {
      label: "Benefits",
      shortLabel: "Benefits",
      to: "/browse-schemes",
      icon: Compass,
      active: false,
    },
    {
      isVoice: true,
      label: "AI MITTRA",
      subLabel: "AI MITTRA",
      to: "/login",
      icon: Mic,
      active: false,
    },
    {
      label: "How It Works",
      shortLabel: "Guide",
      to: "/#how-it-works",
      icon: HelpCircle,
      active: location.hash === "#how-it-works",
    },
    {
      label: "About Platform",
      shortLabel: "About",
      to: "/#about",
      icon: Info,
      active: location.hash === "#about",
    },
    {
      label: "Sign In",
      shortLabel: "Sign In",
      to: "/login",
      icon: LogIn,
      active: location.pathname === "/login",
    },
  ];

  const navItems = isAuthenticated ? citizenNavItems : publicNavItems;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_0_rgba(36,11,73,0.09)] pb-[calc(env(safe-area-inset-bottom,0px)+6px)] transition-all"
      aria-label="Mobile bottom navigation bar"
    >
      <div className="flex items-center justify-between h-16 sm:h-18 px-1 sm:px-2 w-full max-w-xl mx-auto relative">
        {navItems.map((item, idx) => {
          const IconComp = item.icon;

          if (item.isVoice) {
            return (
              <div key={idx} className="relative -top-4 sm:-top-5 flex flex-col items-center shrink-0 px-1">
                {/* Ambient Ripple Glow */}
                <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] opacity-35 blur-md animate-pulse pointer-events-none" />

                {/* Raised Circular Orange Mic Button with Clean Centered Microphone */}
                <Link
                  to={item.to}
                  className={`relative w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#ea580c] via-[#f97316] to-[#ea580c] text-white shadow-[0_6px_20px_0_rgba(234,88,12,0.45)] border-3 sm:border-4 border-white active:scale-95 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 cursor-pointer ${
                    item.active ? "ring-4 ring-[#ea580c] ring-offset-2" : ""
                  }`}
                  aria-label="MITTRA Voice AI Assistant - Speak your need"
                  title="Speak your situation in your local language to MITTRA Voice AI"
                >
                  <IconComp className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-xs" />
                </Link>

                {/* Clean Label below mic */}
                <span className="text-[9px] sm:text-[10px] font-black text-[#ea580c] mt-0.5 tracking-tight drop-shadow-2xs">
                  {item.subLabel}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={idx}
              to={item.to}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 min-w-0 rounded-xl transition-colors cursor-pointer select-none ${
                item.active
                  ? "text-[#2b0f4c] font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${item.active ? "bg-purple-100/80 text-[#2b0f4c]" : ""}`}>
                <IconComp
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    item.active ? "text-[#2b0f4c] stroke-[2.5]" : "text-slate-500 stroke-[1.75]"
                  }`}
                />
              </div>
              <span className={`text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] mt-0.5 tracking-tighter sm:tracking-tight truncate max-w-full text-center ${
                item.active ? "font-black text-[#2b0f4c]" : "font-medium"
              }`}>
                {item.shortLabel || item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

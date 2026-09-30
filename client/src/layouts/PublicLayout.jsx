import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import { LayoutContext } from "../context/LayoutContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelector from "../components/common/LanguageSelector";

/**
 * HAQ DWAAR AI — Public Layout Shell (Civic Information Portal Style)
 */
export default function PublicLayout({ children }) {
  const { language, setLanguage } = useLanguage();

  return (
    <LayoutContext.Provider value={{ inLayout: true, layoutType: "public" }}>
      <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] flex flex-col font-sans selection:bg-[#2b0f4c] selection:text-white">
        
        {/* Top Civic Information Bar (Full Screen Width) */}
        <div className="bg-[#fbf9fe] border-b border-[#e9e1f5] py-1.5 px-4 sm:px-8 lg:px-12 xl:px-16 text-[11px] text-[#4b5563]">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-[#0f172a]">HAQ DWAAR AI</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#591d8f] font-bold hidden sm:inline">Scheme se Application Tak</span>
              <span className="text-slate-300 hidden md:inline">•</span>
              <span className="text-[#64748b] hidden md:inline font-medium">National Citizen Welfare Gateway</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase font-bold text-[#64748b] hidden md:inline tracking-wider">
                Language / भाषा:
              </span>
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Public Navbar */}
        <PublicNavbar />

        {/* Main Content (pb-28 on mobile to avoid MobileBottomNav overlap) */}
        <main className="flex-1 pb-28 lg:pb-0">
          {children || <Outlet />}
        </main>

        {/* Public Footer */}
        <Footer forceRender={true} />

        {/* Mobile Fixed Bottom Navigation Bar (lg:hidden) */}
        <MobileBottomNav />
      </div>
    </LayoutContext.Provider>
  );
}

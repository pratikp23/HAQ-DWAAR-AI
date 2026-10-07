import React from "react";
import { Outlet } from "react-router-dom";
import CitizenNavbar from "../components/layout/CitizenNavbar";
import CitizenFooter from "../components/layout/CitizenFooter";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import { LayoutContext } from "../context/LayoutContext";
import { HaqAIProvider } from "../context/HaqAIContext";
import HaqAIAssistant from "../components/haq-ai/HaqAIAssistant";

/**
 * HAQ DWAAR AI — Citizen Layout Shell (Authenticated Citizen Experience)
 * 
 * Houses persistent HAQ AI / MITTRA Task Agent across all citizen routes (/dashboard/*).
 */
export default function CitizenLayout({ children }) {
  return (
    <LayoutContext.Provider value={{ inLayout: true, layoutType: "citizen" }}>
      <HaqAIProvider>
        <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] flex flex-col font-sans selection:bg-[#2b0f4c] selection:text-white relative">
          {/* Citizen Top Navbar */}
          <CitizenNavbar />

          {/* Main Content Area (pb-32 sm:pb-36 on mobile to prevent MobileBottomNav overlap) */}
          <main className="flex-1 pb-32 sm:pb-36 lg:pb-12">
            {children || <Outlet />}
          </main>

          {/* Authenticated Citizen Footer */}
          <CitizenFooter />

          {/* Persistent HAQ AI / MITTRA Voice-First Task Agent */}
          <HaqAIAssistant />

          {/* Mobile Fixed Bottom Navigation Bar (lg:hidden) */}
          <MobileBottomNav />
        </div>
      </HaqAIProvider>
    </LayoutContext.Provider>
  );
}

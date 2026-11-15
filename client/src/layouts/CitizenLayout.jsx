import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UnstopPublicSidebar from "../components/layout/UnstopPublicSidebar";
import UnstopTopNavbar from "../components/layout/UnstopTopNavbar";
import CitizenFooter from "../components/layout/CitizenFooter";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import { LayoutContext } from "../context/LayoutContext";
import { HaqAIProvider } from "../context/HaqAIContext";
import HaqAIAssistant from "../components/haq-ai/HaqAIAssistant";

/**
 * HAQ DWAAR AI — Citizen Layout Shell (Authenticated Citizen Experience)
 * 
 * Features the signature Unstop layout with:
 * - Persistent left sidebar with flyouts and persona identity switcher
 * - Clean sticky top utility navbar
 * - Persistent HAQ AI / MITTRA Task Agent across all citizen routes (/dashboard/*)
 */
export default function CitizenLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{ inLayout: true, layoutType: "citizen" }}>
      <HaqAIProvider>
        <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] flex font-sans selection:bg-[#234731] selection:text-white relative">
          {/* Unstop-Style Left Persistent Sidebar */}
          <UnstopPublicSidebar
            isOpenMobile={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          {/* Right Content Area (offset by sidebar on desktop) */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
            {/* Unstop-Style Clean Sticky Top Header */}
            <UnstopTopNavbar
              onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            />

            {/* Main Content Area */}
            <main className="flex-1 pb-28 lg:pb-12">
              {children || <Outlet />}
            </main>

            {/* Authenticated Citizen Footer */}
            <CitizenFooter />
          </div>

          {/* Persistent HAQ AI / MITTRA Voice-First Task Agent */}
          <HaqAIAssistant />

          {/* Mobile Fixed Bottom Navigation Bar (lg:hidden) */}
          <MobileBottomNav />
        </div>
      </HaqAIProvider>
    </LayoutContext.Provider>
  );
}

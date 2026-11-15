import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import UnstopPublicSidebar from "../components/layout/UnstopPublicSidebar";
import UnstopTopNavbar from "../components/layout/UnstopTopNavbar";
import Footer from "../components/layout/Footer";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import { LayoutContext } from "../context/LayoutContext";

/**
 * HAQ DWAAR AI — Unstop-Inspired Public Layout Shell
 * Features a fixed/collapsible left navigation sidebar, clean top utility navbar,
 * and spacious main content canvas.
 */
export default function PublicLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{ inLayout: true, layoutType: "public" }}>
      <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] flex font-sans selection:bg-[#2b0f4c] selection:text-white">
        
        {/* Unstop-Style Left Persistent / Collapsible Sidebar */}
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

          {/* Main Body */}
          <main className="flex-1 pb-24 lg:pb-0">
            {children || <Outlet />}
          </main>

          {/* Clean Footer */}
          <Footer forceRender={true} />
        </div>

        {/* Mobile Fixed Bottom Navigation Bar (lg:hidden) */}
        <MobileBottomNav />
      </div>
    </LayoutContext.Provider>
  );
}

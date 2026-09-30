import React from "react";
import { Outlet } from "react-router-dom";
import CitizenNavbar from "../components/layout/CitizenNavbar";
import CitizenFooter from "../components/layout/CitizenFooter";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import { LayoutContext } from "../context/LayoutContext";

/**
 * HAQ DWAAR AI — Citizen Layout Shell (Authenticated Citizen Experience)
 * 
 * Specialized civic application shell for authenticated citizens:
 * Citizen Navbar
 * ↓
 * Main Content Area (pb-24 on mobile to prevent MobileBottomNav overlap)
 * ↓
 * Citizen Footer (civic trust, direct portals, helplines, non-agency notice)
 * ↓
 * Mobile Bottom Navigation (with raised circular orange voice button)
 */
export default function CitizenLayout({ children }) {
  return (
    <LayoutContext.Provider value={{ inLayout: true, layoutType: "citizen" }}>
      <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] flex flex-col font-sans selection:bg-[#2b0f4c] selection:text-white">
        {/* Citizen Top Navbar */}
        <CitizenNavbar />

        {/* Main Content Area (pb-32 sm:pb-36 on mobile to prevent MobileBottomNav overlap) */}
        <main className="flex-1 pb-32 sm:pb-36 lg:pb-12">
          {children || <Outlet />}
        </main>

        {/* Authenticated Citizen Footer */}
        <CitizenFooter />

        {/* Mobile Fixed Bottom Navigation Bar (lg:hidden) */}
        <MobileBottomNav />
      </div>
    </LayoutContext.Provider>
  );
}

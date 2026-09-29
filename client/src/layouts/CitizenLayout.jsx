import React from "react";
import { Outlet } from "react-router-dom";
import CitizenNavbar from "../components/layout/CitizenNavbar";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import { LayoutContext } from "../context/LayoutContext";

/**
 * HAQ DWAAR AI — Citizen Layout Shell
 * 
 * Specialized civic application shell for authenticated citizens:
 * Citizen Navbar
 * ↓
 * Main Content (pb-20 on mobile to prevent bottom nav overlap)
 * ↓
 * Mobile Bottom Navigation (with raised circular orange voice button)
 */
export default function CitizenLayout({ children }) {
  return (
    <LayoutContext.Provider value={{ inLayout: true, layoutType: "citizen" }}>
      <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] flex flex-col font-sans selection:bg-[#2b0f4c] selection:text-white">
        {/* Citizen Top Navbar */}
        <CitizenNavbar />

        {/* Main Content Area — includes padding-bottom on mobile for MobileBottomNav clearance */}
        <main className="flex-1 pb-24 md:pb-12">
          {children || <Outlet />}
        </main>

        {/* Mobile Bottom Navigation Bar (md:hidden) */}
        <MobileBottomNav />
      </div>
    </LayoutContext.Provider>
  );
}

import React from "react";
import { Outlet } from "react-router-dom";
import { ShieldCheck, Globe } from "lucide-react";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";
import { LayoutContext } from "../context/LayoutContext";
import { useLanguage } from "../context/LanguageContext";

/**
 * HAQ DWAAR AI — Public Layout Shell
 * 
 * Top status strip
 * ↓
 * Public Navbar
 * ↓
 * Main Content
 * ↓
 * Footer
 */
export default function PublicLayout({ children }) {
  const { language, setLanguage } = useLanguage();

  return (
    <LayoutContext.Provider value={{ inLayout: true, layoutType: "public" }}>
      <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] flex flex-col font-sans selection:bg-[#2b0f4c] selection:text-white">
        {/* Top Status Strip */}
        <div className="bg-[#fbf9fe] border-b border-[#e9e1f5] py-1 px-4 sm:px-6 lg:px-8 text-[11px] text-[#4b5563]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-[#0f172a]">हकद्वार • HAQ DWAAR AI</span>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="hidden sm:inline text-[#591d8f] font-semibold">Scheme se Application Tak</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="hidden md:inline text-slate-500">Citizen Welfare & Entitlement Preparation</span>
              <div className="flex items-center space-x-1.5 font-bold text-[#0f172a]">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`hover:text-[#2b0f4c] transition-colors ${language === "en" ? "text-[#ea580c] underline" : "text-[#4b5563]"}`}
                >
                  English
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`hover:text-[#2b0f4c] transition-colors ${language === "hi" ? "text-[#ea580c] underline" : "text-[#4b5563]"}`}
                >
                  हिंदी
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Public Navbar */}
        <PublicNavbar />

        {/* Main Content */}
        <main className="flex-1">
          {children || <Outlet />}
        </main>

        {/* Public Footer */}
        <Footer forceRender={true} />
      </div>
    </LayoutContext.Provider>
  );
}

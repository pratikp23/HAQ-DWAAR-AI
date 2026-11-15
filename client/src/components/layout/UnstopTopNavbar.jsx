import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  HelpCircle,
  Menu,
  Building2,
  User,
  ArrowRight,
  Sparkles,
  Globe,
  Bell,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import LanguageSelector from "../common/LanguageSelector";
import UnstopProfileDropdown from "./UnstopProfileDropdown";

export default function UnstopTopNavbar({ onOpenMobileSidebar }) {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/browse-schemes?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate("/browse-schemes");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Mobile Sidebar Trigger + Mobile Brand */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1b3524] via-[#234731] to-[#3a6347] flex items-center justify-center text-white text-xs font-black">
              LS
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900">
              Lok Samarth
            </span>
          </Link>
        </div>

        {/* Center: Unstop-Style Rounded OmniSearch Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl mx-auto relative hidden sm:block"
        >
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search 350+ central & state schemes, ministries, subsidies..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 pl-9 pr-20 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#70987a]/30 focus:border-[#234731] transition-all shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-[#234731] hover:bg-[#193524] text-white rounded-full text-[11px] font-bold shadow-2xs transition"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right: Only Mandatory & Useful Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Language Selector */}
          <div className="hidden md:flex items-center">
            <LanguageSelector />
          </div>

          {/* Notification Bell */}
          {isAuthenticated && (
            <Link
              to="/dashboard/notifications"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600" />
            </Link>
          )}

          {/* Help / FAQ Link */}
          <Link
            to="/#faq"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition hidden sm:inline-flex"
            title="Help & FAQ"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>

          {/* Dashboard Quick Access Button */}
          <Link
            to={isAuthenticated ? (["admin", "super_admin", "chief_officer", "category_admin"].includes(user?.role) ? "/admin" : "/dashboard") : "/login"}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-[#112318] bg-slate-100/90 hover:bg-emerald-50 border border-slate-200/80 transition shadow-2xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>Dashboard</span>
          </Link>

          {/* Authentication Actions */}
          {isAuthenticated ? (
            <UnstopProfileDropdown align="right" />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-[#152b1e] transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-full bg-[#234731] hover:bg-[#193524] text-white text-xs font-bold shadow-2xs hover:shadow-xs transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Search Bar Row (visible on small screens) */}
      <div className="sm:hidden mt-2 pt-2 border-t border-slate-100">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search schemes, ministries..."
            className="w-full bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 pl-8 pr-16 py-1.5 rounded-full border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#234731]"
          />
          <button
            type="submit"
            className="absolute right-1 px-2.5 py-0.5 bg-[#234731] text-white rounded-full text-[10px] font-bold"
          >
            Go
          </button>
        </form>
      </div>
    </header>
  );
}

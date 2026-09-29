import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  FileText,
  Activity,
  BarChart2,
  CheckCircle2,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { LayoutContext } from "../context/LayoutContext";

/**
 * HAQ DWAAR AI — Admin Layout Shell
 * 
 * Specialized administrative operations console shell:
 * - Desktop: Left sidebar (deep plum #1e0a3c) + Topbar + Main content
 * - Mobile: Collapsible drawer
 * - Visual density: compact, high information density, lavender background (#f7f5fa)
 */
export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Admin logout error:", err);
    }
  };

  const navItems = [
    {
      label: "Dashboard & Overview",
      to: "/admin",
      icon: LayoutDashboard,
      active: location.pathname === "/admin" || location.pathname === "/admin/dashboard",
    },
    {
      label: "Schemes Management",
      to: "/admin/schemes",
      icon: Layers,
      active: location.pathname.startsWith("/admin/schemes"),
    },
    {
      label: "Notification Analyzer",
      to: "/admin/notifications",
      icon: FileText,
      active: location.pathname.startsWith("/admin/notifications"),
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1e0a3c] text-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#2b0f4c] flex items-center justify-between">
        <Link to="/admin" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#2b0f4c] border border-purple-500/30 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="font-black text-sm tracking-tight text-white flex items-center space-x-1.5">
              <span>HAQ DWAAR</span>
              <span className="text-orange-400">AI</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700/50">
              Admin Console
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileDrawerOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-[#2b0f4c]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
          Operations
        </div>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.to}
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                item.active
                  ? "bg-[#2b0f4c] text-white border border-purple-500/40 shadow-xs"
                  : "text-purple-200 hover:text-white hover:bg-purple-900/30"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${item.active ? "text-orange-400" : "text-purple-300"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
          Navigation
        </div>

        <Link
          to="/dashboard"
          onClick={() => setMobileDrawerOpen(false)}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-purple-200 hover:text-white hover:bg-purple-900/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-purple-300 shrink-0" />
          <span>Citizen Portal</span>
        </Link>

        <Link
          to="/"
          onClick={() => setMobileDrawerOpen(false)}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-purple-200 hover:text-white hover:bg-purple-900/30 transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-purple-300 shrink-0" />
          <span>Public Catalog</span>
        </Link>
      </div>

      {/* Sidebar Footer: Admin profile & Logout */}
      <div className="p-3 border-t border-[#2b0f4c] bg-[#17072e]">
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-bold text-white truncate">{user?.name || "Administrator"}</p>
            <p className="text-[10px] text-purple-300 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            type="button"
            className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <LayoutContext.Provider value={{ inLayout: true, layoutType: "admin" }}>
      <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] flex font-sans selection:bg-[#2b0f4c] selection:text-white">
        {/* Desktop Fixed Left Sidebar (260px) */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-40 border-r border-[#240b49]">
          {sidebarContent}
        </aside>

        {/* Mobile Drawer Backdrop + Content */}
        {mobileDrawerOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMobileDrawerOpen(false);
            }}
          >
            <div className="w-72 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Right Main Wrapper (offset by sidebar on desktop) */}
        <div className="flex-1 flex flex-col md:pl-64 min-w-0">
          {/* Admin Topbar */}
          <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#e9e1f5] shadow-[0_1px_3px_0_rgba(36,11,73,0.03)] px-4 sm:px-6 flex items-center justify-between shrink-0">
            {/* Left: Mobile Drawer Trigger + Platform Indicator */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                type="button"
                className="md:hidden p-2 rounded-xl text-[#0f172a] hover:bg-[#fbf9fe] border border-[#e9e1f5] transition-colors"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm sm:text-base text-[#0f172a] tracking-tight">
                  HAQ DWAAR AI <span className="text-[#ea580c]">ADMIN</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#059669] border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-1" />
                  System Operational
                </span>
              </div>
            </div>

            {/* Right: Quick actions */}
            <div className="flex items-center space-x-2.5">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-[#2b0f4c] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Citizen View</span>
              </Link>

              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </header>

          {/* Admin Main Body */}
          <main className="flex-1 bg-[#f7f5fa] min-w-0">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}

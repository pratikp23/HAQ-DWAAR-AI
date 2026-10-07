import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  Layers,
  UserCheck,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Settings,
  Users
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { LayoutContext } from "../context/LayoutContext";
import { getOfficerApplications } from "../services/officerApi";
import { getSchemeReports } from "../services/reportApi";
import { getDefaultAvatar } from "../utils/officerAvatars";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [pendingOfficerAppsCount, setPendingOfficerAppsCount] = useState(0);
  const [pendingGrievancesCount, setPendingGrievancesCount] = useState(0);

  const activeAvatar = user?.avatar || getDefaultAvatar(user?.role, user?.department);

  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        if (user?.role === "chief_officer" || user?.role === "super_admin") {
          const appsRes = await getOfficerApplications("PENDING");
          if (isMounted && appsRes?.data?.success) {
            setPendingOfficerAppsCount(appsRes.data.data.counts?.pending || 0);
          }
        }

        const reportsRes = await getSchemeReports("PENDING_INVESTIGATION");
        if (isMounted && reportsRes?.data?.success) {
          setPendingGrievancesCount(reportsRes.data.data.counts?.pending || 0);
        }
      } catch (err) {
        // Silently catch errors
      }
    };

    fetchCounts();
    return () => {
      isMounted = false;
    };
  }, [user?.role, location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Admin logout error:", err);
    }
  };

  // Simple, point-to-point Navigation Items based on role
  const getNavItems = () => {
    const commonSettings = {
      label: "Profile & Settings",
      to: "/admin/profile",
      icon: Settings,
      active: location.pathname === "/admin/profile" || location.pathname === "/admin/settings",
    };

    if (user?.role === "chief_officer") {
      return [
        {
          label: "Dashboard",
          to: "/admin",
          icon: LayoutDashboard,
          active: location.pathname === "/admin" || location.pathname === "/admin/dashboard",
        },
        {
          label: "Officer Approvals",
          to: "/admin/officers",
          icon: UserCheck,
          active: location.pathname.startsWith("/admin/officers"),
          badge: pendingOfficerAppsCount > 0 ? pendingOfficerAppsCount : null,
          badgeColor: "bg-orange-500",
        },
        {
          label: "Fake Scheme Reports",
          to: "/admin/grievances",
          icon: ShieldAlert,
          active: location.pathname.startsWith("/admin/grievances"),
          badge: pendingGrievancesCount > 0 ? pendingGrievancesCount : null,
          badgeColor: "bg-rose-500",
        },
        commonSettings,
      ];
    }

    if (user?.role === "category_admin") {
      return [
        {
          label: "Dashboard",
          to: "/admin",
          icon: LayoutDashboard,
          active: location.pathname === "/admin" || location.pathname === "/admin/dashboard",
        },
        {
          label: `My ${user?.department || ""} Schemes`,
          to: "/admin/schemes",
          icon: Layers,
          active: location.pathname.startsWith("/admin/schemes"),
        },
        {
          label: "Scheme Complaints",
          to: "/admin/grievances",
          icon: ShieldAlert,
          active: location.pathname.startsWith("/admin/grievances"),
          badge: pendingGrievancesCount > 0 ? pendingGrievancesCount : null,
          badgeColor: "bg-rose-500",
        },
        commonSettings,
      ];
    }

    // Default: Super Admin
    return [
      {
        label: "Dashboard",
        to: "/admin",
        icon: LayoutDashboard,
        active: location.pathname === "/admin" || location.pathname === "/admin/dashboard",
      },
      {
        label: "All Schemes",
        to: "/admin/schemes",
        icon: Layers,
        active: location.pathname.startsWith("/admin/schemes"),
      },
      {
        label: "All Officers",
        to: "/admin/officers",
        icon: Users,
        active: location.pathname.startsWith("/admin/officers"),
        badge: pendingOfficerAppsCount > 0 ? pendingOfficerAppsCount : null,
        badgeColor: "bg-orange-500",
      },
      {
        label: "All Reports",
        to: "/admin/grievances",
        icon: ShieldAlert,
        active: location.pathname.startsWith("/admin/grievances"),
        badge: pendingGrievancesCount > 0 ? pendingGrievancesCount : null,
        badgeColor: "bg-rose-500",
      },
      commonSettings,
    ];
  };

  const navItems = getNavItems();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1e0a3c] text-white">
      {/* Brand Header & Role Badge with Avatar */}
      <div className="p-4 sm:p-5 border-b border-[#2b0f4c] space-y-3">
        <div className="flex items-center justify-between">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="text-base font-black tracking-tight text-white">
              HAQ DWAAR <span className="text-orange-400">AI</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-purple-300 hover:text-white hover:bg-[#2b0f4c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Officer Avatar & Role Card (Clickable to /admin/profile) */}
        <Link
          to="/admin/profile"
          onClick={() => setMobileDrawerOpen(false)}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center space-x-3 transition group"
          title="Click to view & edit profile"
        >
          <div className="w-10 h-10 rounded-full border-2 border-orange-400 overflow-hidden bg-slate-900 shrink-0">
            <img src={activeAvatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[9px] uppercase font-black tracking-wider text-orange-400 truncate">
              {user?.role === "chief_officer"
                ? "Chief Govt Officer"
                : user?.role === "category_admin"
                ? `${user?.department || "Dept"} Admin`
                : "Super Admin"}
            </div>
            <div className="text-xs font-bold text-white truncate group-hover:text-orange-300 transition-colors">
              {user?.name || "Administrator"}
            </div>
          </div>
        </Link>
      </div>

      {/* Point-to-Point Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-purple-400">
          Main Menu
        </div>

        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.to}
              onClick={() => setMobileDrawerOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                item.active
                  ? "bg-[#2b0f4c] text-white border border-purple-400/40 shadow-xs"
                  : "text-purple-200 hover:text-white hover:bg-purple-900/30"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${item.active ? "text-orange-400" : "text-purple-300"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Quick Citizen View link */}
        <div className="pt-4 px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-purple-400">
          Other
        </div>
        <Link
          to="/dashboard"
          onClick={() => setMobileDrawerOpen(false)}
          className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-purple-200 hover:text-white hover:bg-purple-900/30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-purple-300" />
          <span>Go to Citizen View</span>
        </Link>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-[#2b0f4c] bg-[#17072e] flex items-center justify-between">
        <Link
          to="/admin/profile"
          onClick={() => setMobileDrawerOpen(false)}
          className="flex items-center space-x-2 truncate pr-2 hover:opacity-80 transition"
        >
          <img src={activeAvatar} alt="Avatar" className="w-6 h-6 rounded-full shrink-0" />
          <p className="text-xs font-bold text-white truncate">{user?.email}</p>
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <LayoutContext.Provider value={{ inLayout: true, layoutType: "admin" }}>
      <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] flex font-sans selection:bg-[#2b0f4c] selection:text-white">
        {/* Desktop Fixed Left Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 fixed inset-y-0 left-0 z-40 border-r border-[#240b49]">
          {sidebarContent}
        </aside>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMobileDrawerOpen(false);
            }}
          >
            <div className="w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-60 min-w-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 h-14 bg-white border-b border-purple-100 px-4 sm:px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                <Menu className="w-5 h-5" />
              </button>

              <span className="font-extrabold text-sm text-[#0f172a]">
                {user?.role === "chief_officer"
                  ? "🏛️ Chief Officer Verification Desk"
                  : user?.role === "category_admin"
                  ? `🌾 Ministry of ${user?.department || "Department"} Desk`
                  : "⚙️ Platform Admin Desk"}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              {/* Profile Shortcut Button with Avatar */}
              <Link
                to="/admin/profile"
                className="flex items-center space-x-2 px-2.5 py-1 rounded-xl hover:bg-slate-100 transition"
                title="Profile & Settings"
              >
                <img src={activeAvatar} alt="Avatar" className="w-6 h-6 rounded-full border border-purple-300" />
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">{user?.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 bg-[#f7f5fa] min-w-0">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}

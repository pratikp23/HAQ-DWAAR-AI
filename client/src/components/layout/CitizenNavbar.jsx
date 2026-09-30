import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, 
  User, 
  ChevronDown, 
  LogOut, 
  FolderCheck, 
  Briefcase, 
  LayoutDashboard, 
  Search, 
  Globe, 
  Check,
  ShieldCheck,
  Mic,
  Menu,
  X,
  UserCheck,
  Home
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import { getUnreadCount } from "../../services/notificationApi";
import BrandLogo from "./BrandLogo";

/**
 * HAQ DWAAR AI — Citizen Navbar
 * 
 * Features:
 * - Brand Logo + "Citizen Portal" pill
 * - Nav links: Dashboard, Explore Schemes, MITTRA Voice, Benefit Passport, Documents, Applications
 * - Right: Notifications with unread badge, Language selector
 * - User Avatar trigger + Pixel-perfect Profile Dropdown (matching design reference)
 * - Accessible mobile drawer
 */
export default function CitizenNavbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const profileRef = useRef(null);
  const langRef = useRef(null);
  const drawerRef = useRef(null);

  // Fetch live unread notifications count
  useEffect(() => {
    let isMounted = true;
    getUnreadCount()
      .then((res) => {
        if (isMounted && res.data?.data?.unreadCount !== undefined) {
          setUnreadCount(res.data.data.unreadCount);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key handler for accessible modal/drawer closing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileDrawerOpen(false);
        setProfileDropdownOpen(false);
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const handleLogout = async () => {
    try {
      setProfileDropdownOpen(false);
      setMobileDrawerOpen(false);
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  const citizenNavLinks = [
    {
      label: "Home",
      shortLabel: "Home",
      to: "/",
      icon: Home,
      active: location.pathname === "/",
    },
    {
      label: "Dashboard",
      shortLabel: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard",
    },
    {
      label: "Explore Schemes",
      shortLabel: "Schemes",
      to: "/dashboard/schemes",
      icon: Search,
      active:
        location.pathname.startsWith("/dashboard/schemes") ||
        location.pathname.startsWith("/browse-schemes"),
    },
    {
      label: "MITTRA Voice",
      shortLabel: "MITTRA",
      to: "/dashboard/life-situation",
      icon: Mic,
      isVoice: true,
      active: location.pathname.startsWith("/dashboard/life-situation"),
    },
    {
      label: "Benefit Passport",
      shortLabel: "Passport",
      to: "/dashboard/benefit-passport",
      icon: UserCheck,
      active: location.pathname.startsWith("/dashboard/benefit-passport"),
    },
    {
      label: "Documents",
      shortLabel: "Documents",
      to: "/dashboard/documents",
      icon: FolderCheck,
      active: location.pathname.startsWith("/dashboard/documents"),
    },
    {
      label: "Applications",
      shortLabel: "Applications",
      to: "/dashboard/applications",
      icon: Briefcase,
      active: location.pathname.startsWith("/dashboard/applications"),
    },
  ];

  return (
    <nav 
      aria-label="Citizen Portal Navigation"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 shadow-[0_1px_3px_0_rgba(36,11,73,0.03)] w-full"
    >
      {/* Full screen width container */}
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full gap-2 sm:gap-4">
          
          {/* Left: Brand + Citizen Pill */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <BrandLogo to="/dashboard" size="sm" />
            <span className="hidden 2xl:inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-50 text-[11px] font-semibold text-[#2b0f4c] border border-purple-200 shadow-2xs whitespace-nowrap">
              Citizen Portal
            </span>
          </div>

          {/* Center: Desktop Citizen Nav Items (Visible at 1024px+) */}
          <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 shrink min-w-0">
            {citizenNavLinks.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className={`h-9 px-2 xl:px-3 rounded-xl text-xs xl:text-[13px] transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    item.active
                      ? "bg-purple-50 text-[#2b0f4c] font-bold border border-purple-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 shrink-0 ${item.isVoice ? "text-[#ea580c]" : ""}`} />
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="inline xl:hidden">{item.shortLabel}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Controls: Notifications, Language, User Profile Avatar (Anchored to right, guaranteed inside viewport) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto lg:ml-0">
            
            {/* Notification Bell with live unread badge */}
            <Link
              to="/dashboard/notifications"
              className={`relative h-9 w-9 flex items-center justify-center rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[#591d8f] shrink-0 shadow-2xs ${
                location.pathname === "/dashboard/notifications"
                  ? "bg-purple-50 text-[#2b0f4c] border border-purple-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/90 bg-white"
              }`}
              title="Notifications & Deadline Alerts"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell className="w-4 h-4 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dc2626]" />
                </span>
              )}
            </Link>

            {/* Language Selector Dropdown */}
            <div className="relative shrink-0" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="h-9 inline-flex items-center px-2.5 rounded-xl text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 transition-colors cursor-pointer shadow-2xs gap-1"
                aria-label="Language selection"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-[#591d8f] shrink-0" />
                <span className="hidden sm:inline font-semibold">{currentLang?.short}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between hover:bg-purple-50 transition-colors cursor-pointer ${
                        language === l.code ? "text-[#2b0f4c] bg-purple-50/70" : "text-slate-600"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">{l.flag} {l.label}</span>
                      {language === l.code && <Check className="w-3 h-3 text-[#591d8f] shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop User Profile Avatar & Dropdown */}
            <div className="relative shrink-0" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="h-9 inline-flex items-center gap-2 px-2 sm:px-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-purple-50/60 bg-white border border-slate-200/90 transition-colors focus-visible:ring-2 focus-visible:ring-[#591d8f] cursor-pointer shadow-2xs"
                aria-expanded={profileDropdownOpen}
                aria-label="Citizen profile menu"
              >
                {/* User Avatar Circle */}
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2b0f4c] to-[#591d8f] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-purple-300 shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                </div>
                <span className="hidden sm:inline font-semibold text-xs text-slate-900 truncate max-w-[100px] xl:max-w-[130px]">
                  {user?.name || "Citizen"}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
              </button>

              {/* Dropdown Menu Modal */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
                  role="menu"
                >
                  {/* User Details Header - Horizontally aligned avatar and text */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2b0f4c] to-[#591d8f] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-1 ring-purple-300 shrink-0">
                      {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.name || "Citizen"}
                      </p>
                      <p className="text-xs text-slate-500 truncate font-normal">
                        {user?.email || "citizen@haqdwaar.gov.in"}
                      </p>
                    </div>
                  </div>

                  {/* Links Section */}
                  <div className="py-2 bg-white">
                    <Link
                      to="/dashboard/benefit-passport"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-purple-50 hover:text-[#2b0f4c] transition-colors group"
                      role="menuitem"
                    >
                      <UserCheck className="w-4 h-4 text-[#591d8f] group-hover:scale-105 transition-transform shrink-0" />
                      <span>Benefit Passport</span>
                    </Link>

                    <Link
                      to="/dashboard/documents"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-purple-50 hover:text-[#2b0f4c] transition-colors group"
                      role="menuitem"
                    >
                      <FolderCheck className="w-4 h-4 text-[#2b0f4c] group-hover:scale-105 transition-transform shrink-0" />
                      <span>Document Vault</span>
                    </Link>
                  </div>

                  {/* Logout Button Section */}
                  <div className="border-t border-slate-100 p-2 bg-white">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Drawer Toggle (<= 1023px) - Horizontally aligned h-9 */}
            <div className="flex lg:hidden items-center shrink-0">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-800 bg-white hover:bg-purple-50 border border-slate-200/90 transition-colors focus-visible:ring-2 focus-visible:ring-[#591d8f] cursor-pointer shadow-2xs"
                aria-label={mobileDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileDrawerOpen}
              >
                {mobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Accessible Mobile Drawer Menu */}
      {mobileDrawerOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="fixed inset-x-0 top-16 bottom-0 z-50 lg:hidden bg-slate-900/40 backdrop-blur-xs flex flex-col justify-start animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === drawerRef.current) setMobileDrawerOpen(false);
          }}
        >
          <div className="bg-white border-b border-slate-200 shadow-2xl px-5 pt-4 pb-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            
            {/* Citizen Identity Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2b0f4c] to-[#591d8f] text-white flex items-center justify-center font-bold text-xs ring-1 ring-purple-300">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{user?.name || "Citizen"}</p>
                  <p className="text-[11px] text-slate-500 truncate font-normal">{user?.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-purple-50 border border-slate-200 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links in Mobile Drawer */}
            <div className="space-y-1">
              {citizenNavLinks.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <Link
                    key={idx}
                    to={item.to}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      item.active
                        ? "bg-purple-50 text-[#2b0f4c] font-bold border border-purple-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${item.isVoice ? "text-[#ea580c]" : ""}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <Link
                to="/dashboard/notifications"
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  location.pathname === "/dashboard/notifications"
                    ? "bg-purple-50 text-[#2b0f4c] font-bold border border-purple-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Drawer Logout Action */}
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out of Citizen Account</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}

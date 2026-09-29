import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, 
  User, 
  ChevronDown, 
  LogOut, 
  Sparkles, 
  FolderCheck, 
  Briefcase, 
  LayoutDashboard, 
  Search, 
  Globe, 
  Check,
  BrainCircuit,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import { getUnreadCount } from "../../services/notificationApi";
import BrandLogo from "./BrandLogo";

/**
 * HAQ DWAAR AI — Citizen Navbar
 * 
 * Specialized compact navigation shell for authenticated citizen users.
 */
export default function CitizenNavbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [benefitsDropdownOpen, setBenefitsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const profileRef = useRef(null);
  const benefitsRef = useRef(null);
  const langRef = useRef(null);

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

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (benefitsRef.current && !benefitsRef.current.contains(e.target)) {
        setBenefitsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  const isBenefitsActive =
    location.pathname.startsWith("/dashboard/recommendations") ||
    location.pathname.startsWith("/dashboard/life-situation") ||
    location.pathname.startsWith("/dashboard/schemes") ||
    location.pathname.startsWith("/browse-schemes");

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-[#e9e1f5] shadow-[0_1px_3px_0_rgba(36,11,73,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand + Citizen Pill */}
          <div className="flex items-center space-x-3">
            <BrandLogo to="/dashboard" />
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 text-[11px] font-bold text-[#2b0f4c] border border-purple-200">
              Citizen Portal
            </span>
          </div>

          {/* Desktop Citizen Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {/* Dashboard */}
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                location.pathname === "/dashboard"
                  ? "bg-purple-50 text-[#2b0f4c] font-extrabold"
                  : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            {/* Benefits Dropdown */}
            <div className="relative" ref={benefitsRef}>
              <button
                type="button"
                onClick={() => setBenefitsDropdownOpen(!benefitsDropdownOpen)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 ${
                  isBenefitsActive
                    ? "bg-purple-50 text-[#2b0f4c] font-extrabold"
                    : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
                }`}
                aria-expanded={benefitsDropdownOpen}
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Benefits</span>
                <ChevronDown className="w-3 h-3 ml-0.5 text-[#4b5563]" />
              </button>

              {benefitsDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-[#e9e1f5] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <Link
                    to="/dashboard/recommendations"
                    onClick={() => setBenefitsDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3.5 py-2 text-xs font-bold text-[#0f172a] hover:bg-purple-50 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#ea580c]" />
                    <div>
                      <div>Find Benefits</div>
                      <div className="text-[10px] font-normal text-[#4b5563]">Deterministic scheme matching</div>
                    </div>
                  </Link>

                  <Link
                    to="/dashboard/life-situation"
                    onClick={() => setBenefitsDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3.5 py-2 text-xs font-bold text-[#0f172a] hover:bg-purple-50 transition-colors"
                  >
                    <BrainCircuit className="w-4 h-4 text-[#591d8f]" />
                    <div>
                      <div>Life Situation (NLU / Voice)</div>
                      <div className="text-[10px] font-normal text-[#4b5563]">Describe needs naturally</div>
                    </div>
                  </Link>

                  <div className="my-1 border-t border-[#e9e1f5]" />

                  <Link
                    to="/browse-schemes"
                    onClick={() => setBenefitsDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3.5 py-2 text-xs font-bold text-[#0f172a] hover:bg-purple-50 transition-colors"
                  >
                    <Search className="w-4 h-4 text-blue-500" />
                    <div>
                      <div>Browse All Schemes</div>
                      <div className="text-[10px] font-normal text-[#4b5563]">Full verified government catalog</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Documents */}
            <Link
              to="/dashboard/documents"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                location.pathname.startsWith("/dashboard/documents")
                  ? "bg-purple-50 text-[#2b0f4c] font-extrabold"
                  : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
              }`}
            >
              <FolderCheck className="w-3.5 h-3.5" />
              <span>Documents</span>
            </Link>

            {/* Applications */}
            <Link
              to="/dashboard/applications"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                location.pathname.startsWith("/dashboard/applications")
                  ? "bg-purple-50 text-[#2b0f4c] font-extrabold"
                  : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Applications</span>
            </Link>
          </div>

          {/* Right Controls: Notifications, Language, Profile dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Notification Bell with live badge */}
            <Link
              to="/dashboard/notifications"
              className={`relative p-2 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-[#591d8f] ${
                location.pathname === "/dashboard/notifications"
                  ? "bg-purple-50 text-[#2b0f4c]"
                  : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
              }`}
              title="Notifications & Deadline Alerts"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#dc2626]" />
                </span>
              )}
            </Link>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center px-2 py-1.5 rounded-xl text-xs font-bold text-[#0f172a] bg-[#fbf9fe] hover:bg-[#f7f5fa] border border-[#e9e1f5] transition-colors"
                aria-label="Language selection"
              >
                <Globe className="w-3.5 h-3.5 mr-1 text-[#591d8f]" />
                <span className="hidden sm:inline">{currentLang?.short}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-[#e9e1f5] py-1.5 z-50 animate-in fade-in duration-100">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold flex items-center justify-between hover:bg-purple-50 ${
                        language === l.code ? "text-[#2b0f4c] bg-purple-50/60" : "text-[#4b5563]"
                      }`}
                    >
                      <span>{l.flag} {l.label}</span>
                      {language === l.code && <Check className="w-3 h-3 text-[#591d8f]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-[#0f172a] hover:bg-purple-50 border border-[#e9e1f5] transition-colors focus-visible:ring-2 focus-visible:ring-[#591d8f]"
                aria-expanded={profileDropdownOpen}
                aria-label="Citizen profile menu"
              >
                <div className="w-6 h-6 rounded-full bg-[#2b0f4c] text-white flex items-center justify-center font-bold text-[11px]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="hidden sm:inline font-bold truncate max-w-[100px]">
                  {user?.name || "Citizen"}
                </span>
                <ChevronDown className="w-3 h-3 text-[#4b5563]" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-[#e9e1f5] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-[#e9e1f5]">
                    <p className="text-xs font-bold text-[#0f172a] truncate">{user?.name || "Citizen"}</p>
                    <p className="text-[11px] text-[#4b5563] truncate">{user?.email}</p>
                  </div>

                  <Link
                    to="/dashboard/benefit-passport"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-[#0f172a] hover:bg-purple-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#591d8f]" />
                    <span>Benefit Passport</span>
                  </Link>

                  <Link
                    to="/dashboard/documents"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-[#0f172a] hover:bg-purple-50 transition-colors"
                  >
                    <FolderCheck className="w-4 h-4 text-[#2b0f4c]" />
                    <span>Document Vault</span>
                  </Link>

                  <div className="my-1 border-t border-[#e9e1f5]" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

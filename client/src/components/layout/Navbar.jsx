import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Menu, 
  X, 
  ArrowRight, 
  UserCheck, 
  Bell, 
  Briefcase,
  Globe,
  ChevronDown,
  Check,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import { LayoutContext } from "../../context/LayoutContext";
import { getUnreadCount } from "../../services/notificationApi";

export default function Navbar({ forceRender = false }) {
  const { inLayout } = useContext(LayoutContext) || {};
  if (inLayout && !forceRender) {
    return null;
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      getUnreadCount()
        .then((res) => {
          const count = res?.data?.unreadCount ?? res?.unreadCount ?? res?.data?.data?.unreadCount;
          if (isMounted && count !== undefined) {
            setUnreadCount(count);
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, location.pathname]);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isHomePage = location.pathname === "/";

  const handleNavClick = (e, targetHash) => {
    setMobileMenuOpen(false);

    if (targetHash === "top") {
      if (isHomePage) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      } else {
        navigate("/");
      }
      return;
    }

    if (isHomePage) {
      e.preventDefault();
      const el = document.getElementById(targetHash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${targetHash}`);
      }
    } else {
      navigate(`/#${targetHash}`);
    }
  };

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <nav className="bg-white border-b border-[#234731]/20 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, "top")}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#112318] flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:bg-[#234731] transition">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  LOK SAMARTH
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider hidden sm:inline-block">
                  Citizen Gateway
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold tracking-tight -mt-0.5">
                Your Right • Your Benefit • Your Empowerment
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <button
              onClick={(e) => handleNavClick(e, "top")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isHomePage && !location.hash
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              {t("navHome", "Home")}
            </button>

            <Link
              to="/browse-schemes"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                location.pathname === "/browse-schemes"
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              {t("navBrowseSchemes", "Browse Schemes")}
            </Link>

            <button
              onClick={(e) => handleNavClick(e, "how-it-works")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              {t("navHowItWorks", "How It Works")}
            </button>

            <button
              onClick={(e) => handleNavClick(e, "features")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              {t("navFeatures", "Features")}
            </button>

            <button
              onClick={(e) => handleNavClick(e, "about")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              {t("navAbout", "About")}
            </button>

            <button
              onClick={(e) => handleNavClick(e, "faq")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              {t("navFaq", "FAQ")}
            </button>

            {isAuthenticated && (
              <Link
                to={user?.role === "admin" ? "/admin" : "/dashboard"}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition flex items-center gap-1.5 border border-emerald-200"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
                <span>{user?.role === "admin" ? "Admin Console" : "Dashboard"}</span>
              </Link>
            )}
          </div>

          {/* Desktop Right Controls (Language Dropdown + Auth) */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 transition cursor-pointer"
                aria-label="Change Language"
              >
                <Globe className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                <span>{currentLang?.flag} {currentLang?.label} ({currentLang?.short})</span>
                <ChevronDown className="w-3 h-3 ml-1 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 py-1 z-50 animate-fade-in">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    भाषा चुनें (Language)
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-emerald-50 transition ${
                        language === l.code ? "text-emerald-800 bg-emerald-50/60" : "text-slate-700"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {user?.role === "citizen" && (
                  <>
                    <Link
                      to="/dashboard/applications"
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition flex items-center"
                    >
                      <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {t("navTracker", "Applications")}
                    </Link>

                    <Link
                      to="/dashboard/notifications"
                      className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                      title="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
                      )}
                    </Link>
                  </>
                )}

                <Link
                  to={user?.role === "admin" ? "/admin" : "/dashboard"}
                  className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-extrabold bg-[#112318] hover:bg-[#234731] text-white shadow-xs transition active:scale-95"
                >
                  <UserCheck className="w-4 h-4 mr-1.5" />
                  {user?.role === "admin" ? t("adminConsole", "Admin Console") : t("myDashboard", "My Dashboard")}
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-extrabold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition"
                >
                  {t("login", "Log In")}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-extrabold bg-[#112318] hover:bg-[#234731] text-white shadow-xs transition active:scale-95"
                >
                  {t("register", "Get Started")}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Bar: Language pill + Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => {
                const nextLang = language === "hi" ? "en" : language === "en" ? "mr" : "hi";
                setLanguage(nextLang);
              }}
              className="px-2 py-1 rounded-lg text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-200"
            >
              {currentLang?.flag} {currentLang?.short}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in"
        >
          <div className="space-y-1">
            <button
              onClick={(e) => handleNavClick(e, "top")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {t("navHome", "Home")}
            </button>
            <Link
              to="/browse-schemes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {t("navBrowseSchemes", "Browse Schemes")}
            </Link>
            <button
              onClick={(e) => handleNavClick(e, "how-it-works")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {t("navHowItWorks", "How It Works")}
            </button>
            <button
              onClick={(e) => handleNavClick(e, "features")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {t("navFeatures", "Features")}
            </button>
            <button
              onClick={(e) => handleNavClick(e, "about")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {t("navAbout", "About")}
            </button>
            <button
              onClick={(e) => handleNavClick(e, "faq")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              {t("navFaq", "FAQ")}
            </button>
          </div>

          {/* Language Switcher in Mobile Menu */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">भाषा / Language:</span>
            <div className="flex space-x-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    language === l.code
                      ? "bg-[#112318] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                  aria-label={`Switch language to ${l.label}`}
                >
                  {l.flag} {l.short}
                </button>
              ))}
            </div>
          </div>

          {/* Authenticated Citizen Navigation in Mobile Menu */}
          {isAuthenticated && user?.role === "citizen" && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Citizen Portal Services
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900"
              >
                Dashboard Overview
              </Link>
              <Link
                to="/dashboard/benefit-passport"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900"
              >
                Benefit Passport
              </Link>
              <Link
                to="/dashboard/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900"
              >
                Document Vault
              </Link>
              <Link
                to="/dashboard/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900"
              >
                Tracked Applications
              </Link>
              <Link
                to="/dashboard/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900"
              >
                <span>Alerts &amp; Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Authenticated Admin Navigation in Mobile Menu */}
          {isAuthenticated && user?.role === "admin" && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Admin Console
              </div>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900"
              >
                Analytics Dashboard
              </Link>
              <Link
                to="/admin/schemes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900"
              >
                Manage Schemes
              </Link>
              <Link
                to="/admin/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900"
              >
                Notification Analyzer
              </Link>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to={user?.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-xs font-extrabold bg-[#112318] text-white shadow-xs"
                >
                  {user?.role === "admin" ? t("adminConsole", "Admin Console") : t("myDashboard", "My Dashboard")}
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition"
                  aria-label="Log Out of your account"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  <span>Log Out ({user?.name || user?.email})</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 rounded-xl text-xs font-extrabold text-slate-700 bg-slate-100"
                >
                  {t("login", "Log In")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 rounded-xl text-xs font-extrabold bg-[#112318] text-white shadow-xs"
                >
                  {t("register", "Get Started")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

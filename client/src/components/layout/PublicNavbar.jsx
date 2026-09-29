import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, ChevronDown, Check, ArrowRight, Sparkles, UserCheck, Compass, BrainCircuit } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import BrandLogo from "./BrandLogo";
import Button from "../common/Button";
import LanguageSelector from "../common/LanguageSelector";

/**
 * HAQ DWAAR AI — Modern Civic Information Portal Navbar (Sections 11 & 12)
 * 
 * Desktop:
 * Left: HAQ DWAAR AI • Scheme se Application Tak
 * Center: Home, Browse Schemes, Benefits (dropdown), How It Works, About, FAQ
 * Right: Sign In, [Get Started]
 * 
 * Mobile: Accessible sheet drawer collapsing at <= 1023px (768, 414, 390, 375, 320)
 */
export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [benefitsDropdownOpen, setBenefitsDropdownOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const langRef = useRef(null);
  const benefitsRef = useRef(null);
  const drawerRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
      if (benefitsRef.current && !benefitsRef.current.contains(e.target)) {
        setBenefitsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Escape key to close mobile drawer & dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (langDropdownOpen) setLangDropdownOpen(false);
        if (benefitsDropdownOpen) setBenefitsDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, langDropdownOpen, benefitsDropdownOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isHomePage = location.pathname === "/";

  const handleNavClick = (e, targetHash) => {
    setMobileMenuOpen(false);
    setBenefitsDropdownOpen(false);

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
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-[#e9e1f5] shadow-[0_1px_3px_0_rgba(36,11,73,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <BrandLogo to="/" onClick={(e) => handleNavClick(e, "top")} />

          {/* Desktop Navigation Links (Visible at 1024px+) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {/* Home */}
            <button
              type="button"
              onClick={(e) => handleNavClick(e, "top")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                isHomePage && !location.hash
                  ? "bg-purple-50 text-[#2b0f4c] font-black"
                  : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
              }`}
            >
              {t("navHome", "Home")}
            </button>

            {/* Browse Schemes */}
            <Link
              to="/browse-schemes"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                location.pathname === "/browse-schemes"
                  ? "bg-purple-50 text-[#2b0f4c] font-black"
                  : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
              }`}
            >
              {t("navBrowseSchemes", "Browse Schemes")}
            </Link>

            {/* Benefits Dropdown Menu (Section 12) */}
            <div className="relative" ref={benefitsRef}>
              <button
                type="button"
                onClick={() => setBenefitsDropdownOpen(!benefitsDropdownOpen)}
                className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  benefitsDropdownOpen
                    ? "bg-purple-50 text-[#2b0f4c] font-black"
                    : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
                }`}
                aria-expanded={benefitsDropdownOpen}
              >
                <span>Benefits</span>
                <ChevronDown className="w-3 h-3 ml-1 text-[#64748b]" />
              </button>

              {benefitsDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-[#e9e1f5] py-2 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1">
                  <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#64748b] border-b border-[#e9e1f5]">
                    Personalized Services
                  </div>
                  <Link
                    to="/browse-schemes"
                    onClick={() => setBenefitsDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3.5 py-2 text-xs font-bold text-[#0f172a] hover:bg-purple-50 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-[#ea580c] shrink-0" />
                    <div>
                      <div>Find Benefits</div>
                      <div className="text-[10px] font-normal text-[#64748b]">Explore verified government schemes</div>
                    </div>
                  </Link>

                  <Link
                    to={isAuthenticated ? "/dashboard/life-situation" : "/register"}
                    onClick={() => setBenefitsDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3.5 py-2 text-xs font-bold text-[#0f172a] hover:bg-purple-50 transition-colors"
                  >
                    <BrainCircuit className="w-4 h-4 text-[#591d8f] shrink-0" />
                    <div>
                      <div>Life Situation</div>
                      <div className="text-[10px] font-normal text-[#64748b]">Describe your need in plain words</div>
                    </div>
                  </Link>

                  <Link
                    to={isAuthenticated ? "/dashboard/benefit-passport" : "/register"}
                    onClick={() => setBenefitsDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-3.5 py-2 text-xs font-bold text-[#0f172a] hover:bg-purple-50 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div>Benefit Passport</div>
                      <div className="text-[10px] font-normal text-[#64748b]">Structured profile for matching</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Controls (Sign In & Get Started) */}
          <div className="hidden lg:flex items-center space-x-2.5">
            {isAuthenticated ? (
              <Button
                variant="plum"
                size="sm"
                to={user?.role === "admin" ? "/admin" : "/dashboard"}
              >
                {user?.role === "admin" ? "Admin Console" : "My Dashboard"}
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  to="/login"
                >
                  {t("login", "Sign In")}
                </Button>
                <Button
                  variant="orange"
                  size="sm"
                  to="/register"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  {t("register", "Get Started")}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger Button (<= 1023px) */}
          <div className="flex lg:hidden items-center space-x-2">
            <LanguageSelector />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-[#0f172a] hover:bg-purple-50 border border-[#e9e1f5] transition-colors focus-visible:ring-2 focus-visible:ring-[#591d8f] cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-x-0 top-16 bottom-0 z-50 lg:hidden bg-slate-900/40 backdrop-blur-xs flex flex-col justify-start animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === drawerRef.current) setMobileMenuOpen(false);
          }}
        >
          <div className="bg-white border-b border-[#e9e1f5] shadow-2xl px-5 pt-4 pb-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9e1f5]">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#4b5563]">
                Navigation Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-[#4b5563] hover:text-[#0f172a] hover:bg-purple-50 border border-[#e9e1f5] cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={(e) => handleNavClick(e, "top")}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#4b5563] hover:bg-[#fbf9fe] hover:text-[#0f172a] cursor-pointer"
              >
                Home
              </button>
              <Link
                to="/browse-schemes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#4b5563] hover:bg-[#fbf9fe] hover:text-[#0f172a]"
              >
                Browse Schemes
              </Link>
              <Link
                to={isAuthenticated ? "/dashboard/benefit-passport" : "/register"}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#4b5563] hover:bg-[#fbf9fe] hover:text-[#0f172a]"
              >
                Benefit Passport
              </Link>
            </div>

            {/* Language toggle in drawer */}
            <div className="pt-2.5 border-t border-[#e9e1f5] flex items-center justify-between">
              <span className="text-xs font-bold text-[#4b5563]">भाषा / Language:</span>
              <LanguageSelector />
            </div>

            {/* Auth CTA buttons in drawer */}
            <div className="pt-3 border-t border-[#e9e1f5] space-y-2">
              {isAuthenticated ? (
                <Button
                  variant="plum"
                  fullWidth
                  to={user?.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user?.role === "admin" ? "Admin Console" : "My Dashboard"}
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    fullWidth
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("login", "Sign In")}
                  </Button>
                  <Button
                    variant="orange"
                    fullWidth
                    to="/register"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("register", "Get Started")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

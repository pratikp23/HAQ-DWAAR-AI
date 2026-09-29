import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, ChevronDown, Check, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../context/LanguageContext";
import BrandLogo from "./BrandLogo";
import Button from "../common/Button";

/**
 * HAQ DWAAR AI — Public Navbar
 */
export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const langRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const navLinks = [
    { label: t("navHome", "Home"), onClick: (e) => handleNavClick(e, "top"), active: isHomePage && !location.hash },
    { label: t("navBrowseSchemes", "Browse Schemes"), to: "/browse-schemes", active: location.pathname === "/browse-schemes" },
    { label: t("navHowItWorks", "How It Works"), onClick: (e) => handleNavClick(e, "how-it-works"), active: location.hash === "#how-it-works" },
    { label: t("navAbout", "About"), onClick: (e) => handleNavClick(e, "about"), active: location.hash === "#about" },
    { label: t("navFaq", "FAQ"), onClick: (e) => handleNavClick(e, "faq"), active: location.hash === "#faq" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-[#e9e1f5] shadow-[0_1px_3px_0_rgba(36,11,73,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <BrandLogo to="/" onClick={(e) => handleNavClick(e, "top")} />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((item, idx) =>
              item.to ? (
                <Link
                  key={idx}
                  to={item.to}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    item.active
                      ? "bg-purple-50 text-[#2b0f4c] font-extrabold"
                      : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={idx}
                  type="button"
                  onClick={item.onClick}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    item.active
                      ? "bg-purple-50 text-[#2b0f4c] font-extrabold"
                      : "text-[#4b5563] hover:text-[#0f172a] hover:bg-[#fbf9fe]"
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          {/* Right Controls: Language + Sign In + Get Started */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#0f172a] hover:text-[#2b0f4c] bg-[#fbf9fe] hover:bg-[#f7f5fa] border border-[#e9e1f5] transition-colors focus-visible:ring-2 focus-visible:ring-[#591d8f]"
                aria-label="Change Language"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 mr-1 text-[#591d8f]" />
                <span>{currentLang?.flag} {currentLang?.label}</span>
                <ChevronDown className="w-3 h-3 ml-1 text-[#4b5563]" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-[#e9e1f5] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#4b5563] border-b border-[#e9e1f5]">
                    भाषा चुनें (Language)
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-purple-50 transition-colors ${
                        language === l.code ? "text-[#2b0f4c] bg-purple-50/70" : "text-[#4b5563]"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-[#591d8f]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
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

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => {
                const nextLang = language === "hi" ? "en" : "hi";
                setLanguage(nextLang);
              }}
              className="px-2 py-1 rounded-lg text-xs font-bold bg-[#fbf9fe] text-[#0f172a] border border-[#e9e1f5]"
            >
              {currentLang?.flag} {currentLang?.short}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-[#0f172a] hover:bg-purple-50 border border-[#e9e1f5] transition-colors focus-visible:ring-2 focus-visible:ring-[#591d8f]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e9e1f5] px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-100">
          <div className="space-y-1">
            {navLinks.map((item, idx) =>
              item.to ? (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                    item.active
                      ? "bg-purple-50 text-[#2b0f4c]"
                      : "text-[#4b5563] hover:bg-[#fbf9fe]"
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={idx}
                  type="button"
                  onClick={item.onClick}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#4b5563] hover:bg-[#fbf9fe]"
                >
                  {item.label}
                </button>
              )
            )}
          </div>

          <div className="pt-4 border-t border-[#e9e1f5] space-y-2">
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
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("register", "Get Started")}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

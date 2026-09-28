import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Menu, X, ArrowRight, UserCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
      // Cross-page navigation: Navigate to /#targetHash
      navigate(`/#${targetHash}`);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, "top")}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black text-xl shadow-xs group-hover:bg-blue-800 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  HAQ DWAAR <span className="text-blue-700">AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider hidden sm:inline-block">
                  Civic AI
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium tracking-tight -mt-0.5">
                Scheme se Application Tak
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={(e) => handleNavClick(e, "top")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isHomePage && !location.hash
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Home
            </button>

            <Link
              to="/browse-schemes"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                location.pathname === "/browse-schemes"
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Browse Schemes
            </Link>

            <button
              onClick={(e) => handleNavClick(e, "how-it-works")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              How It Works
            </button>

            <button
              onClick={(e) => handleNavClick(e, "features")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              Features
            </button>

            <button
              onClick={(e) => handleNavClick(e, "about")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              About
            </button>

            <button
              onClick={(e) => handleNavClick(e, "faq")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              FAQ
            </button>
          </div>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center space-x-2.5">
            {isAuthenticated ? (
              <Link
                to={user?.role === "admin" ? "/admin/schemes" : "/dashboard"}
                className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition"
              >
                <UserCheck className="w-4 h-4 mr-1.5" />
                {user?.role === "admin" ? "Admin Console" : "My Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="space-y-1">
            <button
              onClick={(e) => handleNavClick(e, "top")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Home
            </button>
            <Link
              to="/browse-schemes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse Schemes
            </Link>
            <button
              onClick={(e) => handleNavClick(e, "how-it-works")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </button>
            <button
              onClick={(e) => handleNavClick(e, "features")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Features
            </button>
            <button
              onClick={(e) => handleNavClick(e, "about")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              About
            </button>
            <button
              onClick={(e) => handleNavClick(e, "faq")}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              FAQ
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                to={user?.role === "admin" ? "/admin/schemes" : "/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 text-white"
              >
                {user?.role === "admin" ? "Admin Console" : "Go to Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 text-white hover:bg-blue-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

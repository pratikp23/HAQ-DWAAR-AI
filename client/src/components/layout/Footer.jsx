import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleAnchorClick = (e, targetHash) => {
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

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Purpose Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight">
                  HAQ DWAAR <span className="text-blue-400">AI</span>
                </span>
                <p className="text-[10px] text-blue-300 font-semibold tracking-wide">
                  Scheme se Application Tak
                </p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              A citizen-side assistance platform designed to reduce the gap between discovering a government scheme and being prepared to apply for it.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-semibold pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy First • Zero Data Selling</span>
            </div>
          </div>

          {/* Scheme Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Supported Sectors
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <Link to="/browse-schemes?category=STUDENT" className="hover:text-white transition">
                  🎓 Student & Education
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes?category=KISAN" className="hover:text-white transition">
                  🌾 Kisan & Agriculture
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes?category=EMPLOYMENT" className="hover:text-white transition">
                  💼 Employment & Livelihood
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes?category=BUSINESS" className="hover:text-white transition">
                  🏢 Business & MSME
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes?category=GENERAL" className="hover:text-white transition">
                  🏛️ General & Social Welfare
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Navigation
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <button
                  onClick={(e) => handleAnchorClick(e, "top")}
                  className="hover:text-white transition text-left"
                >
                  Home (Top)
                </button>
              </li>
              <li>
                <Link to="/browse-schemes" className="hover:text-white transition">
                  Browse Schemes Catalog
                </Link>
              </li>
              <li>
                <button
                  onClick={(e) => handleAnchorClick(e, "how-it-works")}
                  className="hover:text-white transition text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleAnchorClick(e, "features")}
                  className="hover:text-white transition text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleAnchorClick(e, "about")}
                  className="hover:text-white transition text-left"
                >
                  About the Project
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleAnchorClick(e, "faq")}
                  className="hover:text-white transition text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Integrity Highlights */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Core Principles
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li className="flex items-start space-x-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Deterministic Matching:</strong> Rule-based profile evaluation against verified criteria. Zero AI hallucinations in rules.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Personal Document Vault:</strong> Secure storage with manual upload and simulated DigiLocker demo import.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Official Gateways:</strong> Direct links to authorized government application portals.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Civic & Legal Disclaimer Box */}
        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Independent Citizen Assistance Disclaimer</span>
          </div>
          <p>
            <strong>HAQ DWAAR AI</strong> is an independent citizen-side assistance platform built to simplify welfare access. It is <strong>NOT</strong> a government portal, agency, or official entity. It does <strong>NOT</strong> automatically approve eligibility or submit government applications. All scheme summaries and criteria are compiled from verified official government notifications. Profile matching reflects published criteria and final eligibility is determined solely by the respective issuing government authorities.
          </p>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} HAQ DWAAR AI — Scheme se Application Tak. Open Civic Tech Initiative.</p>
          <div className="flex items-center space-x-4">
            <button onClick={(e) => handleAnchorClick(e, "about")} className="hover:text-slate-300 transition">About</button>
            <button onClick={(e) => handleAnchorClick(e, "faq")} className="hover:text-slate-300 transition">FAQ</button>
            <Link to="/browse-schemes" className="hover:text-slate-300 transition">Schemes</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

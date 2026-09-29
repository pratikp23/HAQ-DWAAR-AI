import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  ExternalLink, 
  ArrowUp, 
  Fingerprint, 
  Sparkles, 
  CheckCircle2, 
  Globe2, 
  PhoneCall, 
  FileCheck2, 
  HelpCircle 
} from "lucide-react";
import { LayoutContext } from "../../context/LayoutContext";
import BrandLogo from "./BrandLogo";

/**
 * HAQ DWAAR AI — Modern Civic Information Portal Footer
 * Featuring PhonePe-style Biometric & Identity Trust, 13 Regional Languages,
 * and Official Direct Gateways.
 */
export default function Footer({ forceRender = false }) {
  const { inLayout } = useContext(LayoutContext) || {};
  const location = useLocation();
  const navigate = useNavigate();

  // If already rendered by a layout shell and not explicitly forced, suppress duplicate
  if (inLayout && !forceRender) {
    return null;
  }

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
    <footer className="bg-gradient-to-b from-[#13072b] via-[#1a0a3a] to-[#0d041c] text-slate-200 border-t border-[#31145f]/80 text-xs selection:bg-[#5f259f] selection:text-white">
      
      {/* 1. TOP CIVIC TRUST HEADER STRIP */}
      <div className="border-b border-[#2d1254]/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Left: PhonePe-Style Logo & Tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <BrandLogo
              to="/"
              size="md"
              showSubtitle={true}
              iconType="fingerprint"
              className="text-white [&_span]:text-white"
              subtitleColor="text-purple-300"
            />
            <div className="hidden sm:block h-8 w-[1px] bg-purple-800/60" />
            <div className="text-[12px] text-purple-200/90 leading-tight">
              <span className="font-extrabold text-white">Digital Public Infrastructure</span>
              <div className="text-[11px] text-purple-300 flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% Gazette-Verified Citizen Welfare Gateway</span>
              </div>
            </div>
          </div>

          {/* Right: Trust Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#240e4f]/80 border border-purple-500/20 text-purple-200 text-[11px] font-semibold">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>13 Indian Languages</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#240e4f]/80 border border-purple-500/20 text-purple-200 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Deterministic Matching</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#240e4f]/80 border border-purple-500/20 text-purple-200 text-[11px] font-semibold">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero Data Selling</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN 5-COLUMN DIRECTORY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Column 1: Citizen Sectors */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>Welfare Sectors</span>
            </h4>
            <ul className="space-y-2 text-purple-200/80 text-[11px]">
              <li>
                <Link to="/browse-schemes?category=KISAN" className="hover:text-white transition flex items-center gap-1">
                  <span>🌾</span> <span>Kisan &amp; Agriculture</span>
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes?category=STUDENT" className="hover:text-white transition flex items-center gap-1">
                  <span>🎓</span> <span>Students &amp; Scholarships</span>
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes?category=EMPLOYMENT" className="hover:text-white transition flex items-center gap-1">
                  <span>💼</span> <span>Employment &amp; Skill</span>
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes?category=BUSINESS" className="hover:text-white transition flex items-center gap-1">
                  <span>🏭</span> <span>MSME &amp; Enterprises</span>
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes?category=HOUSING" className="hover:text-white transition flex items-center gap-1">
                  <span>🏠</span> <span>Housing &amp; Urban</span>
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes?category=GENERAL" className="hover:text-white transition flex items-center gap-1">
                  <span>🛡️</span> <span>Social Security &amp; Pension</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Citizen Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Citizen Tools</span>
            </h4>
            <ul className="space-y-2 text-purple-200/80 text-[11px]">
              <li>
                <Link to="/dashboard/benefit-passport" className="hover:text-white transition">
                  Benefit Passport
                </Link>
              </li>
              <li>
                <Link to="/dashboard/documents" className="hover:text-white transition">
                  Document Health Vault
                </Link>
              </li>
              <li>
                <Link to="/dashboard/readiness" className="hover:text-white transition">
                  Pre-Application Readiness
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleAnchorClick(e, "features")}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Bhashini AI Voice Mitra
                </button>
              </li>
              <li>
                <Link to="/dashboard/applications" className="hover:text-white transition">
                  Application Milestone Tracker
                </Link>
              </li>
              <li>
                <Link to="/browse-schemes" className="hover:text-white transition">
                  Official Scheme Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: How It Works & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Trust &amp; Process</span>
            </h4>
            <ul className="space-y-2 text-purple-200/80 text-[11px]">
              <li>
                <button
                  type="button"
                  onClick={(e) => handleAnchorClick(e, "how-it-works")}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  6-Step Citizen Journey
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleAnchorClick(e, "features")}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Deterministic Rule Engine
                </button>
              </li>
              <li>
                <span className="hover:text-white transition cursor-default">
                  Gazette Verification Protocol
                </span>
              </li>
              <li>
                <span className="hover:text-white transition cursor-default">
                  Zero Commercial Middlemen
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleAnchorClick(e, "about")}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  About the Initiative
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleAnchorClick(e, "faq")}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Direct Gateways */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Official Gateways</span>
            </h4>
            <ul className="space-y-2 text-purple-200/80 text-[11px]">
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1 group"
                >
                  <span>National Scholarship (NSP)</span>
                  <ExternalLink className="w-3 h-3 text-purple-400 group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1 group"
                >
                  <span>PM-Kisan Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 text-purple-400 group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digilocker.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1 group"
                >
                  <span>DigiLocker India</span>
                  <ExternalLink className="w-3 h-3 text-purple-400 group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mygov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1 group"
                >
                  <span>MyGov Citizen Portal</span>
                  <ExternalLink className="w-3 h-3 text-purple-400 group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://web.umang.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1 group"
                >
                  <span>UMANG App Services</span>
                  <ExternalLink className="w-3 h-3 text-purple-400 group-hover:text-white" />
                </a>
              </li>
              <li>
                <a
                  href="https://dbtbharat.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1 group"
                >
                  <span>DBT Bharat Gateway</span>
                  <ExternalLink className="w-3 h-3 text-purple-400 group-hover:text-white" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: National Helplines & Grievance */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>National Helplines</span>
            </h4>
            <div className="space-y-2 text-purple-200/80 text-[11px]">
              <div className="p-2.5 rounded-xl bg-[#240e4f]/60 border border-purple-500/20">
                <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Citizen Consumer Helpline</div>
                <div className="text-white font-extrabold text-sm flex items-center gap-1 mt-0.5">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1915</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#240e4f]/60 border border-purple-500/20">
                <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Kisan Call Centre</div>
                <div className="text-white font-extrabold text-xs flex items-center gap-1 mt-0.5">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>1800-180-1551</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#240e4f]/60 border border-purple-500/20">
                <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">CPGRAMS Grievance</div>
                <a
                  href="https://pgportal.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 hover:text-white font-bold text-xs inline-flex items-center gap-1 mt-0.5"
                >
                  <span>pgportal.gov.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* 3. PHONEPE-INSPIRED SECURITY & BIOMETRIC TRUST CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#240d4f] via-[#331168] to-[#1c083d] p-6 sm:p-8 border border-purple-400/20 shadow-xl mb-10">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              {/* PhonePe-Style Glowing Fingerprint Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7c3aed] via-[#5f259f] to-[#3b0764] flex items-center justify-center text-white shadow-lg shadow-purple-950/40 ring-2 ring-purple-300/40 shrink-0">
                <Fingerprint className="w-7 h-7 text-white" strokeWidth={2.4} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    Citizen Security &amp; Identity Privacy First
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Encrypted Vault
                  </span>
                </div>
                <p className="text-xs text-purple-200/90 max-w-2xl leading-relaxed">
                  HAQ DWAAR AI utilizes a zero-commercial-sale architecture. Your personal profile, benefit matches, and uploaded certificates are strictly used to compute eligibility and readiness before you visit authorized government portals.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-950/30 transition-all cursor-pointer"
              >
                Create Benefit Passport
              </Link>
            </div>

          </div>
        </div>

        {/* 4. CIVIC TRUST & LEGAL NON-AGENCY NOTICE */}
        <div className="p-4 sm:p-5 bg-[#170630]/90 rounded-2xl border border-purple-900/60 text-[11px] text-purple-300/90 space-y-2 leading-relaxed">
          <div className="flex items-center space-x-2 text-amber-300 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="uppercase tracking-wider text-[10px]">Civic Platform Notice &amp; Disclaimer</span>
          </div>
          <p>
            <strong>HAQ DWAAR AI is an independent civic assistance platform and is NOT an official government agency or public authority.</strong> All applications, verification of claims, and final benefit disbursements are conducted strictly through authorized government ministries and official portals (such as NSP, PM-Kisan, and State Portals). Scheme summaries and eligibility criteria are curated from published gazettes and official circulars for informational guidance only.
          </p>
        </div>

        {/* 5. BOTTOM BAR WITH BACK-TO-TOP & COPYRIGHT */}
        <div className="mt-10 pt-6 border-t border-purple-900/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-purple-400 gap-4">
          <div className="flex items-center space-x-2">
            <span>© 2026</span>
            <span className="font-extrabold text-purple-200">HAQ DWAAR AI</span>
            <span>• Developed for India&apos;s 140+ Crore Citizens</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={(e) => handleAnchorClick(e, "about")}
              className="hover:text-white transition cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={(e) => handleAnchorClick(e, "faq")}
              className="hover:text-white transition cursor-pointer"
            >
              FAQ
            </button>
            <Link to="/browse-schemes" className="hover:text-white transition">
              Browse Schemes
            </Link>
            <button
              type="button"
              onClick={(e) => handleAnchorClick(e, "top")}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#270d54] hover:bg-[#341170] text-purple-200 hover:text-white transition cursor-pointer border border-purple-500/20"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

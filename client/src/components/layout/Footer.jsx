import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";
import { LayoutContext } from "../../context/LayoutContext";
import BrandLogo from "./BrandLogo";

/**
 * HAQ DWAAR AI — Civic Public Footer Foundation
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
    <footer className="bg-[#1e0a3c] text-purple-100 border-t border-[#240b49] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose Column */}
          <div className="space-y-3 md:col-span-1">
            <BrandLogo to="/" size="sm" showSubtitle={false} className="text-white [&_span]:text-white" />
            <p className="text-[11px] text-purple-200 font-semibold tracking-wide">
              Scheme se Application Tak
            </p>
            <p className="text-purple-300 leading-relaxed text-[11px]">
              An independent civic-tech assistance platform empowering citizens to discover relevant government benefits, understand eligibility criteria, organize certificates, and reach authorized official application portals.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-semibold pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy First • Zero Data Selling • Open Civic Tech</span>
            </div>
          </div>

          {/* Scheme Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Welfare Domains
            </h4>
            <ul className="space-y-1.5 text-purple-300 text-[11px]">
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

          {/* Platform Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Navigation
            </h4>
            <ul className="space-y-1.5 text-purple-300 text-[11px]">
              <li>
                <button
                  type="button"
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
                  type="button"
                  onClick={(e) => handleAnchorClick(e, "how-it-works")}
                  className="hover:text-white transition text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleAnchorClick(e, "about")}
                  className="hover:text-white transition text-left"
                >
                  About the Platform
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleAnchorClick(e, "faq")}
                  className="hover:text-white transition text-left"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Architectural Safeguards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Civic Safeguards
            </h4>
            <ul className="space-y-2 text-purple-300 text-[11px]">
              <li className="flex items-start space-x-1.5">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong>Deterministic Matching:</strong> 100% mathematical evaluation against published rules. Zero AI hallucinations in eligibility.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong>Benefit Firewall:</strong> Server-side trust boundary intercepting unsupported claims.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong>Verified Portals:</strong> Citizens apply directly on authorized official government gateways.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Civic & Legal Disclaimer Box */}
        <div className="p-4 bg-[#240b49]/80 rounded-2xl border border-purple-900/60 text-[11px] text-purple-300 space-y-1.5 leading-relaxed">
          <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Civic Trust & Non-Agency Notice</span>
          </div>
          <p>
            <strong>HAQ DWAAR AI is an assistance platform and is not a government portal. Applications are completed through official application portals.</strong> It does not process government applications, issue legal approvals, or guarantee eligibility. All scheme summaries are compiled from authentic, admin-verified official notifications. Final eligibility and benefit disbursement decisions rest solely with the competent government authority.
          </p>
        </div>

        {/* Bottom Strip */}
        <div className="mt-8 pt-6 border-t border-purple-900/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-purple-400 gap-3">
          <p>© {new Date().getFullYear()} HAQ DWAAR AI — Scheme se Application Tak. Open Civic Tech Initiative.</p>
          <div className="flex items-center space-x-4">
            <button type="button" onClick={(e) => handleAnchorClick(e, "about")} className="hover:text-purple-200 transition">About</button>
            <button type="button" onClick={(e) => handleAnchorClick(e, "faq")} className="hover:text-purple-200 transition">FAQ</button>
            <Link to="/browse-schemes" className="hover:text-purple-200 transition">Schemes</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ExternalLink, 
  ArrowUp, 
  ShieldCheck, 
  AlertCircle,
  PhoneCall
} from "lucide-react";
import { LayoutContext } from "../../context/LayoutContext";
import { useAuth } from "../../hooks/useAuth";

/**
 * LOK SAMARTH — ReactBits Pro Footer-1 (@reactbits-pro/footer-1) in Light Sage Green
 * Reference: https://pro.reactbits.dev/docs/blocks/footer/footer-1?variantSort=latest
 * 
 * Features:
 * 1. Palette: Light Sage Green (#eef5f0 / #e3ede6 / #d5e5d9) with rich forest green (#112318) typography.
 * 2. Top Dual-Column Grid:
 *    - Left: Circular emblem badge, bold brand title, slogan headline, and heritage footnote.
 *    - Right: Bordered 3-column table grid with clean thin dividers and hover states.
 * 3. Statutory Civic Transparency Notice: Official non-agency gazette disclosure.
 * 4. Signature Giant Watermark Typography: "LOK SAMARTH" fully visible, non-clipped responsive watermark.
 * 5. Bottom Utility Bar: Copyright, essential navigation, and Back to Top action.
 */
export default function Footer({ forceRender = false }) {
  const { inLayout } = useContext(LayoutContext) || {};
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // If already rendered by a layout shell and not explicitly forced, suppress duplicate
  if (inLayout && !forceRender) {
    return null;
  }

  const isHomePage = location.pathname === "/";

  const handleAnchorClick = (e, targetHash) => {
    if (targetHash === "top") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    <footer className="bg-[#eef5f0] text-[#24422e] border-t border-[#c6decb] relative overflow-hidden font-sans selection:bg-[#ea580c] selection:text-white">
      {/* Background Subtle Sage Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#cbe3d2]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#ea580c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 relative z-10 space-y-12">
        
        {/* ======================================================== */}
        {/* 1. TOP MAIN ROW (Left: Brand & Slogan | Right: Bordered Grid) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Brand identity & punchline */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-8">
            <div className="space-y-6">
              {/* Brand Logo & Name */}
              <Link to="/" className="inline-flex items-center gap-3.5 group">
                <div className="w-11 h-11 rounded-full bg-[#112318] text-white flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform">
                  LS
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-wider text-[#112318] uppercase leading-none">
                    LOK SAMARTH
                  </span>
                  <span className="text-[10px] font-bold text-[#235836] uppercase tracking-widest mt-1">
                    लोक समर्थ • हक से हकदार
                  </span>
                </div>
              </Link>

              {/* Bold Headline Tagline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#112318] tracking-tight leading-snug max-w-md">
                Your Right, Your Benefit, Your Empowerment.
              </h2>
              
              <p className="text-xs sm:text-sm text-[#385a42] font-medium leading-relaxed max-w-sm">
                India's sovereign civic welfare gateway. Instant scheme discovery, statutory document health audits, and zero-leakage direct benefits.
              </p>
            </div>

            {/* Heritage & Standard Footnote */}
            <div className="pt-4 border-t border-[#c6decb] space-y-1.5">
              <p className="text-xs text-[#44684e] font-semibold">
                Sovereign Digital Public Infrastructure since 2026
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#1e6137] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#1e6137]" />
                <span>Zero Intermediary • Encrypted Storage</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Bordered Box Grid (ReactBits Pro footer-1 signature) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#bed8c5] bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#c6decb]">
              
              {/* Column 1: Welfare Schemes (Programs) */}
              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#112318]">
                  Welfare Schemes
                </h3>
                <ul className="space-y-3 text-xs font-medium">
                  <li>
                    <Link 
                      to="/browse-schemes?category=KISAN" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Kisan &amp; Agriculture</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/browse-schemes?category=STUDENT" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Students &amp; Higher Ed</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/browse-schemes?category=HEALTH" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Healthcare &amp; Swasthya</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/browse-schemes?category=HOUSING" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Affordable Housing</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/browse-schemes?category=BUSINESS" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>MSME &amp; Enterprises</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/browse-schemes?category=GENERAL" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Social Security</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 2: Citizen Services (Resources) */}
              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#112318]">
                  Citizen Services
                </h3>
                <ul className="space-y-3 text-xs font-medium">
                  <li>
                    <Link 
                      to="/dashboard/benefit-passport" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Benefit Passport</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/dashboard/documents" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Document Vault</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/dashboard/applications" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Live Scheme Radar</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/dashboard/life-situation" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>AI Voice Mitra</span>
                      <ExternalLink className="w-3 h-3 text-[#ea580c] opacity-80 group-hover:opacity-100" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/dashboard/profile" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>District Merit Standing</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/how-it-works" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>How Platform Works</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Official Gateways & Support (Support) */}
              <div className="p-6 sm:p-7 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#112318]">
                  Official Gateways
                </h3>
                <ul className="space-y-3 text-xs font-medium">
                  <li>
                    <a 
                      href="https://scholarships.gov.in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>NSP Scholarships</span>
                      <ExternalLink className="w-3 h-3 text-[#1e6137] opacity-80 group-hover:opacity-100" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://pmkisan.gov.in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>PM-KISAN Samman</span>
                      <ExternalLink className="w-3 h-3 text-[#1e6137] opacity-80 group-hover:opacity-100" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://beneficiary.nha.gov.in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Ayushman Bharat</span>
                      <ExternalLink className="w-3 h-3 text-[#1e6137] opacity-80 group-hover:opacity-100" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.digilocker.gov.in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>DigiLocker Portal</span>
                      <ExternalLink className="w-3 h-3 text-[#1e6137] opacity-80 group-hover:opacity-100" />
                    </a>
                  </li>
                  <li>
                    <Link 
                      to="/faq" 
                      className="text-[#2b4c34] hover:text-[#0b1a10] hover:translate-x-0.5 transition flex items-center justify-between group"
                    >
                      <span>Frequently Asked (FAQ)</span>
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="tel:1915" 
                      className="text-[#c2410c] hover:text-[#9a3412] transition flex items-center justify-between font-bold group"
                    >
                      <span className="flex items-center gap-1.5">
                        <PhoneCall className="w-3 h-3" />
                        <span>Helpline: 1915</span>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 2. STATUTORY CIVIC DISCLOSURE NOTICE                     */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/60 border border-[#c2daca] text-[11px] text-[#2f5139] space-y-1.5 leading-relaxed shadow-sm">
          <div className="flex items-center gap-2 text-[#b45309] font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#b45309]" />
            <span className="uppercase tracking-wider text-[10px]">Statutory Civic Transparency &amp; Non-Agency Notice</span>
          </div>
          <p>
            Lok Samarth (लोक समर्थ) is an independent civic assistance platform and is not an official government agency. Benefit approvals, physical inspections, and Direct Benefit Transfer (DBT) funds are disbursed strictly by the competent central and state ministries via sovereign portals. Scheme guidelines are synchronized from gazette circulars for citizen empowerment.
          </p>
        </div>

        {/* ======================================================== */}
        {/* 3. SIGNATURE REACTBITS PRO GIANT WATERMARK TYPOGRAPHY    */}
        {/* ======================================================== */}
        <div className="pt-10 pb-6 w-full select-none pointer-events-none text-center overflow-hidden flex items-center justify-center">
          <span 
            className="font-black uppercase tracking-tight text-[#163520]/10 leading-none whitespace-nowrap block"
            style={{ fontSize: "clamp(2.75rem, 9.8vw, 10.5rem)" }}
          >
            LOK SAMARTH
          </span>
        </div>

        {/* ======================================================== */}
        {/* 4. BOTTOM BAR: COPYRIGHT & NAVIGATION                    */}
        {/* ======================================================== */}
        <div className="pt-6 border-t border-[#c6decb] flex flex-col sm:flex-row items-center justify-between text-xs text-[#385a42] gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span>© 2026</span>
            <span className="font-extrabold text-[#112318]">LOK SAMARTH</span>
            <span>• Sovereign Citizen Entitlement Portal</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-semibold">
            <Link to="/how-it-works" className="text-[#2b4c34] hover:text-[#0b1a10] transition">
              How It Works
            </Link>
            <Link to="/faq" className="text-[#2b4c34] hover:text-[#0b1a10] transition">
              FAQ
            </Link>
            <Link to="/browse-schemes" className="text-[#2b4c34] hover:text-[#0b1a10] transition">
              Browse Schemes
            </Link>
            <button
              type="button"
              onClick={(e) => handleAnchorClick(e, "top")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-[#112318] transition cursor-pointer border border-[#bed8c5] shadow-xs active:scale-95 font-bold"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#1e6137]" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

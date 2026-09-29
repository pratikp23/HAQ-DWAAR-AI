import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Fingerprint,
  Mic,
  ShieldCheck,
  Compass,
  Landmark,
  Lock,
  Sparkles
} from "lucide-react";

/**
 * Combined Slide Configuration:
 * - 4 Core Platform Feature Highlights
 * - 4 DPI Policy & Citizen Reality Highlights (Bhashini Dialect Intent, Rejection Shield, Cyber-Cafe Extortion Shield, Statutory DBT & PIB FactCheck)
 * 
 * 💡 TO ADD IMAGES OR BANNERS IN THE FUTURE:
 * Simply add an `image: "/path/to/image.png"` or `image: "https://..."` property
 * to any slide below!
 */
export const defaultSlides = [
  // 1. Core Feature: Voice Assistance
  {
    id: "voice",
    eyebrow: "BHASHINI VOICE ASSISTANCE / एआई मित्र",
    title: "Speak naturally. Discover the right welfare support.",
    description: "Speak in your local dialect and let AI Mitra help you find schemes that may fit your real-life situation.",
    action: "Talk to AI Mitra",
    icon: Mic,
    gradient: "from-[#130424] via-[#240845] to-[#3f106f]",
    accent: "bg-[#ea580c]",
    targetLink: "#voice-assistant",
    image: "",
    imageType: "illustration",
    imageAlt: "Bhashini Voice Assistant for Indian Citizens"
  },
  // 2. DPI Policy: Conversational Dialect Intent
  {
    id: "bhashini-dpi",
    eyebrow: "BHASHINI NLP MISSION / अपनी मातृभाषा में बोलें",
    title: "“12वीं के बाद बी.टेक कॉलेज फीस के लिए स्कॉलरशिप चाहिए?”",
    description: "Speak in your everyday tongue. AI Mitra understands Bundelkhandi, Bhojpuri, Marathi, Telugu & 12 Indian languages to uncover genuine DBT schemes with zero technical jargon.",
    action: "मातृभाषा में पूछें (Voice Assistant)",
    icon: Mic,
    gradient: "from-[#1e0a3c] via-[#351065] to-[#591d8f]",
    accent: "bg-orange-500",
    targetLink: "#voice-assistant",
    dialectChips: ["हिन्दी", "भोजपुरी", "बुंदेलखंडी", "मराठी", "বাংলা", "తెలుగు"],
    image: "",
    imageType: "illustration",
    imageAlt: "Conversational Dialect Search in Indian Languages"
  },
  // 3. Core Feature: DigiLocker Document Readiness (Pure Deep Forest Pine / Emerald Green)
  {
    id: "digilocker",
    eyebrow: "SECURE DOCUMENT READINESS / सुरक्षित दस्तावेज़",
    title: "Fetch verified documents in one secure click.",
    description: "Connect DigiLocker to check document readiness, find missing items, and prepare your application with confidence.",
    action: "Check documents",
    icon: FileCheck2,
    gradient: "from-[#04241d] via-[#083d34] to-[#065f46]",
    accent: "bg-emerald-500",
    targetLink: "/register",
    image: "",
    imageType: "illustration",
    imageAlt: "DigiLocker Document Readiness Vault"
  },
  // 4. DPI Policy: Form Rejection Shield (Pure Deep Forest Pine / Emerald Green)
  {
    id: "rejection-shield",
    eyebrow: "DOCUMENT READINESS VAULT / दस्तावेज़ स्वास्थ्य जांच",
    title: "Avoid 90% of technical form rejections before you apply.",
    description: "Automated health checks for Class X/XII name spelling variances, Tehsildar income certificate validity, and Aadhaar biometric linkage before official portal submission.",
    action: "Audit Document Health",
    icon: ShieldCheck,
    gradient: "from-[#04241d] via-[#083d34] to-[#065f46]",
    accent: "bg-emerald-400",
    targetLink: "/register",
    metricBadge: "Shield: Name Mismatch & Expiry Detection Active",
    image: "",
    imageType: "illustration",
    imageAlt: "Rejection Shield and Document Quality Checks"
  },
  // 5. Core Feature: Benefit Passport
  {
    id: "passport",
    eyebrow: "BENEFIT PASSPORT & READINESS / पारदर्शी नागरिक पात्रता",
    title: "Know your next step before you apply.",
    description: "Track your application readiness score, manage your profile, and move from a potential match to a clear action plan.",
    action: "Open Benefit Passport",
    icon: Fingerprint,
    gradient: "from-[#1a0633] via-[#330c61] to-[#59148d]",
    accent: "bg-amber-500",
    targetLink: "/register",
    image: "",
    imageType: "illustration",
    imageAlt: "Citizen Benefit Passport Readiness Score"
  },
  // 6. DPI Policy: Cyber-Cafe Extortion Shield
  {
    id: "cybercafe-shield",
    eyebrow: "CYBER-CAFE EXTORTION SHIELD / बिचौलिया-मुक्त नागरिक अधिकार",
    title: "Save ₹250–₹500 in cyber-cafe fees per application.",
    description: "Stop paying unauthorized kiosks for basic eligibility discovery. Our deterministic rules engine computes your 82% Readiness Score with mathematical certainty and zero middleman fee.",
    action: "Check Readiness Score (हक़ पासपोर्ट)",
    icon: Lock,
    gradient: "from-[#2b0f4c] via-[#4d1685] to-[#7c1d7c]",
    accent: "bg-[#fb923c]",
    targetLink: "/register",
    metricBadge: "Readiness: 82% Ready (KYC: 100% • Academic: 90% • Income: 60%)",
    image: "",
    imageType: "illustration",
    imageAlt: "Cyber-Cafe Middleman Extortion Shield"
  },
  // 7. Core Feature: Verified Scheme Catalog
  {
    id: "schemes",
    eyebrow: "OFFICIAL GAZETTE CATALOG / सत्यापित योजनाएं",
    title: "Explore verified welfare schemes with zero guesswork.",
    description: "Inspect central and state welfare benefits, required certificates, and authentic ministry links before creating an account.",
    action: "Browse Schemes",
    icon: Compass,
    gradient: "from-[#180529] via-[#290a42] to-[#7c2d12]",
    accent: "bg-[#ea580c]",
    targetLink: "/browse-schemes",
    image: "",
    imageType: "illustration",
    imageAlt: "Verified Government Schemes Catalog"
  },
  // 8. DPI Policy: Statutory DBT & PIB FactCheck Shield
  {
    id: "statutory-dbt",
    eyebrow: "VERIFIED GAZETTE PORTFOLIO / सत्यापित योजना खोज",
    title: "Direct tuition credits & PFMS transfers without middlemen.",
    description: "Discover authentic programs like MMVY (up to ₹1.5L/yr tuition fee), NSP Central Sector Scheme (₹12,000/yr DBT), and PM-KISAN, verified against official Ministry circulars.",
    action: "Explore 150+ Verified Schemes",
    icon: Landmark,
    gradient: "from-[#160627] via-[#2d0d4b] to-[#9a3412]",
    accent: "bg-amber-400",
    targetLink: "/browse-schemes",
    metricBadge: "PIB FactCheck Synced • Official .gov.in Gateways Only",
    image: "",
    imageType: "illustration",
    imageAlt: "Statutory Direct Benefit Transfer and PIB FactCheck Protection"
  }
];

export function HeroCarousel({
  customSlides,
  onOpenVoice,
  onOpenDigiLocker,
  onOpenPassport,
  isAuthenticated = false
}) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  const slides = customSlides && customSlides.length > 0 ? customSlides : defaultSlides;
  const activeSlide = slides[activeIndex] || slides[0];
  const ActiveIcon = activeSlide.icon || ShieldCheck;

  // Auto-advance timer: 5.5 seconds with pause on hover/focus
  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [activeIndex, isPaused, slides.length]);

  const goToSlide = (index) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const handleAction = () => {
    if (activeSlide.id === "voice" || activeSlide.id === "bhashini-dpi") {
      if (onOpenVoice) return onOpenVoice();
      const voiceEl = document.getElementById("voice-assistant");
      if (voiceEl) {
        voiceEl.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    if (activeSlide.id === "digilocker" || activeSlide.id === "rejection-shield") {
      if (onOpenDigiLocker) return onOpenDigiLocker();
      navigate(isAuthenticated ? "/dashboard/documents" : "/register");
      return;
    }

    if (activeSlide.id === "passport" || activeSlide.id === "cybercafe-shield") {
      if (onOpenPassport) return onOpenPassport();
      navigate(isAuthenticated ? "/dashboard/benefit-passport" : "/register");
      return;
    }

    if (activeSlide.targetLink) {
      if (activeSlide.targetLink.startsWith("#")) {
        const el = document.getElementById(activeSlide.targetLink.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(activeSlide.targetLink);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      goToSlide(activeIndex - 1);
    } else if (e.key === "ArrowRight") {
      goToSlide(activeIndex + 1);
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="relative w-full min-h-[350px] sm:min-h-[400px] md:min-h-[440px] overflow-hidden rounded-3xl shadow-2xl border border-[#e9e1f5] bg-[#120422] focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all"
      aria-roledescription="carousel"
      aria-label="HaqDwaar AI platform highlights"
    >
      {/* Background Gradient with solid underlying tone */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${activeSlide.gradient} transition-all duration-700`}
      />

      {/* Optional full-cover background image */}
      {activeSlide.image && activeSlide.imageType === "cover" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={activeSlide.image}
            alt={activeSlide.imageAlt || "Banner background"}
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />
        </div>
      )}

      {/* Subtle radial glow & geometric accent lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_40%)] pointer-events-none" />
      <div className="absolute -right-24 -bottom-40 h-96 w-96 rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute right-10 top-8 hidden h-44 w-44 rounded-full border border-white/10 md:block pointer-events-none" />

      {/* Main Slide Content */}
      <div className="relative z-10 flex h-full items-center justify-between px-6 py-10 sm:px-10 md:px-16 min-h-[350px] sm:min-h-[400px] md:min-h-[440px]">
        
        {/* Left Column: Eyebrow, Title, Description, Badges, Button */}
        <div className="max-w-2xl text-white space-y-3.5">
          
          {/* Eyebrow Pill */}
          <div className="flex items-center gap-2.5 text-xs font-black tracking-[0.16em] text-white sm:text-sm drop-shadow-sm">
            <span
              className={`grid h-8 w-8 place-items-center rounded-xl ${activeSlide.accent} text-white shadow-lg shrink-0`}
            >
              <ActiveIcon className="h-4 w-4 text-white" />
            </span>
            <span className="uppercase">{activeSlide.eyebrow}</span>
          </div>

          {/* Headline */}
          <h2 className="max-w-2xl text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-md">
            {activeSlide.title}
          </h2>

          {/* Description */}
          <p className="max-w-xl text-xs sm:text-sm md:text-base font-semibold leading-relaxed text-slate-100 drop-shadow-xs">
            {activeSlide.description}
          </p>

          {/* Dialect Chips (for Bhashini slide) */}
          {activeSlide.dialectChips && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-white/90 mr-1">बोलियां / Dialects:</span>
              {activeSlide.dialectChips.map((chip, cIdx) => (
                <span
                  key={cIdx}
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {/* Metric Badge (for DPI Shield slides) */}
          {activeSlide.metricBadge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-black/35 border border-white/30 text-xs font-bold text-amber-200 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{activeSlide.metricBadge}</span>
            </div>
          )}

          {/* CTA Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-black text-[#1e0a3c] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#fff7ed] hover:text-[#ea580c] cursor-pointer"
            >
              <span>{activeSlide.action}</span>
              <ArrowRight className="h-4 w-4 text-[#ea580c]" />
            </button>

            <Link
              to="/browse-schemes"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 text-white px-4 py-3 text-xs sm:text-sm font-black border border-white/40 backdrop-blur-xs transition hover:-translate-y-0.5 cursor-pointer shadow-md"
            >
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Custom Image / Banner OR Floating Glowing Circular Emblem */}
        <div className="hidden lg:flex items-center justify-center shrink-0 ml-6">
          {activeSlide.image && activeSlide.imageType !== "cover" ? (
            /* Future Image / Banner Display */
            <div className="relative max-w-[340px] max-h-[280px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 bg-black/40 backdrop-blur-sm transition-transform duration-500 hover:scale-105">
              <img
                src={activeSlide.image}
                alt={activeSlide.imageAlt || activeSlide.title}
                className="w-full h-auto object-cover"
              />
            </div>
          ) : (
            /* Default Icon / Emblem Design with High Contrast */
            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md shadow-2xl transition-transform duration-700 hover:scale-105">
              <div className="grid h-32 w-32 place-items-center rounded-full border border-white/40 bg-white/20 shadow-inner">
                <ActiveIcon className="h-16 w-16 text-white" strokeWidth={2} />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Prev Navigation Arrow */}
      <button
        type="button"
        onClick={() => goToSlide(activeIndex - 1)}
        className="absolute left-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/50 text-white backdrop-blur-xs transition hover:bg-black/80 hover:scale-105 cursor-pointer sm:left-5 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      {/* Next Navigation Arrow */}
      <button
        type="button"
        onClick={() => goToSlide(activeIndex + 1)}
        className="absolute right-3 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/50 text-white backdrop-blur-xs transition hover:bg-black/80 hover:scale-105 cursor-pointer sm:right-5 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      {/* Bottom Indicator Dots (all 8 slides) */}
      <div
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2 max-w-[80vw] overflow-x-auto py-1"
        role="tablist"
        aria-label="Carousel slides"
      >
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.id || index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
              index === activeIndex
                ? "w-8 bg-white shadow-md"
                : "w-2.5 bg-white/60 hover:bg-white border border-black/20"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === activeIndex}
            role="tab"
          />
        ))}
      </div>

      {/* Verified Citizen Assistance & PIB FactCheck Shield Watermark */}
      <div className="absolute bottom-5 right-6 hidden items-center gap-1.5 text-[11px] font-black text-white sm:flex pointer-events-none drop-shadow-sm">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>Verified citizen assistance • DPI Compliant</span>
      </div>
    </section>
  );
}

export default HeroCarousel;

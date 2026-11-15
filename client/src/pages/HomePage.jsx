import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  FileCheck2, 
  CheckCircle2, 
  ExternalLink, 
  Lock, 
  Search, 
  FileText, 
  BrainCircuit, 
  Layers, 
  Database,
  Upload,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Check,
  Compass,
  FileSearch,
  Bell,
  Clock,
  Filter,
  X,
  Mic,
  GraduationCap,
  Tractor,
  Briefcase,
  Home,
  HeartPulse,
  Building2,
  Volume2,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Fingerprint,
  MoreVertical,
  Calendar,
  Award,
  Zap,
  Globe,
  Users,
  BookOpen,
  Coins
} from "lucide-react";
import { getSchemes } from "../services/schemeApi";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import CivicInfiniteMarquee from "../components/common/CivicInfiniteMarquee";
import UnstopTopCategoryCards from "../components/common/UnstopTopCategoryCards";
import Card from "../components/common/Card";
import Avatar from "../components/common/Avatar";
import { SpotlightCard, NumberTicker } from "../components/common/ReactBits";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const [schemes, setSchemes] = useState([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [roleTrackFilter, setRoleTrackFilter] = useState("FARMER");
  const [activeBannerSlide, setActiveBannerSlide] = useState(0);

  // Banner Slides: Indian National Flag Tiranga + User Civic Illustrations
  const bannerSlides = [
    {
      id: "tiranga",
      src: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1400&q=80",
      alt: "Indian National Flag Tiranga",
      tag: "Rashtriya Seva • राष्ट्रीय कल्याण",
      position: "object-[85%_center] sm:object-right",
      opacity: "opacity-75",
    },
    {
      id: "kisan",
      src: "/banners/farmer-kisan.jpg",
      alt: "Kisan Welfare • PM-KISAN & Agriculture",
      tag: "Kisan & Farming • किसान कल्याण",
      position: "object-right sm:object-[90%_center]",
      opacity: "opacity-80",
    },
    {
      id: "healthcare",
      src: "/banners/healthcare-doctors.jpg",
      alt: "Healthcare & Swasthya • Ayushman Bharat",
      tag: "Healthcare • स्वास्थ्य रक्षा",
      position: "object-right sm:object-[90%_center]",
      opacity: "opacity-80",
    },
    {
      id: "education",
      src: "/banners/education-classroom.jpg",
      alt: "Education & Scholarships • Shiksha",
      tag: "Education • शिक्षा व छात्रवृत्ति",
      position: "object-right sm:object-[85%_center]",
      opacity: "opacity-80",
    },
    {
      id: "housing",
      src: "/banners/housing-community.jpg",
      alt: "Affordable Housing • PMAY",
      tag: "Affordable Housing • आवास योजना",
      position: "object-right sm:object-[90%_center]",
      opacity: "opacity-80",
    },
    {
      id: "youth",
      src: "/banners/youth-students.jpg",
      alt: "Youth & Skill Development • Yuva",
      tag: "Youth & Skills • युवा सशक्तिकरण",
      position: "object-right sm:object-[95%_center]",
      opacity: "opacity-80",
    },
  ];

  // 2-second rotation slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  // Load schemes from backend
  useEffect(() => {
    const fetchTopSchemes = async () => {
      try {
        const res = await getSchemes();
        const schemesList = res?.data?.schemes || res?.schemes || (Array.isArray(res) ? res : []);
        if (schemesList.length > 0) {
          setSchemes(schemesList);
        }
      } catch (err) {
        console.warn("Could not load schemes:", err.message);
      } finally {
        setLoadingSchemes(false);
      }
    };
    fetchTopSchemes();
  }, []);

  // Smooth scroll for hash links (e.g. /#faq)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  // 1. Featured National Schemes (Unstop Vertical Poster Cards)
  const featuredPosters = [
    {
      id: "pm-kisan",
      name: "PM-KISAN Samman Nidhi",
      category: "Agriculture & Farmers",
      department: "Ministry of Agriculture & Farmers Welfare",
      benefit: "₹6,000 / Year",
      benefitSubtitle: "Direct DBT in 3 installments",
      eligibility: "Landholding Farmer Families",
      tags: ["Direct Cash", "Central Sector", "All-India"],
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80",
      deadline: "Continuous (Round Year)",
      route: "/browse-schemes?category=KISAN",
      badgeColor: "bg-emerald-500",
    },
    {
      id: "ayushman-bharat",
      name: "Ayushman Bharat PM-JAY",
      category: "Healthcare",
      department: "National Health Authority (NHA)",
      benefit: "₹5,00,000 / Family / Year",
      benefitSubtitle: "100% Cashless secondary & tertiary care",
      eligibility: "SECC Listed Vulnerable Families",
      tags: ["Hospitalization", "Free Card", "Cashless"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
      deadline: "Active in 28,000+ Hospitals",
      route: "/browse-schemes?category=HEALTH",
      badgeColor: "bg-rose-500",
    },
    {
      id: "pmay-urban-rural",
      name: "Pradhan Mantri Awas Yojana (PMAY)",
      category: "Affordable Housing",
      department: "Ministry of Housing & Urban Affairs",
      benefit: "₹1,20,000 - ₹2,50,000",
      benefitSubtitle: "Direct construction grant / interest subsidy",
      eligibility: "Kutcha house dwellers, EWS / LIG",
      tags: ["Pucca House", "Direct Grant", "PMAY-G / U"],
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80",
      deadline: "State Allocation Cycles",
      route: "/browse-schemes?category=HOUSING",
      badgeColor: "bg-amber-500",
    },
    {
      id: "nsp-scholarship",
      name: "National Means-cum-Merit Scholarship",
      category: "Student Welfare",
      department: "Ministry of Education (DoSEL)",
      benefit: "₹12,000 / Year",
      benefitSubtitle: "Annual merit stipend for Class 9-12",
      eligibility: "Govt school students with < ₹3.5L family income",
      tags: ["Merit Scholarship", "NSP Portal", "Class 9-12"],
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80",
      deadline: "31st October Annually",
      route: "/browse-schemes?category=STUDENT",
      badgeColor: "bg-blue-500",
    },
  ];

  // 2. Direct Cash Transfer (DBT) Schemes (Unstop "Competitions" style horizontal cards)
  const dbtSchemes = [
    {
      id: "dbt-1",
      title: "PM-KISAN Income Supplement",
      org: "Ministry of Agriculture & Farmers Welfare",
      benefitChip: "Benefits worth ₹6,000 / yr",
      deadline: "Active Round Year",
      method: "Door 2: 1-Click Quick Apply",
      icon: Tractor,
      route: "/browse-schemes?category=KISAN",
    },
    {
      id: "dbt-2",
      title: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
      org: "Ministry of Women & Child Development",
      benefitChip: "Cash grant ₹5,000 direct DBT",
      deadline: "Continuous enrolment",
      method: "Door 1: SchemeCoach Assisted",
      icon: Users,
      route: "/browse-schemes?category=WOMEN",
    },
    {
      id: "dbt-3",
      title: "PM Shram Yogi Maan-dhan (PMSYM)",
      org: "Ministry of Labour & Employment",
      benefitChip: "Guaranteed ₹3,000 / month pension",
      deadline: "Age 18 - 40 years",
      method: "Door 3: Pre-Filled PDF Form",
      icon: ShieldCheck,
      route: "/browse-schemes?category=GENERAL",
    },
  ];

  // 3. Student Scholarships & Educational Grants (Unstop "Internships" style horizontal cards)
  const scholarshipSchemes = [
    {
      id: "sch-1",
      title: "Post-Matric Scholarship for SC/ST Students",
      org: "Ministry of Social Justice & Empowerment",
      benefitChip: "100% Tuition Fee + ₹13,500/yr",
      deadline: "Annual NSP Application Cycle",
      method: "National Scholarship Portal",
      icon: GraduationCap,
      route: "/browse-schemes?category=STUDENT",
    },
    {
      id: "sch-2",
      title: "Central Sector Scheme for College Students",
      org: "Department of Higher Education (MoE)",
      benefitChip: "₹12,000 to ₹20,000 / yr",
      deadline: "80th percentile in Class 12",
      method: "Direct DBT to Bank Account",
      icon: BookOpen,
      route: "/browse-schemes?category=STUDENT",
    },
    {
      id: "sch-3",
      title: "Pragati Scholarship for Girl Students",
      org: "AICTE / Ministry of Education",
      benefitChip: "₹50,000 / year for Technical Degree",
      deadline: "First year degree/diploma admission",
      method: "Online Verification & Award",
      icon: Award,
      route: "/browse-schemes?category=STUDENT",
    },
  ];

  // 4. Role-Based Citizen Welfare Tracks (Unstop "Role-Based Mock Test" style)
  const roleTracks = {
    FARMER: [
      {
        title: "Small & Marginal Farmer Livelihood Track",
        desc: "Holistic bundle: ₹6,000 DBT, subsidized solar pumps, soil testing, and Kisan Credit Card with 4% interest subvention.",
        partners: ["Agri Ministry", "NABARD", "PMFBY"],
        tags: ["PM-KISAN", "KCC Loan", "Crop Insurance", "+8 Schemes"],
        actionLabel: "Start Farmer Track",
        route: "/browse-schemes?category=KISAN",
      },
      {
        title: "Horticulture & Micro-Irrigation Enterprise",
        desc: "55% subsidy on drip and sprinkler systems under PMKSY, plus cold chain infrastructure capital grants.",
        partners: ["MIDH", "PMKSY", "State Agriculture"],
        tags: ["Per Drop More Crop", "Cold Storage", "+5 Schemes"],
        actionLabel: "Start Irrigation Track",
        route: "/browse-schemes?category=KISAN",
      },
    ],
    STUDENT: [
      {
        title: "Higher Education & Technical Aspirant Track",
        desc: "Full tuition waiver under Post-Matric, collateral-free education loans up to ₹7.5 Lakhs, and Skill India stipends.",
        partners: ["DoSEL", "AICTE", "Canara Vidya Lakshmi"],
        tags: ["NSP Portal", "Vidya Lakshmi", "Free Coaching", "+12 Schemes"],
        actionLabel: "Start Student Track",
        route: "/browse-schemes?category=STUDENT",
      },
      {
        title: "Research & Overseas Fellowship Track",
        desc: "National Overseas Scholarship for SC/ST meritorious students, plus Prime Minister's Research Fellowship (PMRF).",
        partners: ["MoSJE", "DST", "UGC"],
        tags: ["PMRF", "Overseas Grant", "Full Funding", "+6 Schemes"],
        actionLabel: "Start Fellowship Track",
        route: "/browse-schemes?category=STUDENT",
      },
    ],
    WOMEN: [
      {
        title: "Rural Women Livelihood & Self-Help Track",
        desc: "Collateral-free loans up to ₹20 Lakhs under DAY-NRLM SHGs, subsidized poultry/dairy units, and Lakhpati Didi training.",
        partners: ["MoRD", "DAY-NRLM", "NABARD"],
        tags: ["Lakhpati Didi", "SHG Revolving Fund", "+10 Schemes"],
        actionLabel: "Start Women Track",
        route: "/browse-schemes?category=WOMEN",
      },
      {
        title: "Maternal Health & Girl Child Protection",
        desc: "₹5,000 cash transfer under PMMVY, free institutional delivery, and Sukanya Samriddhi high-interest savings.",
        partners: ["MoWCD", "MoHFW", "India Post"],
        tags: ["PMMVY", "Sukanya Samriddhi", "Janani Suraksha"],
        actionLabel: "Start Maternal Track",
        route: "/browse-schemes?category=WOMEN",
      },
    ],
    SENIOR: [
      {
        title: "Guaranteed Senior Citizen Social Security Track",
        desc: "Atal Pension Yojana monthly income up to ₹5,000, Indira Gandhi National Old Age Pension, and free geriatric checkups.",
        partners: ["MoSJE", "PFRDA", "MoHFW"],
        tags: ["Atal Pension", "IGNOAPS", "Senior Health"],
        actionLabel: "Start Pension Track",
        route: "/browse-schemes?category=GENERAL",
      },
      {
        title: "Rashtriya Vayoshri Physical Aids Track",
        desc: "Free assisted living devices, hearing aids, wheelchairs, and spectacles for BPL senior citizens.",
        partners: ["ALIMCO", "MoSJE"],
        tags: ["Free Hearing Aid", "Wheelchair", "ALIMCO Camps"],
        actionLabel: "Start Vayoshri Track",
        route: "/browse-schemes?category=GENERAL",
      },
    ],
    BUSINESS: [
      {
        title: "Micro-Enterprise & PMEGP Manufacturing Track",
        desc: "Up to 35% government capital subsidy on bank project loans up to ₹50 Lakhs for setting up new ventures.",
        partners: ["KVIC", "Ministry of MSME", "SIDBI"],
        tags: ["PMEGP", "Mudra Tarun", "35% Subsidy", "+9 Schemes"],
        actionLabel: "Start MSME Track",
        route: "/browse-schemes?category=BUSINESS",
      },
      {
        title: "PM SVANidhi Street Vendor Micro-Credit",
        desc: "Collateral-free working capital loan of ₹10,000, ₹20,000, and ₹50,000 with 7% interest cashback upon digital transactions.",
        partners: ["MoHUA", "SIDBI", "NPCI"],
        tags: ["SVANidhi", "Cashback", "Interest Subsidy"],
        actionLabel: "Start Vendor Track",
        route: "/browse-schemes?category=BUSINESS",
      },
    ],
  };

  // 5. Frequently Asked Questions
  const faqs = [
    {
      q: "What makes Haq Dwaar AI different from standard government websites?",
      a: "Haq Dwaar AI is India's first 3-Door citizen-side application engine. Rather than just showing static PDFs, we evaluate your exact eligibility deterministically through your Benefit Passport, guide your application via SchemeCoach, allow 1-click Quick Apply to Ministry Nodal Desks, and let you print pre-filled official forms."
    },
    {
      q: "How does the Benefit Passport calculate my eligibility?",
      a: "By entering 7 basic demographic parameters (age, state, caste category, landholding, income, education, occupation), our deterministic rule engine cross-references criteria across 350+ central & state schemes in under 500ms without hallucinations."
    },
    {
      q: "Are my documents and personal data stored securely?",
      a: "Yes. Your Document Vault uses end-to-end encryption. When uploading Aadhaar, Ration Cards, or Land Records, or syncing with DigiLocker, data is strictly used for eligibility readiness and never shared with commercial advertisers."
    },
    {
      q: "What are the 3 Application Doors?",
      a: "Door 1: SchemeCoach (interactive step-by-step roadmap with copyable cheat-sheet for third-party portals); Door 2: 1-Click Quick Apply (direct electronic packet delivery to Department Nodal Review Desk); Door 3: Pre-Filled PDF Form (official watermarked application ready for offline CSC / Tahsil submission)."
    },
  ];

  return (
    <div className="w-full space-y-10 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      
      {/* ======================================================== */}
      {/* LOK SAMARTH CIVIC BANNER WITH VISIBLE TIRANGA & SLIDESHOW  */}
      {/* ======================================================== */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-emerald-900/30 shadow-md bg-[#112318]">
        {/* 1. Indian Tiranga Flag + 5 Civic Welfare Images Rotating Every 2 Seconds */}
        <div className="absolute inset-0 overflow-hidden">
          {bannerSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === activeBannerSlide ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className={`w-full h-full object-cover ${slide.position} ${slide.opacity} scale-105 transition-transform duration-1000`}
              />
            </div>
          ))}

          {/* Light cover tint: clear contrast on the left, opening to reveal the rotating banner image on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#112318] via-[#112318]/75 via-40% to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d14]/70 via-transparent to-black/15 pointer-events-none" />
        </div>

        {/* 2. Banner Content: LOK SAMARTH • Citizen Gateway + Slide Controls */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3.5">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
                  LOK SAMARTH
                </h1>
                <div className="text-xs sm:text-sm font-black text-amber-300 tracking-wider uppercase mt-1">
                  Citizen Gateway • लोक समर्थ
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-100 tracking-wide pt-1">
              Your Right, Your Benefit, Your Empowerment
            </p>
          </div>

          {/* Right: Active Slide Tag (2s Rotation) & Quick Navigation Indicators */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-xs font-semibold text-slate-100 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{bannerSlides[activeBannerSlide]?.tag}</span>
            </div>

            {/* 2s Step Progress Indicators */}
            <div className="flex items-center gap-1.5 pt-0.5" role="tablist" aria-label="Banner slide indicators">
              {bannerSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveBannerSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeBannerSlide
                      ? "w-6 bg-amber-400 shadow-xs"
                      : "w-1.5 bg-white/40 hover:bg-white/75"
                  }`}
                  aria-label={`Slide ${idx + 1}: ${slide.tag}`}
                  aria-selected={idx === activeBannerSlide}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* ======================================================== */}
      {/* 1. HERO: UNSTOP-STYLE HERO HEADLINE & HEROUI CARDS       */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-none">
              Unlock Your <span className="text-[#234731]">Haq!</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-3">
              सरकारी योजनाएं अब आपके द्वार — Scheme se Application Tak, 100% Deterministic &amp; Paperless.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Unstop Badge in Sage Green Palette */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ebf3ed] text-[#234731] text-xs font-semibold border border-[#c8ded0] shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-[#234731] fill-[#234731] shrink-0" />
              <span>Access to ₹2.5 Lakh Cr+ Entitlements | 350+ Schemes</span>
            </div>
          </div>
        </div>

        {/* 1. Unstop Squircle Category Cards (Sage Green) - Unified Horizontal Scroll Row */}
        <UnstopTopCategoryCards />
      </section>

      {/* ======================================================== */}
      {/* 2. FEATURED SCHEMES POSTER CAROUSEL (Unstop "Featured")   */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#234731] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Featured Flagship Schemes
            </h2>
          </div>
          <Link
            to="/browse-schemes"
            className="text-xs sm:text-sm font-bold text-[#234731] hover:text-[#152b1e] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal Poster Cards Grid / Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPosters.map((poster) => (
            <div
              key={poster.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-[#70987a] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Poster Image */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <img
                  src={poster.image}
                  alt={poster.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900 shadow-xs backdrop-blur-xs">
                  {poster.category}
                </span>
              </div>

              {/* Poster Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 truncate">
                    {poster.department}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#152b1e] transition-colors line-clamp-2 leading-snug">
                    {poster.name}
                  </h3>
                  
                  {/* Benefit Callout */}
                  <div className="p-2.5 rounded-xl bg-[#ebf3ed]/70 border border-[#c8ded0] space-y-0.5">
                    <div className="text-xs font-black text-[#152b1e]">
                      {poster.benefit}
                    </div>
                    <div className="text-[10px] font-medium text-slate-600 line-clamp-1">
                      {poster.benefitSubtitle}
                    </div>
                  </div>
                </div>

                {/* Tags & Action */}
                <div className="space-y-3 pt-1 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {poster.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500 font-medium truncate flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {poster.deadline}
                    </span>
                    <Link
                      to={poster.route}
                      className="px-3 py-1.5 rounded-xl bg-[#234731] hover:bg-[#193524] text-white font-bold text-xs shadow-2xs transition shrink-0"
                    >
                      Check Eligibility
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TRUSTED BY NATIONAL RAILS (Unstop "Trusted By")        */}
      {/* ======================================================== */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Trusted National Public Rails &amp; Portals
          </span>
          <p className="text-xs text-slate-500 font-medium">
            Read-only direct synchronization with official Government of India infrastructure
          </p>
        </div>
        <CivicInfiniteMarquee />
      </section>

      {/* ======================================================== */}
      {/* 4. DIRECT CASH TRANSFERS (DBT) (Unstop "Competitions")   */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#234731] rounded-full" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Direct Benefit Transfer (DBT) &amp; Income Support
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Direct monetary entitlements credited directly to your Aadhaar-linked bank account.
              </p>
            </div>
          </div>
          <Link
            to="/browse-schemes"
            className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#234731] hover:text-[#152b1e] bg-[#ebf3ed] hover:bg-[#dfece2] border border-[#c8ded0] transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Horizontal Cards in a Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dbtSchemes.map((item) => (
            <Link
              key={item.id}
              to={item.route}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#70987a] transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ebf3ed] border border-[#c8ded0] flex items-center justify-center shrink-0 text-[#234731]">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#152b1e] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {item.org}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.benefitChip}</span>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.deadline}
                  </span>
                  <span className="font-bold text-[#234731]">
                    {item.method}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. STUDENT SCHOLARSHIPS (Unstop "Internships")            */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#234731] rounded-full" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Scholarships &amp; Student Welfare Grants
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Unleash educational grants, tuition fee waivers, and coaching assistance tailored to your studies.
              </p>
            </div>
          </div>
          <Link
            to="/browse-schemes?category=STUDENT"
            className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#234731] hover:text-[#152b1e] bg-[#ebf3ed] hover:bg-[#dfece2] border border-[#c8ded0] transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Horizontal Cards in a Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scholarshipSchemes.map((item) => (
            <Link
              key={item.id}
              to={item.route}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#70987a] transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-700">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#152b1e] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {item.org}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{item.benefitChip}</span>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.deadline}
                  </span>
                  <span className="font-bold text-[#234731]">
                    {item.method}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. ROLE-BASED WELFARE TRACKS (Unstop "Role Mock Test")   */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#234731] rounded-full" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Role-Based Citizen Welfare Tracks
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Unlock 360° assistance with realistic, deterministic welfare tracks tailored to your life situation.
              </p>
            </div>
          </div>

          {/* Filter Tabs (Unstop style in Sage Green) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "FARMER", label: "Farmers (किसान)" },
              { id: "STUDENT", label: "Students (छात्र)" },
              { id: "WOMEN", label: "Women (महिला)" },
              { id: "SENIOR", label: "Seniors (वरिष्ठ)" },
              { id: "BUSINESS", label: "MSME (उद्यम)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleTrackFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  roleTrackFilter === tab.id
                    ? "bg-[#234731] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-[#ebf3ed] hover:text-[#234731]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2 Big Cards Side-by-Side (Unstop Mock Test cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(roleTracks[roleTrackFilter] || []).map((track, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#70987a] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#152b1e] transition-colors leading-snug">
                    {track.title}
                  </h3>
                  <span className="p-1 text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {track.desc}
                </p>
              </div>

              {/* Partners / Ministries Row */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Aligned With:
                </span>
                <div className="flex items-center gap-2">
                  {track.partners.map((partner, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Tags + Green Start Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 font-medium">
                  {track.tags.slice(0, 3).join(", ")}
                </div>
                <Link
                  to={track.route}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#234731] hover:bg-[#193524] text-white font-bold text-xs shadow-2xs transition group-hover:scale-102"
                >
                  <span>Start Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. UNSTOP-STYLE PROMO BANNERS                            */}
      {/* ======================================================== */}
      <section className="space-y-4">
        {/* Wide Gradient Banner (Forest Green / Spruce Civic Theme) */}
        <div className="bg-gradient-to-r from-[#14261b] via-[#1d3a28] to-[#2b543b] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#396d4e]/40">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-900 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Upgrade Your Welfare Journey With AI MITTRA
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Speak in Hindi, Tamil, Bengali or Marathi — Get Instant Government Roadmaps
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
              Voice-driven assistance across 22 official Indian languages. Complete your Benefit Passport once, discover 100% of your eligible welfare automatically.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition transform hover:scale-102"
              >
                <Mic className="w-4 h-4" />
                <span>Try Voice MITTRA (बोलकर खोजें)</span>
              </Link>
              <span className="text-xs text-[#c8ded0] font-semibold">
                Free for every citizen of India • 100% Paperless
              </span>
            </div>
          </div>

          <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none select-none hidden lg:block">
            <BrainCircuit className="w-72 h-72 text-white" />
          </div>
        </div>

        {/* Dual Side-by-Side Cards (Unstop "100 Days Coding Sprint / Code Conquest") */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: The 3 Application Doors */}
          <div className="bg-gradient-to-br from-[#ebf3ed] via-[#f0f6f2] to-[#f7fbf8] rounded-3xl p-6 sm:p-7 border border-[#c8ded0] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#234731] bg-[#dbebe0] px-2.5 py-0.5 rounded-full border border-[#c8ded0]">
                Core Innovation
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                THE 3 APPLICATION DOORS
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Never get lost on external portals. Choose Door 1: SchemeCoach guided roadmap; Door 2: 1-Click Quick Apply to Nodal Desks; Door 3: Pre-Filled PDF Form for offline Tahsil submission.
              </p>
            </div>
            <div>
              <Link
                to="/browse-schemes"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#234731] hover:bg-[#193524] text-white font-bold text-xs shadow-2xs transition"
              >
                <span>Explore The 3 Doors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: DigiLocker Document Vault */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
                Aadhaar &amp; DigiLocker Sync
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                DIGILOCKER DOCUMENT VAULT
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Sync Aadhaar, Ration Cards, Caste Certificates, and Land Records directly into your personal encrypted vault. Automatic health checks tell you if a document is expired before you apply.
              </p>
            </div>
            <div>
              <Link
                to={isAuthenticated ? "/dashboard/documents" : "/login"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition"
              >
                <span>Open Document Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. GIANT CIVIC STATS (Unstop "32 Million+ Profiles")      */}
      {/* ======================================================== */}
      <section className="text-center py-8 space-y-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10">
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Citizen Reach &amp; Inclusion
          </span>
          <div className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight">
            1.4 Billion+
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Citizens covered across all 28 States &amp; 8 Union Territories
          </p>
        </div>

        {/* 5 Stats Row matching Unstop */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-slate-100">
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-slate-900">₹2.5L Cr+</div>
            <div className="text-[11px] font-semibold text-slate-500">Unclaimed Welfare Pool</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-slate-900">350+</div>
            <div className="text-[11px] font-semibold text-slate-500">Verified Schemes</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
            <div className="text-[11px] font-semibold text-slate-500">Deterministic Engine</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-slate-900">28+</div>
            <div className="text-[11px] font-semibold text-slate-500">States &amp; UTs</div>
          </div>
          <div className="space-y-0.5 col-span-2 sm:col-span-1">
            <div className="text-xl sm:text-2xl font-black text-slate-900">22</div>
            <div className="text-[11px] font-semibold text-slate-500">Indian Languages</div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FREQUENTLY ASKED QUESTIONS (Accordion)                */}
      {/* ======================================================== */}
      <section id="faq" className="space-y-4">
        <div className="flex items-center gap-2 pb-1">
          <div className="w-1.5 h-6 bg-[#234731] rounded-full" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#152b1e] transition"
              >
                <span>{faq.q}</span>
                {openFaqIdx === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#234731] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaqIdx === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

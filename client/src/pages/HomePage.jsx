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
  Fingerprint
} from "lucide-react";
import { getSchemes } from "../services/schemeApi";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import FeaturedCivicCarousel from "../components/common/FeaturedCivicCarousel";
import {
  EducationServiceIcon,
  AgricultureServiceIcon,
  EmploymentServiceIcon,
  HousingServiceIcon,
  HealthServiceIcon,
  BusinessServiceIcon
} from "../components/common/CivicServiceIcons";
import CivicInfiniteMarquee from "../components/common/CivicInfiniteMarquee";

const SECTOR_TABS = [
  { id: "ALL", label: "All Sectors", hindi: "सभी योजनाएं", icon: Layers },
  { id: "STUDENT", label: "Students", hindi: "छात्रवृत्ति", icon: GraduationCap },
  { id: "KISAN", label: "Kisan", hindi: "किसान कल्याण", icon: Tractor },
  { id: "EMPLOYMENT", label: "Employment", hindi: "रोजगार व कौशल", icon: Briefcase },
  { id: "BUSINESS", label: "Business", hindi: "उद्यम व MSME", icon: Building2 },
  { id: "GENERAL", label: "General & Social", hindi: "सामाजिक सुरक्षा", icon: UserCheck },
];

const FALLBACK_FEATURED_SCHEMES = [
  {
    _id: "demo-nsp",
    name: "National Scholarship Scheme (Central Sector)",
    category: "STUDENT",
    state: "All-India",
    sourceName: "Ministry of Education (DoSEL)",
    shortDescription: "Direct financial support for meritorious college & university students belonging to low and middle-income families.",
    benefitSummary: "₹12,000 to ₹20,000/year direct DBT credit to student's verified bank account.",
    applicationMethod: "ONLINE",
    requiredDocuments: ["Class 12 Marksheet", "Income Certificate", "Aadhaar Card", "Bank Passbook"],
    officialApplicationUrl: "https://scholarships.gov.in"
  },
  {
    _id: "demo-pmkisan",
    name: "PM-KISAN Samman Nidhi",
    category: "KISAN",
    state: "All-India",
    sourceName: "Ministry of Agriculture & Farmers Welfare",
    shortDescription: "Income support supplement for landholding farmer families across India for agricultural and domestic needs.",
    benefitSummary: "₹6,000 annually credited in 3 equal installments of ₹2,000 via PFMS.",
    applicationMethod: "ONLINE",
    requiredDocuments: ["Land Record (Khasra/Khatauni)", "Aadhaar Linked Bank Account"],
    officialApplicationUrl: "https://pmkisan.gov.in"
  },
  {
    _id: "demo-pmegp",
    name: "Prime Minister Employment Generation Programme (PMEGP)",
    category: "BUSINESS",
    state: "All-India",
    sourceName: "Ministry of MSME / KVIC",
    shortDescription: "Credit-linked subsidy programme to generate self-employment ventures in manufacturing and service micro-enterprises.",
    benefitSummary: "15% to 35% government capital subsidy on bank project loans up to ₹50 Lakhs.",
    applicationMethod: "ONLINE",
    requiredDocuments: ["Project Report", "Class 8/10 Certificate", "Special Category Certificate", "Aadhaar"],
    officialApplicationUrl: "https://www.kviconline.gov.in/pmegpeportal/"
  },
  {
    _id: "demo-pmkvy",
    name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
    category: "EMPLOYMENT",
    state: "All-India",
    sourceName: "Ministry of Skill Development & Entrepreneurship",
    shortDescription: "Industry-relevant technical skill certification, training stipend, and authorized placement support for Indian youth.",
    benefitSummary: "100% free skill training + stipend allowance + NSQF-certified Govt credential.",
    applicationMethod: "HYBRID",
    requiredDocuments: ["Aadhaar Card", "Academic Certificate", "Bank Details"],
    officialApplicationUrl: "https://www.pmkvyofficial.org"
  },
  {
    _id: "demo-abpmjay",
    name: "Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)",
    category: "GENERAL",
    state: "All-India",
    sourceName: "National Health Authority (NHA)",
    shortDescription: "Secondary and tertiary hospitalization coverage protecting vulnerable families against catastrophic healthcare expenses.",
    benefitSummary: "₹5,00,000 per family per year cashless treatment across 27,000+ empaneled hospitals.",
    applicationMethod: "ONLINE",
    requiredDocuments: ["Aadhaar Card", "Ration Card / PMJAY Letter"],
    officialApplicationUrl: "https://pmjay.gov.in"
  },
  {
    _id: "demo-mmvy",
    name: "Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)",
    category: "STUDENT",
    state: "Madhya Pradesh",
    sourceName: "Dept of Higher Education, Govt of MP",
    shortDescription: "State tuition reimbursement for students scoring 70%+ (MP Board) or 85%+ (CBSE) entering higher professional courses.",
    benefitSummary: "100% tuition fee reimbursement for engineering, medical, law, and degree colleges.",
    applicationMethod: "ONLINE",
    requiredDocuments: ["12th Marksheet", "Domicile Certificate", "Income Certificate (< ₹6 LPA)", "College Admission Letter"],
    officialApplicationUrl: "http://scholarshipportal.mp.nic.in"
  }
];

const getCategoryStyles = (category) => {
  switch (category) {
    case "STUDENT":
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        label: "Students & Education",
        hindi: "शिक्षा"
      };
    case "KISAN":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Kisan & Agriculture",
        hindi: "कृषि"
      };
    case "EMPLOYMENT":
      return {
        badge: "bg-purple-50 text-[#591d8f] border-purple-200",
        label: "Employment & Skills",
        hindi: "रोजगार"
      };
    case "BUSINESS":
      return {
        badge: "bg-orange-50 text-[#ea580c] border-orange-200",
        label: "Business & MSME",
        hindi: "व्यापार"
      };
    case "GENERAL":
    default:
      return {
        badge: "bg-amber-50 text-amber-800 border-amber-200",
        label: "General Welfare",
        hindi: "कल्याण"
      };
  }
};

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [schemeSearch, setSchemeSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");

  // Handle smooth scroll when navigating to hash anchors (e.g. /#how-it-works)
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

  // Load verified schemes preview from backend
  useEffect(() => {
    const fetchTopSchemes = async () => {
      try {
        const res = await getSchemes();
        if (res?.data?.schemes && res.data.schemes.length > 0) {
          setFeaturedSchemes(res.data.schemes);
        }
      } catch (err) {
        console.warn("Could not load featured schemes:", err.message);
      } finally {
        setLoadingSchemes(false);
      }
    };
    fetchTopSchemes();
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  // 6 Quick Service Categories (Sections 13 & 14) with dynamic translation
  const quickServices = [
    {
      title: t("sectorStudent", "Education & Scholarships"),
      hindiTitle: "शिक्षा एवं छात्रवृत्ति",
      desc: "Pre-matric, post-matric, higher education tuition waivers, and merit scholarships.",
      icon: EducationServiceIcon,
      category: "STUDENT",
      color: "bg-blue-50/80 text-blue-700 border-blue-200",
      accent: "text-blue-800",
      count: "28+ Schemes",
      subtags: ["Pre-Matric", "Post-Matric", "Tuition Waiver", "Merit"]
    },
    {
      title: t("sectorKisan", "Agriculture & Farmers"),
      hindiTitle: "कृषि एवं किसान कल्याण",
      desc: "Crop insurance, equipment subsidies, soil health, and smallholder income support.",
      icon: AgricultureServiceIcon,
      category: "KISAN",
      color: "bg-emerald-50/80 text-emerald-700 border-emerald-200",
      accent: "text-emerald-800",
      count: "19+ Schemes",
      subtags: ["PM-KISAN", "Crop Insurance", "Equipment", "Irrigation"]
    },
    {
      title: t("sectorEmployment", "Employment & Skills"),
      hindiTitle: "रोजगार एवं कौशल विकास",
      desc: "Vocational skill development, livelihood apprenticeships, and wage guarantees.",
      icon: EmploymentServiceIcon,
      category: "EMPLOYMENT",
      color: "bg-purple-50/80 text-[#591d8f] border-purple-200",
      accent: "text-[#2b0f4c]",
      count: "16+ Schemes",
      subtags: ["Skill India", "Apprenticeships", "Self-Employment", "MGNREGA"]
    },
    {
      title: "Housing & Basic Services",
      hindiTitle: "आवास एवं नागरिक सेवाएं",
      desc: "Rural and urban housing assistance, sanitation amenities, and electrification.",
      icon: HousingServiceIcon,
      category: "GENERAL",
      color: "bg-amber-50/80 text-amber-700 border-amber-200",
      accent: "text-amber-800",
      count: "12+ Schemes",
      subtags: ["PMAY-G", "PMAY-U", "Sanitation", "Clean Energy"]
    },
    {
      title: t("sectorGeneral", "Health & Social Support"),
      hindiTitle: "स्वास्थ्य एवं सामाजिक सुरक्षा",
      desc: "Maternal nutrition, elderly pension, disability assistance, and health coverage.",
      icon: HealthServiceIcon,
      category: "GENERAL",
      color: "bg-rose-50/80 text-rose-700 border-rose-200",
      accent: "text-rose-800",
      count: "22+ Schemes",
      subtags: ["Ayushman Bharat", "Pensions", "Maternity", "Disability"]
    },
    {
      title: t("sectorBusiness", "Business & Self-Employment"),
      hindiTitle: "व्यापार एवं स्व-रोजगार",
      desc: "Collateral-free MSME credit, micro-enterprise loans, and artisan capital grants.",
      icon: BusinessServiceIcon,
      category: "BUSINESS",
      color: "bg-orange-50/80 text-[#ea580c] border-orange-200",
      accent: "text-orange-800",
      count: "15+ Schemes",
      subtags: ["PMEGP", "Mudra Loans", "Stand-Up India", "Artisan Credit"]
    },
  ];

  // Dynamic Sector Tabs with translations
  const sectorTabs = [
    { id: "ALL", label: t("sectorAll", "All Schemes"), hindi: "सभी", icon: Layers },
    { id: "STUDENT", label: t("sectorStudent", "Scholarships"), hindi: "छात्रवृत्ति", icon: GraduationCap },
    { id: "KISAN", label: t("sectorKisan", "Kisan Welfare"), hindi: "किसान", icon: Tractor },
    { id: "EMPLOYMENT", label: t("sectorEmployment", "Employment & Skills"), hindi: "रोजगार", icon: Briefcase },
    { id: "BUSINESS", label: t("sectorBusiness", "Enterprise & MSME"), hindi: "उद्यम", icon: Building2 },
    { id: "GENERAL", label: t("sectorGeneral", "Social Security"), hindi: "सुरक्षा", icon: UserCheck },
  ];

  // Data source: backend schemes if loaded, otherwise rich fallback catalog
  const schemesSource = featuredSchemes.length > 0 ? featuredSchemes : FALLBACK_FEATURED_SCHEMES;

  // Filter schemes for the discovery section
  const filteredPreviewSchemes = schemesSource.filter((s) => {
    const matchesSector = selectedSector === "ALL" || s.category === selectedSector;
    const q = schemeSearch.trim().toLowerCase();
    const matchesSearch = !q || 
      (s.name || "").toLowerCase().includes(q) ||
      (s.shortDescription || "").toLowerCase().includes(q) ||
      (s.sourceName || "").toLowerCase().includes(q) ||
      (s.benefitSummary || "").toLowerCase().includes(q) ||
      (s.state || "").toLowerCase().includes(q);
    return matchesSector && matchesSearch;
  });

  // FAQs reflecting actual product reality (Section 27)
  const faqs = [
    {
      q: "What is HAQ DWAAR AI?",
      a: "HAQ DWAAR AI is an independent citizen assistance platform designed to reduce the confusion between discovering a government scheme and being fully prepared to apply for it. We help citizens find relevant benefits, organize documents, check readiness, and access authorized government portals.",
    },
    {
      q: "Can I browse schemes without an account?",
      a: "Yes. All verified schemes in our public catalog can be searched, filtered, and inspected without creating an account. Eligibility rules, mandatory certificate lists, and direct official portal links remain freely accessible to every citizen.",
    },
    {
      q: "How does scheme matching work?",
      a: "When you build your private Benefit Passport, our deterministic rules engine evaluates your demographic, income, and educational details against verified scheme rules using mathematical operators. We never use generative AI to guess your legal eligibility.",
    },
    {
      q: "Does HAQ DWAAR determine government eligibility?",
      a: "No. The platform provides profile-based informational matching against verified scheme rules. Final eligibility and benefit disbursement decisions are determined solely by the competent government authority through official procedures.",
    },
    {
      q: "Can I upload documents?",
      a: "Yes. You can securely store certificates in your Personal Document Vault using manual file uploads (PDF, JPG, PNG) or through our simulated DigiLocker Demo flow.",
    },
    {
      q: "What is DigiLocker Demo?",
      a: "DigiLocker is an optional document source. The platform currently includes a DigiLocker integration running in Demo Mode with synthetic test documents for demonstration purposes.",
    },
    {
      q: "Does HAQ DWAAR submit applications?",
      a: "No. HAQ DWAAR AI does not submit applications on your behalf. The platform helps you prepare your paperwork and verify readiness so that you can apply directly on the official authorized government portal.",
    },
    {
      q: "Where do I apply?",
      a: "You apply directly on the official government application portal. Every verified scheme on HAQ DWAAR AI includes direct gateways to the relevant central or state government website.",
    },
  ];

  return (
    <div className="bg-[#f7f5fa] text-[#0f172a] flex flex-col font-sans selection:bg-[#2b0f4c] selection:text-white pb-12">

      {/* ======================================================== */}
      {/* 0. LIVE ANNOUNCEMENT TICKER RIBBON                       */}
      {/* ======================================================== */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4">
        <div className="bg-white rounded-2xl px-4 py-2.5 border border-[#e9e1f5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#ea580c] text-white shrink-0">
              <Bell className="w-3 h-3 mr-1" />
              {t("liveUpdate", "Live Update")}
            </span>
            <p className="text-[#0f172a] font-bold truncate">
              {t("tickerNotice", "Central & State welfare notification catalog updated for FY 2025-26. Verify document readiness before applying.")}
            </p>
          </div>
          <Link
            to="/browse-schemes"
            className="text-[11px] font-black text-[#591d8f] hover:text-[#2b0f4c] shrink-0 inline-flex items-center self-end sm:self-auto"
          >
            <span>{t("exploreAllSchemes", "Explore All Schemes")}</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. HERO: FEATURED CIVIC BANNER CAROUSEL (Sections 3-9)   */}
      {/* ======================================================== */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 pb-4">
        <FeaturedCivicCarousel isAuthenticated={isAuthenticated} />
      </div>

      {/* ======================================================== */}
      {/* 1.5. CIVIC ECOSYSTEM: DPI RAILS & UNION MINISTRIES       */}
      {/* ======================================================== */}
      <CivicInfiniteMarquee />

      {/* ======================================================== */}
      {/* 2. QUICK SERVICE CARDS (Sections 13 & 14)                */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#e2e8f0]">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#ea580c] block">
              {t("directServiceAccess", "Direct Service Access")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              {t("exploreServices", "Explore Services")}
            </h2>
            <p className="text-sm text-[#475569] font-medium mt-0.5">
              {t("exploreServicesSub", "Discover welfare schemes and government assistance organized by citizen domains.")}
            </p>
          </div>
          <Link
            to="/browse-schemes"
            className="text-xs sm:text-sm font-black text-[#591d8f] hover:text-[#2b0f4c] transition flex items-center shrink-0 self-start sm:self-auto"
          >
            <span>{t("allSectors", "All Sectors")}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {quickServices.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <Link
                key={idx}
                to={`/browse-schemes?category=${svc.category}`}
                className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#e2e8f0] shadow-xs hover:shadow-md hover:border-[#2b0f4c]/30 transition-all transform hover:-translate-y-0.5 flex flex-col justify-between space-y-2.5 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs group-hover:scale-105 transition-transform p-1.5 ${svc.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-[#2b0f4c] border border-purple-200">
                        {svc.count}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#0f172a] group-hover:text-[#2b0f4c] transition-colors tracking-tight leading-snug">
                      {svc.title}
                    </h3>
                    <div className="text-[11px] text-[#64748b] font-semibold mt-0.5 truncate">
                      {svc.hindiTitle}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#475569] leading-snug line-clamp-2 font-normal">
                    {svc.desc}
                  </p>

                  {/* Compact Sub-tags: 2 primary tags + count badge to keep card compact */}
                  <div className="flex items-center gap-1 pt-0.5">
                    {svc.subtags?.slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] truncate max-w-[85px]"
                      >
                        {tag}
                      </span>
                    ))}
                    {svc.subtags?.length > 2 && (
                      <span className="text-[9px] font-semibold px-1 py-0.5 rounded bg-slate-100 text-slate-500">
                        +{svc.subtags.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] font-bold text-[#ea580c] group-hover:text-[#c2410c]">
                  <span>Explore Schemes</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. "WHAT'S NEW" CIVIC ANNOUNCEMENTS (Sections 15 & 16)   */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e9e1f5] shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#e9e1f5]">
            <Bell className="w-5 h-5 text-[#ea580c]" />
            <h2 className="text-xl font-black text-[#0f172a] tracking-tight">
              What's New <span className="text-sm font-bold text-[#64748b]">/ महत्वपूर्ण सूचनाएं</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: Rich Featured Civic Announcement Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#04241d] via-[#083d34] to-[#065f46] text-white p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-5 border border-white/10 shadow-lg relative overflow-hidden">
              
              {/* Ambient radial glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ea580c]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Eyebrow & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#fb923c] bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-flex items-center gap-1.5 backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
                    <span>FEATURED ANNOUNCEMENT / विशेष सूचना</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/35">
                    Live
                  </span>
                </div>

                {/* Main Headline */}
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-snug drop-shadow-sm">
                  Explore 150+ Verified Central &amp; State Welfare Schemes Publicly
                </h3>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                  Zero login or payment required to inspect authentic ministry gazettes, eligibility cutoffs, mandatory certificate lists, and official application portals.
                </p>

                {/* 3 Interactive Civic Pillars / Checklist */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/25 border border-white/10 backdrop-blur-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Direct Gazette Verification</h4>
                      <p className="text-[11px] text-slate-200 leading-tight">Curated straight from ministry notifications without third-party rumors.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/25 border border-white/10 backdrop-blur-xs">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                      <FileCheck2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Mandatory Certificate Checklist</h4>
                      <p className="text-[11px] text-slate-200 leading-tight">Know your domicile, caste, and income requirements before applying.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/25 border border-white/10 backdrop-blur-xs">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Direct .gov.in Official Handoff</h4>
                      <p className="text-[11px] text-slate-200 leading-tight">Apply on authorized government portals with zero middleman commission.</p>
                    </div>
                  </div>
                </div>

                {/* Live Stats Ribbon */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                    <div className="text-base font-black text-white">150+</div>
                    <div className="text-[10px] font-bold text-purple-200 uppercase">Schemes</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                    <div className="text-base font-black text-emerald-300">100%</div>
                    <div className="text-[10px] font-bold text-emerald-200 uppercase">Free Access</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                    <div className="text-base font-black text-[#fb923c]">₹0</div>
                    <div className="text-[10px] font-bold text-amber-200 uppercase">Middleman Fee</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 relative z-10 border-t border-white/10">
                <Link
                  to="/browse-schemes"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-xs font-black shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <span>Explore Schemes Now</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>

                <Link
                  to={isAuthenticated ? "/dashboard/documents" : "/register"}
                  className="inline-flex items-center px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/25 transition backdrop-blur-xs"
                >
                  <span>Check Document Vault</span>
                </Link>
              </div>

            </div>

            {/* Right: 4 Project-Themed Announcement Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              {[
                {
                  badge: "DOCUMENT VAULT",
                  title: "Personal Document Vault for Application Readiness",
                  desc: "Organize mandatory certificates in advance and check document readability before official submission.",
                  tag: "Platform Feature",
                  icon: FileCheck2,
                  borderColor: "border-l-4 border-l-[#591d8f] border-[#e2e8f0]",
                  badgeColor: "bg-purple-100 text-[#2b0f4c] border-purple-200",
                  iconBg: "bg-purple-50 text-[#591d8f] border-purple-200",
                  link: isAuthenticated ? "/dashboard/documents" : "/register"
                },
                {
                  badge: "VERIFIED CIRCULARS",
                  title: "Central & State Welfare Scheme Catalog",
                  desc: "All scheme records curated directly from authentic published government gazettes and ministry circulars.",
                  tag: "Curated Catalog",
                  icon: ShieldCheck,
                  borderColor: "border-l-4 border-l-[#ea580c] border-[#e2e8f0]",
                  badgeColor: "bg-orange-100 text-[#c2410c] border-orange-200",
                  iconBg: "bg-orange-50 text-[#ea580c] border-orange-200",
                  link: "/browse-schemes"
                },
                {
                  badge: "TRANSPARENCY",
                  title: "Deterministic Rule Matching with 'Why This Match?'",
                  desc: "Inspect transparent breakdowns of passed, missing, and failed criteria conditions with zero AI guesswork.",
                  tag: "Rules Engine",
                  icon: BrainCircuit,
                  borderColor: "border-l-4 border-l-[#059669] border-[#e2e8f0]",
                  badgeColor: "bg-emerald-100 text-[#047857] border-emerald-200",
                  iconBg: "bg-emerald-50 text-[#059669] border-emerald-200",
                  link: "#how-it-works"
                },
                {
                  badge: "DEMO MODE",
                  title: "Simulated DigiLocker Certificate Import",
                  desc: "Test document fetching via DigiLocker Demo Mode or upload scanned certificates directly into your vault.",
                  tag: "Demo Integration",
                  icon: Layers,
                  borderColor: "border-l-4 border-l-[#2563eb] border-[#e2e8f0]",
                  badgeColor: "bg-blue-100 text-[#1d4ed8] border-blue-200",
                  iconBg: "bg-blue-50 text-[#2563eb] border-blue-200",
                  link: isAuthenticated ? "/dashboard/documents" : "/register"
                },
              ].map((ann, i) => {
                const AnnIcon = ann.icon;
                return (
                  <Link
                    key={i}
                    to={ann.link}
                    className={`p-4 sm:p-4.5 rounded-2xl bg-white ${ann.borderColor} shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 flex items-start gap-3.5 group`}
                  >
                    {/* Feature Icon Box */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 group-hover:scale-105 transition-transform ${ann.iconBg}`}>
                      <AnnIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${ann.badgeColor}`}>
                          {ann.badge}
                        </span>
                        <span className="text-xs font-semibold text-[#64748b] bg-[#f8fafc] px-2.5 py-0.5 rounded-md border border-[#e2e8f0]">
                          {ann.tag}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-[#0f172a] group-hover:text-[#2b0f4c] transition-colors leading-snug pt-0.5">
                        {ann.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                        {ann.desc}
                      </p>
                    </div>

                    {/* Action Arrow */}
                    <div className="self-center shrink-0 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity pl-1">
                      <ArrowRight className="w-4 h-4 text-[#ea580c] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SCHEME DISCOVERY SECTION (Sections 17 & 18)           */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-4 border-b border-[#e9e1f5]">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#ea580c] bg-orange-50 px-3 py-1 rounded-full border border-orange-200/80 inline-flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>{t("officialCatalog", "OFFICIAL SCHEME CATALOG")}</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1 shadow-2xs">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {t("gazetteVerified", "Gazette Verified Circulars")}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
              {t("officialCatalog", "Explore Government Schemes")}
            </h2>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
              {t("featuredNoticeDesc", "Browse authentic scheme eligibility cutoffs, direct DBT assistance values, mandatory certificate checklists, and official ministry portals.")}
            </p>
          </div>

          <Link
            to="/browse-schemes"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2b0f4c] hover:bg-[#3d156b] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all group shrink-0"
          >
            <span>{t("exploreAllSchemes", "View All Schemes")}</span>
            <ArrowRight className="w-4 h-4 text-[#fb923c] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Civic Search & Sector Toolbar */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#e9e1f5] shadow-xs space-y-5">
          
          {/* Search bar with clear button & live badge */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#591d8f]" />
            </div>
            <input
              type="text"
              value={schemeSearch}
              onChange={(e) => setSchemeSearch(e.target.value)}
              placeholder="Search by scheme name, ministry, keyword, or state (e.g. NSP, PM-KISAN, Scholarship, MP)..."
              aria-label="Quick search verified schemes"
              className="w-full pl-11 pr-24 py-3 text-xs sm:text-sm rounded-2xl border border-[#e2e8f0] bg-[#fbf9fe] focus:bg-white text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#591d8f]/30 focus:border-[#591d8f] transition-all shadow-inner"
            />
            {schemeSearch ? (
              <button
                type="button"
                onClick={() => setSchemeSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-[#64748b] hover:text-[#0f172a] transition cursor-pointer"
              >
                <span className="px-2.5 py-1 rounded-lg bg-[#f1f5f9] text-[11px] font-bold flex items-center gap-1 hover:bg-[#e2e8f0]">
                  <X className="w-3.5 h-3.5" /> Clear
                </span>
              </button>
            ) : (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-[11px] font-semibold text-[#94a3b8] bg-white px-2 py-0.5 rounded-md border border-[#e2e8f0] hidden sm:block">
                  Live Search
                </span>
              </div>
            )}
          </div>

          {/* Sector Selector Header & Pills */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#334155] font-black uppercase tracking-wider text-[11px]">
                <Filter className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Sector / श्रेणी चुनें:</span>
              </div>
              {(selectedSector !== "ALL" || schemeSearch) && (
                <button
                  type="button"
                  onClick={() => { setSelectedSector("ALL"); setSchemeSearch(""); }}
                  className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Sector Tabs with Bespoke Icons & Hindi subtitles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {sectorTabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedSector === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedSector(tab.id)}
                    className={`flex items-center justify-between sm:justify-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#2b0f4c] text-white border-[#2b0f4c] shadow-sm ring-2 ring-[#2b0f4c]/20"
                        : "bg-[#fbf9fe] text-[#475569] border-[#e9e1f5] hover:border-[#2b0f4c]/30 hover:bg-white hover:text-[#0f172a]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#fb923c]" : "text-[#64748b]"}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary Counter */}
          <div className="pt-2 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748b] font-medium">
            <p className="flex flex-wrap items-center gap-1.5">
              <span>Showing</span>
              <strong className="text-[#0f172a] font-black">{Math.min(filteredPreviewSchemes.length, 6)}</strong>
              <span>of</span>
              <strong className="text-[#0f172a] font-black">{filteredPreviewSchemes.length}</strong>
              <span>schemes</span>
              {selectedSector !== "ALL" && (
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#2b0f4c] border border-purple-200 font-bold text-[11px]">
                  {sectorTabs.find(t => t.id === selectedSector)?.label}
                </span>
              )}
              {schemeSearch && (
                <span className="px-2 py-0.5 rounded-md bg-orange-50 text-[#ea580c] border border-orange-200 font-bold text-[11px]">
                  "{schemeSearch}"
                </span>
              )}
            </p>

            <Link
              to="/browse-schemes"
              className="text-[#591d8f] hover:text-[#2b0f4c] font-black text-xs inline-flex items-center gap-1 transition"
            >
              <span>View All Verified Schemes ({schemesSource.length}+)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Schemes Grid */}
        {loadingSchemes ? (
          <div className="bg-white rounded-3xl border border-[#e9e1f5] p-12 text-center text-xs font-bold text-[#64748b]">
            Loading verified schemes...
          </div>
        ) : filteredPreviewSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPreviewSchemes.slice(0, 6).map((scheme) => {
              const catStyle = getCategoryStyles(scheme.category);
              return (
                <div
                  key={scheme._id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e9e1f5] shadow-xs hover:shadow-lg hover:border-[#591d8f]/30 transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3.5">
                    {/* Category & Verified Header */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wide ${catStyle.badge}`}>
                        {catStyle.label}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" /> ✓ VERIFIED
                      </span>
                    </div>

                    {/* Scheme Name & Ministry */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#0f172a] leading-snug group-hover:text-[#2b0f4c] transition-colors line-clamp-2">
                        {scheme.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#64748b] mt-1 flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                        <span className="truncate">{scheme.sourceName || `${scheme.state || "Central"} Ministry`}</span>
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2 font-normal">
                      {scheme.shortDescription}
                    </p>

                    {/* Benefit Callout Highlight Box */}
                    <div className="p-3.5 bg-gradient-to-r from-[#fbf9fe] via-[#f7f2fc] to-[#fbf9fe] rounded-2xl border border-[#e9e1f5] text-xs space-y-1 group-hover:border-[#591d8f]/30 transition-colors">
                      <span className="font-black text-[#ea580c] block text-[10px] uppercase tracking-wider">
                        ★ DIRECT BENEFIT / प्रत्यक्ष सहायता
                      </span>
                      <p className="text-[#0f172a] font-bold line-clamp-2 leading-relaxed text-xs">
                        {scheme.benefitSummary}
                      </p>
                    </div>

                    {/* Criteria & Documents Mini-Strip */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-bold text-[#4b5563]">
                      <span className="px-2.5 py-1 rounded-lg bg-[#f1f5f9] text-[#334155] border border-[#e2e8f0]">
                        {scheme.applicationMethod || "ONLINE"}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#2b0f4c] border border-purple-200 flex items-center gap-1">
                        <FileCheck2 className="w-3 h-3 text-[#591d8f]" />
                        {scheme.requiredDocuments?.length || 0} Certificates Required
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                        <Compass className="w-3 h-3 text-amber-700" />
                        {scheme.state || "All-India"}
                      </span>
                    </div>
                  </div>

                  {/* Card Action Bar */}
                  <div className="pt-3 border-t border-[#f1eaf8] flex items-center justify-between gap-2">
                    <Link
                      to={`/schemes/${scheme._id}`}
                      className="inline-flex items-center text-xs sm:text-sm font-black text-[#ea580c] hover:text-[#c2410c] transition"
                    >
                      <span>View Specifications →</span>
                    </Link>

                    {scheme.officialApplicationUrl && (
                      <a
                        href={scheme.officialApplicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#64748b] hover:text-[#0f172a] flex items-center px-2.5 py-1 rounded-lg border border-[#e9e1f5] hover:bg-[#fbf9fe] transition"
                        title="Opens official government portal"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3 ml-1 text-[#64748b]" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#e9e1f5] p-10 sm:p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ea580c] flex items-center justify-center mx-auto border border-orange-200">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#0f172a]">
              No schemes found matching this sector or search query
            </h3>
            <p className="text-xs sm:text-sm text-[#64748b] max-w-md mx-auto leading-relaxed">
              We couldn't find any verified government schemes under "{selectedSector !== "ALL" ? selectedSector : "All"}" with your current query. Try resetting filters.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => { setSelectedSector("ALL"); setSchemeSearch(""); }}
                className="px-5 py-2.5 rounded-xl bg-[#2b0f4c] text-white text-xs font-black hover:bg-[#1e0a3c] transition shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 5. HOW HAQ DWAAR HELPS: CIVIC TIMELINE (Sections 19 & 20)*/}
      {/* ======================================================== */}
      <section id="how-it-works" className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 scroll-mt-20">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e2e8f0] shadow-xs space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#04241d] via-[#083d34] to-[#065f46] text-white text-[11px] font-black uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t("processFlowEyebrow", "CITIZEN PROCESS FLOW")}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
              {t("processFlowTitle", "From Scheme Discovery to Application")}
            </h2>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
              {t("processFlowSub", "A structured, transparent 6-step civic path to eliminate paperwork confusion, verify documents, and apply on authentic government portals.")}
            </p>
          </div>

          {/* 3-Column x 2-Row Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                num: "01",
                title: t("step1Title", "Discover Verified Schemes"),
                hindi: t("step1Title", "योजना खोजें"),
                desc: t("step1Desc", "Search central and state welfare programs directly verified from official gazettes without any login or fee."),
                tag: "Open Catalog • Zero Login",
                icon: Search
              },
              {
                num: "02",
                title: t("step2Title", "Inspect Transparent Criteria"),
                hindi: t("step2Title", "पात्रता नियम समझें"),
                desc: t("step2Desc", "Examine clear cutoffs for income, domicile, category, and academic requirements computed using deterministic rules."),
                tag: "Mathematical Match Rules",
                icon: FileText
              },
              {
                num: "03",
                title: t("step3Title", "Prepare Document Vault"),
                hindi: t("step3Title", "दस्तावेज़ तैयार करें"),
                desc: t("step3Desc", "Collect and organize required certificates via DigiLocker fetch or secure manual upload in your personal vault."),
                tag: "DigiLocker & Personal Vault",
                icon: FileCheck2
              },
              {
                num: "04",
                title: t("step4Title", "Audit Readiness Score"),
                hindi: t("step4Title", "तत्परता स्कोर जांचें"),
                desc: t("step4Desc", "Scan for name spelling mismatches, certificate expiration dates, and Aadhaar linkage to eliminate form rejections."),
                tag: "Rejection Shield Active",
                icon: ShieldCheck
              },
              {
                num: "05",
                title: t("step5Title", "Apply on Official Gateways"),
                hindi: t("step5Title", "आधिकारिक पोर्टल पर आवेदन"),
                desc: t("step5Desc", "Proceed with pre-verified document checklists straight to authentic .gov.in and .nic.in portals with zero middleman fee."),
                tag: "Official .gov.in Portals Only",
                icon: ExternalLink
              },
              {
                num: "06",
                title: t("step6Title", "Record & Track Reference"),
                hindi: t("step6Title", "प्रगति व रसीद ट्रैक करें"),
                desc: t("step6Desc", "Log your application acknowledgment number, monitor verification timelines, and keep a digital audit trail."),
                tag: "Reference & Status Tracking",
                icon: CheckCircle2
              }
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-[#fbfdfc] border border-[#e2ece7] hover:border-[#083d34] hover:bg-white flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md transition-all duration-200 group"
                >
                  {/* Step Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#04241d] via-[#083d34] to-[#065f46] text-white flex items-center justify-center font-black text-xs shadow-xs">
                        {step.num}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] block">
                          Step {idx + 1} of 6
                        </span>
                        <span className="text-xs font-bold text-[#083d34]">
                          {step.hindi}
                        </span>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#083d34] border border-emerald-200/80 group-hover:bg-[#083d34] group-hover:text-white flex items-center justify-center transition-colors">
                      <StepIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Step Body */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-[#0f172a] group-hover:text-[#083d34] transition-colors leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  {/* Step Bottom Tag */}
                  <div className="pt-2 border-t border-[#e2ece7] flex items-center justify-between text-[11px] font-semibold text-[#64748b]">
                    <span className="text-[#065f46] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 font-bold">
                      {step.tag}
                    </span>
                    <span className="text-[#083d34] font-bold text-[10px] hidden sm:inline">
                      ✓ Verified Step
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. PERSONALIZED ASSISTANCE BANNER (Section 21)           */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
        <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#2b0f4c] text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#3d156b] shadow-2xl relative overflow-hidden">
          
          {/* Subtle ambient lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ea580c]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            
            {/* Left Column: Rich, High-Density Content (Eliminating Empty Space) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Eyebrow Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#fb923c] bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-flex items-center gap-1.5 backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
                  <span>CIVIC ENTITLEMENT PASSPORT / नागरिक हक़ पासपोर्ट</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 hidden sm:inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Anti-Extortion Guaranteed
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                  Turn Paperwork Confusion into Certainty with Your Benefit Passport.
                </h2>
                <p className="text-xs sm:text-sm text-purple-200/90 font-medium">
                  योजना खोज से स्वीकृत आवेदन तक — एक संपूर्ण, सुरक्षित एवं पारदर्शी नागरिक प्रोफाइल।
                </p>
              </div>

              {/* Comprehensive Description */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-xl">
                Stop re-entering personal data on 50 different portals or paying cyber-cafes ₹250–₹500 for basic form discovery. Your private Benefit Passport organizes your academic certificates, computes exact statutory eligibility, and audits application health before you apply.
              </p>

              {/* 3 High-Density Civic Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-[#fb923c] flex items-center justify-center">
                    <BrainCircuit className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Deterministic Rules</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">Boolean logic matched to official gazettes with zero AI hallucinations.</p>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">DigiLocker Vault</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">Syncs 10th/12th, Income &amp; Domicile documents in an encrypted vault.</p>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Rejection Shield</h4>
                  <p className="text-[11px] text-slate-300 leading-tight">Detects name spelling variances &amp; expiration dates pre-submission.</p>
                </div>
              </div>

              {/* 3 Live Metric Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-xl bg-black/30 border border-white/10 text-emerald-300 font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  ₹0 Middleman Fee
                </span>
                <span className="px-3 py-1 rounded-xl bg-black/30 border border-white/10 text-slate-200 font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  82%+ Application Readiness
                </span>
                <span className="px-3 py-1 rounded-xl bg-black/30 border border-white/10 text-purple-200 font-bold text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Direct .gov.in Submissions
                </span>
              </div>

              {/* Dual Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={isAuthenticated ? "/dashboard/benefit-passport" : "/register"}
                  className="inline-flex items-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-orange-500/20 transition-all group"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-amber-200 group-hover:rotate-12 transition-transform" />
                  <span>{isAuthenticated ? "Open My Benefit Passport" : "Create My Benefit Passport"}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/browse-schemes"
                  className="inline-flex items-center px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs sm:text-sm transition backdrop-blur-xs"
                >
                  <span>Browse Schemes First</span>
                  <span className="text-purple-300 text-xs font-normal ml-1.5">(150+ Verified)</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Upgraded Citizen Benefit Passport Smart Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-black/35 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden space-y-4 text-white">
                
                {/* Ambient lighting inside card */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#fb923c]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Card Top Strip: Smart Card Chip & Identification */}
                <div className="relative z-10 flex items-start justify-between gap-3 pb-3 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    {/* Simulated Biometric Chip Icon */}
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/30 to-amber-600/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
                      <Fingerprint className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                          CITIZEN BENEFIT PASSPORT
                        </span>
                        <span className="text-[9px] font-bold text-slate-300">
                          / नागरिक पासपोर्ट
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-white leading-tight">
                        Smart Eligibility Card
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        DPI-ID: #HQ-2026-8942-IN
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    88% READY
                  </span>
                </div>

                {/* Citizen Demo Profile Persona */}
                <div className="relative z-10 flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316] text-white flex items-center justify-center font-black text-xs shadow-xs">
                      AS
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs leading-tight">Ananya Sharma</p>
                      <p className="text-[11px] text-slate-300">OBC • Higher Education • MP</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
                    Active Citizen
                  </span>
                </div>

                {/* Readiness Score Progress Bar */}
                <div className="relative z-10 space-y-1.5 bg-black/25 p-3.5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-200">
                      Pre-Submission Readiness Score
                    </span>
                    <strong className="text-xs font-black text-emerald-300">
                      88 / 100
                    </strong>
                  </div>

                  {/* Gradient Progress Bar */}
                  <div className="w-full bg-black/50 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ea580c] via-amber-400 to-emerald-400 transition-all duration-700 shadow-xs"
                      style={{ width: "88%" }}
                    />
                  </div>

                  <p className="text-[10px] text-slate-300 font-medium">
                    ✓ Qualified for 7 Verified Schemes • 0 Missing Mandatory Certificates
                  </p>
                </div>

                {/* Structured Audit Verification Matrix */}
                <div className="relative z-10 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#fb923c] shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">Profile Demographics</p>
                        <p className="text-[10px] text-slate-300">Category, Domicile &amp; Income Validated</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
                      100% Valid ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">DigiLocker Document Vault</p>
                        <p className="text-[10px] text-slate-300">4 Certificates Verified &amp; Encrypted</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
                      Synced ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/10">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">Rejection Shield Pre-Audit</p>
                        <p className="text-[10px] text-slate-300">Spelling &amp; Expiry Checked</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
                      0 Errors ✓
                    </span>
                  </div>
                </div>

                {/* Bottom Trust & Security Strip */}
                <div className="relative z-10 pt-1 flex items-center justify-between text-[10px] font-semibold text-slate-300 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Lock className="w-3 h-3" />
                    <span>256-Bit Encrypted Vault</span>
                  </div>
                  <span className="text-slate-400">
                    Direct .gov.in Submission
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. AI MITRA / VOICE PREVIEW (Section 22)                  */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
        <div className="bg-gradient-to-br from-[#04241d] via-[#083d34] to-[#065f46] text-white rounded-3xl p-6 sm:p-8 lg:p-9 border border-emerald-600/40 shadow-xl relative overflow-hidden space-y-4">
          
          {/* Soft ambient emerald glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
            
            {/* Left Content Area */}
            <div className="md:col-span-8 space-y-3.5">
              
              {/* Header with Icon & Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-2xs">
                  <Mic className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 block">
                    {t("voiceAssistanceEyebrow", "BHASHINI VOICE & LIFE SITUATION / एआई मित्र")}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    {t("voiceAssistanceTitle", "Tell us what you need.")}
                  </h3>
                </div>
              </div>

              {/* Explanatory description (medium, easy to read) */}
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
                {t("voiceAssistanceSub", "Describe your real-life circumstances in your local dialect. AI Mitra understands Bundelkhandi, Bhojpuri, Marathi, Telugu, and everyday vernacular to instantly uncover matching welfare schemes without paperwork confusion.")}
              </p>

              {/* Dialect support chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-wider mr-1">Supported Dialects:</span>
                {["हिन्दी", "भोजपुरी", "बुंदेलखंडी", "मालवी", "मराठी", "বাংলা", "తెలుగు", "English"].map((lang, lIdx) => (
                  <span
                    key={lIdx}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-black/25 text-emerald-200 border border-emerald-500/30"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              {/* Interactive Sample Voice Query Card */}
              <div className="p-3 sm:p-3.5 bg-[#021c17]/80 rounded-2xl border border-emerald-500/30 flex flex-wrap items-center gap-3 text-xs shadow-inner">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <span className="text-[10px] text-emerald-300/80 font-bold block uppercase tracking-wider">Example Citizen Prompt:</span>
                  <span className="font-semibold text-white italic text-xs sm:text-sm">
                    "मैं 12वीं पास छात्र हूँ और मुझे कॉलेज फीस के लिए scholarship चाहिए"
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/40 shrink-0">
                  Bhashini NLU Ready
                </span>
              </div>
            </div>

            {/* Right Action Area */}
            <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center space-y-2.5">
              <Link
                to={isAuthenticated ? "/dashboard/life-situation" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer group text-center"
              >
                <Mic className="w-4 h-4 text-amber-200 group-hover:scale-110 transition-transform" />
                <span>{t("voiceBtn", "Talk to AI Mitra")}</span>
              </Link>
              
              <div className="flex flex-col items-start md:items-end text-[10px] text-emerald-200/80 font-medium space-y-0.5">
                <span>✓ Browser Microphone Voice Input</span>
                <span>✓ 100% Free Public Civic Tool</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. TRUST ARCHITECTURE SECTION (Section 23)               */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
        <div className="bg-gradient-to-br from-[#1e0a3c] via-[#240b49] to-[#2b0f4c] text-white rounded-3xl p-6 sm:p-10 border border-[#3d156b] shadow-xl space-y-8">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#fb923c] block">
              Core Civic Principle
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
              AI assists. Verified data and rules guide the result.
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-semibold">
              We separate conversational language understanding from statutory eligibility math.
            </p>
          </div>

          {/* Color-Coded Processing Pipeline (Section 23) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center text-xs">
            <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-amber-300 block uppercase">Step 1</span>
              <strong className="text-white text-xs font-black block">Citizen Situation</strong>
              <span className="text-[11px] text-amber-100 font-bold">Needs Stated</span>
            </div>

            <div className="p-3 bg-purple-500/20 border border-purple-400/40 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-purple-300 block uppercase">Step 2</span>
              <strong className="text-white text-xs font-black block">AI Assistance</strong>
              <span className="text-[11px] text-purple-100 font-bold">Language NLU</span>
            </div>

            <div className="p-3 bg-blue-500/20 border border-blue-400/40 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-blue-300 block uppercase">Step 3</span>
              <strong className="text-white text-xs font-black block">Verified Data</strong>
              <span className="text-[11px] text-blue-100 font-bold">Gazette Records</span>
            </div>

            <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-emerald-300 block uppercase">Step 4</span>
              <strong className="text-white text-xs font-black block">Deterministic Rules</strong>
              <span className="text-[11px] text-emerald-100 font-bold">Zero Guesswork</span>
            </div>

            <div className="p-3 bg-sky-500/20 border border-sky-400/40 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-sky-300 block uppercase">Step 5</span>
              <strong className="text-white text-xs font-black block">Document Health</strong>
              <span className="text-[11px] text-sky-100 font-bold">Vault Checked</span>
            </div>

            <div className="p-3 bg-orange-500/20 border border-orange-400/40 rounded-2xl space-y-1">
              <span className="text-[10px] font-black text-orange-300 block uppercase">Step 6</span>
              <strong className="text-white text-xs font-black block">Readiness</strong>
              <span className="text-[11px] text-orange-100 font-bold">Pre-Check Complete</span>
            </div>

            <div className="p-3 bg-indigo-500/30 border border-indigo-400/50 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-black text-indigo-300 block uppercase">Step 7</span>
              <strong className="text-white text-xs font-black block">Official Portal</strong>
              <span className="text-[11px] text-indigo-100 font-bold">Direct Gateway</span>
            </div>
          </div>

          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/20 text-xs text-slate-100 font-semibold text-center max-w-2xl mx-auto shadow-inner">
            Profile matching is informational and does not constitute government approval or final statutory eligibility determination.
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. TRUST / SAFETY CARDS (Section 24)                     */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1: Verified Scheme Information */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0f172a] group-hover:text-emerald-800 transition-colors leading-snug">
                {t("trustVerifiedTitle", "Verified Scheme Information")}
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                {t("trustVerifiedDesc", "Curated directly from published government gazettes, ministry circulars, and verified portals.")}
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#f1f5f9] flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Official Gazette Sources</span>
            </div>
          </div>

          {/* Card 2: Deterministic Profile Matching */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] hover:border-teal-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0f172a] group-hover:text-teal-800 transition-colors leading-snug">
                {t("trustDeterministicTitle", "Deterministic Profile Matching")}
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                {t("trustDeterministicDesc", "Scheme matching is based on structured scheme rules and the information provided by the citizen.")}
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#f1f5f9] flex items-center gap-1.5 text-[11px] font-bold text-teal-700">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span>Mathematical Match Rules</span>
            </div>
          </div>

          {/* Card 3: Secure Document Vault */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] hover:border-orange-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 border border-orange-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-5 h-5 text-[#ea580c]" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0f172a] group-hover:text-[#c2410c] transition-colors leading-snug">
                {t("trustVaultTitle", "Secure Document Vault")}
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                {t("trustVaultDesc", "Keep benefit-related documents organized and private. We never sell citizen data to commercial entities.")}
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#f1f5f9] flex items-center gap-1.5 text-[11px] font-bold text-[#ea580c]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
              <span>Zero Commercial Data Sale</span>
            </div>
          </div>

          {/* Card 4: Official Application Gateway */}
          <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] hover:border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ExternalLink className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#0f172a] group-hover:text-blue-800 transition-colors leading-snug">
                {t("trustGatewayTitle", "Official Application Gateway")}
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                {t("trustGatewayDesc", "Citizens are routed directly to authorized official portals to complete their government applications.")}
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#f1f5f9] flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Direct .gov.in Gateways</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. DOCUMENT PREPARATION & READINESS (Sections 25 & 26)  */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Document Preparation Feature (Section 25) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 group">
            <div className="space-y-3.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 inline-flex items-center gap-1.5 shadow-2xs">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>DOCUMENT READINESS VAULT / दस्तावेज़ तैयारी</span>
              </span>

              <h3 className="text-lg sm:text-xl font-black text-[#0f172a] tracking-tight leading-snug">
                {t("prepBeforeApply", "Prepare Before You Apply")}
              </h3>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                {t("prepBeforeApplySub", "Organize your essential certificates, eliminate preparation gaps, and audit document validity before visiting the official application portal.")}
              </p>

              <div className="p-3.5 sm:p-4 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] space-y-2.5 text-xs sm:text-sm font-medium text-[#0f172a]">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#334155] leading-snug">Personal certificate storage with secure manual file uploads</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#334155] leading-snug">Document health checks for name spelling, readability &amp; validity</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#334155] leading-snug">Checklist comparison against mandatory scheme gazette requirements</span>
                </div>
              </div>
            </div>

            <Link
              to={isAuthenticated ? "/dashboard/documents" : "/login"}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#04241d] via-[#083d34] to-[#065f46] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all group"
            >
              <span>{t("exploreVault", "Explore Document Vault")}</span>
              <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Application Readiness Banner (Section 26) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] hover:border-orange-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 group">
            <div className="space-y-3.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#ea580c] bg-orange-50 px-3 py-1 rounded-full border border-orange-200/80 inline-flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>PRE-APPLICATION READINESS / आवेदन तत्परता</span>
              </span>

              <h3 className="text-lg sm:text-xl font-black text-[#0f172a] tracking-tight leading-snug">
                {t("readyToApply", "Ready to Apply?")}
              </h3>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                {t("readyToApplySub", "Review your application preparation status across all 4 stages before visiting the government website:")}
              </p>

              {/* 4-Stage Readiness Workflow Progression */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col items-center justify-between space-y-1">
                  <span className="text-[10px] text-emerald-900 font-extrabold uppercase tracking-wider">Profile</span>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700">100% Set</span>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col items-center justify-between space-y-1">
                  <span className="text-[10px] text-emerald-900 font-extrabold uppercase tracking-wider">Documents</span>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700">Vault Synced</span>
                </div>

                <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 flex flex-col items-center justify-between space-y-1">
                  <span className="text-[10px] text-teal-900 font-extrabold uppercase tracking-wider">Readiness</span>
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <span className="text-[10px] font-black text-teal-700">Verified ✓</span>
                </div>

                <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 flex flex-col items-center justify-between space-y-1">
                  <span className="text-[10px] text-[#ea580c] font-extrabold uppercase tracking-wider">Official Portal</span>
                  <ExternalLink className="w-5 h-5 text-[#ea580c]" />
                  <span className="text-[10px] font-black text-[#ea580c]">Direct Gateway</span>
                </div>
              </div>
            </div>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#f8fafc] hover:bg-white text-[#0f172a] border border-[#e2e8f0] hover:border-[#ea580c]/50 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all group"
            >
              <span>{t("seeHowReadinessWorks", "See How Readiness Works")}</span>
              <ArrowRight className="w-4 h-4 text-[#ea580c] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. FAQ ACCORDION (Section 27)                            */}
      {/* ======================================================== */}
      <section id="faq" className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ea580c] block">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
              {t("faqTitle", "Frequently Asked Questions")}
            </h2>
            <p className="text-xs text-[#64748b]">
              {t("faqSub", "Transparent information regarding accounts, matching logic, vaults, and official portals.")}
            </p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#e9e1f5] overflow-hidden shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0f172a] hover:bg-[#fbf9fe] transition cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#ea580c] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#64748b] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-[#4b5563] leading-relaxed border-t border-[#e9e1f5] bg-[#fbf9fe]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 12. PUBLIC TRUST DISCLAIMER & FINAL CTA (Sec 28 & 34)    */}
      {/* ======================================================== */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 space-y-6">
        {/* Civic Notice Box */}
        <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 text-xs text-[#2b0f4c] space-y-1 text-center">
          <p className="leading-relaxed">
            <strong>Important:</strong> {t("disclaimer", "HAQ DWAAR AI is a citizen-assistance platform. Scheme information is provided for discovery and preparation. Final eligibility, approval and application decisions remain with the relevant authority. Applications are completed through official portals.")}
          </p>
        </div>

        {/* Final CTA Banner */}
        <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#2b0f4c] text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 border border-[#3d156b]">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#fb923c] block">
            Scheme se Application Tak
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Ready to understand your benefit journey?
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto leading-relaxed">
            Explore verified government schemes publicly or build your Benefit Passport for personalized guidance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/browse-schemes"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-[#2b0f4c] hover:bg-slate-100 font-black text-xs sm:text-sm shadow-md transition"
            >
              Browse Schemes
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard/benefit-passport" : "/register"}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm shadow-md transition"
            >
              {isAuthenticated ? "Open Benefit Passport" : "Create My Benefit Passport"}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

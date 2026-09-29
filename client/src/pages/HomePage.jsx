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
  ArrowDown,
  Check,
  Compass,
  FileSearch,
  BookOpen
} from "lucide-react";
import { getSchemes } from "../services/schemeApi";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

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

  // Load a small preview of verified schemes
  useEffect(() => {
    const fetchTopSchemes = async () => {
      try {
        const res = await getSchemes();
        if (res?.data?.schemes) {
          setFeaturedSchemes(res.data.schemes.slice(0, 4));
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

  const featureCards = [
    {
      icon: Lock,
      title: "Benefit Passport",
      description: "Create a structured profile containing relevant demographic, education, and economic information used for personalized matching.",
      tag: "Profile",
    },
    {
      icon: BrainCircuit,
      title: "Life Situation",
      description: "Describe a real-life need in natural language and receive structured assistance powered by safe NLU extraction.",
      tag: "Assistance",
    },
    {
      icon: Database,
      title: "Verified Scheme Data",
      description: "Scheme information is curated directly from published government gazettes, ministry circulars, and verified official portals.",
      tag: "Source Truth",
    },
    {
      icon: CheckCircle2,
      title: "Explainable Matching",
      description: "See matched, missing, and failed profile conditions with transparent scores instead of receiving only a generic recommendation.",
      tag: "Transparency",
    },
    {
      icon: Layers,
      title: "Personal Document Vault",
      description: "Keep benefit-related documents in one secure, private place and reuse them across different scheme requirements.",
      tag: "Vault",
    },
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Manually upload supported certificates and documents in PDF, JPG, and PNG formats directly into your vault.",
      tag: "Manual Source",
    },
    {
      icon: Sparkles,
      title: "DigiLocker (Demo Mode)",
      description: "Use DigiLocker as an additional document source where an authorized integration is available. (Currently operates in Demo Mode).",
      tag: "Simulated Source",
    },
    {
      icon: FileCheck2,
      title: "Document Health",
      description: "Identify missing information, expiry issues, or documents needing verification before you apply on the official portal.",
      tag: "Readiness",
    },
    {
      icon: ExternalLink,
      title: "Official Application",
      description: "When an official application URL exists in the verified scheme record, users can continue directly to the official government portal.",
      tag: "Direct Gateway",
    },
  ];

  const faqs = [
    {
      q: "Do I need an account to browse schemes?",
      a: "No. Public scheme discovery remains accessible to every citizen without creating an account. You can search, filter by sector and state, view criteria, and inspect required documents freely.",
    },
    {
      q: "Do I need an account to apply for a scheme?",
      a: "HAQ DWAAR AI does not require an account merely to open the official application portal. The actual application process is hosted and controlled by the official government portal.",
    },
    {
      q: "Does HAQ DWAAR AI decide whether I am legally eligible?",
      a: "No. The platform provides profile-based informational matching against its verified scheme rules. Final eligibility and benefit decisions are determined solely by the applicable government authority and official process.",
    },
    {
      q: "What is the Benefit Passport?",
      a: "A structured citizen profile containing demographic, educational, occupational, and income details. It is used to deterministically evaluate your profile across all published government schemes.",
    },
    {
      q: "What is the Document Vault?",
      a: "A personal area where users can securely store benefit-related documents and reuse them when checking scheme requirements across different opportunities.",
    },
    {
      q: "Can I upload documents manually?",
      a: "Yes. You can upload scanned certificates in PDF, JPG, or PNG formats at any time directly into your Personal Document Vault.",
    },
    {
      q: "What is DigiLocker used for?",
      a: "DigiLocker is an optional document source for importing certificates that are actually available through an authorized integration. If a document is unavailable in DigiLocker, you can simply upload it manually.",
    },
    {
      q: "Is the current DigiLocker integration live?",
      a: "The prototype currently operates in Demo Mode (DIGILOCKER_MODE=demo) using synthetic test documents unless legitimate authorized production credentials and integration are configured.",
    },
    {
      q: "Does HAQ DWAAR AI submit my government application?",
      a: "No. The platform guides the citizen through preparation and provides direct gateways toward the official government application process. We do not submit applications on your behalf.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* ======================================================== */}
      {/* 1. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1e0a3c] via-[#240b49] to-[#2a0e4f] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-purple-950">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-purple-300" />
            <span>हकद्वार • HAQ DWAAR AI • Scheme se Application Tak</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Your Transparent Gateway from{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-200 to-purple-200">
              Scheme to Application
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-purple-100 max-w-3xl mx-auto leading-relaxed font-semibold">
            Help citizens discover relevant government benefits, understand why they may match, prepare required documents, and reach the official application portal without confusion or predatory middlemen.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <Link
              to="/browse-schemes"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-extrabold text-sm bg-white text-[#240b49] hover:bg-slate-100 shadow-md transition transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4 mr-2 text-[#591d8f]" />
              Browse Schemes
              <span className="ml-2 text-[10px] font-bold text-[#591d8f] bg-purple-50 px-2 py-0.5 rounded-full">
                No Account Needed
              </span>
            </Link>

            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white shadow-md transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 mr-2 text-amber-200" />
              {isAuthenticated ? "My Dashboard" : "Get Personalized Help"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Trust Guarantees Strip */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-blue-300 font-bold text-xs sm:text-sm block">Deterministic Rules</span>
              <span className="text-[11px] text-slate-300">Mathematical profile evaluation, 0% AI guessing</span>
            </div>
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-emerald-300 font-bold text-xs sm:text-sm block">Personal Vault</span>
              <span className="text-[11px] text-slate-300">Manual file uploads + simulated DigiLocker demo</span>
            </div>
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-amber-300 font-bold text-xs sm:text-sm block">Direct Official Portals</span>
              <span className="text-[11px] text-slate-300">Verified links to authorized government portals</span>
            </div>
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-sky-300 font-bold text-xs sm:text-sm block">100% Free Civic Tool</span>
              <span className="text-[11px] text-slate-300">No agent fees, no commissions, privacy first</span>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. WHAT IS HAQ DWAAR AI? SECTION                         */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
            Project Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            What is HAQ DWAAR AI?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A citizen-side assistance platform designed to reduce the gap between discovering a government scheme and being prepared to apply for it.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            HAQ DWAAR AI brings together all the critical steps of the welfare discovery journey into one coherent, explainable system:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Scheme Discovery:</strong> Curated from verified official gazettes.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Benefit Passport:</strong> Reusable structured citizen profile.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Life-Situation Assistance:</strong> Natural-language inquiry parser.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Profile Matching:</strong> Deterministic evaluation against criteria.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Explainable Matching:</strong> Passed, failed, and missing breakdowns.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Personal Document Vault:</strong> Central storage for certificates.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Document Health Checks:</strong> Expiry and readability analysis.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>DigiLocker Optional Source:</strong> Integration demo simulation.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Readiness Preparation:</strong> Pre-application document checklists.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Official Application Links:</strong> Direct authorized government gateways.</span>
            </div>
          </div>

          {/* Civic Boundaries Banner */}
          <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
            <span className="font-bold flex items-center text-amber-900">
              <AlertCircle className="w-4 h-4 mr-1.5 text-amber-700 flex-shrink-0" />
              Important Civic Boundary
            </span>
            <p className="leading-relaxed">
              HAQ DWAAR AI is <strong>NOT</strong> an official government portal. It does <strong>NOT</strong> automatically approve eligibility, and it does <strong>NOT</strong> submit government applications. It prepares citizens with verified information so they can apply directly through authorized official channels.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. PROBLEM SECTION                                       */}
      {/* ======================================================== */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
              The Reality of Welfare Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The Citizen Journey Struggle
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Every day, citizens face an uphill battle when trying to access public welfare schemes. Here is what that journey typically looks like:
            </p>
          </div>

          {/* User Journey Step-by-Step Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2.5 text-center">
            {[
              { step: "1", title: "Has a Need", desc: "Citizen faces a financial, education, or farming challenge." },
              { step: "2", title: "Information Gap", desc: "Doesn't know which government scheme may help." },
              { step: "3", title: "Finds a Scheme", desc: "Discovers a scheme name through word of mouth or posters." },
              { step: "4", title: "Confusing Rules", desc: "Struggles to interpret complex eligibility guidelines." },
              { step: "5", title: "Paperwork Confusion", desc: "Doesn't know which certificates are ready in advance." },
              { step: "6", title: "Missing Documents", desc: "Discovers expired or missing papers at the last minute." },
              { step: "7", title: "Official Portal", desc: "Finally reaches the official portal, often after delays." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-between space-y-2">
                <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                  {item.step}
                </span>
                <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-blue-200 text-center text-xs sm:text-sm text-blue-950 font-medium leading-relaxed max-w-3xl mx-auto shadow-xs">
            <strong>HAQ DWAAR AI is designed to make this journey transparent and straightforward:</strong> by structuring criteria, organizing documents in a private vault, validating readiness in advance, and connecting citizens directly to official application portals.
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HOW IT WORKS SECTION (id="how-it-works")              */}
      {/* ======================================================== */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10 scroll-mt-20">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
            End-to-End Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Choose between instant anonymous browsing or comprehensive personalized assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Public Journey Flow */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Public Journey
              </span>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                No Account Needed
              </span>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore verified government schemes, review requirements, and access official application channels immediately.
            </p>

            <div className="space-y-2.5 text-xs text-slate-700 pt-2 font-medium">
              <div className="flex items-center space-x-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Browse Schemes (`/browse-schemes`)</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Open Scheme Details (`/schemes/:id`)</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Inspect Eligibility Criteria & Document Checklist</span>
              </div>
              <div className="flex items-center space-x-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[10px] flex items-center justify-center font-bold">4</span>
                <span>Click <strong>[ Apply on Official Portal ]</strong></span>
              </div>
            </div>

            <Link
              to="/browse-schemes"
              className="block text-center px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Browse Schemes Now →
            </Link>
          </div>

          {/* Personalized Journey Flow */}
          <div className="bg-white p-6 rounded-2xl border-2 border-blue-600 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Personalized Journey
              </span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                With Account
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Create a Benefit Passport, store certificates in your vault, and run deterministic matching with explainable results.
            </p>

            <div className="space-y-2 text-xs text-blue-950 pt-2 font-medium">
              <div className="flex items-center space-x-2 p-2 bg-blue-50/70 rounded-lg border border-blue-100">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Create Account & Benefit Passport</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50/70 rounded-lg border border-blue-100">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Store Documents in Vault (Upload or DigiLocker Demo)</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50/70 rounded-lg border border-blue-100">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Deterministic Profile Matching & "Why This Match?"</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50/70 rounded-lg border border-blue-100">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                <span>Document Health & Readiness Checklist</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-50/70 rounded-lg border border-blue-100">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">5</span>
                <span>Prepare & Apply on Authorized Portal</span>
              </div>
            </div>

            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="block text-center px-4 py-2.5 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition"
            >
              {isAuthenticated ? "Go to Dashboard →" : "Get Personalized Help →"}
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. FEATURES SECTION (id="features")                      */}
      {/* ======================================================== */}
      <section id="features" className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Features
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Built on verified government notifications, deterministic rule engines, encrypted vaults, and transparent explainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featureCards.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wide">
                        {f.tag}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {f.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. PUBLIC VS PERSONALIZED JOURNEY SECTION                */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
            Clear Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Publicly or Get Personalized Assistance
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            You are always in control of your journey. No account is ever forced just to view scheme information or official links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Column 1: Explore Without an Account */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-slate-700" />
              <span>Explore Without an Account</span>
            </h3>
            <p className="text-slate-500 text-xs">
              Direct access for quick lookups and unmediated discovery.
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Browse verified government schemes</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Search and filter by sector and state</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Open detailed scheme specification pages</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>View published criteria and required documents</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>View verified source authorities and circulars</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Continue directly to the official application portal</span>
              </li>
            </ul>
            <Link
              to="/browse-schemes"
              className="inline-flex items-center font-bold text-xs text-blue-700 hover:text-blue-900 pt-2"
            >
              Browse Schemes Anonymously →
            </Link>
          </div>

          {/* Column 2: Get Personalized Assistance */}
          <div className="bg-white p-6 rounded-2xl border border-blue-300 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-blue-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-700" />
              <span>Get Personalized Assistance</span>
            </h3>
            <p className="text-slate-500 text-xs">
              Complete readiness tools for citizens preparing applications.
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Register or log in securely</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Complete your private Benefit Passport</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Describe your life situation in natural language</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Receive deterministic profile-based match scores</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Understand "Why This Match?" (passed/failed/missing)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Upload documents or import available via DigiLocker</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Check document health (expiry & readability)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Review readiness checklist before applying</span>
              </li>
            </ul>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center font-bold text-xs text-blue-700 hover:text-blue-900 pt-2"
            >
              {isAuthenticated ? "Open My Dashboard →" : "Create Benefit Passport →"}
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. EXPLORE GOVERNMENT SCHEMES (PREVIEW)                  */}
      {/* ======================================================== */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
                Verified Welfare Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore Government Schemes
              </h2>
              <p className="text-xs text-slate-600">
                Verified against official central and state government notifications.
              </p>
            </div>
            <Link
              to="/browse-schemes"
              className="inline-flex items-center text-xs font-bold text-blue-700 hover:text-blue-900 self-start sm:self-auto"
            >
              View All Schemes →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredSchemes.map((scheme) => (
              <div
                key={scheme._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                      {scheme.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {scheme.state}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                    {scheme.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {scheme.shortDescription}
                  </p>

                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs">
                    <span className="font-bold text-blue-900 block text-[10px] uppercase tracking-wider mb-0.5">
                      Benefit Overview
                    </span>
                    <p className="text-blue-950 font-medium line-clamp-2 leading-relaxed">
                      {scheme.benefitSummary}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/schemes/${scheme._id}`}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center"
                  >
                    View Details & Criteria →
                  </Link>

                  {scheme.officialApplicationUrl && (
                    <a
                      href={scheme.officialApplicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      Portal Link <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/browse-schemes"
              className="inline-flex items-center px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition"
            >
              Browse Full Scheme Directory →
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. ABOUT THE PROJECT SECTION (id="about")                */}
      {/* ======================================================== */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8 scroll-mt-20">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
            Mission & Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            About HAQ DWAAR AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Scheme se Application Tak — bridging the gap between welfare policies and citizen realization.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>HAQ DWAAR AI</strong> is an open civic assistance platform designed to ensure that entitled citizens—meritorious students, smallholder farmers, women entrepreneurs, and low-income families—can seamlessly discover government benefits, understand why they qualify, organize required paperwork, and apply through verified official portals.
            </p>
            <p>
              At a high level, the platform integrates:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-xs text-slate-600">
              <li><strong>Structured Scheme Data:</strong> Rule schemas and document lists compiled from official government circulars.</li>
              <li><strong>Deterministic Rule-Based Matching:</strong> Mathematical logic evaluating profiles against criteria. No AI hallucinations.</li>
              <li><strong>AI-Assisted Natural-Language Understanding:</strong> Safe Gemini NLU parser mapping citizen natural language queries to structured filter tags.</li>
              <li><strong>Document Workflow & Health:</strong> Personal vault storage (manual upload + simulated DigiLocker demo) with automated OCR health checks.</li>
              <li><strong>Explainability:</strong> Transparent breakdowns of passed criteria, failed conditions, and missing fields.</li>
              <li><strong>Citizen-Controlled Actions:</strong> The citizen chooses when to browse publicly and when to build a private passport.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs space-y-1.5 leading-relaxed">
            <span className="font-bold text-blue-300 block">Civic Distinction: AI Assistance vs Government Authority</span>
            <p className="text-slate-300">
              HAQ DWAAR AI provides informational readiness assistance. It is not an official government agency and does not hold statutory authority to verify documents or make legal eligibility decisions. Final eligibility and benefit disbursement rest solely with the competent government departments.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FAQ SECTION (id="faq")                                */}
      {/* ======================================================== */}
      <section id="faq" className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Everything you need to know about navigating schemes, accounts, matching, vaults, and official portals.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-700 flex-shrink-0 ml-3" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-3" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. FINAL CALL TO ACTION                                 */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-blue-950">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block">
            Scheme se Application Tak
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Find your path from Scheme to Application.
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you want to explore verified government schemes publicly or prepare your paperwork with a personalized Benefit Passport, HAQ DWAAR AI is here to help.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/browse-schemes"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white text-blue-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow transition"
            >
              Browse Schemes
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow transition border border-blue-400/40"
            >
              {isAuthenticated ? "Open My Dashboard" : "Get Personalized Help"}
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. FOOTER                                               */}
      {/* ======================================================== */}
      <Footer />
    </div>
  );
}

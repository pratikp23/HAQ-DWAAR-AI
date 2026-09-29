import React from "react";
import {
  DigiLockerLogo,
  BhashiniLogo,
  DbtBharatLogo,
  IndiaStackLogo,
  UmangLogo,
  PfmsLogo,
  AshokaEmblemLogo
} from "./OfficialLogos";

/**
 * 12 Curated Civic & Institutional Gateways with Official Brand Logos
 * Perfectly alternating between Digital Public Infrastructure (DPI) & Union Ministries
 */
const CIVIC_ENTITIES = [
  {
    id: "digilocker",
    category: "DPI Rails",
    name: "DigiLocker",
    hindi: "डिजिलॉकर",
    subtitle: "Document Vault & Verification",
    authority: "MeitY · Digital India",
    LogoComponent: DigiLockerLogo,
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    pillBg: "bg-blue-50/80 border-blue-200/60"
  },
  {
    id: "agri-min",
    category: "Union Ministry",
    name: "Min. of Agriculture & Farmers Welfare",
    hindi: "कृषि एवं किसान कल्याण मंत्रालय",
    subtitle: "PM-KISAN, KCC & Crop Insurance",
    authority: "Govt of India",
    LogoComponent: AshokaEmblemLogo,
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    pillBg: "bg-amber-50/80 border-amber-200/60"
  },
  {
    id: "bhashini",
    category: "DPI Rails",
    name: "BHASHINI AI",
    hindi: "भाषिणी",
    subtitle: "National Language Voice & Translation",
    authority: "MeitY · AI Mission",
    LogoComponent: BhashiniLogo,
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    pillBg: "bg-emerald-50/80 border-emerald-200/60"
  },
  {
    id: "social-justice",
    category: "Union Ministry",
    name: "Min. of Social Justice & Empowerment",
    hindi: "सामाजिक न्याय एवं अधिकारिता",
    subtitle: "SC / OBC / DNT Fellowships",
    authority: "Govt of India",
    LogoComponent: AshokaEmblemLogo,
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    pillBg: "bg-slate-50/80 border-slate-200/60"
  },
  {
    id: "dbt-bharat",
    category: "DPI Rails",
    name: "DBT Bharat",
    hindi: "डीबीटी भारत",
    subtitle: "Direct Benefit Transfer & Aadhaar Bridge",
    authority: "Cabinet Secretariat",
    LogoComponent: DbtBharatLogo,
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    pillBg: "bg-emerald-50/80 border-emerald-200/60"
  },
  {
    id: "edu-min",
    category: "Union Ministry",
    name: "Ministry of Education (DoSEL & DHE)",
    hindi: "शिक्षा मंत्रालय",
    subtitle: "National Scholarship Portal & Central Sector",
    authority: "Govt of India",
    LogoComponent: AshokaEmblemLogo,
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    pillBg: "bg-blue-50/80 border-blue-200/60"
  },
  {
    id: "indiastack",
    category: "DPI Rails",
    name: "IndiaStack",
    hindi: "इंडिया स्टैक",
    subtitle: "Open API Digital Public Rails",
    authority: "DPI Ecosystem",
    LogoComponent: IndiaStackLogo,
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    pillBg: "bg-indigo-50/80 border-indigo-200/60"
  },
  {
    id: "labour-min",
    category: "Union Ministry",
    name: "Ministry of Labour & Employment",
    hindi: "श्रम एवं रोजगार मंत्रालय",
    subtitle: "e-Shram & Unorganized Worker Benefits",
    authority: "Govt of India",
    LogoComponent: AshokaEmblemLogo,
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    pillBg: "bg-teal-50/80 border-teal-200/60"
  },
  {
    id: "umang",
    category: "DPI Rails",
    name: "UMANG Unified Platform",
    hindi: "उमंग पोर्टल",
    subtitle: "Unified Mobile Governance Gateway",
    authority: "NeGD · Digital India",
    LogoComponent: UmangLogo,
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    pillBg: "bg-orange-50/80 border-orange-200/60"
  },
  {
    id: "msme-min",
    category: "Union Ministry",
    name: "Ministry of MSME",
    hindi: "सूक्ष्म, लघु एवं मध्यम उद्यम",
    subtitle: "PMEGP Subsidy, Udyam & Credit Guarantee",
    authority: "Govt of India",
    LogoComponent: AshokaEmblemLogo,
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    pillBg: "bg-amber-50/80 border-amber-200/60"
  },
  {
    id: "pfms",
    category: "DPI Rails",
    name: "PFMS Network",
    hindi: "सार्वजनिक वित्तीय प्रबंधन",
    subtitle: "Financial Management & DBT Auditing",
    authority: "Min. of Finance (DoE)",
    LogoComponent: PfmsLogo,
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    pillBg: "bg-sky-50/80 border-sky-200/60"
  },
  {
    id: "health-min",
    category: "Union Ministry",
    name: "Ministry of Health & Family Welfare",
    hindi: "स्वास्थ्य एवं परिवार कल्याण",
    subtitle: "Ayushman Bharat PM-JAY & ABHA",
    authority: "Govt of India · NHA",
    LogoComponent: AshokaEmblemLogo,
    tagColor: "bg-amber-50 text-amber-800 border-amber-200",
    pillBg: "bg-rose-50/80 border-rose-200/60"
  }
];

export default function CivicInfiniteMarquee() {
  // Duplicate array once for seamless, gap-free infinite linear marquee looping
  const marqueeList = [...CIVIC_ENTITIES, ...CIVIC_ENTITIES];

  return (
    /* Full-screen width edge-to-edge section (not boxed inside a small card or bounded div) */
    <section className="w-full bg-white border-y border-[#083d34]/15 shadow-xs py-3.5 my-3 relative overflow-hidden marquee-container marquee-hover-pause">
      
      {/* Top Civic Header Bar spanning across the screen */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <div className="flex items-center space-x-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#065f46]"></span>
            </span>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#04241d] flex items-center gap-1.5">
              <span>🏛️ Integrated Digital Public Infrastructure (DPI) &amp; Union Ministries</span>
              <span className="hidden md:inline text-slate-400 font-semibold">/ डिजिटल पब्लिक इंफ्रास्ट्रक्चर एवं संबद्ध मंत्रालय</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#065f46] font-bold border border-emerald-200 text-[11px]">
              6 DPI Rails
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[11px]">
              6 Union Ministries
            </span>
            <span className="hidden xl:inline text-slate-400 pl-2 text-[11px]">
              (Hover to pause)
            </span>
          </div>
        </div>
      </div>

      {/* Edge-to-Edge Full Screen Marquee Track with Deep Gradient Edge Masks */}
      <div className="relative w-full overflow-hidden marquee-fallback-scroll py-1.5">
        
        {/* Left Gradient Fade Mask (Screen Edge) */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />

        {/* Right Gradient Fade Mask (Screen Edge) */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />

        {/* Infinite Linear Moving Row spanning entire screen width */}
        <div className="animate-marquee-linear flex items-center space-x-4 pl-4">
          {marqueeList.map((item, idx) => {
            const Logo = item.LogoComponent;
            return (
              <div
                key={`${item.id}-${idx}`}
                className="group flex items-center space-x-4 px-4 py-3 rounded-2xl bg-white hover:bg-emerald-50/20 border border-slate-200/90 hover:border-[#065f46]/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 shrink-0 cursor-default select-none w-84 sm:w-96"
              >
                {/* Authentic Logo Mark Container */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 p-1.5 bg-slate-50 border border-slate-200/80 shadow-xs group-hover:scale-105 group-hover:border-emerald-300 transition-all duration-200">
                  <Logo className="w-9 h-9" />
                </div>

                {/* Institution Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span className="text-sm font-bold text-[#0f172a] group-hover:text-[#04241d] transition-colors truncate tracking-tight">
                      {item.name}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${item.tagColor}`}
                    >
                      {item.category === "DPI Rails" ? "DPI Rail" : "Ministry"}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-600 truncate flex items-center gap-1">
                    <span>{item.subtitle}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-0.5 border-t border-slate-100 mt-1">
                    <span className="truncate">{item.authority}</span>
                    <span className="text-slate-500 font-hindi shrink-0 pl-1">
                      {item.hindi}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

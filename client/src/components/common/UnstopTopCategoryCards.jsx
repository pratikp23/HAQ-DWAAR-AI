import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * HAQ DWAAR AI — Unstop-Style Top Pillar Category Cards (Sage Green)
 * Single unified horizontal discovery row with no scrollbar.
 * Citizens can smoothly scroll horizontally across all 12 key citizen welfare pillars.
 */
export default function UnstopTopCategoryCards() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const categories = [
    {
      id: "KISAN",
      title: "Kisan",
      subLabel: "कृषि व किसान",
      route: "/browse-schemes?category=KISAN",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#dbeef1" />
          <path d="M18 42c0-7.732 6.268-14 14-14s14 6.268 14 14H18z" fill="#2d6a4f" />
          <path d="M32 14c-4 6-6 10-6 14h12c0-4-2-8-6-14z" fill="#1b4332" />
          <path d="M26 28c-4-4-8-5-12-5 0 6 3 10 7 12 1.6-2.4 3.3-4.7 5-7z" fill="#52b788" />
          <path d="M38 28c4-4 8-5 12-5 0 6-3 10-7 12-1.6-2.4-3.3-4.7-5-7z" fill="#52b788" />
          <circle cx="24" cy="46" r="4" fill="#081c15" />
          <circle cx="40" cy="46" r="4" fill="#081c15" />
          <path d="M16 46h32" stroke="#1b4332" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "STUDENT",
      title: "Scholarships",
      subLabel: "छात्रवृत्ति",
      route: "/browse-schemes?category=STUDENT",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#dbebe2" />
          <path d="M32 16L12 26l20 10 20-10L32 16z" fill="#2c5e43" />
          <path d="M18 31v11c0 5 6.268 9 14 9s14-4 14-9V31l-14 7-14-7z" fill="#1e432f" />
          <path d="M48 28v14" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
          <circle cx="48" cy="44" r="2.5" fill="#d97706" />
          <polygon points="32,20 34,24 38,24 35,27 36,31 32,28 28,31 29,27 26,24 30,24" fill="#fbbf24" />
        </svg>
      ),
    },
    {
      id: "HEALTH",
      title: "Healthcare",
      subLabel: "आयुष्मान",
      route: "/browse-schemes?category=HEALTH",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#dbeee2" />
          <path d="M32 18c-8 0-14 6-14 14 0 10 14 18 14 18s14-8 14-18c0-8-6-14-14-14z" fill="#e11d48" />
          <rect x="29" y="24" width="6" height="16" rx="2" fill="#ffffff" />
          <rect x="24" y="29" width="16" height="6" rx="2" fill="#ffffff" />
          <circle cx="44" cy="22" r="3" fill="#f43f5e" />
        </svg>
      ),
    },
    {
      id: "HOUSING",
      title: "Housing",
      subLabel: "आवास (PMAY)",
      route: "/browse-schemes?category=HOUSING",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#dcefe4" />
          <path d="M32 14L14 28h6v18h24V28h6L32 14z" fill="#b45309" />
          <rect x="28" y="34" width="8" height="12" rx="1.5" fill="#451a03" />
          <rect x="22" y="30" width="6" height="6" rx="1" fill="#fef3c7" />
          <rect x="36" y="30" width="6" height="6" rx="1" fill="#fef3c7" />
          <path d="M40 18v-4h-4v1l4 3z" fill="#92400e" />
        </svg>
      ),
    },
    {
      id: "WOMEN",
      title: "Women & Child",
      subLabel: "मातृ वंदना",
      route: "/browse-schemes?category=WOMEN",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#dedfe0" />
          <circle cx="32" cy="24" r="7" fill="#be185d" />
          <path d="M22 46c0-6 4.477-11 10-11s10 5 10 11H22z" fill="#9d174d" />
          <path d="M36 34c4 1 7 4 7 8h-3c0-3-2-5-4-6v-2z" fill="#831843" />
          <circle cx="42" cy="30" r="4" fill="#f472b6" />
        </svg>
      ),
    },
    {
      id: "BUSINESS",
      title: "Employment",
      subLabel: "रोजगार व MSME",
      route: "/browse-schemes?category=BUSINESS",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#dceddf" />
          <rect x="16" y="24" width="32" height="22" rx="4" fill="#365314" />
          <path d="M24 24v-4c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v4" stroke="#1a2e05" strokeWidth="3" />
          <path d="M16 32h32" stroke="#a3e635" strokeWidth="2" />
          <rect x="29" y="30" width="6" height="5" rx="1.5" fill="#f59e0b" />
        </svg>
      ),
    },
    {
      id: "GENERAL",
      title: "Pensions",
      subLabel: "सामाजिक सुरक्षा",
      route: "/browse-schemes?category=GENERAL",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#dbeef1" />
          <path d="M32 14l16 6v12c0 10-6.8 17-16 20-9.2-3-16-10-16-20V20l16-6z" fill="#2d6a4f" />
          <circle cx="32" cy="30" r="5" fill="#fbbf24" />
          <path d="M26 42c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "SOLAR",
      title: "Solar Rooftop",
      subLabel: "पीएम सूर्य घर",
      route: "/browse-schemes?search=Surya",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#fef9c3" />
          <circle cx="32" cy="32" r="10" fill="#f59e0b" />
          <path d="M32 10v6M32 48v6M10 32h6M48 32h6M16 16l4 4M44 44l4 4M16 48l4-4M44 16l4 4" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "WATER",
      title: "Clean Water",
      subLabel: "जल जीवन मिशन",
      route: "/browse-schemes?search=Jal",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#e0f2fe" />
          <path d="M32 14c-6 9-12 16-12 22a12 12 0 1024 0c0-6-6-13-12-22z" fill="#0284c7" />
          <path d="M32 20c-3 5-7 10-7 15a7 7 0 007 7" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "FOOD",
      title: "Food Security",
      subLabel: "अन्न योजना",
      route: "/browse-schemes?search=Ration",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#ffedd5" />
          <path d="M22 26c0-4 4.5-8 10-8s10 4 10 8v16c0 4-4.5 8-10 8s-10-4-10-8V26z" fill="#ea580c" />
          <path d="M24 32h16M24 38h16" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "DIVYANG",
      title: "Divyangjan",
      subLabel: "दिव्यांग सहायता",
      route: "/browse-schemes?search=Disability",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#ede9fe" />
          <circle cx="32" cy="20" r="5" fill="#7c3aed" />
          <path d="M32 26v10l8 4M32 36l-6 6" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="42" r="8" stroke="#8b5cf6" strokeWidth="3" />
        </svg>
      ),
    },
    {
      id: "LEGAL",
      title: "Legal Aid",
      subLabel: "न्याय व टेली-लॉ",
      route: "/browse-schemes?search=Legal",
      icon: (
        <svg viewBox="0 0 64 64" className="w-12 h-12 drop-shadow-sm group-hover:scale-110 transition-transform duration-200" fill="none">
          <circle cx="32" cy="32" r="28" fill="#f1f5f9" />
          <path d="M32 16v32M20 22h24M20 22l-6 12h12l-6-12zM44 22l-6 12h12l-6-12z" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative w-full group/carousel">
      {/* Optional Left Scroll Arrow for Desktop */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-purple-700 hover:scale-110 transition opacity-0 group-hover/carousel:opacity-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Horizontal Scroll Row Without Scrollbar */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar snap-x touch-pan-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.route}
            className="shrink-0 snap-start focus:outline-none group"
          >
            {/* Unstop Squircle Little Card in Sage Green Theme */}
            <div
              className="w-[104px] sm:w-[120px] h-[114px] sm:h-[126px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#e3ece5] via-[#ebf2ed] to-[#f4f8f5] border border-[#c8d9cc] hover:border-[#86a88d] hover:bg-[#d8e5da] shadow-2xs hover:shadow-md hover:shadow-emerald-950/5 transition-all duration-200 transform group-hover:-translate-y-1 flex flex-col items-center justify-between p-2.5 text-center select-none"
            >
              {/* Top Text Name */}
              <div className="space-y-0.5">
                <span className="text-xs sm:text-[13px] font-black text-[#1b3422] group-hover:text-[#0b1f11] transition-colors tracking-tight block truncate">
                  {cat.title}
                </span>
                <span className="text-[10px] text-[#556e5a] font-semibold block truncate">
                  {cat.subLabel}
                </span>
              </div>

              {/* Bottom 3D Illustration Graphic */}
              <div className="w-12 h-12 flex items-center justify-center">
                {cat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Optional Right Scroll Arrow for Desktop */}
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-purple-700 hover:scale-110 transition opacity-0 group-hover/carousel:opacity-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

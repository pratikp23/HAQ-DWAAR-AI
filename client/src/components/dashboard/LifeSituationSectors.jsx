import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sprout, 
  ChevronRight 
} from "lucide-react";
import { 
  NspLogo, 
  PmKisanLogo, 
  MsmeLogo, 
  AyushmanBharatLogo, 
  DbtBharatLogo 
} from "../common/GovLogos";

/**
 * HAQ DWAAR AI — Life-Situation Sectors ("त्वरित श्रेणियां")
 * 
 * Replicates the reference design with authentic GovTech emblems:
 * - Green sprout header with bilingual title: त्वरित श्रेणियां (Life-Situation Sectors)
 * - "सभी देखें >" link to all schemes
 * - 5 high-impact sector cards with official seals:
 *   1. Education & Scholarships (NSP Portal Logo, Hot badge)
 *   2. Agriculture & Kisan Grants (PM-Kisan Logo, DBT Direct badge)
 *   3. Vocational & Toolkit (MSME Udyam Logo, MSME Aid badge)
 *   4. Ayushman & Health (Ayushman Bharat PM-JAY Logo, ₹5L Cover badge)
 *   5. Social Security & Old Age (DBT Bharat Logo, Direct Cash badge)
 * - Scheme counts in Hindi ("14 योजनाएं", "8 योजनाएं", etc.)
 */
export default function LifeSituationSectors({
  onSelectCategory = null,
}) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("education");

  const sectors = [
    {
      id: "education",
      title: "Education & Scholarships",
      categoryName: "Education & Higher Studies",
      countText: "14 योजनाएं",
      badgeText: "Hot",
      badgeColor: "bg-[#ea580c] text-white",
      LogoComponent: NspLogo,
      queryCategory: "STUDENT",
      isHighlighted: true,
    },
    {
      id: "agriculture",
      title: "Agriculture & Kisan Grants",
      categoryName: "PM-Kisan & Agri Subsidies",
      countText: "8 योजनाएं",
      badgeText: "DBT Direct",
      badgeColor: "bg-[#059669] text-white",
      LogoComponent: PmKisanLogo,
      queryCategory: "KISAN",
      isHighlighted: false,
    },
    {
      id: "vocational",
      title: "Vocational & Toolkit",
      categoryName: "MSME & Vishwakarma",
      countText: "11 योजनाएं",
      badgeText: "MSME Aid",
      badgeColor: "bg-[#7c3aed] text-white",
      LogoComponent: MsmeLogo,
      queryCategory: "EMPLOYMENT",
      isHighlighted: false,
    },
    {
      id: "health",
      title: "Ayushman & Health",
      categoryName: "PM-JAY Health Protection",
      countText: "6 योजनाएं",
      badgeText: "₹5L Cover",
      badgeColor: "bg-[#2563eb] text-white",
      LogoComponent: AyushmanBharatLogo,
      queryCategory: "HEALTH",
      isHighlighted: false,
    },
    {
      id: "social-security",
      title: "Social Security & Old Age",
      categoryName: "Pensions & DBT Welfare",
      countText: "5 योजनाएं",
      badgeText: "Direct Cash",
      badgeColor: "bg-[#d97706] text-white",
      LogoComponent: DbtBharatLogo,
      queryCategory: "GENERAL",
      isHighlighted: false,
    },
  ];

  const handleCardClick = (sector) => {
    setSelectedId(sector.id);
    if (onSelectCategory) {
      onSelectCategory(sector.queryCategory);
    } else {
      navigate(`/dashboard/schemes?category=${encodeURIComponent(sector.queryCategory)}`);
    }
  };

  return (
    <section aria-label="Life-Situation Sectors" className="space-y-3.5">
      
      {/* 1. Header with Sprout Icon and 'सभी देखें >' Link */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-600 shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-[#2b0f4c] tracking-normal">
            त्वरित श्रेणियां
            <span className="text-xs sm:text-sm font-normal text-slate-500 ml-1.5">
              (Life-Situation Sectors)
            </span>
          </h2>
        </div>

        <Link
          to="/dashboard/schemes"
          className="inline-flex items-center gap-0.5 text-xs sm:text-sm font-semibold text-[#7c3aed] hover:text-[#591d8f] transition-colors"
        >
          <span>सभी देखें</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 2. 5 Horizontal Sector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {sectors.map((sector) => {
          const LogoComp = sector.LogoComponent;
          const isSelected = selectedId === sector.id;

          return (
            <div
              key={sector.id}
              onClick={() => handleCardClick(sector)}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all cursor-pointer min-h-[160px] ${
                isSelected
                  ? "bg-white border-2 border-[#7c3aed] ring-2 ring-purple-100 shadow-sm"
                  : "bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-purple-200"
              }`}
            >
              {/* Top Row: Authentic Civic Logo + Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50/80 flex items-center justify-center shrink-0 border border-purple-100/60 p-1 shadow-2xs">
                  <LogoComp className="w-7 h-7" />
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs shrink-0 ${sector.badgeColor}`}>
                  {sector.badgeText}
                </span>
              </div>

              {/* Middle: Title & Subtitle */}
              <div className="pt-3 pb-2 space-y-0.5">
                <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
                  {sector.title}
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  {sector.categoryName}
                </p>
              </div>

              {/* Bottom: Hindi Scheme Count + Arrow */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7c3aed]">
                  {sector.countText}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#7c3aed]" />
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}

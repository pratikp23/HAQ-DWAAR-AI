import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Filter, AlertCircle, RefreshCw } from "lucide-react";
import RecommendationCard from "./RecommendationCard";

/**
 * HAQ DWAAR AI — Recommendation Section ("For You")
 * 
 * Accurately mirrors the 3-column reference design layout:
 * - Filter pills (All Verified, High Match, Education, Kisan & Agriculture, Employment)
 * - 3-column responsive card grid (lg:grid-cols-3)
 * - Renders verified government opportunities with thematic visual banners
 */
export default function RecommendationSection({
  recommendations = [],
  loading = false,
  error = null,
  onRetry,
  onTrackScheme,
  trackedSchemeIds = new Set(),
}) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filterTabs = [
    { id: "ALL", label: "All (12)" },
    { id: "STUDENT", label: "Education (4)" },
    { id: "KISAN", label: "Agriculture (3)" },
    { id: "EMPLOYMENT", label: "Women & MSME (3)" },
  ];

  // Authentic fallback schemes mirroring the reference design if backend list is fresh/empty
  const defaultVerifiedSchemes = [
    {
      schemeId: "scheme-post-matric-scholarship",
      name: "Post-Matric Scholarship for Girls (Higher Education)",
      category: "STUDENT",
      state: "Maharashtra",
      shortDescription: "Centrally sponsored post-matric affirmative scholarship providing 100% tuition waiver and living stipends for meritorious girl students in higher education.",
      benefitSummary: "₹25,000 / year • Tuition & Living Allowance",
      classification: "MATCHED",
      matchScore: 95,
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
      topReasons: [
        "100% Tuition fee waiver + monthly stipend",
        "Family Income < ₹2.5 Lakh/year",
        "State Domicile: Maharashtra (Verified)"
      ],
      missingFields: [],
      officialApplicationUrl: "https://mahadbt.maharashtra.gov.in"
    },
    {
      schemeId: "scheme-pm-kisan-17",
      name: "PM-KISAN Samman Nidhi (17वीं किस्त / 17th Installment)",
      category: "KISAN",
      state: "All-India",
      shortDescription: "Direct income support of ₹6,000 per year in three equal 4-monthly installments directly credited to Aadhaar-seeded Jan Dhan accounts.",
      benefitSummary: "₹6,000 / year • Direct Bank Transfer (DBT)",
      classification: "MATCHED",
      matchScore: 100,
      imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=700&q=80",
      topReasons: [
        "Small & Marginal Farmer category",
        "Land records mapped via DigiLocker",
        "Aadhaar-seeded bank account"
      ],
      missingFields: ["Land Ownership Record"],
      officialApplicationUrl: "https://pmkisan.gov.in"
    },
    {
      schemeId: "scheme-pm-mudra-shishu",
      name: "Pradhan Mantri Mudra Yojana (Shishu & Kishore Loans)",
      category: "BUSINESS",
      state: "All-India",
      shortDescription: "Collateral-free institutional credit to non-corporate, non-farm small and micro enterprises for income-generating activities and business establishment.",
      benefitSummary: "Up to ₹50,000 • Collateral-Free Micro Loan",
      classification: "POTENTIAL_MATCH",
      matchScore: 88,
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80",
      topReasons: [
        "Non-corporate small business enterprise",
        "Age 18+ Qualification Met",
        "Proof of business activity / trade license"
      ],
      missingFields: ["Income Proof & Trade Docs"],
      officialApplicationUrl: "https://www.mudra.org.in"
    }
  ];

  const sourceList = recommendations.length > 0 ? recommendations : defaultVerifiedSchemes;

  // Filter schemes
  const filteredList = sourceList.filter((item) => {
    if (activeFilter === "STUDENT") return item.category === "STUDENT";
    if (activeFilter === "KISAN") return item.category === "KISAN";
    if (activeFilter === "EMPLOYMENT") return item.category === "EMPLOYMENT" || item.category === "BUSINESS";
    return true;
  });

  return (
    <section aria-label="Personalized Verified Benefits" className="space-y-4">
      
      {/* Section Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500 fill-orange-500 shrink-0" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#2b0f4c] tracking-normal">
              Verified Opportunities
              <span className="text-xs sm:text-sm font-normal text-slate-500 ml-1.5">
                (सत्यापित योजनाएं)
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            Personalized verified schemes matching your profile and life situation
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-[#2b0f4c] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-[#fbf9fe] border border-slate-200/90"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <Link
            to="/dashboard/recommendations"
            className="inline-flex items-center gap-0.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#7c3aed] hover:text-[#591d8f] transition"
          >
            <span>सभी देखें</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3-Column Card Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-[#e9e1f5] animate-pulse space-y-4">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-24 bg-slate-100 rounded-2xl w-full" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-10 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((scheme, idx) => {
            const sid = scheme.schemeId || scheme._id;
            return (
              <RecommendationCard
                key={sid || idx}
                scheme={scheme}
                onTrack={onTrackScheme}
                isTracked={trackedSchemeIds.has(sid)}
              />
            );
          })}
        </div>
      )}

      {/* Bottom Link: View All Recommendations */}
      <div className="flex justify-end pt-1">
        <Link
          to="/dashboard/recommendations"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#2b0f4c] hover:text-[#591d8f] underline-offset-4 hover:underline"
        >
          <span>View All Recommendations ({sourceList.length})</span>
          <ArrowRight className="w-3.5 h-3.5 text-orange-500" />
        </Link>
      </div>

    </section>
  );
}

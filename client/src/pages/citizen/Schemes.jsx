import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getSchemes } from "../../services/schemeApi";
import SchemeImageBanner from "../../components/common/SchemeImageBanner";
import { SchemeCardSkeleton } from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";
import { 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  Sprout, 
  Building, 
  Briefcase, 
  Globe, 
  FileText,
  AlertCircle,
  Sparkles,
  HeartPulse,
  Compass,
} from "lucide-react";

const CATEGORIES = [
  { id: "ALL", label: "All Opportunities" },
  { id: "STUDENT", label: "Student & Education", icon: GraduationCap },
  { id: "KISAN", label: "Kisan & Agriculture", icon: Sprout },
  { id: "EMPLOYMENT", label: "Employment & Livelihood", icon: Briefcase },
  { id: "BUSINESS", label: "Business & MSME", icon: Building },
  { id: "HEALTH", label: "Ayushman & Health", icon: HeartPulse },
  { id: "GENERAL", label: "General & Welfare", icon: Globe },
];

export default function Schemes() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync category state with URL parameters
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory && urlCategory !== activeCategory) {
      setActiveCategory(urlCategory);
    }
  }, [searchParams]);

  const fetchCatalogSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (activeCategory !== "ALL") {
        params.category = activeCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await getSchemes(params);
      setSchemes(res?.data?.schemes || res?.schemes || (Array.isArray(res) ? res : []));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogSchemes();
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCatalogSchemes();
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* GovTech Hero Banner */}
      <div className="bg-gradient-to-r from-[#112318] via-[#1a3824] to-[#0d1d14] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-[#234731]">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ea580c]/20 border border-[#ea580c]/50 text-xs font-bold text-[#ffedd5]">
            <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
            <span>Official Government Welfare Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t("navBrowseSchemes", "Explore Government Schemes")}
          </h1>
          <p className="text-[#c8ded0] text-sm font-medium leading-relaxed">
            Discover verified state and central schemes with clear eligibility rules and official application portals.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes by name, keyword, or benefits..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#112318]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchParams(cat.id === "ALL" ? {} : { category: cat.id });
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-[#112318] text-white shadow-xs"
                    : "bg-[#eef5f0] text-[#24422e] hover:bg-[#dfeee3]"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State: HeroUI SchemeCardSkeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SchemeCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* User-Centric Error State */}
      {error && !loading && (
        <ErrorState
          error={error}
          onRetry={fetchCatalogSchemes}
          className="w-full max-w-lg my-6"
        />
      )}

      {/* Schemes Grid */}
      {!loading && !error && (
        <>
          {schemes.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No schemes found</h3>
              <p className="text-xs text-slate-500">
                Try adjusting your search terms or select another category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {schemes.map((scheme) => (
                <div
                  key={scheme._id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group"
                >
                  <div className="space-y-3">
                    {/* Photographic Scheme Banner */}
                    <Link to={`/dashboard/schemes/${scheme._id}`} className="block">
                      <SchemeImageBanner scheme={scheme} heightClass="h-36 sm:h-40" />
                    </Link>

                    <h2 className="text-base font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-[#112318] transition-colors">
                      <Link to={`/dashboard/schemes/${scheme._id}`}>
                        {scheme.name}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {scheme.shortDescription}
                    </p>

                    <div className="p-3 bg-[#eef5f0] rounded-2xl border border-[#c6decb] text-xs space-y-1">
                      <span className="font-bold text-[#112318] block text-[10px] uppercase tracking-wider">Key Benefit:</span>
                      <p className="text-[#2b4c34] font-semibold leading-relaxed line-clamp-2">{scheme.benefitSummary}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium truncate max-w-[130px]">
                      {scheme.sourceName || scheme.state || "All-India"}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <Link
                        to={`/dashboard/coach/${scheme._id}`}
                        className="inline-flex items-center text-[11px] font-bold text-[#234731] hover:text-[#112318] transition"
                      >
                        <Compass className="w-3.5 h-3.5 mr-1" />
                        <span>Coach</span>
                      </Link>
                      <Link
                        to={`/dashboard/schemes/${scheme._id}`}
                        className="inline-flex items-center text-xs font-black text-[#112318] hover:text-[#ea580c] transition-colors"
                      >
                        {t("details", "Details")} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

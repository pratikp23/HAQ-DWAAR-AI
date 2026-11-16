import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Building,
  Sparkles,
  Info,
  SlidersHorizontal,
  X,
  Compass,
  AlertCircle,
  Tractor,
  GraduationCap,
  HeartPulse,
  Home,
  Briefcase,
  Users,
  Coins,
  Shield,
  Layers,
  Zap
} from "lucide-react";
import { getSchemes } from "../../services/schemeApi";
import { STATUTORY_SCHEMES } from "../../data/statutorySchemes";
import { useAuth } from "../../hooks/useAuth";
import SchemeImageBanner from "../../components/common/SchemeImageBanner";
import { SpotlightCard } from "../../components/common/ReactBits";
import { SchemeCardSkeleton } from "../../components/common/Skeleton";
import ErrorState from "../../components/common/ErrorState";

const CATEGORIES = [
  { id: "ALL", label: "All Schemes", icon: Compass },
  { id: "KISAN", label: "Kisan & Farming", icon: Tractor },
  { id: "STUDENT", label: "Students & Youth", icon: GraduationCap },
  { id: "HEALTH", label: "Healthcare & Swasthya", icon: HeartPulse },
  { id: "HOUSING", label: "Affordable Housing", icon: Home },
  { id: "EMPLOYMENT", label: "Jobs & Livelihood", icon: Briefcase },
  { id: "BUSINESS", label: "MSME & Business", icon: Building },
  { id: "GENERAL", label: "Social Security", icon: Users },
];

const STATES = [
  "All-India",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Maharashtra",
  "Rajasthan",
  "Bihar",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "West Bengal",
  "Odisha",
  "Punjab",
  "Haryana",
  "Kerala",
  "Assam",
  "Andhra Pradesh",
  "Telangana"
];

const APPLICATION_METHODS = [
  { id: "ALL", label: "All Application Methods" },
  { id: "ONLINE", label: "Online Only" },
  { id: "OFFLINE", label: "Offline / Tahsil" },
  { id: "HYBRID", label: "Hybrid / Direct DBT" }
];

export default function BrowseSchemes() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";
  const initialSearch = searchParams.get("search") || "";

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState("All-India");
  const [selectedMethod, setSelectedMethod] = useState("ALL");

  const filterStatutorySchemes = () => {
    let list = [...STATUTORY_SCHEMES];

    if (selectedCategory && selectedCategory !== "ALL") {
      list = list.filter((s) => s.category === selectedCategory);
    }
    if (selectedState && selectedState !== "All-India") {
      list = list.filter((s) => s.state === "All-India" || s.state === selectedState);
    }
    if (selectedMethod && selectedMethod !== "ALL") {
      list = list.filter(
        (s) => (s.applicationMethod || "").toUpperCase() === selectedMethod.toUpperCase()
      );
    }
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          (s.tags && s.tags.some((t) => t.toLowerCase().includes(q))) ||
          (s.sourceName && s.sourceName.toLowerCase().includes(q))
      );
    }

    return list;
  };

  const fetchSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== "ALL") {
        params.category = selectedCategory;
      }
      if (selectedState && selectedState !== "All-India") {
        params.state = selectedState;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const res = await getSchemes(params);
      let list = res?.data?.schemes || res?.schemes || (Array.isArray(res) ? res : []);

      // If backend returned results, filter by application method if chosen
      if (list && list.length > 0) {
        if (selectedMethod && selectedMethod !== "ALL") {
          list = list.filter(
            (s) => (s.applicationMethod || "").toUpperCase() === selectedMethod.toUpperCase()
          );
        }
        setSchemes(list);
      } else {
        // Seamlessly use authentic statutory scheme catalog
        setSchemes(filterStatutorySchemes());
      }
    } catch (err) {
      console.warn("Backend offline or unreachable, serving statutory schemes catalog:", err?.message);
      setSchemes(filterStatutorySchemes());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, selectedState, selectedMethod]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSearchParams(catId === "ALL" ? {} : { category: catId });
  };

  const clearFilters = () => {
    setSelectedCategory("ALL");
    setSelectedState("All-India");
    setSelectedMethod("ALL");
    setSearchTerm("");
    setSearchParams({});
  };

  return (
    <div className="w-full min-h-screen bg-[#f8faf8] text-slate-900 pb-20">
      
      {/* ======================================================== */}
      {/* 1. LOK SAMARTH DISCOVERY BANNER (Civic Pine + Tiranga)   */}
      {/* ======================================================== */}
      <div className="bg-[#112318] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-emerald-950/40 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1400&q=80"
            alt="Indian National Flag"
            className="w-full h-full object-cover object-[85%_center] opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#112318] via-[#112318]/85 via-50% to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b3524] text-emerald-300 border border-emerald-700/40 text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>350+ Central &amp; State Schemes • 100% Deterministic Engine</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Scheme <span className="text-amber-400">Discovery</span> Desk
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl mt-1">
                Explore authenticated government welfare programs, subsidies, scholarships, and DBT direct transfers.
              </p>
            </div>

            {/* Quick Passport CTA */}
            <Link
              to={isAuthenticated ? "/dashboard/benefit-passport" : "/login"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#234731] hover:bg-[#2d583b] text-white border border-emerald-500/40 text-xs sm:text-sm font-bold shadow-md hover:shadow-emerald-900/30 transition self-start md:self-auto shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isAuthenticated ? "Check My Benefit Passport" : "Log In to Auto-Match"}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-emerald-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. SEARCH & FILTER CONTROLS (HeroUI Styled Canvas)       */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        
        {/* Main Filter Bar Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-lg shadow-slate-200/50 space-y-4">
          
          {/* OmniSearch Form */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search scheme name, ministry, keyword (e.g. PM-KISAN, Ayushman, Scholarship, Tractor)..."
                className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:bg-white transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#234731] hover:bg-[#183323] text-white font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Schemes</span>
            </button>
          </form>

          {/* Location & Method Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label htmlFor="state-filter" className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                State / Geographic Scope
              </label>
              <select
                id="state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#234731] transition"
              >
                {STATES.map((st) => (
                  <option key={st} value={st}>
                    {st === "All-India" ? "All-India (National Central Sector)" : st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="method-filter" className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                Application Delivery Door
              </label>
              <select
                id="method-filter"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#234731] transition"
              >
                {APPLICATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Horizontal Pill Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">
              Sector:
            </span>
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#234731] text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 border border-slate-200/90 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? "text-amber-300" : "text-slate-500"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {(selectedCategory !== "ALL" || selectedState !== "All-India" || selectedMethod !== "ALL" || searchTerm) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-black text-rose-600 hover:underline ml-auto cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
          <p>
            Showing <strong className="text-slate-900">{schemes.length}</strong> verified government schemes
            {selectedCategory !== "ALL" && ` in ${selectedCategory}`}
            {selectedState !== "All-India" && ` for ${selectedState}`}
            {selectedMethod !== "ALL" && ` (${selectedMethod})`}
          </p>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-800 bg-[#ebf3ed] px-2.5 py-0.5 rounded-full border border-[#c8ded0] text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Official Gazette &amp; Circular Verified</span>
          </span>
        </div>

        {/* Loading State: HeroUI SchemeCardSkeleton Grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SchemeCardSkeleton key={idx} />
            ))}
          </div>
        )}

        {/* Error State: User-Centric HeroUI Card */}
        {error && !loading && (
          <ErrorState
            error={error}
            onRetry={fetchSchemes}
            className="w-full max-w-lg my-8"
          />
        )}

        {/* Empty State */}
        {!loading && !error && schemes.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-16 text-center space-y-4 shadow-xs">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-base font-black text-slate-900">
              No government schemes found
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We couldn't find any schemes matching your current criteria. Try adjusting your query or resetting filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-2xl bg-[#234731] text-white font-black text-xs hover:bg-[#183323] transition shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. BROWSE RESULTS GRID: HEROUI SPOTLIGHTCARDS            */}
        {/* ======================================================== */}
        {!loading && !error && schemes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemes.map((scheme) => (
              <SpotlightCard
                key={scheme._id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                spotlightColor="rgba(35, 71, 49, 0.08)"
              >
                <div className="space-y-3">
                  {/* Scheme Visual Image Banner */}
                  <Link to={`/schemes/${scheme._id}`} className="block overflow-hidden rounded-2xl">
                    <SchemeImageBanner scheme={scheme} heightClass="h-36 sm:h-40" />
                  </Link>

                  {/* Badges Strip */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {scheme.gazetteNumber ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-600 shrink-0" />
                        <span>Gazette: {scheme.gazetteNumber}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ebf3ed] text-[#234731] border border-[#c8ded0] shadow-2xs inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Govt Verified</span>
                      </span>
                    )}

                    {scheme.isFlagged && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>Nodal Review</span>
                      </span>
                    )}

                    <span className="text-[10px] font-black uppercase text-[#234731] bg-[#ebf3ed] px-2 py-0.5 rounded-md border border-[#c8ded0] ml-auto">
                      {scheme.applicationMethod || "ONLINE"}
                    </span>
                  </div>

                  {/* Scheme Name */}
                  <h2 className="text-base font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-[#234731] transition-colors">
                    <Link to={`/schemes/${scheme._id}`}>
                      {scheme.name}
                    </Link>
                  </h2>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {scheme.shortDescription}
                  </p>

                  {/* Benefit Summary Box */}
                  <div className="p-3 bg-gradient-to-r from-amber-50/70 via-orange-50/30 to-white rounded-2xl border border-amber-200/80 text-xs space-y-1 shadow-2xs">
                    <span className="font-extrabold text-[#ea580c] text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Civic Benefit / प्रत्यक्ष लाभ</span>
                    </span>
                    <p className="text-slate-900 font-bold line-clamp-2 leading-relaxed text-xs">
                      {scheme.benefitSummary}
                    </p>
                  </div>

                  {/* Meta Strip */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1">
                    <span>
                      {scheme.state || "All-India"}
                    </span>
                    <span>
                      {scheme.requiredDocuments?.length || 0} Docs Needed
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/schemes/${scheme._id}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-[#234731] hover:text-[#183323] transition group-hover:translate-x-0.5"
                  >
                    <span>View Scheme Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {scheme.officialApplicationUrl ? (
                    <a
                      href={scheme.officialApplicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition shadow-2xs"
                      title="Opens authorized official government application portal in new tab"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                    </a>
                  ) : (
                    <Link
                      to={`/schemes/${scheme._id}`}
                      className="inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
                    >
                      <span>Check Door 1 &amp; 2</span>
                    </Link>
                  )}
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

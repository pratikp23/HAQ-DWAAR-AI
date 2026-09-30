import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  Compass
} from "lucide-react";
import { getSchemes } from "../../services/schemeApi";
import { useAuth } from "../../hooks/useAuth";
import SchemeImageBanner from "../../components/common/SchemeImageBanner";

const CATEGORIES = [
  { id: "ALL", label: "All Categories" },
  { id: "STUDENT", label: "Students & Education" },
  { id: "KISAN", label: "Kisan & Agriculture" },
  { id: "EMPLOYMENT", label: "Employment & Livelihood" },
  { id: "BUSINESS", label: "Business & MSME" },
  { id: "GENERAL", label: "General & Welfare" },
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
  { id: "OFFLINE", label: "Offline / Center" },
  { id: "HYBRID", label: "Hybrid / Both" }
];

export default function BrowseSchemes() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState("All-India");
  const [selectedMethod, setSelectedMethod] = useState("ALL");

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
      let list = res?.data?.schemes || [];

      // Filter by application method if chosen
      if (selectedMethod && selectedMethod !== "ALL") {
        list = list.filter(
          (s) => (s.applicationMethod || "").toUpperCase() === selectedMethod.toUpperCase()
        );
      }

      setSchemes(list);
    } catch (err) {
      setError(err.message || "Failed to load verified schemes.");
      setSchemes([]);
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
    if (catId === "ALL") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catId);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setSelectedState("All-India");
    setSelectedMethod("ALL");
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-[#f7f5fa] text-[#0f172a] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ======================================================== */}
        {/* 1. BROWSE PAGE HEADER (Section 17)                       */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e9e1f5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-[#2b0f4c] border border-purple-200 text-xs font-black">
              <Compass className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>EXPLORE SCHEMES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight">
              Explore Government Schemes
            </h1>
            <p className="text-xs sm:text-sm text-[#4b5563] max-w-2xl font-medium leading-relaxed">
              Find schemes based on category, state and application information. All verified against official central and state government notifications.
            </p>
          </div>

          {/* Right informational card */}
          <div className="bg-[#fbf9fe] rounded-2xl p-4 border border-[#e9e1f5] shrink-0 sm:max-w-xs space-y-1">
            <div className="flex items-center space-x-2 text-xs font-black text-[#2b0f4c]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Public Discovery</span>
            </div>
            <p className="text-[11px] text-[#4b5563] font-semibold leading-relaxed">
              No account required to browse schemes, review criteria, or access official application portals.
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SEARCH / FILTER UI (Section 18)                       */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e9e1f5] shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#64748b] absolute left-4 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search schemes by name, department, or keywords..."
                aria-label="Search schemes"
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[#e9e1f5] text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-3.5 text-[#94a3b8] hover:text-[#0f172a] cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-black text-xs sm:text-sm shadow-xs transition cursor-pointer whitespace-nowrap"
            >
              Search Schemes
            </button>
          </form>

          {/* Select dropdowns for States & Application Methods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label htmlFor="state-filter" className="block text-[11px] font-black text-[#4b5563] uppercase tracking-wider mb-1">
                State / Location
              </label>
              <select
                id="state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-[#e9e1f5] text-xs font-bold text-[#0f172a] bg-[#fbf9fe] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
              >
                {STATES.map((st) => (
                  <option key={st} value={st}>
                    {st === "All-India" ? "All-India Schemes" : st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="method-filter" className="block text-[11px] font-black text-[#4b5563] uppercase tracking-wider mb-1">
                Application Method
              </label>
              <select
                id="method-filter"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl border border-[#e9e1f5] text-xs font-bold text-[#0f172a] bg-[#fbf9fe] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
              >
                {APPLICATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-3 border-t border-[#e9e1f5] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black text-[#64748b] uppercase tracking-wider mr-1">
              Sector:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#2b0f4c] text-white shadow-xs"
                    : "bg-[#fbf9fe] text-[#4b5563] border border-[#e9e1f5] hover:border-[#2b0f4c]/40 hover:text-[#0f172a]"
                }`}
              >
                {cat.label}
              </button>
            ))}

            {(selectedCategory !== "ALL" || selectedState !== "All-India" || selectedMethod !== "ALL" || searchTerm) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-black text-[#ea580c] hover:underline ml-auto cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-[#64748b] px-1 font-semibold">
          <p>
            Showing <strong className="text-[#0f172a]">{schemes.length}</strong> verified government schemes
            {selectedCategory !== "ALL" && ` in ${selectedCategory}`}
            {selectedState !== "All-India" && ` for ${selectedState}`}
            {selectedMethod !== "ALL" && ` (${selectedMethod})`}
          </p>
          <span className="hidden sm:inline text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px] font-bold">
            <ShieldCheck className="w-3 h-3 inline mr-1" />
            Verified Against Official Circulars
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl border border-[#e9e1f5] p-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#ea580c] animate-spin mx-auto" />
            <p className="text-xs font-black text-[#4b5563]">
              Loading verified government schemes...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-900 p-8 rounded-3xl text-center space-y-3">
            <p className="font-black text-sm">Unable to retrieve schemes</p>
            <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchSchemes}
              className="mt-2 px-5 py-2 rounded-xl bg-red-700 text-white text-xs font-black hover:bg-red-800 transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State (Section 19) */}
        {!loading && !error && schemes.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#e9e1f5] p-16 text-center space-y-4">
            <FileText className="w-12 h-12 text-[#94a3b8] mx-auto" />
            <h2 className="text-base font-black text-[#0f172a]">
              No schemes found
            </h2>
            <p className="text-xs text-[#64748b] max-w-md mx-auto leading-relaxed">
              We couldn't find any verified government schemes matching your current criteria. Try adjusting your search query or clearing your filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-2xl bg-[#2b0f4c] text-white font-black text-xs hover:bg-[#1e0a3c] transition shadow-xs cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. BROWSE RESULTS GRID (Section 19)                      */}
        {/* ======================================================== */}
        {!loading && !error && schemes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemes.map((scheme) => (
              <div
                key={scheme._id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#e9e1f5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Scheme Visual Image Banner */}
                  <Link to={`/schemes/${scheme._id}`} className="block">
                    <SchemeImageBanner scheme={scheme} heightClass="h-36 sm:h-40" />
                  </Link>

                  {/* Scheme Name */}
                  <h2 className="text-base font-black text-[#0f172a] leading-snug line-clamp-2 group-hover:text-[#591d8f] transition-colors">
                    <Link to={`/schemes/${scheme._id}`}>
                      {scheme.name}
                    </Link>
                  </h2>

                  {/* Short Description */}
                  <p className="text-xs text-[#4b5563] leading-relaxed line-clamp-2">
                    {scheme.shortDescription}
                  </p>

                  {/* Benefit Summary Box */}
                  <div className="p-3 bg-[#fbf9fe] rounded-2xl border border-[#e9e1f5] text-xs space-y-1">
                    <span className="font-black text-[#2b0f4c] block text-[10px] uppercase tracking-wider">
                      Benefit
                    </span>
                    <p className="text-[#0f172a] font-semibold line-clamp-2 leading-relaxed">
                      {scheme.benefitSummary}
                    </p>
                  </div>

                  {/* Meta Strip */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#64748b] pt-1">
                    <span className="uppercase text-[#2b0f4c] font-black">
                      {scheme.applicationMethod || "ONLINE"}
                    </span>
                    <span>
                      {scheme.state || "All-India"}
                    </span>
                    <span>
                      {scheme.requiredDocuments?.length || 0} Docs
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#e9e1f5] flex items-center justify-between gap-2">
                  <Link
                    to={`/schemes/${scheme._id}`}
                    className="inline-flex items-center text-xs font-black text-[#2b0f4c] hover:text-[#ea580c] transition"
                  >
                    View Scheme →
                  </Link>

                  {scheme.officialApplicationUrl && (
                    <a
                      href={scheme.officialApplicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[11px] font-bold text-[#64748b] hover:text-[#0f172a] bg-[#fbf9fe] hover:bg-slate-100 px-2.5 py-1 rounded-xl border border-[#e9e1f5] transition"
                      title="Opens authorized official government application portal in new tab"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3 ml-1 text-[#64748b]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

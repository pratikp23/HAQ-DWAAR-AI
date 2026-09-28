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
  X
} from "lucide-react";
import { getSchemes } from "../../services/schemeApi";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const CATEGORIES = [
  { id: "ALL", label: "All Sectors" },
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

export default function BrowseSchemes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedState, setSelectedState] = useState("All-India");

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
      if (res?.data?.schemes) {
        setSchemes(res.data.schemes);
      } else {
        setSchemes([]);
      }
    } catch (err) {
      setError(err.message || "Failed to load verified schemes.");
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, selectedState]);

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
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-blue-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-950">
        <div className="max-w-5xl mx-auto space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Public Scheme Directory • Verified Official Data</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Discover Government Schemes
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Explore verified government welfare programs, review structured eligibility criteria and required documents, and access direct official government application portals without middlemen.
          </p>

          {/* Personalized Journey Callout Banner */}
          <div className="mt-4 p-4 rounded-xl bg-blue-800/40 border border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0" />
              <div>
                <span className="font-bold text-white block">
                  Want personalized matching & document readiness checks?
                </span>
                <span className="text-blue-200 text-[11px]">
                  Build a free Benefit Passport to deterministically evaluate your profile against all schemes.
                </span>
              </div>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold whitespace-nowrap shadow transition"
            >
              Get Personalized Match <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content & Search Filters */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Search & State Filter Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search schemes by name, department, benefit keywords, or tags..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full sm:w-48 py-2.5 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {STATES.map((st) => (
                  <option key={st} value={st}>
                    {st === "All-India" ? "📍 All-India Schemes" : `📍 ${st}`}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1" /> Sector:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat.id
                    ? "bg-blue-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}

            {(selectedCategory !== "ALL" || selectedState !== "All-India" || searchTerm) && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 ml-auto inline-flex items-center"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Schemes Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <p>
            Showing <strong className="text-slate-900">{schemes.length}</strong> verified schemes
            {selectedCategory !== "ALL" && ` in ${selectedCategory}`}
            {selectedState !== "All-India" && ` for ${selectedState}`}
          </p>
          <span className="text-[11px] text-slate-500 hidden sm:inline-block">
            All schemes are verified against published government notifications.
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-blue-700 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-600">
              Loading verified government schemes...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl text-center space-y-2">
            <p className="font-bold text-sm">Unable to retrieve schemes</p>
            <p className="text-xs">{error}</p>
            <button
              onClick={fetchSchemes}
              className="mt-2 px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && schemes.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Matching Schemes Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any verified schemes matching your criteria. Try adjusting your search query or removing filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition"
            >
              Show All Verified Schemes
            </button>
          </div>
        )}

        {/* Scheme Cards Grid */}
        {!loading && !error && schemes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {schemes.map((scheme) => (
              <div
                key={scheme._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Category & State Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                      {scheme.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {scheme.state}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {scheme.applicationMethod}
                    </span>
                    <span className="ml-auto inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" /> Verified
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                      {scheme.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                      {scheme.shortDescription}
                    </p>
                  </div>

                  {/* Benefit Summary Box */}
                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs">
                    <span className="font-bold text-blue-900 block text-[10px] uppercase tracking-wider mb-0.5">
                      Benefit Overview
                    </span>
                    <p className="text-blue-950 font-medium line-clamp-2 leading-relaxed">
                      {scheme.benefitSummary}
                    </p>
                  </div>

                  {/* Criteria and Docs count pill */}
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                      {scheme.rules?.length || 0} Criteria Rules
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <FileText className="w-3.5 h-3.5 text-slate-500 mr-1" />
                      {scheme.requiredDocuments?.length || 0} Required Docs
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
                  <Link
                    to={`/schemes/${scheme._id}`}
                    className="w-full sm:flex-1 text-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition"
                  >
                    View Scheme Details
                  </Link>

                  {scheme.officialApplicationUrl ? (
                    <a
                      href={scheme.officialApplicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
                      title="Opens authorized government application portal in new tab"
                    >
                      <span>Apply on Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-500" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">
                      Official portal link pending verification
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

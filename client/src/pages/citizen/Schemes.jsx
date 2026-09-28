import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSchemes } from "../../services/schemeApi";
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
  AlertCircle
} from "lucide-react";

const CATEGORIES = [
  { id: "ALL", label: "All Opportunities" },
  { id: "STUDENT", label: "Student & Education", icon: GraduationCap },
  { id: "KISAN", label: "Kisan & Agriculture", icon: Sprout },
  { id: "EMPLOYMENT", label: "Employment & Livelihood", icon: Briefcase },
  { id: "BUSINESS", label: "Business & MSME", icon: Building },
  { id: "GENERAL", label: "General & Welfare", icon: Globe },
];

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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
      setSchemes(res?.data?.schemes || []);
    } catch (err) {
      setError(err.message || "Failed to load government schemes catalog.");
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

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case "STUDENT":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "KISAN":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "EMPLOYMENT":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "BUSINESS":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Verified Database Records Only</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Banner */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wide">
            <span>Official Government Welfare Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Government Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Discover verified state and central schemes with clear eligibility rules and official application portals.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schemes by name, keyword, or benefits..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Search
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-medium">Loading verified government opportunities...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs sm:text-sm flex items-center space-x-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Schemes Grid */}
        {!loading && !error && (
          <>
            {schemes.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No schemes found</h3>
                <p className="text-xs text-slate-500">
                  Try adjusting your search terms or select another category filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {schemes.map((scheme) => (
                  <div
                    key={scheme._id}
                    className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadge(
                            scheme.category
                          )}`}
                        >
                          {scheme.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {scheme.state}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
                        {scheme.name}
                      </h2>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {scheme.shortDescription}
                      </p>

                      <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs space-y-1">
                        <span className="font-bold text-blue-900 block">Key Benefit:</span>
                        <p className="text-blue-800 leading-relaxed">{scheme.benefitSummary}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                        {scheme.sourceName}
                      </span>
                      <Link
                        to={`/dashboard/schemes/${scheme._id}`}
                        className="inline-flex items-center text-xs font-bold text-blue-700 hover:text-blue-800"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

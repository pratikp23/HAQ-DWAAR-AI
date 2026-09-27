import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Sparkles, 
  FileCheck2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  GraduationCap
} from "lucide-react";
import { checkHealth } from "../services/api";

export default function HomePage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await checkHealth();
      setHealthData(response);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message || "Failed to communicate with HaqDwaar backend API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Header / Public-service bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
              ?
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                HaqDwaar <span className="text-blue-700">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                ??? ?????
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <span className="hidden md:inline-flex items-center text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Phase 1 Scaffolding Active
            </span>
            <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
            <button 
              onClick={fetchHealthStatus}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Test API
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold tracking-wide uppercase">
            <span>Scheme se Application Tak</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            A Citizen Benefit Readiness &amp; <br className="hidden sm:inline" />
            <span className="text-blue-700">Navigation Platform</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Discover government welfare schemes based on your real life situation. HaqDwaar provides deterministic eligibility verification, document health diagnostics, and clear application readiness scores.
          </p>
        </section>

        {/* Backend Connectivity Status Card */}
        <section className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-sm sm:text-base">Backend &amp; Database System Status</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">GET /api/health</span>
            </div>

            <div className="p-5 space-y-4">
              {loading && !healthData && (
                <div className="flex items-center justify-center py-6 text-slate-500 text-sm space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Connecting to HaqDwaar backend API...</span>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold">Backend Connection Status</p>
                    <p className="text-red-700 text-xs">{error}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Check that the backend server is running on port 5000.
                    </p>
                  </div>
                </div>
              )}

              {healthData && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold">{healthData.message}</p>
                        <p className="text-xs text-emerald-700">Frontend ? Backend communication verified successfully</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-800">
                      ONLINE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Database (MongoDB)</span>
                      <span className="font-semibold text-slate-800 capitalize flex items-center mt-0.5">
                        <span className={`w-2 h-2 rounded-full mr-1.5 ${healthData.database === "connected" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                        {healthData.database || "Unknown"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Environment</span>
                      <span className="font-semibold text-slate-800 uppercase mt-0.5 block">
                        {healthData.environment || "development"}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                      <span className="text-slate-500 block">Last Check</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">
                        {lastChecked || "Just now"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Core Architectural Pillars</h2>
            <p className="text-xs sm:text-sm text-slate-500">Designed for transparency, determinism, and zero hallucination</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Benefit Passport</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Persistent citizen profile capturing education, income, category, and occupation to map schemes without jargon.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Deterministic Matching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI extracts structured life situation factors; verified database rules evaluate eligibility with clear rationale.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Document Health &amp; Readiness</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                DigiLocker abstraction, PII-masked OCR verification, and actionable readiness checklists before visiting official portals.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Public-Service Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-700">HaqDwaar AI</span> — Scheme se Application Tak
            <p className="mt-0.5 text-slate-500">A citizen assistance and navigation layer. HaqDwaar does not make final government eligibility or approval decisions.</p>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <span>Phase 1 Scaffolding Verified</span>
            <span>•</span>
            <span>Local Monorepo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

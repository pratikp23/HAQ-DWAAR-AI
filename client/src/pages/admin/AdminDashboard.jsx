import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  FileText,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Users,
  FolderCheck,
  Activity,
  Info,
  TrendingUp,
  Clock,
  Sparkles,
  Mic,
  Calendar,
  Filter,
  BarChart2,
  FileCheck,
  AlertCircle
} from "lucide-react";

import {
  getOverview,
  getSchemes,
  getApplications,
  getMatching,
  getReadiness,
  getDocuments,
  getNotifications,
  getVoice,
  getAttention,
  getSystemHealth,
  getActivity,
} from "../../services/adminAnalyticsApi";

import MetricCard from "../../components/admin/MetricCard";
import AttentionPanel from "../../components/admin/AttentionPanel";
import SystemHealthPanel from "../../components/admin/SystemHealthPanel";
import RecentActivity from "../../components/admin/RecentActivity";
import {
  StatusBarChart,
  DistributionPieChart,
} from "../../components/admin/AnalyticsChart";

const RANGE_OPTIONS = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "all", label: "All Time" },
];

export default function AdminDashboard() {
  const [range, setRange] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Analytics states
  const [overview, setOverview] = useState(null);
  const [schemes, setSchemes] = useState(null);
  const [applications, setApplications] = useState(null);
  const [matching, setMatching] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [voice, setVoice] = useState(null);
  const [attention, setAttention] = useState(null);
  const [health, setHealth] = useState(null);
  const [activity, setActivity] = useState(null);

  const fetchDashboardData = useCallback(async (isSilentRefresh = false) => {
    if (isSilentRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [
        overviewRes,
        schemesRes,
        appsRes,
        matchRes,
        readyRes,
        docsRes,
        notifRes,
        voiceRes,
        attRes,
        healthRes,
        actRes,
      ] = await Promise.allSettled([
        getOverview(range),
        getSchemes(),
        getApplications(range),
        getMatching(range),
        getReadiness(range),
        getDocuments(range),
        getNotifications(range),
        getVoice(range),
        getAttention(),
        getSystemHealth(),
        getActivity(10),
      ]);

      if (overviewRes.status === "fulfilled") setOverview(overviewRes.value.data?.data || null);
      if (schemesRes.status === "fulfilled") setSchemes(schemesRes.value.data?.data || null);
      if (appsRes.status === "fulfilled") setApplications(appsRes.value.data?.data || null);
      if (matchRes.status === "fulfilled") setMatching(matchRes.value.data?.data || null);
      if (readyRes.status === "fulfilled") setReadiness(readyRes.value.data?.data || null);
      if (docsRes.status === "fulfilled") setDocuments(docsRes.value.data?.data || null);
      if (notifRes.status === "fulfilled") setNotifications(notifRes.value.data?.data || null);
      if (voiceRes.status === "fulfilled") setVoice(voiceRes.value.data?.data || null);
      if (attRes.status === "fulfilled") setAttention(attRes.value.data?.data || null);
      if (healthRes.status === "fulfilled") setHealth(healthRes.value.data?.data || null);
      if (actRes.status === "fulfilled") setActivity(actRes.value.data?.data || null);
    } catch (err) {
      console.error("Failed to load admin analytics:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load admin analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [range]);

  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  // Chart data formatting
  const applicationStatusData = (applications?.byStatus || []).map((s) => ({
    label: s.label || s.status,
    count: s.count || 0,
  }));

  const schemeCategoryData = (schemes?.byCategory || []).map((c) => ({
    label: c.category,
    count: c.count,
  }));

  const readinessBreakdownData = (readiness?.breakdown || []).map((b) => ({
    label: b.label,
    count: b.count,
  }));

  const documentHealthData = (documents?.healthBreakdown || []).map((d) => ({
    label: d.healthStatus,
    count: d.count,
  }));

  const documentSourceData = (documents?.sourceBreakdown || []).map((d) => ({
    label: d.source === "DIGILOCKER" ? "DigiLocker (Demo)" : "User Upload",
    count: d.count,
  }));

  const matchingOutcomesData = (matching?.outcomes || []).map((o) => ({
    label: o.status,
    count: o.count,
  }));

  const notificationStatusData = (notifications?.byStatus || []).map((n) => ({
    label: n.status,
    count: n.count,
  }));

  const voiceLanguageData = (voice?.byLanguage || []).map((v) => ({
    label: v.language || "Unknown",
    count: v.count,
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto py-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Citizen Portal
            </Link>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1.5 text-indigo-400 font-bold text-xs shrink-0">
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Operations</span>
            </div>
            <span className="text-slate-600">|</span>
            <Link
              to="/admin/schemes"
              className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white shrink-0"
            >
              <Shield className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Scheme Catalog
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              to="/admin/notifications"
              className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white shrink-0"
            >
              <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Notification Analyzer
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shrink-0">
              Admin Console
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Page Banner & Controls */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#591d8f]">
                Phase 13 Platform Operations
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Data Minimization Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Analytics &amp; Platform Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              Operational overview answering: <em>"How is HAQ DWAAR AI being used and where does the platform need attention?"</em> Aggregate statistics with zero PII exposure.
            </p>
          </div>

          {/* Controls: Date Range & Refresh */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRange(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    range === opt.id
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors disabled:opacity-50"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin text-purple-600" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Mandatory Civic Disclaimers */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start space-x-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-bold">
              Mandatory Civic Disclaimers &amp; Operating Boundaries
            </p>
            <p>
              <strong>1. Operational Aggregates:</strong> Analytics are operational aggregates derived strictly from HAQ DWAAR AI platform activity and do not represent government-wide statistics or official census metrics.
            </p>
            <p>
              <strong>2. Citizen Status Tracking:</strong> Citizen-marked application statuses are self-reported platform markers and are not government-confirmed statuses unless an authorized external integration exists.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchDashboardData(false)}
              className="font-bold underline ml-4 hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Section 1: Attention Required Panel */}
        <AttentionPanel items={attention?.items || []} />

        {/* Section 2: Top Overview Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            title="Verified Schemes"
            value={overview?.schemes?.verifiedSchemes ?? 0}
            subtitle={`of ${overview?.schemes?.totalSchemes ?? 0} total schemes`}
            icon={Shield}
            variant="purple"
            badge="Catalog"
          />
          <MetricCard
            title="Pending Circulars"
            value={overview?.notifications?.reviewRequired ?? 0}
            subtitle="awaiting review"
            icon={FileText}
            variant="orange"
            badge="Analyzer"
          />
          <MetricCard
            title="Active Passports"
            value={overview?.users?.passportsCreated ?? 0}
            subtitle="citizen profiles"
            icon={Users}
            variant="blue"
            badge="Civic"
          />
          <MetricCard
            title="In-Progress Apps"
            value={overview?.applications?.inProgress ?? 0}
            subtitle="citizen-marked"
            icon={FolderCheck}
            variant="purple"
            badge="Pipeline"
          />
          <MetricCard
            title="Completed Apps"
            value={overview?.applications?.completed ?? 0}
            subtitle="citizen-marked"
            icon={CheckCircle2}
            variant="emerald"
            badge="Success"
          />
          <MetricCard
            title="Review Due"
            value={schemes?.qualityAttention?.reviewDue ?? 0}
            subtitle="schemes >180 days"
            icon={Clock}
            variant="slate"
            badge="Audit"
          />
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: "all", label: "All Operational Views" },
            { id: "pipeline", label: "Application Pipeline" },
            { id: "schemes", label: "Schemes & Verification" },
            { id: "readiness", label: "Readiness & Vault" },
            { id: "system", label: "System Health & Audit" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? "bg-[#240b49] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section 3: Charts & Operational Drilldowns */}
        {(activeTab === "all" || activeTab === "pipeline") && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-purple-700" />
              <h2 className="text-base font-extrabold text-slate-900">
                Application Pipeline &amp; Demand Analytics
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <StatusBarChart
                title="Citizen Application Tracking by Status (Citizen-marked)"
                data={applicationStatusData}
                xKey="label"
                yKey="count"
                barColor="#240b49"
                emptyMessage="No application tracking records in this period."
              />

              <StatusBarChart
                title="Matching Engine Outcomes"
                data={matchingOutcomesData}
                xKey="label"
                yKey="count"
                barColor="#ea580c"
                emptyMessage="No matching evaluations recorded in this period."
              />
            </div>
          </div>
        )}

        {(activeTab === "all" || activeTab === "schemes") && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-purple-700" />
              <h2 className="text-base font-extrabold text-slate-900">
                Scheme Catalog &amp; Quality Indicators
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <StatusBarChart
                title="Catalog Schemes by Category"
                data={schemeCategoryData}
                xKey="label"
                yKey="count"
                barColor="#591d8f"
                emptyMessage="No scheme category records available."
              />

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base pb-2 border-b border-slate-100">
                    Scheme Gateway &amp; Verification Health
                  </h4>
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Official Gateway</div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">
                        {schemes?.gateways?.withOfficialApplicationUrl ?? 0}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {schemes?.gateways?.withoutOfficialApplicationUrl ?? 0} missing gateway URL
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Official Source</div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">
                        {schemes?.gateways?.withOfficialSourceUrl ?? 0}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {schemes?.gateways?.withoutOfficialSourceUrl ?? 0} missing source URL
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Active Deadlines</div>
                      <div className="text-lg font-black text-slate-900 mt-0.5">
                        {schemes?.deadlines?.withDeadline ?? 0}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {schemes?.deadlines?.withoutDeadline ?? 0} ongoing / no deadline
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-bold text-slate-500 uppercase">Review Due (180d)</div>
                      <div className="text-lg font-black text-amber-600 mt-0.5">
                        {schemes?.qualityAttention?.reviewDue ?? 0}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {schemes?.qualityAttention?.reviewDueLabel || "Review may be due"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Manage catalog entries:</span>
                  <Link
                    to="/admin/schemes"
                    className="font-bold text-[#ea580c] hover:underline inline-flex items-center"
                  >
                    Open Scheme Management →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "all" || activeTab === "readiness") && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-purple-700" />
              <h2 className="text-base font-extrabold text-slate-900">
                Readiness Diagnostics &amp; Document Health
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <DistributionPieChart
                title="Readiness Tiers (Phase 9 Scale)"
                data={readinessBreakdownData}
                emptyMessage="No readiness checks evaluated yet."
              />

              <DistributionPieChart
                title="Document Vault Health Breakdown"
                data={documentHealthData}
                emptyMessage="No documents registered in vault."
              />

              <DistributionPieChart
                title="Document Sources"
                data={documentSourceData}
                colors={["#240b49", "#059669"]}
                emptyMessage="No source data recorded."
              />
            </div>

            {/* Average Readiness summary banner */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Platform Readiness Average
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-slate-900">
                    {readiness?.averageScore ?? 0} / 100
                  </span>
                  <span className="text-xs font-bold text-purple-700">
                    Phase 9 Deterministic Score
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-500 max-w-xl">
                Readiness reflects citizen document completeness and criteria alignment for self-preparation. It does not constitute an eligibility determination or government approval probability.
              </div>
            </div>
          </div>
        )}

        {(activeTab === "all" || activeTab === "pipeline") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <StatusBarChart
              title="Notification Circulars by Review Status"
              data={notificationStatusData}
              barColor="#059669"
              emptyMessage="No notification analysis records."
            />

            <DistributionPieChart
              title="Voice Accessibility Sessions by Language"
              data={voiceLanguageData}
              emptyMessage="No voice sessions recorded in selected period."
            />
          </div>
        )}

        {/* Section 4: System Health Diagnostics */}
        {(activeTab === "all" || activeTab === "system") && (
          <SystemHealthPanel health={health} />
        )}

        {/* Section 5: Recent Administrative Activity Audit Log */}
        {(activeTab === "all" || activeTab === "system") && (
          <RecentActivity activities={activity?.activities || []} />
        )}

        {/* Footer Disclaimers */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400 space-y-1">
          <p>HAQ DWAAR AI — Admin Analytics &amp; Platform Operations (Phase 13)</p>
          <p>
            Zero PII Logging • Strict Privacy Invariant • Non-surveillance Civic Operations
          </p>
        </div>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Layers,
  Users,
  FolderCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  BarChart2,
  FileCheck,
  Server,
  Activity,
  ArrowRightLeft,
  Settings,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import MetricCard from "../MetricCard";
import AttentionPanel from "../AttentionPanel";
import SystemHealthPanel from "../SystemHealthPanel";
import RecentActivity from "../RecentActivity";
import {
  StatusBarChart,
  DistributionPieChart,
} from "../AnalyticsChart";

export default function SuperAdminDashboardView({
  user,
  overview,
  schemes,
  applications,
  matching,
  readiness,
  documents,
  notifications,
  voice,
  attention,
  health,
  activity,
  onRefresh,
  loading,
  refreshing,
}) {
  const [activeTab, setActiveTab] = useState("all");

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
    <div className="space-y-6">
      {/* Super Admin Hero Banner */}
      <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#2b0f4c] text-white p-6 sm:p-7 rounded-3xl border border-purple-900/50 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-xs">
                ⚙️ Platform Super Administrator
              </span>
              <span className="text-purple-300 text-xs font-semibold">
                Central System &amp; Governance Overseer
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Platform Operations &amp; Cross-Ministry Oversight
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed max-w-3xl">
              Welcome, <strong>{user?.name || "Super Admin"}</strong>. Full cross-ministry platform telemetry, AI Matching Engine health, technical succession transfers, and platform vitals are active.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer self-start md:self-auto shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${refreshing ? "animate-spin text-orange-400" : ""}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* Global Administrative Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-purple-800/60">
          <Link
            to="/admin/officers"
            className="p-3 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/15 flex items-center justify-between text-xs transition group"
          >
            <div className="space-y-0.5">
              <div className="font-extrabold text-white flex items-center space-x-1.5">
                <ArrowRightLeft className="w-4 h-4 text-orange-400" />
                <span>1. Officer Succession Console</span>
              </div>
              <div className="text-[11px] text-purple-300">Reassign scheme portfolios on retirement</div>
            </div>
            <span className="text-orange-400 font-black text-sm group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/admin/schemes"
            className="p-3 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/15 flex items-center justify-between text-xs transition group"
          >
            <div className="space-y-0.5">
              <div className="font-extrabold text-white flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-purple-300" />
                <span>2. Cross-Ministry Scheme Catalog</span>
              </div>
              <div className="text-[11px] text-purple-300">All 8+ categories &amp; Gazette audit</div>
            </div>
            <span className="text-orange-400 font-black text-sm group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/admin/grievances"
            className="p-3 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/15 flex items-center justify-between text-xs transition group"
          >
            <div className="space-y-0.5">
              <div className="font-extrabold text-white flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>3. Platform-Wide Fraud Audit</span>
              </div>
              <div className="text-[11px] text-purple-300">Citizen grievances across all ministries</div>
            </div>
            <span className="text-rose-400 font-black text-sm group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* Attention Required Panel */}
      <AttentionPanel items={attention?.items || []} />

      {/* Overview Metric Cards Grid */}
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
          icon={Clock}
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
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#240b49] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Charts & Operational Views */}
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
              Scheme Catalog &amp; Quality Indicators Across All Ministries
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
        </div>
      )}

      {/* System Health Diagnostics */}
      {(activeTab === "all" || activeTab === "system") && (
        <SystemHealthPanel health={health} />
      )}

      {/* Global Administrative Activity Audit Log */}
      {(activeTab === "all" || activeTab === "system") && (
        <RecentActivity activities={activity?.activities || []} />
      )}
    </div>
  );
}

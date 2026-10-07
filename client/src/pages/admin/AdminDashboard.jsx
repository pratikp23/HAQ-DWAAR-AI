import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LayoutContext } from "../../context/LayoutContext";
import {
  LayoutDashboard,
  Shield,
  FileText,
  ArrowLeft,
  Info,
  AlertCircle,
  LogOut,
  RefreshCw,
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

import ChiefOfficerDashboardView from "../../components/admin/dashboards/ChiefOfficerDashboardView";
import DepartmentAdminDashboardView from "../../components/admin/dashboards/DepartmentAdminDashboardView";
import SuperAdminDashboardView from "../../components/admin/dashboards/SuperAdminDashboardView";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { inLayout } = useContext(LayoutContext) || {};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Platform Analytics states
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
        getOverview("all"),
        getSchemes(),
        getApplications("all"),
        getMatching("all"),
        getReadiness("all"),
        getDocuments("all"),
        getNotifications("all"),
        getVoice("all"),
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
  }, []);

  useEffect(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  return (
    <div className="min-h-screen bg-[#f7f5fa] text-[#0f172a] pb-20">
      {/* Admin Top Navigation (only when standalone, outside AdminLayout) */}
      {!inLayout && (
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
                <span>
                  {user?.role === "chief_officer"
                    ? "Chief Officer Console"
                    : user?.role === "category_admin"
                    ? `${user?.department} Desk`
                    : "Super Admin Console"}
                </span>
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
                Gazette Analyzer
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shrink-0">
                {user?.role === "chief_officer"
                  ? "Apex Authority"
                  : user?.role === "category_admin"
                  ? `${user?.department} Admin`
                  : "Super Admin"}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-600/30 border border-rose-400/30 transition-colors shrink-0 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-5">

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchDashboardData(false)}
              className="font-bold underline ml-4 hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* ROLE-SPECIFIC DASHBOARD RENDER */}
        {user?.role === "chief_officer" ? (
          <ChiefOfficerDashboardView
            user={user}
            overview={overview}
            schemesData={schemes}
          />
        ) : user?.role === "category_admin" ? (
          <DepartmentAdminDashboardView
            user={user}
            overview={overview}
            applicationsData={applications}
            readinessData={readiness}
          />
        ) : (
          <SuperAdminDashboardView
            user={user}
            overview={overview}
            schemes={schemes}
            applications={applications}
            matching={matching}
            readiness={readiness}
            documents={documents}
            notifications={notifications}
            voice={voice}
            attention={attention}
            health={health}
            activity={activity}
            onRefresh={() => fetchDashboardData(true)}
            loading={loading}
            refreshing={refreshing}
          />
        )}

        {/* Footer Disclaimers */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400 space-y-1">
          <p>HAQ DWAAR AI — Role-Differentiated Administrative Console</p>
          <p>
            Zero PII Logging • Strict Privacy Invariant • Non-surveillance Civic Operations
          </p>
        </div>
      </main>
    </div>
  );
}

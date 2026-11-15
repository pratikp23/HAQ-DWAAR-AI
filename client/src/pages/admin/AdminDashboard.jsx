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

import SuperAdminDashboardView from "../../components/admin/dashboards/SuperAdminDashboardView";

export default function AdminDashboard() {
  const { user } = useAuth();
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

      const extractData = (res) => {
        if (!res) return null;
        if (res.data?.data) return res.data.data;
        if (res.data) return res.data;
        return res;
      };

      if (overviewRes.status === "fulfilled") setOverview(extractData(overviewRes.value));
      if (schemesRes.status === "fulfilled") setSchemes(extractData(schemesRes.value));
      if (appsRes.status === "fulfilled") setApplications(extractData(appsRes.value));
      if (matchRes.status === "fulfilled") setMatching(extractData(matchRes.value));
      if (readyRes.status === "fulfilled") setReadiness(extractData(readyRes.value));
      if (docsRes.status === "fulfilled") setDocuments(extractData(docsRes.value));
      if (notifRes.status === "fulfilled") setNotifications(extractData(notifRes.value));
      if (voiceRes.status === "fulfilled") setVoice(extractData(voiceRes.value));
      if (attRes.status === "fulfilled") setAttention(extractData(attRes.value));
      if (healthRes.status === "fulfilled") setHealth(extractData(healthRes.value));
      if (actRes.status === "fulfilled") setActivity(extractData(actRes.value));
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

        {/* UNIFIED ADMIN DASHBOARD OVERVIEW */}
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

        {/* Footer Disclaimers */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400 space-y-1">
          <p>Lok Samarth — Consolidated Administrative Operations Console</p>
          <p>
            Zero PII Logging • Strict Privacy Invariant • Non-surveillance Civic Operations
          </p>
        </div>
      </main>
    </div>
  );
}

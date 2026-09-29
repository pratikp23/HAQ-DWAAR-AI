import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useLanguage } from "../../context/LanguageContext";
import {
  getCitizenNotifications,
  markNotificationAsRead,
  dismissNotification,
  markAllNotificationsAsRead,
  triggerAlertCycle,
} from "../../services/notificationApi";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  ExternalLink,
  Check,
  X,
  RefreshCw,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export default function Notifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [filterType, filterStatus]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filterType !== "ALL") params.type = filterType;
      if (filterStatus !== "ALL") params.status = filterStatus;
      const res = await getCitizenNotifications(params);
      setNotifications(res.data?.data?.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "READ", readAt: new Date() } : n))
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await dismissNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Dismiss error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "READ", readAt: new Date() }))
      );
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const handleTriggerCycle = async () => {
    try {
      setTriggering(true);
      await triggerAlertCycle();
      await fetchNotifications();
    } catch (err) {
      console.error("Trigger cycle error:", err);
    } finally {
      setTriggering(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "DEADLINE_TODAY":
      case "DEADLINE_SOON":
      case "DEADLINE_APPROACHING":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "DOCUMENT_EXPIRING":
        return <FileText className="w-5 h-5 text-red-600" />;
      case "READINESS_BLOCKER":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "APPLICATION_FOLLOW_UP":
        return <CheckCircle2 className="w-5 h-5 text-indigo-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* GovTech Hero Banner */}
        <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#2a0e4f] rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-[#591d8f]/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ea580c]/20 border border-[#ea580c]/50 text-xs font-bold text-[#ffedd5]">
                <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
                <span>{t("notificationsTitle", "Citizen Notifications & Alerts")}</span>
                <span>•</span>
                <span>Real-Time Government Monitor</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center">
                <Bell className="w-7 h-7 mr-2.5 text-[#fb923c]" />
                {t("notificationsTitle", "Notification & Alert Center")}
              </h1>
              <p className="text-[#e2e8f0] text-sm font-medium leading-relaxed max-w-xl">
                {t("notificationsSub", "Personalized deadline reminders, document health alerts, and application updates.")}
              </p>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0">
              <button
                onClick={handleTriggerCycle}
                disabled={triggering}
                className="inline-flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm transition-all cursor-pointer"
                title="Re-evaluate proactive alerts against current database state"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${triggering ? "animate-spin" : ""}`} />
                {t("checkAgain", "Refresh Alerts")}
              </button>

              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-md transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Mark All as Read
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: "All Alerts" },
              { id: "DEADLINE_SOON", label: "Deadlines" },
              { id: "DOCUMENT_EXPIRING", label: "Documents" },
              { id: "READINESS_BLOCKER", label: "Blockers" },
              { id: "APPLICATION_FOLLOW_UP", label: "Follow-ups" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  filterType === t.id
                    ? "bg-[#240b49] text-white font-black shadow-md ring-2 ring-[#591d8f]/30"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-2.5 py-1 rounded-md ${
                filterStatus === "ALL" ? "font-bold text-blue-700 underline" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setFilterStatus("UNREAD")}
              className={`px-2.5 py-1 rounded-md ${
                filterStatus === "UNREAD" ? "font-bold text-blue-700 underline" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="mt-12 text-center py-12 bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-3 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Checking your notifications...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="mt-8 text-center py-16 bg-white rounded-2xl border border-slate-200 px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No notifications right now</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              You're all caught up! When scheme application deadlines approach or certificates require attention, alerts will appear here.
            </p>
          </div>
        )}

        {/* Notification Cards */}
        {!loading && notifications.length > 0 && (
          <div className="mt-6 space-y-3">
            {notifications.map((notif) => {
              const isUnread = notif.status === "SENT" || notif.status === "PENDING";
              return (
                <div
                  key={notif._id}
                  className={`rounded-2xl border p-4 sm:p-5 transition flex flex-col sm:flex-row items-start justify-between gap-4 ${
                    isUnread
                      ? "bg-white border-blue-200 shadow-xs"
                      : "bg-slate-50/70 border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 flex-shrink-0 mt-0.5">
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {notif.title}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" title="Unread" />
                        )}
                        {notif.channel === "WHATSAPP" && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 flex items-center">
                            <MessageSquare className="w-2.5 h-2.5 mr-1" />
                            WhatsApp Demo
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {notif.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400">
                        <span>{new Date(notif.sentAt || notif.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        {notif.schemeId?.name && (
                          <span>Scheme: <strong className="text-slate-600">{notif.schemeId.name}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                    {notif.metadata?.actionUrl && (
                      <Link
                        to={notif.metadata.actionUrl}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition"
                      >
                        Take Action
                      </Link>
                    )}

                    {isUnread && (
                      <button
                        onClick={() => handleMarkRead(notif._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDismiss(notif._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-200 transition"
                      title="Dismiss alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

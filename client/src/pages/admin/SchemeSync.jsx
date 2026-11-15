import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Clock,
  Layers,
  ShieldCheck,
  Building2,
  Calendar,
  Eye,
  Sliders,
  Send,
  ArrowRight,
  Database,
  Radio,
  Zap
} from "lucide-react";
import {
  getIngestionQueue,
  triggerLiveSync,
  approveDraft,
  rejectDraft,
  updateDraft,
} from "../../services/schemeSyncApi";

export default function SchemeSync() {
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [successToast, setSuccessToast] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("pending_review");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Inspection & Edit Modal State
  const [activeItem, setActiveItem] = useState(null);
  const [editingDraft, setEditingDraft] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Load Queue Data
  const loadQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getIngestionQueue({
        status: statusFilter,
        source: sourceFilter,
        search: searchQuery,
      });
      const data = res?.data || res;
      if (res?.success || res?.data?.success || data?.items) {
        setItems(data?.items || res?.items || []);
        if (data?.counts || res?.counts) {
          setCounts(data?.counts || res?.counts);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load government scheme ingestion queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [statusFilter, sourceFilter]);

  // Trigger Live Ingestion Sync
  const handleTriggerSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await triggerLiveSync();
      if (res?.success || res?.data?.success) {
        setSuccessToast(res?.message || res?.data?.message || "Government sync completed successfully.");
        await loadQueue();
        setTimeout(() => setSuccessToast(""), 5000);
      }
    } catch (err) {
      setError(err.message || "Failed to trigger live synchronization.");
    } finally {
      setSyncing(false);
    }
  };

  // Open Inspection Drawer
  const handleInspect = (item) => {
    setActiveItem(item);
    setEditingDraft(JSON.parse(JSON.stringify(item.parsedDraft)));
  };

  // Close Inspection Drawer
  const handleCloseInspect = () => {
    setActiveItem(null);
    setEditingDraft(null);
  };

  // 1-Click Approve Draft
  const handleApprove = async (id, draftPayload = null) => {
    setActionLoading(true);
    try {
      const res = await approveDraft(id, draftPayload ? { editedDraft: draftPayload } : {});
      if (res?.success || res?.data?.success) {
        setSuccessToast(res?.message || res?.data?.message || "Scheme approved and published to public directory!");
        handleCloseInspect();
        await loadQueue();
        setTimeout(() => setSuccessToast(""), 5000);
      }
    } catch (err) {
      setError(err.message || "Failed to approve scheme draft.");
    } finally {
      setActionLoading(false);
    }
  };

  // Reject Draft
  const handleConfirmReject = async () => {
    if (!activeItem) return;
    setActionLoading(true);
    try {
      const res = await rejectDraft(activeItem._id, { notes: rejectReason });
      if (res?.success || res?.data?.success) {
        setSuccessToast("Ingestion draft rejected.");
        setRejectModalOpen(false);
        setRejectReason("");
        handleCloseInspect();
        await loadQueue();
        setTimeout(() => setSuccessToast(""), 4000);
      }
    } catch (err) {
      setError(err.message || "Failed to reject draft.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. HEADER & LIVE SYNC TRIGGER                            */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>Automated Government Sync</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              data.gov.in • myScheme • PIB Feeds
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Government Ingestion Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Automated crawler normalizes official gazettes into deterministic schemes with 1-click human verification.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTriggerSync}
          disabled={syncing}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-black bg-gradient-to-r from-[#591d8f] via-[#7c3aed] to-[#ea580c] text-white shadow-md shadow-purple-950/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-75 shrink-0"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Syncing with Government APIs...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Run Live Sync Now</span>
            </>
          )}
        </button>
      </div>

      {/* Success / Error Toasts */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. INGESTION METRICS STRIP                               */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            {counts.pending}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting human sign-off</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Approved & Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {counts.approved}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Published to citizen directory</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {counts.rejected}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Filtered out or duplicates</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-purple-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Ingested</span>
            <Database className="w-4 h-4 text-[#591d8f]" />
          </div>
          <div className="text-2xl font-black text-[#591d8f] mt-2">
            {counts.total}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Total crawled entries</p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FILTERS & SEARCH CONTROLS                             */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold w-full md:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter("pending_review")}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === "pending_review"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending Review ({counts.pending})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("approved")}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === "approved"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Approved ({counts.approved})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("rejected")}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === "rejected"
                ? "bg-white text-rose-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rejected ({counts.rejected})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
        </div>

        {/* Source & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">All Sources</option>
            <option value="data.gov.in">data.gov.in</option>
            <option value="myscheme">myScheme</option>
            <option value="pib">PIB Feed</option>
          </select>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadQueue();
            }}
            className="relative flex-1 md:w-64"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name or ID..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-purple-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. QUEUE LIST TABLE                                      */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#591d8f] mx-auto" />
            <p className="text-xs font-bold">Loading government ingestion records...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Database className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No scheme drafts match your current filter. Click "Run Live Sync Now" to fetch the latest notifications from open portals.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Scheme / Notification</th>
                  <th className="py-3.5 px-4">Source & ID</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items.map((item) => {
                  const draft = item.parsedDraft || {};
                  return (
                    <tr key={item._id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="space-y-1 max-w-md">
                          <h4 className="font-bold text-slate-900 leading-snug">
                            {draft.name || "Untitled Scheme"}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {draft.shortDescription}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-purple-50 text-[#591d8f] border border-purple-200">
                            {item.source}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {item.externalId}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {draft.category || "GENERAL"}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.round((item.confidenceScore || 0.85) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">
                            {Math.round((item.confidenceScore || 0.85) * 100)}%
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.status === "approved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : item.status === "rejected"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-900 border border-amber-200"
                        }`}>
                          {item.status === "approved" ? "APPROVED" : item.status === "rejected" ? "REJECTED" : "PENDING"}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleInspect(item)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-[#591d8f] border border-purple-200 transition cursor-pointer"
                        >
                          Review Draft
                        </button>

                        {item.status === "pending_review" && (
                          <button
                            type="button"
                            onClick={() => handleApprove(item._id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. FULL DRAFT INSPECTION & EDIT MODAL                     */}
      {/* ======================================================== */}
      {activeItem && editingDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] border border-purple-200 shadow-2xl overflow-hidden flex flex-col text-slate-900">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#240b49] via-[#351066] to-[#240b49] p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#ea580c]">
                  Human-in-the-Loop Inspection
                </span>
                <h3 className="font-black text-base sm:text-lg">
                  Verify Ingested Scheme Draft
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseInspect}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Top metadata strip */}
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex flex-wrap items-center justify-between gap-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Source:</span>
                  <span className="font-mono text-[11px] text-[#591d8f]">{activeItem.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">External ID:</span>
                  <span className="font-mono text-[11px] text-slate-800">{activeItem.externalId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Confidence Score:</span>
                  <span className="font-bold text-emerald-700">{Math.round((activeItem.confidenceScore || 0.85) * 100)}%</span>
                </div>
                {activeItem.sourceUrl && (
                  <a
                    href={activeItem.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#591d8f] hover:underline font-bold"
                  >
                    <span>View Gazette</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>

              {/* Form Fields for Editing */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                    Scheme Name
                  </label>
                  <input
                    type="text"
                    value={editingDraft.name || ""}
                    onChange={(e) => setEditingDraft({ ...editingDraft, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-hidden focus:border-[#591d8f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editingDraft.category || "GENERAL"}
                      onChange={(e) => setEditingDraft({ ...editingDraft, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                    >
                      <option value="KISAN">KISAN</option>
                      <option value="STUDENT">STUDENT</option>
                      <option value="EMPLOYMENT">EMPLOYMENT</option>
                      <option value="BUSINESS">BUSINESS</option>
                      <option value="GENERAL">GENERAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                      Target State / Territory
                    </label>
                    <input
                      type="text"
                      value={editingDraft.state || "All-India"}
                      onChange={(e) => setEditingDraft({ ...editingDraft, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                    Short Description (Max 300 characters)
                  </label>
                  <textarea
                    rows={2}
                    value={editingDraft.shortDescription || ""}
                    onChange={(e) => setEditingDraft({ ...editingDraft, shortDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#591d8f]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                    Benefit Summary
                  </label>
                  <input
                    type="text"
                    value={editingDraft.benefitSummary || ""}
                    onChange={(e) => setEditingDraft({ ...editingDraft, benefitSummary: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                    Eligibility Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingDraft.eligibilitySummary || ""}
                    onChange={(e) => setEditingDraft({ ...editingDraft, eligibilitySummary: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900"
                  />
                </div>

                {/* Structured Deterministic Rules */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-700">
                      Deterministic Rules ({editingDraft.rules?.length || 0})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {editingDraft.rules?.map((rule, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900">{rule.label}</span>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {rule.fieldPath} {rule.operator} {JSON.stringify(rule.value)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Documents */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase text-slate-700">
                    Required Documents ({editingDraft.requiredDocuments?.length || 0})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {editingDraft.requiredDocuments?.map((doc, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2 text-[11px]">
                        <FileText className="w-3.5 h-3.5 text-[#591d8f] mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900">{doc.documentType}</span>
                          {doc.guidance && <p className="text-[10px] text-slate-500">{doc.guidance}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Portal URL */}
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                    Official Application URL
                  </label>
                  <input
                    type="url"
                    value={editingDraft.officialApplicationUrl || ""}
                    onChange={(e) => setEditingDraft({ ...editingDraft, officialApplicationUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
              >
                Reject Draft
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseInspect}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(activeItem._id, editingDraft)}
                  disabled={actionLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{actionLoading ? "Publishing..." : "Approve & Publish to Directory"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Sub-Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-rose-200">
            <div className="flex items-center gap-3 text-rose-600">
              <XCircle className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900">Confirm Rejection</h4>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to reject this scheme draft? Please specify the audit reason below:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g., Duplicate of existing scheme, non-statutory notification, or expired..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-rose-400"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                {actionLoading ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

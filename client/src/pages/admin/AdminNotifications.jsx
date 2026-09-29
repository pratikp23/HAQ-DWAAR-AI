import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  uploadNotification,
  getNotifications,
  getNotificationDownloadUrl,
} from "../../services/notificationApi";
import {
  FileText,
  UploadCloud,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Clock,
  Download,
  Eye,
  Layers,
  Sparkles,
  Info,
  LogOut
} from "lucide-react";

export default function AdminNotifications() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications({
        status: statusFilter,
        search: searchTerm,
      });
      setNotifications(res?.data?.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(err.response?.data?.message || err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNotifications();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setError("Please select a valid PDF file. Other file formats are not permitted.");
        setSelectedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds the 5 MB limit. Please upload a smaller PDF.");
        setSelectedFile(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please choose a PDF file to upload.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMsg(null);
    setUploadStep("Uploading notification PDF to secure storage...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploadStep("Extracting text and identifying candidate scheme metadata...");
      const res = await uploadNotification(formData);

      setSuccessMsg("PDF uploaded and parsed successfully. Created unverified record for review.");
      setSelectedFile(null);

      // Auto-navigate to review screen if new notification returned
      const newId = res?.data?.notification?._id;
      if (newId) {
        navigate(`/admin/notifications/${newId}`);
        return;
      }

      await fetchNotifications();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || err.message || "Failed to upload and parse PDF.");
    } finally {
      setUploading(false);
      setUploadStep("");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: "APPROVED",
        };
      case "REJECTED":
        return {
          bg: "bg-rose-100 text-rose-800 border-rose-300",
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: "REJECTED",
        };
      case "REVIEW_REQUIRED":
      default:
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          label: "REVIEW REQUIRED",
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Citizen Portal
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              to="/admin/schemes"
              className="inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white"
            >
              Scheme Catalog
            </Link>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1.5 text-indigo-400">
              <FileText className="w-4 h-4" />
              <span className="font-bold text-xs">Notification Analyzer</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              Admin Console
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-600/30 border border-rose-400/30 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Page Banner */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              Phase 10 Administrative Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Notification Analyzer &amp; Admin Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Upload official public notification PDFs to extract candidate deadlines, scheme details, and eligibility highlights.
            All extracted information remains strictly unverified until an administrator explicitly reviews and approves it.
          </p>

          {/* Strict Civic Boundary Notice */}
          <div className="mt-3 p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              <strong>Strict Trust Boundary:</strong> Extracted data is candidate information only. Approving a record indicates that an administrator verified the extracted values for HAQ DWAAR AI. It does not independently authenticate the government document, nor does it automatically modify verified scheme records.
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold ml-2">×</button>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="font-bold ml-2">×</button>
          </div>
        )}

        {/* ======================================================== */}
        {/* UPLOAD AREA                                              */}
        {/* ======================================================== */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Upload Notification PDF
            </h2>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition bg-slate-50/50">
              <input
                type="file"
                id="pdf-upload-input"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="pdf-upload-input"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-slate-800">
                    {selectedFile ? selectedFile.name : "Click to select a government notification PDF"}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    PDF format only • Maximum file size: 5 MB
                  </p>
                </div>
                {selectedFile && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Selected: {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </label>
            </div>

            {uploading && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center space-x-3 text-xs text-blue-800">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span className="font-medium">{uploadStep}</span>
              </div>
            )}

            <div className="flex justify-end gap-2.5">
              {selectedFile && !uploading && (
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 transition"
                >
                  Clear Selection
                </button>
              )}
              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="inline-flex items-center px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition disabled:opacity-50"
              >
                {uploading ? "Processing PDF..." : "Upload & Analyze Notification →"}
              </button>
            </div>
          </form>
        </div>

        {/* ======================================================== */}
        {/* FILTER & SEARCH BAR                                      */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            {["ALL", "REVIEW_REQUIRED", "APPROVED", "REJECTED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition ${
                  statusFilter === st
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notifications..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-48 sm:w-64"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* ======================================================== */}
        {/* NOTIFICATIONS LIST                                       */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-medium">Loading notification records...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">No Notifications Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No notifications match your current filter. Upload a government notification PDF to begin candidate analysis.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => {
                const badge = getStatusBadge(n.status);

                return (
                  <div
                    key={n._id}
                    className="p-4 sm:p-5 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border space-x-1 ${badge.bg}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>

                        {n.ocrRequired && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            OCR Required
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          Uploaded on {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900">
                        {n.title || n.originalFileName}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        {n.schemeName && (
                          <span>
                            <strong>Scheme:</strong> {n.schemeName}
                          </span>
                        )}
                        {n.issuingOrganization && (
                          <span>
                            <strong>Authority:</strong> {n.issuingOrganization}
                          </span>
                        )}
                        {n.applicationDeadline && (
                          <span className="text-rose-700 font-semibold">
                            <strong>Deadline:</strong> {new Date(n.applicationDeadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400">
                        File: {n.originalFileName} ({(n.fileSize / 1024).toFixed(1)} KB • {n.pageCount} page{n.pageCount > 1 ? "s" : ""})
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={getNotificationDownloadUrl(n._id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        PDF
                      </a>

                      <Link
                        to={`/admin/notifications/${n._id}`}
                        className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-2xs transition"
                      >
                        Review Data
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  User,
  Shield,
  ExternalLink,
  ChevronRight,
  X,
  FileCheck2,
  Building2,
  Calendar,
  Send,
  Download,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";
import {
  getAdminApplicationsQueue,
  reviewAdminApplication,
} from "../../services/applicationApi";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    quickApply: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Selected Packet for Dossier Modal
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [reviewAction, setReviewAction] = useState("APPROVED");
  const [reviewRemarks, setReviewRemarks] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(null);

  const fetchApplications = useCallback(async (isSilent = false) => {
    if (isSilent) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = {};
      if (selectedDepartment !== "ALL") params.department = selectedDepartment;
      if (selectedStatus !== "ALL") params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await getAdminApplicationsQueue(params);
      const payload = res?.data || res;
      if (res?.success || res?.data?.success || payload?.applications) {
        setApplications(payload?.applications || res?.applications || []);
        if (res?.counts || payload?.counts) {
          setCounts(res?.counts || payload?.counts);
        }
      }
    } catch (err) {
      console.error("Failed to load application packets:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load application packets.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDepartment, selectedStatus, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchApplications]);

  // Open Dossier Modal
  const handleOpenDossier = (packet) => {
    setSelectedPacket(packet);
    setReviewAction(packet?.nodalReview?.actionTaken === "APPROVED" ? "APPROVED" : "APPROVED");
    setReviewRemarks(packet?.nodalReview?.remarks || "");
    setReviewSuccessMsg(null);
  };

  // Close Dossier Modal
  const handleCloseDossier = () => {
    setSelectedPacket(null);
    setReviewSuccessMsg(null);
  };

  // Submit Audit Review
  const handleSubmitReview = async () => {
    if (!selectedPacket?._id) return;
    setSubmittingReview(true);
    setReviewSuccessMsg(null);

    try {
      const res = await reviewAdminApplication(selectedPacket._id, {
        actionTaken: reviewAction,
        remarks: reviewRemarks.trim() || `Reviewed and updated by Admin.`,
      });

      if (res?.success || res?.data?.success) {
        setReviewSuccessMsg(`Application status updated to ${reviewAction}!`);
        const updatedApp = res?.data?.application || res?.application || res?.data?.data?.application;
        // Update local list
        setApplications((prev) =>
          prev.map((app) =>
            app._id === selectedPacket._id
              ? {
                  ...app,
                  status:
                    reviewAction === "APPROVED"
                      ? "COMPLETED"
                      : reviewAction === "NEEDS_DOCUMENTS"
                      ? "FOLLOW_UP"
                      : "CANCELLED",
                  nodalReview: updatedApp?.nodalReview || res?.data?.data?.application?.nodalReview || app.nodalReview,
                }
              : app
          )
        );
        setTimeout(() => {
          handleCloseDossier();
        }, 1200);
      }
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified &amp; Ready
          </span>
        );
      case "APPLIED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Audit
          </span>
        );
      case "FOLLOW_UP":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Docs Requested
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#112318] via-[#1a3826] to-[#234731] text-white p-6 sm:p-8 rounded-3xl border border-[#234731]/60 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30">
              <Inbox className="w-3.5 h-3.5 mr-1 text-orange-400" />
              <span>Lok Samarth Central Ingestion &amp; Dispatch Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Citizen Application Packets Desk
            </h1>
            <p className="text-sm text-[#c8ded0] max-w-2xl leading-relaxed">
              Review and audit incoming <strong className="text-white">Quick Apply</strong> citizen dossiers, inspect verified credentials from DigiLocker and the Personal Document Vault, and prepare verified packets for official government submission.
            </p>
          </div>

          <button
            onClick={() => fetchApplications(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition self-start md:self-auto cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${refreshing ? "animate-spin text-orange-400" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh Queue"}</span>
          </button>
        </div>

        {/* High-Level Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-emerald-800/40">
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
            <div className="text-[10px] font-black uppercase text-[#c8ded0] tracking-wider">
              Total Packets
            </div>
            <div className="text-2xl font-black text-white mt-1">{counts.total}</div>
          </div>
          <div className="bg-amber-500/10 rounded-2xl p-3.5 border border-amber-400/20">
            <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
              Pending Audit
            </div>
            <div className="text-2xl font-black text-amber-300 mt-1">{counts.pending}</div>
          </div>
          <div className="bg-orange-500/10 rounded-2xl p-3.5 border border-orange-400/20">
            <div className="text-[10px] font-black uppercase text-orange-300 tracking-wider">
              Quick Apply
            </div>
            <div className="text-2xl font-black text-orange-400 mt-1">{counts.quickApply}</div>
          </div>
          <div className="bg-emerald-500/10 rounded-2xl p-3.5 border border-emerald-400/20">
            <div className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">
              Verified &amp; Ready
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1">{counts.completed}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Reference ID (LOK/2026/...), Citizen Name, or Phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center space-x-2">
          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Sectors</option>
            <option value="KISAN">Agriculture (Kisan)</option>
            <option value="STUDENT">Education (Student)</option>
            <option value="BUSINESS">Enterprise (Business)</option>
            <option value="EMPLOYMENT">Employment</option>
            <option value="HEALTH">Health &amp; Family</option>
            <option value="GENERAL">General Welfare</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPLIED">Pending Audit</option>
            <option value="COMPLETED">Verified &amp; Ready</option>
            <option value="FOLLOW_UP">Docs Requested</option>
            <option value="CANCELLED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Content Area: Table / Cards */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading incoming application packets...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-xs font-bold text-red-800">{error}</p>
          <button
            onClick={() => fetchApplications(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
          >
            Retry Loading
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Application Packets Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no incoming application dossiers matching your current filter criteria.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Tracking Ref / Type</th>
                  <th className="py-3.5 px-4">Applicant &amp; Demographics</th>
                  <th className="py-3.5 px-4">Target Scheme</th>
                  <th className="py-3.5 px-4">Documents</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {applications.map((app) => {
                  const applicant = app.applicantDetails || {};
                  const scheme = app.schemeId || {};
                  const docs = app.documentsAttached || [];
                  const refNo = app.referenceNumber || `LOK/2026/APP/${app._id?.slice(-4)}`;

                  return (
                    <tr key={app._id} className="hover:bg-emerald-50/40 transition">
                      {/* Tracking Reference */}
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-emerald-950">
                        <div className="flex items-center space-x-1.5">
                          <span>{refNo}</span>
                        </div>
                        <div className="mt-1">
                          {app.submissionType === "QUICK_APPLY" ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-200">
                              QUICK APPLY
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                              MANUAL ASSIST
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Applicant Details */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">
                          {applicant.fullName || app.userId?.name || "Anonymous Citizen"}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {applicant.age ? `${applicant.age} yrs • ` : ""}
                          {applicant.category || "General"} • {applicant.state || "All-India"}
                        </div>
                        {applicant.phone && (
                          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                            Phone: {applicant.phone}
                          </div>
                        )}
                      </td>

                      {/* Target Scheme */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800 line-clamp-1">
                          {scheme.name || "Government Scheme"}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium mt-0.5 line-clamp-1">
                          {scheme.benefitSummary || "Welfare Assistance"}
                        </div>
                      </td>

                      {/* Attached Documents */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-semibold text-[11px] text-slate-700">
                          <FileCheck2 className="w-3 h-3 text-emerald-600" />
                          <span>{docs.length} Attached</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => handleOpenDossier(app)}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[#112318] hover:bg-[#234731] text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
                        >
                          <span>View Packet</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DOSSIER INSPECTOR MODAL */}
      {selectedPacket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#112318] to-[#1a3826] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#234731]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-500 text-white">
                    Verified Dossier
                  </span>
                  <span className="font-mono text-xs text-[#c8ded0]">
                    Ref: {selectedPacket.referenceNumber || selectedPacket._id}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {selectedPacket.schemeId?.name || "Scheme Application Packet"}
                </h2>
              </div>
              <button
                onClick={handleCloseDossier}
                className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {reviewSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reviewSuccessMsg}</span>
                </div>
              )}

              {/* SECTION 1: Citizen Profile Snapshot */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-purple-600" />
                  <span>Applicant Demographic Snapshot</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Name</span>
                    <span className="font-bold text-slate-800">
                      {selectedPacket.applicantDetails?.fullName || selectedPacket.userId?.name || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                    <span className="font-mono text-slate-800">
                      {selectedPacket.applicantDetails?.phone || selectedPacket.userId?.phone || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                    <span className="font-bold text-purple-700">
                      {selectedPacket.applicantDetails?.category || "General"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">State / Location</span>
                    <span className="text-slate-800">
                      {selectedPacket.applicantDetails?.state || "All-India"}
                      {selectedPacket.applicantDetails?.district ? ` (${selectedPacket.applicantDetails.district})` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Income</span>
                    <span className="font-bold text-slate-800">
                      {selectedPacket.applicantDetails?.annualIncome != null
                        ? `₹${selectedPacket.applicantDetails.annualIncome.toLocaleString("en-IN")}`
                        : "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Landholding</span>
                    <span className="text-slate-800">
                      {selectedPacket.applicantDetails?.landHolding != null
                        ? `${selectedPacket.applicantDetails.landHolding} Hectares`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Attached Statutory Documents */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Attached Verified Documents ({selectedPacket.documentsAttached?.length || 0})</span>
                </h3>
                {(!selectedPacket.documentsAttached || selectedPacket.documentsAttached.length === 0) ? (
                  <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                    No files attached with this application packet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedPacket.documentsAttached.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800">{doc.documentType}</span>
                            <span className="text-[10px] text-slate-500 block">
                              Source: {doc.verifiedVia || "Vault"} • Status: {doc.status || "VERIFIED"}
                            </span>
                          </div>
                        </div>
                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-bold text-purple-700 hover:underline"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 3: Deterministic Eligibility Proof */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Mathematical Eligibility Snapshot</span>
                </h3>
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">
                      Match Score: {selectedPacket.eligibilitySnapshot?.matchScore || 100}%
                    </span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {selectedPacket.eligibilitySnapshot?.classification || "MATCHED"}
                    </span>
                  </div>
                  {selectedPacket.eligibilitySnapshot?.matchedReasons?.length > 0 && (
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px] pt-1">
                      {selectedPacket.eligibilitySnapshot.matchedReasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* SECTION 4: Future API Bridge Notice */}
              <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl flex items-start space-x-3 text-xs">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-blue-950 flex items-center space-x-2">
                    <span>Direct Ministry API Dispatch Bridge</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-blue-200 text-blue-800">
                      Coming in Phase 3
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    In Phase 3, this packet will be transmitted directly via official ServicePlus and Central Ministry APIs without manual re-typing.
                  </p>
                </div>
              </div>

              {/* SECTION 5: Admin Audit Actions */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Administrative Action &amp; Citizen Response
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewAction("APPROVED")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      reviewAction === "APPROVED"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Mark Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction("NEEDS_DOCUMENTS")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      reviewAction === "NEEDS_DOCUMENTS"
                        ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Request Docs
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewAction("REJECTED")}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition cursor-pointer ${
                      reviewAction === "REJECTED"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Reject
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Official Audit Remarks / Instructions for Citizen
                  </label>
                  <textarea
                    rows={2}
                    value={reviewRemarks}
                    onChange={(e) => setReviewRemarks(e.target.value)}
                    placeholder="Enter review notes or document requirements that will be notified to the citizen..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseDossier}
                disabled={submittingReview}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="px-5 py-2 bg-[#112318] hover:bg-[#234731] text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                {submittingReview ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Action...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Save &amp; Notify Citizen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

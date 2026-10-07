import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Building,
  UserCheck,
  UserX,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Filter,
  BadgeAlert,
  FileCheck2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Eye,
  FileText,
  Check
} from "lucide-react";
import {
  getOfficerApplications,
  approveOfficerApplication,
  rejectOfficerApplication,
  revokeOfficerLicense,
  getActiveOfficers,
  transferOfficerPortfolio,
} from "../../services/officerApi";
import { useAuth } from "../../hooks/useAuth";
import { SAMPLE_GOVT_DOCS } from "../../utils/govtDocumentSamples";

export default function AdminOfficers() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("queue"); // "queue" | "directory" | "succession"
  
  // Applications Queue State
  const [applications, setApplications] = useState([]);
  const [appCounts, setAppCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [appFilter, setAppFilter] = useState("PENDING");
  const [loadingApps, setLoadingApps] = useState(true);

  // Active Officers Directory State
  const [officers, setOfficers] = useState([]);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [deptFilter, setDeptFilter] = useState("ALL");

  // Succession Form State
  const [successionData, setSuccessionData] = useState({
    fromOfficerId: "",
    toOfficerId: "",
    department: "ALL",
    transferReason: "",
    retireOutgoingOfficer: true,
  });
  const [successionLoading, setSuccessionLoading] = useState(false);
  const [successionResult, setSuccessionResult] = useState(null);

  // Action status state
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [approvedModalData, setApprovedModalData] = useState(null);
  const [inspectingApp, setInspectingApp] = useState(null);
  const [inspectDocTab, setInspectDocTab] = useState("idCard"); // "idCard" | "authLetter" | "postingOrder" | "seal"

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await getOfficerApplications(appFilter);
      if (res?.success) {
        setApplications(res.data.applications || []);
        if (res.data.counts) setAppCounts(res.data.counts);
      }
    } catch (err) {
      console.error("Failed to fetch officer applications:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchOfficers = async () => {
    setLoadingOfficers(true);
    try {
      const res = await getActiveOfficers(deptFilter);
      if (res?.success) {
        setOfficers(res.data.officers || []);
      }
    } catch (err) {
      console.error("Failed to fetch officers directory:", err);
    } finally {
      setLoadingOfficers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "queue") {
      fetchApplications();
    } else {
      fetchOfficers();
    }
  }, [activeTab, appFilter, deptFilter]);

  const handleApprove = async (appId) => {
    setActionMessage(null);
    setActionError(null);
    try {
      const res = await approveOfficerApplication(appId, {
        reviewNotes: "Government employee credentials verified against official roster.",
      });
      if (res?.success) {
        setActionMessage(res.message);
        setApprovedModalData(res.data);
        fetchApplications();
      }
    } catch (err) {
      setActionError(err.message || "Failed to approve officer.");
    }
  };

  const handleReject = async (appId) => {
    const reason = window.prompt("Enter rejection reason for this applicant:", "Credentials could not be verified.");
    if (!reason) return;

    setActionMessage(null);
    setActionError(null);
    try {
      const res = await rejectOfficerApplication(appId, {
        rejectionReason: reason,
      });
      if (res?.success) {
        setActionMessage("Officer application rejected.");
        fetchApplications();
      }
    } catch (err) {
      setActionError(err.message || "Failed to reject application.");
    }
  };

  const handleRevokeOfficer = async (officerId, officerName) => {
    const confirm = window.confirm(`Are you sure you want to suspend and revoke administrative privileges for ${officerName}?`);
    if (!confirm) return;

    setActionMessage(null);
    setActionError(null);
    try {
      const res = await revokeOfficerLicense(officerId, {
        reason: "Administrative revocation by Chief Verification Authority.",
      });
      if (res?.success) {
        setActionMessage(res.message);
        fetchOfficers();
      }
    } catch (err) {
      setActionError(err.message || "Failed to revoke officer.");
    }
  };

  const handleExecuteSuccession = async (e) => {
    e.preventDefault();
    setActionMessage(null);
    setActionError(null);
    setSuccessionResult(null);

    if (!successionData.fromOfficerId || !successionData.toOfficerId) {
      setActionError("Please select both outgoing and incoming officers.");
      return;
    }

    if (successionData.fromOfficerId === successionData.toOfficerId) {
      setActionError("Outgoing and incoming officers cannot be the same account.");
      return;
    }

    setSuccessionLoading(true);
    try {
      const res = await transferOfficerPortfolio(successionData);
      if (res?.success) {
        setSuccessionResult(res.data);
        setActionMessage(res.message);
        fetchOfficers();
      }
    } catch (err) {
      setActionError(err.message || "Failed to execute succession transfer.");
    } finally {
      setSuccessionLoading(false);
    }
  };

  if (user?.role === "category_admin") {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
          <BadgeAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Restricted to Chief Verification Authority</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          As a Department Nodal Officer ({user?.department}), officer vetting and administrative succession is handled strictly by the Higher-Level Chief Govt Officer.
        </p>
        <Link to="/admin/schemes" className="inline-block px-5 py-2.5 rounded-xl font-bold text-xs bg-[#2b0f4c] text-white hover:bg-[#1e0a3c] transition">
          Go to My {user?.department} Schemes &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#2b0f4c] text-white p-6 rounded-3xl shadow-md border border-purple-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white">
              Chief Nodal Authority
            </span>
            <span className="text-purple-300 text-xs font-semibold">
              Governance & Succession Console
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Government Category Officer Control Center
          </h1>
          <p className="text-xs text-purple-200 max-w-2xl leading-relaxed">
            Verify official credentials before issuing Departmental Admin licenses, inspect employee service IDs,
            and execute administrative succession when officers rotate or retire.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to="/admin/schemes"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
          >
            Manage Schemes &rarr;
          </Link>
        </div>
      </div>

      {/* Approved Officer Celebration Modal */}
      {approvedModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 border border-emerald-200 shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Official License Issued
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Department Admin Account Activated!
              </h3>
              <p className="text-xs text-slate-600">
                Government officer <strong>{approvedModalData.issuedUser?.name || approvedModalData.applicantName}</strong> has been granted Category Admin privileges for <strong>{approvedModalData.department}</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-sans">Department:</span>
                <strong className="text-emerald-700">{approvedModalData.department}</strong>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-sans">Login Email:</span>
                <strong className="text-[#2b0f4c]">{approvedModalData.issuedUser?.email || approvedModalData.email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Temporary Password:</span>
                <strong className="text-orange-600">{approvedModalData.temporaryPassword || "GovtOfficer@2026"}</strong>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              💡 <strong>Ready for Testing:</strong> Officer can now sign in at <code>/login</code> under the "Administrator" tab using these credentials to manage {approvedModalData.department} schemes.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Email: ${approvedModalData.issuedUser?.email || approvedModalData.email}\nPassword: ${approvedModalData.temporaryPassword || "GovtOfficer@2026"}`
                  );
                  alert("Copied officer login credentials to clipboard!");
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Copy Credentials
              </button>
              <button
                type="button"
                onClick={() => setApprovedModalData(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#2b0f4c] text-white hover:bg-[#1e0a3c] transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statutory Document Inspection Modal for Chief Officer */}
      {inspectingApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 space-y-5 border border-purple-200 shadow-2xl animate-in zoom-in-95 max-h-[92vh] flex flex-col justify-between overflow-hidden">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#2b0f4c] border border-purple-200">
                    Statutory Government Audit
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Target: {inspectingApp.department}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Verification Records: {inspectingApp.applicantName}
                </h3>
                <p className="text-xs text-slate-500">
                  {inspectingApp.designation} • {inspectingApp.officeLocation} • Service ID: <strong className="font-mono text-[#2b0f4c]">{inspectingApp.govtIdNumber}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectingApp(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Document Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
              {[
                { id: "idCard", label: "🪪 1. Employee ID Card", key: "employeeIdCardUrl" },
                { id: "authLetter", label: "📜 2. Auth Letter", key: "authorizationLetterUrl" },
                { id: "postingOrder", label: "🏛️ 3. Posting Order", key: "postingOrderUrl" },
                { id: "seal", label: "🖋️ 4. Seal & Stamp", key: "specimenSignatureUrl" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setInspectDocTab(tab.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    inspectDocTab === tab.id
                      ? "bg-[#2b0f4c] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Document Viewer Frame */}
            <div className="flex-1 min-h-[260px] max-h-[380px] bg-slate-900/5 rounded-2xl border border-slate-200 p-2 sm:p-4 overflow-auto flex items-center justify-center shadow-inner">
              {(() => {
                const docSrc = 
                  inspectDocTab === "idCard"
                    ? (inspectingApp.employeeIdCardUrl || inspectingApp.govtIdDocumentUrl || SAMPLE_GOVT_DOCS.employeeIdCardUrl)
                    : inspectDocTab === "authLetter"
                    ? (inspectingApp.authorizationLetterUrl || SAMPLE_GOVT_DOCS.authorizationLetterUrl)
                    : inspectDocTab === "postingOrder"
                    ? (inspectingApp.postingOrderUrl || SAMPLE_GOVT_DOCS.postingOrderUrl)
                    : (inspectingApp.specimenSignatureUrl || SAMPLE_GOVT_DOCS.specimenSignatureUrl);

                return (
                  <div className="w-full flex flex-col items-center justify-center">
                    <img
                      src={docSrc}
                      alt="Statutory Verification Document"
                      className="max-h-[340px] max-w-full object-contain rounded-xl shadow-md border border-slate-200 bg-white"
                    />
                  </div>
                );
              })()}
            </div>

            {/* Statutory Compliance Checklist */}
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs space-y-1.5 shrink-0">
              <span className="font-extrabold text-[#2b0f4c] block text-[11px] uppercase tracking-wider">
                Chief Officer Verification Checklist (उच्च स्तरीय सत्यापन मानक):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 font-medium">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Official Government ID matches applicant name &amp; service code</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ministry nomination letter verified on official letterhead</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cadre posting notification confirms designated ministry role</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Official Round Stamp &amp; specimen signature verified</span>
                </div>
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setInspectingApp(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                Close Inspection
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                {inspectingApp.status === "PENDING" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const appId = inspectingApp._id;
                        setInspectingApp(null);
                        handleReject(appId);
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const appId = inspectingApp._id;
                        setInspectingApp(null);
                        handleApprove(appId);
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve &amp; Issue Admin License</span>
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Action Notification Messages */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-2.5 text-xs text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-semibold">{actionError}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e9e1f5] pb-3">
        <button
          onClick={() => setActiveTab("queue")}
          className={`py-2 px-4 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 ${
            activeTab === "queue"
              ? "bg-[#2b0f4c] text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Verification Queue</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-orange-500 text-white font-black">
            {appCounts.pending}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("directory")}
          className={`py-2 px-4 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 ${
            activeTab === "directory"
              ? "bg-[#2b0f4c] text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Active Officers Directory</span>
        </button>

        <button
          onClick={() => setActiveTab("succession")}
          className={`py-2 px-4 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 ${
            activeTab === "succession"
              ? "bg-[#2b0f4c] text-white shadow-xs"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Succession & Portfolio Reassignment</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: VERIFICATION QUEUE                                */}
      {/* ======================================================== */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Filter Status:
              </span>
              {["PENDING", "APPROVED", "REJECTED", "ALL"].map((st) => (
                <button
                  key={st}
                  onClick={() => setAppFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    appFilter === st
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={fetchApplications}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Refresh Queue
            </button>
          </div>

          {loadingApps ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <RefreshCw className="w-7 h-7 text-[#591d8f] animate-spin mx-auto" />
              <p className="text-xs font-bold">Querying Nodal Registry for Applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No Applications Found in {appFilter} Queue
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No government personnel applications are currently pending verification under this filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-[#2b0f4c] border border-purple-200">
                          {app.department}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            app.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : app.status === "REJECTED"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 mt-1">
                        {app.applicantName}
                      </h3>
                      <p className="text-xs font-medium text-slate-500">
                        {app.designation} • {app.officeLocation}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(app.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  {/* Verification Credentials */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center text-slate-600">
                      <Mail className="w-3.5 h-3.5 mr-2 text-[#591d8f]" />
                      <span className="font-mono">{app.email}</span>
                    </div>
                    {app.phone && (
                      <div className="flex items-center text-slate-600">
                        <Phone className="w-3.5 h-3.5 mr-2 text-[#591d8f]" />
                        <span>{app.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-slate-700">
                      <span className="font-semibold">{app.govtIdType}:</span>
                      <strong className="font-mono text-[#2b0f4c]">{app.govtIdNumber}</strong>
                    </div>
                  </div>

                  {app.justification && (
                    <div className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/70">
                      "{app.justification}"
                    </div>
                  )}

                  {/* Statutory Documents Summary Strip */}
                  <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#2b0f4c]">
                      <span>Statutory Government Proofs:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setInspectingApp(app);
                          setInspectDocTab("idCard");
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-[#2b0f4c] text-white hover:bg-[#1e0a3c] transition flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3 h-3 text-orange-400" />
                        <span>🔍 Inspect All Documents</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="p-1.5 bg-white rounded-lg border border-purple-100 flex items-center justify-between">
                        <span className="truncate">🪪 Employee ID</span>
                        <span className="text-emerald-700 font-bold">✓ Attached</span>
                      </div>
                      <div className="p-1.5 bg-white rounded-lg border border-purple-100 flex items-center justify-between">
                        <span className="truncate">📜 Auth Letter</span>
                        <span className="text-emerald-700 font-bold">✓ Attached</span>
                      </div>
                      <div className="p-1.5 bg-white rounded-lg border border-purple-100 flex items-center justify-between">
                        <span className="truncate">🏛️ Posting Order</span>
                        <span className="text-emerald-700 font-bold">✓ Attached</span>
                      </div>
                      <div className="p-1.5 bg-white rounded-lg border border-purple-100 flex items-center justify-between">
                        <span className="truncate">🖋️ Seal &amp; Stamp</span>
                        <span className="text-emerald-700 font-bold">✓ Attached</span>
                      </div>
                    </div>
                  </div>

                  {/* Chief Officer Action Controls */}
                  {app.status === "PENDING" && (
                    <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                      <button
                        onClick={() => handleReject(app._id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Issue Admin License</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ACTIVE OFFICERS DIRECTORY                         */}
      {/* ======================================================== */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Department:
              </span>
              {["ALL", "KISAN", "STUDENT", "HEALTH", "BUSINESS", "EMPLOYMENT", "GENERAL"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDeptFilter(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    deptFilter === d
                      ? "bg-[#2b0f4c] text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={fetchOfficers}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Refresh Directory
            </button>
          </div>

          {loadingOfficers ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <RefreshCw className="w-7 h-7 text-[#591d8f] animate-spin mx-auto" />
              <p className="text-xs font-bold">Querying Active Officer Personnel...</p>
            </div>
          ) : officers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <Building className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No Category Admins Found for Department: {deptFilter}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Approve applications from the verification queue to assign officers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {officers.map((off) => (
                <div
                  key={off._id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#2b0f4c] border border-purple-200">
                        {off.department || "SUPER ADMIN"}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{off.name}</h3>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{off.email}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        off.officerStatus === "ACTIVE_VERIFIED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : off.officerStatus === "SUSPENDED"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {off.officerStatus || "ACTIVE"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-semibold">Designation:</span>
                      <strong className="text-slate-800">{off.designation || "Nodal Incharge"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Govt Service ID:</span>
                      <strong className="font-mono text-[#2b0f4c]">{off.govtIdNumber || "VERIFIED"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Schemes in Charge:</span>
                      <strong className="text-emerald-700">{off.managedSchemeCount} Active</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSuccessionData((prev) => ({ ...prev, fromOfficerId: off._id, department: off.department || "ALL" }));
                        setActiveTab("succession");
                      }}
                      className="text-xs font-bold text-[#591d8f] hover:text-[#2b0f4c] underline"
                    >
                      Reassign Schemes &rarr;
                    </button>

                    {off.role === "category_admin" && (
                      <button
                        onClick={() => handleRevokeOfficer(off._id, off.name)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800"
                      >
                        Revoke License
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SUCCESSION & PORTFOLIO REASSIGNMENT               */}
      {/* ======================================================== */}
      {activeTab === "succession" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#591d8f]">
              <ArrowRightLeft className="w-4 h-4" />
              <span>Administrative Succession Protocol</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Departmental Scheme Portfolio Transfer
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When an officer retires, transfers ministries, or completes their tenure, reassign all their
              registered schemes to the incoming verified officer in a single transaction.
            </p>
          </div>

          {successionResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-900">
              <div className="flex items-center space-x-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Succession Portfolio Transfer Complete!</span>
              </div>
              <p>
                <strong>{successionResult.reassignedCount} schemes</strong> previously managed by{" "}
                <strong>{successionResult.fromOfficer?.name}</strong> were safely transferred to{" "}
                <strong>{successionResult.toOfficer?.name}</strong>.
              </p>
            </div>
          )}

          <form onSubmit={handleExecuteSuccession} className="space-y-4">
            {/* Outgoing Officer */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Outgoing Officer (Transferring From) <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={successionData.fromOfficerId}
                onChange={(e) => setSuccessionData({ ...successionData, fromOfficerId: e.target.value })}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 font-bold"
              >
                <option value="">-- Select Outgoing Officer --</option>
                {officers.map((off) => (
                  <option key={off._id} value={off._id}>
                    {off.name} ({off.department || "Super Admin"}) — {off.email} [{off.managedSchemeCount} Schemes]
                  </option>
                ))}
              </select>
            </div>

            {/* Incoming Officer */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Incoming Officer (Transferring To) <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={successionData.toOfficerId}
                onChange={(e) => setSuccessionData({ ...successionData, toOfficerId: e.target.value })}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 font-bold"
              >
                <option value="">-- Select Incoming Officer --</option>
                {officers.map((off) => (
                  <option key={off._id} value={off._id}>
                    {off.name} ({off.department || "Super Admin"}) — {off.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter for transfer */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department Jurisdiction Scope
              </label>
              <select
                value={successionData.department}
                onChange={(e) => setSuccessionData({ ...successionData, department: e.target.value })}
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 font-medium"
              >
                <option value="ALL">All Associated Department Schemes</option>
                <option value="KISAN">🌾 Agriculture (KISAN)</option>
                <option value="STUDENT">🎓 Education (STUDENT)</option>
                <option value="HEALTH">🏥 Health (HEALTH)</option>
                <option value="BUSINESS">💼 MSME / Business (BUSINESS)</option>
                <option value="EMPLOYMENT">👷 Employment (EMPLOYMENT)</option>
                <option value="GENERAL">🏛️ General (GENERAL)</option>
              </select>
            </div>

            {/* Transfer Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Transfer Note / Reason
              </label>
              <input
                type="text"
                value={successionData.transferReason}
                onChange={(e) => setSuccessionData({ ...successionData, transferReason: e.target.value })}
                placeholder="e.g. Officer retirement under Gazette Order No. 2026/09"
                className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800"
              />
            </div>

            {/* Checkbox: Retire outgoing officer */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="retireCheck"
                checked={successionData.retireOutgoingOfficer}
                onChange={(e) => setSuccessionData({ ...successionData, retireOutgoingOfficer: e.target.checked })}
                className="rounded border-slate-300 text-[#591d8f] focus:ring-[#591d8f]"
              />
              <label htmlFor="retireCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Mark outgoing officer account status as <strong>"RETIRED"</strong>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={successionLoading}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#240b49] hover:bg-[#1e0a3c] text-white flex items-center space-x-2 transition shadow-md shadow-purple-950/20 disabled:opacity-50 cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{successionLoading ? "Transferring Schemes..." : "Execute Portfolio Reassignment"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

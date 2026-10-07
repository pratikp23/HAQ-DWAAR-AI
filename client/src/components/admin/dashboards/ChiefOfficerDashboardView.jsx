import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Users,
  Check
} from "lucide-react";
import {
  getOfficerApplications,
  approveOfficerApplication,
  rejectOfficerApplication,
  getActiveOfficers,
} from "../../../services/officerApi";
import { getSchemeReports, resolveSchemeReport } from "../../../services/reportApi";
import { SAMPLE_GOVT_DOCS } from "../../../utils/govtDocumentSamples";

export default function ChiefOfficerDashboardView({ user }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [pendingApps, setPendingApps] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [officers, setOfficers] = useState([]);

  // Inspection Modal State
  const [inspectingApp, setInspectingApp] = useState(null);
  const [inspectDocTab, setInspectDocTab] = useState("idCard");
  const [actionMessage, setActionMessage] = useState(null);

  const fetchData = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const [appsRes, reportsRes, officersRes] = await Promise.allSettled([
        getOfficerApplications("PENDING"),
        getSchemeReports("PENDING_INVESTIGATION"),
        getActiveOfficers("ALL"),
      ]);

      if (appsRes.status === "fulfilled" && appsRes.value?.data?.success) {
        setPendingApps(appsRes.value.data.data.applications || []);
      }
      if (reportsRes.status === "fulfilled" && reportsRes.value?.data?.success) {
        setPendingReports(reportsRes.value.data.data.reports || []);
      }
      if (officersRes.status === "fulfilled" && officersRes.value?.data?.success) {
        setOfficers(officersRes.value.data.data.officers || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (appId) => {
    try {
      const res = await approveOfficerApplication(appId, {
        reviewNotes: "Government employee credentials verified against official roster.",
      });
      if (res?.data?.success) {
        setActionMessage("Officer approved! Department Admin account created.");
        fetchData(true);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to approve officer.");
    }
  };

  const handleReject = async (appId) => {
    const reason = window.prompt("Enter rejection reason:", "Government credentials could not be verified.");
    if (!reason) return;
    try {
      const res = await rejectOfficerApplication(appId, { rejectionReason: reason });
      if (res?.data?.success) {
        setActionMessage("Officer application rejected.");
        fetchData(true);
      }
    } catch (err) {
      alert("Failed to reject application.");
    }
  };

  const handleResolveGrievance = async (reportId, action) => {
    const notes = window.prompt(
      `Enter notes for action (${action}):`,
      action === "DELIST_SCHEME" ? "Confirmed fake scheme. Delisted." : "Verified authentic."
    );
    if (!notes) return;
    try {
      const res = await resolveSchemeReport(reportId, { action, investigationNotes: notes });
      if (res?.data?.success) {
        setActionMessage("Report resolved successfully.");
        fetchData(true);
      }
    } catch (err) {
      alert("Failed to resolve report.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Toast */}
      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <span className="font-semibold">{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="font-bold underline ml-3">
            Dismiss
          </button>
        </div>
      )}

      {/* Clean Welcome Banner */}
      <div className="bg-[#240b49] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-orange-500 text-white">
            Chief Officer Desk
          </span>
          <h1 className="text-xl font-black text-white mt-1">
            Welcome, {user?.name || "Chief Officer"}
          </h1>
          <p className="text-xs text-purple-200">
            Verify new department officers and monitor fake scheme complaints.
          </p>
        </div>

        <button
          onClick={() => fetchData(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 3 Simple Point-to-Point Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Pending Officers</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{pendingApps.length}</div>
            <div className="text-[10px] text-orange-600 font-semibold mt-0.5">Need Your Approval</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Active Officers</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{officers.length}</div>
            <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Approved Department Admins</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Fake Scheme Reports</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{pendingReports.length}</div>
            <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Citizen Complaints</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Box 1: Officer Verification Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-black text-slate-900">
              1. Officer Approval Requests ({pendingApps.length})
            </h2>
            <p className="text-xs text-slate-500">
              Department officers who registered and want category admin access.
            </p>
          </div>
          <Link to="/admin/officers" className="text-xs font-bold text-orange-600 hover:underline">
            View All →
          </Link>
        </div>

        {pendingApps.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
            No pending officer requests right now. All clear!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingApps.map((app) => (
              <div key={app._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-xs">{app.applicantName}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 text-purple-800">
                      {app.department}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {app.designation} • {app.email} • ID: {app.govtIdNumber}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setInspectingApp(app);
                      setInspectDocTab("idCard");
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 flex items-center cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    <span>View Docs</span>
                  </button>

                  <button
                    onClick={() => handleApprove(app._id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleReject(app._id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Box 2: Fake Scheme Reports from Citizens */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-black text-slate-900">
              2. Citizen Complaints on Schemes ({pendingReports.length})
            </h2>
            <p className="text-xs text-slate-500">
              Complaints regarding fake links, inaccurate details, or suspicious schemes.
            </p>
          </div>
          <Link to="/admin/grievances" className="text-xs font-bold text-rose-600 hover:underline">
            View All →
          </Link>
        </div>

        {pendingReports.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
            No complaints reported by citizens right now.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingReports.map((report) => (
              <div key={report._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-xs">{report.schemeName}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                      {report.reason}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    "{report.description}" — By: {report.reporterName}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolveGrievance(report._id, "DELIST_SCHEME")}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                  >
                    Freeze Scheme
                  </button>
                  <button
                    onClick={() => handleResolveGrievance(report._id, "VERIFIED_VALID")}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    Keep Valid
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simple Document Viewer Modal */}
      {inspectingApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-black text-sm text-slate-900">
                Documents of {inspectingApp.applicantName} ({inspectingApp.department})
              </h3>
              <button
                onClick={() => setInspectingApp(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Doc Tabs */}
            <div className="flex space-x-1 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
              {[
                { id: "idCard", label: "ID Card" },
                { id: "authLetter", label: "Nomination Letter" },
                { id: "postingOrder", label: "Posting Order" },
                { id: "seal", label: "Signature & Stamp" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setInspectDocTab(t.id)}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                    inspectDocTab === t.id
                      ? "bg-purple-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Document Image */}
            <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-center min-h-[220px]">
              <img
                src={
                  inspectDocTab === "authLetter"
                    ? inspectingApp.authorizationLetterUrl || SAMPLE_GOVT_DOCS.authorizationLetterUrl
                    : inspectDocTab === "postingOrder"
                    ? inspectingApp.postingOrderUrl || SAMPLE_GOVT_DOCS.postingOrderUrl
                    : inspectDocTab === "seal"
                    ? inspectingApp.specimenSignatureUrl || SAMPLE_GOVT_DOCS.specimenSignatureUrl
                    : inspectingApp.employeeIdCardUrl || SAMPLE_GOVT_DOCS.employeeIdCardUrl
                }
                alt="Document Proof"
                className="max-h-[240px] max-w-full rounded object-contain bg-white shadow-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setInspectingApp(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApprove(inspectingApp._id);
                  setInspectingApp(null);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Approve Officer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

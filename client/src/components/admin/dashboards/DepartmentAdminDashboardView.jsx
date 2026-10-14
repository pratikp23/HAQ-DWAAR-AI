import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  RefreshCw,
  Inbox,
  UserCheck,
  ShieldCheck,
  FileCheck2,
  Clock,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Send,
  Eye
} from "lucide-react";
import { getSchemes } from "../../../services/schemeApi";
import { getSchemeReports, resolveSchemeReport } from "../../../services/reportApi";
import { getDepartmentQueue, reviewDepartmentApplication } from "../../../services/applicationApi";

export default function DepartmentAdminDashboardView({ user }) {
  const department = user?.department || "General";
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState("applications"); // "applications" | "schemes" | "complaints"
  const [deptApplications, setDeptApplications] = useState([]);
  const [deptSchemes, setDeptSchemes] = useState([]);
  const [deptReports, setDeptReports] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);
  const [reviewActionLoading, setReviewActionLoading] = useState(false);

  const fetchDeptData = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const [schemesRes, reportsRes, appsRes] = await Promise.allSettled([
        getSchemes({ category: department }),
        getSchemeReports("ALL"),
        getDepartmentQueue({ department }),
      ]);

      if (schemesRes.status === "fulfilled" && schemesRes.value?.data?.success) {
        setDeptSchemes(schemesRes.value.data.data.schemes || schemesRes.value.data.data || []);
      }
      if (reportsRes.status === "fulfilled" && reportsRes.value?.data?.success) {
        setDeptReports(reportsRes.value.data.data.reports || []);
      }
      if (appsRes.status === "fulfilled" && appsRes.value?.data?.success) {
        setDeptApplications(appsRes.value.data.data.applications || []);
      }
    } catch (err) {
      console.error("Failed to load department data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeptData();
  }, [department]);

  const handleResolveReport = async (reportId) => {
    const notes = window.prompt("Enter update notes (e.g., portal link updated):", "Scheme verified and updated.");
    if (!notes) return;

    try {
      const res = await resolveSchemeReport(reportId, {
        action: "SCHEME_UPDATED",
        investigationNotes: notes,
      });
      if (res?.data?.success) {
        setActionMessage("Complaint resolved and scheme updated!");
        fetchDeptData(true);
      }
    } catch (err) {
      alert("Failed to resolve complaint.");
    }
  };

  const handleReviewAction = async (appId, actionTaken) => {
    const defaultRemark =
      actionTaken === "APPROVED"
        ? "Eligibility criteria and statutory document proofs verified by Nodal Officer. Direct benefit transfer approved."
        : actionTaken === "NEEDS_DOCUMENTS"
        ? "Please upload an updated Income Certificate / Land Khasra in your Document Vault."
        : "Applicant does not satisfy category / income statutory threshold.";

    const remarks = window.prompt(
      actionTaken === "APPROVED"
        ? "Enter approval / sanction remarks:"
        : actionTaken === "NEEDS_DOCUMENTS"
        ? "What documents or clarifications are required from the citizen?"
        : "Enter reason for rejection:",
      defaultRemark
    );
    if (remarks === null) return;

    setReviewActionLoading(true);
    try {
      const res = await reviewDepartmentApplication(appId, {
        actionTaken,
        remarks,
      });
      if (res?.data?.success) {
        setActionMessage(`Application marked as ${actionTaken} successfully!`);
        fetchDeptData(true);
      }
    } catch (err) {
      alert(err.message || "Failed to process application review.");
    } finally {
      setReviewActionLoading(false);
    }
  };

  const verifiedCount = deptSchemes.filter((s) => s.verificationStatus === "VERIFIED").length;
  const pendingReportsCount = deptReports.filter((r) => r.status === "PENDING_INVESTIGATION").length;
  const pendingAppsCount = deptApplications.filter((a) => a.status === "APPLIED").length;

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
          <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white">
            Ministry of {department} • Nodal Desk
          </span>
          <h1 className="text-xl font-black text-white mt-1">
            Welcome, {user?.name || "Department Officer"}
          </h1>
          <p className="text-xs text-purple-200">
            Review incoming citizen applications, audit scheme eligibility, and dispatch statutory benefits for {department}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/admin/schemes"
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-orange-700 text-white cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>+ Add Scheme</span>
          </Link>

          <button
            onClick={() => fetchDeptData(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Point-to-Point Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Citizen Applications Queue */}
        <div 
          onClick={() => setActiveTab("applications")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition ${
            activeTab === "applications" ? "border-purple-600 ring-2 ring-purple-100 shadow-sm" : "border-slate-200 shadow-xs hover:border-purple-300"
          } flex items-center justify-between`}
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Citizen Queue</div>
            <div className="text-2xl font-black text-purple-900 mt-0.5">{deptApplications.length}</div>
            <div className="text-[10px] text-amber-700 font-bold mt-0.5">{pendingAppsCount} Under Review</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Schemes */}
        <div 
          onClick={() => setActiveTab("schemes")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition ${
            activeTab === "schemes" ? "border-purple-600 ring-2 ring-purple-100 shadow-sm" : "border-slate-200 shadow-xs hover:border-purple-300"
          } flex items-center justify-between`}
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Ministry Schemes</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{deptSchemes.length}</div>
            <div className="text-[10px] text-purple-600 font-semibold mt-0.5">{department} Portfolio</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Active for Citizens */}
        <div 
          onClick={() => setActiveTab("schemes")}
          className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between cursor-pointer"
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Published Live</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{verifiedCount}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Live on Citizen Portal</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Citizen Complaints */}
        <div 
          onClick={() => setActiveTab("complaints")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition ${
            activeTab === "complaints" ? "border-purple-600 ring-2 ring-purple-100 shadow-sm" : "border-slate-200 shadow-xs hover:border-purple-300"
          } flex items-center justify-between`}
        >
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Grievances</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{pendingReportsCount}</div>
            <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Need Attention</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Segmented Tab Navigation */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-4">
        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "applications"
              ? "border-[#591d8f] text-[#591d8f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>📥 Applications Queue ({deptApplications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("schemes")}
          className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "schemes"
              ? "border-[#591d8f] text-[#591d8f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>🏛️ Ministry Schemes ({deptSchemes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("complaints")}
          className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === "complaints"
              ? "border-[#591d8f] text-[#591d8f]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>⚠️ Citizen Grievances ({deptReports.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: CITIZEN APPLICATIONS QUEUE (Quick Apply Pipeline) */}
      {/* ======================================================== */}
      {activeTab === "applications" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>Incoming Citizen Applications Queue</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-900 font-bold">
                  {deptApplications.length} Submissions
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Applications transmitted via Quick Apply by verified citizens under Ministry of {department}.
              </p>
            </div>

            <div className="text-[11px] text-slate-500">
              Auto-assigned to: <strong>{user?.name || "Nodal Desk"}</strong>
            </div>
          </div>

          {deptApplications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-400" />
              <p className="font-semibold text-slate-700">No applications received yet in this queue.</p>
              <p className="text-slate-400">
                When citizens click "⚡ Quick Apply to Nodal Queue" on any {department} scheme, their full Benefit Passport and documents will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deptApplications.map((app) => {
                const schemeName = app.schemeId?.name || "Government Welfare Scheme";
                const applicantName = app.applicantDetails?.fullName || app.userId?.name || "Citizen Beneficiary";
                const applicantEmail = app.applicantDetails?.email || app.userId?.email || "citizen@gov.in";
                const applicantCategory = app.applicantDetails?.category || "OBC";
                const applicantState = app.applicantDetails?.state || "Madhya Pradesh";
                const applicantIncome = app.applicantDetails?.annualIncome;
                const matchScore = app.eligibilitySnapshot?.matchScore || 94;
                const docsCount = app.documentsAttached?.length || 2;
                const isUnderReview = app.status === "APPLIED" || app.nodalReview?.actionTaken === "PENDING";
                const isApproved = app.status === "COMPLETED" || app.nodalReview?.actionTaken === "APPROVED";

                return (
                  <div
                    key={app._id}
                    className="p-4 rounded-2xl border border-slate-200 bg-[#fbf9fe]/40 hover:bg-white hover:border-purple-300 transition shadow-2xs space-y-3"
                  >
                    {/* Header Strip */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#591d8f] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {app.referenceNumber || `HAQ/2026/${department}/9421`}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-bold text-slate-800">{schemeName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isApproved ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Sanctioned / Approved</span>
                          </span>
                        ) : isUnderReview ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Under Nodal Review</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {app.status}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("en-IN") : "Today"}
                        </span>
                      </div>
                    </div>

                    {/* Applicant Passport Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Applicant</span>
                        <strong className="text-slate-800">{applicantName}</strong>
                        <div className="text-[10px] text-slate-400 truncate">{applicantEmail}</div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Category & Domicile</span>
                        <span className="font-bold text-slate-800">{applicantCategory}</span>
                        <div className="text-[10px] text-slate-500">{applicantState}</div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Annual Income</span>
                        <span className="font-bold text-slate-800">
                          {applicantIncome ? `₹${applicantIncome.toLocaleString('en-IN')}` : "₹1,80,000"}
                        </span>
                        <div className="text-[10px] text-emerald-600 font-semibold">Eligible Threshold</div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Criteria Match</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-200">
                            {matchScore}% Match
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">
                            {docsCount} Proofs
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Officer Action Panel */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                      <div className="text-[11px] text-slate-500">
                        {app.nodalReview?.remarks ? (
                          <span><strong>Officer Remark:</strong> {app.nodalReview.remarks}</span>
                        ) : (
                          <span>Awaiting statutory nodal action</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleReviewAction(app._id, "APPROVED")}
                          disabled={reviewActionLoading || isApproved}
                          className="px-3 py-1.5 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-40"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Approve &amp; Sanction</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReviewAction(app._id, "NEEDS_DOCUMENTS")}
                          disabled={reviewActionLoading}
                          className="px-2.5 py-1.5 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer"
                        >
                          <span>Request Docs</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReviewAction(app._id, "REJECTED")}
                          disabled={reviewActionLoading}
                          className="px-2.5 py-1.5 rounded-xl font-bold text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
                        >
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MY DEPARTMENT SCHEMES TABLE                       */}
      {/* ======================================================== */}
      {activeTab === "schemes" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                My {department} Schemes ({deptSchemes.length})
              </h2>
              <p className="text-xs text-slate-500">
                Schemes added and managed by you under the Ministry of {department}.
              </p>
            </div>
            <Link to="/admin/schemes" className="text-xs font-bold text-orange-600 hover:underline">
              Manage All →
            </Link>
          </div>

          {deptSchemes.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl space-y-2">
              <p>No schemes added yet for {department}.</p>
              <Link
                to="/admin/schemes"
                className="inline-block px-3 py-1.5 rounded-lg text-xs font-bold bg-[#240b49] text-white"
              >
                + Add First Scheme
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Scheme Name</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Official Portal</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deptSchemes.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {s.briefDescription || "Government Welfare Scheme"}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.verificationStatus === "VERIFIED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {s.verificationStatus || "VERIFIED"}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {s.officialApplicationUrl ? (
                          <a
                            href={s.officialApplicationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-orange-600 hover:underline inline-flex items-center text-[11px] font-semibold"
                          >
                            <span>Portal Link</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not provided</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to="/admin/schemes"
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CITIZEN GRIEVANCES & COMPLAINTS                   */}
      {/* ======================================================== */}
      {activeTab === "complaints" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Citizen Complaints &amp; Feedback ({deptReports.length})
              </h2>
              <p className="text-xs text-slate-500">
                Feedback from citizens regarding broken links or incorrect criteria on your schemes.
              </p>
            </div>
            <Link to="/admin/grievances" className="text-xs font-bold text-rose-600 hover:underline">
              View All →
            </Link>
          </div>

          {deptReports.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
              No citizen complaints on {department} schemes. Everything is smooth!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {deptReports.map((report) => (
                <div key={report._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{report.schemeName}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        {report.reason}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      "{report.description}" — Citizen: {report.reporterName}
                    </div>
                  </div>

                  {report.status === "PENDING_INVESTIGATION" && (
                    <button
                      onClick={() => handleResolveReport(report._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#240b49] text-white hover:bg-purple-950 cursor-pointer self-start sm:self-auto"
                    >
                      Fix &amp; Resolve
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

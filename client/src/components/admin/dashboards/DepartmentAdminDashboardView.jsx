import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { getSchemes } from "../../../services/schemeApi";
import { getSchemeReports, resolveSchemeReport } from "../../../services/reportApi";

export default function DepartmentAdminDashboardView({ user }) {
  const department = user?.department || "General";
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [deptSchemes, setDeptSchemes] = useState([]);
  const [deptReports, setDeptReports] = useState([]);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchDeptData = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const [schemesRes, reportsRes] = await Promise.allSettled([
        getSchemes({ category: department }),
        getSchemeReports("ALL"),
      ]);

      if (schemesRes.status === "fulfilled" && schemesRes.value?.data?.success) {
        setDeptSchemes(schemesRes.value.data.data.schemes || schemesRes.value.data.data || []);
      }
      if (reportsRes.status === "fulfilled" && reportsRes.value?.data?.success) {
        setDeptReports(reportsRes.value.data.data.reports || []);
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

  const verifiedCount = deptSchemes.filter((s) => s.verificationStatus === "VERIFIED").length;
  const pendingReportsCount = deptReports.filter((r) => r.status === "PENDING_INVESTIGATION").length;

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
            Ministry of {department}
          </span>
          <h1 className="text-xl font-black text-white mt-1">
            Welcome, {user?.name || "Department Officer"}
          </h1>
          <p className="text-xs text-purple-200">
            Manage official government schemes and handle citizen complaints for {department}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/admin/schemes"
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-orange-700 text-white cursor-pointer"
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

      {/* 3 Simple Point-to-Point Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Total Schemes</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{deptSchemes.length}</div>
            <div className="text-[10px] text-purple-600 font-semibold mt-0.5">In {department} Category</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Active for Citizens</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{verifiedCount}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Live on Citizen Portal</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Citizen Complaints</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{pendingReportsCount}</div>
            <div className="text-[10px] text-rose-600 font-semibold mt-0.5">Need Your Attention</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Box 1: My Department Schemes Table */}
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

      {/* Box 2: Citizen Complaints on My Schemes */}
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
    </div>
  );
}

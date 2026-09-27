import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  getSchemes, 
  createScheme, 
  verifyScheme, 
  archiveScheme 
} from "../../services/schemeApi";
import { 
  Shield, 
  Plus, 
  CheckCircle2, 
  Archive, 
  RefreshCw, 
  ArrowLeft, 
  AlertCircle,
  ExternalLink,
  Layers
} from "lucide-react";

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // New Scheme Form Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    category: "STUDENT",
    state: "All-India",
    benefitSummary: "",
    eligibilitySummary: "",
    officialSourceUrl: "",
    sourceName: "",
    sourceType: "CENTRAL_GOVERNMENT",
  });

  const fetchAdminSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSchemes({ status: statusFilter });
      setSchemes(res?.data?.schemes || []);
    } catch (err) {
      setError(err.message || "Failed to load admin schemes list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSchemes();
  }, [statusFilter]);

  const handleVerify = async (id) => {
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await verifyScheme(id);
      setSuccessMsg(res.message || "Scheme verified and published successfully.");
      await fetchAdminSchemes();
    } catch (err) {
      setError(err.message || "Failed to verify scheme.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Are you sure you want to archive this scheme? It will no longer be visible to citizens.")) {
      return;
    }
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await archiveScheme(id);
      setSuccessMsg(res.message || "Scheme archived successfully.");
      await fetchAdminSchemes();
    } catch (err) {
      setError(err.message || "Failed to archive scheme.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await createScheme(formData);
      setSuccessMsg("Scheme created as DRAFT. Review and click 'Verify' to publish to citizens.");
      setShowAddModal(false);
      setFormData({
        name: "",
        shortDescription: "",
        category: "STUDENT",
        state: "All-India",
        benefitSummary: "",
        eligibilitySummary: "",
        officialSourceUrl: "",
        sourceName: "",
        sourceType: "CENTRAL_GOVERNMENT",
      });
      await fetchAdminSchemes();
    } catch (err) {
      setError(err.message || "Failed to create scheme.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "VERIFIED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "DRAFT":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "PENDING_REVIEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ARCHIVED":
        return "bg-slate-200 text-slate-700 border-slate-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
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
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm tracking-tight">Admin Scheme Management</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Scheme
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Page Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Scheme Verification &amp; Catalog Control
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Only verified records are accessible to citizens. DRAFT and ARCHIVED schemes are quarantined.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs shadow-sm">
            {["ALL", "VERIFIED", "DRAFT", "ARCHIVED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  statusFilter === st
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs sm:text-sm flex items-center space-x-2.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs sm:text-sm flex items-center space-x-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-sm font-medium">Loading administrative scheme catalog...</p>
          </div>
        )}

        {/* Schemes Table */}
        {!loading && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Scheme Name</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Authority</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schemes.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-slate-500 text-[11px] line-clamp-1">{s.shortDescription}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-slate-700">{s.category}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-slate-600 truncate max-w-[180px] block">{s.sourceName}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] border ${getStatusBadge(s.verificationStatus)}`}>
                          {s.verificationStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {s.verificationStatus !== "VERIFIED" && (
                          <button
                            onClick={() => handleVerify(s._id)}
                            disabled={actionLoading}
                            className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Verify &amp; Publish
                          </button>
                        )}
                        {s.verificationStatus !== "ARCHIVED" && (
                          <button
                            onClick={() => handleArchive(s._id)}
                            disabled={actionLoading}
                            className="inline-flex items-center px-2 py-1 rounded bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-300 font-semibold text-[11px] transition-colors"
                          >
                            <Archive className="w-3.5 h-3.5 mr-1" />
                            Archive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Add Scheme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add New Government Scheme</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Official Scheme Title"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence summary of benefit and purpose"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="KISAN">KISAN</option>
                    <option value="EMPLOYMENT">EMPLOYMENT</option>
                    <option value="BUSINESS">BUSINESS</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State / Scope</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="All-India or State name"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Benefit Summary *</label>
                <textarea
                  required
                  rows="2"
                  value={formData.benefitSummary}
                  onChange={(e) => setFormData({ ...formData, benefitSummary: e.target.value })}
                  placeholder="Specific financial or in-kind assistance provided"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Eligibility Summary *</label>
                <textarea
                  required
                  rows="2"
                  value={formData.eligibilitySummary}
                  onChange={(e) => setFormData({ ...formData, eligibilitySummary: e.target.value })}
                  placeholder="Who qualifies for this scheme"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Authority *</label>
                  <input
                    type="text"
                    required
                    value={formData.sourceName}
                    onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                    placeholder="e.g. Ministry of Education"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Type *</label>
                  <select
                    value={formData.sourceType}
                    onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="CENTRAL_GOVERNMENT">CENTRAL_GOVERNMENT</option>
                    <option value="STATE_GOVERNMENT">STATE_GOVERNMENT</option>
                    <option value="OFFICIAL_PORTAL">OFFICIAL_PORTAL</option>
                    <option value="OTHER_OFFICIAL">OTHER_OFFICIAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Source URL *</label>
                <input
                  type="url"
                  required
                  value={formData.officialSourceUrl}
                  onChange={(e) => setFormData({ ...formData, officialSourceUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold"
                >
                  {actionLoading ? "Creating..." : "Create Draft Scheme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

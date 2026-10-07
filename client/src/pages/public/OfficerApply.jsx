import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
  UserCheck,
  BadgeCheck,
  FileText,
  Sparkles
} from "lucide-react";
import { applyOfficerLicense } from "../../services/officerApi";
import { SAMPLE_GOVT_DOCS } from "../../utils/govtDocumentSamples";

export default function OfficerApply() {
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    department: "KISAN",
    designation: "",
    officeLocation: "",
    govtIdType: "EMPLOYEE_ID",
    govtIdNumber: "",
    justification: "",
    employeeIdCardUrl: SAMPLE_GOVT_DOCS.employeeIdCardUrl,
    authorizationLetterUrl: SAMPLE_GOVT_DOCS.authorizationLetterUrl,
    postingOrderUrl: SAMPLE_GOVT_DOCS.postingOrderUrl,
    specimenSignatureUrl: SAMPLE_GOVT_DOCS.specimenSignatureUrl,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAutoAttachSampleDocs = () => {
    setFormData((prev) => ({
      ...prev,
      employeeIdCardUrl: SAMPLE_GOVT_DOCS.employeeIdCardUrl,
      authorizationLetterUrl: SAMPLE_GOVT_DOCS.authorizationLetterUrl,
      postingOrderUrl: SAMPLE_GOVT_DOCS.postingOrderUrl,
      specimenSignatureUrl: SAMPLE_GOVT_DOCS.specimenSignatureUrl,
    }));
  };

  const handleFileUpload = (docKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [docKey]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.applicantName ||
      !formData.email ||
      !formData.department ||
      !formData.designation ||
      !formData.officeLocation ||
      !formData.govtIdNumber
    ) {
      setError("Please fill out all mandatory government identification fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await applyOfficerLicense(formData);
      if (res?.success) {
        setSubmittedApp(res.data);
      } else {
        setError(res?.message || "Application submission failed.");
      }
    } catch (err) {
      console.error("Error submitting officer application:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Could not transmit credentials to Chief Nodal Verification Authority."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f7f5fa] min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-[#2b0f4c] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Return to Login</span>
          </Link>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-[#2b0f4c] border border-purple-200">
            <Lock className="w-3 h-3 mr-1 text-[#591d8f]" />
            Official Authorization Gateway
          </span>
        </div>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#1e0a3c] via-[#240b49] to-[#2b0f4c] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-purple-900/40 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-orange-400 mb-3 shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Category Admin Clearance & Verification
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl leading-relaxed">
              In accordance with platform governance, all Category Admins are verified government personnel.
              Submit your credentials below for review by the <strong>Chief Nodal Verification Authority</strong>.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Application Form or Success Notice */}
        <div className="bg-white rounded-3xl border border-[#e9e1f5] shadow-sm p-6 sm:p-8">
          {submittedApp ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <BadgeCheck className="w-9 h-9" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-xl font-black text-slate-900">
                  Application Under Nodal Review
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your credentials have been securely routed to the <strong>Chief Nodal Verification Desk</strong>.
                  Once authenticated against departmental records, your Category Admin rights for{" "}
                  <strong className="text-purple-900 font-bold">{submittedApp.department}</strong> will be activated.
                </p>
              </div>

              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold">Application Reference:</span>
                  <span className="font-mono font-bold text-[#2b0f4c]">{submittedApp.applicationId}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold">Assigned Department:</span>
                  <span className="font-bold text-slate-900">{submittedApp.department}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-semibold">Review Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                    {submittedApp.status}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-2.5 rounded-xl font-bold text-xs bg-[#240b49] text-white hover:bg-[#1e0a3c] transition shadow-xs"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-2xl text-[11px] text-[#2b0f4c] flex items-start space-x-2">
                <UserCheck className="w-4 h-4 text-[#591d8f] shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Anti-Impersonation Protocol:</strong> Public users cannot register as administrators.
                  Category Admins are restricted strictly to managing schemes within their verified department.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Official Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Officer Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    required
                    value={formData.applicantName}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
                  />
                </div>

                {/* Official Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Email (.gov.in / nic.in) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="officer.name@nic.in"
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Official Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Official Contact Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
                  />
                </div>

                {/* Department Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assigned Ministry / Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
                  >
                    <option value="KISAN">🌾 Agriculture & Farmers Welfare (KISAN)</option>
                    <option value="STUDENT">🎓 Education & Skill Development (STUDENT)</option>
                    <option value="HEALTH">🏥 Health & Family Welfare (HEALTH)</option>
                    <option value="BUSINESS">💼 MSME, Industry & Commerce (BUSINESS)</option>
                    <option value="EMPLOYMENT">👷 Labour, Employment & Social Security (EMPLOYMENT)</option>
                    <option value="GENERAL">🏛️ General & Social Justice (GENERAL)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Designation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Designation / Rank <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="designation"
                    required
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Deputy Secretary / Nodal Officer"
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
                  />
                </div>

                {/* Office Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Secretariat / Office Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="officeLocation"
                    required
                    value={formData.officeLocation}
                    onChange={handleChange}
                    placeholder="e.g. Krishi Bhawan, New Delhi"
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Government ID Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="govtIdType"
                    value={formData.govtIdType}
                    onChange={handleChange}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
                  >
                    <option value="EMPLOYEE_ID">Official Government Employee ID</option>
                    <option value="OFFICER_CODE">Central / State Officer Service Code</option>
                    <option value="GAZETTE_ORDER">Gazette Appointment Notification</option>
                    <option value="AADHAAR_GOVT_LINK">Govt-Linked Identity Token</option>
                  </select>
                </div>

                {/* ID Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ID / Service Card Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="govtIdNumber"
                    required
                    value={formData.govtIdNumber}
                    onChange={handleChange}
                    placeholder="e.g. GOI/AGRI/2026/8941"
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#591d8f]"
                  />
                </div>
              </div>

              {/* Mandatory Government Verification Documents Section */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Statutory Verification Proofs (अनिवार्य सरकारी सत्यापन दस्तावेज) *
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Standard NIC &amp; Ministry Onboarding requirements: Employee ID, Authorization, Posting &amp; Seal.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoAttachSampleDocs}
                    className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-purple-50 text-[#591d8f] border border-purple-200 hover:bg-purple-100 transition cursor-pointer flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
                    title="Attach sample government documents for instant testing"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>⚡ 1-Click Attach Sample Docs</span>
                  </button>
                </div>

                {/* 4 Document Upload Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* 1. Employee ID Card */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">🪪 1. Govt Employee ID Card</span>
                      {formData.employeeIdCardUrl ? (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Attached ✓</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">Required</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Front/Back scan of official Ministry / NIC card</p>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="cursor-pointer text-xs font-bold text-[#591d8f] hover:underline">
                        <span>Upload File</span>
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("employeeIdCardUrl", e)} />
                      </label>
                      {formData.employeeIdCardUrl && (
                        <span className="text-[11px] text-emerald-600 font-semibold truncate max-w-[130px]">Document Ready</span>
                      )}
                    </div>
                  </div>

                  {/* 2. Authorization Letter */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">📜 2. Nomination / Auth Letter</span>
                      {formData.authorizationLetterUrl ? (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Attached ✓</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">Required</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Ministry Letterhead signed by Competent Authority</p>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="cursor-pointer text-xs font-bold text-[#591d8f] hover:underline">
                        <span>Upload File</span>
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("authorizationLetterUrl", e)} />
                      </label>
                      {formData.authorizationLetterUrl && (
                        <span className="text-[11px] text-emerald-600 font-semibold truncate max-w-[130px]">Document Ready</span>
                      )}
                    </div>
                  </div>

                  {/* 3. Posting Order */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">🏛️ 3. Ministry Posting Order</span>
                      {formData.postingOrderUrl ? (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Attached ✓</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">Required</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Gazette notification assigning to designated ministry</p>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="cursor-pointer text-xs font-bold text-[#591d8f] hover:underline">
                        <span>Upload File</span>
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("postingOrderUrl", e)} />
                      </label>
                      {formData.postingOrderUrl && (
                        <span className="text-[11px] text-emerald-600 font-semibold truncate max-w-[130px]">Document Ready</span>
                      )}
                    </div>
                  </div>

                  {/* 4. Specimen Signature & Seal */}
                  <div className="p-3 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">🖋️ 4. Specimen Sign &amp; Seal</span>
                      {formData.specimenSignatureUrl ? (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Attached ✓</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">Required</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">Attested signature slip with blue rubber stamp</p>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="cursor-pointer text-xs font-bold text-[#591d8f] hover:underline">
                        <span>Upload File</span>
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("specimenSignatureUrl", e)} />
                      </label>
                      {formData.specimenSignatureUrl && (
                        <span className="text-[11px] text-emerald-600 font-semibold truncate max-w-[130px]">Document Ready</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Justification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Departmental Mandate / Justification
                </label>
                <textarea
                  rows={2}
                  name="justification"
                  value={formData.justification}
                  onChange={handleChange}
                  placeholder="Specify schemes or statutory responsibilities assigned under your departmental jurisdiction..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">
                  Verification verified within 24–48 hours by the Chief Nodal Authority.
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs bg-[#240b49] hover:bg-[#1e0a3c] text-white flex items-center justify-center space-x-2 transition shadow-md shadow-purple-950/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Submitting Credentials..." : "Submit for Nodal Verification"}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

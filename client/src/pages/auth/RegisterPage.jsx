import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  UserPlus,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Lock,
  Mail,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Check,
  HeartHandshake,
  Fingerprint,
  Building2,
  BadgeCheck,
  Phone,
  FileCheck2
} from "lucide-react";
import { applyOfficerLicense } from "../../services/officerApi";
import { SAMPLE_GOVT_DOCS } from "../../utils/govtDocumentSamples";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("citizen"); // "citizen" | "officer"

  // Citizen Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [citizenError, setCitizenError] = useState("");
  const [citizenSubmitting, setCitizenSubmitting] = useState(false);

  // Officer Form State
  const [officerData, setOfficerData] = useState({
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
  const [officerError, setOfficerError] = useState("");
  const [officerSubmitting, setOfficerSubmitting] = useState(false);
  const [officerSubmittedApp, setOfficerSubmittedApp] = useState(null);

  const { register, clearError } = useAuth();
  const navigate = useNavigate();

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setCitizenError("");
    clearError();

    if (!name.trim()) {
      setCitizenError("Full name is required.");
      return;
    }

    if (!email.trim()) {
      setCitizenError("Email address is required.");
      return;
    }

    if (password.length < 6) {
      setCitizenError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setCitizenError("Passwords do not match. Please re-enter.");
      return;
    }

    setCitizenSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password, "citizen");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setCitizenError(err.message || "Registration failed. Please try again.");
    } finally {
      setCitizenSubmitting(false);
    }
  };

  const handleOfficerChange = (e) => {
    const { name: fName, value } = e.target;
    setOfficerData((prev) => ({ ...prev, [fName]: value }));
  };

  const handleAutoAttachSampleDocs = () => {
    setOfficerData((prev) => ({
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
      setOfficerData((prev) => ({
        ...prev,
        [docKey]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleOfficerSubmit = async (e) => {
    e.preventDefault();
    setOfficerError("");

    if (
      !officerData.applicantName ||
      !officerData.email ||
      !officerData.department ||
      !officerData.designation ||
      !officerData.officeLocation ||
      !officerData.govtIdNumber
    ) {
      setOfficerError("Please fill out all mandatory government identification fields.");
      return;
    }

    setOfficerSubmitting(true);
    try {
      const res = await applyOfficerLicense(officerData);
      if (res?.success) {
        setOfficerSubmittedApp(res.data);
      } else {
        setOfficerError(res?.message || "Application submission failed.");
      }
    } catch (err) {
      console.error("Error submitting officer application:", err);
      setOfficerError(
        err.message ||
        "Could not transmit credentials to Chief Nodal Verification Authority."
      );
    } finally {
      setOfficerSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f7f5fa] min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#e9e1f5] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* ======================================================== */}
        {/* LEFT PANEL: Deep Plum Brand Panel                        */}
        {/* ======================================================== */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#1e0a3c] via-[#240b49] to-[#2b0f4c] text-white p-8 sm:p-10 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center text-xs font-bold text-purple-200 hover:text-white transition">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Home
            </Link>

            <div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7c3aed] via-[#5f259f] to-[#3b0764] ring-2 ring-purple-300/30 text-white flex items-center justify-center font-black shadow-lg shadow-purple-950/40 mb-3">
                <Fingerprint className="w-6 h-6 text-white" strokeWidth={2.4} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                HAQ DWAAR <span className="text-[#ea580c]">AI</span>
              </h2>
              <p className="text-xs text-purple-200 font-semibold tracking-wide mt-0.5">
                Scheme se Application Tak
              </p>
            </div>

            {/* Role Governance Explainer */}
            <div className="space-y-3 pt-2 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#fb923c] block">
                Platform Security Architecture
              </span>

              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
                  <span>Citizens (नागरिक)</span>
                </div>
                <p className="text-[11px] text-purple-200 leading-relaxed">
                  Direct registration. Instant access to personalized benefit discovery, DigiLocker vault, and application tracking.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 border border-white/15 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                  <span>Department Officers (अधिकारी)</span>
                </div>
                <p className="text-[11px] text-purple-200 leading-relaxed">
                  Strict anti-fraud protocol: Department admins must be verified by the <strong>Chief Govt Officer</strong> before receiving departmental privileges.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-900/60 text-[11px] text-purple-300/80 leading-relaxed">
            HAQ DWAAR AI is an assistance platform and enforces zero unauthorized administrative access.
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Tabbed Registration Form                    */}
        {/* ======================================================== */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            
            {/* Header */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
                {activeTab === "citizen" ? "Citizen Registration" : "Department Admin Application"}
              </h1>
              <p className="text-xs text-[#64748b] mt-1 font-semibold leading-relaxed">
                {activeTab === "citizen"
                  ? "Create a citizen account to find eligible schemes and organize documents."
                  : "Submit official government credentials to the Chief Nodal Verification Authority."}
              </p>
            </div>

            {/* Tab Selector */}
            <div className="grid grid-cols-2 p-1 bg-[#fbf9fe] rounded-2xl border border-[#e9e1f5]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("citizen");
                  setCitizenError("");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === "citizen"
                    ? "bg-white text-[#2b0f4c] shadow-xs border border-[#e9e1f5]"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Citizen (आम नागरिक)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("officer");
                  setOfficerError("");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  activeTab === "officer"
                    ? "bg-white text-[#2b0f4c] shadow-xs border border-[#e9e1f5]"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#591d8f]" />
                <span>Govt Officer (अधिकारी)</span>
              </button>
            </div>

            {/* ======================================================== */}
            {/* 1. CITIZEN FORM                                          */}
            {/* ======================================================== */}
            {activeTab === "citizen" && (
              <div className="space-y-4">
                {citizenError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-800 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span>{citizenError}</span>
                  </div>
                )}

                <form className="space-y-3.5" onSubmit={handleCitizenSubmit}>
                  <div>
                    <label htmlFor="reg-name" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="block w-full pl-10 pr-3.5 py-2.5 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#591d8f] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ramesh@example.com"
                        className="block w-full pl-10 pr-3.5 py-2.5 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#591d8f] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-pass" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1">
                      Create Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-pass"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="block w-full pl-10 pr-3.5 py-2.5 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#591d8f] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-cpass" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-cpass"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="block w-full pl-10 pr-3.5 py-2.5 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#591d8f] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={citizenSubmitting}
                    className="w-full mt-2 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#591d8f] to-[#2b0f4c] text-white hover:opacity-95 shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {citizenSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Citizen Account</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* 2. GOVT OFFICER APPLICATION FORM                         */}
            {/* ======================================================== */}
            {activeTab === "officer" && (
              <div className="space-y-4">
                {officerSubmittedApp ? (
                  <div className="p-6 bg-purple-50/80 border border-purple-200 rounded-3xl text-center space-y-4 animate-in fade-in">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                      <BadgeCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-200 text-purple-900 border border-purple-300">
                        Verification Application Transmitted
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900">
                        Application Sent to Chief Govt Officer!
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                        Aapka aavedan <strong>Chief Nodal Verification Officer (उच्च स्तरीय सरकारी सत्यापन अधिकारी)</strong> ke pass safaltapoorvak bhej diya gaya hai.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-purple-100 text-left text-xs font-mono space-y-1.5 shadow-2xs">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500 font-sans">Reference ID:</span>
                        <span className="font-bold text-[#591d8f]">{officerSubmittedApp.applicationId}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500 font-sans">Applicant:</span>
                        <strong className="text-slate-800">{officerSubmittedApp.applicantName}</strong>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-slate-500 font-sans">Target Ministry:</span>
                        <strong className="text-emerald-700">{officerSubmittedApp.department}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-sans">Status:</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                          {officerSubmittedApp.status} (In Review Queue)
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Next Action Guide for Testing */}
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs space-y-1">
                      <div className="font-bold text-amber-900 flex items-center gap-1.5">
                        <span>🧪 Next Step to Test:</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        1. Login with Chief Govt Officer credentials (<strong>chief.officer@nic.in</strong> / <strong>Officer@123</strong>).<br />
                        2. Go to <strong>Officer Vetting Queue</strong> and click <strong>Approve & Issue Admin License</strong>.<br />
                        3. Login as Department Admin with your registered email!
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <Link
                        to="/login"
                        className="flex-1 py-3 px-4 rounded-xl font-black text-xs bg-[#240b49] text-white hover:bg-[#1e0a3c] shadow-xs transition flex items-center justify-center space-x-1.5"
                      >
                        <span>Go to Login Portal &rarr;</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOfficerSubmittedApp(null)}
                        className="py-3 px-4 rounded-xl font-bold text-xs bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-3" onSubmit={handleOfficerSubmit}>
                    {officerError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2 text-red-800 text-xs">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        <span>{officerError}</span>
                      </div>
                    )}

                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed">
                      <strong>⚠️ Statutory Requirement:</strong> Department Admin rights are issued solely after verification by the Higher-Level Govt Officer. Public registration as admin is prohibited.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Officer Name *
                        </label>
                        <input
                          type="text"
                          name="applicantName"
                          required
                          value={officerData.applicantName}
                          onChange={handleOfficerChange}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full py-2 px-3 border border-[#e9e1f5] rounded-xl text-xs bg-[#fbf9fe] focus:bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Official Email (.gov.in / nic.in) *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={officerData.email}
                          onChange={handleOfficerChange}
                          placeholder="officer@nic.in"
                          className="w-full py-2 px-3 border border-[#e9e1f5] rounded-xl text-xs bg-[#fbf9fe] focus:bg-white text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Department Ministry *
                        </label>
                        <select
                          name="department"
                          value={officerData.department}
                          onChange={handleOfficerChange}
                          className="w-full py-2 px-3 border border-[#e9e1f5] rounded-xl text-xs bg-white text-slate-900 font-bold"
                        >
                          <option value="KISAN">🌾 Agriculture / KISAN</option>
                          <option value="STUDENT">🎓 Education / STUDENT</option>
                          <option value="HEALTH">🏥 Health / HEALTH</option>
                          <option value="BUSINESS">💼 MSME / BUSINESS</option>
                          <option value="EMPLOYMENT">👷 Labour / EMPLOYMENT</option>
                          <option value="GENERAL">🏛️ General / GENERAL</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Official Designation *
                        </label>
                        <input
                          type="text"
                          name="designation"
                          required
                          value={officerData.designation}
                          onChange={handleOfficerChange}
                          placeholder="e.g. Deputy Secretary / Nodal"
                          className="w-full py-2 px-3 border border-[#e9e1f5] rounded-xl text-xs bg-[#fbf9fe] focus:bg-white text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Office / Secretariat Location *
                        </label>
                        <input
                          type="text"
                          name="officeLocation"
                          required
                          value={officerData.officeLocation}
                          onChange={handleOfficerChange}
                          placeholder="e.g. Krishi Bhawan, New Delhi"
                          className="w-full py-2 px-3 border border-[#e9e1f5] rounded-xl text-xs bg-[#fbf9fe] focus:bg-white text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Govt Employee / Service ID *
                        </label>
                        <input
                          type="text"
                          name="govtIdNumber"
                          required
                          value={officerData.govtIdNumber}
                          onChange={handleOfficerChange}
                          placeholder="e.g. GOI/AGRI/2026/8941"
                          className="w-full py-2 px-3 border border-[#e9e1f5] rounded-xl text-xs bg-[#fbf9fe] focus:bg-white text-slate-900"
                        />
                      </div>
                    </div>

                    {/* Mandatory Government Verification Documents Section */}
                    <div className="space-y-2.5 pt-2 border-t border-[#e9e1f5]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div>
                          <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider">
                            Statutory Verification Documents (सत्यापन दस्तावेज) *
                          </label>
                          <span className="text-[10px] text-slate-500">
                            Real-world NIC/Nodal requirements: Official ID, Authorization, Posting &amp; Seal.
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleAutoAttachSampleDocs}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-purple-50 text-[#591d8f] border border-purple-200 hover:bg-purple-100 transition cursor-pointer flex items-center gap-1 shadow-2xs self-start sm:self-auto"
                          title="Attach sample government documents for instant testing"
                        >
                          <Sparkles className="w-3 h-3 text-[#ea580c]" />
                          <span>⚡ 1-Click Attach Sample Docs</span>
                        </button>
                      </div>

                      {/* 4 Document Upload Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {/* 1. Employee ID Card */}
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">🪪 1. Govt Employee ID Card</span>
                            {officerData.employeeIdCardUrl ? (
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Attached ✓</span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400">Required</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">Front/Back scan of official Ministry / NIC card</p>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer text-[10px] font-bold text-[#591d8f] hover:underline">
                              <span>Choose File</span>
                              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("employeeIdCardUrl", e)} />
                            </label>
                            {officerData.employeeIdCardUrl && (
                              <span className="text-[10px] text-emerald-600 font-semibold truncate max-w-[120px]">Document Ready</span>
                            )}
                          </div>
                        </div>

                        {/* 2. Authorization Letter */}
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">📜 2. Nomination / Auth Letter</span>
                            {officerData.authorizationLetterUrl ? (
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Attached ✓</span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400">Required</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">Ministry Letterhead signed by Competent Authority</p>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer text-[10px] font-bold text-[#591d8f] hover:underline">
                              <span>Choose File</span>
                              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("authorizationLetterUrl", e)} />
                            </label>
                            {officerData.authorizationLetterUrl && (
                              <span className="text-[10px] text-emerald-600 font-semibold truncate max-w-[120px]">Document Ready</span>
                            )}
                          </div>
                        </div>

                        {/* 3. Posting Order */}
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">🏛️ 3. Ministry Posting Order</span>
                            {officerData.postingOrderUrl ? (
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Attached ✓</span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400">Required</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">Gazette order assigning to designated department</p>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer text-[10px] font-bold text-[#591d8f] hover:underline">
                              <span>Choose File</span>
                              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("postingOrderUrl", e)} />
                            </label>
                            {officerData.postingOrderUrl && (
                              <span className="text-[10px] text-emerald-600 font-semibold truncate max-w-[120px]">Document Ready</span>
                            )}
                          </div>
                        </div>

                        {/* 4. Specimen Signature & Seal */}
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">🖋️ 4. Specimen Sign &amp; Seal</span>
                            {officerData.specimenSignatureUrl ? (
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Attached ✓</span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400">Required</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500">Attested signature slip with blue rubber stamp</p>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer text-[10px] font-bold text-[#591d8f] hover:underline">
                              <span>Choose File</span>
                              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => handleFileUpload("specimenSignatureUrl", e)} />
                            </label>
                            {officerData.specimenSignatureUrl && (
                              <span className="text-[10px] text-emerald-600 font-semibold truncate max-w-[120px]">Document Ready</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={officerSubmitting}
                      className="w-full mt-2 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm bg-[#1e0a3c] hover:bg-[#2b0f4c] text-white shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      {officerSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-orange-400" />
                          <span>Submit Credentials for Higher-Officer Verification</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Bottom link to login */}
            <div className="pt-2 text-center text-xs text-[#64748b]">
              <span>Already have an account? </span>
              <Link to="/login" className="font-bold text-[#591d8f] hover:text-[#2b0f4c] underline">
                Sign In
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

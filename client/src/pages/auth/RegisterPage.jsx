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
  Fingerprint,
  Building2,
  BadgeCheck,
  Phone,
  Eye,
  EyeOff,
  ChevronRight,
  Shield,
  FileCheck2,
  Check
} from "lucide-react";
import { applyOfficerLicense } from "../../services/officerApi";
import { SAMPLE_GOVT_DOCS } from "../../utils/govtDocumentSamples";

const OFFICER_MINISTRIES = [
  { id: "KISAN", label: "🌾 Agriculture (KISAN)", ministry: "Dept of Agriculture & Farmers Welfare", code: "KISAN", sampleDesignation: "Deputy Director (Agri Schemes)", sampleLoc: "Krishi Bhawan, New Delhi" },
  { id: "STUDENT", label: "🎓 Education (STUDENT)", ministry: "Ministry of Education", code: "STUDENT", sampleDesignation: "Joint Director (Scholarships)", sampleLoc: "Shastri Bhawan, New Delhi" },
  { id: "HEALTH", label: "🏥 Health & Family Welfare", ministry: "Ministry of Health & Family Welfare", code: "HEALTH", sampleDesignation: "Nodal Officer (PM-JAY)", sampleLoc: "Nirman Bhawan, New Delhi" },
  { id: "BUSINESS", label: "💼 MSME & Enterprise", ministry: "Ministry of MSME & Commercial", code: "BUSINESS", sampleDesignation: "Assistant Director (Credit)", sampleLoc: "Udyog Bhawan, New Delhi" },
  { id: "EMPLOYMENT", label: "👷 Labour & Employment", ministry: "Ministry of Labour & Employment", code: "EMPLOYMENT", sampleDesignation: "Regional Welfare Commissioner", sampleLoc: "Shram Shakti Bhawan, New Delhi" },
  { id: "GENERAL", label: "🏛️ Social Justice (GENERAL)", ministry: "Ministry of Social Justice", code: "GENERAL", sampleDesignation: "Nodal Welfare Officer", sampleLoc: "Antyodaya Bhawan, New Delhi" },
];

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("citizen"); // "citizen" | "officer"

  // Citizen Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleQuickFillOfficerDemo = (ministryId) => {
    const selected = OFFICER_MINISTRIES.find((m) => m.id === ministryId) || OFFICER_MINISTRIES[0];
    setOfficerData({
      applicantName: "Dr. Sandeep Deshmukh",
      email: `sandeep.deshmukh.${selected.code.toLowerCase()}@nic.in`,
      phone: "9876543210",
      department: selected.id,
      designation: selected.sampleDesignation,
      officeLocation: selected.sampleLoc,
      govtIdType: "EMPLOYEE_ID",
      govtIdNumber: `GOI/${selected.code}/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      justification: `Designated as Category Admin & Nodal Officer for scheme verification, citizen readiness audits, and grievance dispatch under ${selected.ministry}.`,
      employeeIdCardUrl: SAMPLE_GOVT_DOCS.employeeIdCardUrl,
      authorizationLetterUrl: SAMPLE_GOVT_DOCS.authorizationLetterUrl,
      postingOrderUrl: SAMPLE_GOVT_DOCS.postingOrderUrl,
      specimenSignatureUrl: SAMPLE_GOVT_DOCS.specimenSignatureUrl,
    });
    setOfficerError("");
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
    <div className="bg-gradient-to-b from-[#f8f6fc] via-[#f4f0fa] to-[#ede7f6] min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-purple-100 shadow-2xl shadow-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* ======================================================== */}
        {/* LEFT PANEL: Civic Identity & Governance Explainer        */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1d0a3a] via-[#260c4a] to-[#340f5e] text-white p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Link to="/" className="inline-flex items-center text-xs font-bold text-purple-200/90 hover:text-white transition group">
              <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" /> 
              <span>Back to Public Portal</span>
            </Link>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] ring-4 ring-white/10 text-white flex items-center justify-center shadow-lg shadow-purple-950/50 mb-4">
                <Fingerprint className="w-6 h-6 text-white" strokeWidth={2.4} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                HAQ DWAAR <span className="text-[#ea580c]">AI</span>
              </h2>
              <p className="text-xs text-purple-200 font-semibold tracking-wide mt-1">
                Scheme se Application Tak — Civic Readiness Platform
              </p>
            </div>

            {/* Architecture Highlights */}
            <div className="space-y-3 pt-2 text-xs">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#fb923c] block">
                Two-Tier Trust Protocol
              </span>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-2 text-xs">
                  <Sparkles className="w-4 h-4 text-[#fb923c]" />
                  <span>Citizen Self-Service (नागरिक खाता)</span>
                </div>
                <p className="text-[11px] text-purple-200/80 leading-relaxed">
                  Instant registration for all Indian citizens. Pre-evaluate eligibility, calculate readiness scores, and store document proofs safely.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Vetted Ministry Officers (सत्यापित अधिकारी)</span>
                </div>
                <p className="text-[11px] text-purple-200/80 leading-relaxed">
                  Strict anti-fraud protocol: Departmental nodal licenses are strictly issued after verification by the <strong>Chief Govt Officer (IAS)</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-purple-200/70 leading-relaxed relative z-10 flex items-center justify-between">
            <span>Statutory Anti-Fraud Architecture</span>
            <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-purple-200">ISO-Ready</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Clean & Spacious Registration Form         */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {activeTab === "citizen" ? "Create Citizen Account" : "Government Officer Application"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {activeTab === "citizen"
                  ? "Access 10+ Central Schemes, Benefit Passport, and personal document vault."
                  : "Submit official credentials to the Chief Nodal Officer for statutory department authorization."}
              </p>
            </div>

            {/* High-Contrast Segmented Role Tabs */}
            <div className="p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("citizen");
                  setCitizenError("");
                }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  activeTab === "citizen"
                    ? "bg-white text-[#2b0f4c] shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#ea580c]" />
                <span>Citizen (आम नागरिक)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("officer");
                  setOfficerError("");
                }}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  activeTab === "officer"
                    ? "bg-[#2b0f4c] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-300" />
                <span>Govt Officer (अधिकारी)</span>
              </button>
            </div>

            {/* ======================================================== */}
            {/* 1. CITIZEN REGISTRATION FORM                             */}
            {/* ======================================================== */}
            {activeTab === "citizen" && (
              <div className="space-y-4">
                {citizenError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-800 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <span>{citizenError}</span>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleCitizenSubmit}>
                  <div>
                    <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name (पूरा नाम)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (ईमेल)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ramesh@example.com"
                        className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="reg-pass" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[11px] font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showPassword ? "Hide" : "Show"}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="reg-pass"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-cpass" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="reg-cpass"
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={citizenSubmitting}
                    className="w-full mt-2 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#591d8f] to-[#240b49] text-white hover:opacity-95 shadow-lg shadow-purple-950/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {citizenSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Citizen Account & Start Discovery</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ======================================================== */}
            {/* 2. GOVT OFFICER REGISTRATION FORM                        */}
            {/* ======================================================== */}
            {activeTab === "officer" && (
              <div className="space-y-4">
                {officerSubmittedApp ? (
                  <div className="p-6 bg-purple-50/90 border border-purple-200 rounded-3xl text-center space-y-4 animate-in fade-in">
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
                        Your application has been submitted to the <strong>Chief Nodal Verification Authority (IAS)</strong> for statutory background vetting and license approval.
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
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        1. Go to <Link to="/login" className="underline font-bold">Sign In</Link> &rarr; Click <strong>Official / Admin</strong> &rarr; Select <strong>⚖️ Chief Officer (IAS)</strong>.<br />
                        2. Open the <strong>Officer Approvals</strong> queue & click <strong>Approve & Issue Admin License</strong>.<br />
                        3. The officer account is instantly activated!
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
                        className="py-3 px-4 rounded-xl font-bold text-xs bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleOfficerSubmit}>
                    {officerError && (
                      <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2 text-red-800 text-xs">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                        <span>{officerError}</span>
                      </div>
                    )}

                    {/* Quick Demo Fill & Statutory Guidance Header */}
                    <div className="p-3.5 bg-gradient-to-r from-purple-50 via-purple-100/50 to-amber-50 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#591d8f]" />
                          <span>Official Ministry Department Nodal Portal</span>
                        </span>
                        <p className="text-[11px] text-slate-600">
                          Select your ministry and submit official credentials for Chief Officer verification.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickFillOfficerDemo(officerData.department)}
                        className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#591d8f] to-[#2b0f4c] text-white hover:opacity-95 transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shrink-0"
                        title="Auto-fill verified officer details for testing"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#fb923c]" />
                        <span>⚡ 1-Click Demo Fill</span>
                      </button>
                    </div>

                    {/* Department Ministry Interactive Grid Selector */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                        Choose Your Target Ministry / Department: *
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {OFFICER_MINISTRIES.map((m) => {
                          const isSelected = officerData.department === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setOfficerData((prev) => ({
                                  ...prev,
                                  department: m.id,
                                  designation: m.sampleDesignation,
                                  officeLocation: m.sampleLoc,
                                }));
                              }}
                              className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? "bg-[#2b0f4c] text-white border-[#2b0f4c] shadow-xs ring-2 ring-purple-400/40"
                                  : "bg-white text-slate-800 border-purple-200 hover:border-purple-400 hover:bg-purple-50/50"
                              }`}
                            >
                              <div className="font-black text-xs truncate">{m.label}</div>
                              <div className={`text-[10px] mt-1 truncate ${isSelected ? "text-purple-200" : "text-slate-500"}`}>
                                {m.sampleDesignation.split(" (")[0]}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Officer Name *
                        </label>
                        <input
                          type="text"
                          name="applicantName"
                          required
                          value={officerData.applicantName}
                          onChange={handleOfficerChange}
                          placeholder="e.g. Dr. Sandeep Deshmukh"
                          className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#591d8f] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Official Email (.gov.in / nic.in) *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={officerData.email}
                          onChange={handleOfficerChange}
                          placeholder="officer@nic.in"
                          className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#591d8f] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Official Designation *
                        </label>
                        <input
                          type="text"
                          name="designation"
                          required
                          value={officerData.designation}
                          onChange={handleOfficerChange}
                          placeholder="e.g. Deputy Director / Nodal Officer"
                          className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#591d8f] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Govt Employee / Service ID *
                        </label>
                        <input
                          type="text"
                          name="govtIdNumber"
                          required
                          value={officerData.govtIdNumber}
                          onChange={handleOfficerChange}
                          placeholder="e.g. GOI/AGRI/2026/8941"
                          className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#591d8f] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Office / Secretariat Location *
                      </label>
                      <input
                        type="text"
                        name="officeLocation"
                        required
                        value={officerData.officeLocation}
                        onChange={handleOfficerChange}
                        placeholder="e.g. Krishi Bhawan, New Delhi"
                        className="w-full py-2.5 px-3.5 border border-slate-200 rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 font-medium focus:ring-2 focus:ring-[#591d8f] focus:outline-none"
                      />
                    </div>

                    {/* Mandatory Government Verification Documents Section */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div>
                          <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider">
                            Statutory Verification Documents (सत्यापन दस्तावेज) *
                          </label>
                          <span className="text-[10px] text-slate-500">
                            Statutory NIC requirements: Official ID, Authorization, Posting &amp; Seal.
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleAutoAttachSampleDocs}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-purple-50 text-[#591d8f] border border-purple-200 hover:bg-purple-100 transition cursor-pointer flex items-center gap-1 shadow-2xs self-start sm:self-auto"
                        >
                          <Sparkles className="w-3 h-3 text-[#ea580c]" />
                          <span>⚡ Auto-Attach Verification Proofs</span>
                        </button>
                      </div>

                      {/* 4 Document Proof Badges */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                        <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <span className="font-bold text-slate-700">🪪 Employee ID</span>
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">✓</span>
                        </div>
                        <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <span className="font-bold text-slate-700">📄 Authorization</span>
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">✓</span>
                        </div>
                        <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <span className="font-bold text-slate-700">📋 Posting Order</span>
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">✓</span>
                        </div>
                        <div className="p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <span className="font-bold text-slate-700">✍️ Specimen Seal</span>
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 py-0.5 rounded">✓</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={officerSubmitting}
                      className="w-full mt-3 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#2b0f4c] to-[#1e0a3c] text-white hover:opacity-95 shadow-lg shadow-purple-950/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      {officerSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Submit Official Credentials for Chief Officer Vetting</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

          {/* Bottom Switch to Login */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-bold text-[#591d8f] hover:text-[#2b0f4c] hover:underline flex items-center gap-1"
            >
              <span>Sign In instead</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  LogIn,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Lock,
  Mail,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Fingerprint,
  Building2,
  BadgeCheck,
  Eye,
  EyeOff,
  UserCheck,
  ChevronRight,
  Shield
} from "lucide-react";

const DEPARTMENTS = [
  {
    id: "KISAN",
    label: "🌾 Agriculture (KISAN)",
    ministry: "Dept of Agriculture & Farmers Welfare",
    officer: "Sunil Verma (Agriculture Nodal)",
    email: "kisan.admin@gov.in",
    pass: "Kisan@123",
    color: "emerald"
  },
  {
    id: "STUDENT",
    label: "🎓 Education (STUDENT)",
    ministry: "Ministry of Education",
    officer: "Dr. Ananya Roy (Education Nodal)",
    email: "student.admin@gov.in",
    pass: "Student@123",
    color: "blue"
  },
  {
    id: "HEALTH",
    label: "🏥 Health & Family Welfare",
    ministry: "Ministry of Health & Family Welfare",
    officer: "Dr. Vikram Joshi (Health Nodal)",
    email: "health.admin@gov.in",
    pass: "Health@123",
    color: "rose"
  },
  {
    id: "BUSINESS",
    label: "💼 MSME & Enterprise",
    ministry: "Ministry of MSME",
    officer: "Rohan Singhal (MSME Nodal)",
    email: "business.admin@gov.in",
    pass: "Business@123",
    color: "amber"
  },
  {
    id: "EMPLOYMENT",
    label: "👷 Labour & Employment",
    ministry: "Ministry of Labour & Employment",
    officer: "Meenakshi Sundaram (Labour Nodal)",
    email: "employment.admin@gov.in",
    pass: "Labour@123",
    color: "cyan"
  }
];

export default function LoginPage() {
  const [selectedRoleTab, setSelectedRoleTab] = useState("citizen"); // "citizen" | "admin"
  const [adminTier, setAdminTier] = useState("department"); // "department" | "chief" | "super"
  const [selectedDepartment, setSelectedDepartment] = useState("KISAN");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleRoleTabChange = (role) => {
    setSelectedRoleTab(role);
    setFormError("");
    setInfoMessage("");
    if (role === "admin") {
      setAdminTier("department");
      const defaultDept = DEPARTMENTS[0];
      setSelectedDepartment(defaultDept.id);
      setEmail(defaultDept.email);
      setPassword(defaultDept.pass);
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleAdminTierChange = (tier) => {
    setAdminTier(tier);
    setFormError("");
    if (tier === "chief") {
      setEmail("chief.officer@nic.in");
      setPassword("Officer@123");
    } else if (tier === "super") {
      setEmail("admin@haqdwaar.gov.in");
      setPassword("Admin@123");
    } else {
      const dept = DEPARTMENTS.find((d) => d.id === selectedDepartment) || DEPARTMENTS[0];
      setEmail(dept.email);
      setPassword(dept.pass);
    }
  };

  const handleSelectDepartment = (deptId) => {
    setSelectedDepartment(deptId);
    setAdminTier("department");
    const found = DEPARTMENTS.find((d) => d.id === deptId);
    if (found) {
      setEmail(found.email);
      setPassword(found.pass);
      setFormError("");
    }
  };

  const handleAutoFillCitizenDemo = () => {
    setEmail("citizen.demo@haqdwaar.in");
    setPassword("Citizen@123");
    setFormError("");
    setInfoMessage("Auto-filled demo citizen credentials! Click Sign In to test.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setInfoMessage("");
    clearError();

    if (!email.trim() || !password) {
      setFormError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      const authRes = await login(email.trim(), password);
      const userRole = authRes?.user?.role;
      const isAdminTier = ["admin", "super_admin", "chief_officer", "category_admin"].includes(userRole);

      if (isAdminTier) {
        const dest = from && from.startsWith("/admin") ? from : "/admin";
        navigate(dest, { replace: true });
      } else {
        if (selectedRoleTab === "admin") {
          setInfoMessage("Signed in as Citizen! Redirecting to Citizen Portal...");
        }
        const dest = from && !from.startsWith("/admin") ? from : "/dashboard";
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setFormError(err.message || "Failed to log in. Please verify your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentMinistry = DEPARTMENTS.find((d) => d.id === selectedDepartment) || DEPARTMENTS[0];

  return (
    <div className="bg-gradient-to-b from-[#f8f6fc] via-[#f4f0fa] to-[#ede7f6] min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-purple-100 shadow-2xl shadow-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* ======================================================== */}
        {/* LEFT PANEL: Deep Civic Brand Identity & Guiding Journey   */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1d0a3a] via-[#260c4a] to-[#340f5e] text-white p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
          {/* Subtle civic watermark pattern */}
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

            {/* Benefit Journey Steps */}
            <div className="space-y-4 pt-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#fb923c] block">
                Citizen Assurance Invariants
              </span>

              <div className="space-y-3.5 text-xs text-purple-100">
                <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-[#fb923c]/20 text-[#fb923c] flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-[#fb923c]/30">
                    1
                  </span>
                  <div>
                    <strong className="text-white block text-xs">Direct Eligibility Discovery</strong>
                    <span className="text-[11px] text-purple-200/80 leading-relaxed">
                      Instant matching against 10+ official Central schemes without middlemen.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-emerald-400/30">
                    2
                  </span>
                  <div>
                    <strong className="text-white block text-xs">Verified Document Vault</strong>
                    <span className="text-[11px] text-purple-200/80 leading-relaxed">
                      Statutory readiness checks & certificate expiration radar.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-purple-400/20 text-purple-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-purple-400/30">
                    3
                  </span>
                  <div>
                    <strong className="text-white block text-xs">Departmental Governance</strong>
                    <span className="text-[11px] text-purple-200/80 leading-relaxed">
                      Dedicated ministerial nodal officer workflows & IAS-level audit trail.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-purple-200/70 leading-relaxed relative z-10 flex items-center justify-between">
            <span>Official Assisted Readiness System</span>
            <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-purple-200">v2.4 Live</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Clean, Airy & Spacious Sign In Form         */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-6">
            
            {/* Top Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {selectedRoleTab === "citizen"
                  ? "Sign in to access your Benefit Passport, document health & application radar."
                  : "Authorized government gateway for scheme administration & statutory verification."}
              </p>
            </div>

            {/* High-Contrast Segmented Role Tabs */}
            <div className="p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => handleRoleTabChange("citizen")}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  selectedRoleTab === "citizen"
                    ? "bg-white text-[#2b0f4c] shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#ea580c]" />
                <span>Citizen (नागरिक)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabChange("admin")}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  selectedRoleTab === "admin"
                    ? "bg-[#2b0f4c] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-4 h-4 text-purple-300" />
                <span>Official / Admin (अधिकारी)</span>
              </button>
            </div>

            {/* Quick Demo Helper Banner for Citizens */}
            {selectedRoleTab === "citizen" && (
              <div className="p-3.5 bg-purple-50/80 rounded-2xl border border-purple-100 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#ea580c] shrink-0" />
                  <span className="text-slate-700 font-medium">
                    Testing the portal? Auto-fill our verified demo citizen profile:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillCitizenDemo}
                  className="px-3 py-1.5 text-xs font-black bg-white text-[#591d8f] border border-purple-200 rounded-xl hover:bg-purple-100/70 transition shadow-2xs shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span>⚡ 1-Click Demo Fill</span>
                </button>
              </div>
            )}

            {/* ======================================================== */}
            {/* GOVERNANCE ROLE & MINISTRY SELECTION SUITE               */}
            {/* ======================================================== */}
            {selectedRoleTab === "admin" && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#2b0f4c] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#591d8f]" />
                    <span>Select Governance Authority Tier:</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    (Click any tier or department below to auto-load demo credentials)
                  </span>
                </div>

                {/* 3 Governance Tier Tabs */}
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => handleAdminTierChange("department")}
                    className={`py-2 px-2 rounded-xl text-center border transition cursor-pointer ${
                      adminTier === "department"
                        ? "bg-[#2b0f4c] text-white border-[#2b0f4c] shadow-xs"
                        : "bg-white text-slate-700 border-purple-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="truncate">🏛️ Ministry Nodal</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAdminTierChange("chief")}
                    className={`py-2 px-2 rounded-xl text-center border transition cursor-pointer ${
                      adminTier === "chief"
                        ? "bg-[#2b0f4c] text-white border-[#2b0f4c] shadow-xs"
                        : "bg-white text-slate-700 border-purple-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="truncate">⚖️ Chief Officer (IAS)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAdminTierChange("super")}
                    className={`py-2 px-2 rounded-xl text-center border transition cursor-pointer ${
                      adminTier === "super"
                        ? "bg-[#2b0f4c] text-white border-[#2b0f4c] shadow-xs"
                        : "bg-white text-slate-700 border-purple-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="truncate">🛡️ Super Admin</div>
                  </button>
                </div>

                {/* Sub-view: Ministry Department Grid (Only for Department Admins) */}
                {adminTier === "department" && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Choose Department Ministry:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
                      {DEPARTMENTS.map((dept) => {
                        const isSelected = selectedDepartment === dept.id;
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() => handleSelectDepartment(dept.id)}
                            className={`p-2 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "bg-purple-900 text-white border-purple-950 shadow-xs"
                                : "bg-white text-slate-800 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                            }`}
                          >
                            <div className="font-black truncate">{dept.label}</div>
                            <div className={`text-[9px] truncate mt-0.5 ${isSelected ? "text-purple-200" : "text-slate-500"}`}>
                              {dept.officer.split(" (")[0]}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Active Officer Identity Badge */}
                <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="font-black text-[#2b0f4c] text-xs flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {adminTier === "chief"
                          ? "Dr. Rajeshwar Sharma (IAS) — Chief Nodal Officer"
                          : adminTier === "super"
                          ? "Platform Super Administrator — System Architect"
                          : currentMinistry.officer}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {adminTier === "chief"
                        ? "Central Statutory Verification & Anti-Fraud Vetting"
                        : adminTier === "super"
                        ? "Full Platform Monitoring & Cross-Department Infrastructure"
                        : currentMinistry.ministry}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Verified
                  </span>
                </div>
              </div>
            )}

            {/* Error & Info Alerts */}
            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {infoMessage && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start space-x-2.5 text-blue-900 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Form Inputs */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRoleTab === "citizen" ? "citizen@example.com" : "officer@gov.in"}
                    className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-bold text-purple-800 hover:text-purple-950 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#591d8f] to-[#240b49] text-white hover:opacity-95 shadow-lg shadow-purple-950/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>
                      {selectedRoleTab === "citizen" ? "Sign In to Citizen Portal" : "Enter Administrative Console"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Switch to Register */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Don't have an account yet?</span>
            <Link
              to="/register"
              className="font-bold text-[#591d8f] hover:text-[#2b0f4c] hover:underline flex items-center gap-1"
            >
              <span>Create Account</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

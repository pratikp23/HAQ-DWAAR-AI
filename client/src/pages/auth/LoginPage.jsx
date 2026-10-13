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
  KeyRound,
  CheckCircle2,
  Check,
  Layers,
  ExternalLink,
  Fingerprint,
  Building2,
  BadgeCheck
} from "lucide-react";
import BrandLogo from "../../components/layout/BrandLogo";

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
    label: "🏥 Health (HEALTH)",
    ministry: "Ministry of Health & Family Welfare",
    officer: "Dr. Vikram Joshi (Health Nodal)",
    email: "health.admin@gov.in",
    pass: "Health@123",
    color: "rose"
  },
  {
    id: "BUSINESS",
    label: "💼 MSME (BUSINESS)",
    ministry: "Ministry of MSME & Enterprise",
    officer: "Rohan Singhal (MSME Nodal)",
    email: "business.admin@gov.in",
    pass: "Business@123",
    color: "amber"
  },
  {
    id: "EMPLOYMENT",
    label: "👷 Labour (EMPLOYMENT)",
    ministry: "Ministry of Labour & Employment",
    officer: "Meenakshi Sundaram (Labour Nodal)",
    email: "employment.admin@gov.in",
    pass: "Labour@123",
    color: "cyan"
  },
  {
    id: "CHIEF",
    label: "⚖️ Chief Govt Officer (IAS)",
    ministry: "National Verification Authority",
    officer: "Dr. Rajeshwar Sharma (IAS)",
    email: "chief.officer@nic.in",
    pass: "Officer@123",
    color: "purple"
  },
  {
    id: "SUPER",
    label: "🛡️ Platform Super Admin",
    ministry: "Platform Administration",
    officer: "Platform Super Administrator",
    email: "admin@haqdwaar.gov.in",
    pass: "Admin@123",
    color: "orange"
  }
];

export default function LoginPage() {
  const [selectedRoleTab, setSelectedRoleTab] = useState("citizen"); // "citizen" | "admin"
  const [selectedDepartment, setSelectedDepartment] = useState("KISAN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const defaultDept = DEPARTMENTS[0];
      setSelectedDepartment(defaultDept.id);
      setEmail(defaultDept.email);
      setPassword(defaultDept.pass);
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleSelectDepartment = (deptId) => {
    setSelectedDepartment(deptId);
    const found = DEPARTMENTS.find((d) => d.id === deptId);
    if (found) {
      setEmail(found.email);
      setPassword(found.pass);
      setFormError("");
    }
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

  return (
    <div className="bg-[#f7f5fa] min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#e9e1f5] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* ======================================================== */}
        {/* LEFT PANEL: Deep Plum Civic Brand Panel (Section 28)      */}
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

            {/* Small Benefit Journey */}
            <div className="space-y-4 pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#fb923c] block">
                Benefit Journey
              </span>

              <div className="space-y-3 text-xs text-purple-100">
                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-[#fb923c] flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 border border-purple-400/30">
                    1
                  </span>
                  <div>
                    <strong className="text-white block">Discover</strong>
                    <span className="text-[11px] text-purple-300">Find potentially relevant schemes without middlemen</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-[#fb923c] flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 border border-purple-400/30">
                    2
                  </span>
                  <div>
                    <strong className="text-white block">Prepare</strong>
                    <span className="text-[11px] text-purple-300">Organize certificates in your personal vault</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-[#fb923c] flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 border border-purple-400/30">
                    3
                  </span>
                  <div>
                    <strong className="text-white block">Apply</strong>
                    <span className="text-[11px] text-purple-300">Reach the official portal with verified readiness</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Muted Disclaimer (Section 30) */}
          <div className="pt-4 border-t border-purple-900/60 text-[11px] text-purple-300/80 leading-relaxed">
            HAQ DWAAR AI is an assistance platform and is not a government portal.
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Sign In Form (Section 28)                   */}
        {/* ======================================================== */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">
                Sign in to your account
              </h1>
              <p className="text-xs text-[#64748b] mt-1 font-semibold">
                Access your Benefit Passport, document vault, and application tracking.
              </p>
            </div>

            {/* Role Tab Switcher */}
            <div className="grid grid-cols-2 p-1 bg-[#fbf9fe] rounded-2xl border border-[#e9e1f5]">
              <button
                type="button"
                onClick={() => handleRoleTabChange("citizen")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  selectedRoleTab === "citizen"
                    ? "bg-white text-[#2b0f4c] shadow-xs border border-[#e9e1f5]"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabChange("admin")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  selectedRoleTab === "admin"
                    ? "bg-white text-[#2b0f4c] shadow-xs border border-[#e9e1f5]"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#591d8f]" />
                <span>Administrator</span>
              </button>
            </div>

            {/* Multi-Tier Governance Credentials Helper */}
            {selectedRoleTab === "admin" && (
              <div className="p-4 bg-purple-50/90 rounded-2xl border border-purple-200 text-xs space-y-3">
                <div className="flex items-center justify-between font-bold text-[#2b0f4c] text-xs">
                  <span className="flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-[#591d8f]" />
                    <span>Choose Administrative Department / Ministry:</span>
                  </span>
                  <span className="text-[10px] bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full font-bold">
                    Official Nodal
                  </span>
                </div>

                {/* Department Dropdown Selector */}
                <div>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => handleSelectDepartment(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-purple-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-[#591d8f] focus:outline-none shadow-2xs cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Officer Card Banner */}
                {(() => {
                  const currentDept = DEPARTMENTS.find((d) => d.id === selectedDepartment);
                  if (!currentDept) return null;
                  return (
                    <div className="p-2.5 bg-white rounded-xl border border-purple-200 flex items-center justify-between shadow-2xs">
                      <div className="space-y-0.5">
                        <div className="font-black text-[#2b0f4c] text-xs flex items-center gap-1.5">
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{currentDept.officer}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {currentDept.ministry}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-100 text-[#591d8f]">
                          Auto-Filled
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="p-2 bg-white/80 rounded-xl text-[10px] text-purple-900 border border-purple-100 flex items-center justify-between">
                  <span>💡 <strong>Custom Officer?</strong> You can also type your own registered .gov.in email & password below.</span>
                </div>
              </div>
            )}

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

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRoleTab === "citizen" ? "citizen@example.com" : "admin@haqdwaar.gov.in"}
                    className="block w-full pl-10 pr-3.5 py-3 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3.5 py-3 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 flex justify-center items-center py-3.5 px-4 rounded-2xl shadow-xs text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea580c] disabled:opacity-50 transition cursor-pointer"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-[#e9e1f5] text-center">
            <p className="text-xs text-[#64748b] font-semibold">
              Don't have an account?{" "}
              <Link to="/register" className="font-black text-[#591d8f] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

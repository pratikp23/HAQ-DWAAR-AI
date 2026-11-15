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
  Building2,
  Eye,
  EyeOff,
  ChevronRight,
  Shield,
  FileCheck2,
  Award
} from "lucide-react";

export default function LoginPage() {
  const [selectedRoleTab, setSelectedRoleTab] = useState("citizen"); // "citizen" | "admin"
  
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
    // Keep clean empty fields for real user login
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setInfoMessage("");
    clearError();

    if (!email.trim() || !password) {
      setFormError("Please enter both your registered email address and password.");
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
          setInfoMessage("Signed in as Citizen. Redirecting to your Citizen Dashboard...");
        }
        const dest = from && !from.startsWith("/admin") ? from : "/dashboard";
        navigate(dest, { replace: true });
      }
    } catch (err) {
      setFormError(err.message || "Failed to log in. Please verify your email and password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8faf8] min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* ======================================================== */}
        {/* LEFT PANEL: Deep Civic Brand Identity & Guiding Journey   */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-[#112318] text-white p-8 sm:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
          {/* Subtle Indian Tiranga civic watermark pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1400&q=80"
              alt="Indian National Flag"
              className="w-full h-full object-cover object-[85%_center] opacity-15 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d14] via-transparent to-black/30" />
          </div>

          <div className="space-y-6 relative z-10">
            <Link to="/" className="inline-flex items-center text-xs font-bold text-slate-300 hover:text-white transition group">
              <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" /> 
              <span>Back to Public Portal</span>
            </Link>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b3524] via-[#2d583b] to-[#457c56] ring-4 ring-white/10 text-white flex items-center justify-center shadow-lg shadow-emerald-950/50 mb-4 border border-white/20">
                <span className="font-black text-sm tracking-tight">LS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
                LOK SAMARTH
              </h2>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider mt-1.5">
                Citizen Gateway • लोक समर्थ
              </div>
              <p className="text-xs text-slate-300 font-semibold tracking-wide mt-1">
                Your Right, Your Benefit, Your Empowerment
              </p>
            </div>

            {/* Benefit Journey Steps */}
            <div className="space-y-4 pt-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#fb923c] block">
                Platform Principles
              </span>

              <div className="space-y-3.5 text-xs text-emerald-100">
                <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-[#fb923c]/20 text-[#fb923c] flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-[#fb923c]/30">
                    1
                  </span>
                  <div>
                    <strong className="text-white block text-xs">Direct Statutory Entitlements</strong>
                    <span className="text-[11px] text-emerald-100/80 leading-relaxed">
                      Instant matching against 10+ central and state welfare schemes without middlemen.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-emerald-400/30">
                    2
                  </span>
                  <div>
                    <strong className="text-white block text-xs">Verified Document Vault</strong>
                    <span className="text-[11px] text-emerald-100/80 leading-relaxed">
                      Statutory readiness checks, DigiLocker sync & certificate expiration radar.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 border border-amber-400/30">
                    3
                  </span>
                  <div>
                    <strong className="text-white block text-xs">District & Citizen Governance</strong>
                    <span className="text-[11px] text-emerald-100/80 leading-relaxed">
                      Real-time DBT dispatches, merit rankings, and direct ministerial scrutiny tracking.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-emerald-100/70 leading-relaxed relative z-10 flex items-center justify-between">
            <span>Official Assisted Readiness System</span>
            <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-emerald-200">v2.4 Live</span>
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
                  ? "Sign in to access your Benefit Passport, document health, and application radar."
                  : "Authorized administrative gateway for platform administration and statutory policy management."}
              </p>
            </div>

            {/* High-Contrast Segmented Role Tabs */}
            <div className="p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => handleRoleTabChange("citizen")}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  selectedRoleTab === "citizen"
                    ? "bg-white text-[#234731] shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#ea580c]" />
                <span>Citizen Sign In (नागरिक)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabChange("admin")}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  selectedRoleTab === "admin"
                    ? "bg-[#234731] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Platform Admin (प्रशासन)</span>
              </button>
            </div>

            {/* Context Info Banner */}
            {selectedRoleTab === "citizen" ? (
              <div className="p-3.5 bg-[#ebf3ed]/80 rounded-2xl border border-[#c8ded0] flex items-center gap-2.5 text-xs text-slate-700">
                <FileCheck2 className="w-4 h-4 text-[#234731] shrink-0" />
                <span>
                  Log in with your registered email to view your personalized welfare passport and district rank.
                </span>
              </div>
            ) : (
              <div className="p-3.5 bg-[#ebf3ed]/80 rounded-2xl border border-[#c8ded0] flex items-center gap-2.5 text-xs text-slate-700">
                <Building2 className="w-4 h-4 text-[#234731] shrink-0" />
                <span>
                  Master Administrator Console for platform governance, scheme synchronizations, and system metrics.
                </span>
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
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-2.5 text-emerald-900 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
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
                    placeholder={selectedRoleTab === "citizen" ? "Enter your registered email" : "admin@loksamarth.in"}
                    className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:border-transparent transition-all"
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
                    className="text-xs font-bold text-[#234731] hover:text-[#183323] flex items-center gap-1 cursor-pointer"
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
                    placeholder="Enter your account password"
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-[#234731] hover:bg-[#183323] text-white shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>
                      {selectedRoleTab === "citizen" ? "Sign In to Citizen Dashboard" : "Enter Administrative Console"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Switch to Register */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>New to Lok Samarth?</span>
            <Link
              to="/register"
              className="font-bold text-[#234731] hover:text-[#183323] hover:underline flex items-center gap-1"
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

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
  Fingerprint
} from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState("citizen"); // "citizen" | "admin"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    clearError();

    if (!name.trim()) {
      setFormError("Full name is required.");
      return;
    }

    if (!email.trim()) {
      setFormError("Email address is required.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match. Please re-enter.");
      return;
    }

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password, role);
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setFormError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f7f5fa] min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#e9e1f5] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* ======================================================== */}
        {/* LEFT PANEL: Deep Plum Brand Panel (Section 29)           */}
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
        {/* RIGHT PANEL: Registration Form (Section 29)              */}
        {/* ======================================================== */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">
                Create your Benefit Passport
              </h1>
              <p className="text-xs text-[#64748b] mt-1 font-semibold leading-relaxed">
                Create an account to personalize benefit discovery, manage documents and track applications.
              </p>
            </div>

            {/* Role Purpose Toggle */}
            <div className="grid grid-cols-2 p-1 bg-[#fbf9fe] rounded-2xl border border-[#e9e1f5]">
              <button
                type="button"
                onClick={() => setRole("citizen")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  role === "citizen"
                    ? "bg-white text-[#2b0f4c] shadow-xs border border-[#e9e1f5]"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  role === "admin"
                    ? "bg-white text-[#2b0f4c] shadow-xs border border-[#e9e1f5]"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#591d8f]" />
                <span>Administrator</span>
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form className="space-y-3.5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="register-name" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "citizen" ? "e.g. Ramesh Kumar" : "e.g. Officer Sharma"}
                    className="block w-full pl-10 pr-3.5 py-2.5 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === "citizen" ? "citizen@example.com" : "officer@haqdwaar.gov.in"}
                    className="block w-full pl-10 pr-3.5 py-2.5 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="register-password" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="block w-full pl-10 pr-3.5 py-2.5 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-confirm-password" className="block text-xs font-bold text-[#4b5563] uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="block w-full pl-10 pr-3.5 py-2.5 border border-[#e9e1f5] rounded-2xl text-xs sm:text-sm bg-[#fbf9fe] focus:bg-white text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent transition-all"
                    />
                  </div>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span>Create Benefit Passport</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-[#e9e1f5] text-center">
            <p className="text-xs text-[#64748b] font-semibold">
              Already registered?{" "}
              <Link to="/login" className="font-black text-[#591d8f] hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

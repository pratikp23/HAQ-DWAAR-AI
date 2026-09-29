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
  BadgeCheck,
  FileCheck,
  HeartHandshake
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
      // Route user to appropriate portal based on selected role
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
    <div className="min-h-screen bg-[#f7f5fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Link to="/" className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-slate-900 mb-6">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Home
        </Link>
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#240b49] text-white flex items-center justify-center font-black text-xl shadow-xs">
            ह
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            हकद्वार • HaqDwaar <span className="text-[#591d8f]">AI</span>
          </span>
        </div>
        <h2 className="mt-2 text-center text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          {role === "citizen" ? "Create Citizen Account" : "Register as Scheme Officer"}
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm font-semibold text-slate-600">
          {role === "citizen"
            ? "Set up your Benefit Passport to discover personalized government welfare schemes"
            : "Platform administrator account for scheme verification and gazette analysis"}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-3xl sm:px-10 space-y-6">

          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Account Purpose
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Citizen Card */}
              <button
                type="button"
                onClick={() => setRole("citizen")}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  role === "citizen"
                    ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${role === "citizen" ? "bg-[#240b49] text-white" : "bg-slate-200 text-slate-700"}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  {role === "citizen" && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-200 text-[#591d8f]">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">Citizen / Beneficiary</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    For individuals seeking personalized benefits &amp; application tracking
                  </div>
                </div>
              </button>

              {/* Admin Card */}
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                  role === "admin"
                    ? "border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${role === "admin" ? "bg-[#240b49] text-white" : "bg-slate-200 text-slate-700"}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  {role === "admin" && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-200 text-[#591d8f]">
                      Active
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">Official / Admin</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    For officers managing verified schemes, gazettes, &amp; platform health
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Role-Specific Benefit Callout */}
          {role === "citizen" ? (
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Personalized Benefit Discovery Guarantee</span>
              </div>
              <p className="leading-relaxed text-[11px] text-emerald-900">
                Your Citizen Account connects to your private <strong>Benefit Passport</strong> to match you with central and state schemes tailored strictly to your location, occupation, caste category, and annual income.
              </p>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Administrator Trust Boundary</span>
              </div>
              <p className="leading-relaxed text-[11px] text-amber-900">
                Administrator accounts have authority to publish verified schemes and review gazette circulars. Sensitive citizen PII is strictly protected and hidden by our Data Minimization engine.
              </p>
            </div>
          )}

          {formError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="register-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "citizen" ? "e.g. citizen@example.com" : "e.g. officer@haqdwaar.gov.in"}
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="register-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                    className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                    className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-black text-white bg-[#240b49] hover:bg-[#1e0a3c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#591d8f] disabled:opacity-50 transition"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {role === "citizen" ? "Register Citizen (Discover Benefits)" : "Register Administrator (Operations)"}
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600 font-medium">
              Already registered?{" "}
              <Link to="/login" className="font-extrabold text-[#591d8f] hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

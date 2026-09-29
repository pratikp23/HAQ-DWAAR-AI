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
  CheckCircle2
} from "lucide-react";

export default function LoginPage() {
  const [selectedRoleTab, setSelectedRoleTab] = useState("citizen"); // "citizen" | "admin"
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
      setEmail("admin@haqdwaar.gov.in");
      setPassword("Admin@123");
    } else {
      // Clear or leave default
      if (email === "admin@haqdwaar.gov.in") {
        setEmail("");
        setPassword("");
      }
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

      // Smart navigation based on role & destination
      if (userRole === "admin") {
        const dest = from && from.startsWith("/admin") ? from : "/admin";
        navigate(dest, { replace: true });
      } else {
        // Citizen login
        if (selectedRoleTab === "admin") {
          setInfoMessage("Signed in as Citizen! Redirecting to your Personalized Benefit Portal...");
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
    <div className="min-h-screen bg-[#f7f5fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
        <h2 className="mt-2 text-center text-2xl font-black tracking-tight text-slate-900">
          {selectedRoleTab === "citizen" ? "Citizen Sign In" : "Official / Admin Sign In"}
        </h2>
        <p className="mt-1 text-center text-xs font-semibold text-slate-600">
          {selectedRoleTab === "citizen"
            ? "Sign in to access your Benefit Passport and discover personalized welfare benefits"
            : "Sign in to manage verified schemes, audit circulars, and monitor platform operations"}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-3xl sm:px-10 space-y-5">

          {/* Role Mode Switcher Tabs */}
          <div>
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleTabChange("citizen")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                  selectedRoleTab === "citizen"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>Citizen</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabChange("admin")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                  selectedRoleTab === "admin"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                <span>Administrator</span>
              </button>
            </div>
          </div>

          {/* Admin Auto-Fill Banner */}
          {selectedRoleTab === "admin" && (
            <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-2xl text-xs text-purple-950 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-[#591d8f] shrink-0" />
                <span className="text-[11px] font-semibold">Demo credentials loaded</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@haqdwaar.gov.in");
                  setPassword("Admin@123");
                }}
                className="text-[11px] font-bold text-[#591d8f] underline hover:text-[#240b49]"
              >
                Refill Admin
              </button>
            </div>
          )}

          {/* Citizen Benefit Callout */}
          {selectedRoleTab === "citizen" && (
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-semibold leading-relaxed">
                Connects to your personalized Benefit Passport for targeted welfare recommendations.
              </span>
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRoleTab === "citizen" ? "citizen@example.com" : "admin@haqdwaar.gov.in"}
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#591d8f] focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-black text-white bg-[#240b49] hover:bg-[#1e0a3c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#591d8f] disabled:opacity-50 transition"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  {selectedRoleTab === "citizen" ? "Sign In to Benefit Portal" : "Sign In to Admin Operations"}
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600 font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="font-extrabold text-[#591d8f] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

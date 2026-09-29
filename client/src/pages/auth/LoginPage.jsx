import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogIn, AlertCircle, ArrowLeft, RefreshCw, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    clearError();

    if (!email.trim() || !password) {
      setFormError("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
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
          <span className="text-2xl font-black text-slate-900 tracking-tight">हकद्वार • HaqDwaar <span className="text-[#591d8f]">AI</span></span>
        </div>
        <h2 className="mt-2 text-center text-2xl font-black tracking-tight text-slate-900">
          Citizen Login
        </h2>
        <p className="mt-1 text-center text-xs font-semibold text-slate-600">
          Sign in to access your Benefit Passport and track applications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-xl sm:px-10">
          {formError && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. citizen@example.com"
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="��������"
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-sm font-black text-white bg-[#240b49] hover:bg-[#1e0a3c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#591d8f] disabled:opacity-50 transition"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4 text-center">
            <p className="text-xs text-slate-600 font-medium">
              New to HaqDwaar?{" "}
              <Link to="/register" className="font-extrabold text-[#591d8f] hover:underline">
                Register as a citizen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { testAdminRoute } from "../../services/authApi";
import { 
  LogOut, 
  User, 
  Shield, 
  Mail, 
  CheckCircle, 
  ShieldAlert, 
  RefreshCw, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [adminTestResult, setAdminTestResult] = useState(null);
  const [testingAdmin, setTestingAdmin] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const runAdminTest = async () => {
    setTestingAdmin(true);
    setAdminTestResult(null);
    try {
      const res = await testAdminRoute();
      setAdminTestResult({
        allowed: true,
        status: 200,
        message: res.message,
      });
    } catch (err) {
      setAdminTestResult({
        allowed: false,
        status: err.status || 403,
        code: err.code || "FORBIDDEN",
        message: err.message || "Access forbidden. Required role: admin",
      });
    } finally {
      setTestingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
              ?
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                HaqDwaar <span className="text-blue-700">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Citizen Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-800">{user?.name}</span>
              <span className="text-slate-400">({user?.role})</span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/30 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Authentication Session Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name}!
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Your citizen account has been authenticated via JWT with password hashing (bcrypt). Benefit Passport, scheme discovery, and document readiness modules will be integrated in upcoming phases.
            </p>
          </div>
        </div>

        {/* User Identity Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-slate-900 font-bold">
              <User className="w-5 h-5 text-blue-600" />
              <h3>Citizen Identity</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-slate-500 block">Full Name</span>
                <span className="font-semibold text-slate-800">{user?.name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Email Address</span>
                <span className="font-semibold text-slate-800 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {user?.email}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Assigned Role</span>
                <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Role: {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Role-Based Access Control Verification */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-slate-900 font-bold">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3>Role-Based Access Control (RBAC) Test</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">GET /api/auth/admin-test</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Test whether role authorization works in practice. As a logged-in citizen, attempting to access an administrator-restricted endpoint should yield an HTTP 403 Forbidden rejection.
            </p>

            <div>
              <button
                onClick={runAdminTest}
                disabled={testingAdmin}
                className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
              >
                {testingAdmin ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Testing Authorization...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    Test Admin Endpoint Access
                  </>
                )}
              </button>
            </div>

            {adminTestResult && (
              <div
                className={`p-4 rounded-lg border text-xs space-y-1.5 ${
                  adminTestResult.allowed
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                <div className="flex items-center space-x-2 font-bold">
                  {adminTestResult.allowed ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                  )}
                  <span>
                    Status {adminTestResult.status}: {adminTestResult.code || "SUCCESS"}
                  </span>
                </div>
                <p className="text-slate-700">{adminTestResult.message}</p>
                {!adminTestResult.allowed && (
                  <p className="text-slate-500 font-medium pt-1">
                    ? Verified: Ordinary citizens cannot access administrator routes (HTTP 403 enforcement confirmed).
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Phase 3 Roadmap Notice */}
        <div className="bg-slate-100 rounded-xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">Next: Benefit Passport (Phase 3)</h4>
            <p className="text-xs text-slate-600">
              Persistent profile capturing education, income range, student/kisan details, and profile completeness indicator.
            </p>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="inline-flex items-center text-xs font-semibold text-blue-700 hover:text-blue-800"
          >
            Visit Landing Page <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

      </main>
    </div>
  );
}

import React from "react";
import { Navigate, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { RefreshCw, ShieldAlert, ArrowLeft, LogOut, KeyRound } from "lucide-react";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-700 space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium">Verifying citizen session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const handleSwitchToAdmin = async () => {
      await logout();
      navigate("/login", { state: { from: location } });
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border border-red-200 shadow-sm text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shadow-xs">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Admin Access Restricted
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You are currently signed in as <strong className="text-slate-900">{user.email}</strong> with role <span className="font-bold text-amber-700 uppercase px-2 py-0.5 rounded-md bg-amber-100">{user.role}</span>.
            </p>
            <p className="text-xs text-slate-500">
              The <strong>/admin</strong> console is restricted strictly to authorized platform administrators (<span className="font-semibold text-slate-700">{requiredRole}</span>).
            </p>
          </div>

          {/* Admin Credentials Helper */}
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl text-left space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#591d8f]">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Default Administrator Account:</span>
            </div>
            <div className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded-xl border border-purple-100">
              <div><strong>Email:</strong> admin@haqdwaar.gov.in</div>
              <div><strong>Password:</strong> Admin@123</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <Link
              to="/dashboard"
              className="w-full sm:w-1/2 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Citizen Portal
            </Link>

            <button
              onClick={handleSwitchToAdmin}
              className="w-full sm:w-1/2 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold bg-[#240b49] text-white hover:bg-[#1e0a3c] transition-colors shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

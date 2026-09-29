import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ShieldAlert, Home, LayoutDashboard, Search } from "lucide-react";

export default function NotFoundPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#e9e1f5] shadow-lg p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight mt-2">
            Page Not Found
          </h1>
          <p className="text-xs text-[#64748b] leading-relaxed max-w-sm mx-auto">
            The page or scheme resource you are looking for does not exist or may have been relocated.
          </p>
        </div>

        <div className="p-4 bg-[#fbf9fe] rounded-2xl border border-[#e9e1f5] text-xs text-[#64748b] text-left">
          <p className="font-bold text-[#0f172a] mb-1">Looking for government schemes?</p>
          <p>You can search our database of verified government schemes or return to your citizen dashboard.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
          {isAuthenticated ? (
            <Link
              to={user?.role === "admin" ? "/admin" : "/dashboard"}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl bg-[#2b0f4c] hover:bg-[#1e0a3c] text-white text-xs font-black shadow-xs transition"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              {user?.role === "admin" ? "Admin Console" : "My Dashboard"}
            </Link>
          ) : (
            <Link
              to="/browse-schemes"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black shadow-xs transition"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Schemes
            </Link>
          )}

          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl bg-[#fbf9fe] hover:bg-[#f7f5fa] text-[#0f172a] border border-[#e9e1f5] text-xs font-black transition"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

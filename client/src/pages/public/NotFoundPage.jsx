import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { ShieldAlert, Home, LayoutDashboard, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
              Error 404 • Page Not Found
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Page Not Found
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              The page or scheme resource you are looking for does not exist or may have been relocated.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 text-left">
            <p className="font-semibold text-slate-700 mb-1">Looking for government schemes?</p>
            <p>You can search our database of verified government schemes or return to your citizen portal.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {isAuthenticated ? (
              <Link
                to={user?.role === "admin" ? "/admin" : "/dashboard"}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#240b49] hover:bg-[#1e0a3c] text-white text-xs font-bold shadow-xs transition"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                {user?.role === "admin" ? "Admin Console" : "My Citizen Dashboard"}
              </Link>
            ) : (
              <Link
                to="/browse-schemes"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Schemes
              </Link>
            )}

            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

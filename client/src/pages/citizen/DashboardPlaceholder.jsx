import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getProfile } from "../../services/profileApi";
import { testAdminRoute } from "../../services/authApi";
import ProfileCompleteness from "../../components/passport/ProfileCompleteness";
import { 
  LogOut, 
  User, 
  Shield, 
  Mail, 
  CheckCircle, 
  ShieldAlert, 
  RefreshCw, 
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  Compass
} from "lucide-react";

export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [completeness, setCompleteness] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [adminTestResult, setAdminTestResult] = useState(null);
  const [testingAdmin, setTestingAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await getProfile();
        if (isMounted && res?.data) {
          setProfileData(res.data.profile);
          setCompleteness(res.data.profileCompleteness || 0);
        }
      } catch (err) {
        console.warn("Failed to load profile for dashboard:", err.message);
      } finally {
        if (isMounted) setLoadingProfile(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-16">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
              ह
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/30 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Benefit Passport Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Good day, {user?.name}
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed">
                Your Benefit Passport powers HaqDwaar's deterministic matching engine. Keep it up to date to discover scholarships, subsidies, and citizen benefits tailored to your life situation.
              </p>
            </div>

            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2.5">
              <Link
                to="/dashboard/recommendations"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Benefits For You
              </Link>
              <Link
                to="/dashboard/schemes"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-colors border border-blue-400/40"
              >
                <Compass className="w-4 h-4 mr-1.5" />
                All Schemes
              </Link>
              <Link
                to="/dashboard/benefit-passport"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm bg-white text-blue-900 hover:bg-blue-50 shadow-md transition-colors"
              >
                <FileText className="w-4 h-4 mr-1.5 text-blue-700" />
                {completeness >= 100 ? "Passport" : "Complete"}
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin/schemes"
                  className="inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-colors"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Benefit Passport Completeness Card */}
        <div className="space-y-2">
          {loadingProfile ? (
            <div className="p-6 bg-white rounded-xl border border-slate-200 flex items-center justify-center space-x-2 text-xs text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Calculating profile completeness...</span>
            </div>
          ) : (
            <ProfileCompleteness completeness={completeness} />
          )}
        </div>

        {/* Passport Status Breakdown */}
        {profileData && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Benefit Passport Summary</h3>
              <Link
                to="/dashboard/benefit-passport"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800"
              >
                Edit Passport →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Location</span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {profileData.location?.state
                    ? `${profileData.location.district || ""}, ${profileData.location.state}`
                    : "Not specified"}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Education</span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {profileData.education?.qualification || "Not specified"}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Occupation</span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {profileData.occupation?.occupationType || "Not specified"}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Income Range</span>
                <span className="font-bold text-slate-800 mt-1 block">
                  {profileData.occupation?.incomeRange || "Not specified"}
                </span>
              </div>
            </div>

            {profileData.needs && profileData.needs.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 block mb-1.5">Registered Needs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.needs.map((n) => (
                    <span
                      key={n}
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Identity Details Card & RBAC Test */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3 text-slate-900 font-bold">
              <User className="w-5 h-5 text-blue-600" />
              <h3>Citizen Account</h3>
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
                <span className="text-xs text-slate-500 block">Account Role</span>
                <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Role-Based Access Control Verification */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-slate-900 font-bold">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3>RBAC Authorization Enforcement</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">GET /api/auth/admin-test</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Verify that role authorization protects admin resources. Ordinary citizens attempting to access admin endpoints receive an HTTP 403 Forbidden rejection.
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
              </div>
            )}
          </div>
        </div>

        {/* Personalized Matching Engine Banner (Phase 5) */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-xl p-5 border border-emerald-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                Phase 5 Active
              </span>
              <h4 className="font-bold text-white text-sm">Deterministic Matching &amp; "Why This Match?"</h4>
            </div>
            <p className="text-xs text-emerald-100">
              Personalized benefit recommendations matched deterministically against your Benefit Passport with complete rule breakdown.
            </p>
          </div>
          <Link
            to="/dashboard/recommendations"
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex-shrink-0 shadow transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            View My Matches <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Verified Schemes Catalog Link Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-xl p-5 border border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Registry
              </span>
              <h4 className="font-bold text-white text-sm">Verified Scheme Registry &amp; Directory</h4>
            </div>
            <p className="text-xs text-slate-300">
              Browse 10 authentic, verified Central &amp; State government schemes across Students, Kisans, and General welfare with official portal links.
            </p>
          </div>
          <Link
            to="/dashboard/schemes"
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex-shrink-0 shadow transition-colors"
          >
            Open Scheme Catalog <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

      </main>
    </div>
  );
}

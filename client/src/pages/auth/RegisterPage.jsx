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
  Phone,
  Eye,
  EyeOff,
  ChevronRight,
  Shield,
  MapPin,
  Check,
  KeyRound
} from "lucide-react";

const INDIAN_STATES = [
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Bihar",
  "Maharashtra",
  "Rajasthan",
  "Delhi NCR",
  "Gujarat",
  "West Bengal",
  "Tamil Nadu",
  "Karnataka",
  "Punjab",
  "Haryana",
  "Chhattisgarh",
  "Jharkhand",
  "Odisha",
  "Kerala",
  "Andhra Pradesh",
  "Telangana",
  "Assam",
  "Uttarakhand",
  "Himachal Pradesh",
  "Other State / UT"
];

export default function RegisterPage() {
  // Citizen Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("Madhya Pradesh");
  const [district, setDistrict] = useState("Jabalpur");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Optional Admin Clearance Key for authorized platform administration
  const [showAdminKeyInput, setShowAdminKeyInput] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");

  const [citizenError, setCitizenError] = useState("");
  const [citizenSubmitting, setCitizenSubmitting] = useState(false);

  const { register, clearError } = useAuth();
  const navigate = useNavigate();

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setCitizenError("");
    clearError();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setCitizenError("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      setCitizenError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setCitizenError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setCitizenError("Passwords do not match. Please re-enter.");
      return;
    }

    setCitizenSubmitting(true);
    try {
      // Registers user into local storage database & initiates instant auto-login
      const result = await register(
        trimmedName,
        trimmedEmail,
        password,
        adminPasscode.trim() === "LOK-ADMIN-2026" ? "super_admin" : "citizen",
        {
          district: district.trim() || "Jabalpur",
          state: state || "Madhya Pradesh",
          phone: phone.trim() || "",
          adminPasscode: adminPasscode.trim()
        }
      );

      // If user had admin passkey, route to /admin; otherwise /dashboard
      if (result?.user?.role && ["admin", "super_admin"].includes(result.user.role)) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setCitizenError(err.message || "Registration failed. Please try again.");
    } finally {
      setCitizenSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8faf8] min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* ======================================================== */}
        {/* LEFT PANEL: Civic Identity & Benefit Explainer           */}
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

            {/* Architecture Highlights */}
            <div className="space-y-3 pt-2 text-xs">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#fb923c] block">
                Citizen Benefits
              </span>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-2 text-xs">
                  <Sparkles className="w-4 h-4 text-[#fb923c]" />
                  <span>Instant Eligibility Matching</span>
                </div>
                <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                  Direct match against 10+ central and state schemes including NSP, PM-JAY, and Surya Ghar based on your profile.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-2 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Encrypted Benefit Passport</span>
                </div>
                <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                  Your details and uploaded certificates remain secure in your browser vault, pre-verifying you for instant DBT disbursements.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="font-bold text-white flex items-center space-x-2 text-xs">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>District Welfare Standing</span>
                </div>
                <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                  See where you stand in your district merit rankings and track ministerial scrutiny milestones in real-time.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-emerald-100/70 leading-relaxed relative z-10 flex items-center justify-between">
            <span>Direct Citizen Welfare Service</span>
            <span className="font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-emerald-200">Instant Access</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Clean & Spacious Registration Form         */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Create Citizen Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Register to explore 10+ Central &amp; State Schemes, unlock your Benefit Passport, and track applications.
              </p>
            </div>

            {/* Error Alert */}
            {citizenError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <span>{citizenError}</span>
              </div>
            )}

            {/* Registration Form */}
            <form className="space-y-4" onSubmit={handleCitizenSubmit}>
              {/* Full Name */}
              <div>
                <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name (पूरा नाम) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pratik Pathak"
                    className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address (ईमेल) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Number (मोबाइल)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="reg-state" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    State (राज्य)
                  </label>
                  <select
                    id="reg-state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full py-3 px-3.5 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:border-transparent transition-all"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="reg-district" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    District (जिला)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-district"
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Jabalpur"
                      className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="reg-pass" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] font-bold text-[#234731] hover:text-[#183323] flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? "Hide" : "Show"}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-pass"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-cpass" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="reg-cpass"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#234731] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Administrative Clearance Expandable Link */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminKeyInput(!showAdminKeyInput)}
                  className="text-[11px] font-bold text-slate-500 hover:text-[#234731] flex items-center gap-1.5 cursor-pointer transition"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Authorized Platform Official / Administrator?</span>
                </button>

                {showAdminKeyInput && (
                  <div className="mt-2 p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-1.5 animate-in fade-in">
                    <label htmlFor="reg-admin-passcode" className="block text-[10px] font-black uppercase tracking-wider text-amber-900">
                      Administrative Clearance Key
                    </label>
                    <input
                      id="reg-admin-passcode"
                      type="password"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="Enter security clearance key"
                      className="w-full py-2 px-3 border border-amber-300 rounded-xl text-xs bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#234731]"
                    />
                    <p className="text-[10px] text-amber-800">
                      Authorizes elevated administrative dashboard privileges upon registration.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={citizenSubmitting}
                className="w-full mt-2 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-[#234731] hover:bg-[#183323] text-white shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {citizenSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Citizen Account &amp; Start Discovery</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Switch to Login */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="font-bold text-[#234731] hover:text-[#183323] hover:underline flex items-center gap-1"
            >
              <span>Sign In instead</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Copy,
  Check,
  Eye,
  Share2,
  Pencil,
  FileText,
  Trophy,
  FolderGit2,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Download,
  Plus,
  X,
  CheckCircle2,
  Globe,
  Calendar,
  Layers,
  HelpCircle,
  AlertCircle,
  Coins,
  Shield,
  CreditCard,
  FileCheck2,
  HeartPulse,
  Sun,
  Tractor,
  GraduationCap,
  Users,
  MapPin,
  QrCode,
  TrendingUp,
  Info,
  CheckCircle,
  ArrowUpRight,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { SpotlightCard, NumberTicker } from "../../components/common/ReactBits";

/**
 * Lok Samarth — Citizen Civic Profile & Welfare Readiness Console
 * Tailored for Pratik Pathak (SRIT Jabalpur) & Lok Samarth Civic Architecture:
 * - HeroUI Card structure for Lok Samarth Welfare Rankings
 * - Public Passport Bar: loksamarth.in/u/pratikpathak
 * - Accurate technical scholar bio, statutory signals & DBT awards
 */
export default function CitizenProfile() {
  const { user, updateUser } = useAuth();
  const location = useLocation();

  // Profile Data for Pratik Pathak
  const [profileData, setProfileData] = useState({
    name: "Pratik Pathak",
    headline: "Student Innovator & Engineer • Technical Degree & Youth Welfare",
    institution: "Shri Ram Institute of Technology (SRIT), Jabalpur",
    location: "Jabalpur, Madhya Pradesh, India",
    bio: "Currently pursuing B.Tech in Computer Science and Engineering at Shri Ram Institute of Technology (SRIT), Jabalpur. Actively exploring National Scholarship Portal (NSP) Central Sector grants, AICTE Pragati schemes, PM-YASASVI merit allowances, and state technical innovation subsidies. 100% Aadhaar KYC & DigiLocker verified.",
    username: "pratikpathak",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    points: 344,
    districtRank: 1126835,
    percentile: "TOP 12% IN DISTRICT",
    achievementsCount: 2,
    projectsCount: 2,
    certificatesCount: 9,
    passportDocName: "Pratik Pathak - Statutory Benefit Passport (DigiLocker Verified).pdf",
    signals: [
      "Full-Time Technical Degree Student (SRIT Jabalpur)",
      "NSP Central Sector Scheme (CSSS) Eligible",
      "AICTE Technical Innovation Fellow Candidate",
      "Aadhaar-Linked Bank (DBT Active with SBI)",
      "Domicile: Madhya Pradesh (Jabalpur District)",
      "Annual Family Income < ₹4.50 Lakh (OBC Category)",
      "DigiLocker Document Vault: 100% Verified",
      "Academic Merit: Top 10% in Engineering Cohort",
      "Free Coaching Scheme (GATE / UPSC / PSC) Eligible",
      "MP State Yuva Kaushal Skill Grant Registered",
      "PM Surya Ghar Muft Bijli Subsidy Applied",
      "Ayushman Bharat ABHA Digital Health ID Created",
      "10th & 12th Board Marksheets Digitally Signed"
    ]
  });

  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddSignalModal, setShowAddSignalModal] = useState(false);
  const [showRankingInfoModal, setShowRankingInfoModal] = useState(false);
  const [newSignalText, setNewSignalText] = useState("");
  const [showAllSignals, setShowAllSignals] = useState(false);

  // Sync user from AuthContext if user exists and has a custom name
  useEffect(() => {
    if (user?.name && user.name !== "Citizen") {
      setProfileData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  // Handle Copy Profile Link
  const publicUrl = `loksamarth.in/u/${profileData.username}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${publicUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Add a new eligibility signal
  const handleAddSignal = (e) => {
    e.preventDefault();
    if (!newSignalText.trim()) return;
    setProfileData((prev) => ({
      ...prev,
      signals: [...prev.signals, newSignalText.trim()]
    }));
    setNewSignalText("");
    setShowAddSignalModal(false);
  };

  // Remove eligibility signal
  const handleRemoveSignal = (signalToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      signals: prev.signals.filter((s) => s !== signalToRemove)
    }));
  };

  // Save profile edits
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = {
      name: formData.get("name") || profileData.name,
      headline: formData.get("headline") || profileData.headline,
      institution: formData.get("institution") || profileData.institution,
      location: formData.get("location") || profileData.location,
      bio: formData.get("bio") || profileData.bio
    };
    setProfileData((prev) => ({ ...prev, ...updated }));
    if (updateUser) {
      updateUser({ name: updated.name });
    }
    setShowEditProfileModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
      
      {/* ============================================================ */}
      {/* 1. TOP BREADCRUMB & PUBLIC PASSPORT LINK SECTION             */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        
        {/* Breadcrumb: Home / Citizen Profile */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium mb-3">
          <Link to="/" className="hover:text-slate-800 transition flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to="/dashboard" className="hover:text-slate-800 transition">
            Citizen Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-[#112318] font-bold">Welfare Profile &bull; {profileData.name}</span>
        </nav>

        {/* Public Citizen Passport Link Bar with Copy + Preview + Share Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
          
          {/* Public Profile Link with Lok Samarth badge and copy button */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#112318] to-emerald-700 text-white flex items-center justify-center font-black text-[11px] shadow-2xs">
              LS
            </div>
            <span className="text-slate-400 font-normal">loksamarth.in/u/</span>
            <span className="font-bold text-slate-900">{profileData.username}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy Citizen Passport Link"
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            {copiedLink && (
              <span className="text-[11px] font-bold text-emerald-600 animate-in fade-in">
                Copied!
              </span>
            )}
          </div>

          {/* Action Buttons: Preview & Share with CSC / College / Panchayat */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer ${
                isPreviewMode
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreviewMode ? "Exit Preview" : "Public View"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#112318] hover:bg-[#1a3826] text-white transition cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share Passport</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN TWO-COLUMN UNSTOP-STYLE CIVIC LAYOUT                 */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Large Citizen Profile Card & Metrics (5 col)*/}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Primary Citizen Profile Card */}
            <SpotlightCard className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 relative">
              
              {/* Edit Pencil in Top Right */}
              {!isPreviewMode && (
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(true)}
                  className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
                  title="Edit Citizen Details"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}

              {/* Large Circular Avatar with Tiranga Saffron-White-Green Ring */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-tr from-[#ea580c] via-emerald-400 to-[#112318] shadow-md">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                    </div>
                  </div>
                  {/* Small Verified Government Badge */}
                  <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  </div>
                </div>
              </div>

              {/* Citizen Name & Primary Welfare Category */}
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {profileData.name}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-emerald-800">
                  {profileData.headline}
                </p>
                <p className="text-xs text-slate-600 font-semibold">
                  {profileData.institution}
                </p>
                <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{profileData.location}</span>
                </p>
              </div>

              {/* Bio with "Read more" toggle */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed text-center sm:text-left">
                <p className="inline">
                  {isBioExpanded
                    ? profileData.bio
                    : `${profileData.bio.slice(0, 110)}... `}
                </p>
                <button
                  type="button"
                  onClick={() => setIsBioExpanded(!isBioExpanded)}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer inline ml-1"
                >
                  {isBioExpanded ? "Show less" : "Read more"}
                </button>
              </div>

              {/* Statutory Benefit Passport Card */}
              <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[170px] sm:max-w-[210px]">
                      {profileData.passportDocName}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      100% Aadhaar KYC &bull; Ministry Signed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    to="/dashboard/benefit-passport"
                    className="p-1.5 bg-white text-emerald-800 hover:bg-emerald-100 rounded-lg transition border border-emerald-200 shadow-2xs"
                    title="Open Benefit Passport"
                  >
                    <Download className="w-4 h-4" />
                  </Link>
                  {!isPreviewMode && (
                    <Link
                      to="/dashboard/benefit-passport"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-emerald-100/60 rounded-lg transition"
                      title="Update Passport"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* 3 Colorful Metric Cards (Approved Benefits, Active Applications, DigiLocker Docs) */}
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                
                {/* 1. Approved Benefits (Yellow/Amber) */}
                <div className="bg-[#fef9c3] rounded-2xl p-3 border border-[#fef08a] flex flex-col justify-between h-22">
                  <div className="flex items-center justify-between text-amber-800">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-900 block leading-tight">
                      Approved
                    </span>
                    <span className="text-lg font-black text-amber-950">
                      0{profileData.achievementsCount} Schemes
                    </span>
                  </div>
                </div>

                {/* 2. Active Enrolments (Indigo/Lavender) */}
                <div className="bg-[#ede9fe] rounded-2xl p-3 border border-[#ddd6fe] flex flex-col justify-between h-22">
                  <div className="flex items-center justify-between text-indigo-700">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-indigo-900 block leading-tight">
                      In-Progress
                    </span>
                    <span className="text-lg font-black text-indigo-950">
                      0{profileData.projectsCount} Active
                    </span>
                  </div>
                </div>

                {/* 3. DigiLocker Certificates (Pink/Rose) */}
                <div className="bg-[#ffe4e6] rounded-2xl p-3 border border-[#fecdd3] flex flex-col justify-between h-22">
                  <div className="flex items-center justify-between text-rose-700">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-rose-900 block leading-tight">
                      DigiLocker
                    </span>
                    <span className="text-lg font-black text-rose-950">
                      0{profileData.certificatesCount} Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Banner: Generate Statutory Benefit Passport */}
              <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#112318] via-[#1a3826] to-[#234731] p-3.5 text-white flex items-center justify-between shadow-sm border border-emerald-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-tight leading-tight text-white">
                      Statutory DigiLocker Sync
                    </div>
                    <div className="text-[10px] text-emerald-200/80 font-medium">
                      One-click paperless scheme applications
                    </div>
                  </div>
                </div>

                <Link
                  to="/dashboard/benefit-passport"
                  className="px-3.5 py-1.5 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black shrink-0 transition shadow-xs"
                >
                  Verify Now
                </Link>
              </div>

            </SpotlightCard>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: HeroUI & ReactBits Cards                   */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* ====================================================== */}
            {/* 1. HEROUI CARD: Lok Samarth Welfare Readiness & Rank   */}
            {/* ====================================================== */}
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.12)"
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* HeroUI CardHeader */}
              <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/80 via-white to-emerald-50/20">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#112318] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Lok Samarth Welfare Rankings
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Live Official
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Jabalpur District Standing &bull; Technical Scholar Cohort &bull; Pratik Pathak
                    </p>
                  </div>
                </div>

                {/* HeroUI Chip + "How it works?" modal trigger */}
                <button
                  type="button"
                  onClick={() => setShowRankingInfoModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition cursor-pointer self-start sm:self-auto shadow-2xs"
                >
                  <Info className="w-3.5 h-3.5 text-emerald-700" />
                  <span>How it works?</span>
                </button>
              </div>

              {/* HeroUI CardBody: 2 Primary Metric Segments */}
              <div className="p-5 sm:p-6 space-y-5">
                
                {/* Segment A: Dual HeroUI Metric Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Tile 1: Global & District Rank */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/30 border border-emerald-100 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span className="flex items-center gap-1.5 text-emerald-950 font-black">
                        <Globe className="w-3.5 h-3.5 text-emerald-700" />
                        District Merit Rank
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wide">
                        {profileData.percentile}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        #<NumberTicker value={profileData.districtRank} />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Top 12% in Jabalpur District across 32 Million+ registered citizens nationwide.
                      </p>
                    </div>
                  </div>

                  {/* Tile 2: Civic Readiness Points */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 border border-amber-100 shadow-2xs flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                      <span className="flex items-center gap-1.5 text-amber-950 font-black">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Civic Readiness Score
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black tracking-wide">
                        94% Ready
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                        <NumberTicker value={profileData.points} />
                        <span className="text-sm font-bold text-amber-700">/ 400 Pts</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Pre-verified against 10+ central and state statutory entitlement portals.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Segment B: Humanized HeroUI Verification Checklist */}
                <div className="space-y-3 pt-1">
                  
                  {/* Header Row */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <div>
                      <span className="font-black text-slate-800 text-sm tracking-tight block">
                        Verification Checklist
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Essential documents linked for direct scholarship &amp; benefit disbursal
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] shrink-0 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      All Proofs Linked (3/3)
                    </span>
                  </div>

                  {/* 3 Real, Humanized HeroUI Status Tiles */}
                  <div className="space-y-2.5">
                    
                    {/* Item 1: Aadhaar & Bank Seeding */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/90 hover:bg-emerald-50/40 border border-slate-200/80 transition-colors flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                              Aadhaar &amp; Bank DBT Seeding
                            </h5>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            State Bank of India &bull; Account linked for direct scholarship transfer
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/90 text-emerald-800 text-[11px] font-black shrink-0">
                        <Check className="w-3 h-3 text-emerald-700" />
                        Active
                      </span>
                    </div>

                    {/* Item 2: College Enrollment */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/90 hover:bg-blue-50/40 border border-slate-200/80 transition-colors flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5 text-blue-700" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                              College Enrollment &amp; Student ID
                            </h5>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            Shri Ram Institute of Technology (SRIT) &bull; B.Tech Computer Science
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100/90 text-blue-800 text-[11px] font-black shrink-0">
                        <Check className="w-3 h-3 text-blue-700" />
                        Confirmed
                      </span>
                    </div>

                    {/* Item 3: Domicile & Income */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/90 hover:bg-amber-50/40 border border-slate-200/80 transition-colors flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                          <FileCheck2 className="w-5 h-5 text-amber-700" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                              MP Domicile &amp; Income Certificate
                            </h5>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            Jabalpur District Administration &bull; Valid for Academic Year 2025–26
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/90 text-amber-900 text-[11px] font-black shrink-0">
                        <Check className="w-3 h-3 text-amber-700" />
                        Verified
                      </span>
                    </div>

                  </div>
                </div>

              </div>

              {/* HeroUI CardFooter (Humanized & Helpful) */}
              <div className="px-5 sm:px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>DigiLocker Verified &bull; Official Government Records Linked</span>
                </div>

                <Link
                  to="/dashboard/documents"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 font-bold text-slate-800 hover:text-emerald-950 transition shadow-2xs hover:shadow-xs self-start sm:self-auto cursor-pointer"
                >
                  <span>View Document Vault</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
                </Link>
              </div>

            </SpotlightCard>

            {/* ====================================================== */}
            {/* 2. HEROUI CARD: Verified Eligibility Signals (Skills)  */}
            {/* ====================================================== */}
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.08)"
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* HeroUI CardHeader */}
              <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Verified Eligibility Signals
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Statutory criteria pre-matched with central scheme eligibility rules
                  </p>
                </div>
                {!isPreviewMode && (
                  <button
                    type="button"
                    onClick={() => setShowAddSignalModal(true)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer shadow-2xs border border-slate-200/60"
                    title="Add / Manage Signals"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* HeroUI CardBody: Chip Grid */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap gap-2.5">
                  {(showAllSignals
                    ? profileData.signals
                    : profileData.signals.slice(0, 6)
                  ).map((signal, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-emerald-50/90 text-emerald-950 border border-emerald-200/80 shadow-2xs hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{signal}</span>
                      {!isPreviewMode && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSignal(signal)}
                          className="w-4 h-4 rounded-full bg-emerald-200/60 hover:bg-emerald-300 text-emerald-800 flex items-center justify-center text-xs font-black transition cursor-pointer ml-1"
                          title="Remove Signal"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}

                  {/* "+more" HeroUI Expand Toggle */}
                  {profileData.signals.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setShowAllSignals(!showAllSignals)}
                      className="inline-flex items-center px-4 py-2 rounded-full text-xs font-black text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer shadow-2xs"
                    >
                      {showAllSignals
                        ? "Show less"
                        : `+${profileData.signals.length - 6} more signals`}
                    </button>
                  )}
                </div>
              </div>
            </SpotlightCard>

            {/* ====================================================== */}
            {/* 3. HEROUI CARD: Approved Scheme Benefits & DBT         */}
            {/* ====================================================== */}
            <SpotlightCard
              spotlightColor="rgba(245, 158, 11, 0.08)"
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* HeroUI CardHeader */}
              <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Approved Scheme Benefits &amp; DBT
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Statutory approvals credited directly to bank account
                  </p>
                </div>
                {!isPreviewMode && (
                  <Link
                    to="/dashboard/applications"
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition shadow-2xs border border-slate-200/60"
                    title="View All Applications"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* HeroUI CardBody: Detailed Scheme Tiles */}
              <div className="p-5 sm:p-6 space-y-3.5">
                
                {/* 1. National Scholarship Scheme */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/30 border border-emerald-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                          NSP Central Sector Scheme of Scholarship (CSSS)
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          Disbursed
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                        <span>Ministry of Education</span>
                        <span>&bull;</span>
                        <span>AY 2025-26</span>
                        <span>&bull;</span>
                        <span className="font-mono text-slate-400">Ref: NSP/2025/SRIT-8841</span>
                      </div>
                    </div>
                  </div>

                  {/* HeroUI Amount Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pl-14 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="text-base sm:text-lg font-black text-emerald-800">
                      ₹20,000 <span className="text-xs font-semibold text-slate-500">/ Year</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Direct Bank Transfer (DBT)
                    </span>
                  </div>
                </div>

                {/* 2. Ayushman Bharat PM-JAY */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-white to-blue-50/30 border border-blue-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                          Ayushman Bharat Pradhan Mantri Jan Arogya (PM-JAY)
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black">
                          Golden Card Active
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                        <span>National Health Authority (NHA)</span>
                        <span>&bull;</span>
                        <span className="font-mono text-slate-400">Ref: ABHA/2026/0912</span>
                      </div>
                    </div>
                  </div>

                  {/* HeroUI Amount Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pl-14 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="text-base sm:text-lg font-black text-blue-800">
                      ₹5,00,000
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Cashless Health Cover
                    </span>
                  </div>
                </div>

              </div>
            </SpotlightCard>

            {/* ====================================================== */}
            {/* 4. HEROUI CARD: Active Applications & Scheme Radar     */}
            {/* ====================================================== */}
            <SpotlightCard
              spotlightColor="rgba(234, 88, 12, 0.08)"
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* HeroUI CardHeader */}
              <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Active Applications &amp; Scheme Radar
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live lifecycle tracking across ministerial scrutiny gates
                  </p>
                </div>
                <Link
                  to="/dashboard/applications"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-emerald-800 text-xs font-black transition cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* HeroUI CardBody: Active Application Details & Stepper */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-2xs space-y-3.5">
                  
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                          PM Surya Ghar Muft Bijli Yojana (Rooftop Solar Subsidy)
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Stage: Field Officer Technical Inspection &bull; Subsidy: Up to ₹78,000 Direct DBT
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider self-start shrink-0">
                      Verification Stage
                    </span>
                  </div>

                  {/* HeroUI 4-Step Visual Stepper */}
                  <div className="pt-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 text-[11px] shadow-2xs">
                          ✓
                        </div>
                        <span className="text-emerald-800">Submitted</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 text-[11px] shadow-2xs">
                          ✓
                        </div>
                        <span className="text-emerald-800">Docs Verified</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center mb-1 text-[11px] ring-4 ring-amber-100 shadow-2xs animate-pulse">
                          ⚡
                        </div>
                        <span className="text-amber-900 font-black">Field Inspection</span>
                      </div>
                      <div className="flex flex-col items-center opacity-40">
                        <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center mb-1 text-[11px]">
                          4
                        </div>
                        <span className="text-slate-500">DBT Disbursed</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
                    <span className="font-mono text-[11px] text-slate-600">Ref: LOK/2026/SOLAR-8832</span>
                    <Link
                      to="/dashboard/applications"
                      className="font-black text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
                    >
                      <span>Track Progress</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                </div>
              </div>
            </SpotlightCard>

          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MODALS (Edit Profile, Add Signal, Share, Ranking Info)    */}
      {/* ============================================================ */}
      
      {/* How Rankings Work Modal */}
      {showRankingInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-900 text-sm">How Lok Samarth Rankings Work</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRankingInfoModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                The <strong>Lok Samarth Citizen Readiness Index</strong> measures your application preparedness across statutory Central and State schemes:
              </p>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1.5">
                <div className="font-bold text-xs">Score Breakdown (Max 400 Pts):</div>
                <div>&bull; <strong>150 Pts:</strong> Aadhaar e-KYC &amp; NPCI Direct Bank Transfer linking.</div>
                <div>&bull; <strong>150 Pts:</strong> DigiLocker verified academic, income &amp; caste documents.</div>
                <div>&bull; <strong>100 Pts:</strong> Timely verification by District/Tehsil Nodal Officers.</div>
              </div>
              <p>
                Citizens with <strong>300+ Points</strong> get access to <strong>Fast-Track Assisted Door 1</strong>, ensuring 0% document rejection at government review gates.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRankingInfoModal(false)}
                className="px-4 py-2 bg-[#112318] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Edit Citizen Profile</h3>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Citizen Name
                </label>
                <input
                  name="name"
                  defaultValue={profileData.name}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Welfare Category / Specialization
                </label>
                <input
                  name="headline"
                  defaultValue={profileData.headline}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College / Institute / Organization
                </label>
                <input
                  name="institution"
                  defaultValue={profileData.institution}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location (District, State, Country)
                </label>
                <input
                  name="location"
                  defaultValue={profileData.location}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Citizen Bio / Welfare Objectives
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={profileData.bio}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-[#112318] hover:bg-[#1a3826] rounded-xl cursor-pointer transition shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Eligibility Signal Modal */}
      {showAddSignalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-sm">Add Verified Eligibility Signal</h3>
              <button
                type="button"
                onClick={() => setShowAddSignalModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSignal} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Eligibility Signal / Certificate Tag
                </label>
                <input
                  type="text"
                  value={newSignalText}
                  onChange={(e) => setNewSignalText(e.target.value)}
                  placeholder="e.g. GATE Qualified, PM-YASASVI"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSignalModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-[#112318] hover:bg-[#1a3826] rounded-xl cursor-pointer"
                >
                  Add Signal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Passport Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-sm">Share Citizen Benefit Passport</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Share your official verified Benefit Passport URL with Gram Panchayat Nodal Officers, CSC VLE operators, or scheme verification desks:
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-700 truncate">
                https://loksamarth.in/u/{profileData.username}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-[#112318] hover:bg-[#1a3826] text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

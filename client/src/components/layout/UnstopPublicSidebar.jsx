import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Tractor,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Building,
  Briefcase,
  Shield,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Plus,
  Sparkles,
  Building2,
  ExternalLink,
  X,
  Compass,
  Mic,
  Search,
  CheckCircle2,
  ArrowRight,
  Check,
  Coins,
  CreditCard,
  FileText,
  Sun,
  Droplets,
  Award,
  BookOpen,
  Flame,
  Clock,
  Users,
  LogOut,
  User,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton, UserProfile } from "../common/Skeleton";

export default function UnstopPublicSidebar({ isOpenMobile, onCloseMobile }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const location = useLocation();
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPersonaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      to: "/",
      exact: true,
      hasFlyout: true,
      subItems: [
        { label: "Scheme Discovery (350+)", icon: Search, to: "/browse-schemes" },
        { label: "Benefit Passport Test", icon: Sparkles, to: "/dashboard/benefit-passport" },
        { label: "Voice MITTRA (22 Langs)", icon: Mic, to: "/browse-schemes" },
        { label: "DigiLocker Document Vault", icon: Shield, to: "/dashboard/documents" },
        { label: "For Govt Officers Desk", icon: Building2, to: "/officer/apply" },
      ],
    },
    {
      id: "kisan",
      label: "Kisan & Farming",
      icon: Tractor,
      to: "/browse-schemes?category=KISAN",
      hasFlyout: true,
      subItems: [
        { label: "PM-KISAN (₹6,000 DBT)", icon: Coins, to: "/browse-schemes?search=PM-KISAN" },
        { label: "PM Fasal Bima (PMFBY)", icon: Shield, to: "/browse-schemes?search=Fasal" },
        { label: "Kisan Credit Card (KCC)", icon: CreditCard, to: "/browse-schemes?search=KCC" },
        { label: "Soil Health Card Advisory", icon: FileText, to: "/browse-schemes?search=Soil" },
        { label: "PM-KUSUM Solar Pump", icon: Sun, to: "/browse-schemes?search=KUSUM" },
        { label: "Krishi Sinchayee Yojana", icon: Droplets, to: "/browse-schemes?search=Sinchayee" },
        { label: "Agri Mechanization Grant", icon: Tractor, to: "/browse-schemes?search=Mechanization" },
        { label: "All Kisan Welfare Schemes →", icon: ArrowRight, to: "/browse-schemes?category=KISAN" },
      ],
    },
    {
      id: "student",
      label: "Scholarships",
      icon: GraduationCap,
      to: "/browse-schemes?category=STUDENT",
      hasFlyout: true,
      subItems: [
        { label: "NSP Central Sector Scheme", icon: Award, to: "/browse-schemes?search=NSP" },
        { label: "Post-Matric SC/ST/OBC", icon: GraduationCap, to: "/browse-schemes?search=Post-Matric" },
        { label: "PM-YASASVI Merit Scheme", icon: Sparkles, to: "/browse-schemes?search=YASASVI" },
        { label: "Free Coaching (UPSC/NEET)", icon: BookOpen, to: "/browse-schemes?search=Coaching" },
        { label: "Overseas Education Grants", icon: Compass, to: "/browse-schemes?search=Overseas" },
        { label: "AICTE Pragati for Girls", icon: HeartHandshake, to: "/browse-schemes?search=Pragati" },
        { label: "Pre-Matric Fellowships", icon: FileText, to: "/browse-schemes?search=Pre-Matric" },
        { label: "All Student Scholarships →", icon: ArrowRight, to: "/browse-schemes?category=STUDENT" },
      ],
    },
    {
      id: "women",
      label: "Women & Child",
      icon: HeartHandshake,
      to: "/browse-schemes?category=WOMEN",
      hasFlyout: true,
      subItems: [
        { label: "PMMVY Matru Vandana (₹5k)", icon: HeartPulse, to: "/browse-schemes?search=Matru" },
        { label: "Lakhpati Didi (SHG ₹5L)", icon: Coins, to: "/browse-schemes?search=Lakhpati" },
        { label: "Sukanya Samriddhi Yojana", icon: Shield, to: "/browse-schemes?search=Sukanya" },
        { label: "PM Ujjwala Free LPG", icon: Flame, to: "/browse-schemes?search=Ujjwala" },
        { label: "Mission Poshan 2.0", icon: HeartHandshake, to: "/browse-schemes?search=Poshan" },
        { label: "Working Women Hostels", icon: Building, to: "/browse-schemes?search=Hostel" },
        { label: "Sakhi One Stop Centre", icon: Building2, to: "/browse-schemes?search=Sakhi" },
        { label: "All Women Entitlements →", icon: ArrowRight, to: "/browse-schemes?category=WOMEN" },
      ],
    },
    {
      id: "health",
      label: "Healthcare",
      icon: HeartPulse,
      to: "/browse-schemes?category=HEALTH",
      hasFlyout: true,
      subItems: [
        { label: "Ayushman Bharat (₹5L Cashless)", icon: HeartPulse, to: "/browse-schemes?search=Ayushman" },
        { label: "ABHA Digital Health ID", icon: CreditCard, to: "/browse-schemes?search=ABHA" },
        { label: "Jan Aushadhi (85% Discount)", icon: Shield, to: "/browse-schemes?search=Aushadhi" },
        { label: "PM National Dialysis", icon: Clock, to: "/browse-schemes?search=Dialysis" },
        { label: "Janani Shishu Suraksha", icon: HeartHandshake, to: "/browse-schemes?search=Janani" },
        { label: "Tele-MANAS Mental Health", icon: Mic, to: "/browse-schemes?search=Tele" },
        { label: "All Healthcare Schemes →", icon: ArrowRight, to: "/browse-schemes?category=HEALTH" },
      ],
    },
    {
      id: "housing",
      label: "Housing (PMAY)",
      icon: Building,
      to: "/browse-schemes?category=HOUSING",
      hasFlyout: true,
      subItems: [
        { label: "PMAY-Gramin (₹1.20L Grant)", icon: Building, to: "/browse-schemes?search=PMAY" },
        { label: "PMAY-Urban (CLSS Subsidy)", icon: Building2, to: "/browse-schemes?search=PMAY-Urban" },
        { label: "Swachh Bharat Toilet (IHHL)", icon: CheckCircle2, to: "/browse-schemes?search=Swachh" },
        { label: "Jal Jeevan (Clean Tap Water)", icon: Droplets, to: "/browse-schemes?search=Jal" },
        { label: "PM Surya Ghar (Free Solar)", icon: Sun, to: "/browse-schemes?search=Surya" },
        { label: "All Housing Welfare →", icon: ArrowRight, to: "/browse-schemes?category=HOUSING" },
      ],
    },
    {
      id: "business",
      label: "Employment & MSME",
      icon: Briefcase,
      to: "/browse-schemes?category=BUSINESS",
      hasFlyout: true,
      subItems: [
        { label: "PM Vishwakarma (₹15k + ₹3L)", icon: Briefcase, to: "/browse-schemes?search=Vishwakarma" },
        { label: "PMEGP 35% Project Subsidy", icon: Coins, to: "/browse-schemes?search=PMEGP" },
        { label: "PM Mudra Business Loans", icon: CreditCard, to: "/browse-schemes?search=Mudra" },
        { label: "PM SVANidhi (Street Vendors)", icon: Building, to: "/browse-schemes?search=SVANidhi" },
        { label: "Startup India Seed Fund", icon: Sparkles, to: "/browse-schemes?search=Startup" },
        { label: "Kaushal Vikas (PMKVY 4.0)", icon: Award, to: "/browse-schemes?search=Kaushal" },
        { label: "All Business Subsidies →", icon: ArrowRight, to: "/browse-schemes?category=BUSINESS" },
      ],
    },
    {
      id: "general",
      label: "Social Security",
      icon: Shield,
      to: "/browse-schemes?category=GENERAL",
      hasFlyout: true,
      subItems: [
        { label: "IGNOAPS Old Age Pension", icon: Users, to: "/browse-schemes?search=Old-Age" },
        { label: "IGNWPS Widow Pension", icon: HeartHandshake, to: "/browse-schemes?search=Widow" },
        { label: "Atal Pension Yojana (APY)", icon: Coins, to: "/browse-schemes?search=Atal" },
        { label: "PM Suraksha Bima (PMSBY ₹20)", icon: Shield, to: "/browse-schemes?search=PMSBY" },
        { label: "PM Jeevan Jyoti (PMJJBY)", icon: HeartPulse, to: "/browse-schemes?search=PMJJBY" },
        { label: "Divyangjan Disability Aid", icon: Award, to: "/browse-schemes?search=Divyang" },
        { label: "All Pension Entitlements →", icon: ArrowRight, to: "/browse-schemes?category=GENERAL" },
      ],
    },
    {
      id: "tracker",
      label: "Track Applications",
      icon: FileCheck2,
      to: isAuthenticated ? "/dashboard/applications" : "/login",
      hasFlyout: true,
      subItems: [
        { label: "Door 1: SchemeCoach Apply", icon: Sparkles, to: "/browse-schemes" },
        { label: "Door 2: Kendra Walk-in Kit", icon: Building2, to: "/browse-schemes" },
        { label: "Door 3: Pre-Filled PDF Form", icon: FileText, to: "/browse-schemes" },
        { label: "Live Multi-Agency Tracker", icon: Clock, to: "/dashboard/applications" },
        { label: "DigiLocker Document Vault", icon: Shield, to: "/dashboard/documents" },
        { label: "Citizen Helpdesk & Redressal", icon: CheckCircle2, to: "/faq" },
      ],
    },
  ];

  const handleItemMouseEnter = (item, e) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (!item.hasFlyout || !item.subItems?.length) {
      setHoveredNav(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    // Keep flyout inside screen viewport
    const menuHeight = (item.subItems?.length || 5) * 40 + 24;
    const calculatedTop = Math.max(16, Math.min(rect.top - 4, window.innerHeight - menuHeight - 16));
    const calculatedLeft = collapsed ? 80 : 256;
    setHoveredNav({
      ...item,
      top: calculatedTop,
      left: calculatedLeft,
    });
  };

  const handleItemMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 280);
  };

  const handlePopupMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const handlePopupMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 280);
  };

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === "/" && !location.search;
    }
    if (item.to.includes("?category=")) {
      const cat = item.to.split("?category=")[1];
      return location.pathname === "/browse-schemes" && location.search.includes(cat);
    }
    return location.pathname === item.to;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container — Upper and Bottom Corners in Circular Radius */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/90 rounded-r-3xl sm:rounded-r-[32px] rounded-l-none shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between transition-all duration-300 ease-in-out [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] no-scrollbar ${
          isOpenMobile ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Separation Circular Collapse Toggle (Circle Type Indicator on the Dividing Boundary) */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3.5 top-7 sm:top-8 z-50 w-7 h-7 rounded-full bg-white border border-slate-200/90 shadow-md items-center justify-center text-slate-500 hover:text-emerald-700 hover:border-emerald-300 transition-all hover:scale-110 cursor-pointer select-none"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="w-3.5 h-3.5 text-slate-600" />
          ) : (
            <ChevronsLeft className="w-3.5 h-3.5 text-slate-600" />
          )}
        </button>

        {/* Top Header: Logo + Tiranga Civic Background + Rounded Upper Corner Only */}
        <div className="relative overflow-hidden p-3.5 border-b border-white/10 bg-[#112318] select-none rounded-tr-3xl sm:rounded-tr-[32px]">
          {/* Authentic Indian Tiranga Flag with light cover tint and matching top-right circular curve */}
          <div className="absolute inset-0 pointer-events-none rounded-tr-3xl sm:rounded-tr-[32px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1400&q=80"
              alt="Indian National Flag Tiranga"
              className="w-full h-full object-cover object-[85%_center] opacity-75 scale-110 rounded-tr-3xl sm:rounded-tr-[32px]"
            />
            {/* Light cover tint: deep on the left for text contrast, open on the right to reveal the Tiranga */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#112318] via-[#112318]/70 via-45% to-transparent rounded-tr-3xl sm:rounded-tr-[32px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1d14]/75 via-transparent to-black/20 rounded-tr-3xl sm:rounded-tr-[32px]" />
          </div>

          <div className="relative z-10 flex items-center justify-between text-white">
            <Link
              to="/"
              onClick={onCloseMobile}
              className={`flex items-center gap-2.5 overflow-hidden transition-all ${
                collapsed ? "justify-center w-full" : ""
              }`}
            >
              {collapsed ? (
                <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white border border-white/25 shadow-xs">
                  <span className="font-black text-xs tracking-tight">LS</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="font-black text-[15px] tracking-tight text-white leading-none drop-shadow-xs">
                    Lok Samarth
                  </span>
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider mt-1 drop-shadow-xs">
                    Citizen Gateway
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Exact Unstop Persona Switcher ("You're viewing as") */}
        {!collapsed && (
          <div ref={dropdownRef} className="relative mx-3 mt-2.5 mb-1 select-none">
            <div className="p-2.5 rounded-2xl bg-[#ebf3ed] border border-[#d2e4d7]">
              <div className="text-[11px] font-medium text-slate-500 mb-1.5 px-0.5">
                You're viewing as
              </div>

              {/* Unstop Rounded Toggle Pill Trigger */}
              <button
                type="button"
                onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    {location.pathname.startsWith("/admin") ? (
                      <Building2 className="w-3.5 h-3.5" />
                    ) : user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {location.pathname.startsWith("/admin")
                      ? "Administrator"
                      : (isAuthenticated && user?.name && user.name !== "Citizen" ? user.name : "Citizen")}
                  </span>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    personaDropdownOpen ? "rotate-180 text-emerald-700" : "group-hover:text-slate-600"
                  }`}
                />
              </button>
            </div>

            {/* Unstop Clean Floating Dropdown Popover */}
            {personaDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="space-y-0.5">
                  {/* Option 1: Citizen */}
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/"}
                    onClick={() => {
                      setPersonaDropdownOpen(false);
                      onCloseMobile();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      !location.pathname.startsWith("/admin")
                        ? "bg-emerald-50 text-emerald-950 font-black"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span>
                        {isAuthenticated && user?.name && user.name !== "Citizen" ? user.name : "Citizen"}
                      </span>
                    </div>
                    {!location.pathname.startsWith("/admin") && (
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </Link>

                  {/* Option 2: Administrator */}
                  <Link
                    to="/admin"
                    onClick={() => {
                      setPersonaDropdownOpen(false);
                      onCloseMobile();
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      location.pathname.startsWith("/admin")
                        ? "bg-emerald-50 text-emerald-950 font-black"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <span>Administrator</span>
                    </div>
                    {location.pathname.startsWith("/admin") && (
                      <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary Action Button (Exact Unstop "+ Post" Style with Green Outline) */}
        <div className="p-3 pt-2">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            onClick={onCloseMobile}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-full font-semibold text-[13px] tracking-tight transition-all duration-200 bg-white hover:bg-emerald-50/50 border border-emerald-300 text-slate-800 shadow-2xs hover:shadow-xs hover:border-emerald-400 ${
              collapsed ? "px-2" : "px-4"
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-600 shrink-0" />
            {!collapsed && <span>Check Eligibility</span>}
          </Link>
        </div>

        {/* Navigation Items (Exact Unstop Pill Style with < and > Chevrons) */}
        <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] no-scrollbar scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            const isMenuOpen = hoveredNav?.id === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={(e) => handleItemMouseEnter(item, e)}
                onMouseLeave={handleItemMouseLeave}
              >
                {/* Main Sidebar Item Link */}
                <Link
                  to={item.to}
                  onClick={() => {
                    setHoveredNav(null);
                    onCloseMobile();
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] tracking-tight transition-all duration-150 select-none ${
                    active
                      ? "bg-slate-100/90 text-slate-900 font-bold shadow-2xs"
                      : isMenuOpen
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                  } ${collapsed ? "justify-center px-0 py-2.5" : ""}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active || isMenuOpen ? "text-emerald-700" : "text-slate-500"
                    }`}
                  />
                  {!collapsed && (
                    <>
                      <span className={`truncate flex-1 ${active ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                        {item.label}
                      </span>
                      {item.hasFlyout && (
                        isMenuOpen ? (
                          <ChevronLeft className="w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 transition-transform" />
                        )
                      )}
                    </>
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom Unstop-Style Promo Cards with Circular Right Icon and matching bottom-right curve */}
        {!collapsed && (
          <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/50 rounded-br-3xl sm:rounded-br-[32px]">
            {/* Card 1: Benefit Passport (Matches Unstop "Post a Job" Card) */}
            <Link
              to={isAuthenticated ? "/dashboard/benefit-passport" : "/register"}
              onClick={onCloseMobile}
              className="block p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-900 group-hover:text-emerald-900 transition-colors truncate">
                    Benefit Passport
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug line-clamp-1">
                    Auto-unlock 100% of schemes.
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>

            {/* Card 2: For Govt Officers (Matches Unstop "Become a Mentor" Card) */}
            <Link
              to="/officer/apply"
              onClick={onCloseMobile}
              className="block p-3 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-300 shadow-2xs hover:shadow-xs transition group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-900 group-hover:text-teal-900 transition-colors truncate">
                    For Govt Officers
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug line-clamp-1">
                    Ministry Nodal Audit Desk.
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          </div>
        )}
      </aside>

      {/* Exact Unstop-Style Flyout Menu Popup (Clean White Card List matching Unstop Screenshot) */}
      {hoveredNav && hoveredNav.subItems && (
        <div
          className="hidden lg:block fixed z-[9999] pointer-events-auto transition-opacity duration-150 animate-in fade-in zoom-in-95"
          style={{
            left: `${hoveredNav.left - 10}px`,
            top: `${hoveredNav.top}px`,
            paddingLeft: "10px",
          }}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        >
          <div className="w-64 bg-white rounded-2xl border border-slate-200/90 shadow-2xl py-2 px-1.5 backdrop-blur-md">
            {/* Header category title */}
            <div className="px-3 py-1.5 mb-1 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                {hoveredNav.label}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {hoveredNav.subItems.length} Features
              </span>
            </div>

            {/* List of sub-services / schemes with icons (Exact Unstop format) */}
            <div className="space-y-0.5 max-h-[70vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {hoveredNav.subItems.map((sub, sIdx) => {
                const SubIcon = sub.icon;
                return (
                  <Link
                    key={sIdx}
                    to={sub.to}
                    onClick={() => setHoveredNav(null)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-colors select-none group/sub"
                  >
                    <SubIcon className="w-4 h-4 text-slate-400 group-hover/sub:text-emerald-700 shrink-0 transition-colors" />
                    <span className="truncate flex-1 group-hover/sub:font-semibold">
                      {sub.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

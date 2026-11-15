import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  ChevronRight,
  Gift,
  Crown,
  Trophy,
  Settings,
  HelpCircle,
  LogOut,
  CheckCircle2,
  Check,
  Copy,
  Sparkles,
  ShieldCheck,
  Star,
  ExternalLink,
  Share2
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

/**
 * Unstop-Style User Profile Popover / Dropdown Menu
 * Faithfully matches Unstop's authenticated user menu:
 * - Avatar with green progress ring & verified checkmark
 * - Name, Email, "View Profile >" pill button
 * - Two metric boxes: ⭐ Points (344) & 🏆 Global Rank (1,126,835)
 * - Tactile action menu items (Refer & Earn, Pro, Awards, Settings, Contact)
 * - Logout action
 */
export default function UnstopProfileDropdown({ align = "right", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  // Citizen displayName & initials (Defaulted to Pratik Pathak)
  const displayName = user?.name && user.name !== "Citizen" ? user.name : "Pratik Pathak";
  const userEmail = user?.email && !user.email.includes("citizen@") ? user.email : "pratikpathak343@gmail.com";
  const userAvatar = user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

  const handleCopyReferral = () => {
    const referralUrl = `${window.location.origin}/register?ref=${encodeURIComponent(displayName.toLowerCase().replace(/\s+/g, "-"))}`;
    navigator.clipboard.writeText(referralUrl);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* ============================================================ */}
      {/* TRIGGER: Exact Unstop Circular User Avatar with Green Ring   */}
      {/* ============================================================ */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-0.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 cursor-pointer"
        aria-label="User Account Menu"
        aria-expanded={isOpen}
      >
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-[2px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 shadow-xs group-hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full overflow-hidden bg-white">
            <img
              src={userAvatar}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
              }}
            />
          </div>
          {/* Small Verified Indicator Dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
      </button>

      {/* ============================================================ */}
      {/* POPOVER: Unstop-Style Card Dropdown                          */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-80 sm:w-84 bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md`}
        >
          {/* Header Row: Big Avatar + View Profile Button */}
          <div className="flex items-start justify-between gap-3 mb-3">
            {/* Avatar with Unstop-style Green Ring & Checkmark */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full p-[3px] bg-emerald-500 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={userAvatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Green Verified Checkmark Pill at bottom */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full p-0.5 shadow-xs border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
              </div>
            </div>

            {/* "View Profile >" Pill Button (Direct to /dashboard/profile) */}
            <Link
              to="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer group"
            >
              <span>View Profile</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* User Name & Email */}
          <div className="mb-4">
            <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">
              {displayName}
            </h4>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {userEmail}
            </p>
          </div>

          {/* 2 Summary Badge Boxes (Points ⭐ 344 & Rank 🏆 1,126,835) */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {/* Box 1: Readiness Points */}
            <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-2.5 flex items-center gap-2">
              <span className="text-amber-500 text-sm">⭐</span>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black text-slate-900 leading-none">
                  344
                </span>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  Readiness Pts
                </span>
              </div>
            </div>

            {/* Box 2: Global / Welfare Rank */}
            <div className="bg-[#fffdf7] border border-amber-100/80 rounded-2xl p-2.5 flex items-center gap-2">
              <span className="text-amber-600 text-sm">🏆</span>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black text-slate-900 leading-none">
                  1,126,835
                </span>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  District Rank
                </span>
              </div>
            </div>
          </div>

          {/* Nav Menu Items */}
          <div className="space-y-0.5 border-t border-slate-100 pt-2 mb-2">
            
            {/* 1. Refer & Empower */}
            <button
              type="button"
              onClick={() => setShowReferModal(true)}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer text-left"
            >
              <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="flex-1">Refer a Citizen</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                +50 Pts
              </span>
            </button>

            {/* 2. Lok Samarth Benefit Passport */}
            <Link
              to="/dashboard/benefit-passport"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="flex-1">Statutory Benefit Passport</span>
            </Link>

            {/* 3. Approved Scheme Badges & DBT */}
            <Link
              to="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="flex-1">Approved Scheme Badges</span>
            </Link>

            {/* 4. Settings */}
            <Link
              to="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="flex-1">Citizen &amp; Aadhaar Settings</span>
            </Link>

            {/* 5. MITTRA Helpdesk */}
            <Link
              to="/dashboard/life-situation"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="flex-1">MITTRA Voice Helpdesk</span>
            </Link>
          </div>

          {/* Bottom Divider & Logout Button */}
          <div className="border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-black text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Refer & Earn Modal */}
      {showReferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900">Refer Citizen &amp; Earn</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReferModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Help your village, neighborhood, or friends discover welfare schemes, DBT subsidies, and DigiLocker benefit passports without middlemen.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-600 truncate font-mono">
                {window.location.origin}/register?ref={encodeURIComponent(displayName.toLowerCase().replace(/\s+/g, "-"))}
              </span>
              <button
                type="button"
                onClick={handleCopyReferral}
                className="px-3 py-1.5 bg-[#112318] hover:bg-[#1a3826] text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {copiedReferral ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
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
                onClick={() => setShowReferModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

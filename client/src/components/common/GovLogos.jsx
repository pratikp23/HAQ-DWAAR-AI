import React from "react";

/**
 * HAQ DWAAR AI — Official Civic & GovTech Emblems Library
 * 
 * Provides crisp, high-resolution SVG emblems for statutory Indian portals:
 * - DigiLocker (National Digital Document Wallet)
 * - Aadhaar / UIDAI (Unique Identification Authority of India)
 * - DBT Bharat (Direct Benefit Transfer National Mission)
 * - PM-Kisan Samman Nidhi (Ministry of Agriculture)
 * - Ayushman Bharat / PM-JAY (National Health Authority)
 * - National Scholarship Portal - NSP (Ministry of Electronics & IT)
 * - MSME / Udyam (Ministry of Micro, Small and Medium Enterprises)
 * - Bhashini (National Language Translation Mission)
 * - Common Service Center - CSC (Digital India)
 */

// 1. DigiLocker Official Cloud & Lock Emblem
export function DigiLockerLogo({ className = "w-6 h-6", showText = false, textClassName = "text-xs font-bold" }) {
  return (
    <div className="inline-flex items-center gap-1.5 shrink-0 select-none">
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#003366" />
        {/* Cloud Body */}
        <path
          d="M34.5 28.5C36.9853 28.5 39 26.4853 39 24C39 21.6569 37.2065 19.7323 34.9126 19.5244C34.4695 15.8398 31.3323 13 27.5 13C24.4988 13 21.9056 14.7397 20.6975 17.2624C19.866 16.7869 18.9038 16.5161 17.8824 16.5161C14.6336 16.5161 12 19.1497 12 22.3985C12 22.7533 12.0315 23.1009 12.0924 23.4384C10.2831 24.3312 9 26.2232 9 28.4118C9 31.4981 11.5019 34 14.5882 34H34.5C36.9853 34 39 31.9853 39 29.5"
          fill="#0099FF"
          opacity="0.3"
        />
        {/* Golden Padlock in Center */}
        <rect x="18" y="24" width="12" height="10" rx="2.5" fill="#FF9933" />
        <path
          d="M21 24V20.5C21 18.8431 22.3431 17.5 24 17.5C25.6569 17.5 27 18.8431 27 20.5V24"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="28.5" r="1.5" fill="#FFFFFF" />
        <path d="M24 30V32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className={textClassName}>
          <span className="text-[#003366] dark:text-blue-300 font-black">Digi</span>
          <span className="text-[#FF9933] font-black">Locker</span>
        </span>
      )}
    </div>
  );
}

// 2. Aadhaar / UIDAI Biometric Fingerprint & Sun Emblem
export function AadhaarLogo({ className = "w-6 h-6", showText = false, textClassName = "text-xs font-bold" }) {
  return (
    <div className="inline-flex items-center gap-1.5 shrink-0 select-none">
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="23" fill="#FFF9F5" stroke="#EA580C" strokeWidth="2" />
        {/* Red & Saffron Sun Rays */}
        <circle cx="24" cy="24" r="15" fill="#FFF1E6" />
        <path
          d="M24 6V11M24 37V42M6 24H11M37 24H42M11.27 11.27L14.81 14.81M33.19 33.19L36.73 36.73M11.27 36.73L14.81 33.19M33.19 14.81L36.73 11.27"
          stroke="#EA580C"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Biometric Fingerprint Arcs */}
        <path
          d="M24 18C20.6863 18 18 20.6863 18 24C18 25.5 18.5 27 19.5 28M24 21C22.3431 21 21 22.3431 21 24C21 26.5 22 28.5 23 30M27 24C27 22.3431 25.6569 21 24 21M28.5 28C29.5 26.5 30 25 30 23.5C30 20.5 27.5 18 24 18M24 24V28M24 31V32"
          stroke="#C2410C"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className={textClassName}>
          <span className="text-[#C2410C] font-black">AADHAAR</span>
        </span>
      )}
    </div>
  );
}

// 3. DBT Bharat (Direct Benefit Transfer) Emblem
export function DbtBharatLogo({ className = "w-6 h-6", showText = false, textClassName = "text-xs font-bold" }) {
  return (
    <div className="inline-flex items-center gap-1.5 shrink-0 select-none">
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#047857" />
        {/* Dynamic circular transfer arrows */}
        <circle cx="24" cy="24" r="16" stroke="#A7F3D0" strokeWidth="2.5" strokeDasharray="6 3" />
        <path
          d="M24 14C29.5228 14 34 18.4772 34 24M24 34C18.4772 34 14 29.5228 14 24"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Rupee Symbol Center */}
        <path
          d="M20 18H28M20 22H26.5M20 18V28M20 24L26 31M20 18C23 18 25 19 25 21C25 23 23 24 20 24"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className={textClassName}>
          <span className="text-[#047857] font-black">DBT</span>
          <span className="text-slate-700 ml-1">Bharat</span>
        </span>
      )}
    </div>
  );
}

// 4. National Scholarship Portal (NSP) Emblem
export function NspLogo({ className = "w-6 h-6", showText = false, textClassName = "text-xs font-bold" }) {
  return (
    <div className="inline-flex items-center gap-1.5 shrink-0 select-none">
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#2B0F4C" />
        {/* Mortarboard / Graduation Cap */}
        <path d="M24 12L38 19L24 26L10 19L24 12Z" fill="#F97316" />
        <path d="M15 22V29C15 32 19 35 24 35C29 35 33 32 33 29V22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        {/* Tassel */}
        <path d="M35 20V28" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
        <circle cx="35" cy="29" r="1.5" fill="#FDE047" />
      </svg>
      {showText && (
        <span className={textClassName}>
          <span className="text-[#2B0F4C] font-black">NSP</span>
          <span className="text-slate-600 ml-1 font-medium">Scholarships</span>
        </span>
      )}
    </div>
  );
}

// 5. PM-Kisan Samman Nidhi Emblem
export function PmKisanLogo({ className = "w-6 h-6", showText = false, textClassName = "text-xs font-bold" }) {
  return (
    <div className="inline-flex items-center gap-1.5 shrink-0 select-none">
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#15803D" />
        {/* Wheat Spikes & Green Land */}
        <path
          d="M24 38V12M24 12C21 16 17 19 17 25M24 12C27 16 31 19 31 25M24 20C19 23 15 28 15 34M24 20C29 23 33 28 33 34"
          stroke="#FEF08A"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="11" r="2.5" fill="#FBBF24" />
      </svg>
      {showText && (
        <span className={textClassName}>
          <span className="text-[#15803D] font-black">PM-KISAN</span>
        </span>
      )}
    </div>
  );
}

// 6. Ayushman Bharat (PM-JAY) Emblem
export function AyushmanBharatLogo({ className = "w-6 h-6", showText = false, textClassName = "text-xs font-bold" }) {
  return (
    <div className="inline-flex items-center gap-1.5 shrink-0 select-none">
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#1D4ED8" />
        {/* Health Shield */}
        <path
          d="M24 10L36 15V24C36 32 30 38 24 41C18 38 12 32 12 24V15L24 10Z"
          fill="#3B82F6"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        {/* White Medical Cross with Heart */}
        <path d="M24 17V31M17 24H31" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
        <path
          d="M21 21C19.5 19.5 17 20 17 22C17 24 21 27 21 27C21 27 25 24 25 22C25 20 22.5 19.5 21 21Z"
          fill="#EF4444"
          opacity="0.9"
        />
      </svg>
      {showText && (
        <span className={textClassName}>
          <span className="text-[#1D4ED8] font-black">PM-JAY</span>
          <span className="text-rose-600 ml-1 font-bold">Ayushman</span>
        </span>
      )}
    </div>
  );
}

// 7. MSME / Udyam Emblem
export function MsmeLogo({ className = "w-6 h-6", showText = false, textClassName = "text-xs font-bold" }) {
  return (
    <div className="inline-flex items-center gap-1.5 shrink-0 select-none">
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#7C3AED" />
        {/* Industry Cogwheel & Tools */}
        <circle cx="24" cy="24" r="10" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 2" />
        <rect x="22" y="11" width="4" height="4" rx="1" fill="#FDE047" />
        <rect x="22" y="33" width="4" height="4" rx="1" fill="#FDE047" />
        <rect x="11" y="22" width="4" height="4" rx="1" fill="#FDE047" />
        <rect x="33" y="22" width="4" height="4" rx="1" fill="#FDE047" />
        <path d="M19 24L22 27L29 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && (
        <span className={textClassName}>
          <span className="text-[#7C3AED] font-black">MSME</span>
          <span className="text-slate-700 ml-1 font-semibold">Udyam</span>
        </span>
      )}
    </div>
  );
}

// 8. Bhashini (National Language Voice AI) Emblem
export function BhashiniLogo({ className = "w-6 h-6", showText = false, textClassName = "text-xs font-bold" }) {
  return (
    <div className="inline-flex items-center gap-1.5 shrink-0 select-none">
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#C2410C" />
        {/* Audio Speech Waveforms in Tricolor */}
        <rect x="12" y="20" width="3" height="8" rx="1.5" fill="#FF9933" />
        <rect x="18" y="15" width="3" height="18" rx="1.5" fill="#FFFFFF" />
        <rect x="24" y="10" width="3" height="28" rx="1.5" fill="#FEF08A" />
        <rect x="30" y="16" width="3" height="16" rx="1.5" fill="#FFFFFF" />
        <rect x="36" y="21" width="3" height="6" rx="1.5" fill="#138808" />
      </svg>
      {showText && (
        <span className={textClassName}>
          <span className="text-[#C2410C] font-black">BHASHINI</span>
          <span className="text-orange-600 ml-1 font-medium">Voice AI</span>
        </span>
      )}
    </div>
  );
}

// 9. CSC (Common Service Center / Digital India) Emblem
export function CscLogo({ className = "w-6 h-6", showText = false, textClassName = "text-xs font-bold" }) {
  return (
    <div className="inline-flex items-center gap-1.5 shrink-0 select-none">
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="#0284C7" />
        {/* Civic Three-Person Network */}
        <circle cx="24" cy="16" r="3.5" fill="#FFFFFF" />
        <path d="M18 27C18 24 20.5 22 24 22C27.5 22 30 24 30 27V29H18V27Z" fill="#FFFFFF" />
        <circle cx="14" cy="22" r="2.5" fill="#BAE6FD" />
        <path d="M10 31C10 29 11.5 27.5 14 27.5C15.5 27.5 16.5 28.2 17 29.2" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
        <circle cx="34" cy="22" r="2.5" fill="#BAE6FD" />
        <path d="M38 31C38 29 36.5 27.5 34 27.5C32.5 27.5 31.5 28.2 31 29.2" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className={textClassName}>
          <span className="text-[#0284C7] font-black">CSC</span>
          <span className="text-slate-700 ml-1 font-semibold">Digital Seva</span>
        </span>
      )}
    </div>
  );
}

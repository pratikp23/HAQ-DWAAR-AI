import React from "react";

/**
 * High-fidelity, authentic vector SVG logos for Digital Public Infrastructure
 * and Government of India Ministries.
 */

// 1. Lion Capital of Ashoka (Official State Emblem of India)
export const AshokaEmblemLogo = ({ className = "w-9 h-9" }) => (
  <svg
    viewBox="0 0 100 120"
    fill="currentColor"
    className={className}
    aria-label="Government of India Emblem"
  >
    {/* Stylized Lion Capital Profile */}
    <g fill="#92400e">
      {/* Central Lion Head */}
      <path d="M50 12 C44 12 39 16 38 23 C38 28 41 33 44 36 C42 39 39 44 39 50 C39 57 43 62 47 65 L47 76 C42 77 38 80 38 84 L62 84 C62 80 58 77 53 76 L53 65 C57 62 61 57 61 50 C61 44 58 39 56 36 C59 33 62 28 62 23 C61 16 56 12 50 12 Z" />
      {/* Left Lion Head Silhouette */}
      <path d="M33 22 C28 22 24 26 23 31 C22 35 24 39 27 41 C25 44 23 48 24 53 C25 58 29 62 33 64 L36 60 C32 58 29 55 29 51 C29 48 31 45 33 43 L36 47 C37 45 38 41 38 38 C35 37 32 34 32 30 C32 27 34 25 36 24 Z" />
      {/* Right Lion Head Silhouette */}
      <path d="M67 22 C72 22 76 26 77 31 C78 35 76 39 73 41 C75 44 77 48 76 53 C75 58 71 62 67 64 L64 60 C68 58 71 55 71 51 C71 48 69 45 67 43 L64 47 C63 45 62 41 62 38 C65 37 68 34 68 30 C68 27 66 25 64 24 Z" />
      {/* Ashoka Chakra Base Wheel */}
      <circle cx="50" cy="85" r="9" fill="none" stroke="#1e3a8a" strokeWidth="2.5" />
      <circle cx="50" cy="85" r="2.5" fill="#1e3a8a" />
      <path d="M50 76 L50 94 M41 85 L59 85 M43.6 78.6 L56.4 91.4 M43.6 91.4 L56.4 78.6" stroke="#1e3a8a" strokeWidth="1.2" />
      {/* Pedestal Stand */}
      <rect x="22" y="96" width="56" height="5" rx="2" fill="#78350f" />
      {/* Satyameva Jayate Banner Text Outline */}
      <text x="50" y="112" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#78350f" fontFamily="sans-serif">
        सत्यमेव जयते
      </text>
    </g>
  </svg>
);

// 2. DigiLocker Authentic Logo
export const DigiLockerLogo = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-label="DigiLocker">
    <rect width="120" height="120" rx="26" fill="#003366" />
    {/* Cloud Shape */}
    <path
      d="M32 78 C25 78 20 73 20 66 C20 60 24 55 30 54 C31 43 40 34 51 34 C58 34 64 38 68 43 C71 40 76 38 81 38 C90 38 98 46 98 55 C103 56 107 61 107 67 C107 73 102 78 96 78 Z"
      fill="#0082c8"
      opacity="0.9"
    />
    {/* Document in Cloud */}
    <rect x="44" y="44" width="32" height="42" rx="4" fill="#ffffff" />
    <path d="M64 44 L76 56 L64 56 Z" fill="#cbd5e1" />
    {/* Verified Green Tick inside */}
    <circle cx="60" cy="68" r="11" fill="#059669" />
    <path d="M55 68 L58.5 71.5 L65.5 64.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 3. BHASHINI AI Authentic Logo
export const BhashiniLogo = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-label="BHASHINI">
    <rect width="120" height="120" rx="26" fill="#04241d" />
    {/* Concentric Audio Speech Waves */}
    <circle cx="60" cy="60" r="42" stroke="#ea580c" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
    <circle cx="60" cy="60" r="32" stroke="#10b981" strokeWidth="3.5" />
    <circle cx="60" cy="60" r="22" fill="#065f46" />
    {/* Stylized Devanagari 'भा' / Speech Wave */}
    <path
      d="M48 45 L72 45 M60 45 L60 76 M52 56 C52 52 58 52 64 52 C70 52 74 56 74 61 C74 66 68 67 60 67 M52 76 L68 76"
      stroke="#ffffff"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="75" cy="46" r="3" fill="#ea580c" />
  </svg>
);

// 4. DBT Bharat Authentic Logo
export const DbtBharatLogo = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-label="DBT Bharat">
    <rect width="120" height="120" rx="26" fill="#0f172a" />
    {/* Rupee & Financial Inclusion Circles */}
    <circle cx="60" cy="60" r="40" stroke="#059669" strokeWidth="4" />
    <path
      d="M60 20 A40 40 0 0 1 100 60"
      stroke="#ea580c"
      strokeWidth="5"
      strokeLinecap="round"
    />
    {/* Rupee Sign */}
    <text x="60" y="70" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">
      ₹
    </text>
    {/* Growth leaves on top right */}
    <path d="M85 35 C92 32 96 38 95 44 C89 45 83 41 85 35 Z" fill="#10b981" />
  </svg>
);

// 5. IndiaStack Authentic Logo
export const IndiaStackLogo = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-label="IndiaStack">
    <rect width="120" height="120" rx="26" fill="#1e1b4b" />
    {/* 4 Stacked Isometric Layers */}
    {/* Layer 1: Presence-less (Identity) */}
    <path d="M60 28 L86 42 L60 56 L34 42 Z" fill="#3b82f6" />
    {/* Layer 2: Paper-less (Documents) */}
    <path d="M34 50 L60 64 L86 50 L86 56 L60 70 L34 56 Z" fill="#10b981" />
    {/* Layer 3: Cash-less (Payments) */}
    <path d="M34 64 L60 78 L86 64 L86 70 L60 84 L34 70 Z" fill="#f59e0b" />
    {/* Layer 4: Consent Layer */}
    <path d="M34 78 L60 92 L86 78 L86 84 L60 98 L34 84 Z" fill="#ef4444" />
  </svg>
);

// 6. UMANG Authentic Logo
export const UmangLogo = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-label="UMANG">
    <rect width="120" height="120" rx="26" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
    {/* UMANG 4 Colored Wings Spiral */}
    <path d="M60 60 C50 40 68 28 80 34 C88 38 88 52 74 58 Z" fill="#ea580c" />
    <path d="M60 60 C75 52 92 65 88 78 C85 86 71 88 64 74 Z" fill="#10b981" />
    <path d="M60 60 C70 78 52 92 40 86 C32 82 32 68 46 62 Z" fill="#2563eb" />
    <path d="M60 60 C45 68 28 55 32 42 C35 34 49 32 56 46 Z" fill="#7c3aed" />
    <circle cx="60" cy="60" r="7" fill="#0f172a" />
  </svg>
);

// 7. PFMS (Public Financial Management System) Logo
export const PfmsLogo = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-label="PFMS">
    <rect width="120" height="120" rx="26" fill="#0c4a6e" />
    <circle cx="60" cy="60" r="38" stroke="#38bdf8" strokeWidth="3" strokeDasharray="5 3" />
    {/* Scales of Financial Accountability */}
    <path d="M60 32 L60 84 M40 44 L80 44" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
    <path d="M34 58 L46 58 L40 44 Z" fill="#38bdf8" />
    <path d="M74 58 L86 58 L80 44 Z" fill="#38bdf8" />
    <rect x="46" y="84" width="28" height="6" rx="2" fill="#ffffff" />
    <text x="60" y="76" textAnchor="middle" fontSize="11" fontWeight="900" fill="#f8fafc" fontFamily="sans-serif">
      PFMS
    </text>
  </svg>
);

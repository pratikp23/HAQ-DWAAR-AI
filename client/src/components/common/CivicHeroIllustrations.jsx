import React from "react";

/**
 * Custom SVG Civic Illustrations for Hero Carousel Slides
 * India digital-public-service inspired, clean vector compositions.
 */

// Slide 1: Citizen Family & Civic Welfare Service Composition
export function CitizenFamilyIllustration({ className = "w-full h-auto max-h-[340px]" }) {
  return (
    <svg viewBox="0 0 520 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Citizens and government welfare schemes">
      <defs>
        <linearGradient id="cf_grad1" x1="0" y1="0" x2="520" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#591d8f" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="cf_card" x1="0" y1="0" x2="200" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f8f5fc" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Ambient background aura */}
      <circle cx="260" cy="180" r="160" fill="url(#cf_grad1)" />
      
      {/* Central Civic Shield */}
      <path d="M260 40 L370 85 V195 C370 265 260 315 260 315 C260 315 150 265 150 195 V85 Z" fill="#240b49" stroke="#ea580c" strokeWidth="4" strokeLinejoin="round" opacity="0.85" />
      
      {/* Emblem Emblem Accent within Shield */}
      <circle cx="260" cy="140" r="45" fill="#2b0f4c" stroke="#fb923c" strokeWidth="2.5" />
      <path d="M260 108 L266 126 H285 L270 137 L276 155 L260 144 L244 155 L250 137 L235 126 H254 Z" fill="#f97316" />
      <path d="M225 175 C240 165 280 165 295 175" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
      
      {/* Floating Scheme Notification Card Left */}
      <g transform="translate(40, 70)">
        <rect width="180" height="95" rx="14" fill="url(#cf_card)" stroke="#e9e1f5" strokeWidth="2" filter="drop-shadow(0 6px 12px rgba(36,11,73,0.12))" />
        <rect x="14" y="14" width="70" height="16" rx="8" fill="#e0e7ff" />
        <text x="24" y="26" fill="#3730a3" fontSize="9" fontWeight="bold">STUDENT</text>
        <circle cx="154" cy="22" r="6" fill="#10b981" />
        <rect x="14" y="40" width="150" height="8" rx="4" fill="#0f172a" />
        <rect x="14" y="54" width="110" height="6" rx="3" fill="#64748b" />
        <rect x="14" y="68" width="130" height="14" rx="7" fill="#ea580c" fillOpacity="0.15" />
        <text x="22" y="78" fill="#c2410c" fontSize="8" fontWeight="bold">Direct Scholar Gateway ✓</text>
      </g>

      {/* Floating Scheme Notification Card Right */}
      <g transform="translate(300, 190)">
        <rect width="185" height="95" rx="14" fill="url(#cf_card)" stroke="#e9e1f5" strokeWidth="2" filter="drop-shadow(0 6px 12px rgba(36,11,73,0.12))" />
        <rect x="14" y="14" width="60" height="16" rx="8" fill="#dcfce7" />
        <text x="22" y="26" fill="#166534" fontSize="9" fontWeight="bold">KISAN</text>
        <circle cx="158" cy="22" r="6" fill="#10b981" />
        <rect x="14" y="40" width="140" height="8" rx="4" fill="#0f172a" />
        <rect x="14" y="54" width="100" height="6" rx="3" fill="#64748b" />
        <rect x="14" y="68" width="145" height="14" rx="7" fill="#10b981" fillOpacity="0.15" />
        <text x="22" y="78" fill="#047857" fontSize="8" fontWeight="bold">Verified Gazette Criteria ✓</text>
      </g>

      {/* Citizen Representation Silhouettes */}
      <g fill="#f8fafc">
        {/* Person 1 - Student with graduation cap */}
        <circle cx="215" cy="215" r="18" fill="#ffffff" stroke="#2b0f4c" strokeWidth="3" />
        <polygon points="215,190 232,198 215,206 198,198" fill="#2b0f4c" />
        <rect x="228" y="200" width="3" height="10" fill="#ea580c" />
        <path d="M190 270 C190 240 240 240 240 270" fill="#ffffff" stroke="#2b0f4c" strokeWidth="3" />
        
        {/* Person 2 - Central Citizen/Farmer */}
        <circle cx="260" cy="205" r="22" fill="#ffedd5" stroke="#ea580c" strokeWidth="3" />
        <path d="M230 280 C230 245 290 245 290 280" fill="#ffffff" stroke="#ea580c" strokeWidth="3" />
        
        {/* Person 3 - Professional / Beneficiary */}
        <circle cx="305" cy="215" r="18" fill="#ffffff" stroke="#2b0f4c" strokeWidth="3" />
        <path d="M280 270 C280 240 330 240 330 270" fill="#ffffff" stroke="#2b0f4c" strokeWidth="3" />
      </g>

      {/* Decorative Digital Lines */}
      <line x1="130" y1="165" x2="190" y2="230" stroke="#ea580c" strokeWidth="2" strokeDasharray="4 4" />
      <line x1="390" y1="190" x2="330" y2="230" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
    </svg>
  );
}

// Slide 2: Government Scheme Directory & Digital Catalog Illustration
export function SchemeCatalogIllustration({ className = "w-full h-auto max-h-[340px]" }) {
  return (
    <svg viewBox="0 0 520 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Digital Scheme Catalog">
      <defs>
        <linearGradient id="sc_bg" x1="0" y1="0" x2="520" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2b0f4c" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <rect width="520" height="360" rx="24" fill="url(#sc_bg)" />

      {/* Digital Tablet / Portal Frame */}
      <rect x="70" y="35" width="380" height="290" rx="20" fill="#ffffff" stroke="#2b0f4c" strokeWidth="4" filter="drop-shadow(0 12px 24px rgba(36,11,73,0.15))" />
      
      {/* Top Header of Portal */}
      <rect x="70" y="35" width="380" height="42" rx="20" fill="#240b49" />
      <circle cx="95" cy="56" r="5" fill="#ea580c" />
      <circle cx="110" cy="56" r="5" fill="#facc15" />
      <circle cx="125" cy="56" r="5" fill="#10b981" />
      <rect x="150" y="47" width="220" height="18" rx="9" fill="#2b0f4c" stroke="#591d8f" strokeWidth="1" />
      <text x="195" y="60" fill="#e2e8f0" fontSize="9" fontWeight="bold">haqdwaar.gov.in/schemes</text>

      {/* Search Bar in Mockup */}
      <rect x="100" y="95" width="320" height="32" rx="10" fill="#f8f5fc" stroke="#e9e1f5" strokeWidth="1.5" />
      <circle cx="120" cy="111" r="6" stroke="#ea580c" strokeWidth="2" />
      <line x1="124" y1="115" x2="130" y2="121" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
      <text x="140" y="115" fill="#475569" fontSize="10">Search scholarships, agriculture, livelihood...</text>
      <rect x="360" y="100" width="50" height="22" rx="7" fill="#ea580c" />
      <text x="372" y="115" fill="#ffffff" fontSize="9" fontWeight="bold">Search</text>

      {/* Scheme Card 1 */}
      <g transform="translate(100, 140)">
        <rect width="150" height="145" rx="14" fill="#ffffff" stroke="#e9e1f5" strokeWidth="2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.05))" />
        <rect x="12" y="12" width="60" height="14" rx="7" fill="#fee2e2" />
        <text x="20" y="23" fill="#b91c1c" fontSize="8" fontWeight="bold">EDUCATION</text>
        <rect x="12" y="34" width="125" height="10" rx="4" fill="#0f172a" />
        <rect x="12" y="48" width="95" height="6" rx="3" fill="#64748b" />
        <rect x="12" y="62" width="126" height="36" rx="8" fill="#f8f5fc" stroke="#e9e1f5" />
        <text x="18" y="76" fill="#2b0f4c" fontSize="8" fontWeight="bold">BENEFIT</text>
        <text x="18" y="88" fill="#475569" fontSize="8">Tuition fee waiver</text>
        <rect x="12" y="110" width="126" height="22" rx="8" fill="#2b0f4c" />
        <text x="44" y="125" fill="#ffffff" fontSize="9" fontWeight="bold">View Scheme →</text>
      </g>

      {/* Scheme Card 2 */}
      <g transform="translate(270, 140)">
        <rect width="150" height="145" rx="14" fill="#ffffff" stroke="#e9e1f5" strokeWidth="2" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.05))" />
        <rect x="12" y="12" width="55" height="14" rx="7" fill="#dcfce7" />
        <text x="20" y="23" fill="#15803d" fontSize="8" fontWeight="bold">KISAN</text>
        <rect x="12" y="34" width="125" height="10" rx="4" fill="#0f172a" />
        <rect x="12" y="48" width="95" height="6" rx="3" fill="#64748b" />
        <rect x="12" y="62" width="126" height="36" rx="8" fill="#f8f5fc" stroke="#e9e1f5" />
        <text x="18" y="76" fill="#2b0f4c" fontSize="8" fontWeight="bold">BENEFIT</text>
        <text x="18" y="88" fill="#475569" fontSize="8">Annual equipment aid</text>
        <rect x="12" y="110" width="126" height="22" rx="8" fill="#ea580c" />
        <text x="44" y="125" fill="#ffffff" fontSize="9" fontWeight="bold">View Scheme →</text>
      </g>
    </svg>
  );
}

// Slide 3: Document Vault & Application Readiness Checklist Illustration
export function DocumentReadinessIllustration({ className = "w-full h-auto max-h-[340px]" }) {
  return (
    <svg viewBox="0 0 520 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Document Vault and Application Readiness">
      <defs>
        <linearGradient id="dr_bg" x1="0" y1="0" x2="520" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e0a3c" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3d156b" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <rect width="520" height="360" rx="24" fill="url(#dr_bg)" />

      {/* Central Vault Safe / Folder */}
      <rect x="80" y="60" width="220" height="240" rx="20" fill="#240b49" stroke="#591d8f" strokeWidth="3" filter="drop-shadow(0 16px 32px rgba(0,0,0,0.3))" />
      <rect x="100" y="80" width="180" height="50" rx="12" fill="#2b0f4c" stroke="#ea580c" strokeWidth="1.5" />
      <circle cx="125" cy="105" r="14" fill="#ea580c" />
      <path d="M121 105 L124 108 L130 102" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="148" y="103" fill="#ffffff" fontSize="10" fontWeight="bold">PERSONAL VAULT</text>
      <text x="148" y="115" fill="#fb923c" fontSize="8">Encrypted &amp; Reusable</text>

      {/* Document Stack in Vault */}
      <g transform="translate(100, 145)">
        <rect x="10" y="0" width="160" height="35" rx="8" fill="#ffffff" stroke="#e9e1f5" />
        <text x="25" y="22" fill="#0f172a" fontSize="9" fontWeight="bold">📄 Income Certificate</text>
        <circle cx="150" cy="18" r="6" fill="#10b981" />
        
        <rect x="10" y="45" width="160" height="35" rx="8" fill="#ffffff" stroke="#e9e1f5" />
        <text x="25" y="67" fill="#0f172a" fontSize="9" fontWeight="bold">📄 Domicile Certificate</text>
        <circle cx="150" cy="63" r="6" fill="#10b981" />

        <rect x="10" y="90" width="160" height="35" rx="8" fill="#ffffff" stroke="#e9e1f5" />
        <text x="25" y="112" fill="#0f172a" fontSize="9" fontWeight="bold">📄 Marksheet / Proof</text>
        <circle cx="150" cy="108" r="6" fill="#10b981" />
      </g>

      {/* Floating Application Readiness Board */}
      <g transform="translate(280, 80)">
        <rect width="180" height="200" rx="18" fill="#ffffff" stroke="#ea580c" strokeWidth="3" filter="drop-shadow(0 12px 24px rgba(0,0,0,0.2))" />
        
        <rect x="15" y="15" width="150" height="32" rx="8" fill="#f8f5fc" />
        <text x="25" y="32" fill="#2b0f4c" fontSize="10" fontWeight="bold">APPLICATION READY</text>
        <text x="25" y="42" fill="#10b981" fontSize="8" fontWeight="bold">Checklist Complete ✓</text>

        {/* Readiness Checklist items */}
        <g transform="translate(15, 60)">
          <circle cx="10" cy="12" r="8" fill="#10b981" />
          <path d="M7 12 L9 14 L13 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="26" y="15" fill="#0f172a" fontSize="9" fontWeight="bold">Profile Match Passed</text>
          
          <circle cx="10" cy="38" r="8" fill="#10b981" />
          <path d="M7 38 L9 40 L13 36" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="26" y="41" fill="#0f172a" fontSize="9" fontWeight="bold">Mandatory Docs Ready</text>

          <circle cx="10" cy="64" r="8" fill="#10b981" />
          <path d="M7 64 L9 66 L13 62" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="26" y="67" fill="#0f172a" fontSize="9" fontWeight="bold">Readability Checked</text>
          
          <rect x="0" y="85" width="150" height="28" rx="8" fill="#ea580c" />
          <text x="22" y="103" fill="#ffffff" fontSize="9" fontWeight="bold">Apply on Official Portal →</text>
        </g>
      </g>
    </svg>
  );
}

// Slide 4: Transparent Rule Matching & Explainability Illustration
export function RuleMatchingIllustration({ className = "w-full h-auto max-h-[340px]" }) {
  return (
    <svg viewBox="0 0 520 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Deterministic Rule Matching">
      <defs>
        <linearGradient id="rm_bg" x1="0" y1="0" x2="520" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f8f5fc" />
          <stop offset="100%" stopColor="#ede9fe" />
        </linearGradient>
      </defs>

      <rect width="520" height="360" rx="24" fill="url(#rm_bg)" />

      {/* Left Node: Citizen Passport */}
      <g transform="translate(40, 100)">
        <rect width="125" height="150" rx="16" fill="#ffffff" stroke="#2b0f4c" strokeWidth="2.5" filter="drop-shadow(0 6px 12px rgba(36,11,73,0.08))" />
        <circle cx="62" cy="40" r="18" fill="#2b0f4c" />
        <circle cx="62" cy="35" r="7" fill="#ffffff" />
        <path d="M50 52 C50 45 74 45 74 52" fill="#ffffff" />
        <text x="22" y="75" fill="#0f172a" fontSize="9" fontWeight="bold">Benefit Passport</text>
        <rect x="18" y="88" width="90" height="6" rx="3" fill="#cbd5e1" />
        <rect x="18" y="100" width="70" height="6" rx="3" fill="#cbd5e1" />
        <rect x="18" y="112" width="80" height="6" rx="3" fill="#cbd5e1" />
        <rect x="18" y="126" width="90" height="14" rx="7" fill="#e0e7ff" />
        <text x="32" y="136" fill="#3730a3" fontSize="8" fontWeight="bold">Citizen Profile</text>
      </g>

      {/* Middle Node: Deterministic Logic Rules Engine */}
      <g transform="translate(195, 80)">
        <rect width="130" height="190" rx="18" fill="#240b49" stroke="#ea580c" strokeWidth="3" filter="drop-shadow(0 8px 20px rgba(36,11,73,0.2))" />
        <rect x="15" y="15" width="100" height="24" rx="8" fill="#2b0f4c" stroke="#591d8f" />
        <text x="22" y="31" fill="#fb923c" fontSize="8" fontWeight="bold">RULE EVALUATOR</text>
        
        {/* Transparent checks */}
        <g transform="translate(15, 55)">
          <rect width="100" height="26" rx="6" fill="#ffffff" fillOpacity="0.1" />
          <circle cx="12" cy="13" r="5" fill="#10b981" />
          <text x="24" y="16" fill="#ffffff" fontSize="8">Age &lt;= 25 ✓</text>

          <rect y="36" width="100" height="26" rx="6" fill="#ffffff" fillOpacity="0.1" />
          <circle cx="12" cy="49" r="5" fill="#10b981" />
          <text x="24" y="52" fill="#ffffff" fontSize="8">Income &lt; 6L ✓</text>

          <rect y="72" width="100" height="26" rx="6" fill="#ffffff" fillOpacity="0.1" />
          <circle cx="12" cy="85" r="5" fill="#10b981" />
          <text x="24" y="88" fill="#ffffff" fontSize="8">State: MP ✓</text>

          <rect y="105" width="100" height="18" rx="9" fill="#10b981" />
          <text x="18" y="117" fill="#ffffff" fontSize="8" fontWeight="bold">0% AI Hallucination</text>
        </g>
      </g>

      {/* Right Node: Explainable Match Card */}
      <g transform="translate(355, 100)">
        <rect width="125" height="150" rx="16" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" filter="drop-shadow(0 6px 12px rgba(16,185,129,0.15))" />
        <circle cx="62" cy="38" r="16" fill="#dcfce7" />
        <path d="M56 38 L60 42 L68 34" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="25" y="72" fill="#065f46" fontSize="10" fontWeight="bold">MATCH FOUND</text>
        <text x="22" y="85" fill="#64748b" fontSize="8">Medhavi Yojana</text>
        <rect x="15" y="96" width="95" height="20" rx="6" fill="#f8f5fc" />
        <text x="22" y="110" fill="#2b0f4c" fontSize="8" fontWeight="bold">Why this match?</text>
        <rect x="15" y="122" width="95" height="18" rx="7" fill="#ea580c" />
        <text x="32" y="134" fill="#ffffff" fontSize="8" fontWeight="bold">View Match →</text>
      </g>

      {/* Connecting Arrows */}
      <path d="M165 175 L195 175" stroke="#ea580c" strokeWidth="3" strokeDasharray="3 3" />
      <path d="M325 175 L355 175" stroke="#10b981" strokeWidth="3" strokeDasharray="3 3" />
    </svg>
  );
}

// Slide 5: Direct Official Portal Gateway Illustration
export function OfficialPortalGatewayIllustration({ className = "w-full h-auto max-h-[340px]" }) {
  return (
    <svg viewBox="0 0 520 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Official Government Application Gateway">
      <defs>
        <linearGradient id="op_bg" x1="0" y1="0" x2="520" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e0a3c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2b0f4c" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <rect width="520" height="360" rx="24" fill="url(#op_bg)" />

      {/* Grand Classical Portal Pillars & Pediment */}
      <path d="M180 110 L260 65 L340 110 Z" fill="#240b49" stroke="#ea580c" strokeWidth="3" />
      <rect x="175" y="110" width="170" height="12" rx="4" fill="#591d8f" />
      
      {/* Pillars */}
      <rect x="190" y="122" width="22" height="160" rx="5" fill="#ffffff" stroke="#240b49" strokeWidth="2" />
      <rect x="230" y="122" width="22" height="160" rx="5" fill="#ffffff" stroke="#240b49" strokeWidth="2" />
      <rect x="270" y="122" width="22" height="160" rx="5" fill="#ffffff" stroke="#240b49" strokeWidth="2" />
      <rect x="310" y="122" width="22" height="160" rx="5" fill="#ffffff" stroke="#240b49" strokeWidth="2" />
      
      {/* Base Steps */}
      <rect x="160" y="280" width="200" height="15" rx="5" fill="#ffffff" stroke="#240b49" strokeWidth="2" />
      <rect x="140" y="295" width="240" height="18" rx="6" fill="#ea580c" />
      <text x="180" y="308" fill="#ffffff" fontSize="9" fontWeight="bold">OFFICIAL APPLICATION GATEWAY</text>

      {/* Direct Arrow & Badge */}
      <g transform="translate(60, 140)">
        <rect width="115" height="90" rx="14" fill="#ffffff" stroke="#e9e1f5" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.15))" />
        <text x="15" y="25" fill="#2b0f4c" fontSize="9" fontWeight="bold">HAQ DWAAR AI</text>
        <text x="15" y="38" fill="#64748b" fontSize="8">Readiness &amp; Vault</text>
        <rect x="15" y="52" width="85" height="24" rx="6" fill="#e0e7ff" />
        <text x="25" y="67" fill="#3730a3" fontSize="8" fontWeight="bold">Ready to Apply ✓</text>
      </g>

      <path d="M175 185 L188 185" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
      <path d="M185 180 L192 185 L185 190" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Floating Verification Emblem Right */}
      <g transform="translate(350, 130)">
        <rect width="130" height="110" rx="16" fill="#ffffff" stroke="#10b981" strokeWidth="2" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.15))" />
        <circle cx="65" cy="35" r="16" fill="#dcfce7" />
        <path d="M58 35 L63 40 L72 30" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="18" y="68" fill="#0f172a" fontSize="9" fontWeight="bold">Direct Submission</text>
        <text x="22" y="80" fill="#64748b" fontSize="8">No Agent Markups</text>
        <text x="22" y="92" fill="#047857" fontSize="8" fontWeight="bold">100% Free Public Portal</text>
      </g>
    </svg>
  );
}

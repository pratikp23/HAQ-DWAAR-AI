import React from "react";

/**
 * HAQ DWAAR AI — Original Civic Service Domain Icons
 * 
 * Bespoke, pixel-perfect vector SVG icons designed specifically for
 * Indian civic welfare sectors with clean duotone fills, crisp strokes,
 * and high visual clarity.
 */

// 1. Education & Scholarships (शिक्षा एवं छात्रवृत्ति)
export function EducationServiceIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Open Book Base */}
      <path
        d="M5 21C7.8 20 12.2 20 16 22C19.8 20 24.2 20 27 21V9C24.2 8 19.8 8 16 10C12.2 8 7.8 8 5 9V21Z"
        fill="#3b82f6"
        fillOpacity="0.15"
      />
      <path
        d="M5 9V21C7.8 20 12.2 20 16 22M16 22C19.8 20 24.2 20 27 21V9C24.2 8 19.8 8 16 10C12.2 8 7.8 8 5 9M16 22V10"
        stroke="#1d4ed8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Graduation Cap Diamond */}
      <path
        d="M16 3L3 9L16 15L29 9L16 3Z"
        fill="#1e40af"
        stroke="#1e3a8a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cap Neck & Tassel */}
      <path
        d="M8.5 11.5V17C8.5 19.2 11.8 21 16 21C20.2 21 23.5 19.2 23.5 17V11.5"
        stroke="#1e40af"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M26 10.5V18.5M24.5 18.5H27.5"
        stroke="#ea580c"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="9" r="1.5" fill="#f97316" />
    </svg>
  );
}

// 2. Agriculture & Farmers (कृषि एवं किसान कल्याण)
export function AgricultureServiceIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Soil Furrows / Hills */}
      <path
        d="M3 26C6 24 10 24 13 26C16 28 20 28 23 26C26 24 29 24 31 25"
        stroke="#047857"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 29C8 27.5 12 27.5 15 29C18 30.5 22 30.5 25 29"
        stroke="#059669"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
      {/* Golden Wheat Stalk (Left) */}
      <path
        d="M9 14C9 14 11 10 16 11C16 16 12 18 12 18"
        fill="#10b981"
        fillOpacity="0.2"
        stroke="#059669"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 8C11.5 5.5 16 6 16 9C16 12 12.5 12 10 8Z"
        fill="#059669"
        fillOpacity="0.3"
        stroke="#047857"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Sprouting Main Leaf / Plant (Right) */}
      <path
        d="M16 24V11"
        stroke="#047857"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M16 15C19 13 24 14 24 18C20 19 17 18 16 15Z"
        fill="#10b981"
        stroke="#059669"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M16 8C19 5.5 24 7 23 11C20 12 17 11 16 8Z"
        fill="#34d399"
        stroke="#047857"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Sun / Vitality Sparkle */}
      <circle cx="8" cy="6" r="2.5" fill="#f59e0b" />
      <path d="M8 2V3.5M8 8.5V10M4 6H5.5M10.5 6H12" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 3. Employment & Skills (रोजगार एवं कौशल विकास)
export function EmploymentServiceIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Skill Cog / Gear in background */}
      <circle cx="16" cy="11" r="5" fill="#8b5cf6" fillOpacity="0.15" stroke="#7c3aed" strokeWidth="1.8" />
      <path
        d="M16 4V6M16 16V18M9 11H11M21 11H23M11 6L12.5 7.5M19.5 14.5L21 16M21 6L19.5 7.5M12.5 14.5L11 16"
        stroke="#6d28d9"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Professional Briefcase */}
      <rect
        x="5"
        y="14"
        width="22"
        height="14"
        rx="3"
        fill="#591d8f"
        stroke="#3b0764"
        strokeWidth="2"
      />
      {/* Briefcase Handle */}
      <path
        d="M11 14V11C11 9.89543 11.8954 9 13 9H19C20.1046 9 21 9.89543 21 11V14"
        stroke="#f97316"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Center Buckle & Accent Band */}
      <path d="M5 20H27" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
      <rect x="14" y="18" width="4" height="4" rx="1" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
    </svg>
  );
}

// 4. Housing & Basic Services (आवास एवं नागरिक सेवाएं)
export function HousingServiceIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Pucca House Body */}
      <path
        d="M6 14V27C6 27.5523 6.44772 28 7 28H25C25.5523 28 26 27.5523 26 27V14"
        fill="#fef3c7"
        stroke="#b45309"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Slanted Roof */}
      <path
        d="M3 14L16 4L29 14"
        stroke="#d97706"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 4L5 13H27L16 4Z"
        fill="#f59e0b"
        fillOpacity="0.25"
      />
      {/* Chimney / Ventilation */}
      <path d="M22 6.5V10" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
      {/* Door with Civic Arch */}
      <path
        d="M13 28V20C13 18.8954 13.8954 18 15 18H17C18.1046 18 19 18.8954 19 20V28"
        fill="#d97706"
        stroke="#92400e"
        strokeWidth="1.8"
      />
      {/* Window with Light */}
      <rect x="8" y="17" width="3.5" height="4" rx="0.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1.2" />
      <rect x="20.5" y="17" width="3.5" height="4" rx="0.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1.2" />
      {/* Basic Services Spark / Clean Drop */}
      <circle cx="16" cy="11" r="1.5" fill="#0284c7" />
    </svg>
  );
}

// 5. Health & Social Support (स्वास्थ्य एवं सामाजिक सुरक्षा)
export function HealthServiceIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Shield of Protection */}
      <path
        d="M16 3L6 7V15C6 21.5 10.3 27 16 29C21.7 27 26 21.5 26 15V7L16 3Z"
        fill="#f43f5e"
        fillOpacity="0.12"
        stroke="#e11d48"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Healthcare Cross */}
      <path
        d="M16 10V20M11 15H21"
        stroke="#e11d48"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heart / Caring Gesture */}
      <path
        d="M16 19.5C16 19.5 13 17 11.5 15.5C10 14 10 12 11.5 10.8C13 9.6 14.8 10.2 16 11.5C17.2 10.2 19 9.6 20.5 10.8C22 12 22 14 20.5 15.5C19 17 16 19.5 16 19.5Z"
        fill="#be123c"
        fillOpacity="0.25"
      />
      <circle cx="16" cy="15" r="2" fill="#ffffff" />
      <path d="M16 13.5V16.5M14.5 15H17.5" stroke="#e11d48" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// 6. Business & Self-Employment (व्यापार एवं स्व-रोजगार)
export function BusinessServiceIcon({ className = "w-6 h-6", ...props }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Shop Canopy / Awning */}
      <path
        d="M4 12L7 5H25L28 12H4Z"
        fill="#ea580c"
        stroke="#c2410c"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Canopy Stripes */}
      <path d="M10 5L9 12" stroke="#ffffff" strokeWidth="1.8" />
      <path d="M16 5V12" stroke="#ffffff" strokeWidth="1.8" />
      <path d="M22 5L23 12" stroke="#ffffff" strokeWidth="1.8" />
      {/* Store Base Building */}
      <path
        d="M6 12V26C6 26.5523 6.44772 27 7 27H25C25.5523 27 26 26.5523 26 26V12"
        fill="#fff7ed"
        stroke="#c2410c"
        strokeWidth="1.8"
      />
      {/* Shop Counter / Door */}
      <path
        d="M13 27V19C13 18.4477 13.4477 18 14 18H18C18.5523 18 19 18.4477 19 19V27"
        fill="#ea580c"
        fillOpacity="0.2"
        stroke="#ea580c"
        strokeWidth="1.8"
      />
      {/* Rupee / Growth Symbol above counter */}
      <circle cx="21.5" cy="18.5" r="3.5" fill="#f59e0b" stroke="#d97706" strokeWidth="1.2" />
      <text
        x="21.5"
        y="21"
        fontSize="5"
        fontWeight="bold"
        fill="#78350f"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        ₹
      </text>
      {/* Growth Arrow (Top Right) */}
      <path
        d="M24 8L28 4M28 4H24M28 4V8"
        stroke="#16a34a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

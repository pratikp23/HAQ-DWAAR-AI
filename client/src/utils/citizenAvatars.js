/**
 * HAQ DWAAR AI — Civic & Citizen Avatars Library
 * High-definition sovereign SVG avatars designed for Indian citizens:
 * Students, Kisans, Women Entrepreneurs, Elders, Healthcare Workers, Artisans, etc.
 * Zero external network dependency — loads instantly and operates 100% offline.
 */

const createSvgDataUrl = (svgContent) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;

export const CITIZEN_AVATARS = [
  {
    id: "citizen-student",
    label: "Student & Youth Scholar",
    category: "Education & Technical Degree",
    accentColor: "#10b981",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad-student" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b" />
            <stop offset="100%" stop-color="#112318" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-student)"/>
        <circle cx="50" cy="40" r="17" fill="#fed7aa"/>
        <path d="M 50 17 A 17 17 0 0 1 67 36 Q 50 28 33 36 A 17 17 0 0 1 50 17 Z" fill="#1e293b"/>
        <!-- Graduation Cap Motif -->
        <polygon points="50,14 28,24 50,32 72,24" fill="#0f172a"/>
        <polygon points="50,14 47,12 53,12" fill="#f59e0b"/>
        <line x1="68" y1="25" x2="72" y2="34" stroke="#f59e0b" stroke-width="2"/>
        <circle cx="72" cy="35" r="2" fill="#f59e0b"/>
        <!-- Torso & Attire -->
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#047857"/>
        <polygon points="50,66 45,78 50,88 55,78" fill="#f8fafc"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#10b981" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "citizen-kisan",
    label: "Kisan & Agri Pioneer",
    category: "Agriculture & Farmers",
    accentColor: "#16a34a",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad-kisan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14532d" />
            <stop offset="100%" stop-color="#052e16" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-kisan)"/>
        <!-- Pagri / Turban -->
        <path d="M 30 36 C 30 18, 70 18, 70 36 C 74 38, 72 44, 68 44 C 62 44, 38 44, 32 44 C 28 44, 26 38, 30 36 Z" fill="#ea580c"/>
        <ellipse cx="50" cy="24" rx="16" ry="7" fill="#f97316"/>
        <circle cx="50" cy="42" r="16" fill="#fde68a"/>
        <!-- Moustache & Features -->
        <path d="M 40 50 Q 50 56 60 50 Q 50 53 40 50" fill="#334155"/>
        <!-- Kurta & Gamchha -->
        <path d="M 22 88 C 24 65, 76 65, 78 88 Z" fill="#f8fafc"/>
        <path d="M 30 88 C 30 68, 42 66, 42 88 Z" fill="#16a34a"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#22c55e" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "citizen-woman-entrepreneur",
    label: "Mahila Leader & Entrepreneur",
    category: "Women & SHG Self-Help",
    accentColor: "#ec4899",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad-woman" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#831843" />
            <stop offset="100%" stop-color="#500724" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-woman)"/>
        <!-- Long Hair -->
        <path d="M 28 44 C 28 22, 72 22, 72 44 C 76 58, 74 72, 68 76 C 64 66, 62 60, 62 48 C 38 48, 36 60, 32 76 C 26 72, 24 58, 28 44 Z" fill="#1e1b4b"/>
        <circle cx="50" cy="41" r="16" fill="#fed7aa"/>
        <!-- Bindi -->
        <circle cx="50" cy="35" r="1.8" fill="#e11d48"/>
        <!-- Saree & Pallu -->
        <path d="M 22 88 C 24 66, 76 66, 78 88 Z" fill="#db2777"/>
        <path d="M 34 88 Q 48 68 62 88 Z" fill="#fbbf24"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#f472b6" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "citizen-elder",
    label: "Senior Citizen & Elder Scholar",
    category: "Social Security & Pensions",
    accentColor: "#f59e0b",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad-elder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#78350f" />
            <stop offset="100%" stop-color="#451a03" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-elder)"/>
        <!-- Silver Hair -->
        <circle cx="50" cy="38" r="18" fill="#fed7aa"/>
        <path d="M 50 16 A 18 18 0 0 1 68 34 Q 50 26 32 34 A 18 18 0 0 1 50 16 Z" fill="#e2e8f0"/>
        <!-- Glasses -->
        <circle cx="43" cy="38" r="5" fill="none" stroke="#475569" stroke-width="1.8"/>
        <circle cx="57" cy="38" r="5" fill="none" stroke="#475569" stroke-width="1.8"/>
        <line x1="48" y1="38" x2="52" y2="38" stroke="#475569" stroke-width="1.8"/>
        <!-- Attire -->
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#e2e8f0"/>
        <path d="M 40 88 L 50 72 L 60 88 Z" fill="#d97706"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#fbbf24" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "citizen-healthcare",
    label: "Healthcare & ASHA Worker",
    category: "Health & Ayushman Bharat",
    accentColor: "#0ea5e9",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad-health" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0369a1" />
            <stop offset="100%" stop-color="#082f49" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-health)"/>
        <circle cx="50" cy="39" r="17" fill="#fed7aa"/>
        <path d="M 32 38 Q 50 20 68 38 Q 68 28 50 20 Q 32 28 32 38 Z" fill="#0f172a"/>
        <!-- Stethoscope & Coat -->
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#f8fafc"/>
        <path d="M 36 68 Q 50 82 64 68" fill="none" stroke="#0284c7" stroke-width="2.5"/>
        <circle cx="50" cy="80" r="3" fill="#0284c7"/>
        <!-- Medical Cross Badge -->
        <rect x="62" y="74" width="7" height="2" fill="#ef4444"/>
        <rect x="64.5" y="71.5" width="2" height="7" fill="#ef4444"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#38bdf8" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "citizen-tech",
    label: "Digital Innovator & Developer",
    category: "Technology & Startups",
    accentColor: "#8b5cf6",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad-tech" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4c1d95" />
            <stop offset="100%" stop-color="#1e1b4b" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-tech)"/>
        <circle cx="50" cy="38" r="17" fill="#fde68a"/>
        <!-- Modern Hair & Glasses -->
        <path d="M 50 16 A 17 17 0 0 1 67 33 Q 50 26 33 33 A 17 17 0 0 1 50 16 Z" fill="#312e81"/>
        <rect x="36" y="34" width="11" height="8" rx="2" fill="none" stroke="#8b5cf6" stroke-width="2"/>
        <rect x="53" y="34" width="11" height="8" rx="2" fill="none" stroke="#8b5cf6" stroke-width="2"/>
        <line x1="47" y1="38" x2="53" y2="38" stroke="#8b5cf6" stroke-width="2"/>
        <!-- Hoodie -->
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#6d28d9"/>
        <polygon points="50,68 45,78 50,88 55,78" fill="#a78bfa"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#c084fc" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "citizen-artisan",
    label: "Rural Artisan & Craftsman",
    category: "PM Vishwakarma & MSME",
    accentColor: "#d97706",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad-artisan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7c2d12" />
            <stop offset="100%" stop-color="#451a03" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-artisan)"/>
        <!-- Headband / Bandhana -->
        <circle cx="50" cy="40" r="17" fill="#fed7aa"/>
        <rect x="33" y="27" width="34" height="6" fill="#ea580c" rx="2"/>
        <path d="M 50 16 A 17 17 0 0 1 67 28 Q 50 24 33 28 A 17 17 0 0 1 50 16 Z" fill="#1c1917"/>
        <!-- Traditional Attire & Tool Badge -->
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#9a3412"/>
        <circle cx="50" cy="74" r="5" fill="#f59e0b"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#f97316" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "citizen-sovereign",
    label: "Digital Citizen (General)",
    category: "Direct Benefit Transfer (DBT)",
    accentColor: "#059669",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad-sov" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#112318" />
            <stop offset="50%" stop-color="#1e3a8a" />
            <stop offset="100%" stop-color="#047857" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#grad-sov)"/>
        <circle cx="50" cy="38" r="17" fill="#fde68a"/>
        <path d="M 50 16 A 17 17 0 0 1 67 34 Q 50 28 33 34 A 17 17 0 0 1 50 16 Z" fill="#0f172a"/>
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#0f172a"/>
        <!-- Tiranga Saffron-White-Green Stripes on Collar -->
        <rect x="42" y="66" width="16" height="3" fill="#f97316"/>
        <rect x="42" y="69" width="16" height="3" fill="#ffffff"/>
        <rect x="42" y="72" width="16" height="3" fill="#16a34a"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#10b981" stroke-width="3"/>
      </svg>
    `),
  },
];

export const DEFAULT_CITIZEN_AVATAR = CITIZEN_AVATARS[0].url;

/**
 * Generate 1 or 2 letter uppercase initials from name
 */
export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "LS";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "LS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

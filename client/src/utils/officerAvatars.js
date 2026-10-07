/**
 * HAQ DWAAR AI — Professional Government Officer Avatars
 * High-quality SVG avatars designed for administration profiles.
 */

const createSvgDataUrl = (svgContent) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;

export const OFFICER_AVATARS = [
  {
    id: "officer-gold",
    label: "Chief Director (Apex)",
    roleTag: "Higher Officer",
    bgColor: "#240b49",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#1e0a3c"/>
        <circle cx="50" cy="38" r="18" fill="#fcd34d"/>
        <path d="M 50 16 A 18 18 0 0 1 68 34 Q 50 30 32 34 A 18 18 0 0 1 50 16 Z" fill="#1e293b"/>
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#431407"/>
        <polygon points="50,64 45,74 50,86 55,74" fill="#f97316"/>
        <circle cx="50" cy="50" r="4" fill="#fbbf24"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#f59e0b" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "officer-navy",
    label: "Joint Secretary (Senior)",
    roleTag: "Department Nodal",
    bgColor: "#1e3a8a",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#0f172a"/>
        <circle cx="50" cy="38" r="18" fill="#fde68a"/>
        <path d="M 50 16 A 18 18 0 0 1 68 32 Q 50 26 32 32 A 18 18 0 0 1 50 16 Z" fill="#334155"/>
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#1e3a8a"/>
        <polygon points="50,64 46,75 50,87 54,75" fill="#e2e8f0"/>
        <circle cx="44" cy="72" r="2.5" fill="#f59e0b"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#3b82f6" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "officer-female",
    label: "Nodal Director (Admin)",
    roleTag: "Director Nodal",
    bgColor: "#831843",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#3b0764"/>
        <path d="M 28 42 C 28 20, 72 20, 72 42 C 76 56, 74 68, 70 74 C 64 64, 62 58, 62 48 C 38 48, 36 58, 30 74 C 26 68, 24 56, 28 42 Z" fill="#1e1b4b"/>
        <circle cx="50" cy="40" r="16" fill="#fed7aa"/>
        <path d="M 22 88 C 24 66, 76 66, 78 88 Z" fill="#831843"/>
        <polygon points="50,66 45,78 50,88 55,78" fill="#fbbf24"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#ec4899" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "officer-kisan",
    label: "Agriculture Nodal",
    roleTag: "Kisan DBT",
    bgColor: "#065f46",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#064e3b"/>
        <circle cx="50" cy="38" r="18" fill="#fef08a"/>
        <path d="M 50 16 A 18 18 0 0 1 68 34 Q 50 28 32 34 A 18 18 0 0 1 50 16 Z" fill="#14532d"/>
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#065f46"/>
        <polygon points="50,64 46,74 50,86 54,74" fill="#a7f3d0"/>
        <circle cx="43" cy="72" r="2.5" fill="#f59e0b"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#10b981" stroke-width="3"/>
      </svg>
    `),
  },
  {
    id: "officer-tech",
    label: "Technical Super Admin",
    roleTag: "System Admin",
    bgColor: "#312e81",
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#18181b"/>
        <circle cx="50" cy="38" r="18" fill="#fed7aa"/>
        <path d="M 32 38 Q 32 20 50 20 Q 68 20 68 38" fill="none" stroke="#06b6d4" stroke-width="5"/>
        <rect x="29" y="32" width="6" height="12" rx="3" fill="#06b6d4"/>
        <rect x="65" y="32" width="6" height="12" rx="3" fill="#06b6d4"/>
        <path d="M 22 88 C 24 64, 76 64, 78 88 Z" fill="#312e81"/>
        <polygon points="50,64 46,74 50,86 54,74" fill="#38bdf8"/>
        <circle cx="50" cy="50" r="46" fill="none" stroke="#6366f1" stroke-width="3"/>
      </svg>
    `),
  },
];

export const getDefaultAvatar = (role, department) => {
  if (role === "chief_officer") return OFFICER_AVATARS[0].url;
  if (department === "KISAN") return OFFICER_AVATARS[3].url;
  if (role === "super_admin") return OFFICER_AVATARS[4].url;
  return OFFICER_AVATARS[1].url;
};

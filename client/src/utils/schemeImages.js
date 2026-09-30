import { 
  GraduationCap, 
  Sprout, 
  Briefcase, 
  Home, 
  HeartPulse, 
  Landmark, 
  HeartHandshake, 
  Building 
} from "lucide-react";

/**
 * HAQ DWAAR AI — Scheme Photography & Visual Asset Registry
 * 
 * Curated high-resolution Unsplash photography matching Indian civic & welfare programs.
 * Provides keyword-level precision matching plus robust category fallbacks.
 */
export const CATEGORY_IMAGE_REGISTRY = {
  STUDENT: {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    alt: "Students walking in college campus with books",
    badge: "HIGHER EDUCATION",
    badgeColor: "bg-blue-600 text-white",
    gradient: "from-blue-700 via-indigo-800 to-slate-900",
    icon: GraduationCap,
  },
  KISAN: {
    url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    alt: "Farmer in lush green agricultural field in sunlight",
    badge: "AGRICULTURE & KISAN",
    badgeColor: "bg-emerald-600 text-white",
    gradient: "from-emerald-700 via-teal-800 to-slate-900",
    icon: Sprout,
  },
  BUSINESS: {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    alt: "Small business workshop and artisan entrepreneur",
    badge: "MSME & ENTERPRISE",
    badgeColor: "bg-amber-600 text-white",
    gradient: "from-amber-700 via-orange-800 to-slate-900",
    icon: Building,
  },
  EMPLOYMENT: {
    url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    alt: "Vocational training and skill development",
    badge: "SKILL & LIVELIHOOD",
    badgeColor: "bg-purple-600 text-white",
    gradient: "from-purple-700 via-violet-800 to-slate-900",
    icon: Briefcase,
  },
  HEALTH: {
    url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    alt: "Healthcare clinic and medical welfare",
    badge: "HEALTH & AYUSHMAN",
    badgeColor: "bg-rose-600 text-white",
    gradient: "from-rose-700 via-pink-800 to-slate-900",
    icon: HeartPulse,
  },
  HOUSING: {
    url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    alt: "Rural housing and permanent shelter initiative",
    badge: "HOUSING & AWAS",
    badgeColor: "bg-orange-600 text-white",
    gradient: "from-orange-700 via-red-800 to-slate-900",
    icon: Home,
  },
  WOMEN: {
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    alt: "Women empowerment and social development",
    badge: "WOMEN & CHILD",
    badgeColor: "bg-pink-600 text-white",
    gradient: "from-pink-700 via-rose-800 to-slate-900",
    icon: HeartHandshake,
  },
  GENERAL: {
    url: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=800&q=80",
    alt: "Social security and citizen welfare assistance",
    badge: "SOCIAL WELFARE",
    badgeColor: "bg-slate-700 text-white",
    gradient: "from-[#240b49] via-[#3d1368] to-slate-900",
    icon: Landmark,
  }
};

/**
 * Returns the most accurate photographic URL and metadata for a scheme
 * based on scheme name keywords or assigned category.
 */
export function getSchemeVisualMeta(scheme = {}) {
  const name = (scheme.name || "").toLowerCase();
  const category = (scheme.category || "GENERAL").toUpperCase();

  // Keyword-level specific overrides for famous flagship schemes
  if (name.includes("kisan") || name.includes("krishi") || name.includes("crop") || name.includes("soil") || name.includes("agriculture")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.KISAN,
      displayUrl: scheme.imageUrl || CATEGORY_IMAGE_REGISTRY.KISAN.url,
    };
  }

  if (name.includes("scholarship") || name.includes("medhavi") || name.includes("matric") || name.includes("vidyarthi") || name.includes("education")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.STUDENT,
      displayUrl: scheme.imageUrl || CATEGORY_IMAGE_REGISTRY.STUDENT.url,
    };
  }

  if (name.includes("ayushman") || name.includes("health") || name.includes("aarogya") || name.includes("swasthya") || name.includes("medical")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.HEALTH,
      displayUrl: scheme.imageUrl || CATEGORY_IMAGE_REGISTRY.HEALTH.url,
    };
  }

  if (name.includes("mudra") || name.includes("msme") || name.includes("vishwakarma") || name.includes("udyam") || name.includes("business") || name.includes("startup")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.BUSINESS,
      displayUrl: scheme.imageUrl || CATEGORY_IMAGE_REGISTRY.BUSINESS.url,
    };
  }

  if (name.includes("awas") || name.includes("housing") || name.includes("shelter") || name.includes("ghar")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.HOUSING,
      displayUrl: scheme.imageUrl || CATEGORY_IMAGE_REGISTRY.HOUSING.url,
    };
  }

  if (name.includes("ladli") || name.includes("kanya") || name.includes("mahila") || name.includes("sukanya") || name.includes("women")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.WOMEN,
      displayUrl: scheme.imageUrl || CATEGORY_IMAGE_REGISTRY.WOMEN.url,
    };
  }

  if (name.includes("employment") || name.includes("rozgar") || name.includes("skill") || name.includes("kaushal") || name.includes("shramik")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.EMPLOYMENT,
      displayUrl: scheme.imageUrl || CATEGORY_IMAGE_REGISTRY.EMPLOYMENT.url,
    };
  }

  // Fallback to Category registry
  const match = CATEGORY_IMAGE_REGISTRY[category] || CATEGORY_IMAGE_REGISTRY.GENERAL;
  return {
    ...match,
    displayUrl: scheme.imageUrl || match.url,
  };
}

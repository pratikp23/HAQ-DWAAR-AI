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
 * Curated high-resolution imagery strictly related to each specific Indian welfare scheme.
 * Provides exact 1:1 scheme matching for flagship programs and category fallbacks.
 */
export const CATEGORY_IMAGE_REGISTRY = {
  STUDENT: {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    alt: "College and university students studying on campus",
    badge: "HIGHER EDUCATION",
    badgeColor: "bg-blue-600 text-white",
    gradient: "from-blue-700 via-indigo-800 to-slate-900",
    icon: GraduationCap,
  },
  KISAN: {
    url: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
    alt: "Farmer in lush green agricultural field",
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
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    alt: "Healthcare clinic and medical doctors",
    badge: "HEALTH & AYUSHMAN",
    badgeColor: "bg-rose-600 text-white",
    gradient: "from-rose-700 via-pink-800 to-slate-900",
    icon: HeartPulse,
  },
  HOUSING: {
    url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    alt: "Pucca permanent house under housing scheme",
    badge: "HOUSING & AWAS",
    badgeColor: "bg-orange-600 text-white",
    gradient: "from-orange-700 via-red-800 to-slate-900",
    icon: Home,
  },
  WOMEN: {
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    alt: "Women empowerment and maternal health welfare",
    badge: "WOMEN & CHILD",
    badgeColor: "bg-pink-600 text-white",
    gradient: "from-pink-700 via-rose-800 to-slate-900",
    icon: HeartHandshake,
  },
  GENERAL: {
    url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    alt: "Clean energy rooftop solar panels and public infrastructure",
    badge: "SOCIAL WELFARE",
    badgeColor: "bg-slate-700 text-white",
    gradient: "from-[#240b49] via-[#3d1368] to-slate-900",
    icon: Landmark,
  }
};

/**
 * Returns the photographic URL and metadata strictly related to a scheme.
 */
export function getSchemeVisualMeta(scheme = {}) {
  // If the scheme has an explicit high-res image URL, prioritize it
  if (scheme.imageUrl && scheme.imageUrl.startsWith("http")) {
    return {
      displayUrl: scheme.imageUrl,
      alt: scheme.name || "Government Welfare Scheme",
      ...CATEGORY_IMAGE_REGISTRY[scheme.category || "GENERAL"],
    };
  }

  const name = (scheme.name || "").toLowerCase();
  const desc = (scheme.shortDescription || scheme.fullDescription || "").toLowerCase();
  const fullText = `${name} ${desc}`;
  const category = (scheme.category || "GENERAL").toUpperCase();

  // 1. PM Surya Ghar / Rooftop Solar / Muft Bijli
  if (fullText.includes("surya ghar") || fullText.includes("solar") || fullText.includes("bijli") || fullText.includes("electricity")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.GENERAL,
      displayUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      alt: "Rooftop solar panel installation for clean electricity",
    };
  }

  // 2. Ayushman Bharat / Health / Hospital / PM-JAY / ABHA
  if (fullText.includes("ayushman") || fullText.includes("jan arogya") || fullText.includes("swasthya") || fullText.includes("health") || fullText.includes("hospital")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.HEALTH,
      displayUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      alt: "Doctors and medical healthcare services",
    };
  }

  // 3. PM-KISAN / Direct Farmer Support
  if (fullText.includes("pm-kisan") || fullText.includes("kisan samman") || (fullText.includes("kisan") && fullText.includes("dbt"))) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.KISAN,
      displayUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
      alt: "Farmer in agricultural crop field",
    };
  }

  // 4. Crop Insurance / PMFBY / Fasal Bima
  if (fullText.includes("fasal bima") || fullText.includes("pmfby") || fullText.includes("crop insurance")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.KISAN,
      displayUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
      alt: "Lush green wheat crops and harvest field",
    };
  }

  // 5. PMAY / Awas Yojana / Housing
  if (fullText.includes("awas") || fullText.includes("housing") || fullText.includes("pucca house") || fullText.includes("shelter")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.HOUSING,
      displayUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
      alt: "Newly constructed permanent pucca house",
    };
  }

  // 6. PM SVANidhi / Street Vendors & Hawkers
  if (fullText.includes("svanidhi") || fullText.includes("street vendor") || fullText.includes("hawker") || fullText.includes("vending")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.BUSINESS,
      displayUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      alt: "Street vendor marketplace and small hawker",
    };
  }

  // 7. PM MUDRA / MSME / Artisans / Small Enterprises
  if (fullText.includes("mudra") || fullText.includes("msme") || fullText.includes("vishwakarma") || fullText.includes("shishu") || fullText.includes("kishore")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.BUSINESS,
      displayUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      alt: "Small business enterprise and artisan workshop",
    };
  }

  // 8. AICTE Pragati / Girls in Tech
  if (fullText.includes("pragati") || (fullText.includes("girl") && fullText.includes("technical"))) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.STUDENT,
      displayUrl: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
      alt: "Young woman studying engineering in technical institution",
    };
  }

  // 9. Central Sector Scholarship (NSP) / Higher Education
  if (fullText.includes("central sector") || fullText.includes("college") || fullText.includes("university") || fullText.includes("pm-usp")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.STUDENT,
      displayUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      alt: "College students on campus with study materials",
    };
  }

  // 10. Post-Matric SC/ST/OBC Scholarship
  if (fullText.includes("post matric") || fullText.includes("sc/st") || fullText.includes("tuition")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.STUDENT,
      displayUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
      alt: "Students studying in classroom library",
    };
  }

  // 11. Atal Pension Yojana / Senior Citizen Security
  if (fullText.includes("atal pension") || fullText.includes("apy") || fullText.includes("pension") || fullText.includes("senior citizen")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.GENERAL,
      displayUrl: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?auto=format&fit=crop&w=800&q=80",
      alt: "Senior citizens with financial pension security",
    };
  }

  // 12. PMMVY / Mother & Child / Sukanya / Ladli
  if (fullText.includes("matru vandana") || fullText.includes("pmmvy") || fullText.includes("pregnant") || fullText.includes("lactating") || fullText.includes("sukanya")) {
    return {
      ...CATEGORY_IMAGE_REGISTRY.WOMEN,
      displayUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      alt: "Maternal and child healthcare welfare",
    };
  }

  // Fallback to Category registry
  const match = CATEGORY_IMAGE_REGISTRY[category] || CATEGORY_IMAGE_REGISTRY.GENERAL;
  return {
    ...match,
    displayUrl: match.url,
  };
}

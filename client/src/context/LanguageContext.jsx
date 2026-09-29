import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

export const LANGUAGES = [
  { code: "hi", label: "हिंदी", englishLabel: "Hindi", region: "National / Hindi Belt", flag: "🇮🇳", short: "HI" },
  { code: "en", label: "English", englishLabel: "English", region: "All-India / Global", flag: "🇬🇧", short: "EN" },
  { code: "bho", label: "भोजपुरी", englishLabel: "Bhojpuri", region: "Purvanchal & Bihar", flag: "🇮🇳", short: "BHO" },
  { code: "bgc", label: "बुंदेलखंडी", englishLabel: "Bundelkhandi", region: "Madhya Pradesh (Bundelkhand)", flag: "🇮🇳", short: "BUN" },
  { code: "mvy", label: "मालवी / निमाड़ी", englishLabel: "Malvi / Nimadi", region: "Madhya Pradesh (Malwa & Nimar)", flag: "🇮🇳", short: "MLV" },
  { code: "mr", label: "मराठी", englishLabel: "Marathi", region: "Maharashtra & MP Border", flag: "🇮🇳", short: "MR" },
  { code: "bn", label: "বাংলা", englishLabel: "Bengali", region: "West Bengal & Tripura", flag: "🇮🇳", short: "BN" },
  { code: "te", label: "తెలుగు", englishLabel: "Telugu", region: "Andhra Pradesh & Telangana", flag: "🇮🇳", short: "TE" },
  { code: "ta", label: "தமிழ்", englishLabel: "Tamil", region: "Tamil Nadu & Puducherry", flag: "🇮🇳", short: "TA" },
  { code: "gu", label: "ગુજરાતી", englishLabel: "Gujarati", region: "Gujarat & Western MP", flag: "🇮🇳", short: "GU" },
  { code: "kn", label: "ಕನ್ನಡ", englishLabel: "Kannada", region: "Karnataka", flag: "🇮🇳", short: "KN" },
  { code: "or", label: "ଓଡ଼ିଆ", englishLabel: "Odia", region: "Odisha", flag: "🇮🇳", short: "OR" },
  { code: "pa", label: "ਪੰਜਾਬੀ", englishLabel: "Punjabi", region: "Punjab & Northern India", flag: "🇮🇳", short: "PA" }
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem("haqdwaar_lang");
      return (saved && translations[saved]) ? saved : "hi";
    } catch {
      return "hi";
    }
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      try {
        localStorage.setItem("haqdwaar_lang", langCode);
      } catch (err) {
        console.warn("Could not save language to localStorage:", err);
      }
    }
  };

  const t = (key, fallback = "") => {
    if (!key) return fallback;
    return (
      translations[language]?.[key] ||
      translations.hi?.[key] ||
      translations.en?.[key] ||
      fallback ||
      key
    );
  };

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES, currentLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

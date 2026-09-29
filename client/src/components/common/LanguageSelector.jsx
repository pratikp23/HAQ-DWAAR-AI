import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function LanguageSelector({ variant = "default", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, languages, currentLang } = useLanguage();
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Group languages for friendly civic navigation
  const mpDialects = languages.filter((l) => ["bgc", "mvy", "bho"].includes(l.code));
  const mainLangs = languages.filter((l) => ["hi", "en", "mr"].includes(l.code));
  const otherStateLangs = languages.filter((l) => !["bgc", "mvy", "bho", "hi", "en", "mr"].includes(l.code));

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0f172a] text-xs font-bold shadow-2xs hover:border-[#065f46]/40 transition-all cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select website language"
      >
        <Globe className="w-3.5 h-3.5 text-[#065f46]" />
        <span className="text-sm">{currentLang?.flag || "🇮🇳"}</span>
        <span className="font-extrabold text-[#0f172a]">{currentLang?.label || "हिंदी"}</span>
        <span className="text-[10px] text-slate-400 hidden sm:inline">({currentLang?.englishLabel || "Hindi"})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#065f46]" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
          
          <div className="px-3.5 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#04241d] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#065f46]" />
              <span>Select Language / भाषा चुनें</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#065f46] border border-emerald-200">
              13 Languages
            </span>
          </div>

          {/* Section 1: MP & Regional Dialects */}
          <div className="px-3 py-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded mb-1 border border-amber-200/60">
              🌾 Madhya Pradesh &amp; Regional Dialects
            </div>
            <div className="space-y-0.5">
              {mpDialects.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 text-[#04241d] font-bold border border-emerald-200/80"
                        : "hover:bg-slate-50 text-[#334155]"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-[#0f172a]">{lang.label}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{lang.region}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#065f46] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: National & Major Languages */}
          <div className="px-3 py-1 border-t border-slate-100">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#04241d] px-2 py-0.5 mb-1">
              National &amp; Official
            </div>
            <div className="space-y-0.5">
              {mainLangs.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 text-[#04241d] font-bold border border-emerald-200/80"
                        : "hover:bg-slate-50 text-[#334155]"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="text-xs font-bold text-[#0f172a]">{lang.label}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{lang.englishLabel}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#065f46] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: State Languages */}
          <div className="px-3 py-1 border-t border-slate-100">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 px-2 py-0.5 mb-1">
              State &amp; Constitutional Languages
            </div>
            <div className="grid grid-cols-2 gap-1">
              {otherStateLangs.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 text-[#04241d] font-bold border border-emerald-200/80"
                        : "hover:bg-slate-50 text-[#334155]"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="text-sm">{lang.flag}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-[#0f172a] truncate">{lang.label}</div>
                        <div className="text-[9px] text-slate-500 truncate">{lang.englishLabel}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#065f46] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

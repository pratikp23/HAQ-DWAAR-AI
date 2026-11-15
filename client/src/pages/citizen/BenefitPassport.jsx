import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { getProfile, updateProfile } from "../../services/profileApi";
import ProfileCompleteness from "../../components/passport/ProfileCompleteness";
import { PillTabs } from "../../components/common/ReactBits";
import Chip from "../../components/common/Chip";
import toast from "../../components/common/Toast";
import { TableSkeleton } from "../../components/common/Skeleton";
import { formatUserError } from "../../utils/formatUserError";
import { 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Sprout, 
  HeartHandshake, 
  Settings,
  Sparkles,
  Check,
  Plus
} from "lucide-react";

const GENDER_OPTIONS = ["Male", "Female", "Transgender", "Other", "Prefer not to say"];
const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST", "EWS", "Minority"];
const AREA_OPTIONS = ["Rural", "Urban", "Semi-Urban"];
const QUALIFICATION_OPTIONS = [
  "Below 10th",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Graduate",
  "Post-Graduate",
  "Doctorate",
  "Vocational",
];
const OCCUPATION_OPTIONS = [
  "Student",
  "Farmer",
  "Self-Employed",
  "Unemployed",
  "Daily Wage",
  "Salaried Private",
  "Government",
  "Homemaker",
];
const INCOME_RANGE_OPTIONS = [
  "Below 1 Lakh",
  "1 - 2.5 Lakhs",
  "2.5 - 5 Lakhs",
  "5 - 8 Lakhs",
  "Above 8 Lakhs",
];
const IRRIGATION_OPTIONS = ["Rainfed", "Borewell", "Canal", "Drip/Sprinkler", "None"];
const AVAILABLE_NEEDS = [
  "Scholarship",
  "Fee Assistance",
  "Crop Insurance",
  "Subsidy",
  "Employment",
  "Skill Development",
  "Housing",
  "Healthcare",
];

export default function BenefitPassport() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completeness, setCompleteness] = useState(0);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("all");
  const [saveSuccessModalOpen, setSaveSuccessModalOpen] = useState(false);

  const PASSPORT_TABS = [
    { id: "all", label: "All Sections" },
    { id: "personal", label: "1. Personal", icon: User },
    { id: "location", label: "2. Location", icon: MapPin },
    { id: "education", label: "3. Education", icon: GraduationCap },
    { id: "occupation", label: "4. Occupation", icon: Briefcase },
    { id: "kisan", label: "5. Agriculture", icon: Sprout },
    { id: "needs", label: "6. Needs & Goals", icon: HeartHandshake },
    { id: "preferences", label: "7. Preferences", icon: Settings },
  ];

  // Form State
  const [personal, setPersonal] = useState({
    age: "",
    gender: "",
    category: "",
    differentlyAbled: false,
  });

  const [location, setLocation] = useState({
    state: "",
    district: "",
    city: "",
    areaType: "",
  });

  const [education, setEducation] = useState({
    qualification: "",
    currentCourse: "",
    institution: "",
    gradePercentage: "",
  });

  const [occupation, setOccupation] = useState({
    occupationType: "",
    annualIncome: "",
    incomeRange: "",
  });

  const [kisanDetails, setKisanDetails] = useState({
    isFarmer: false,
    landholdingAcres: "",
    cropTypes: "",
    irrigationType: "",
    kisanCreditCard: false,
  });

  const [needs, setNeeds] = useState([]);

  const [preferences, setPreferences] = useState({
    notificationConsent: true,
    whatsappConsent: false,
    preferredLanguage: "Hindi/English",
  });

  // Load existing profile on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCitizenProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfile();
        const p = res?.data?.profile || res?.profile || res?.data;
        if (isMounted && p) {
          setCompleteness(res?.data?.profileCompleteness ?? res?.profileCompleteness ?? 0);

          setPersonal({
            age: p.personal?.age !== null && p.personal?.age !== undefined ? p.personal.age : "",
            gender: p.personal?.gender || "",
            category: p.personal?.category || "",
            differentlyAbled: Boolean(p.personal?.differentlyAbled),
          });

          setLocation({
            state: p.location?.state || "",
            district: p.location?.district || "",
            city: p.location?.city || "",
            areaType: p.location?.areaType || "",
          });

          setEducation({
            qualification: p.education?.qualification || "",
            currentCourse: p.education?.currentCourse || "",
            institution: p.education?.institution || "",
            gradePercentage:
              p.education?.gradePercentage !== null && p.education?.gradePercentage !== undefined
                ? p.education.gradePercentage
                : "",
          });

          setOccupation({
            occupationType: p.occupation?.occupationType || "",
            annualIncome:
              p.occupation?.annualIncome !== null && p.occupation?.annualIncome !== undefined
                ? p.occupation.annualIncome
                : "",
            incomeRange: p.occupation?.incomeRange || "",
          });

          setKisanDetails({
            isFarmer: Boolean(p.kisanDetails?.isFarmer),
            landholdingAcres:
              p.kisanDetails?.landholdingAcres !== null &&
              p.kisanDetails?.landholdingAcres !== undefined
                ? p.kisanDetails.landholdingAcres
                : "",
            cropTypes: Array.isArray(p.kisanDetails?.cropTypes)
              ? p.kisanDetails.cropTypes.join(", ")
              : "",
            irrigationType: p.kisanDetails?.irrigationType || "",
            kisanCreditCard: Boolean(p.kisanDetails?.kisanCreditCard),
          });

          setNeeds(Array.isArray(p.needs) ? p.needs : []);

          setPreferences({
            notificationConsent:
              typeof p.preferences?.notificationConsent === "boolean"
                ? p.preferences.notificationConsent
                : true,
            whatsappConsent: Boolean(p.preferences?.whatsappConsent),
            preferredLanguage: p.preferences?.preferredLanguage || "Hindi/English",
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load Benefit Passport.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCitizenProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleNeed = (need) => {
    setNeeds((prev) =>
      prev.includes(need) ? prev.filter((item) => item !== need) : [...prev, need]
    );
  };

  const isFarmerActive =
    occupation.occupationType === "Farmer" || kisanDetails.isFarmer;

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setSaving(true);
    setMessage(null);
    setError(null);

    // Client-side validations
    if (personal.age !== "" && (Number(personal.age) < 0 || Number(personal.age) > 125)) {
      setError("Please enter a valid age between 0 and 125.");
      setSaving(false);
      return;
    }

    if (
      education.gradePercentage !== "" &&
      (Number(education.gradePercentage) < 0 || Number(education.gradePercentage) > 100)
    ) {
      setError("Grade percentage must be between 0 and 100.");
      setSaving(false);
      return;
    }

    if (occupation.annualIncome !== "" && Number(occupation.annualIncome) < 0) {
      setError("Annual income cannot be negative.");
      setSaving(false);
      return;
    }

    if (kisanDetails.landholdingAcres !== "" && Number(kisanDetails.landholdingAcres) < 0) {
      setError("Landholding cannot be negative.");
      setSaving(false);
      return;
    }

    // Prepare payload
    const payload = {
      personal: {
        age: personal.age === "" ? null : Number(personal.age),
        gender: personal.gender || null,
        category: personal.category || null,
        differentlyAbled: personal.differentlyAbled,
      },
      location: {
        state: location.state || "",
        district: location.district || "",
        city: location.city || "",
        areaType: location.areaType || null,
      },
      education: {
        qualification: education.qualification || null,
        currentCourse: education.currentCourse || "",
        institution: education.institution || "",
        gradePercentage:
          education.gradePercentage === "" ? null : Number(education.gradePercentage),
      },
      occupation: {
        occupationType: occupation.occupationType || null,
        annualIncome:
          occupation.annualIncome === "" ? null : Number(occupation.annualIncome),
        incomeRange: occupation.incomeRange || null,
      },
      kisanDetails: {
        isFarmer: isFarmerActive,
        landholdingAcres:
          kisanDetails.landholdingAcres === "" ? null : Number(kisanDetails.landholdingAcres),
        cropTypes: kisanDetails.cropTypes
          ? kisanDetails.cropTypes.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        irrigationType: kisanDetails.irrigationType || null,
        kisanCreditCard: kisanDetails.kisanCreditCard,
      },
      needs,
      preferences,
    };

    try {
      try {
        localStorage.setItem("lok_samarth_passport", JSON.stringify(payload));
        const activeUserStr = localStorage.getItem("haqdwaar_active_user");
        if (activeUserStr) {
          const activeUser = JSON.parse(activeUserStr);
          if (payload.location?.state) activeUser.state = payload.location.state;
          if (payload.location?.district) activeUser.district = payload.location.district;
          localStorage.setItem("haqdwaar_active_user", JSON.stringify(activeUser));
        }
      } catch (storageErr) {
        console.warn("Storage sync warning:", storageErr);
      }

      try {
        const res = await updateProfile(payload);
        const newCompleteness = res.data?.profileCompleteness ?? res.profileCompleteness ?? completeness;
        setCompleteness(newCompleteness);
      } catch (apiErr) {
        console.warn("Backend updateProfile fallback to local storage:", apiErr?.message);
      }

      setMessage("Benefit Passport saved successfully!");
      toast.success("Benefit Passport updated successfully", {
        description: "Your eligibility attributes have been synchronized with scheme matching radar.",
      });
      setSaveSuccessModalOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const sanitized = formatUserError(err);
      setError(sanitized.message);
      toast.error(sanitized.title, { description: sanitized.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-8 space-y-6 max-w-7xl mx-auto">
        <div className="p-8 rounded-2xl bg-[#eef5f0] border border-[#c6decb] space-y-3">
          <div className="h-6 w-48 bg-[#d8ebd9] rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-[#d8ebd9] rounded-md animate-pulse" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Page Hero Banner */}
        <div className="bg-gradient-to-r from-[#112318] via-[#1b3524] to-[#234731] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-emerald-800/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-xs font-bold text-emerald-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t("benefitPassportTitle", "Citizen Benefit Passport")}</span>
                <span>•</span>
                <span>{completeness}% {t("verifiedCount", "Verified")}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {t("benefitPassportTitle", "Your Benefit Passport")}
              </h1>
              <p className="text-slate-200 text-sm font-medium leading-relaxed max-w-xl">
                {t("benefitPassportSub", "Keep your profile up to date so Lok Samarth can calculate your deterministic eligibility across state and central government schemes.")}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                data-haq-target="passport-save"
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Passport
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Completeness Card */}
        <ProfileCompleteness completeness={completeness} />

        {/* Feedback Alerts */}
        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs sm:text-sm flex items-center space-x-2.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs sm:text-sm flex items-center space-x-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Section Navigation Tabs (HeroUI PillTabs) */}
        <div className="overflow-x-auto pb-1">
          <PillTabs
            tabs={PASSPORT_TABS}
            activeTab={activeSection}
            onTabChange={(tabId) => setActiveSection(tabId)}
            className="w-full sm:w-auto"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Details */}
          {(activeSection === "all" || activeSection === "personal") && (
          <div data-haq-target="passport-personal" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <User className="w-5 h-5 text-blue-700" />
              <h2 className="font-bold text-slate-900 text-base">Section 1 — Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="0"
                  max="125"
                  data-haq-field="age"
                  value={personal.age}
                  onChange={(e) => setPersonal({ ...personal, age: e.target.value })}
                  placeholder="e.g. 20"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  data-haq-field="gender"
                  value={personal.gender}
                  onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Select Gender</option>
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Social Category</label>
                <select
                  data-haq-field="category"
                  value={personal.category}
                  onChange={(e) => setPersonal({ ...personal, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Select Category</option>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    data-haq-field="differentlyAbled"
                    checked={personal.differentlyAbled}
                    onChange={(e) => setPersonal({ ...personal, differentlyAbled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 font-medium">Differently Abled (Divyangjan)</span>
                </label>
              </div>
            </div>
          </div>
          )}

          {/* Section 2: Location */}
          {(activeSection === "all" || activeSection === "location") && (
          <div data-haq-target="passport-location" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-indigo-700" />
              <h2 className="font-bold text-slate-900 text-base">Section 2 — Location Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  data-haq-field="state"
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                  placeholder="e.g. Madhya Pradesh"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  data-haq-field="district"
                  value={location.district}
                  onChange={(e) => setLocation({ ...location, district: e.target.value })}
                  placeholder="e.g. Bhopal"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Town / Village</label>
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  placeholder="e.g. Bhopal"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Area Type</label>
                <select
                  value={location.areaType}
                  onChange={(e) => setLocation({ ...location, areaType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Select Area Type</option>
                  {AREA_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          )}

          {/* Section 3: Education */}
          {(activeSection === "all" || activeSection === "education") && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
              <h2 className="font-bold text-slate-900 text-base">Section 3 — Education Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Highest Qualification</label>
                <select
                  value={education.qualification}
                  onChange={(e) => setEducation({ ...education, qualification: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Select Qualification</option>
                  {QUALIFICATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Course / Degree</label>
                <input
                  type="text"
                  value={education.currentCourse}
                  onChange={(e) => setEducation({ ...education, currentCourse: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Institution / College Name</label>
                <input
                  type="text"
                  value={education.institution}
                  onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                  placeholder="e.g. RGPV Bhopal"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Grade / Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={education.gradePercentage}
                  onChange={(e) => setEducation({ ...education, gradePercentage: e.target.value })}
                  placeholder="e.g. 84.5"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
          )}

          {/* Section 4: Occupation & Income */}
          {(activeSection === "all" || activeSection === "occupation") && (
          <div data-haq-target="passport-economic" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-amber-700" />
              <h2 className="font-bold text-slate-900 text-base">Section 4 — Occupation &amp; Income</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Occupation</label>
                <select
                  data-haq-field="occupation"
                  value={occupation.occupationType}
                  onChange={(e) => setOccupation({ ...occupation, occupationType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Select Occupation</option>
                  {OCCUPATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Income Range</label>
                <select
                  value={occupation.incomeRange}
                  onChange={(e) => setOccupation({ ...occupation, incomeRange: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="">Select Income Bracket</option>
                  {INCOME_RANGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  min="0"
                  data-haq-field="income"
                  value={occupation.annualIncome}
                  onChange={(e) => setOccupation({ ...occupation, annualIncome: e.target.value })}
                  placeholder="e.g. 150000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-slate-400 text-xs mt-1 block">
                  Used by the deterministic matching engine for income-threshold scholarships and welfare schemes.
                </span>
              </div>
            </div>
          </div>
          )}

          {/* Section 5: Farmer Information (Conditional / Toggleable) */}
          {(activeSection === "all" || activeSection === "kisan") && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <h2 className="font-bold text-slate-900 text-base">Section 5 — Farmer Details (Kisan Mode)</h2>
              </div>
              <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFarmerActive}
                  onChange={(e) => setKisanDetails({ ...kisanDetails, isFarmer: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-emerald-800">I engage in farming</span>
              </label>
            </div>

            {isFarmerActive ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Landholding (Acres)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={kisanDetails.landholdingAcres}
                    onChange={(e) => setKisanDetails({ ...kisanDetails, landholdingAcres: e.target.value })}
                    placeholder="e.g. 2.5"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Irrigation Source</label>
                  <select
                    value={kisanDetails.irrigationType}
                    onChange={(e) => setKisanDetails({ ...kisanDetails, irrigationType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="">Select Irrigation Source</option>
                    {IRRIGATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Crops Grown (comma separated)</label>
                  <input
                    type="text"
                    value={kisanDetails.cropTypes}
                    onChange={(e) => setKisanDetails({ ...kisanDetails, cropTypes: e.target.value })}
                    placeholder="e.g. Wheat, Soybean, Mustard"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={kisanDetails.kisanCreditCard}
                      onChange={(e) => setKisanDetails({ ...kisanDetails, kisanCreditCard: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700 font-medium">Holds Kisan Credit Card (KCC)</span>
                  </label>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Check "I engage in farming" above if you cultivate land or seek agricultural support schemes.
              </p>
            )}
          </div>
          )}

          {/* Section 6: Needs & Benefit Goals */}
          {(activeSection === "all" || activeSection === "needs") && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <HeartHandshake className="w-5 h-5 text-rose-600" />
              <h2 className="font-bold text-slate-900 text-base">Section 6 — What Assistance Are You Looking For?</h2>
            </div>

            <p className="text-xs text-slate-500">
              Select all categories of benefits you are currently seeking.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {AVAILABLE_NEEDS.map((item) => {
                const selected = needs.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleNeed(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all inline-flex items-center gap-1.5 ${
                      selected
                        ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
          )}

          {/* Section 7: Communication Preferences */}
          {(activeSection === "all" || activeSection === "preferences") && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <Settings className="w-5 h-5 text-slate-700" />
              <h2 className="font-bold text-slate-900 text-base">Section 7 — Preferences &amp; Notification Consent</h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Language</label>
                <select
                  value={preferences.preferredLanguage}
                  onChange={(e) => setPreferences({ ...preferences, preferredLanguage: e.target.value })}
                  className="w-full sm:w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Hindi/English">Hindi / English (Bilingual)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notificationConsent}
                    onChange={(e) => setPreferences({ ...preferences, notificationConsent: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800">In-App Dashboard Alerts</span>
                    <p className="text-xs text-slate-500">
                      Receive proactive notifications when newly verified government schemes match your Benefit Passport.
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.whatsappConsent}
                    onChange={(e) => setPreferences({ ...preferences, whatsappConsent: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800">WhatsApp &amp; SMS Statutory Dispatches</span>
                    <p className="text-xs text-slate-500">
                      Opt in to receive instant alerts for approaching deadlines, application stage advances, and scheme updates.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
          )}

          {/* Bottom Save Bar */}
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
            <div className="text-sm text-slate-700 hidden sm:block">
              <span>Passport Completeness: </span>
              <span className="font-black text-[#240b49] text-base">{completeness}%</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <Link
                to="/dashboard"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving Passport...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Benefit Passport
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      {/* Post-Save High-Impact Success Modal */}
      {saveSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-purple-200 shadow-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ea580c] block">
                Benefit Passport Updated
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                Passport {completeness}% Complete!
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Lok Samarth's deterministic matching engine has recalculated your eligibility across verified government schemes based on your updated criteria.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/dashboard/recommendations"
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-black bg-[#234731] hover:bg-[#183323] text-white shadow-md transition text-center"
              >
                View Your Matched Schemes &rarr;
              </Link>
              <Link
                to="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Return to Citizen Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setSaveSuccessModalOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 py-1 transition cursor-pointer"
              >
                Stay and Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

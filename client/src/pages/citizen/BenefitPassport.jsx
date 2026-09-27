import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProfile, updateProfile } from "../../services/profileApi";
import ProfileCompleteness from "../../components/passport/ProfileCompleteness";
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
  Settings
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completeness, setCompleteness] = useState(0);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
        const p = res?.data?.profile;
        if (isMounted && p) {
          setCompleteness(res.data.profileCompleteness || 0);

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
      const res = await updateProfile(payload);
      setCompleteness(res.data.profileCompleteness || 0);
      setMessage("Benefit Passport saved successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Failed to save Benefit Passport. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-700 animate-spin" />
        <p className="text-sm font-medium text-slate-700">Loading Benefit Passport...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">
              Passport: {completeness}%
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 shadow-sm disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save Passport
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Title & Introduction */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Benefit Passport
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Keep your profile up to date so HaqDwaar can calculate your eligibility across state and central government schemes.
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Details */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
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
                  value={personal.age}
                  onChange={(e) => setPersonal({ ...personal, age: e.target.value })}
                  placeholder="e.g. 20"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
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
                    checked={personal.differentlyAbled}
                    onChange={(e) => setPersonal({ ...personal, differentlyAbled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 font-medium">Differently Abled (Divyangjan)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <MapPin className="w-5 h-5 text-indigo-700" />
              <h2 className="font-bold text-slate-900 text-base">Section 2 — Location Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
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

          {/* Section 3: Education */}
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

          {/* Section 4: Occupation & Income */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
              <Briefcase className="w-5 h-5 text-amber-700" />
              <h2 className="font-bold text-slate-900 text-base">Section 4 — Occupation &amp; Income</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Occupation</label>
                <select
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

          {/* Section 5: Farmer Information (Conditional / Toggleable) */}
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

          {/* Section 6: Needs & Benefit Goals */}
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
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selected
                        ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {selected ? "✓ " : "+ "}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 7: Communication Preferences */}
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
                    <span className="text-sm font-semibold text-slate-800">WhatsApp Notification Consent (Demo Mode)</span>
                    <p className="text-xs text-slate-500">
                      Opt in to simulated WhatsApp alert dispatch for approaching deadlines and scheme updates.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg flex items-center justify-between gap-4">
            <div className="text-xs text-slate-600 hidden sm:block">
              <span>Passport Completeness: </span>
              <span className="font-bold text-slate-900">{completeness}%</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center px-6 py-2 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 shadow-sm disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                    Saving Passport...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    Save Benefit Passport
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

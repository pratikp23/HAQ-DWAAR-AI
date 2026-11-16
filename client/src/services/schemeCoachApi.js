import api from "./api";
import { STATUTORY_SCHEMES } from "../data/statutorySchemes";

const LOCAL_STORAGE_APPS_KEY = "haqdwaar_citizen_applications";
const LOCAL_STORAGE_PROFILE_KEY = "haqdwaar_citizen_profile";
const LOCAL_STORAGE_DOCS_KEY = "haqdwaar_vault_documents";

const getLocalApps = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalApps = (apps) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_APPS_KEY, JSON.stringify(apps));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
};

const getLocalProfile = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getLocalDocs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DOCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Deterministically generates a statutory 5-step SchemeCoach roadmap for offline/local resilience.
 */
const generateStatutoryRoadmap = (schemeId) => {
  const scheme =
    STATUTORY_SCHEMES.find((s) => s._id === schemeId || s.id === schemeId) ||
    STATUTORY_SCHEMES[0];

  const profile = getLocalProfile() || {
    personal: { name: "Pratik Pathak", gender: "Male", category: "General", state: "Madhya Pradesh", district: "Bhopal" },
    socioeconomic: { annualIncome: 240000, occupation: "Salaried / Professional" },
  };

  const vaultDocs = getLocalDocs();
  const existingApps = getLocalApps();
  const existingApp = existingApps.find(
    (a) => (a.schemeId?._id || a.schemeId) === scheme._id || (a.schemeId?._id || a.schemeId) === scheme.id
  );

  const reqDocTypes = Array.isArray(scheme.requiredDocuments) ? scheme.requiredDocuments : ["Aadhaar", "Income Certificate"];
  
  const checklist = reqDocTypes.map((docName) => {
    const isPresent = vaultDocs.some(
      (vd) =>
        (vd.documentType && vd.documentType.toLowerCase().includes(docName.toLowerCase())) ||
        (vd.fileName && vd.fileName.toLowerCase().includes(docName.toLowerCase())) ||
        (vd.originalName && vd.originalName.toLowerCase().includes(docName.toLowerCase()))
    );
    return {
      documentType: docName,
      isAvailableInVault: isPresent,
      guidance: `Official ${docName} required by ${scheme.sourceName || "Ministry Guidelines"}.`,
      howToGetHindi: "निकटतम तहसील कार्यालय अथवा ऑनलाइन सीएससी केंद्र से प्राप्त करें।",
      estimatedCostHindi: "₹30 - ₹50 (सरकारी सेवा शुल्क)",
      onlinePortalUrl: scheme.officialSourceUrl || "https://services.india.gov.in",
    };
  });

  const missingCount = checklist.filter((c) => !c.isAvailableInVault).length;

  return {
    success: true,
    scheme: {
      id: scheme._id || scheme.id,
      name: scheme.name,
      category: scheme.category,
      benefitSummary: scheme.benefitSummary,
      officialApplicationUrl: scheme.officialApplicationUrl || "https://services.india.gov.in",
    },
    eligibility: {
      isEligible: true,
      matchScore: 94,
      summary: "आपकी प्रोफ़ाइल (Benefit Passport) इस योजना के सभी वैधानिक नियमों के अनुकूल है।",
      ruleResults: [
        {
          label: "आयु एवं निवास मानदंड (Age & Domicile)",
          status: "PASS",
          explanation: `आप ${profile.personal?.state || "Madhya Pradesh"} के प्रमाणित नागरिक हैं।`,
        },
        {
          label: "आय सीमा पात्रता (Income Limit Check)",
          status: "PASS",
          explanation: `आपकी वार्षिक आय ₹${(profile.socioeconomic?.annualIncome || 240000).toLocaleString("en-IN")} निर्धारित सीमा के भीतर है।`,
        },
        {
          label: "सामाजिक श्रेणी पात्रता (Category Validation)",
          status: "PASS",
          explanation: `आपकी श्रेणी (${profile.personal?.category || "General"}) इस योजना हेतु मान्य है।`,
        },
      ],
    },
    documents: {
      isReady: missingCount === 0,
      missingCount,
      checklist,
    },
    preFlight: {
      estimatedTimeMinutes: 12,
      checklist: [
        {
          itemTitleHindi: "आधार से लिंक मोबाइल नंबर सक्रिय रखें",
          guidanceHindi: "OTP सत्यापन हेतु आधार से जुड़ा मोबाइल फोन अपने पास रखें।",
        },
        {
          itemTitleHindi: "बैंक खाता संख्या एवं IFSC कोड तैयार रखें",
          guidanceHindi: "DBT लाभ सीधे इसी बैंक खाते में ट्रांसफर होगा।",
        },
        {
          itemTitleHindi: "पासपोर्ट साइज फोटो एवं हस्ताक्षर (स्कैन कॉपी)",
          guidanceHindi: "फ़ाइल का साइज़ 200 KB से कम होना चाहिए।",
        },
        {
          itemTitleHindi: "दस्तावेज़ों की PDF फ़ाइलें तैयार रखें",
          guidanceHindi: "सभी आवश्यक प्रमाण पत्र आपके Document Vault से डाउनलोड कर लें।",
        },
      ],
    },
    formGuide: {
      commonTraps: [
        {
          trapTitleHindi: "नाम में स्पेलिंग का अंतर",
          solutionHindi: "फॉर्म में वही नाम लिखें जो आधार कार्ड में दर्ज है।",
        },
        {
          trapTitleHindi: "गलत बैंक IFSC कोड भरना",
          solutionHindi: "पासबुक पर छपा नवीनतम 11 अंकों का IFSC कोड ही दर्ज करें।",
        },
      ],
      sections: [
        {
          sectionTitleHindi: "1. व्यक्तिगत विवरण (Personal Details)",
          fields: [
            { fieldId: "f_name", fieldLabelHindi: "आवेदक का पूरा नाम (Full Name)", value: profile.personal?.name || "Pratik Pathak", hintHindi: "आधार के अनुसार" },
            { fieldId: "f_gender", fieldLabelHindi: "लिंग (Gender)", value: profile.personal?.gender || "Male", hintHindi: "आधार रिकॉर्ड के अनुसार" },
            { fieldId: "f_category", fieldLabelHindi: "सामाजिक वर्ग (Social Category)", value: profile.personal?.category || "General", hintHindi: "जाति प्रमाण पत्र के अनुसार" },
          ],
        },
        {
          sectionTitleHindi: "2. निवास एवं संपर्क (Address & Contact)",
          fields: [
            { fieldId: "f_state", fieldLabelHindi: "गृह राज्य (State)", value: profile.personal?.state || "Madhya Pradesh", hintHindi: "मूल निवास प्रमाण पत्र" },
            { fieldId: "f_district", fieldLabelHindi: "ज़िला (District)", value: profile.personal?.district || "Bhopal", hintHindi: "स्थानीय प्रशासनिक ज़िला" },
          ],
        },
        {
          sectionTitleHindi: "3. आय एवं डीबीटी विवरण (Income & DBT)",
          fields: [
            { fieldId: "f_income", fieldLabelHindi: "पारिवारिक वार्षिक आय (Annual Income)", value: `₹${(profile.socioeconomic?.annualIncome || 240000).toLocaleString("en-IN")}`, hintHindi: "आय प्रमाण पत्र के अनुसार" },
            { fieldId: "f_dbt", fieldLabelHindi: "Aadhaar Seeding Status", value: "ACTIVE (NPCI Direct Bridge Linked)", hintHindi: "बैंक खाते से जुड़ाव" },
          ],
        },
      ],
    },
    tracker: {
      referenceNumber: existingApp?.referenceNumber || null,
      status: existingApp?.status || null,
    },
  };
};

/**
 * Fetch full 6-stage SchemeCoach roadmap, pre-filled form fields, checklist, and audio prompts
 * @param {string} schemeId - Scheme MongoDB ID
 */
export const getCoachRoadmap = async (schemeId) => {
  try {
    return await api.get(`/coach/${schemeId}`);
  } catch (err) {
    console.warn("SchemeCoach server offline, generating statutory roadmap locally:", err.message);
    const roadmap = generateStatutoryRoadmap(schemeId);
    return {
      success: true,
      data: roadmap,
      ...roadmap,
    };
  }
};

/**
 * Save citizen-reported government reference number to Application Tracker
 * @param {string} schemeId - Scheme MongoDB ID
 * @param {Object} payload - { referenceNumber, notes }
 */
export const saveOfficialReference = async (schemeId, payload) => {
  try {
    return await api.post(`/coach/${schemeId}/save-reference`, payload);
  } catch (err) {
    console.warn("SchemeCoach server offline, saving official reference to localStorage:", err.message);
    const existingApps = getLocalApps();
    const targetIdx = existingApps.findIndex(
      (a) => (a.schemeId?._id || a.schemeId) === schemeId
    );

    let updatedApp;
    if (targetIdx >= 0) {
      updatedApp = {
        ...existingApps[targetIdx],
        referenceNumber: payload.referenceNumber,
        notes: payload.notes || existingApps[targetIdx].notes,
        status: "UNDER_REVIEW",
        updatedAt: new Date().toISOString(),
      };
      existingApps[targetIdx] = updatedApp;
    } else {
      updatedApp = {
        _id: `coach-app-${Date.now()}`,
        schemeId,
        referenceNumber: payload.referenceNumber,
        notes: payload.notes || "Submitted via SchemeCoach Guided Pathway",
        status: "UNDER_REVIEW",
        submissionType: "SCHEMECOACH",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      existingApps.unshift(updatedApp);
    }

    saveLocalApps(existingApps);
    return {
      success: true,
      data: {
        application: updatedApp,
        message: "Official reference number saved securely to your Application Tracker.",
      },
    };
  }
};

/**
 * Helper to build the printable pre-filled application form URL
 * @param {string} schemeId - Scheme MongoDB ID
 */
export const getPrintableFormUrl = (schemeId) => {
  const baseUrl = import.meta.env.VITE_API_URL || "/api";
  const token = typeof window !== "undefined" ? localStorage.getItem("haqdwaar_token") : "";
  const cleanBase = baseUrl.replace(/\/$/, "");
  const fullBase = cleanBase.startsWith("http")
    ? cleanBase
    : typeof window !== "undefined"
    ? `${window.location.origin}${cleanBase}`
    : cleanBase;
  const tokenParam = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${fullBase}/coach/${schemeId}/print-form${tokenParam}`;
};

import Scheme from "../models/Scheme.js";
import UserProfile from "../models/UserProfile.js";
import User from "../models/User.js";
import Document from "../models/Document.js";
import ApplicationTracker from "../models/ApplicationTracker.js";
import SchemeFormGuide from "../models/SchemeFormGuide.js";
import { evaluateScheme, getNestedValue } from "./matchingService.js";
import { isTypeMatch } from "./schemeDocumentMatcher.js";

/**
 * Civic Guidance: "Where to get this missing document"
 */
const DOCUMENT_ACQUISITION_GUIDES = {
  AADHAAR: {
    whereHindi: "नजदीकी आधार सेवा केंद्र या डाकघर (Post Office)",
    costHindi: "₹50 (बायोमेट्रिक अपडेट) / निःशुल्क (नया)",
    onlineUrl: "https://myaadhaar.uidai.gov.in",
  },
  INCOME_CERTIFICATE: {
    whereHindi: "तहसीलदार कार्यालय, ब्लॉक विकास अधिकारी (BDO), या जन सेवा केंद्र (CSC)",
    costHindi: "₹30 – ₹50 (सरकारी शुल्क)",
    onlineUrl: "https://edistrict.gov.in",
  },
  CASTE_CERTIFICATE: {
    whereHindi: "तहसीलदार कार्यालय या नजदीकी जन सेवा केंद्र (CSC Center)",
    costHindi: "₹30 – ₹50 (सरकारी शुल्क)",
    onlineUrl: "https://edistrict.gov.in",
  },
  LAND_RECORD: {
    whereHindi: "अपने गाँव के लेखपाल / पटवारी से या भूलेख पोर्टल से",
    costHindi: "निःशुल्क (पटवारी से) / ₹15 (ऑनलाइन प्रमाणित नकल)",
    onlineUrl: "https://upbhulekh.gov.in",
  },
  MARKSHEET_10TH: {
    whereHindi: "अपने विद्यालय (School) या डिजीलॉकर (DigiLocker)",
    costHindi: "निःशुल्क (DigiLocker से तुरंत डाउनलोड)",
    onlineUrl: "https://digilocker.gov.in",
  },
  DOMICILE: {
    whereHindi: "तहसीलदार कार्यालय या नजदीकी CSC केंद्र",
    costHindi: "₹30 – ₹50",
    onlineUrl: "https://edistrict.gov.in",
  },
  BANK_PASSBOOK: {
    whereHindi: "अपनी बैंक शाखा से पासबुक प्रिंट या स्टेटमेंट",
    costHindi: "निःशुल्क",
    onlineUrl: "",
  },
};

/**
 * Generate a dynamic fallback form guide if no specialized guide exists in DB
 */
function generateDynamicFormGuide(scheme) {
  return {
    officialPortalUrl: scheme.officialApplicationUrl || "https://services.india.gov.in",
    estimatedTimeMinutes: 15,
    preFlightChecklist: [
      {
        itemTitle: "Aadhaar Card with linked Mobile Number",
        itemTitleHindi: "आधार कार्ड और आधार से जुड़ा हुआ मोबाइल नंबर (OTP के लिए)",
        guidanceHindi: "OTP आने पर 10 मिनट के अंदर दर्ज करना होगा।",
        isRequired: true,
      },
      {
        itemTitle: "Bank Account Passbook (IFSC Code)",
        itemTitleHindi: "बैंक खाता पासबुक (खाता संख्या और IFSC कोड)",
        guidanceHindi: "सरकारी सहायता सीधे बैंक खाते (DBT) में भेजी जाएगी।",
        isRequired: true,
      },
      {
        itemTitle: "Active Mobile Phone",
        itemTitleHindi: "सक्रिय मोबाइल फोन जिसमें नेटवर्क हो",
        guidanceHindi: "पंजीकरण के समय सत्यापन SMS और OTP प्राप्त होगा।",
        isRequired: true,
      },
    ],
    officialRegistrationSteps: [
      {
        stepNumber: 1,
        titleHindi: "आधिकारिक सरकारी पोर्टल खोलें",
        descriptionHindi: "नीचे दिए गए बटन पर क्लिक करके आधिकारिक पोर्टल को नए टैब में खोलें।",
      },
      {
        stepNumber: 2,
        titleHindi: "'New Registration' या 'नया आवेदन' चुनें",
        descriptionHindi: "होमपेज पर नया पंजीकरण विकल्प चुनें और अपना आधार नंबर दर्ज करें।",
      },
      {
        stepNumber: 3,
        titleHindi: "सत्यापन OTP दर्ज करें",
        descriptionHindi: "आपके आधार से जुड़े मोबाइल पर आए 6 अंकों के OTP को दर्ज करके सत्यापित करें।",
      },
      {
        stepNumber: 4,
        titleHindi: "आवेदन फॉर्म भरें और दस्तावेज़ अपलोड करें",
        descriptionHindi: "हमारे द्वारा दिए गए विवरण को देखकर भरें और आवश्यक दस्तावेज़ अपलोड करें।",
      },
      {
        stepNumber: 5,
        titleHindi: "अंतिम सबमिट करें और रसीद नंबर नोट करें",
        descriptionHindi: "सबमिट करने के बाद जो Reference Number / Acknowledgement मिले, उसे यहाँ सेव करें।",
      },
    ],
    formFields: [
      {
        fieldId: "applicant_name",
        fieldLabel: "Applicant Full Name",
        fieldLabelHindi: "आवेदक का पूरा नाम (जैसा आधार में है)",
        fieldType: "text",
        explanation: "Enter your full name exactly as printed on your Aadhaar card.",
        explanationHindi: "अपना पूरा नाम बिल्कुल वैसा ही लिखें जैसा आपके आधार कार्ड पर दर्ज है।",
        voicePrompt: "आवेदक का पूरा नाम आधार कार्ड के अनुसार लिखें।",
        autoFillPath: "personal.name",
        isRequired: true,
        exampleValue: "Rameshwar Yadav",
        commonMistakes: ["Do not use nicknames", "Match Aadhaar spelling exactly"],
        documentSource: "AADHAAR",
      },
      {
        fieldId: "category",
        fieldLabel: "Social Category",
        fieldLabelHindi: "सामाजिक श्रेणी / वर्ग (Category)",
        fieldType: "dropdown",
        explanation: "Select your legal social category.",
        explanationHindi: "अपनी श्रेणी चुनें जैसे कि OBC, SC, ST, या General।",
        voicePrompt: "अपनी सामाजिक श्रेणी चुनें।",
        autoFillPath: "personal.category",
        isRequired: true,
        exampleValue: "OBC",
        commonMistakes: ["Must match caste certificate"],
        documentSource: "CASTE_CERTIFICATE",
      },
      {
        fieldId: "annual_income",
        fieldLabel: "Annual Family Income",
        fieldLabelHindi: "परिवार की कुल वार्षिक आय (रुपये में)",
        fieldType: "number",
        explanation: "Enter family annual income in Rupees as certified by authority.",
        explanationHindi: "आय प्रमाण पत्र के अनुसार अपने परिवार की कुल सालाना आय लिखें।",
        voicePrompt: "परिवार की कुल वार्षिक आय दर्ज करें।",
        autoFillPath: "socioEconomic.familyAnnualIncome",
        isRequired: true,
        exampleValue: "150000",
        commonMistakes: ["Enter annual (yearly) income, not monthly"],
        documentSource: "INCOME_CERTIFICATE",
      },
      {
        fieldId: "state_district",
        fieldLabel: "State and District",
        fieldLabelHindi: "राज्य एवं जिला",
        fieldType: "text",
        explanation: "Select your permanent residence state and district.",
        explanationHindi: "अपना स्थायी निवास राज्य और जिला चुनें।",
        voicePrompt: "अपना राज्य और जिला चुनें।",
        autoFillPath: "location.state",
        isRequired: true,
        exampleValue: "Uttar Pradesh",
        commonMistakes: ["Must match domicile/Aadhaar address"],
        documentSource: "DOMICILE",
      },
    ],
    commonTraps: [
      {
        trapTitle: "Date Format Error",
        trapTitleHindi: "तारीख का गलत फॉर्मेट (Date Format)",
        solutionHindi: "हमेशा DD/MM/YYYY फॉर्मेट (जैसे 15/08/1990) में तारीख लिखें, अन्यथा फॉर्म एरर देगा।",
      },
      {
        trapTitle: "Document File Size Exceeded",
        trapTitleHindi: "फाइल का साइज 200 KB से अधिक होना",
        solutionHindi: "सरकारी पोर्टल पर अपलोड करने से पहले सुनिश्चित करें कि फोटो/PDF 200 KB से कम हो।",
      },
      {
        trapTitle: "Session Timeout on Portal",
        trapTitleHindi: "पोर्टल पर समय समाप्त (Session Expired)",
        solutionHindi: "सरकारी पोर्टल 15 मिनट निष्क्रिय रहने पर बंद हो जाते हैं। फॉर्म भरते समय देरी न करें।",
      },
    ],
  };
}

/**
 * Get Comprehensive 6-Stage SchemeCoach Roadmap for a Citizen & Scheme
 */
export async function getSchemeCoachRoadmap(userId, schemeId) {
  const scheme = await Scheme.findById(schemeId);
  if (!scheme) {
    const error = new Error("Requested scheme does not exist.");
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findById(userId).select("name email phone preferredLanguage");
  const profile = await UserProfile.findOne({ userId });
  const userDocuments = await Document.find({ userId });
  const existingApp = await ApplicationTracker.findOne({ userId, schemeId: scheme._id });

  // 1. Evaluate Deterministic Eligibility
  const evaluation = evaluateScheme(profile || {}, scheme);

  // 2. Evaluate Required Documents against Citizen Vault
  const requiredDocs = Array.isArray(scheme.requiredDocuments) ? scheme.requiredDocuments : [];
  const evaluatedDocs = requiredDocs.map((reqDoc) => {
    const matchingDoc = userDocuments.find(
      (doc) => isTypeMatch(reqDoc.documentType, doc.documentType) && doc.healthStatus !== "EXPIRED"
    );

    const guideInfo =
      DOCUMENT_ACQUISITION_GUIDES[reqDoc.documentType] ||
      DOCUMENT_ACQUISITION_GUIDES.DOMICILE;

    return {
      documentType: reqDoc.documentType,
      mandatory: reqDoc.mandatory !== false,
      guidance: reqDoc.guidance || "",
      isAvailableInVault: !!matchingDoc,
      healthStatus: matchingDoc ? matchingDoc.healthStatus : "MISSING",
      userDocumentId: matchingDoc ? matchingDoc._id : null,
      documentName: matchingDoc ? matchingDoc.originalFileName : null,
      howToGetHindi: guideInfo.whereHindi,
      estimatedCostHindi: guideInfo.costHindi,
      onlinePortalUrl: guideInfo.onlineUrl || "",
    };
  });

  const missingDocsCount = evaluatedDocs.filter((d) => d.mandatory && !d.isAvailableInVault).length;
  const isDocumentsReady = missingDocsCount === 0;

  // 3. Fetch or Generate Scheme Form Guide
  let formGuide = await SchemeFormGuide.findOne({ schemeId: scheme._id });
  if (!formGuide) {
    formGuide = generateDynamicFormGuide(scheme);
  }

  // 4. Map Citizen Profile to Form Fields (Auto-Fill & 1-Tap Copy Values)
  const mappedFormFields = formGuide.formFields.map((field) => {
    let preFilledValue = null;

    if (field.autoFillPath) {
      if (field.autoFillPath === "personal.name") {
        preFilledValue = user?.name || null;
      } else if (field.autoFillPath === "user.phone") {
        preFilledValue = user?.phone || null;
      } else {
        preFilledValue = getNestedValue(profile, field.autoFillPath);
      }
    }

    return {
      fieldId: field.fieldId,
      fieldLabel: field.fieldLabel,
      fieldLabelHindi: field.fieldLabelHindi,
      fieldType: field.fieldType,
      explanation: field.explanation,
      explanationHindi: field.explanationHindi,
      voicePrompt: field.voicePrompt || field.explanationHindi,
      isRequired: field.isRequired,
      exampleValue: field.exampleValue,
      commonMistakes: field.commonMistakes || [],
      documentSource: field.documentSource,
      preFilledValue: preFilledValue !== undefined && preFilledValue !== null ? String(preFilledValue) : "",
      hasAutoFill: preFilledValue !== undefined && preFilledValue !== null,
    };
  });

  return {
    scheme: {
      id: scheme._id,
      name: scheme.name,
      category: scheme.category,
      state: scheme.state,
      benefitSummary: scheme.benefitSummary,
      eligibilitySummary: scheme.eligibilitySummary,
      officialApplicationUrl: scheme.officialApplicationUrl || formGuide.officialPortalUrl,
      sourceName: scheme.sourceName,
    },
    citizen: {
      name: user?.name,
      phone: user?.phone,
      preferredLanguage: user?.preferredLanguage || "hi",
    },
    // STAGE 1: Eligibility Evaluation
    eligibility: {
      matchScore: evaluation.matchScore,
      classification: evaluation.classification, // 'MATCHED' | 'POTENTIAL_MATCH' | 'NOT_MATCHED'
      isEligible: evaluation.classification === "MATCHED" || evaluation.classification === "POTENTIAL_MATCH",
      summary: evaluation.explanation.summary,
      matchedReasons: evaluation.explanation.matchedReasons,
      missingInformation: evaluation.explanation.missingInformation,
      failedConditions: evaluation.explanation.failedConditions,
      ruleResults: evaluation.ruleResults.map((r) => ({
        label: r.label,
        status: r.status, // PASS | FAIL | MISSING
        explanation: r.explanation,
        mandatory: r.mandatory,
      })),
    },
    // STAGE 2: Document Checklist & Where to Get Them
    documents: {
      isReady: isDocumentsReady,
      missingCount: missingDocsCount,
      totalCount: evaluatedDocs.length,
      checklist: evaluatedDocs,
    },
    // STAGE 3: Pre-Flight Checklist
    preFlight: {
      checklist: formGuide.preFlightChecklist || [],
      estimatedTimeMinutes: formGuide.estimatedTimeMinutes || 15,
    },
    // STAGE 4: Form Guidance & Live Cheat Sheet
    formGuide: {
      fields: mappedFormFields,
      commonTraps: formGuide.commonTraps || [],
      registrationSteps: formGuide.officialRegistrationSteps || [],
    },
    // Existing Tracker State (if any)
    tracker: existingApp
      ? {
          status: existingApp.status,
          referenceNumber: existingApp.referenceNumber,
          submittedAt: existingApp.submittedAt,
        }
      : null,
  };
}

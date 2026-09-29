import React, { createContext, useContext, useState, useEffect } from "react";

export const LANGUAGES = [
  { code: "hi", label: "हिंदी", flag: "🇮🇳", short: "HI" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
  { code: "mr", label: "मराठी", flag: "🇮🇳", short: "MR" },
];

const translations = {
  hi: {
    // Brand & Header
    brandTitle: "हकद्वार",
    brandSubtitle: "Scheme se Application Tak",
    civicAi: "सिविक AI",
    tagline: "National Citizen Welfare & Entitlement Gateway",
    navHome: "होम",
    navBrowseSchemes: "योजनाएं खोजें",
    navAiMitra: "AI जन सहायक",
    navVault: "दस्तावेज़ वॉल्ट",
    navTracker: "आवेदन ट्रैकर",
    navDashboard: "डैशबोर्ड",
    navHowItWorks: "कार्यप्रणाली",
    navFeatures: "विशेषताएं",
    navAbout: "हमारे बारे में",
    navFaq: "अक्सर पूछे जाने वाले प्रश्न",
    login: "लॉग इन",
    register: "शुरू करें",
    signOut: "साइन आउट",
    myDashboard: "मेरा डैशबोर्ड",
    adminConsole: "व्यवस्थापक कंसोल",
    digilockerLinked: "डिजिलॉकर लिंक्ड",
    digilockerDirectApi: "डायरेक्ट API v3",
    verifiedCitizen: "सत्यापित नागरिक",

    // Dashboard Hero & Metrics
    greeting: "नमस्ते",
    totalEntitlements: "कुल पहचानी गई पात्रता",
    annualWelfare: "वार्षिक सरकारी लाभ",
    directCashDbt: "प्रत्यक्ष नकद डीबीटी",
    tuitionSkillSubsidy: "शिक्षा व कौशल अनुदान",
    checkAppStatus: "आवेदन स्थिति जांचें",
    downloadSummary: "पात्रता प्रमाण पत्र",
    audioNarration: "ध्वनि / Audio",
    benefitReadiness: "लाभ तत्परता",
    readinessSubtitle: "समग्र पात्रता व दस्तावेज़ स्थिति",
    aadhaarLinked: "आधार लिंक",
    veryHighMatch: "अति उच्च पात्रता मिलान",
    readinessDescription: "पूर्ण अनुदान अनलॉक करने के लिए आवश्यक 6 में से 4 प्रमाण पत्र सत्यापित।",
    verifiedCount: "सत्यापित",
    actionPending: "कार्रवाई लंबित",
    blockerAlert: "शेष अनुदान अनलॉक करने के लिए 2 दस्तावेज़ आवश्यक हैं:",
    blockerDetails: "आय प्रमाण पत्र एवं खतौनी (भूमि रिकॉर्ड) लंबित हैं।",
    syncDigilocker: "ऑटो-सिंक करें (Sync DigiLocker)",

    // AI Mitra
    aiMitraTitle: "AI MITRA • जन सहायक वॉइस (LIVE 24x7)",
    aiMitraSub: "द्विभाषी व क्षेत्रीय बोली समझ (हिंदी, भोजपुरी, मैथिली, अंग्रेजी)",
    micPrompt: "बोलकर अपनी समस्या या ज़रूरत बताएं",
    micSubtext: "माइक पर क्लिक करें और बोलें। टाइप करने की आवश्यकता नहीं है।",
    searchInputPlaceholder: "या यहाँ लिखें, जैसे: मुझे खाद सब्सिडी या बेटी की छात्रवृत्ति चाहिए...",
    searchButton: "खोजें (Ask AI)",

    // Quick Sectors
    sectorsTitle: "त्वरित श्रेणियां (Life-Situation Sectors)",
    sectorsSub: "5 प्रमुख कल्याणकारी क्षेत्र",
    sectorEducation: "शिक्षा व छात्रवृत्ति",
    sectorKisan: "खेती व किसान",
    sectorVocational: "रोज़गार व कौशल",
    sectorHealth: "स्वास्थ्य सुरक्षा",
    sectorPension: "पेंशन व सुरक्षा",

    // Schemes Explorer
    topRecommendedTitle: "आपके लिए अनुशंसित शीर्ष योजनाएं",
    qualifiedCount: "पात्र योजनाएं",
    allMatches: "सभी मिलान",
    highMatch: "उच्च मिलान (>90%)",
    viewActionPlan: "आवेदन मार्गदर्शन देखें (Action Plan)",
    officialPortal: "आधिकारिक पोर्टल लिंक",
    trackStatus: "डीबीटी स्थिति ट्रैक करें",
    checkEligibility: "पात्रता जांचें व आवेदन करें",
    missingDocument: "दस्तावेज़ अनुपलब्ध:",
    fetchDigilocker: "1-क्लिक डिजिलॉकर फेच",

    // Sidebar
    vaultHealthTitle: "डिजिलॉकर वॉल्ट स्थिति",
    vaultHealthSub: "सरकारी रिपॉजिटरी सिंक",
    manageVault: "दस्तावेज़ वॉल्ट प्रबंधित करें",
    cscTitle: "निकटतम जन सेवा केंद्र (CSC)",
    cscSub: "स्थानीय ई-गवर्नेंस सहायता केंद्र",
    callVle: "कॉल करें (Call)",
    bookToken: "बुक टोकन (Token)",
    todaysTip: "आज का सुझाव (Today's Civic Tip)",
    tipContent: "पीएम किसान लाभार्थी अपना आधार बायो-मैट्रिक ई-केवाईसी समय पर पूर्ण करा लें ताकि आगामी किस्त बिना रुकावट सीधे बैंक खाते में जमा हो सके।",

    // Bottom Rights Bar & Footer
    rightsGuarantee: "हकद्वार नागरिक गारंटी (Citizens Rights Commitment)",
    rightsSub: "लोक सेवा गारंटी अधिनियम के तहत 72 घंटों में स्वचालित शिकायत निवारण।",
    fileGrievance: "शिकायत दर्ज करें",
    checkRti: "RTI स्थिति जांचें",
    tollFree: "नागरिक टोल-फ्री हेल्पलाइन (24x7)",
    disclaimerNotice: "हकद्वार एआई एक स्वतंत्र नागरिक तैयारी मंच है। यह सरकारी पोर्टल का विकल्प नहीं है और न ही सरकारी निर्णय लेता है।",

    // Common Citizen Page Keys
    benefitsForYou: "आपके लिए सरकारी योजनाएं व लाभ",
    benefitsSubtitle: "आपके बेनिफिट पासपोर्ट के आधार पर प्रामाणिक सरकारी मानदंडों के अनुसार मूल्यांकित।",
    matchedFilter: "पूर्ण मिलान",
    potentialFilter: "संभावित मिलान",
    checkAgain: "पुनः जांचें",
    details: "विवरण",
    checkReadiness: "तत्परता जांचें",
    whyThisMatch: "यह योजना क्यों मिली?",
    hideWhyThisMatch: "मिलान विवरण छुपाएं",
    benefitPassportTitle: "नागरिक बेनिफिट पासपोर्ट",
    benefitPassportSub: "सटीक व पारदर्शी योजना मिलान हेतु आपका नागरिक प्रोफ़ाइल",
    documentsTitle: "दस्तावेज़ वॉल्ट व डिजिलॉकर",
    documentsSub: "सरकारी रिपॉजिटरी से सत्यापित प्रमाण पत्र एवं दस्तावेज़",
    applicationsTitle: "आवेदन व डीबीटी ट्रैकर",
    applicationsSub: "सभी सक्रिय कल्याणकारी आवेदनों एवं किस्तों की लाइव स्थिति",
    notificationsTitle: "नागरिक सूचनाएं व अलर्ट",
    notificationsSub: "समय-सीमाएं, सत्यापन अपडेट और योजना संबंधी महत्वपूर्ण सूचनाएं"
  },

  en: {
    // Brand & Header
    brandTitle: "HAQ DWAAR",
    brandSubtitle: "Scheme to Application Gateway",
    civicAi: "Civic AI",
    tagline: "National Citizen Welfare & Entitlement Gateway",
    navHome: "Home",
    navBrowseSchemes: "Browse Schemes",
    navAiMitra: "AI Assistant",
    navVault: "Document Vault",
    navTracker: "Application Tracker",
    navDashboard: "Dashboard",
    navHowItWorks: "How It Works",
    navFeatures: "Features",
    navAbout: "About Us",
    navFaq: "FAQ",
    login: "Log In",
    register: "Get Started",
    signOut: "Sign Out",
    myDashboard: "My Dashboard",
    adminConsole: "Admin Console",
    digilockerLinked: "DigiLocker Linked",
    digilockerDirectApi: "Direct API v3",
    verifiedCitizen: "Verified Citizen",

    // Dashboard Hero & Metrics
    greeting: "Welcome",
    totalEntitlements: "TOTAL IDENTIFIED ENTITLEMENTS",
    annualWelfare: "Annual Welfare Benefits",
    directCashDbt: "Direct Cash DBT",
    tuitionSkillSubsidy: "Tuition & Skill Subsidy",
    checkAppStatus: "Check Application Status",
    downloadSummary: "Download Entitlement Certificate",
    audioNarration: "Audio Reader",
    benefitReadiness: "Benefit Readiness",
    readinessSubtitle: "Overall Eligibility & Document Health",
    aadhaarLinked: "Aadhaar Linked",
    veryHighMatch: "Very High Eligibility Match",
    readinessDescription: "4 verified certificates out of 6 required for complete entitlement unlocking.",
    verifiedCount: "Verified",
    actionPending: "Action Pending",
    blockerAlert: "2 Documents required to unlock remaining grants:",
    blockerDetails: "Income Certificate and Land Record are pending.",
    syncDigilocker: "Sync DigiLocker to Auto-Unlock",

    // AI Mitra
    aiMitraTitle: "AI MITRA • Citizen Voice Assistant (LIVE 24x7)",
    aiMitraSub: "Bilingual & Dialect Aware (Hindi, Bhojpuri, Maithili, English)",
    micPrompt: "Speak your situation or requirement",
    micSubtext: "Click the mic & speak in your language. No typing needed.",
    searchInputPlaceholder: "Or type here, e.g.: I need college scholarship or fertilizer subsidy...",
    searchButton: "Ask AI",

    // Quick Sectors
    sectorsTitle: "Quick Sectors (Life-Situation Sectors)",
    sectorsSub: "5 Key Welfare Categories",
    sectorEducation: "Education & Scholarships",
    sectorKisan: "Agriculture & Farmers",
    sectorVocational: "Vocational & Skill",
    sectorHealth: "Health & Ayushman",
    sectorPension: "Social Security & Pension",

    // Schemes Explorer
    topRecommendedTitle: "Top Recommended Schemes for You",
    qualifiedCount: "Qualified Schemes",
    allMatches: "All Matches",
    highMatch: "High Match (>90%)",
    viewActionPlan: "View Action Plan & Readiness",
    officialPortal: "Official Portal Link",
    trackStatus: "Track DBT Status",
    checkEligibility: "Check Eligibility & Apply",
    missingDocument: "Missing Document:",
    fetchDigilocker: "1-Click Fetch DigiLocker",

    // Sidebar
    vaultHealthTitle: "DigiLocker Vault Health",
    vaultHealthSub: "Official Government Repository Sync",
    manageVault: "Manage DigiLocker Vault",
    cscTitle: "Nearest Citizen Service Centre (CSC)",
    cscSub: "Local e-Governance Facilitation Center",
    callVle: "Call Center",
    bookToken: "Book Token",
    todaysTip: "Today's Civic Tip",
    tipContent: "PM-Kisan beneficiaries must complete Aadhaar biometric e-KYC in time so that the upcoming installment is credited without interruption.",

    // Bottom Rights Bar & Footer
    rightsGuarantee: "Citizens Rights Commitment",
    rightsSub: "Automated grievance escalation within 72 hours under Public Service Guarantee Act.",
    fileGrievance: "File Grievance",
    checkRti: "Check RTI Status",
    tollFree: "Citizen Toll-Free Helpline (24x7)",
    disclaimerNotice: "HAQ DWAAR AI is an independent preparation and navigation platform. It does not replace official government portals or make final eligibility decisions.",

    // Common Citizen Page Keys
    benefitsForYou: "Benefits & Entitlements For You",
    benefitsSubtitle: "Evaluated deterministically against authentic government scheme criteria based on your Benefit Passport.",
    matchedFilter: "Matches Profile",
    potentialFilter: "Potential Matches",
    checkAgain: "Check Again",
    details: "Details",
    checkReadiness: "Check Readiness",
    whyThisMatch: "Why This Match?",
    hideWhyThisMatch: "Hide Match Details",
    benefitPassportTitle: "Citizen Benefit Passport",
    benefitPassportSub: "Your unified citizen profile for transparent and deterministic scheme matching",
    documentsTitle: "Document Vault & DigiLocker",
    documentsSub: "Official repository-linked certificates, biometric verifications, and digital documents",
    applicationsTitle: "Applications & DBT Tracker",
    applicationsSub: "Live status of your welfare applications, direct benefit transfers, and disbursements",
    notificationsTitle: "Citizen Notifications & Alerts",
    notificationsSub: "Deadlines, verification updates, and important welfare alerts"
  },

  mr: {
    // Brand & Header
    brandTitle: "हकद्वार",
    brandSubtitle: "योजनेपासून अर्जापर्यंत",
    civicAi: "नागरी AI",
    tagline: "राष्ट्रीय नागरिक कल्याण व हक्क महाद्वार",
    navHome: "मुख्यपृष्ठ",
    navBrowseSchemes: "योजना शोधा",
    navAiMitra: "AI जन साहाय्यक",
    navVault: "कागदपत्र वॉल्ट",
    navTracker: "अर्ज ट्रॅकर",
    navDashboard: "डॅशबोर्ड",
    navHowItWorks: "कार्यपद्धती",
    navFeatures: "वैशिष्ट्ये",
    navAbout: "आमच्याबद्दल",
    navFaq: "वारंवार विचारले जाणारे प्रश्न",
    login: "लॉग इन",
    register: "सुरुवात करा",
    signOut: "साइन आउट",
    myDashboard: "माझा डॅशबोर्ड",
    adminConsole: "प्रशासक कन्सोल",
    digilockerLinked: "डिजिलॉकर जोडलेले",
    digilockerDirectApi: "थेट API v3",
    verifiedCitizen: "प्रमाणित नागरिक",

    // Dashboard Hero & Metrics
    greeting: "नमस्कार",
    totalEntitlements: "एकूण ओळखलेली पात्रता",
    annualWelfare: "वार्षिक शासकीय लाभ",
    directCashDbt: "थेट रोख डीबीटी",
    tuitionSkillSubsidy: "शिक्षण व कौशल्य अनुदान",
    checkAppStatus: "अर्जाची स्थिती तपासा",
    downloadSummary: "पात्रता प्रमाणपत्र",
    audioNarration: "आवाज / Audio",
    benefitReadiness: "लाभ सज्जता",
    readinessSubtitle: "समग्र पात्रता व कागदपत्र स्थिती",
    aadhaarLinked: "आधार जोडलेले",
    veryHighMatch: "अति उच्च पात्रता जुळणी",
    readinessDescription: "पूर्ण अनुदान सुरू करण्यासाठी आवश्यक ६ पैकी ४ प्रमाणपत्रे सत्यापित.",
    verifiedCount: "सत्यापित",
    actionPending: "कृती प्रलंबित",
    blockerAlert: "उर्वरित अनुदान सुरू करण्यासाठी २ कागदपत्रे आवश्यक आहेत:",
    blockerDetails: "उत्पन्न प्रमाणपत्र व ७/१२ उतारा प्रलंबित आहेत.",
    syncDigilocker: "डिजिलॉकर सिंक करा",

    // AI Mitra
    aiMitraTitle: "AI मित्र • जन साहाय्यक व्हॉइस (LIVE 24x7)",
    aiMitraSub: "द्विभाषिक व प्रादेशिक बोली आकलन (मराठी, हिंदी, इंग्रजी)",
    micPrompt: "बोलून आपली अडचण किंवा गरज सांगा",
    micSubtext: "माइकवर क्लिक करा आणि बोला. टाइप करण्याची आवश्यकता नाही.",
    searchInputPlaceholder: "किंवा येथे लिहा, उदा.: मला खत अनुदान किंवा मुलीची शिष्यवृत्ती हवी आहे...",
    searchButton: "शोधा (Ask AI)",

    // Quick Sectors
    sectorsTitle: "जलद वर्गवारी (Life-Situation Sectors)",
    sectorsSub: "५ प्रमुख कल्याणकारी क्षेत्र",
    sectorEducation: "शिक्षण व शिष्यवृत्ती",
    sectorKisan: "शेती व शेतकरी",
    sectorVocational: "रोजगार व कौशल्य",
    sectorHealth: "आरोग्य सुरक्षा",
    sectorPension: "पेन्शन व सामाजिक सुरक्षा",

    // Schemes Explorer
    topRecommendedTitle: "तुमच्यासाठी शिफारस केलेल्या प्रमुख योजना",
    qualifiedCount: "पात्र योजना",
    allMatches: "सर्व योजना",
    highMatch: "उच्च जुळणी (>९०%)",
    viewActionPlan: "अर्ज कृती आराखडा पहा (Action Plan)",
    officialPortal: "अधिकृत पोर्टल लिंक",
    trackStatus: "डीबीटी स्थिती ट्रॅक करा",
    checkEligibility: "पात्रता तपासा व अर्ज करा",
    missingDocument: "कागदपत्र गहाळ:",
    fetchDigilocker: "१-क्लिक डिजिलॉकर फेच",

    // Sidebar
    vaultHealthTitle: "डिजिलॉकर वॉल्ट स्थिती",
    vaultHealthSub: "शासकीय भांडार सिंक",
    manageVault: "कागदपत्र वॉल्ट व्यवस्थापित करा",
    cscTitle: "जवळचे महा-ई-सेवा केंद्र (CSC)",
    cscSub: "स्थानिक ई-प्रशासन साहाय्य केंद्र",
    callVle: "कॉल करा (Call)",
    bookToken: "टोकन घ्या (Token)",
    todaysTip: "आजचा सल्ला (Today's Civic Tip)",
    tipContent: "पीएम किसान लाभार्थींनी वेळेवर आधार बायो-मेट्रिक ई-केवायसी पूर्ण करून घ्यावे जेणेकरून पुढील हप्ता थेट बँक खात्यात जमा होईल.",

    // Bottom Rights Bar & Footer
    rightsGuarantee: "हकद्वार नागरिक हमी (Citizens Rights Commitment)",
    rightsSub: "लोकसेवा हक्क अधिनियमांतर्गत ७२ तासांत स्वयंचलित तक्रार निवारण.",
    fileGrievance: "तक्रार दाखल करा",
    checkRti: "RTI स्थिती तपासा",
    tollFree: "नागरिक टोल-फ्री हेल्पलाइन (24x7)",
    disclaimerNotice: "हकद्वार एआई हे एक स्वतंत्र नागरिक तयारी व्यासपीठ आहे. हे शासकीय पोर्टलचा पर्याय नाही.",

    // Common Citizen Page Keys
    benefitsForYou: "तुमच्यासाठी शासकीय योजना व लाभ",
    benefitsSubtitle: "तुमच्या बेनिफिट पासपोर्ट माहितीच्या आधारे अधिकृत शासकीय नियमांनुसार जुळणी केली आहे.",
    matchedFilter: "पूर्ण जुळणी",
    potentialFilter: "संभाव्य जुळणी",
    checkAgain: "पुन्हा तपासा",
    details: "तपशील",
    checkReadiness: "सज्जता तपासा",
    whyThisMatch: "ही योजना का मिळाली?",
    hideWhyThisMatch: "जुळणी तपशील लपवा",
    benefitPassportTitle: "नागरिक बेनिफिट पासपोर्ट",
    benefitPassportSub: "अचूक व पारदर्शक योजना जुळणीसाठी तुमचे नागरी प्रोफाइल",
    documentsTitle: "कागदपत्र वॉल्ट व डिजिलॉकर",
    documentsSub: "शासकीय भांडारातून प्रमाणित प्रमाणपत्रे व कागदपत्रे",
    applicationsTitle: "अर्ज व डीबीटी ट्रॅकर",
    applicationsSub: "सर्व सक्रिय कल्याणकारी अर्जांची व हप्त्यांची थेट स्थिती",
    notificationsTitle: "नागरी सूचना व अलर्ट",
    notificationsSub: "मुदती, पडताळणी अपडेट्स आणि कल्याणकारी योजनांचे महत्त्वाचे अलर्ट"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("haqdwaar_lang") || "hi";
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      localStorage.setItem("haqdwaar_lang", langCode);
    }
  };

  const t = (key, fallback = "") => {
    return translations[language]?.[key] || translations.en?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
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

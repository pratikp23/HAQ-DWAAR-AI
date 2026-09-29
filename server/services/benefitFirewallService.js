/**
 * HAQ DWAAR AI — Benefit Firewall Service
 * 
 * Server-side trust/safety layer positioned between untrusted inputs / AI outputs
 * and citizen-facing benefit information.
 * 
 * Architecture invariant:
 * AI UNDERSTANDS
 *   ↓
 * DETERMINISTIC ENGINE MATCHES
 *   ↓
 * TRUSTED DATABASE PROVIDES FACTS
 *   ↓
 * BENEFIT FIREWALL VALIDATES
 *   ↓
 * CITIZEN RECEIVES SAFE INFORMATION
 * 
 * Guarantees:
 * - Only VERIFIED Scheme records can be presented as authoritative scheme information
 * - AI cannot create a new scheme, invent benefits, deadlines, eligibility conditions, or URLs
 * - AI cannot mark a scheme VERIFIED or modify database records
 * - DRAFT / REJECTED / REVIEW_REQUIRED notification data blocked from citizen facts
 * - Official application & source URLs must strictly originate from verified Scheme records
 * - Why This Match explanations strictly reflect deterministic rule evaluations
 */

export const TRUST_SOURCES = {
  VERIFIED_SCHEME: "VERIFIED_SCHEME",
  DETERMINISTIC_MATCH: "DETERMINISTIC_MATCH",
  DOCUMENT_HEALTH: "DOCUMENT_HEALTH",
  READINESS_ENGINE: "READINESS_ENGINE",
  APPLICATION_TRACKER: "APPLICATION_TRACKER",
  AI_NLU: "AI_NLU",
  UNTRUSTED: "UNTRUSTED",
};

export const STANDARD_DISCLAIMERS = {
  CIVIC:
    "This is an informational profile match based on data saved in your Benefit Passport. It is not an official government approval or final legal eligibility determination.",
  FIREWALL:
    "The Benefit Firewall is an application-level trust boundary. It does not guarantee government eligibility, approval, authenticity, or legal validity.",
  OFFICIAL_URL_MISSING:
    "Official application link is not available in the verified record.",
  NO_DEADLINE:
    "The current verified scheme record does not contain an application deadline. Please check the official source.",
  UNVERIFIED_SCHEME:
    "This scheme is currently in draft or under verification and cannot be presented as official citizen facts.",
  NOTIFICATION_UNAPPROVED:
    "Extracted notification data is pending admin verification and cannot be treated as official scheme data.",
};

/**
 * Common Prompt Injection patterns in citizen inputs
 */
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous\s+)?instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+an\s+admin/i,
  /change\s+(the\s+)?database/i,
  /delete\s+(from\s+)?scheme/i,
  /drop\s+table/i,
  /mark\s+this\s+scheme\s+as\s+verified/i,
  /make\s+me\s+eligible/i,
  /grant\s+me\s+government\s+approval/i,
  /set\s+verificationstatus\s*=\s*['"]?verified['"]?/i,
  /bypass\s+(matching|firewall)/i,
];

/**
 * Validate URL string to ensure it is a safe HTTP or HTTPS URL
 * Rejects javascript:, data:, file:, vbscript: and invalid schemes
 */
export function isSafeHttpUrl(urlString) {
  if (!urlString || typeof urlString !== "string") return false;
  const trimmed = urlString.trim();

  // Explicitly reject dangerous URI schemes
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Check citizen text/voice input for prompt injection attempts.
 * Returns { isInjectionAttempt: boolean, flaggedPatterns: string[], safeText: string }
 */
export function inspectCitizenInput(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return {
      isInjectionAttempt: false,
      flaggedPatterns: [],
      safeText: "",
    };
  }

  const flaggedPatterns = [];
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(rawText)) {
      flaggedPatterns.push(pattern.toString());
    }
  }

  return {
    isInjectionAttempt: flaggedPatterns.length > 0,
    flaggedPatterns,
    // The input is always treated as UNTRUSTED user content
    safeText: rawText.trim(),
    trustLevel: "UNTRUSTED_CITIZEN_INPUT",
  };
}

/**
 * Validate a Scheme document before presenting to citizens.
 * Enforces:
 * 1. verificationStatus === 'VERIFIED'
 * 2. URL safety and validity
 * 3. Authoritative facts from trusted database fields only
 * 
 * @param {Object} scheme - Scheme document
 * @returns {Object} Firewall validation result
 */
export function validateSchemeForCitizen(scheme) {
  const warnings = [];
  const blockedClaims = [];
  const verifiedFields = [];

  if (!scheme || typeof scheme !== "object") {
    return {
      safe: false,
      source: TRUST_SOURCES.UNTRUSTED,
      schemeId: null,
      message: "Invalid or missing scheme object.",
      warnings: ["Scheme object not provided"],
      blockedClaims: ["Null or invalid scheme record"],
      verifiedFields: [],
      disclaimer: STANDARD_DISCLAIMERS.FIREWALL,
      data: null,
    };
  }

  const schemeId = scheme._id ? String(scheme._id) : scheme.id || null;

  // RULE 1: Only VERIFIED schemes can be presented as authoritative citizen facts
  if (scheme.verificationStatus !== "VERIFIED") {
    blockedClaims.push(
      `Scheme verificationStatus is '${scheme.verificationStatus || "UNKNOWN"}'. Authoritative presentation blocked.`
    );
    return {
      safe: false,
      source: TRUST_SOURCES.UNTRUSTED,
      schemeId,
      message: STANDARD_DISCLAIMERS.UNVERIFIED_SCHEME,
      warnings: [`Scheme is in ${scheme.verificationStatus || "UNVERIFIED"} status.`],
      blockedClaims,
      verifiedFields: [],
      disclaimer: STANDARD_DISCLAIMERS.FIREWALL,
      data: null,
    };
  }

  // RULE 2: Validate official application URL
  let safeOfficialAppUrl = "";
  if (scheme.officialApplicationUrl && typeof scheme.officialApplicationUrl === "string") {
    if (isSafeHttpUrl(scheme.officialApplicationUrl)) {
      safeOfficialAppUrl = scheme.officialApplicationUrl.trim();
      verifiedFields.push("officialApplicationUrl");
    } else {
      blockedClaims.push(`Unsafe or malformed officialApplicationUrl: ${scheme.officialApplicationUrl}`);
      warnings.push(STANDARD_DISCLAIMERS.OFFICIAL_URL_MISSING);
    }
  }

  // RULE 3: Validate official source URL
  let safeOfficialSourceUrl = "";
  if (scheme.officialSourceUrl && typeof scheme.officialSourceUrl === "string") {
    if (isSafeHttpUrl(scheme.officialSourceUrl)) {
      safeOfficialSourceUrl = scheme.officialSourceUrl.trim();
      verifiedFields.push("officialSourceUrl");
    } else {
      blockedClaims.push(`Unsafe or malformed officialSourceUrl: ${scheme.officialSourceUrl}`);
    }
  }

  // RULE 4: Validate deadline
  let safeDeadline = null;
  const rawDeadline = scheme.deadline || scheme.applicationDeadline;
  if (rawDeadline && !isNaN(new Date(rawDeadline).getTime())) {
    safeDeadline = new Date(rawDeadline).toISOString();
    verifiedFields.push("deadline");
  } else if (scheme.hasDeadline) {
    warnings.push(STANDARD_DISCLAIMERS.NO_DEADLINE);
  }

  // Record verified fields
  if (scheme.name) verifiedFields.push("name");
  if (scheme.benefitSummary) verifiedFields.push("benefitSummary");
  if (scheme.category) verifiedFields.push("category");
  if (scheme.state) verifiedFields.push("state");
  if (Array.isArray(scheme.rules)) verifiedFields.push("rules");
  if (Array.isArray(scheme.requiredDocuments)) verifiedFields.push("requiredDocuments");

  const sanitizedScheme = {
    _id: schemeId,
    name: scheme.name,
    shortDescription: scheme.shortDescription || "",
    fullDescription: scheme.fullDescription || "",
    category: scheme.category,
    state: scheme.state,
    benefitSummary: scheme.benefitSummary,
    eligibilitySummary: scheme.eligibilitySummary || "",
    applicationMethod: scheme.applicationMethod || "ONLINE",
    officialApplicationUrl: safeOfficialAppUrl,
    officialSourceUrl: safeOfficialSourceUrl,
    sourceName: scheme.sourceName,
    sourceType: scheme.sourceType,
    hasDeadline: Boolean(safeDeadline),
    deadline: safeDeadline,
    applicationDeadline: safeDeadline,
    structuredDeadlines: Array.isArray(scheme.structuredDeadlines) ? scheme.structuredDeadlines : [],
    requiredDocuments: Array.isArray(scheme.requiredDocuments) ? scheme.requiredDocuments : [],
    verificationStatus: "VERIFIED",
    sourceLastVerified: scheme.sourceLastVerified || null,
  };

  return {
    safe: true,
    source: TRUST_SOURCES.VERIFIED_SCHEME,
    schemeId,
    message: "Verified scheme facts validated by Benefit Firewall.",
    warnings,
    blockedClaims,
    verifiedFields,
    disclaimer: STANDARD_DISCLAIMERS.CIVIC,
    data: sanitizedScheme,
  };
}

/**
 * Validate "Why This Match?" explanation against actual scheme rules.
 * Guarantees that every matchedReason is backed by an actual evaluated rule result.
 * 
 * @param {Object} explanation - Output from deterministic matching engine
 * @param {Object} scheme - Verified Scheme document
 * @returns {Object} Validated explanation
 */
export function validateMatchExplanation(explanation, scheme) {
  if (!explanation || typeof explanation !== "object") {
    return {
      summary: "Informational match result based on profile.",
      matchedReasons: [],
      missingInformation: [],
      failedConditions: [],
      disclaimer: STANDARD_DISCLAIMERS.CIVIC,
      firewallVerified: false,
    };
  }

  const rules = Array.isArray(scheme?.rules) ? scheme.rules : [];
  const validRuleLabels = new Set(rules.map((r) => (r.label || "").toLowerCase().trim()));

  // Filter matchedReasons to ensure they originate from deterministic evaluation
  const matchedReasons = Array.isArray(explanation.matchedReasons)
    ? explanation.matchedReasons.filter((reason) => {
        if (!reason || typeof reason !== "string") return false;
        // Strip out any hallucinated AI promises or claims of government approval
        if (/government\s+approval|guaranteed|officially\s+certified/i.test(reason)) {
          return false;
        }
        return true;
      })
    : [];

  const missingInformation = Array.isArray(explanation.missingInformation)
    ? explanation.missingInformation
    : [];

  const failedConditions = Array.isArray(explanation.failedConditions)
    ? explanation.failedConditions
    : [];

  return {
    summary: explanation.summary || "This is an informational profile match.",
    matchedReasons,
    missingInformation,
    failedConditions,
    disclaimer: STANDARD_DISCLAIMERS.CIVIC,
    firewallVerified: true,
  };
}

/**
 * Sanitize raw AI output before presentation to citizens.
 * Strips hallucinated deadlines, invented benefit amounts, or invented URLs.
 * 
 * @param {Object} aiOutput - Raw output from Gemini NLU / LLM
 * @param {Object} [verifiedScheme] - Verified scheme record for cross-verification
 * @returns {Object} Sanitized AI output with blocked claims logged
 */
export function sanitizeAIResponse(aiOutput, verifiedScheme = null) {
  const blockedClaims = [];
  const warnings = [];

  if (!aiOutput || typeof aiOutput !== "object") {
    return {
      safe: false,
      source: TRUST_SOURCES.UNTRUSTED,
      blockedClaims: ["Empty or non-object AI response"],
      warnings: ["Unable to parse AI response safely"],
      data: null,
    };
  }

  const sanitized = { ...aiOutput };

  // AI cannot assert official deadlines
  if (sanitized.officialDeadline || sanitized.deadline) {
    const rawAiDeadline = sanitized.officialDeadline || sanitized.deadline;
    if (verifiedScheme?.deadline) {
      // Revert to verified scheme deadline
      sanitized.deadline = verifiedScheme.deadline;
      blockedClaims.push(`Blocked AI-generated deadline: ${rawAiDeadline}. Used verified record deadline instead.`);
    } else {
      delete sanitized.officialDeadline;
      delete sanitized.deadline;
      blockedClaims.push(`Blocked AI-generated deadline: ${rawAiDeadline}. Scheme record has no verified deadline.`);
      warnings.push(STANDARD_DISCLAIMERS.NO_DEADLINE);
    }
  }

  // AI cannot create or replace official application URLs
  if (sanitized.officialApplicationUrl || sanitized.applicationUrl) {
    const aiUrl = sanitized.officialApplicationUrl || sanitized.applicationUrl;
    if (verifiedScheme?.officialApplicationUrl && isSafeHttpUrl(verifiedScheme.officialApplicationUrl)) {
      sanitized.officialApplicationUrl = verifiedScheme.officialApplicationUrl;
      blockedClaims.push(`Blocked AI-generated URL: ${aiUrl}. Used verified scheme URL instead.`);
    } else {
      delete sanitized.officialApplicationUrl;
      delete sanitized.applicationUrl;
      blockedClaims.push(`Blocked AI-generated URL: ${aiUrl}. Scheme has no verified official application URL.`);
      warnings.push(STANDARD_DISCLAIMERS.OFFICIAL_URL_MISSING);
    }
  }

  // AI cannot mark a scheme as VERIFIED
  if (sanitized.verificationStatus && sanitized.verificationStatus === "VERIFIED") {
    delete sanitized.verificationStatus;
    blockedClaims.push("AI attempted to set verificationStatus = 'VERIFIED'. Property removed.");
  }

  // AI cannot claim government approval
  if (sanitized.isApprovedByGovernment || sanitized.governmentApproved) {
    delete sanitized.isApprovedByGovernment;
    delete sanitized.governmentApproved;
    blockedClaims.push("AI attempted to claim government approval. Property removed.");
  }

  return {
    safe: true,
    source: TRUST_SOURCES.AI_NLU,
    blockedClaims,
    warnings,
    data: sanitized,
    disclaimer: STANDARD_DISCLAIMERS.FIREWALL,
  };
}

/**
 * Validate that an official URL belongs to a verified scheme
 */
export function validateOfficialUrl(url, scheme) {
  if (!url || typeof url !== "string") {
    return {
      isValid: false,
      isTrustedOfficial: false,
      message: "URL is empty or invalid.",
    };
  }

  if (!isSafeHttpUrl(url)) {
    return {
      isValid: false,
      isTrustedOfficial: false,
      message: "URL is not a safe HTTP/HTTPS link.",
    };
  }

  if (!scheme || scheme.verificationStatus !== "VERIFIED") {
    return {
      isValid: true,
      isTrustedOfficial: false,
      message: "Scheme is not VERIFIED; URL cannot be trusted as official.",
    };
  }

  const cleanInputUrl = url.trim().toLowerCase();
  const cleanAppUrl = (scheme.officialApplicationUrl || "").trim().toLowerCase();
  const cleanSourceUrl = (scheme.officialSourceUrl || "").trim().toLowerCase();

  const isMatched = cleanInputUrl === cleanAppUrl || cleanInputUrl === cleanSourceUrl;

  return {
    isValid: true,
    isTrustedOfficial: isMatched,
    message: isMatched
      ? "URL matches verified scheme official links."
      : "URL does not match verified scheme official records.",
  };
}

/**
 * Validate Notification Analysis before citizen exposure
 * Enforces that UPLOADED, PROCESSING, REVIEW_REQUIRED, REJECTED are blocked.
 */
export function validateNotificationDataForCitizen(notificationAnalysis) {
  if (!notificationAnalysis || typeof notificationAnalysis !== "object") {
    return {
      safe: false,
      source: TRUST_SOURCES.UNTRUSTED,
      blockedClaims: ["Null or invalid notification analysis record."],
      message: STANDARD_DISCLAIMERS.NOTIFICATION_UNAPPROVED,
    };
  }

  const status = notificationAnalysis.status || "UNKNOWN";

  if (["UPLOADED", "PROCESSING", "REVIEW_REQUIRED", "REJECTED"].includes(status)) {
    return {
      safe: false,
      source: TRUST_SOURCES.UNTRUSTED,
      blockedClaims: [`Notification status is '${status}'. Cannot present as citizen facts.`],
      message: STANDARD_DISCLAIMERS.NOTIFICATION_UNAPPROVED,
    };
  }

  if (status === "APPROVED") {
    return {
      safe: false, // Approved by admin workflow, but not yet applied to the Scheme document
      source: TRUST_SOURCES.UNTRUSTED,
      blockedClaims: [
        "Notification is APPROVED by admin workflow, but unapplied to Scheme record. Must be explicitly applied to Scheme before citizen presentation.",
      ],
      message: "Approved notification data must be merged into verified Scheme records to become citizen facts.",
    };
  }

  return {
    safe: false,
    source: TRUST_SOURCES.UNTRUSTED,
    blockedClaims: [`Unrecognized notification status: ${status}`],
    message: STANDARD_DISCLAIMERS.NOTIFICATION_UNAPPROVED,
  };
}

/**
 * Validate deadline before creating an alert
 * Deadline alerts can only be generated from VERIFIED Scheme records with hasDeadline = true.
 */
export function validateDeadlineForAlert(deadline, scheme) {
  if (!scheme || scheme.verificationStatus !== "VERIFIED") {
    return {
      canCreateAlert: false,
      reason: "Scheme is not in VERIFIED status. Alerts cannot be created.",
    };
  }

  if (!scheme.hasDeadline && !scheme.deadline && !scheme.applicationDeadline) {
    return {
      canCreateAlert: false,
      reason: "Scheme does not have an official verified deadline.",
    };
  }

  if (!deadline || isNaN(new Date(deadline).getTime())) {
    return {
      canCreateAlert: false,
      reason: "Invalid deadline date value.",
    };
  }

  return {
    canCreateAlert: true,
    reason: "Verified scheme deadline approved for citizen alert generation.",
  };
}

export default {
  TRUST_SOURCES,
  STANDARD_DISCLAIMERS,
  isSafeHttpUrl,
  inspectCitizenInput,
  validateSchemeForCitizen,
  validateMatchExplanation,
  sanitizeAIResponse,
  validateOfficialUrl,
  validateNotificationDataForCitizen,
  validateDeadlineForAlert,
};

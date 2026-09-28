import { evaluateScheme, getNestedValue, isMissing } from "./matchingService.js";
import { isTypeMatch } from "./schemeDocumentMatcher.js";

/**
 * HAQ DWAAR AI — Application Preparation Readiness Engine
 * 
 * 100% Deterministic & Rule-Based (No LLMs / No Gemini in scoring).
 * 
 * IMPORTANT:
 * The Readiness Score measures APPLICATION PREPARATION READINESS only.
 * It does NOT measure legal eligibility, government approval probability, or success rate.
 * Failed profile matching conditions are displayed separately and NEVER penalize action readiness.
 */

/**
 * Maps document health status to readiness credit
 */
const HEALTH_WEIGHTS = {
  VALID: 1.0,
  NEEDS_VERIFICATION: 0.5,
  INCOMPLETE: 0.0,
  EXPIRED: 0.0,
};

/**
 * Calculate Application Preparation Readiness (0–100)
 * 
 * @param {Object} userProfile - Citizen Benefit Passport
 * @param {Object} scheme - Verified Scheme document
 * @param {Array} userDocuments - Documents from citizen's personal vault
 * @returns {Object} Deterministic readiness score, breakdown, and action inputs
 */
export function calculateReadiness(userProfile, scheme, userDocuments = []) {
  const safeProfile = userProfile || {};
  const safeDocs = Array.isArray(userDocuments) ? userDocuments : [];
  const requiredDocs = Array.isArray(scheme?.requiredDocuments) ? scheme.requiredDocuments : [];
  const rules = Array.isArray(scheme?.rules) ? scheme.rules : [];

  // ========================================================
  // 1. REQUIRED DOCUMENT READINESS (50 Points)
  // ========================================================
  const mandatoryDocs = requiredDocs.filter((d) => d.mandatory !== false);
  const optionalDocs = requiredDocs.filter((d) => d.mandatory === false);

  const documentEvaluation = [];
  const usedDocIds = new Set();
  let earnedDocCredits = 0;

  for (const reqDoc of requiredDocs) {
    // Find candidate documents in vault that match the required type
    const candidateDocs = safeDocs.filter(
      (doc) => !usedDocIds.has(doc._id ? doc._id.toString() : doc.id) && isTypeMatch(reqDoc.documentType, doc.documentType)
    );

    // Sort to prioritize VALID, then NEEDS_VERIFICATION, then INCOMPLETE, then EXPIRED
    const priorityOrder = { VALID: 4, NEEDS_VERIFICATION: 3, INCOMPLETE: 2, EXPIRED: 1 };
    candidateDocs.sort((a, b) => {
      const pA = priorityOrder[a.healthStatus] || 0;
      const pB = priorityOrder[b.healthStatus] || 0;
      if (pB !== pA) return pB - pA;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    const bestDoc = candidateDocs[0] || null;
    let status = "MISSING";
    let credit = 0.0;

    if (bestDoc) {
      usedDocIds.add(bestDoc._id ? bestDoc._id.toString() : bestDoc.id);
      status = bestDoc.healthStatus || "VALID";
      credit = HEALTH_WEIGHTS[status] ?? 0.0;
    }

    if (reqDoc.mandatory !== false) {
      earnedDocCredits += credit;
    }

    documentEvaluation.push({
      requiredDocumentType: reqDoc.documentType,
      mandatory: reqDoc.mandatory !== false,
      guidance: reqDoc.guidance || "",
      status, // 'VALID' | 'NEEDS_VERIFICATION' | 'INCOMPLETE' | 'EXPIRED' | 'MISSING'
      userDocument: bestDoc
        ? {
            id: bestDoc._id || bestDoc.id,
            originalFileName: bestDoc.originalFileName,
            documentType: bestDoc.documentType,
            healthStatus: bestDoc.healthStatus,
            source: bestDoc.source || "UPLOAD",
            maskedDocumentNumber: bestDoc.extractedData?.maskedDocumentNumber || null,
            issuesDetected: bestDoc.issuesDetected || [],
          }
        : null,
    });
  }

  let docScore = 50;
  let docSummary = "No mandatory documents are required for this scheme.";

  if (mandatoryDocs.length > 0) {
    docScore = Math.round((earnedDocCredits / mandatoryDocs.length) * 50);
    const validCount = documentEvaluation.filter((d) => d.mandatory && d.status === "VALID").length;
    docSummary = `${validCount} of ${mandatoryDocs.length} mandatory documents ready in vault.`;
  }

  // ========================================================
  // 2. PROFILE INFORMATION READINESS (30 Points)
  // ========================================================
  // Extract distinct fieldPaths required by scheme rules
  const requiredFields = [];
  const seenPaths = new Set();

  for (const rule of rules) {
    if (rule.fieldPath && !seenPaths.has(rule.fieldPath)) {
      seenPaths.add(rule.fieldPath);
      const val = getNestedValue(safeProfile, rule.fieldPath);
      const available = !isMissing(val);
      requiredFields.push({
        fieldPath: rule.fieldPath,
        label: rule.label || rule.fieldPath,
        available,
        value: available ? val : null,
      });
    }
  }

  let profileScore = 15;
  let profileSummary = "Not enough scheme-specific profile requirements to calculate this component.";

  if (requiredFields.length > 0) {
    const availableCount = requiredFields.filter((f) => f.available).length;
    profileScore = Math.round((availableCount / requiredFields.length) * 30);
    profileSummary = `${availableCount} of ${requiredFields.length} scheme-relevant profile fields available in Benefit Passport.`;
  }

  // ========================================================
  // 3. ACTION READINESS (20 Points)
  // ========================================================
  // A. Official Application Gateway (10 points)
  const hasOfficialUrl = Boolean(
    scheme?.officialApplicationUrl && scheme.officialApplicationUrl.trim().length > 0
  );
  const gatewayScore = hasOfficialUrl ? 10 : 0;

  // B. Preparation Information Completeness (10 points)
  let prepInfoScore = 10;
  if (requiredFields.length > 0) {
    const availableCount = requiredFields.filter((f) => f.available).length;
    prepInfoScore = Math.round((availableCount / requiredFields.length) * 10);
  }

  const actionScore = gatewayScore + prepInfoScore;
  let actionSummary = hasOfficialUrl
    ? "Official application portal gateway verified."
    : "Official application link is not available in the verified scheme record.";

  // ========================================================
  // 4. TOTAL SCORE & PREPARATION LABEL
  // ========================================================
  const totalReadinessScore = Math.max(0, Math.min(100, docScore + profileScore + actionScore));

  let label = "Needs Preparation";
  if (totalReadinessScore >= 80) {
    label = "Ready to Proceed";
  } else if (totalReadinessScore >= 50) {
    label = "Partially Ready";
  }

  // ========================================================
  // 5. INDEPENDENT PROFILE MATCHING EVALUATION
  // ========================================================
  // Reuse Phase 5 deterministic matching for separate display
  const matchingResult = evaluateScheme(safeProfile, scheme);

  return {
    readinessScore: totalReadinessScore,
    label,
    breakdown: {
      documents: {
        score: docScore,
        maxScore: 50,
        summary: docSummary,
      },
      profile: {
        score: profileScore,
        maxScore: 30,
        summary: profileSummary,
      },
      action: {
        score: actionScore,
        maxScore: 20,
        summary: actionSummary,
        officialApplicationUrlAvailable: hasOfficialUrl,
      },
    },
    documents: {
      totalRequired: requiredDocs.length,
      mandatoryCount: mandatoryDocs.length,
      optionalCount: optionalDocs.length,
      evaluation: documentEvaluation,
    },
    profileFields: {
      totalRequired: requiredFields.length,
      fields: requiredFields,
    },
    matchingConditions: {
      classification: matchingResult.classification,
      matchScore: matchingResult.matchScore,
      ruleResults: matchingResult.ruleResults || [],
      matchedReasons: matchingResult.explanation?.matchedReasons || [],
      missingInformation: matchingResult.explanation?.missingInformation || [],
      failedConditions: matchingResult.explanation?.failedConditions || [],
      disclaimer: matchingResult.explanation?.disclaimer || "",
    },
    disclaimer:
      "This readiness indicator reflects the profile information and documents currently available in HAQ DWAAR AI. It is not a government eligibility decision or approval prediction. Please verify the official scheme requirements and complete the application through the official portal.",
  };
}

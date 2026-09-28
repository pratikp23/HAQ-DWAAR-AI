/**
 * HAQ DWAAR AI — Personal Action Plan Engine
 * 
 * Generates prioritized, deterministic next steps based strictly on
 * application preparation gaps and verified scheme data.
 * 
 * 100% Deterministic: No LLMs or heuristics.
 */

const PRIORITY_ORDER = { HIGH: 1, MEDIUM: 2, LOW: 3 };
const TYPE_SUB_ORDER = {
  PROFILE: 1,
  DOCUMENT: 2,
  VERIFICATION: 3,
  INFORMATION: 4,
  APPLICATION: 5,
};

/**
 * Generate a sorted Personal Action Plan from readiness evaluation results
 * 
 * @param {Object} readinessResult - Output of calculateReadiness
 * @param {Object} scheme - Scheme document
 * @returns {Array} Priority-sorted list of actionable items
 */
export function generateActionPlan(readinessResult, scheme) {
  const actions = [];
  let actionCounter = 1;

  const docEvaluations = readinessResult?.documents?.evaluation || [];
  const profileFields = readinessResult?.profileFields?.fields || [];
  const ruleResults = readinessResult?.matchingConditions?.ruleResults || [];

  // ========================================================
  // 1. MISSING MANDATORY DOCUMENTS (Priority: HIGH)
  // ========================================================
  for (const doc of docEvaluations) {
    if (doc.mandatory && doc.status === "MISSING") {
      actions.push({
        id: `act-doc-missing-${actionCounter++}`,
        priority: "HIGH",
        type: "DOCUMENT",
        title: `Add ${doc.requiredDocumentType}`,
        description: `Your scheme requirements include a mandatory ${doc.requiredDocumentType}, but no available document was found in your Document Vault.`,
        status: "PENDING",
        relatedDocumentType: doc.requiredDocumentType,
        actionUrl: "/dashboard/documents",
        actionLabel: "Upload Document",
      });
    }
  }

  // ========================================================
  // 2. EXPIRED DOCUMENTS (Priority: HIGH)
  // ========================================================
  for (const doc of docEvaluations) {
    if (doc.status === "EXPIRED") {
      actions.push({
        id: `act-doc-expired-${actionCounter++}`,
        priority: "HIGH",
        type: "DOCUMENT",
        title: `Update ${doc.requiredDocumentType}`,
        description: `The available ${doc.requiredDocumentType} in your vault is expired. Please upload an updated certificate.`,
        status: "PENDING",
        relatedDocumentType: doc.requiredDocumentType,
        actionUrl: "/dashboard/documents",
        actionLabel: "Replace Document",
      });
    }
  }

  // ========================================================
  // 3. INCOMPLETE DOCUMENTS (Priority: HIGH)
  // ========================================================
  for (const doc of docEvaluations) {
    if (doc.status === "INCOMPLETE") {
      actions.push({
        id: `act-doc-incomplete-${actionCounter++}`,
        priority: "HIGH",
        type: "DOCUMENT",
        title: `Review ${doc.requiredDocumentType}`,
        description: `The uploaded ${doc.requiredDocumentType} could not provide all expected information or is missing core fields.`,
        status: "PENDING",
        relatedDocumentType: doc.requiredDocumentType,
        actionUrl: "/dashboard/documents",
        actionLabel: "Review Document",
      });
    }
  }

  // ========================================================
  // 4. DOCUMENTS NEEDING VERIFICATION (Priority: MEDIUM)
  // ========================================================
  for (const doc of docEvaluations) {
    if (doc.status === "NEEDS_VERIFICATION") {
      actions.push({
        id: `act-doc-verify-${actionCounter++}`,
        priority: "MEDIUM",
        type: "VERIFICATION",
        title: `Review ${doc.requiredDocumentType}`,
        description: `The ${doc.requiredDocumentType} was detected, but some information requires verification or clarity check.`,
        status: "PENDING",
        relatedDocumentType: doc.requiredDocumentType,
        actionUrl: "/dashboard/documents",
        actionLabel: "Review Document",
      });
    }
  }

  // ========================================================
  // 5. MISSING PROFILE FIELDS (Priority: HIGH)
  // ========================================================
  for (const field of profileFields) {
    if (!field.available) {
      actions.push({
        id: `act-prof-missing-${actionCounter++}`,
        priority: "HIGH",
        type: "PROFILE",
        title: `Complete ${field.label}`,
        description: `${field.label} is required for this scheme's profile rules, but it is currently missing from your Benefit Passport.`,
        status: "PENDING",
        relatedField: field.fieldPath,
        actionUrl: "/dashboard/benefit-passport",
        actionLabel: "Update Benefit Passport",
      });
    }
  }

  // ========================================================
  // 6. FAILED PROFILE MATCH CONDITIONS (Priority: HIGH)
  // ========================================================
  for (const r of ruleResults) {
    if (r.status === "FAIL") {
      const ruleLabel = r.label || r.rule?.label || "Requirement";
      actions.push({
        id: `act-prof-failed-${actionCounter++}`,
        priority: "HIGH",
        type: "PROFILE",
        title: `Review ${ruleLabel}`,
        description: `The current profile information does not match the scheme's configured criteria (${r.explanation || "criterion not met"}). Please review your profile information and the official scheme requirements before applying.`,
        status: "PENDING",
        relatedField: r.fieldPath || r.rule?.fieldPath || null,
        actionUrl: "/dashboard/benefit-passport",
        actionLabel: "Review Passport Details",
      });
    }
  }

  // ========================================================
  // 7. OPTIONAL MISSING DOCUMENTS (Priority: LOW)
  // ========================================================
  for (const doc of docEvaluations) {
    if (!doc.mandatory && doc.status === "MISSING") {
      actions.push({
        id: `act-doc-opt-${actionCounter++}`,
        priority: "LOW",
        type: "DOCUMENT",
        title: `Consider Uploading ${doc.requiredDocumentType}`,
        description: `${doc.requiredDocumentType} is optional for this scheme, but may support your application.`,
        status: "PENDING",
        relatedDocumentType: doc.requiredDocumentType,
        actionUrl: "/dashboard/documents",
        actionLabel: "Upload Optional Document",
      });
    }
  }

  // ========================================================
  // 8. OFFICIAL APPLICATION GATEWAY
  // ========================================================
  const hasHighPriorityBlockers = actions.some((a) => a.priority === "HIGH");
  const officialUrl = scheme?.officialApplicationUrl ? scheme.officialApplicationUrl.trim() : "";

  if (officialUrl) {
    actions.push({
      id: `act-app-portal-${actionCounter++}`,
      priority: hasHighPriorityBlockers ? "LOW" : "MEDIUM",
      type: "APPLICATION",
      title: "Continue to Official Application",
      description: "Submit your formal application through the authorized government portal. HAQ DWAAR AI does not submit applications on your behalf.",
      status: "PENDING",
      actionUrl: officialUrl,
      actionLabel: "Open Official Portal",
    });
  } else {
    actions.push({
      id: `act-app-missing-${actionCounter++}`,
      priority: "LOW",
      type: "INFORMATION",
      title: "Official Application Link Not Available",
      description: "Official application link is not currently available in our verified scheme data.",
      status: "PENDING",
      actionUrl: null,
      actionLabel: null,
    });
  }

  // ========================================================
  // 9. STABLE DETERMINISTIC SORTING
  // ========================================================
  actions.sort((a, b) => {
    const pA = PRIORITY_ORDER[a.priority] || 99;
    const pB = PRIORITY_ORDER[b.priority] || 99;
    if (pA !== pB) return pA - pB;

    const tA = TYPE_SUB_ORDER[a.type] || 99;
    const tB = TYPE_SUB_ORDER[b.type] || 99;
    if (tA !== tB) return tA - tB;

    return a.title.localeCompare(b.title);
  });

  return actions;
}

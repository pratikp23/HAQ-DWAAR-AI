/**
 * HAQ DWAAR AI — Deterministic Matching Engine
 * 
 * Evaluates a citizen's Benefit Passport against structured Scheme rules.
 * 100% Deterministic: No AI / LLM / external heuristic calls.
 * 
 * Rules:
 * - Missing profile values produce 'MISSING', not 'FAIL'.
 * - Any mandatory rule failure results in 'NOT_MATCHED'.
 * - Missing mandatory information with no failures results in 'POTENTIAL_MATCH'.
 * - All mandatory rules passing (with no failures/missing) results in 'MATCHED'.
 * - Score is a transparent informational 'Profile Match Score' (0-100), NOT eligibility probability.
 */

/**
 * Safely access nested object properties by dotted path string
 * e.g., 'personal.category' or 'education.qualification'
 */
export function getNestedValue(obj, path) {
  if (!obj || !path || typeof path !== "string") return undefined;
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

/**
 * Check if a value is considered missing (not provided by the citizen)
 */
export function isMissing(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

/**
 * Format values for human-readable explanation messages
 */
function formatValue(val) {
  if (val === undefined || val === null) return "Not provided";
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "number") return val.toLocaleString("en-IN");
  return String(val);
}

/**
 * Compare two values using the specified deterministic operator
 */
export function evaluateOperator(actual, operator, expected) {
  const op = (operator || "equals").toLowerCase().trim();

  switch (op) {
    case "equals": {
      if (typeof actual === "boolean" || typeof expected === "boolean") {
        return Boolean(actual) === Boolean(expected);
      }
      if (typeof actual === "number" || typeof expected === "number") {
        const numActual = Number(actual);
        const numExpected = Number(expected);
        if (!isNaN(numActual) && !isNaN(numExpected)) {
          return numActual === numExpected;
        }
      }
      return String(actual).trim().toLowerCase() === String(expected).trim().toLowerCase();
    }

    case "not_equals": {
      return !evaluateOperator(actual, "equals", expected);
    }

    case "greater_than": {
      const a = Number(actual);
      const e = Number(expected);
      if (isNaN(a) || isNaN(e)) return false;
      return a > e;
    }

    case "less_than": {
      const a = Number(actual);
      const e = Number(expected);
      if (isNaN(a) || isNaN(e)) return false;
      return a < e;
    }

    case "greater_than_or_equal": {
      const a = Number(actual);
      const e = Number(expected);
      if (isNaN(a) || isNaN(e)) return false;
      return a >= e;
    }

    case "less_than_or_equal": {
      const a = Number(actual);
      const e = Number(expected);
      if (isNaN(a) || isNaN(e)) return false;
      return a <= e;
    }

    case "in": {
      // Expected is expected to be an array of acceptable values
      if (!Array.isArray(expected)) {
        return evaluateOperator(actual, "equals", expected);
      }
      const actualStr = String(actual).trim().toLowerCase();
      const actualNum = Number(actual);
      return expected.some((expItem) => {
        if (!isNaN(actualNum) && typeof expItem === "number") {
          return actualNum === expItem;
        }
        return String(expItem).trim().toLowerCase() === actualStr;
      });
    }

    case "not_in": {
      return !evaluateOperator(actual, "in", expected);
    }

    case "contains": {
      // Actual can be an array or string; expected is target item or substring
      if (Array.isArray(actual)) {
        const expStr = String(expected).trim().toLowerCase();
        return actual.some((item) => String(item).trim().toLowerCase() === expStr);
      }
      const actualStr = String(actual).toLowerCase();
      const expectedStr = String(expected).toLowerCase();
      return actualStr.includes(expectedStr);
    }

    default:
      console.warn(`[MatchingEngine] Unrecognized operator: ${op}. Defaulting to equality check.`);
      return String(actual).trim().toLowerCase() === String(expected).trim().toLowerCase();
  }
}

/**
 * Evaluate a single structured scheme rule against a citizen's profile
 */
export function evaluateSingleRule(rule, profile) {
  const { _id, id, ruleType, fieldPath, operator, value: expectedValue, mandatory = true, label } = rule;
  const ruleId = _id ? String(_id) : id || `${fieldPath}_${operator}`;

  const actualValue = getNestedValue(profile, fieldPath);
  const ruleLabel = label || `${fieldPath.replace(/\./g, " ")}`;

  // Missing profile information handling
  if (isMissing(actualValue)) {
    return {
      ruleId,
      ruleType: ruleType || "general",
      fieldPath,
      label: ruleLabel,
      mandatory: Boolean(mandatory),
      status: "MISSING",
      expectedValue,
      actualValue: null,
      explanation: `${ruleLabel} has not been provided in your Benefit Passport. Required to complete check.`,
    };
  }

  // Operator evaluation
  const passed = evaluateOperator(actualValue, operator, expectedValue);

  if (passed) {
    return {
      ruleId,
      ruleType: ruleType || "general",
      fieldPath,
      label: ruleLabel,
      mandatory: Boolean(mandatory),
      status: "PASS",
      expectedValue,
      actualValue,
      explanation: `${ruleLabel} matches your profile (${formatValue(actualValue)}).`,
    };
  } else {
    return {
      ruleId,
      ruleType: ruleType || "general",
      fieldPath,
      label: ruleLabel,
      mandatory: Boolean(mandatory),
      status: "FAIL",
      expectedValue,
      actualValue,
      explanation: `${ruleLabel} does not match your profile (Your info: ${formatValue(actualValue)}, Required: ${formatValue(expectedValue)}).`,
    };
  }
}

/**
 * Calculate deterministic match score (0-100) and counts.
 * 
 * SCORING FORMULA:
 * - Each rule is assigned weight: Mandatory = 2, Optional = 1
 * - Total Max Weight = sum of all rule weights
 * - Earned Points = sum of weights for rules that PASSED
 * - Penalty Points = sum of weights for rules that FAILED (1.0x for mandatory, 0.5x for optional)
 * - Raw Score = Math.round(max(0, (Earned - Penalty) / Total Max Weight) * 100)
 * - If any mandatory rule FAILS, score is capped at 35 to clearly indicate non-match.
 * - Schemes with 0 rules return neutral score 50 (open with no constraints).
 */
export function calculateMatchScore(ruleResults) {
  if (!ruleResults || ruleResults.length === 0) {
    return {
      matchScore: 50,
      totalRules: 0,
      passedRules: 0,
      failedRules: 0,
      missingRules: 0,
      mandatoryPassed: 0,
      mandatoryFailed: 0,
      mandatoryMissing: 0,
    };
  }

  let totalMaxWeight = 0;
  let earnedPoints = 0;
  let penaltyPoints = 0;

  let passedRules = 0;
  let failedRules = 0;
  let missingRules = 0;
  let mandatoryPassed = 0;
  let mandatoryFailed = 0;
  let mandatoryMissing = 0;

  for (const r of ruleResults) {
    const weight = r.mandatory ? 2 : 1;
    totalMaxWeight += weight;

    if (r.status === "PASS") {
      passedRules++;
      earnedPoints += weight;
      if (r.mandatory) mandatoryPassed++;
    } else if (r.status === "FAIL") {
      failedRules++;
      penaltyPoints += r.mandatory ? weight : weight * 0.5;
      if (r.mandatory) mandatoryFailed++;
    } else if (r.status === "MISSING") {
      missingRules++;
      if (r.mandatory) mandatoryMissing++;
      // Missing info does NOT add penalty, but does not earn points
    }
  }

  const netPoints = Math.max(0, earnedPoints - penaltyPoints);
  let rawScore = Math.round((netPoints / totalMaxWeight) * 100);

  // If any mandatory rule failed, cap score at 35
  if (mandatoryFailed > 0) {
    rawScore = Math.min(rawScore, 35);
  }

  return {
    matchScore: rawScore,
    totalRules: ruleResults.length,
    passedRules,
    failedRules,
    missingRules,
    mandatoryPassed,
    mandatoryFailed,
    mandatoryMissing,
  };
}

/**
 * Determine final match classification
 * 
 * Classifications:
 * - MATCHED: All mandatory rules pass, 0 mandatory failures, 0 missing rules.
 * - POTENTIAL_MATCH: 0 mandatory failures, but 1+ rules are MISSING or scheme has 0 rules.
 * - NOT_MATCHED: At least 1 mandatory rule failed.
 */
export function determineClassification(stats, totalRules) {
  if (totalRules === 0) {
    return "POTENTIAL_MATCH";
  }

  if (stats.mandatoryFailed > 0) {
    return "NOT_MATCHED";
  }

  if (stats.mandatoryMissing > 0 || stats.missingRules > 0) {
    return "POTENTIAL_MATCH";
  }

  if (stats.failedRules > 0 && stats.mandatoryFailed === 0) {
    // Non-mandatory failure only
    return "POTENTIAL_MATCH";
  }

  return "MATCHED";
}

/**
 * Generate transparent "Why This Match?" explanation strictly from ruleResults.
 * No AI hallucination; purely factual based on evaluated rules.
 */
export function generateWhyThisMatch(classification, ruleResults, stats) {
  const matchedReasons = [];
  const missingInformation = [];
  const failedConditions = [];

  for (const r of ruleResults) {
    if (r.status === "PASS") {
      matchedReasons.push(r.explanation);
    } else if (r.status === "MISSING") {
      missingInformation.push(r.explanation);
    } else if (r.status === "FAIL") {
      failedConditions.push(r.explanation);
    }
  }

  let summary = "";
  if (stats.totalRules === 0) {
    summary = "This scheme does not define structured profile conditions. It is open for informational citizen review.";
  } else if (classification === "MATCHED") {
    summary = "Your Benefit Passport matches the known mandatory conditions for this scheme.";
  } else if (classification === "POTENTIAL_MATCH") {
    if (missingInformation.length > 0) {
      summary = `This scheme appears potentially relevant. ${missingInformation.length} profile field(s) are needed in your Benefit Passport to complete the verification check.`;
    } else {
      summary = "This scheme matches your mandatory profile criteria, though one or more optional preferences were not met.";
    }
  } else {
    summary = "Your current Benefit Passport does not match one or more mandatory criteria for this scheme.";
  }

  const disclaimer =
    "This is an informational profile match based on data saved in your Benefit Passport. It is not an official government approval or final legal eligibility determination.";

  return {
    summary,
    matchedReasons,
    missingInformation,
    failedConditions,
    disclaimer,
  };
}

/**
 * Main Evaluation Entrypoint: Evaluate a Benefit Passport against a Scheme
 * 
 * @param {Object} profile - Citizen Benefit Passport
 * @param {Object} scheme - Verified Scheme document
 * @returns {Object} Complete deterministic evaluation result
 */
export function evaluateScheme(profile, scheme) {
  const rules = Array.isArray(scheme?.rules) ? scheme.rules : [];
  const safeProfile = profile || {};

  // 1. Evaluate each rule
  const ruleResults = rules.map((rule) => evaluateSingleRule(rule, safeProfile));

  // 2. Compute transparent score and statistics
  const stats = calculateMatchScore(ruleResults);

  // 3. Determine classification
  const classification = determineClassification(stats, rules.length);

  // 4. Generate transparent "Why This Match?" explanation
  const explanation = generateWhyThisMatch(classification, ruleResults, stats);

  return {
    classification,
    matchScore: stats.matchScore,
    stats,
    ruleResults,
    explanation,
  };
}

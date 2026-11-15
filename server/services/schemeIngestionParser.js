/**
 * HAQ DWAAR AI — Scheme Ingestion Parser & AI Normalizer
 * Normalizes raw government text into a structured, deterministic Scheme draft.
 */

/**
 * Infer scheme category from text
 */
const inferCategory = (text = "", title = "") => {
  const combined = `${title} ${text}`.toLowerCase();
  if (combined.includes("kisan") || combined.includes("farmer") || combined.includes("agriculture") || combined.includes("crop") || combined.includes("fasal")) {
    return "KISAN";
  }
  if (combined.includes("student") || combined.includes("scholarship") || combined.includes("education") || combined.includes("vidya") || combined.includes("coaching") || combined.includes("college") || combined.includes("school")) {
    return "STUDENT";
  }
  if (combined.includes("business") || combined.includes("artisan") || combined.includes("craft") || combined.includes("vishwakarma") || combined.includes("enterprise") || combined.includes("mudra") || combined.includes("loan") || combined.includes("startup")) {
    return "BUSINESS";
  }
  if (combined.includes("employment") || combined.includes("roojgar") || combined.includes("rozgar") || combined.includes("skilling") || combined.includes("training") || combined.includes("apprentice")) {
    return "EMPLOYMENT";
  }
  return "GENERAL";
};

/**
 * Infer standard rules from criteria text if rules aren't pre-structured
 */
const inferRulesFromText = (criteria = "", category = "GENERAL") => {
  const rules = [];
  const lower = criteria.toLowerCase();

  // Age extraction
  const ageMaxMatch = lower.match(/(?:below|up to|maximum|max|under)\s+(\d{2})\s+years/);
  if (ageMaxMatch) {
    rules.push({
      ruleType: "age",
      fieldPath: "personal.age",
      operator: "less_than_or_equal",
      value: parseInt(ageMaxMatch[1], 10),
      mandatory: true,
      label: `Age must not exceed ${ageMaxMatch[1]} years`,
    });
  }

  const ageMinMatch = lower.match(/(?:above|minimum|min|at least)\s+(\d{2})\s+years/);
  if (ageMinMatch) {
    rules.push({
      ruleType: "age",
      fieldPath: "personal.age",
      operator: "greater_than_or_equal",
      value: parseInt(ageMinMatch[1], 10),
      mandatory: true,
      label: `Minimum age ${ageMinMatch[1]} years`,
    });
  }

  // Income extraction
  if (lower.includes("lakh") || lower.includes("income")) {
    const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)/);
    if (lakhMatch) {
      const amount = parseFloat(lakhMatch[1]) * 100000;
      rules.push({
        ruleType: "income",
        fieldPath: "economic.annualIncome",
        operator: "less_than_or_equal",
        value: amount,
        mandatory: true,
        label: `Annual income must not exceed Rs. ${lakhMatch[1]} Lakhs`,
      });
    }
  }

  // Category specific defaults if none found
  if (category === "KISAN") {
    rules.push({
      ruleType: "occupation",
      fieldPath: "profile.occupation",
      operator: "equals",
      value: "Farmer",
      mandatory: true,
      label: "Must be a Farmer by occupation",
    });
  } else if (category === "STUDENT") {
    rules.push({
      ruleType: "education",
      fieldPath: "education.currentLevel",
      operator: "in",
      value: ["Secondary", "Higher Secondary", "Undergraduate", "Postgraduate"],
      mandatory: true,
      label: "Must be currently enrolled in regular education",
    });
  }

  return rules;
};

/**
 * Infer standard documents from text
 */
const inferDocuments = (text = "", category = "GENERAL") => {
  const docs = [
    { documentType: "Aadhaar Card", mandatory: true, guidance: "Proof of identity and Aadhaar-seeded DBT" },
    { documentType: "Bank Passbook", mandatory: true, guidance: "Active bank account linked to Aadhaar" },
  ];

  const lower = text.toLowerCase();
  if (lower.includes("income") || lower.includes("bpl") || lower.includes("ration")) {
    docs.push({ documentType: "Income Certificate", mandatory: true, guidance: "Issued by Tehsildar or Revenue Authority" });
  }

  if (category === "KISAN" || lower.includes("land") || lower.includes("khasra")) {
    docs.push({ documentType: "Land Records / Khasra Khatauni", mandatory: true, guidance: "Updated land ownership record" });
  }

  if (category === "STUDENT" || lower.includes("marksheet") || lower.includes("bonafide")) {
    docs.push({ documentType: "Marksheet / Bonafide Certificate", mandatory: true, guidance: "Current institution proof" });
  }

  return docs;
};

/**
 * Parse raw government feed item into standardized Scheme draft
 */
export const parseRawScheme = async (rawItem) => {
  const title = (rawItem.title || rawItem.name || "Government Welfare Initiative").trim();
  const desc = (rawItem.description || rawItem.details || rawItem.eligibilityCriteria || "").trim();
  const category = rawItem.category || inferCategory(desc, title);
  const state = rawItem.state || "All-India";
  const benefitSummary = rawItem.benefitAmount || rawItem.benefitSummary || "Direct financial and statutory welfare benefits.";
  const eligibilitySummary = rawItem.eligibilityCriteria || rawItem.eligibilitySummary || "Subject to statutory criteria verification.";

  // Rules: use pre-structured if available, otherwise infer
  const rules = Array.isArray(rawItem.rules) && rawItem.rules.length > 0
    ? rawItem.rules
    : inferRulesFromText(desc + " " + eligibilitySummary, category);

  // Required Documents: use pre-structured if available, otherwise infer
  const requiredDocuments = Array.isArray(rawItem.requiredDocuments) && rawItem.requiredDocuments.length > 0
    ? rawItem.requiredDocuments
    : inferDocuments(desc + " " + eligibilitySummary, category);

  // Short description within 300 chars
  let shortDescription = desc.slice(0, 290);
  if (shortDescription.length === 290) {
    shortDescription = shortDescription.trim() + "...";
  }
  if (!shortDescription) {
    shortDescription = `${title} provides welfare assistance to eligible beneficiaries across ${state}.`;
  }

  // Calculate parser confidence score
  let score = 0.70;
  if (rules.length > 0) score += 0.15;
  if (requiredDocuments.length >= 2) score += 0.10;
  if (rawItem.officialApplicationUrl) score += 0.05;
  score = Math.min(1.0, Math.round(score * 100) / 100);

  const parsedDraft = {
    name: title,
    shortDescription,
    fullDescription: desc,
    category,
    state,
    targetAudience: [category.toLowerCase(), "beneficiaries"],
    benefitSummary,
    eligibilitySummary,
    rules,
    requiredDocuments,
    applicationMethod: rawItem.applicationMethod || "ONLINE",
    officialApplicationUrl: rawItem.officialApplicationUrl || "",
    officialSourceUrl: rawItem.officialSourceUrl || rawItem.sourceUrl || "https://data.gov.in",
    sourceName: rawItem.sourceName || "Government of India",
    sourceType: "CENTRAL_GOVERNMENT",
  };

  return {
    parsedDraft,
    confidenceScore: score,
  };
};

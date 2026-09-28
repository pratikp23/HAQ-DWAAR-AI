/**
 * Document Health Assessment Service
 *
 * NOTE: This service performs an informational application-readiness assessment.
 * It strictly evaluates file readability, extraction confidence, field completeness,
 * and validity dates. It does NOT perform official government verification or legal validation.
 */

export function evaluateDocumentHealth(documentType, extractedData) {
  const issuesDetected = [];
  const currentDate = new Date();

  const {
    documentName,
    holderName,
    maskedDocumentNumber,
    dateOfBirth,
    issueDate,
    expiryDate,
    income,
    issuingAuthority,
    extractionConfidence,
  } = extractedData || {};

  // 1. Check Expiry
  let isExpired = false;
  if (expiryDate) {
    const exp = new Date(expiryDate);
    if (!isNaN(exp.getTime()) && exp < currentDate) {
      isExpired = true;
      const formattedDate = exp.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      issuesDetected.push(`Document expired on ${formattedDate}. Please upload a renewed certificate.`);
    }
  }

  // 2. Check Extraction Confidence
  const isLowConfidence = extractionConfidence === "LOW";
  if (isLowConfidence) {
    issuesDetected.push("Document text could not be clearly extracted. Please ensure the scan is clear, readable, and well-lit.");
  }

  // 3. Check Document Type Mismatch
  let hasTypeMismatch = false;
  if (documentName && documentType && documentType !== "Other") {
    const cleanExtracted = documentName.toLowerCase().replace(/[^a-z]/g, "");
    const cleanType = documentType.toLowerCase().replace(/[^a-z]/g, "");

    // Check strong conflicting indicators
    if (
      (cleanType.includes("aadhaar") && !cleanExtracted.includes("aadhaar")) ||
      (cleanType.includes("income") && !cleanExtracted.includes("income")) ||
      (cleanType.includes("caste") && !cleanExtracted.includes("caste")) ||
      (cleanType.includes("domicile") && !cleanExtracted.includes("domicile") && !cleanExtracted.includes("residence")) ||
      (cleanType.includes("marksheet") && !cleanExtracted.includes("marksheet") && !cleanExtracted.includes("examination"))
    ) {
      // Only flag mismatch if extracted name is clearly a different known type
      if (
        cleanExtracted.includes("aadhaar") ||
        cleanExtracted.includes("income") ||
        cleanExtracted.includes("caste") ||
        cleanExtracted.includes("marksheet")
      ) {
        hasTypeMismatch = true;
        issuesDetected.push(`Document type mismatch: Uploaded as '${documentType}', but document text indicates '${documentName}'.`);
      }
    }
  }

  // 4. Check Field Completeness per Document Type
  const missingCoreFields = [];

  if (documentType === "Aadhaar") {
    if (!holderName) missingCoreFields.push("Full Name");
    if (!maskedDocumentNumber && !dateOfBirth) missingCoreFields.push("Aadhaar Number or DOB");
  } else if (documentType === "Income Certificate") {
    if (!holderName) missingCoreFields.push("Applicant Name");
    if (income === null || income === undefined) missingCoreFields.push("Annual Income Amount");
  } else if (documentType === "Caste Certificate") {
    if (!holderName) missingCoreFields.push("Applicant Name");
  } else if (documentType === "Domicile Certificate") {
    if (!holderName) missingCoreFields.push("Resident Name");
  } else if (documentType === "Marksheet") {
    if (!holderName) missingCoreFields.push("Candidate Name");
  } else if (documentType === "Bank Passbook") {
    if (!holderName && !maskedDocumentNumber && !issuingAuthority) {
      missingCoreFields.push("Account Holder Name or Bank Details");
    }
  } else if (documentType === "Land Ownership Document") {
    if (!holderName && !maskedDocumentNumber) {
      missingCoreFields.push("Land Owner Name or Survey/Khasra Number");
    }
  } else if (documentType === "Disability Certificate") {
    if (!holderName) missingCoreFields.push("Applicant Name");
  }

  if (missingCoreFields.length > 0 && !isLowConfidence) {
    issuesDetected.push(`Missing expected document fields: ${missingCoreFields.join(", ")}.`);
  }

  // Determine final healthStatus
  let healthStatus = "VALID";

  if (isExpired) {
    healthStatus = "EXPIRED";
  } else if (isLowConfidence || hasTypeMismatch) {
    healthStatus = "NEEDS_VERIFICATION";
  } else if (missingCoreFields.length > 0) {
    healthStatus = "INCOMPLETE";
  } else {
    healthStatus = "VALID";
  }

  return {
    healthStatus,
    issuesDetected,
    isExpired,
  };
}

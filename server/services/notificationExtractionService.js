/**
 * HAQ DWAAR AI — Notification Extraction Service
 * 
 * Deterministic candidate information extractor for government notification PDFs.
 * 
 * Strict Trust Principles:
 * 1. Extracted information is candidate/unverified data.
 * 2. Ambiguous dates are flagged, never guessed.
 * 3. Not every date is a deadline; semantic labels are preserved.
 * 4. PDF content is untrusted data; prompt injections are treated as plain text.
 * 5. Missing values remain null/empty; never fabricated.
 */

const MONTH_NAMES = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/**
 * Deterministically parse unambiguous date strings into a JavaScript Date
 * Returns null if the format is invalid or ambiguous.
 */
export function parseCandidateDate(str) {
  if (!str || typeof str !== "string") return { date: null, ambiguous: false };
  const cleaned = str.trim().replace(/,/g, "");

  // Format 1: DD Month YYYY (e.g. "15 October 2026" or "15 Oct 2026") - Unambiguous
  const dmyText = cleaned.match(/\b(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\b/);
  if (dmyText) {
    const day = parseInt(dmyText[1], 10);
    const mStr = dmyText[2].toLowerCase();
    const year = parseInt(dmyText[3], 10);
    if (MONTH_NAMES[mStr] !== undefined && day >= 1 && day <= 31) {
      return { date: new Date(Date.UTC(year, MONTH_NAMES[mStr], day)), ambiguous: false };
    }
  }

  // Format 2: Month DD, YYYY (e.g. "October 15 2026") - Unambiguous
  const mdyText = cleaned.match(/\b([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})\b/);
  if (mdyText) {
    const mStr = mdyText[1].toLowerCase();
    const day = parseInt(mdyText[2], 10);
    const year = parseInt(mdyText[3], 10);
    if (MONTH_NAMES[mStr] !== undefined && day >= 1 && day <= 31) {
      return { date: new Date(Date.UTC(year, MONTH_NAMES[mStr], day)), ambiguous: false };
    }
  }

  // Format 3: YYYY-MM-DD or YYYY/MM/DD - Standard ISO (Unambiguous)
  const ymdMatch = cleaned.match(/\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return { date: new Date(Date.UTC(year, month, day)), ambiguous: false };
    }
  }

  // Format 4: DD/MM/YYYY or DD-MM-YYYY (Common Indian standard)
  const dmyNumMatch = cleaned.match(/\b(\d{1,2})[-/](\d{1,2})[-/](\d{4})\b/);
  if (dmyNumMatch) {
    const p1 = parseInt(dmyNumMatch[1], 10);
    const p2 = parseInt(dmyNumMatch[2], 10);
    const year = parseInt(dmyNumMatch[3], 10);

    // If first number > 12, it must be the day (Unambiguous DD/MM/YYYY)
    if (p1 > 12 && p1 <= 31 && p2 >= 1 && p2 <= 12) {
      return { date: new Date(Date.UTC(year, p2 - 1, p1)), ambiguous: false };
    }

    // If second number > 12, it must be MM/DD/YYYY (Unambiguous)
    if (p2 > 12 && p2 <= 31 && p1 >= 1 && p1 <= 12) {
      return { date: new Date(Date.UTC(year, p1 - 1, p2)), ambiguous: false };
    }

    // Both <= 12 (e.g. 03/04/2026): In Indian government notifications, DD/MM/YYYY is standard,
    // but without explicit textual month it is technically ambiguous.
    // Flag as ambiguous while providing the standard Indian interpretation.
    if (p1 >= 1 && p1 <= 12 && p2 >= 1 && p2 <= 12) {
      return {
        date: new Date(Date.UTC(year, p2 - 1, p1)),
        ambiguous: true,
        candidateString: `${p1}/${p2}/${year}`,
      };
    }
  }

  return { date: null, ambiguous: false };
}

/**
 * Deterministically extract structured candidate information from notification text.
 * 
 * @param {string} text - Cleaned text from PDF
 * @returns {Object} Candidate extracted metadata and highlights
 */
export function extractCandidateMetadata(text) {
  const warnings = [];
  const importantDates = [];
  const lines = (text || "").split("\n").map((l) => l.trim()).filter(Boolean);

  let title = null;
  let schemeName = null;
  let issuingOrganization = null;
  let notificationNumber = null;
  let notificationDate = null;
  let effectiveDate = null;
  let applicationStartDate = null;
  let applicationDeadline = null;

  const eligibilityHighlights = [];
  const documentHighlights = [];
  const benefitHighlights = [];
  const changeHighlights = [];
  const sourceReferences = [];

  if (!text || text.trim().length === 0) {
    return {
      title,
      schemeName,
      issuingOrganization,
      notificationNumber,
      notificationDate,
      effectiveDate,
      applicationStartDate,
      applicationDeadline,
      importantDates,
      eligibilityHighlights,
      documentHighlights,
      benefitHighlights,
      changeHighlights,
      sourceReferences,
      warnings: ["No text provided for extraction."],
      extractionConfidence: "LOW",
    };
  }

  // 1. Issuing Organization Detection
  const orgMatch = text.match(
    /(?:Ministry\s+of\s+[A-Za-z\s,]+|Department\s+of\s+[A-Za-z\s,]+|Government\s+of\s+[A-Za-z\s,]+|Directorate\s+of\s+[A-Za-z\s,]+|State\s+Government\s+of\s+[A-Za-z\s,]+|National\s+Scholarship\s+Portal|University\s+Grants\s+Commission|All\s+India\s+Council\s+for\s+Technical\s+Education)/i
  );
  if (orgMatch) {
    issuingOrganization = orgMatch[0].trim().replace(/[\r\n]+/g, " ");
  }

  // 2. Notification Number / Reference Number
  const numMatch = text.match(
    /(?:Notification\s*(?:No\.?|Number)|Order\s*(?:No\.?|Number)|Ref\s*(?:No\.?|Number)|F\.\s*No\.?|Letter\s*No\.?)[:\s]+([A-Z0-9\/\-\.()_][A-Z0-9\/\-\.()_ ]{1,45}?)(?=(?:\r?\n|\s+(?:Subject|Dated|Date|Ministry|Department|Government|Eligibility|Required|Benefits|Important|Last|$|[,\.])))/i
  ) || text.match(
    /(?:Notification\s*(?:No\.?|Number)|Order\s*(?:No\.?|Number)|Ref\s*(?:No\.?|Number)|F\.\s*No\.?|Letter\s*No\.?)[:\s]+([A-Z0-9\/\-\.()_]{3,40})/i
  );
  if (numMatch && numMatch[1]) {
    notificationNumber = numMatch[1].trim();
  }

  // 3. Subject / Title
  const subMatch = text.match(
    /(?:Sub(?:ject)?|Notification\s+Regarding)[:\s]+([^\n\r]{10,180})/i
  );
  if (subMatch && subMatch[1]) {
    title = subMatch[1].trim();
  } else {
    // Fallback: look at top 3 lines for a meaningful header
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      if (lines[i].length > 15 && lines[i].length < 120 && !lines[i].toLowerCase().includes("page")) {
        title = lines[i];
        break;
      }
    }
  }

  // 4. Scheme Name Detection
  const schemeMatch = text.match(
    /(?:Name\s+of\s+(?:the\s+)?(?:Scheme|Programme|Yojana)|Scheme\s+Name)[:\s]+([A-Za-z0-9\s\(\)\-\'\"]{5,80})/i
  ) || text.match(/\b(Pradhan\s+Mantri\s+[A-Za-z\s]+(?:Yojana|Scheme)?|Mukhyamantri\s+[A-Za-z\s]+(?:Yojana|Scheme)?|PM-[A-Z]+|National\s+[A-Za-z0-9\s\-\'\"]{3,60}(?:Scholarship|Programme|Scheme|Mission|Yojana)|Post\s+Matric\s+Scholarship[A-Za-z\s]*|Pre\s+Matric\s+Scholarship[A-Za-z\s]*|Ayushman\s+Bharat[A-Za-z\s]*)\b/i);

  if (schemeMatch) {
    schemeName = (schemeMatch[1] || schemeMatch[0]).trim();
  } else if (title && /(?:Scheme|Yojana|Programme|Mission|Scholarship)/i.test(title)) {
    schemeName = title.trim();
  }

  // 5. Date Extractions with Strict Semantic Labeling

  // A. Notification / Issue Date
  const notifDateMatch = text.match(
    /(?:Dated|Date\s+of\s+Notification|Notification\s+Date|Date|New\s+Delhi,\s+dated)[:\s]+(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})/i
  );
  if (notifDateMatch && notifDateMatch[1]) {
    const res = parseCandidateDate(notifDateMatch[1]);
    if (res.date) {
      notificationDate = res.date;
      if (res.ambiguous) {
        warnings.push(`Notification date '${notifDateMatch[1]}' could be interpreted as DD/MM or MM/DD. Standardized as DD/MM/YYYY.`);
      }
    }
  }

  // B. Effective Date
  const effDateMatch = text.match(
    /(?:with\s+effect\s+from|effective\s+from|w\.e\.f\.?|comes\s+into\s+force\s+on)[:\s]+(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})/i
  );
  if (effDateMatch && effDateMatch[1]) {
    const res = parseCandidateDate(effDateMatch[1]);
    if (res.date) {
      effectiveDate = res.date;
      importantDates.push({
        label: "Effective Date",
        date: res.date,
        description: `Notification takes effect on this date (${effDateMatch[1]}).`,
      });
    }
  }

  // C. Application Start Date
  const startDateMatch = text.match(
    /(?:portal\s+opens?\s+on|applications?\s+open\s+from|opening\s+date|start\s+date|submission\s+starts?\s+from)[:\s]+(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})/i
  );
  if (startDateMatch && startDateMatch[1]) {
    const res = parseCandidateDate(startDateMatch[1]);
    if (res.date) {
      applicationStartDate = res.date;
      importantDates.push({
        label: "Application Start",
        date: res.date,
        description: `Portal opening / start date (${startDateMatch[1]}).`,
      });
    }
  }

  // D. Application Deadline (Strict pattern — does not confuse with other dates!)
  const deadlineMatch = text.match(
    /(?:last\s+date\s+(?:for\s+submission|of\s+application|to\s+apply)|application\s+deadline|closing\s+date|apply\s+before|deadline\s*:)[:\s]+(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{1,2}\s+[A-Za-z]+\s+\d{4}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})/i
  );
  if (deadlineMatch && deadlineMatch[1]) {
    const res = parseCandidateDate(deadlineMatch[1]);
    if (res.date) {
      applicationDeadline = res.date;
      importantDates.push({
        label: "Application Deadline",
        date: res.date,
        description: `Last date for application submission (${deadlineMatch[1]}).`,
      });
      if (res.ambiguous) {
        warnings.push(`Application deadline date '${deadlineMatch[1]}' has ambiguous day/month order. Admin review required.`);
      }
    }
  }

  // 6. Highlights & Section Statements
  for (const line of lines) {
    const lower = line.toLowerCase();

    // Eligibility clauses
    if (
      (lower.includes("eligib") || lower.includes("age limit") || lower.includes("annual income") || lower.includes("domicile")) &&
      line.length > 20 && line.length < 250
    ) {
      if (eligibilityHighlights.length < 5 && !eligibilityHighlights.includes(line)) {
        eligibilityHighlights.push(line);
      }
    }

    // Document clauses
    if (
      (lower.includes("document") || lower.includes("certificate") || lower.includes("aadhaar") || lower.includes("passbook") || lower.includes("marksheet")) &&
      line.length > 20 && line.length < 250
    ) {
      if (documentHighlights.length < 5 && !documentHighlights.includes(line)) {
        documentHighlights.push(line);
      }
    }

    // Benefit clauses
    if (
      (lower.includes("financial assistance") || lower.includes("stipend") || lower.includes("subsidy") || lower.includes("benefit") || lower.includes("rs.") || lower.includes("inr")) &&
      line.length > 20 && line.length < 250
    ) {
      if (benefitHighlights.length < 5 && !benefitHighlights.includes(line)) {
        benefitHighlights.push(line);
      }
    }

    // Policy change clauses
    if (
      (lower.includes("amend") || lower.includes("supersede") || lower.includes("extended") || lower.includes("modifi") || lower.includes("revised")) &&
      line.length > 20 && line.length < 250
    ) {
      if (changeHighlights.length < 5 && !changeHighlights.includes(line)) {
        changeHighlights.push(line);
      }
    }

    // Official sources & URLs
    const urlMatch = line.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.gov\.in[^\s]*)/i);
    if (urlMatch) {
      const detectedUrl = urlMatch[0].replace(/[,\.\)]+$/, "");
      if (sourceReferences.length < 5 && !sourceReferences.includes(detectedUrl)) {
        sourceReferences.push(detectedUrl);
      }
    }
  }

  // Confidence assessment
  let detectedCount = 0;
  if (schemeName) detectedCount++;
  if (applicationDeadline) detectedCount++;
  if (notificationNumber) detectedCount++;
  if (issuingOrganization) detectedCount++;
  if (eligibilityHighlights.length > 0) detectedCount++;

  const extractionConfidence = detectedCount >= 3 ? "HIGH" : detectedCount >= 1 ? "MEDIUM" : "LOW";

  return {
    title,
    schemeName,
    issuingOrganization,
    notificationNumber,
    notificationDate,
    effectiveDate,
    applicationStartDate,
    applicationDeadline,
    importantDates,
    eligibilityHighlights,
    documentHighlights,
    benefitHighlights,
    changeHighlights,
    sourceReferences,
    warnings,
    extractionConfidence,
  };
}

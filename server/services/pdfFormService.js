import Scheme from "../models/Scheme.js";
import UserProfile from "../models/UserProfile.js";
import User from "../models/User.js";
import Document from "../models/Document.js";
import ApplicationTracker from "../models/ApplicationTracker.js";
import { isTypeMatch } from "./schemeDocumentMatcher.js";

/**
 * Generates an official, printable bilingual application form (A4 formatted)
 * with pre-filled citizen passport data, document checklist, and verification barcode.
 */
export async function generatePrintableApplicationForm(userId, schemeId) {
  const scheme = await Scheme.findById(schemeId);
  if (!scheme) {
    const error = new Error("Scheme not found.");
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findById(userId);
  const profile = await UserProfile.findOne({ userId });
  const userDocs = await Document.find({ userId });

  // Find or generate reference tracking number
  let tracker = await ApplicationTracker.findOne({ userId, schemeId: scheme._id });
  let refCode = tracker?.referenceNumber;
  if (!refCode) {
    const dept = scheme.category || "GEN";
    refCode = `HAQ/2026/${dept}/${Math.floor(10000 + Math.random() * 90000)}`;
  }

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const applicantName = (user?.name || "NA").toUpperCase();
  const phone = user?.phone || profile?.personal?.phone || "Not specified";
  const age = profile?.personal?.age || "NA";
  const gender = profile?.personal?.gender || "NA";
  const category = profile?.personal?.category || "General";
  const state = profile?.location?.state || scheme.state || "All-India";
  const district = profile?.location?.district || "NA";
  const income = profile?.socioEconomic?.familyAnnualIncome
    ? `₹${profile.socioEconomic.familyAnnualIncome.toLocaleString("en-IN")}`
    : "NA";
  const land = profile?.agriculture?.landHoldingHectares
    ? `${profile.agriculture.landHoldingHectares} Hectares`
    : "NA";
  const qualification = profile?.education?.qualification || "NA";

  const requiredDocs = Array.isArray(scheme.requiredDocuments) ? scheme.requiredDocuments : [];
  const docChecklist = requiredDocs.map((rd) => {
    const hasDoc = userDocs.some((ud) => isTypeMatch(rd.documentType, ud.documentType));
    return {
      name: rd.documentType.replace(/_/g, " "),
      mandatory: rd.mandatory !== false,
      attached: hasDoc,
    };
  });

  // Construct complete self-contained printable HTML document
  const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>Application Form - ${scheme.name} - ${refCode}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm 15mm 15mm 15mm; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 13px; line-height: 1.5; background: #fff; }
    .header { border-bottom: 2px solid #1e0a3c; padding-bottom: 12px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-start; }
    .header-title h1 { margin: 0; font-size: 17px; color: #1e0a3c; text-transform: uppercase; font-weight: 800; }
    .header-title h2 { margin: 4px 0 0 0; font-size: 14px; color: #ea580c; font-weight: 700; }
    .header-meta { text-align: right; font-family: monospace; font-size: 11px; }
    .barcode-box { display: inline-block; border: 1.5px dashed #475569; padding: 4px 8px; font-weight: bold; background: #f8fafc; margin-top: 4px; letter-spacing: 2px; }
    .section-title { background: #f1f5f9; border-left: 4px solid #1e0a3c; padding: 4px 8px; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 12px 0 8px 0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 12px; }
    th { background: #f8fafc; font-weight: 700; color: #334155; width: 30%; text-align: left; }
    .check-box { width: 14px; height: 14px; border: 1.5px solid #0f172a; display: inline-block; vertical-align: middle; margin-right: 6px; text-align: center; line-height: 12px; font-weight: bold; font-size: 11px; }
    .declaration { border: 1px solid #e2e8f0; padding: 10px; background: #fafafa; font-size: 11px; color: #475569; margin-top: 15px; border-radius: 4px; }
    .signatures { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
    .sig-box { width: 220px; text-align: center; border-top: 1px dashed #64748b; padding-top: 5px; font-size: 11px; font-weight: bold; }
    .watermark { position: fixed; bottom: 8px; right: 15px; font-size: 10px; color: #94a3b8; font-family: monospace; }
    .no-print { text-align: center; margin-bottom: 15px; }
    .btn-print { background: #1e0a3c; color: white; border: none; padding: 8px 18px; font-weight: bold; font-size: 13px; border-radius: 6px; cursor: pointer; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>

  <div class="no-print">
    <button class="btn-print" onclick="window.print()">🖨️ Print Application Form (प्रिंट करें)</button>
    <p style="font-size: 11px; color: #64748b; margin-top: 4px;">Print on standard A4 paper, sign, and submit at your local Tehsil / Block Office / CSC Center.</p>
  </div>

  <div class="header">
    <div class="header-title">
      <h1>भारत सरकार / राज्य कल्याण विभाग — आवेदन प्रपत्र</h1>
      <h2>${scheme.name}</h2>
      <div style="font-size: 11px; color: #475569; margin-top: 2px;">लाभांश: ${scheme.benefitSummary}</div>
    </div>
    <div class="header-meta">
      <div>तारीख: <strong>${today}</strong></div>
      <div class="barcode-box">||| ${refCode} |||</div>
      <div style="font-size: 9px; color: #64748b; margin-top: 2px;">Pre-verified by HAQ DWAAR AI</div>
    </div>
  </div>

  <div class="section-title">1. आवेदक का व्यक्तिगत विवरण (Personal Details)</div>
  <table>
    <tr>
      <th>आवेदक का पूरा नाम (Full Name)</th>
      <td colspan="3"><strong>${applicantName}</strong></td>
    </tr>
    <tr>
      <th>आयु (Age) / लिंग (Gender)</th>
      <td>${age} वर्ष / ${gender}</td>
      <th>सामाजिक वर्ग (Category)</th>
      <td><strong>${category}</strong></td>
    </tr>
    <tr>
      <th>मोबाइल नंबर (Phone)</th>
      <td>${phone}</td>
      <th>शिक्षा (Qualification)</th>
      <td>${qualification}</td>
    </tr>
    <tr>
      <th>राज्य (State)</th>
      <td>${state}</td>
      <th>जिला (District)</th>
      <td>${district}</td>
    </tr>
    <tr>
      <th>वार्षिक पारिवारिक आय (Annual Income)</th>
      <td><strong>${income}</strong></td>
      <th>भूमि स्वामित्व (Landholding)</th>
      <td>${land}</td>
    </tr>
  </table>

  <div class="section-title">2. संलग्न प्रमाण पत्र एवं दस्तावेज़ (Document Checklist)</div>
  <table>
    <thead>
      <tr style="background:#f1f5f9;">
        <th style="width: 10%;">संलग्न?</th>
        <th style="width: 60%;">दस्तावेज़ का नाम</th>
        <th style="width: 30%;">अनिवार्यता</th>
      </tr>
    </thead>
    <tbody>
      ${docChecklist.map((d) => `
        <tr>
          <td style="text-align:center;">
            <span class="check-box">${d.attached ? "✓" : ""}</span>
          </td>
          <td><strong>${d.name}</strong></td>
          <td>${d.mandatory ? '<span style="color:#b91c1c; font-weight:bold;">अनिवार्य (Mandatory)</span>' : 'वैकल्पिक (Optional)'}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="declaration">
    <strong>घोषणा (Applicant Declaration):</strong><br>
    मैं प्रमाणित करता/करती हूँ कि ऊपर दी गई सभी जानकारियाँ एवं संलग्न प्रमाण पत्र मेरे ज्ञान और विश्वास के अनुसार पूर्णतः सत्य एवं सही हैं। यदि कोई भी जानकारी असत्य पाई जाती है, तो मेरा आवेदन निरस्त किया जा सकता है।
  </div>

  <div class="signatures">
    <div class="sig-box">
      सत्यापन अधिकारी के हस्ताक्षर व मुहर<br>
      (Tehsildar / CSC Operator Seal)
    </div>
    <div class="sig-box">
      आवेदक के हस्ताक्षर / अंगूठे का निशान<br>
      (Signature / Thumbprint of Applicant)
    </div>
  </div>

  <div class="watermark">
    HAQ DWAAR AI CITIZEN DOSSIER REF: ${refCode} • VERIFIED CIVIC ASSISTANCE RECORD
  </div>

</body>
</html>`;

  return {
    referenceNumber: refCode,
    schemeName: scheme.name,
    applicantName,
    html,
  };
}

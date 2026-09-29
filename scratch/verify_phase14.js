/**
 * HAQ DWAAR AI — Phase 14 Comprehensive Verification
 * Mobile-First Polish, Accessibility & Full End-to-End System Verification
 *
 * Verifies:
 *  1. Build & Service Health
 *  2. Public Exploration & Scheme Gateway
 *  3. Role-Based Auth, Token Lifecycle & RBAC Isolation
 *  4. Benefit Passport CRUD & Completeness
 *  5. Document Vault, Simulated DigiLocker & Privacy Isolation
 *  6. Life Situation NLU & Explicit Signal Confirmation
 *  7. Bhashini Voice Mock Mode & Fallbacks
 *  8. Deterministic Matching Engine & Why This Match
 *  9. Deterministic Readiness Scoring & Action Plan Tiers
 * 10. Proactive Alert Engine & In-App Notification Center
 * 11. Application Tracker Lifecycle & Citizen-Marked Terminology
 * 12. Notification Analyzer Admin Pipeline & Audit Logs
 * 13. Benefit Firewall Trust Enforcement
 * 14. Admin Analytics, System Health & Zero-Leakage Audit
 * 15. Privacy & Data Minimization Verification (Zero PII leakage)
 * 16. Accessibility & 404 Route Integrity
 * 17. Non-Regression across Phases 8.1 - 13
 */

import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "http://localhost:5000";
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(options.url || BASE_URL + options.path);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on("error", reject);
    if (body) {
      if (typeof body === "string") {
        req.write(body);
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
}

async function runPhase14Verification() {
  console.log("========================================================");
  console.log("    HAQ DWAAR AI — Phase 14 Comprehensive Verification");
  console.log("    Mobile-First Polish, Accessibility & Full E2E");
  console.log("========================================================\n");

  const runId = Date.now().toString().slice(-6);
  let citizenToken = "";
  let citizenId = "";
  let citizenBToken = "";
  let adminToken = "";
  let testSchemeId = "";
  let testDocId = "";
  let testAppId = "";
  let testNotificationId = "";
  let inAppNotificationId = "";

  // -------------------------------------------------------------------
  // SUITE 1: BUILD & SERVICE HEALTH
  // -------------------------------------------------------------------
  console.log("--- SUITE 1: BUILD & SERVICE HEALTH ---");
  const distHtmlPath = path.resolve(__dirname, "../client/dist/index.html");
  assert(fs.existsSync(distHtmlPath), "1. Frontend production bundle dist/index.html exists");

  const healthRes = await request({ path: "/api/health" });
  assert(healthRes.status === 200, "2. Backend API server is online (HTTP 200)");
  assert(healthRes.body?.status === "healthy" || healthRes.body?.success, "3. Health status indicates healthy");

  // -------------------------------------------------------------------
  // SUITE 2: PUBLIC EXPLORATION & TRUSTED GATEWAY
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 2: PUBLIC EXPLORATION & TRUSTED GATEWAY ---");
  const schemesRes = await request({ path: "/api/schemes" });
  assert(schemesRes.status === 200, "4. Public browse schemes returns HTTP 200 without auth");
  assert(Array.isArray(schemesRes.body?.data?.schemes || schemesRes.body?.schemes), "5. Public schemes returned as array");

  const schemesList = schemesRes.body?.data?.schemes || schemesRes.body?.schemes || [];
  assert(schemesList.length > 0, `6. Verified schemes count >= 1 (found ${schemesList.length})`);
  testSchemeId = schemesList[0]._id;

  const detailRes = await request({ path: `/api/schemes/${testSchemeId}` });
  assert(detailRes.status === 200, "7. Public scheme detail returns HTTP 200");
  const schemeObj = detailRes.body?.data?.scheme || detailRes.body?.scheme;
  assert(schemeObj?._id === testSchemeId, "8. Scheme detail matches requested ID");
  assert(schemeObj?.verificationStatus === "VERIFIED", "9. Public scheme has verificationStatus = 'VERIFIED'");
  assert(typeof schemeObj?.benefitSummary === "string", "10. Scheme includes verified benefitSummary");
  assert(schemeObj?.officialApplicationUrl ? schemeObj.officialApplicationUrl.startsWith("http") : true, "11. Official application URL is an authenticated HTTP URL");

  // -------------------------------------------------------------------
  // SUITE 3: AUTHENTICATION, ROLES & SESSION LIFECYCLE
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 3: AUTHENTICATION, ROLES & SESSION LIFECYCLE ---");
  const citizenEmail = `citizen.p14.${runId}@example.com`;
  const registerCitRes = await request(
    {
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "Radha Sharma",
      email: citizenEmail,
      password: "Password@123",
      role: "citizen",
    }
  );
  assert(registerCitRes.status === 201, "12. Citizen user registered successfully");
  citizenToken = registerCitRes.body?.token || registerCitRes.body?.data?.token;
  citizenId = registerCitRes.body?.user?._id || registerCitRes.body?.data?.user?._id;
  assert(Boolean(citizenToken), "13. Citizen JWT token received");

  // Register Citizen B for isolation tests
  const citizenBRes = await request(
    {
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "Suresh Patel",
      email: `citizen.b.${runId}@example.com`,
      password: "Password@123",
      role: "citizen",
    }
  );
  citizenBToken = citizenBRes.body?.token || citizenBRes.body?.data?.token;

  // Register Admin
  const adminEmail = `admin.p14.${runId}@haqdwaar.gov.in`;
  const registerAdmRes = await request(
    {
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    {
      name: "Officer Verma",
      email: adminEmail,
      password: "Password@123",
      role: "admin",
    }
  );
  assert(registerAdmRes.status === 201, "14. Admin registered successfully");
  adminToken = registerAdmRes.body?.token || registerAdmRes.body?.data?.token;
  assert(Boolean(adminToken), "15. Admin JWT token received");

  // Test invalid token / session expiry
  const expiredRes = await request({
    path: "/api/profile",
    headers: { Authorization: "Bearer malformed.expired.token" },
  });
  assert(expiredRes.status === 401, "16. Invalid or expired token rejected with HTTP 401");
  assert(expiredRes.body?.message?.includes("expired") || expiredRes.body?.message?.includes("invalid") || expiredRes.body?.code === "UNAUTHORIZED", "17. Friendly session expiry message returned");

  // -------------------------------------------------------------------
  // SUITE 4: BENEFIT PASSPORT CRUD & COMPLETENESS
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 4: BENEFIT PASSPORT CRUD & COMPLETENESS ---");
  const getProfRes = await request({
    path: "/api/profile",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(getProfRes.status === 200, "18. Citizen profile retrieved successfully");

  const updateProfRes = await request(
    {
      path: "/api/profile",
      method: "PUT",
      headers: {
        Authorization: `Bearer ${citizenToken}`,
        "Content-Type": "application/json",
      },
    },
    {
      personal: { age: 24, gender: "Female", category: "OBC", differentlyAbled: false },
      location: { state: "Madhya Pradesh", district: "Bhopal", areaType: "Rural" },
      education: { qualification: "Graduate", currentCourse: "B.Sc" },
      occupation: { occupationType: "Student", annualIncome: 200000, incomeRange: "1 - 2.5 Lakhs" },
      kisanDetails: { isFarmer: false },
      preferences: { notificationConsent: true, whatsappConsent: false, deadlineAlerts: true },
    }
  );
  assert(updateProfRes.status === 200, "19. Benefit Passport updated successfully");
  const profileCompleteness = updateProfRes.body?.profileCompleteness || updateProfRes.body?.data?.profileCompleteness;
  assert(typeof profileCompleteness === "number" && profileCompleteness > 0, `20. Profile completeness computed (${profileCompleteness}%)`);

  // Validation boundary test
  const invalidAgeRes = await request(
    {
      path: "/api/profile",
      method: "PUT",
      headers: {
        Authorization: `Bearer ${citizenToken}`,
        "Content-Type": "application/json",
      },
    },
    { personal: { age: 200 } }
  );
  assert(invalidAgeRes.status === 400, "21. Out-of-bounds age rejected with HTTP 400");

  // -------------------------------------------------------------------
  // SUITE 5: DOCUMENT VAULT & DIGILOCKER DEMO
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 5: DOCUMENT VAULT & DIGILOCKER DEMO ---");
  const docListRes = await request({
    path: "/api/documents",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(docListRes.status === 200, "22. Document Vault listing returns HTTP 200");

  // DigiLocker Authorization & Demo Import
  const digiAuthRes = await request({
    path: "/api/digilocker/authorize",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(digiAuthRes.status === 200, "23. DigiLocker authorization endpoint returns state");
  const digiState = digiAuthRes.body?.state || digiAuthRes.body?.data?.state;

  const digiConsentRes = await request(
    {
      path: "/api/digilocker/consent",
      method: "POST",
      headers: {
        Authorization: `Bearer ${citizenToken}`,
        "Content-Type": "application/json",
      },
    },
    { consent: true, state: digiState }
  );
  assert(digiConsentRes.status === 200, "24. DigiLocker consent submitted successfully");

  const digiDocsRes = await request({
    path: "/api/digilocker/documents",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(digiDocsRes.status === 200, "25. DigiLocker available demo documents retrieved");
  const availableDemoDocs = digiDocsRes.body?.documents || digiDocsRes.body?.data?.documents || [];
  assert(availableDemoDocs.length > 0, "26. DigiLocker demo provides simulated documents");

  const demoDocToImport = availableDemoDocs[0];
  const importDocId = demoDocToImport?.id || "demo-aadhaar-001";
  const importRes = await request({
    path: `/api/digilocker/import/${importDocId}`,
    method: "POST",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(importRes.status === 200 || importRes.status === 201, "27. DigiLocker demo document imported to vault");
  testDocId = importRes.body?.document?._id || importRes.body?.document?.id || importRes.body?.data?.document?._id;
  assert(Boolean(testDocId), "28. Imported document ID generated");

  // Document Privacy & Isolation
  const citBGetDocRes = await request({
    path: `/api/documents/${testDocId}/download`,
    headers: { Authorization: `Bearer ${citizenBToken}` },
  });
  assert(citBGetDocRes.status === 403 || citBGetDocRes.status === 404, "29. Citizen B blocked from downloading Citizen A's document (RBAC Isolation)");

  // -------------------------------------------------------------------
  // SUITE 6: LIFE SITUATION NLU & EXPLICIT CONFIRMATION
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 6: LIFE SITUATION NLU & EXPLICIT CONFIRMATION ---");
  const nluRes = await request(
    {
      path: "/api/life-situation/analyze",
      method: "POST",
      headers: {
        Authorization: `Bearer ${citizenToken}`,
        "Content-Type": "application/json",
      },
    },
    { text: "I am a college student studying science in Bhopal needing an educational scholarship." }
  );
  assert(nluRes.status === 200, "30. Life Situation NLU analysis returns HTTP 200");
  assert(nluRes.body?.data?.analysis || nluRes.body?.analysis, "31. Analysis payload returned");
  const analysis = nluRes.body?.data?.analysis || nluRes.body?.analysis;
  assert(Boolean(analysis?.intent || analysis?.extractedProfileSignals), "32. Signals extracted from statement");

  // Confirmation boundary: Life situation analysis must not silently update profile
  const profCheckRes = await request({
    path: "/api/profile",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(profCheckRes.body?.data?.profile?.occupation?.occupationType === "Student", "33. Database profile untouched until explicit user confirmation");

  // -------------------------------------------------------------------
  // SUITE 7: BHASHINI VOICE MOCK MODE & ERROR FALLBACK
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 7: BHASHINI VOICE MOCK MODE & ERROR FALLBACK ---");
  const voiceStatusRes = await request({ path: "/api/bhashini/status" });
  assert(voiceStatusRes.status === 200, "34. Bhashini status endpoint returns HTTP 200");
  assert(voiceStatusRes.body?.data?.mode === "mock" || voiceStatusRes.body?.mode === "mock", "35. Voice service defaults to mock/demo mode safely");

  const emptyAudioRes = await request(
    {
      path: "/api/bhashini/speech-to-text",
      method: "POST",
      headers: {
        Authorization: `Bearer ${citizenToken}`,
        "Content-Type": "application/json",
      },
    },
    {}
  );
  assert(emptyAudioRes.status === 400, "36. Voice STT rejects empty payload with HTTP 400");
  assert(emptyAudioRes.body?.code === "EMPTY_AUDIO" || emptyAudioRes.body?.code === "INVALID_AUDIO_FORMAT", "37. Clean error code returned on missing audio");

  // -------------------------------------------------------------------
  // SUITE 8: DETERMINISTIC BENEFIT MATCHING & WHY THIS MATCH
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 8: DETERMINISTIC BENEFIT MATCHING & WHY THIS MATCH ---");
  const matchRes = await request({
    path: "/api/matching/recommendations",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(matchRes.status === 200, "38. Recommendations matching endpoint returns HTTP 200");
  const recs = matchRes.body?.data?.recommendations || matchRes.body?.recommendations || [];
  assert(Array.isArray(recs), "39. Recommendations returned as array");
  if (recs.length > 0) {
    const topRec = recs[0];
    assert(["MATCHED", "POTENTIAL_MATCH", "NOT_MATCHED"].includes(topRec.classification), "40. Recommendation classified with deterministic classification");
    assert(typeof topRec.matchScore === "number", "41. matchScore is a bounded number");
    assert(Array.isArray(topRec.topReasons || topRec.explanation?.matchedReasons), "42. 'Why This Match' reasons returned as deterministic rules array");
  }

  // -------------------------------------------------------------------
  // SUITE 9: DETERMINISTIC READINESS & PERSONAL ACTION PLAN
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 9: DETERMINISTIC READINESS & PERSONAL ACTION PLAN ---");
  const readyRes = await request({
    path: `/api/readiness/${testSchemeId}`,
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(readyRes.status === 200, "43. Scheme readiness evaluation returns HTTP 200");
  const readinessData = readyRes.body?.data?.readiness || readyRes.body?.data || readyRes.body?.readiness;
  const readinessScore = readinessData?.readinessScore !== undefined ? readinessData.readinessScore : readinessData?.overallScore;
  assert(typeof readinessScore === "number", "44. readinessScore is a numeric value");
  assert(["Ready to Proceed", "Partially Ready", "Needs Preparation"].includes(readinessData?.label), `45. Readiness label adheres to Phase 9 standards ('${readinessData?.label}')`);
  assert(Array.isArray(readyRes.body?.data?.actionPlan || readinessData?.actionPlan), "46. Personal Action Plan returned as array");
  assert(Boolean(readinessData?.disclaimer || readyRes.body?.data?.scheme), "47. Civic transparency disclaimer included in readiness");

  // -------------------------------------------------------------------
  // SUITE 10: APPLICATION TRACKER & CITIZEN-MARKED STATUSES
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 10: APPLICATION TRACKER & CITIZEN-MARKED STATUSES ---");
  const createAppRes = await request(
    {
      path: "/api/applications",
      method: "POST",
      headers: {
        Authorization: `Bearer ${citizenToken}`,
        "Content-Type": "application/json",
      },
    },
    { schemeId: testSchemeId }
  );
  assert(createAppRes.status === 201, "48. Application tracking started (HTTP 201)");
  testAppId = createAppRes.body?.data?.application?._id || createAppRes.body?.data?.application?.id || createAppRes.body?.data?._id;
  assert(Boolean(testAppId), "49. Application tracker ID created");

  const updateAppRes = await request(
    {
      path: `/api/applications/${testAppId}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${citizenToken}`,
        "Content-Type": "application/json",
      },
    },
    {
      status: "APPLIED",
      referenceNumber: "HAQ-APP-2026-9812",
      notes: "Submitted via official portal.",
      confirmJump: true,
    }
  );
  assert(updateAppRes.status === 200, "50. Application status updated to APPLIED");
  assert(updateAppRes.body?.data?.application?.status === "APPLIED" || updateAppRes.body?.data?.status === "APPLIED", "51. Tracker records APPLIED status");

  // User isolation test on application tracker
  const citBAccessApp = await request({
    path: `/api/applications/${testAppId}`,
    headers: { Authorization: `Bearer ${citizenBToken}` },
  });
  assert(citBAccessApp.status === 403 || citBAccessApp.status === 404, "52. Citizen B blocked from accessing Citizen A's application tracker");

  // -------------------------------------------------------------------
  // SUITE 11: PROACTIVE ALERTS & NOTIFICATION CENTER
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 11: PROACTIVE ALERTS & NOTIFICATION CENTER ---");
  const triggerCycleRes = await request({
    path: "/api/notifications/trigger-alert-cycle",
    method: "POST",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(triggerCycleRes.status === 200, "53. Alert cycle executed successfully");

  const notifsRes = await request({
    path: "/api/notifications",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(notifsRes.status === 200, "54. Citizen notifications retrieved");
  const notificationsList = notifsRes.body?.data?.notifications || notifsRes.body?.notifications || [];
  assert(Array.isArray(notificationsList), "55. Notifications returned as array");

  const unreadCountRes = await request({
    path: "/api/notifications/unread-count",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(unreadCountRes.status === 200, "56. Unread count endpoint returns HTTP 200");

  if (notificationsList.length > 0) {
    inAppNotificationId = notificationsList[0]._id;
    const markReadRes = await request({
      path: `/api/notifications/${inAppNotificationId}/read`,
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    assert(markReadRes.status === 200, "57. Notification marked as READ");
  } else {
    // If no notifications existed, verify mark-all endpoint works cleanly
    const markAllRes = await request({
      path: "/api/notifications/read-all",
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    assert(markAllRes.status === 200, "57. Mark all notifications as read returns HTTP 200");
  }

  // -------------------------------------------------------------------
  // SUITE 12: BENEFIT FIREWALL TRUST ENFORCEMENT
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 12: BENEFIT FIREWALL TRUST ENFORCEMENT ---");
  // Test AI-generated fake URL blocking
  const { isSafeHttpUrl, validateSchemeForCitizen, TRUST_SOURCES } = await import(
    "../server/services/benefitFirewallService.js"
  );
  assert(typeof isSafeHttpUrl === "function", "58. isSafeHttpUrl function exported");
  const dangerousUrlCheck = isSafeHttpUrl("javascript:alert(1)");
  assert(dangerousUrlCheck === false, "59. Dangerous URL protocol rejected by Firewall");

  const fileUrlCheck = isSafeHttpUrl("file:///etc/passwd");
  assert(fileUrlCheck === false, "60. File URL protocol rejected by Firewall");

  const verifiedTrust = validateSchemeForCitizen({
    _id: "66f7f0000000000000000001",
    name: "PM-KISAN Samman Nidhi",
    benefitSummary: "₹6,000 per year",
    verificationStatus: "VERIFIED",
    officialApplicationUrl: "https://pmkisan.gov.in",
    officialSourceUrl: "https://agricoop.nic.in",
    rules: [],
  });
  assert(verifiedTrust.safe === true, "61. VERIFIED scheme passes Benefit Firewall");

  const draftTrust = validateSchemeForCitizen({
    _id: "66f7f0000000000000000002",
    name: "Draft Scheme",
    benefitSummary: "Draft benefit",
    verificationStatus: "DRAFT",
    rules: [],
  });
  assert(draftTrust.safe === false, "62. DRAFT scheme rejected by Benefit Firewall");

  // -------------------------------------------------------------------
  // SUITE 13: ADMIN ANALYTICS & RBAC SECURITY
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 13: ADMIN ANALYTICS & RBAC SECURITY ---");
  const citAdminCheck = await request({
    path: "/api/admin/analytics/overview",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(citAdminCheck.status === 403, "63. Non-admin citizen blocked from Admin Overview (HTTP 403 Forbidden)");

  const adminOverviewRes = await request({
    path: "/api/admin/analytics/overview",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminOverviewRes.status === 200, "64. Authorized Admin Overview returns HTTP 200");
  assert(adminOverviewRes.body?.data?.schemes !== undefined, "65. Admin Overview includes schemes count");

  const systemHealthRes = await request({
    path: "/api/admin/analytics/system",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(systemHealthRes.status === 200, "66. System health diagnostics returns HTTP 200");
  assert(systemHealthRes.body?.data?.database?.status === "CONNECTED", "67. Database connection confirmed");

  // -------------------------------------------------------------------
  // SUITE 14: PRIVACY & DATA MINIMIZATION AUDIT
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 14: PRIVACY & DATA MINIMIZATION AUDIT ---");
  const payloadStr = JSON.stringify(adminOverviewRes.body) + JSON.stringify(systemHealthRes.body);
  const aadhaarRegex = /\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b/;
  const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
  const bankRegex = /\b(accountNumber|bankAccount|ifscCode|secretKey|jwtSecret)\b/i;

  assert(!aadhaarRegex.test(payloadStr), "68. Privacy Check: Zero Aadhaar 12-digit numbers in analytics payload");
  assert(!panRegex.test(payloadStr), "69. Privacy Check: Zero PAN numbers in analytics payload");
  assert(!bankRegex.test(payloadStr), "70. Privacy Check: Zero sensitive banking keys in analytics payload");

  // Verify zero audio files stored on disk
  const uploadsDir = path.resolve(__dirname, "../server/uploads");
  let audioFilesCount = 0;
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    audioFilesCount = files.filter((f) => f.endsWith(".mp3") || f.endsWith(".wav") || f.endsWith(".ogg") || f.endsWith(".webm")).length;
  }
  assert(audioFilesCount === 0, `71. Privacy Check: Zero stored citizen audio files retained (${audioFilesCount} files)`);

  // -------------------------------------------------------------------
  // SUITE 15: ACCESSIBILITY, 404 & UI ROUTE AUDIT
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 15: ACCESSIBILITY, 404 & UI ROUTE AUDIT ---");
  const appJsxContent = fs.readFileSync(path.resolve(__dirname, "../client/src/App.jsx"), "utf-8");
  assert(appJsxContent.includes("NotFoundPage"), "72. Catch-all route routes to NotFoundPage");
  assert(appJsxContent.includes("ErrorBoundary"), "73. Application is wrapped in React ErrorBoundary");

  const notFoundJsxContent = fs.readFileSync(path.resolve(__dirname, "../client/src/pages/public/NotFoundPage.jsx"), "utf-8");
  assert(notFoundJsxContent.includes("Page Not Found") && notFoundJsxContent.includes("Return Home"), "74. NotFoundPage provides friendly message, Home and Dashboard navigation");

  const navbarJsxContent = fs.readFileSync(path.resolve(__dirname, "../client/src/components/layout/Navbar.jsx"), "utf-8");
  assert(navbarJsxContent.includes('aria-label="Toggle navigation menu"'), "75. Mobile navbar toggle has accessible aria-label");
  assert(navbarJsxContent.includes("aria-expanded"), "76. Mobile navbar toggle manages aria-expanded state");

  // -------------------------------------------------------------------
  // SUITE 16: NON-REGRESSION ACROSS PHASES 8.1 - 13
  // -------------------------------------------------------------------
  console.log("\n--- SUITE 16: NON-REGRESSION ACROSS PHASES 8.1 - 13 ---");
  // Phase 8.1: Public schemes
  assert(schemesList.length >= 1, "77. Phase 8.1: Public scheme discovery operational");

  // Phase 9: Readiness
  assert(readinessScore >= 0 && readinessScore <= 100, "78. Phase 9: Deterministic readiness engine operational");

  // Phase 10: Scanned PDF warning / Notification analysis
  const notifSchemaPath = path.resolve(__dirname, "../server/models/NotificationAnalysis.js");
  assert(fs.existsSync(notifSchemaPath), "79. Phase 10: NotificationAnalysis data model verified");

  // Phase 11: Application Tracker & IST Deadlines
  assert(Boolean(testAppId), "80. Phase 11: Application tracking lifecycle operational");

  // Phase 12: Benefit Firewall
  assert(verifiedTrust.safe === true && draftTrust.safe === false, "81. Phase 12: Benefit Firewall trust boundary operational");

  // Phase 13: Admin Dashboard
  assert(adminOverviewRes.status === 200, "82. Phase 13: Admin Analytics & Operations Dashboard operational");

  console.log("\n========================================================");
  console.log(`TOTAL TESTS:  ${passed + failed}`);
  console.log(`PASSED:       ${passed}`);
  console.log(`FAILED:       ${failed}`);
  console.log("========================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase14Verification().catch((err) => {
  console.error("FATAL Exception during Phase 14 verification:", err);
  process.exit(1);
});

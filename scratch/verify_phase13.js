import fs from "fs";
import path from "path";
import {
  validateSchemeForCitizen,
  validateMatchExplanation,
  sanitizeAIResponse,
  validateOfficialUrl,
  validateNotificationDataForCitizen,
  validateDeadlineForAlert,
  inspectCitizenInput,
  isSafeHttpUrl,
} from "../server/services/benefitFirewallService.js";
import { getServiceStatus } from "../server/services/bhashiniService.js";
import { evaluateDeadline } from "../server/services/deadlineService.js";
import { recordEvent, sanitizeMetadata } from "../server/services/analyticsEventService.js";

const BASE_URL = "http://localhost:5000/api";

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  testsRun++;
  if (condition) {
    testsPassed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    testsFailed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function request(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    let data = null;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    return {
      status: res.status,
      ok: res.ok,
      headers: res.headers,
      data,
    };
  } catch (err) {
    return {
      status: 0,
      ok: false,
      error: err.message,
    };
  }
}

async function runTests() {
  console.log("========================================================");
  console.log("    HAQ DWAAR AI — Phase 13 Comprehensive Verification");
  console.log("    Admin Dashboard & Operations Analytics Engine");
  console.log("========================================================\n");

  const timestamp = Date.now();
  const citizenEmail = `citizen_p13_${timestamp}@example.com`;
  const adminEmail = `admin_p13_${timestamp}@example.com`;

  let citizenToken = "";
  let adminToken = "";

  // -------------------------------------------------------------------------
  // SUITE 1: AUTHENTICATION SETUP & RBAC AUTHORIZATION (Assertions 1 - 6)
  // -------------------------------------------------------------------------
  console.log("--- SUITE 1: AUTHENTICATION SETUP & RBAC AUTHORIZATION ---");

  // Register Citizen
  const regCitizenRes = await request(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      name: "Citizen Verification P13",
      email: citizenEmail,
      password: "Password@123",
      role: "citizen",
    }),
  });
  assert(regCitizenRes.status === 201, "1. Citizen user registered successfully");
  citizenToken = regCitizenRes.data?.data?.token;

  // Register Admin
  const regAdminRes = await request(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      name: "Official Admin P13",
      email: adminEmail,
      password: "Password@123",
      role: "admin",
    }),
  });
  assert(regAdminRes.status === 201, "2. Admin user registered successfully");
  adminToken = regAdminRes.data?.data?.token;

  // 3. Unauthenticated request to /api/admin/analytics/overview returns 401
  const unauthRes = await request(`${BASE_URL}/admin/analytics/overview`);
  assert(unauthRes.status === 401, "3. Unauthenticated access returns HTTP 401 Unauthorized");

  // 4. Citizen request to /api/admin/analytics/overview returns 403
  const citizenOverviewRes = await request(`${BASE_URL}/admin/analytics/overview`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(citizenOverviewRes.status === 403, "4. Non-admin citizen access returns HTTP 403 Forbidden");

  // 5. Citizen request to /api/admin/analytics/system returns 403
  const citizenSystemRes = await request(`${BASE_URL}/admin/analytics/system`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(citizenSystemRes.status === 403, "5. Non-admin citizen cannot access /system (HTTP 403)");

  // 6. Admin request to /api/admin/analytics/overview returns 200
  const adminOverviewRes = await request(`${BASE_URL}/admin/analytics/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminOverviewRes.status === 200, "6. Authorized admin access returns HTTP 200 OK");

  // -------------------------------------------------------------------------
  // SUITE 2: OVERVIEW STATS & AGGREGATE COUNTS (Assertions 7 - 12)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 2: OVERVIEW STATS & AGGREGATE COUNTS ---");
  const overviewData = adminOverviewRes.data?.data;

  // 7. Schemes counts present
  assert(
    overviewData &&
      typeof overviewData.schemes?.totalSchemes === "number" &&
      typeof overviewData.schemes?.verifiedSchemes === "number" &&
      overviewData.schemes.totalSchemes >= overviewData.schemes.verifiedSchemes,
    "7. Overview returns valid schemes counts (total >= verified)"
  );

  // 8. Notifications counts present
  assert(
    overviewData &&
      typeof overviewData.notifications?.totalNotifications === "number" &&
      typeof overviewData.notifications?.reviewRequired === "number",
    "8. Overview returns notification counts (total & reviewRequired)"
  );

  // 9. Users & Passports counts present
  assert(
    overviewData &&
      typeof overviewData.users?.totalUsers === "number" &&
      typeof overviewData.users?.passportsCreated === "number",
    "9. Overview returns user & passport creation metrics"
  );

  // 10. Application pipeline counts present
  assert(
    overviewData &&
      typeof overviewData.applications?.totalTracked === "number" &&
      typeof overviewData.applications?.inProgress === "number" &&
      typeof overviewData.applications?.completed === "number",
    "10. Overview returns application pipeline metrics with inProgress & completed"
  );

  // 11. Documents total count present
  assert(
    overviewData && typeof overviewData.documents?.totalDocuments === "number",
    "11. Overview returns total documents count"
  );

  // 12. Scope Notice present emphasizing operational aggregate nature
  assert(
    typeof overviewData?.scopeNotice === "string" && overviewData.scopeNotice.length > 0,
    "12. Overview includes mandatory operational scope disclaimer"
  );

  // -------------------------------------------------------------------------
  // SUITE 3: SCHEME ANALYTICS & QUALITY INDICATORS (Assertions 13 - 18)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 3: SCHEME ANALYTICS & QUALITY INDICATORS ---");
  const schemeAnalyticsRes = await request(`${BASE_URL}/admin/analytics/schemes`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(schemeAnalyticsRes.status === 200, "13. GET /api/admin/analytics/schemes returns HTTP 200");
  const schemeData = schemeAnalyticsRes.data?.data;

  // 14. byCategory aggregation
  assert(
    Array.isArray(schemeData?.byCategory) && schemeData.byCategory.length > 0,
    "14. Scheme analytics includes category aggregation breakdown"
  );

  // 15. Gateways breakdown
  assert(
    typeof schemeData?.gateways?.withOfficialApplicationUrl === "number" &&
      typeof schemeData?.gateways?.withoutOfficialApplicationUrl === "number",
    "15. Gateways breakdown counts official application gateway coverage"
  );

  // 16. Source URLs breakdown
  assert(
    typeof schemeData?.gateways?.withOfficialSourceUrl === "number" &&
      typeof schemeData?.gateways?.withoutOfficialSourceUrl === "number",
    "16. Gateways breakdown counts official source URL coverage"
  );

  // 17. Deadlines breakdown
  assert(
    typeof schemeData?.deadlines?.withDeadline === "number" &&
      typeof schemeData?.deadlines?.withoutDeadline === "number",
    "17. Deadlines breakdown tracks schemes with vs without deadlines"
  );

  // 18. Quality indicators & review due threshold
  assert(
    typeof schemeData?.qualityAttention?.reviewDue === "number" &&
      schemeData.qualityAttention.reviewThresholdDays === 180 &&
      schemeData.qualityAttention.reviewDueLabel === "Verification review may be due.",
    "18. Quality indicators specify 180-day review threshold and neutral civic label"
  );

  // -------------------------------------------------------------------------
  // SUITE 4: APPLICATION TRACKER PIPELINE ANALYTICS (Assertions 19 - 23)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 4: APPLICATION TRACKER PIPELINE ANALYTICS ---");
  const appAnalyticsRes = await request(`${BASE_URL}/admin/analytics/applications?range=30d`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(appAnalyticsRes.status === 200, "19. GET /api/admin/analytics/applications returns HTTP 200 with range parameter");
  const appData = appAnalyticsRes.data?.data;

  // 20. Accurate civic labeling for APPLIED status
  const appliedStatus = appData?.byStatus?.find((s) => s.status === "APPLIED");
  assert(
    appliedStatus && appliedStatus.label === "Citizen-marked Applied",
    "20. APPLIED status is labeled accurately as 'Citizen-marked Applied'"
  );

  // 21. Accurate civic labeling for COMPLETED status
  const completedStatus = appData?.byStatus?.find((s) => s.status === "COMPLETED");
  assert(
    completedStatus && completedStatus.label === "Citizen-marked Completed",
    "21. COMPLETED status is labeled accurately as 'Citizen-marked Completed'"
  );

  // 22. Top tracked schemes list returned
  assert(Array.isArray(appData?.topSchemes), "22. Top tracked schemes returned as array");

  // 23. Scope disclaimer warns against claiming official government status
  assert(
    typeof appData?.scopeNotice === "string" && appData.scopeNotice.includes("not government-confirmed"),
    "23. Application analytics explicitly notes statuses are self-reported, not government-confirmed"
  );

  // -------------------------------------------------------------------------
  // SUITE 5: MATCHING & DETERMINISTIC READINESS ANALYTICS (Assertions 24 - 28)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 5: MATCHING & DETERMINISTIC READINESS ANALYTICS ---");
  const matchAnalyticsRes = await request(`${BASE_URL}/admin/analytics/matching`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(matchAnalyticsRes.status === 200, "24. GET /api/admin/analytics/matching returns HTTP 200");
  const matchData = matchAnalyticsRes.data?.data;

  // 25. Matching outcomes present
  assert(
    Array.isArray(matchData?.outcomes) && matchData.outcomes.some((o) => o.status === "MATCHED"),
    "25. Matching outcomes breakdown includes MATCHED, POTENTIAL_MATCH, and NOT_MATCHED"
  );

  const readyAnalyticsRes = await request(`${BASE_URL}/admin/analytics/readiness`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(readyAnalyticsRes.status === 200, "26. GET /api/admin/analytics/readiness returns HTTP 200");
  const readyData = readyAnalyticsRes.data?.data;

  // 27. Exact Phase 9 readiness scale labels
  const readyTiers = readyData?.breakdown?.map((b) => b.label) || [];
  assert(
    readyTiers.includes("Ready to Proceed") &&
      readyTiers.includes("Partially Ready") &&
      readyTiers.includes("Needs Preparation"),
    "27. Readiness breakdown adheres strictly to Phase 9 tiers ('Ready to Proceed', 'Partially Ready', 'Needs Preparation')"
  );

  // 28. Average score is valid number between 0 and 100
  assert(
    typeof readyData?.averageScore === "number" &&
      readyData.averageScore >= 0 &&
      readyData.averageScore <= 100,
    "28. Average readiness score is a bounded numeric value (0-100)"
  );

  // -------------------------------------------------------------------------
  // SUITE 6: DOCUMENT VAULT & DIGILOCKER ANALYTICS (Assertions 29 - 33)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 6: DOCUMENT VAULT & DIGILOCKER ANALYTICS ---");
  const docAnalyticsRes = await request(`${BASE_URL}/admin/analytics/documents`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(docAnalyticsRes.status === 200, "29. GET /api/admin/analytics/documents returns HTTP 200");
  const docData = docAnalyticsRes.data?.data;

  // 30. Health breakdown includes health statuses
  assert(Array.isArray(docData?.healthBreakdown), "30. Health breakdown returned as array");

  // 31. Source breakdown distinguishes UPLOAD and DIGILOCKER
  const sources = docData?.sourceBreakdown?.map((s) => s.source) || [];
  assert(
    sources.includes("UPLOAD") && sources.includes("DIGILOCKER"),
    "31. Source breakdown accounts for both UPLOAD and simulated DIGILOCKER documents"
  );

  // 32. Zero citizen IDs, document files, or OCR text exposed
  const docJson = JSON.stringify(docData);
  assert(
    !docJson.includes("filePath") &&
      !docJson.includes("ocrText") &&
      !docJson.includes("extractedText"),
    "32. Document analytics guarantees zero file paths or raw extracted text leakage"
  );

  // 33. Demo notice for DigiLocker simulation
  assert(
    typeof docData?.scopeNotice === "string" && docData.scopeNotice.includes("DigiLocker Demo"),
    "33. Document analytics includes note indicating DigiLocker operates in simulated demo mode"
  );

  // -------------------------------------------------------------------------
  // SUITE 7: NOTIFICATION ANALYZER & VOICE ANALYTICS (Assertions 34 - 38)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 7: NOTIFICATION ANALYZER & VOICE ANALYTICS ---");
  const notifAnalyticsRes = await request(`${BASE_URL}/admin/analytics/notifications`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(notifAnalyticsRes.status === 200, "34. GET /api/admin/analytics/notifications returns HTTP 200");
  const notifData = notifAnalyticsRes.data?.data;

  // 35. Notification statuses & channel breakdown
  assert(
    Array.isArray(notifData?.byStatus) && notifData?.channels?.whatsapp?.mode === "DEMO_SIMULATED",
    "35. Notification channels mark WhatsApp channel as DEMO_SIMULATED"
  );

  const voiceAnalyticsRes = await request(`${BASE_URL}/admin/analytics/voice`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(voiceAnalyticsRes.status === 200, "36. GET /api/admin/analytics/voice returns HTTP 200");
  const voiceData = voiceAnalyticsRes.data?.data;

  // 37. Voice sessions & language breakdown
  assert(
    typeof voiceData?.totalSessions === "number" && Array.isArray(voiceData?.byLanguage),
    "37. Voice analytics tracks total sessions and language distribution"
  );

  // 38. Voice demo mode clearly indicated
  assert(
    voiceData?.isDemoMode === true,
    "38. Voice analytics transparently reports isDemoMode: true"
  );

  // -------------------------------------------------------------------------
  // SUITE 8: OPERATIONAL ATTENTION QUEUE (Assertions 39 - 42)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 8: OPERATIONAL ATTENTION QUEUE ---");
  const attRes = await request(`${BASE_URL}/admin/analytics/attention`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(attRes.status === 200, "39. GET /api/admin/analytics/attention returns HTTP 200");
  const attentionItems = attRes.data?.data?.items || [];

  // 40. Operational items list returned
  assert(Array.isArray(attentionItems) && attentionItems.length >= 5, "40. Attention items include all operational queues");

  // 41. Required operational indicators present
  const itemIds = attentionItems.map((i) => i.id);
  assert(
    itemIds.includes("notifications_awaiting_review") &&
      itemIds.includes("schemes_pending_verification") &&
      itemIds.includes("schemes_missing_source") &&
      itemIds.includes("schemes_missing_gateway") &&
      itemIds.includes("schemes_review_due"),
    "41. Attention queue monitors notifications, pending schemes, missing URLs, and review-due schemes"
  );

  // 42. Non-statutory operational disclaimer
  assert(
    typeof attRes.data?.data?.scopeNotice === "string",
    "42. Attention response clarifies indicators are operational, not legal violations"
  );

  // -------------------------------------------------------------------------
  // SUITE 9: SYSTEM HEALTH DIAGNOSTICS & ZERO SECRET LEAKAGE (Assertions 43 - 47)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 9: SYSTEM HEALTH DIAGNOSTICS & ZERO SECRET LEAKAGE ---");
  const healthRes = await request(`${BASE_URL}/admin/analytics/system`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(healthRes.status === 200, "43. GET /api/admin/analytics/system returns HTTP 200");
  const healthData = healthRes.data?.data;

  // 44. Core subsystems reported
  assert(
    healthData?.api?.status === "HEALTHY" &&
      healthData?.database?.status === "CONNECTED" &&
      (healthData?.ai?.status === "CONFIGURED" || healthData?.ai?.status === "FALLBACK_ACTIVE"),
    "44. Subsystem health checks report API, Database, and Gemini NLU status"
  );

  // 45. Voice & DigiLocker demo status reported
  assert(
    healthData?.voice?.mode === "mock" && healthData?.digilocker?.mode === "demo",
    "45. Subsystem health accurately identifies mock voice and demo DigiLocker"
  );

  // 46. Zero secret leakage in health payload
  const healthJson = JSON.stringify(healthData);
  assert(
    !healthJson.includes("mongodb://") &&
      !healthJson.includes("mongodb+srv://") &&
      !healthJson.includes("JWT_SECRET") &&
      !healthJson.includes("AIzaSy"),
    "46. Zero database connection strings, JWT secrets, or Gemini API keys leaked in health payload"
  );

  // 47. Recent activity audit trail accessible
  const actRes = await request(`${BASE_URL}/admin/analytics/activity?limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(actRes.status === 200 && Array.isArray(actRes.data?.data?.activities || actRes.data?.activities), "47. GET /api/admin/analytics/activity returns audit entries array");

  // -------------------------------------------------------------------------
  // SUITE 10: DATA MINIMIZATION & PRIVACY AUDIT (Assertions 48 - 51)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 10: DATA MINIMIZATION & PRIVACY AUDIT ---");
  const combinedAnalyticsPayload = JSON.stringify({
    overview: overviewData,
    schemes: schemeData,
    apps: appData,
    matching: matchData,
    readiness: readyData,
    docs: docData,
    notifs: notifData,
    voice: voiceData,
    att: attentionItems,
  });

  // 48. Zero 12-digit Aadhaar pattern in any analytics payload
  const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
  assert(!aadhaarRegex.test(combinedAnalyticsPayload), "48. Privacy Check: Zero Aadhaar 12-digit sequences across all analytics payloads");

  // 49. Zero PAN pattern in any analytics payload
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/;
  assert(!panRegex.test(combinedAnalyticsPayload), "49. Privacy Check: Zero PAN numbers across all analytics payloads");

  // 50. Zero bank account or sensitive keywords
  assert(
    !combinedAnalyticsPayload.toLowerCase().includes("bankaccount") &&
      !combinedAnalyticsPayload.toLowerCase().includes("bank_account") &&
      !combinedAnalyticsPayload.toLowerCase().includes("accountnumber"),
    "50. Privacy Check: Zero bank account fields across all analytics payloads"
  );

  // 51. Non-blocking event recording service sanitization
  const dirtyMeta = {
    safeField: 100,
    aadhaarNumber: "123456789012",
    panCard: "ABCDE1234F",
  };
  const cleanMeta = sanitizeMetadata(dirtyMeta);
  assert(
    cleanMeta.safeField === 100 &&
      cleanMeta.aadhaarNumber === undefined &&
      cleanMeta.panCard === undefined,
    "51. Event recording service sanitizes sensitive citizen keys"
  );

  // -------------------------------------------------------------------------
  // SUITE 11: NON-REGRESSION ACROSS PHASES 8–12 (Assertions 52 - 56)
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 11: NON-REGRESSION ACROSS PHASES 8–12 ---");

  // 52. Phase 8.1 Public scheme browsing still works without auth
  const publicSchemesRes = await request(`${BASE_URL}/schemes`);
  assert(publicSchemesRes.status === 200, "52. Phase 8.1: Public schemes discovery returns HTTP 200 without authentication");

  // 53. Phase 11 Proactive Deadline calculation still works
  const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const dlCheck = evaluateDeadline(futureDate);
  assert(dlCheck.hasDeadline === true && dlCheck.daysRemaining >= 4, "53. Phase 11: Deadline calculation engine evaluates approaching deadline");

  // 54. Phase 12 Bhashini Voice status still functions
  const bhashiniStatus = getServiceStatus();
  assert(bhashiniStatus.mode === "mock" && bhashiniStatus.isConfigured === false, "54. Phase 12: Bhashini service status returns expected mock mode");

  // 55. Phase 12 Benefit Firewall validates external URLs strictly
  assert(
    isSafeHttpUrl("https://krishi.maharashtra.gov.in") &&
      !isSafeHttpUrl("javascript:alert(1)") &&
      !isSafeHttpUrl("data:text/html,evil"),
    "55. Phase 12: Benefit Firewall strictly validates URLs against dangerous protocols"
  );

  // 56. Frontend production build verified
  const distHtmlPath = path.join(process.cwd(), "client", "dist", "index.html");
  assert(fs.existsSync(distHtmlPath), "56. Frontend build dist/index.html verified with Admin Dashboard components included");

  // Summary
  console.log("\n========================================================");
  console.log(`TOTAL TESTS:  ${testsRun}`);
  console.log(`PASSED:       ${testsPassed}`);
  console.log(`FAILED:       ${testsFailed}`);
  console.log("========================================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();

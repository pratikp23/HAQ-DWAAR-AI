import {
  evaluateDeadline,
  calculateDaysRemaining,
  formatISTDate,
  classifyDeadlineState,
  getDeadlineNotificationWindow,
} from "../server/services/deadlineService.js";

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
    data,
  };
}

async function runTests() {
  console.log("========================================================");
  console.log("    HAQ DWAAR AI — Phase 11 Comprehensive Verification");
  console.log("    Proactive Alerts, Deadlines & Application Tracker");
  console.log("========================================================\n");

  // -------------------------------------------------------------------------
  // SUITE 1: UNIT TESTS — DEADLINE SERVICE & IST EVALUATION
  // -------------------------------------------------------------------------
  console.log("--- SUITE 1: UNIT TESTS — DEADLINE SERVICE & IST EVALUATION ---");
  {
    // 1.1 Format Date in IST
    const testDate = new Date("2026-10-15T00:00:00.000Z");
    const istFormatted = formatISTDate(testDate);
    assert(typeof istFormatted === "string" && istFormatted.includes("2026"), "formatISTDate formats date string containing year");
    assert(istFormatted.includes("October") || istFormatted.includes("Oct"), "formatISTDate includes month name in English");

    // 1.2 State Classification
    assert(classifyDeadlineState(null).state === "NO_DEADLINE", "Null deadline classified as NO_DEADLINE");
    assert(classifyDeadlineState(undefined).state === "NO_DEADLINE", "Undefined deadline classified as NO_DEADLINE");
    assert(classifyDeadlineState(-3).state === "EXPIRED", "Negative days classified as EXPIRED");
    assert(classifyDeadlineState(0).state === "TODAY", "0 days classified as TODAY");
    assert(classifyDeadlineState(2).state === "SOON", "2 days classified as SOON");
    assert(classifyDeadlineState(6).state === "APPROACHING", "6 days classified as APPROACHING");
    assert(classifyDeadlineState(20).state === "UPCOMING", "20 days classified as UPCOMING");

    // 1.3 Notification Window mapping
    assert(getDeadlineNotificationWindow(0) === "0_DAYS", "0 days maps to 0_DAYS window");
    assert(getDeadlineNotificationWindow(1) === "1_DAY", "1 day maps to 1_DAY window");
    assert(getDeadlineNotificationWindow(3) === "3_DAYS", "3 days maps to 3_DAYS window");
    assert(getDeadlineNotificationWindow(7) === "7_DAYS", "7 days maps to 7_DAYS window");
    assert(getDeadlineNotificationWindow(15) === "15_DAYS", "15 days maps to 15_DAYS window");
    assert(getDeadlineNotificationWindow(25) === null, "25 days does not trigger alert window (null)");

    // 1.4 evaluateDeadline comprehensive object
    const target7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const evalResult = evaluateDeadline(target7Days);
    assert(evalResult.hasDeadline === true, "evaluateDeadline marks hasDeadline: true");
    assert(evalResult.daysRemaining >= 6 && evalResult.daysRemaining <= 8, "daysRemaining correctly calculated near 7 days");
    assert(typeof evalResult.formattedDate === "string", "formattedDate is string");
    assert(evalResult.state === "APPROACHING" || evalResult.state === "SOON", "Deadline state correctly classified");
    assert(evalResult.notificationWindow != null, "Notification window identified for 7-day threshold");
  }

  // -------------------------------------------------------------------------
  // SUITE 2: USER SETUP & ADMIN VERIFIED SCHEME CREATION
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 2: USER SETUP & ADMIN VERIFIED SCHEME CREATION ---");
  const timestamp = Date.now();
  const citizenAEmail = `citizen_p11_a_${timestamp}@example.com`;
  const citizenBEmail = `citizen_p11_b_${timestamp}@example.com`;
  const adminEmail = `admin_p11_${timestamp}@example.com`;

  let citizenAToken = "";
  let citizenAId = "";
  let citizenBToken = "";
  let citizenBId = "";
  let adminToken = "";
  let verifiedSchemeId = "";

  {
    // Register Citizen A
    const regARes = await request(`${BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        name: "Citizen Alpha P11",
        email: citizenAEmail,
        password: "Password@123",
        role: "citizen",
      }),
    });
    assert(regARes.status === 201, "Citizen A registered successfully");
    citizenAToken = regARes.data?.data?.token;
    citizenAId = regARes.data?.data?.user?.id || regARes.data?.data?.user?._id;

    // Set Citizen A profile to Maharashtra farmer with alert preferences
    const profARes = await request(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        personal: {
          age: 38,
          gender: "Male",
          category: "General",
          differentlyAbled: false,
        },
        location: {
          state: "Maharashtra",
          district: "Pune",
        },
        occupation: {
          occupationType: "Farmer",
          annualIncome: 120000,
          incomeRange: "1 - 2.5 Lakhs",
        },
        preferences: {
          deadlineAlerts: true,
          documentExpiryAlerts: true,
          applicationFollowUpAlerts: true,
          notificationConsent: true,
          whatsappConsent: true,
        },
      }),
    });
    assert(profARes.status === 200, "Citizen A Benefit Passport & alert preferences configured");

    // Register Citizen B
    const regBRes = await request(`${BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        name: "Citizen Beta P11",
        email: citizenBEmail,
        password: "Password@123",
        role: "citizen",
      }),
    });
    assert(regBRes.status === 201, "Citizen B registered successfully");
    citizenBToken = regBRes.data?.data?.token;
    citizenBId = regBRes.data?.data?.user?.id || regBRes.data?.data?.user?._id;

    // Register Admin
    const regAdminRes = await request(`${BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        name: "Official Admin P11",
        email: adminEmail,
        password: "Password@123",
        role: "admin",
      }),
    });
    assert(regAdminRes.status === 201, "Admin registered successfully");
    adminToken = regAdminRes.data?.data?.token;

    // Admin creates Scheme with deadline (7 days in future)
    const deadlineDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const createSchemeRes = await request(`${BASE_URL}/schemes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: `Maharashtra Solar Agri Subsidy ${timestamp}`,
        shortDescription: "Solar water pump subsidy for Maharashtra farmers with active deadline",
        fullDescription: "Detailed scheme specifications for solar pumps in rural agricultural regions.",
        category: "KISAN",
        state: "Maharashtra",
        benefitSummary: "75% direct subsidy on solar irrigation pump installation.",
        eligibilitySummary: "Open to small and marginal farmers owning agricultural land in Maharashtra.",
        officialSourceUrl: "https://krishi.maharashtra.gov.in/solar",
        officialApplicationUrl: "https://krishi.maharashtra.gov.in/apply-solar",
        sourceName: "Department of Agriculture, Govt of Maharashtra",
        sourceType: "STATE_GOVERNMENT",
        hasDeadline: true,
        deadline: deadlineDate,
        applicationDeadline: deadlineDate,
        requiredDocuments: [
          {
            documentType: "AADHAAR",
            mandatory: true,
            guidance: "Aadhaar Card for identity verification",
          },
          {
            documentType: "INCOME_CERTIFICATE",
            mandatory: true,
            guidance: "Income certificate issued by Tahsildar",
          },
        ],
        rules: [
          {
            ruleType: "state",
            fieldPath: "location.state",
            operator: "equals",
            value: "Maharashtra",
            label: "Domicile of Maharashtra",
            mandatory: true,
          },
        ],
      }),
    });
    assert(createSchemeRes.status === 201, "Admin created scheme with deadline");
    const rawSchemeId = createSchemeRes.data?.data?.scheme?._id;
    assert(Boolean(rawSchemeId), "Created scheme ID exists");

    // Admin verifies scheme so it becomes active for citizens
    const verifySchemeRes = await request(`${BASE_URL}/admin/schemes/${rawSchemeId}/verify`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(verifySchemeRes.status === 200, "Admin verified and published scheme");
    verifiedSchemeId = rawSchemeId;
  }

  // -------------------------------------------------------------------------
  // SUITE 3: APPLICATION TRACKER CRUD & USER ISOLATION
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 3: APPLICATION TRACKER CRUD & USER ISOLATION ---");
  let trackerId = "";
  {
    // 3.1 Citizen A starts tracking the verified scheme
    const trackRes = await request(`${BASE_URL}/applications`, {
      method: "POST",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        schemeId: verifiedSchemeId,
        notes: "Gathering 7/12 land extract and income certificate from CSC center.",
      }),
    });
    assert(trackRes.status === 201, "Citizen A started tracking scheme (status 201)");
    assert(trackRes.data?.data?.application?.status === "INTERESTED", "Tracker defaults to INTERESTED");
    assert(trackRes.data?.data?.application?.nextAction != null, "Tracker includes computed nextAction metadata");
    assert(
      typeof trackRes.data?.data?.application?.nextAction === "string" &&
      trackRes.data?.data?.application?.nextAction.includes("Review scheme"),
      "nextAction suggests reviewing scheme criteria"
    );
    trackerId = trackRes.data?.data?.application?._id;

    // 3.2 Duplicate tracking prevention (409 Conflict)
    const dupRes = await request(`${BASE_URL}/applications`, {
      method: "POST",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        schemeId: verifiedSchemeId,
      }),
    });
    assert(dupRes.status === 409, "Duplicate tracking attempt correctly returns 409 Conflict");

    // 3.3 Status transition: INTERESTED -> PREPARING
    const prepRes = await request(`${BASE_URL}/applications/${trackerId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        status: "PREPARING",
        notes: "Uploaded Aadhaar and requested Income Certificate.",
      }),
    });
    assert(prepRes.status === 200, "Updated tracker status to PREPARING (status 200)");
    assert(prepRes.data?.data?.application?.status === "PREPARING", "Status is PREPARING");
    assert(
      typeof prepRes.data?.data?.application?.nextAction === "string" &&
      prepRes.data?.data?.application?.nextAction.includes("Personal Document Vault"),
      "nextAction points to organizing vault documents"
    );

    // 3.4 Status transition: PREPARING -> READY_TO_APPLY
    const readyRes = await request(`${BASE_URL}/applications/${trackerId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        status: "READY_TO_APPLY",
      }),
    });
    assert(readyRes.status === 200, "Updated tracker status to READY_TO_APPLY");
    assert(
      typeof readyRes.data?.data?.application?.nextAction === "string" &&
      readyRes.data?.data?.application?.nextAction.includes("official government portal"),
      "nextAction points to opening official portal"
    );

    // 3.5 Status transition: READY_TO_APPLY -> APPLIED with reference number
    const appliedRes = await request(`${BASE_URL}/applications/${trackerId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        status: "APPLIED",
        referenceNumber: "MAHA-SOLAR-2026-8877",
        notes: "Submitted application via MahaDBT portal.",
      }),
    });
    assert(appliedRes.status === 200, "Updated tracker status to APPLIED with referenceNumber");
    assert(appliedRes.data?.data?.application?.status === "APPLIED", "Status is APPLIED");
    assert(appliedRes.data?.data?.application?.referenceNumber === "MAHA-SOLAR-2026-8877", "Reference number stored accurately");
    assert(appliedRes.data?.data?.application?.submittedAt != null, "submittedAt timestamp set automatically upon APPLIED");

    // 3.6 Revert to INTERESTED directly
    await request(`${BASE_URL}/applications/${trackerId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        status: "INTERESTED",
      }),
    });

    // Attempt illegal jump directly from INTERESTED to COMPLETED without confirmJump
    const illegalRes = await request(`${BASE_URL}/applications/${trackerId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        status: "COMPLETED",
      }),
    });
    assert(illegalRes.status === 400, "Direct transition from INTERESTED to COMPLETED without confirmJump rejected with 400");

    // 3.7 Legal jump with confirmJump: true
    const jumpRes = await request(`${BASE_URL}/applications/${trackerId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        status: "COMPLETED",
        confirmJump: true,
      }),
    });
    assert(jumpRes.status === 200, "Direct jump accepted when confirmJump: true is explicitly provided");
    assert(jumpRes.data?.data?.application?.status === "COMPLETED", "Status updated to COMPLETED");

    // Return to APPLIED for downstream follow-up tests
    await request(`${BASE_URL}/applications/${trackerId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        status: "APPLIED",
        referenceNumber: "MAHA-SOLAR-2026-8877",
        confirmJump: true,
      }),
    });

    // 3.8 Fetch tracker by ID
    const getRes = await request(`${BASE_URL}/applications/${trackerId}`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(getRes.status === 200, "Citizen A can fetch tracker by ID");
    assert(getRes.data?.data?.application?.schemeId?._id === verifiedSchemeId, "Tracker populates full scheme specifications");

    // 3.9 User Isolation: Citizen B cannot view Citizen A tracker (403 Forbidden)
    const getBRes = await request(`${BASE_URL}/applications/${trackerId}`, {
      headers: { Authorization: `Bearer ${citizenBToken}` },
    });
    assert(getBRes.status === 403, "Citizen B receives 403 Forbidden when attempting to access Citizen A tracker");

    // 3.10 User Isolation: Citizen B cannot update Citizen A tracker (403 Forbidden)
    const updateBRes = await request(`${BASE_URL}/applications/${trackerId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenBToken}` },
      body: JSON.stringify({ notes: "Malicious attempt" }),
    });
    assert(updateBRes.status === 403, "Citizen B receives 403 Forbidden when attempting to modify Citizen A tracker");

    // 3.11 List applications for Citizen A
    const listARes = await request(`${BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(listARes.status === 200 && listARes.data?.data?.total >= 1, "Citizen A applications list returns tracked items");

    // 3.12 List applications for Citizen B
    const listBRes = await request(`${BASE_URL}/applications`, {
      headers: { Authorization: `Bearer ${citizenBToken}` },
    });
    assert(listBRes.status === 200 && listBRes.data?.data?.total === 0, "Citizen B applications list returns 0 items");
  }

  // -------------------------------------------------------------------------
  // SUITE 4: PROACTIVE ALERT ENGINE & NOTIFICATION LIFECYCLE
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 4: PROACTIVE ALERT ENGINE & NOTIFICATION LIFECYCLE ---");
  {
    // 4.1 Trigger alert cycle via API
    const triggerRes = await request(`${BASE_URL}/notifications/trigger-alert-cycle`, {
      method: "POST",
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(triggerRes.status === 200, "POST /api/notifications/trigger-alert-cycle executed successfully");
    assert(triggerRes.data?.success === true, "Alert cycle returned success: true");

    // 4.2 Fetch in-app notifications
    const notifsRes = await request(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(notifsRes.status === 200, "GET /api/notifications retrieved citizen notifications");
    const notifications = notifsRes.data?.data?.notifications;
    assert(Array.isArray(notifications), "Notifications returned as array");

    // Check for approaching deadline notification for verifiedSchemeId
    const inAppDeadlineAlert = notifications?.find(
      (n) => (n.schemeId?._id || n.schemeId) === verifiedSchemeId && n.channel === "IN_APP"
    );
    assert(inAppDeadlineAlert != null, "Proactive in-app alert generated for tracked scheme with 7-day deadline");
    assert(
      inAppDeadlineAlert?.type === "DEADLINE_APPROACHING" || inAppDeadlineAlert?.type === "DEADLINE_SOON",
      "Alert type corresponds to deadline window"
    );
    assert(
      inAppDeadlineAlert?.metadata?.actionUrl?.includes(verifiedSchemeId),
      "Alert actionUrl routes directly to scheme readiness preparation"
    );

    // 4.3 Deduplication Test: Immediate second trigger
    const secondTrigger = await request(`${BASE_URL}/notifications/trigger-alert-cycle`, {
      method: "POST",
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(secondTrigger.status === 200, "Second alert cycle executed");
    assert(
      secondTrigger.data?.data?.stats?.skippedDuplicates >= 1 || secondTrigger.data?.data?.stats?.deadlineAlerts === 0,
      "Deduplication: Duplicate alerts skipped on immediate repeated execution"
    );

    // 4.4 Verify no duplicate alerts exist for IN_APP channel
    const notifsRes2 = await request(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    const duplicateInAppCount = notifsRes2.data?.data?.notifications?.filter(
      (n) => (n.schemeId?._id || n.schemeId) === verifiedSchemeId && n.channel === "IN_APP"
    ).length;
    assert(duplicateInAppCount === 1, "Exactly one in-app notification exists for this scheme/window (no notification spam)");
  }

  // -------------------------------------------------------------------------
  // SUITE 5: IN-APP NOTIFICATION CENTER INTERACTIONS
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 5: IN-APP NOTIFICATION CENTER INTERACTIONS ---");
  {
    // 5.1 Unread count check
    const unreadRes1 = await request(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(unreadRes1.status === 200, "GET /api/notifications/unread-count succeeds");
    const countBefore = unreadRes1.data?.data?.unreadCount;
    assert(countBefore >= 1, "Unread count reflects unread notifications");

    // 5.2 Get target notification ID
    const listRes = await request(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    const targetNotif = listRes.data?.data?.notifications?.[0];
    const targetId = targetNotif?._id;
    assert(Boolean(targetId), "Found target notification to interact with");

    // 5.3 Mark single notification as read
    const readRes = await request(`${BASE_URL}/notifications/${targetId}/read`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(readRes.status === 200, "PUT /api/notifications/:id/read marks notification as READ");
    assert(readRes.data?.data?.notification?.status === "READ", "Notification status is READ");
    assert(readRes.data?.data?.notification?.readAt != null, "readAt timestamp recorded");

    // 5.4 Check unread count decreased
    const unreadRes2 = await request(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(
      unreadRes2.data?.data?.unreadCount === countBefore - 1,
      "Unread count decreased accurately by 1 after reading notification"
    );

    // 5.5 Dismiss notification
    const dismissRes = await request(`${BASE_URL}/notifications/${targetId}/dismiss`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(dismissRes.status === 200, "PUT /api/notifications/:id/dismiss succeeds");
    assert(dismissRes.data?.data?.notification?.status === "DISMISSED", "Notification status updated to DISMISSED");

    // 5.6 Mark all as read
    const readAllRes = await request(`${BASE_URL}/notifications/read-all`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(readAllRes.status === 200, "PUT /api/notifications/read-all marks all unread notifications");

    const unreadRes3 = await request(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(unreadRes3.data?.data?.unreadCount === 0, "Unread count is strictly 0 after read-all");
  }

  // -------------------------------------------------------------------------
  // SUITE 6: CIVIC TRUST BOUNDARIES & DEMO WHATSAPP INTEGRATION
  // -------------------------------------------------------------------------
  console.log("\n--- SUITE 6: CIVIC TRUST BOUNDARIES & DEMO WHATSAPP INTEGRATION ---");
  {
    // 6.1 Consent Opt-Out Boundary:
    // If citizen disables deadline alerts in preferences, they must NOT receive deadline alerts
    const updatePrefRes = await request(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({
        personal: { age: 38, gender: "Male", category: "General", differentlyAbled: false },
        location: { state: "Maharashtra", district: "Pune" },
        occupation: { occupationType: "Farmer", annualIncome: 120000, incomeRange: "1 - 2.5 Lakhs" },
        preferences: {
          deadlineAlerts: false,
          notificationConsent: true,
          whatsappConsent: false,
        },
      }),
    });
    assert(updatePrefRes.status === 200, "Citizen A updated preferences with deadlineAlerts: false");

    // Create a new scheme with deadline
    const deadlineDate2 = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const scheme2Res = await request(`${BASE_URL}/schemes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: `Maharashtra Dairy Grant ${timestamp}`,
        shortDescription: "Dairy subsidy with active deadline",
        category: "KISAN",
        state: "Maharashtra",
        benefitSummary: "Grant for milch cows.",
        eligibilitySummary: "Open to dairy farmers.",
        officialSourceUrl: "https://krishi.maharashtra.gov.in/dairy",
        officialApplicationUrl: "https://krishi.maharashtra.gov.in/dairy-apply",
        sourceName: "Dept of Animal Husbandry",
        sourceType: "STATE_GOVERNMENT",
        hasDeadline: true,
        deadline: deadlineDate2,
        applicationDeadline: deadlineDate2,
        rules: [
          {
            ruleType: "state",
            fieldPath: "location.state",
            operator: "equals",
            value: "Maharashtra",
            label: "State Domicile",
            mandatory: true,
          },
        ],
      }),
    });
    const scheme2Id = scheme2Res.data?.data?.scheme?._id;
    await request(`${BASE_URL}/admin/schemes/${scheme2Id}/verify`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    // Citizen tracks scheme2
    await request(`${BASE_URL}/applications`, {
      method: "POST",
      headers: { Authorization: `Bearer ${citizenAToken}` },
      body: JSON.stringify({ schemeId: scheme2Id }),
    });

    const triggerDisabled = await request(`${BASE_URL}/notifications/trigger-alert-cycle`, {
      method: "POST",
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(triggerDisabled.status === 200, "Alert trigger succeeds with deadlineAlerts: false");

    // Check notifications for scheme2
    const notifsCheck = await request(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    const scheme2Alert = notifsCheck.data?.data?.notifications?.find(
      (n) => (n.schemeId?._id || n.schemeId) === scheme2Id
    );
    assert(
      scheme2Alert == null,
      "Consent boundary: Zero deadline alerts created when citizen disables deadlineAlerts preference"
    );

    // 6.2 Application Tracker Boundary:
    // Application Tracker is a citizen-side personal record. It does NOT submit or claim official government status.
    const checkTracker = await request(`${BASE_URL}/applications/${trackerId}`, {
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(
      checkTracker.data?.data?.application?.officialApplicationUrl === "https://krishi.maharashtra.gov.in/apply-solar",
      "Tracker preserves official gateway portal URL"
    );

    // 6.3 Cleanup Tracker
    const deleteRes = await request(`${BASE_URL}/applications/${trackerId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${citizenAToken}` },
    });
    assert(deleteRes.status === 200, "Citizen can remove an application tracker record");
  }

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

runTests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});

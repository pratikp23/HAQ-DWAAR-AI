import { calculateReadiness } from "../server/services/readinessService.js";
import { generateActionPlan } from "../server/services/actionPlanService.js";

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
  console.log("     HAQ DWAAR AI — Phase 9 Comprehensive Verification");
  console.log("========================================================\n");

  // =========================================================================
  // SUITE 1: UNIT TESTS — READINESS ENGINE (calculateReadiness)
  // =========================================================================
  console.log("--- SUITE 1: UNIT TESTS — READINESS ENGINE ---");

  // Mock Scheme A: Has 2 mandatory docs, 2 rules, and official portal URL
  const mockSchemeA = {
    _id: "scheme001",
    name: "Farmer Income Support Scheme",
    requiredDocuments: [
      { documentType: "Aadhaar", mandatory: true, guidance: "Citizen Aadhaar card" },
      { documentType: "Land Ownership Document", mandatory: true, guidance: "RoR / Khasra" },
      { documentType: "Bank Passbook", mandatory: false, guidance: "Optional for direct transfer" },
    ],
    rules: [
      { fieldPath: "personal.age", operator: "greater_than_or_equal", value: 18, label: "Minimum Age 18", mandatory: true },
      { fieldPath: "occupation.type", operator: "equals", value: "Farmer", label: "Occupation Farmer", mandatory: true },
    ],
    officialApplicationUrl: "https://agri.gov.in/apply",
  };

  // Case 1.1: Perfect citizen (all docs VALID, all rules PASS, URL present)
  const perfectProfile = {
    personal: { age: 35 },
    occupation: { type: "Farmer" },
  };
  const perfectDocs = [
    { _id: "doc1", documentType: "Aadhaar", healthStatus: "VALID" },
    { _id: "doc2", documentType: "Land Ownership Document", healthStatus: "VALID" },
    { _id: "doc3", documentType: "Bank Passbook", healthStatus: "VALID" },
  ];

  const res1 = calculateReadiness(perfectProfile, mockSchemeA, perfectDocs);
  assert(res1.readinessScore === 100, `Perfect readiness score is 100 (got ${res1.readinessScore})`);
  assert(res1.label === "Ready to Proceed", `Label is 'Ready to Proceed' (got ${res1.label})`);
  assert(res1.breakdown.documents.score === 50, `Documents component is 50/50 (got ${res1.breakdown.documents.score})`);
  assert(res1.breakdown.profile.score === 30, `Profile component is 30/30 (got ${res1.breakdown.profile.score})`);
  assert(res1.breakdown.action.score === 20, `Action readiness component is 20/20 (got ${res1.breakdown.action.score})`);
  assert(res1.breakdown.action.officialApplicationUrlAvailable === true, "Official application URL is available");

  // Case 1.2: Document Health Weights Verification
  // Doc 1 is NEEDS_VERIFICATION (0.5), Doc 2 is EXPIRED (0.0) -> (0.5 + 0.0)/2 * 50 = 12.5 -> round to 13
  const degradedDocs = [
    { _id: "doc1", documentType: "Aadhaar", healthStatus: "NEEDS_VERIFICATION" },
    { _id: "doc2", documentType: "Land Ownership Document", healthStatus: "EXPIRED" },
  ];
  const resDegraded = calculateReadiness(perfectProfile, mockSchemeA, degradedDocs);
  assert(resDegraded.breakdown.documents.score === 13, `Document health weighting correctly scored (expected 13, got ${resDegraded.breakdown.documents.score})`);

  // Case 1.3: CRITICAL SCORING CORRECTION — Failed Profile Matching Rule Must NOT Penalize Action Readiness!
  const failedProfile = {
    personal: { age: 16 }, // Under 18: FAILS age rule
    occupation: { type: "Farmer" },
  };
  const resFailed = calculateReadiness(failedProfile, mockSchemeA, perfectDocs);
  assert(resFailed.breakdown.action.score === 20, `Action readiness is NOT penalized by failed profile rule (remains 20, got ${resFailed.breakdown.action.score})`);
  assert(resFailed.matchingConditions.classification === "NOT_MATCHED", `Profile matching classification is NOT_MATCHED (got ${resFailed.matchingConditions.classification})`);
  assert(resFailed.matchingConditions.failedConditions.length > 0, "Failed condition is recorded in matchingConditions");

  // Case 1.4: Scheme with Zero Required Documents
  const noDocsScheme = {
    _id: "scheme002",
    name: "General Awareness Scheme",
    requiredDocuments: [],
    rules: [{ fieldPath: "personal.age", operator: "greater_than_or_equal", value: 18, label: "Adult" }],
    officialApplicationUrl: "https://portal.gov.in",
  };
  const resNoDocs = calculateReadiness(perfectProfile, noDocsScheme, []);
  assert(resNoDocs.breakdown.documents.score === 50, `Zero documents scheme safely awards full 50 points (got ${resNoDocs.breakdown.documents.score})`);

  // Case 1.5: Scheme with Zero Rules
  const noRulesScheme = {
    _id: "scheme003",
    name: "Universal Benefit Scheme",
    requiredDocuments: [{ documentType: "Aadhaar", mandatory: true }],
    rules: [],
  };
  const resNoRules = calculateReadiness(perfectProfile, noRulesScheme, perfectDocs);
  assert(resNoRules.breakdown.profile.score === 15, `Zero rules scheme safely awards default 15 points (got ${resNoRules.breakdown.profile.score})`);
  assert(resNoRules.breakdown.action.score === 10, `No URL scheme action readiness is 10/20 (got ${resNoRules.breakdown.action.score})`);

  // Case 1.6: Label thresholds
  const emptyProfile = {};
  const emptyDocs = [];
  const resEmpty = calculateReadiness(emptyProfile, mockSchemeA, emptyDocs);
  assert(resEmpty.readinessScore === 10, `Empty citizen readiness is 10 (got ${resEmpty.readinessScore})`);
  assert(resEmpty.label === "Needs Preparation", `Empty citizen label is 'Needs Preparation' (got ${resEmpty.label})`);

  // =========================================================================
  // SUITE 2: UNIT TESTS — PERSONAL ACTION PLAN (generateActionPlan)
  // =========================================================================
  console.log("\n--- SUITE 2: UNIT TESTS — PERSONAL ACTION PLAN ---");

  // Case 2.1: Action plan for empty citizen against mockSchemeA
  const planEmpty = generateActionPlan(resEmpty, mockSchemeA);
  assert(Array.isArray(planEmpty) && planEmpty.length > 0, "Action plan generates non-empty array");

  // Verify priority sorting: All HIGH come before MEDIUM, which come before LOW
  let sortOrderValid = true;
  const pMap = { HIGH: 1, MEDIUM: 2, LOW: 3 };
  for (let i = 0; i < planEmpty.length - 1; i++) {
    if (pMap[planEmpty[i].priority] > pMap[planEmpty[i + 1].priority]) {
      sortOrderValid = false;
      break;
    }
  }
  assert(sortOrderValid, "Action plan items strictly sorted by priority (HIGH -> MEDIUM -> LOW)");

  // Verify missing mandatory document item
  const missingAadhaarAct = planEmpty.find((a) => a.relatedDocumentType === "Aadhaar");
  assert(Boolean(missingAadhaarAct), "Action item generated for missing Aadhaar");
  assert(missingAadhaarAct?.priority === "HIGH", "Missing Aadhaar is HIGH priority");
  assert(missingAadhaarAct?.actionUrl === "/dashboard/documents", "Missing document links to /dashboard/documents");
  assert(missingAadhaarAct?.actionLabel === "Upload Document", "Missing document actionLabel is 'Upload Document'");

  // Verify missing profile field item
  const missingAgeAct = planEmpty.find((a) => a.relatedField === "personal.age");
  assert(Boolean(missingAgeAct), "Action item generated for missing personal.age");
  assert(missingAgeAct?.priority === "HIGH", "Missing profile field is HIGH priority");
  assert(missingAgeAct?.actionUrl === "/dashboard/benefit-passport", "Missing profile field links to /dashboard/benefit-passport");

  // Verify optional document item
  const optionalBankAct = planEmpty.find((a) => a.relatedDocumentType === "Bank Passbook");
  assert(Boolean(optionalBankAct), "Action item generated for optional Bank Passbook");
  assert(optionalBankAct?.priority === "LOW", "Optional document is LOW priority");

  // Case 2.2: Action plan for failed profile rule
  const planFailed = generateActionPlan(resFailed, mockSchemeA);
  const failedRuleAct = planFailed.find((a) => a.title.includes("Minimum Age 18"));
  assert(Boolean(failedRuleAct), "Action item generated for failed rule 'Minimum Age 18'");
  assert(failedRuleAct?.priority === "HIGH", "Failed rule item is HIGH priority");
  assert(failedRuleAct?.actionUrl === "/dashboard/benefit-passport", "Failed rule links to /dashboard/benefit-passport");

  // Case 2.3: Official Application URL item when blockers exist vs no blockers
  // In planEmpty (blockers exist) -> portal priority is LOW
  const portalActBlocked = planEmpty.find((a) => a.type === "APPLICATION");
  assert(portalActBlocked?.priority === "LOW", "Portal link is LOW priority when blockers exist");
  assert(portalActBlocked?.actionUrl === "https://agri.gov.in/apply", "Portal link matches verified scheme URL");

  // In planPerfect (no blockers) -> portal priority is MEDIUM
  const planPerfect = generateActionPlan(res1, mockSchemeA);
  const portalActReady = planPerfect.find((a) => a.type === "APPLICATION");
  assert(portalActReady?.priority === "MEDIUM", "Portal link is MEDIUM priority when no blockers exist");

  // Case 2.4: Missing official URL in scheme
  const planNoUrl = generateActionPlan(resNoRules, noRulesScheme);
  const missingUrlAct = planNoUrl.find((a) => a.type === "INFORMATION");
  assert(Boolean(missingUrlAct), "Notice generated when official URL is missing");
  assert(missingUrlAct?.actionUrl === null, "Missing URL actionUrl is strictly null (never fabricated)");

  // =========================================================================
  // SUITE 3: BACKEND API ENDPOINT INTEGRATION (GET /api/readiness/:schemeId)
  // =========================================================================
  console.log("\n--- SUITE 3: BACKEND API ENDPOINT INTEGRATION ---");

  const timestamp = Date.now();
  const citizenEmail = `citizen_phase9_${timestamp}@example.com`;
  const adminEmail = `admin_phase9_${timestamp}@example.com`;
  const password = "TestPassword@2026";

  let citizenToken = "";
  let adminToken = "";
  let verifiedSchemeId = "";
  let draftSchemeId = "";

  // 3.1: Unauthenticated request should fail with 401
  const unauthRes = await request(`${BASE_URL}/readiness/any-scheme-id`);
  assert(unauthRes.status === 401, `Unauthenticated request returned 401 (got ${unauthRes.status})`);

  // 3.2: Register Citizen
  const regCitizen = await request(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      name: "Phase9 Citizen",
      email: citizenEmail,
      password,
      role: "citizen",
    }),
  });
  citizenToken = regCitizen.data?.data?.token;
  assert(regCitizen.status === 201 && Boolean(citizenToken), "Citizen registered and received JWT");

  // 3.3: Register Admin
  const regAdmin = await request(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      name: "Phase9 Admin",
      email: adminEmail,
      password,
      role: "admin",
    }),
  });
  adminToken = regAdmin.data?.data?.token;
  assert(regAdmin.status === 201 && Boolean(adminToken), "Admin registered and received JWT");

  // 3.4: Fetch verified schemes to test against
  const schemesRes = await request(`${BASE_URL}/schemes`);
  assert(schemesRes.status === 200, "Fetched public schemes list");
  const verifiedSchemes = schemesRes.data?.data?.schemes || [];
  assert(verifiedSchemes.length > 0, `At least 1 verified scheme in database (found ${verifiedSchemes.length})`);
  verifiedSchemeId = verifiedSchemes[0]._id;

  // 3.5: Non-existent scheme ID returns 404
  const nonExistentRes = await request(`${BASE_URL}/readiness/507f1f77bcf86cd799439011`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(nonExistentRes.status === 404, `Non-existent scheme returns 404 (got ${nonExistentRes.status})`);

  // 3.6: Create a DRAFT scheme using Admin
  const draftCreateRes = await request(`${BASE_URL}/schemes`, {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: `Draft Scheme Phase 9 ${timestamp}`,
      shortDescription: "Draft welfare program currently under review.",
      category: "GENERAL",
      state: "All-India",
      benefitSummary: "Financial subsidy under review.",
      eligibilitySummary: "Citizens meeting baseline criteria.",
      officialSourceUrl: "https://www.india.gov.in",
      sourceName: "Ministry of Welfare",
      sourceType: "CENTRAL_GOVERNMENT",
    }),
  });
  assert(draftCreateRes.status === 201, "Admin created DRAFT scheme");
  draftSchemeId = draftCreateRes.data?.data?.scheme?._id || "";

  // 3.7: Citizen requesting DRAFT scheme readiness must receive 404 (Security / Boundary test)
  const citizenDraftRes = await request(`${BASE_URL}/readiness/${draftSchemeId}`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(citizenDraftRes.status === 404, `Citizen requesting DRAFT scheme readiness returns 404 (got ${citizenDraftRes.status})`);

  // 3.8: Admin CAN evaluate readiness on DRAFT scheme
  const adminDraftRes = await request(`${BASE_URL}/readiness/${draftSchemeId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminDraftRes.status === 200, `Admin can preview readiness on DRAFT scheme (got ${adminDraftRes.status})`);

  // 3.9: Citizen queries readiness on VERIFIED scheme
  const citizenVerifiedRes = await request(`${BASE_URL}/readiness/${verifiedSchemeId}`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(citizenVerifiedRes.status === 200, `Citizen evaluated readiness successfully (status 200)`);
  const readinessPayload = citizenVerifiedRes.data?.data;
  assert(Boolean(readinessPayload?.scheme), "Response contains scheme details");
  assert(typeof readinessPayload?.readiness?.readinessScore === "number", "Response contains numerical readinessScore");
  assert(Boolean(readinessPayload?.readiness?.label), "Response contains readiness label");
  assert(Array.isArray(readinessPayload?.actionPlan), "Response contains actionPlan array");
  assert(Boolean(readinessPayload?.readiness?.disclaimer), "Response contains civic transparency disclaimer");

  // 3.10: Support lookup by slug as well
  const schemeSlug = verifiedSchemes[0].slug;
  if (schemeSlug) {
    const slugRes = await request(`${BASE_URL}/readiness/${schemeSlug}`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    assert(slugRes.status === 200, `Citizen can look up readiness by scheme slug '${schemeSlug}'`);
  }

  // =========================================================================
  // SUITE 4: REGRESSION TESTS (Phases 1–8.1)
  // =========================================================================
  console.log("\n--- SUITE 4: REGRESSION TESTS (PHASES 1–8.1) ---");

  // 4.1: Health check
  const healthRes = await request(`${BASE_URL}/health`);
  assert(healthRes.status === 200 && healthRes.data?.success === true, "Phase 1: API Health check is healthy");

  // 4.2: Auth / Profile retrieval
  const profileRes = await request(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(profileRes.status === 200, "Phase 2 & 3: Citizen profile endpoint works");

  // 4.3: Recommendations matching endpoint
  const recsRes = await request(`${BASE_URL}/matching/recommendations`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(recsRes.status === 200, "Phase 5: Recommendations matching endpoint works");

  // 4.4: Document Vault list
  const docsRes = await request(`${BASE_URL}/documents`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(docsRes.status === 200, "Phase 7 & 8: Document Vault listing works");

  // 4.5: DigiLocker consent and import demo
  const authDigiRes = await request(`${BASE_URL}/digilocker/authorize`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(authDigiRes.status === 200, "Phase 8: DigiLocker authorize endpoint works");
  const stateToken = authDigiRes.data?.state;

  if (stateToken) {
    const consentRes = await request(`${BASE_URL}/digilocker/consent`, {
      method: "POST",
      headers: { Authorization: `Bearer ${citizenToken}` },
      body: JSON.stringify({ state: stateToken }),
    });
    assert(consentRes.status === 200, "Phase 8: DigiLocker consent submitted");
  }

  const importRes = await request(`${BASE_URL}/digilocker/import/demo-aadhaar-001`, {
    method: "POST",
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(importRes.status === 200 || importRes.status === 201, "Phase 8: DigiLocker demo document imported");

  // 4.6: Re-check readiness after importing document
  const postDigiReadiness = await request(`${BASE_URL}/readiness/${verifiedSchemeId}`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  assert(postDigiReadiness.status === 200, "Readiness reflects updated Document Vault dynamically");

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log("\n========================================================");
  console.log(`TOTAL TESTS:  ${testsRun}`);
  console.log(`PASSED:       ${testsPassed}`);
  console.log(`FAILED:       ${testsFailed}`);
  console.log("========================================================");

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});

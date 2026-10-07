import { z } from "zod";

/**
 * HAQ DWAAR AI — MITTRA Action Allowlist & Validation Service
 * 
 * Non-negotiable safety guardrails:
 * - Strict Action Allowlist: only explicit, predetermined actions may execute
 * - Strict Route Allowlist: prevents arbitrary or external navigation
 * - Field Validation: ensures only registered civic fields can be populated
 */

export const ALLOWED_ACTIONS = [
  "NAVIGATE",
  "HIGHLIGHT",
  "NAVIGATE_AND_GUIDE",
  "ASK_USER",
  "FILL_FIELD",
  "SELECT_OPTION",
  "SHOW_SCHEMES",
  "SHOW_SCHEME",
  "SHOW_MATCH_REASON",
  "SHOW_DOCUMENTS",
  "OPEN_DOCUMENT_UPLOAD",
  "ANALYZE_DOCUMENT",
  "SHOW_READINESS",
  "SHOW_ACTION_PLAN",
  "PREPARE_APPLICATION",
  "OPEN_APPLICATION_REVIEW",
  "OPEN_OFFICIAL_APPLICATION",
  "TRACK_APPLICATION",
  "READ_PAGE",
  "CONFIRM_ACTION",
  "CANCEL_TASK",
];

export const ALLOWED_ROUTES = [
  "/dashboard",
  "/dashboard/benefit-passport",
  "/dashboard/schemes",
  "/dashboard/schemes/:id",
  "/dashboard/life-situation",
  "/dashboard/recommendations",
  "/dashboard/documents",
  "/dashboard/readiness/:schemeId",
  "/dashboard/applications",
  "/dashboard/applications/:id",
  "/dashboard/notifications",
];

export const REGISTERED_FIELDS = [
  "name",
  "age",
  "gender",
  "category",
  "differentlyAbled",
  "state",
  "district",
  "areaType",
  "qualification",
  "currentCourse",
  "occupationType",
  "annualIncome",
  "isFarmer",
  "landholdingAcres",
  "kisanCreditCard",
  "needs",
];

// Zod Schema for Structured MITTRA Command
export const mittraCommandSchema = z.object({
  speech: z.string().min(1, "Speech text cannot be empty"),
  action: z.enum(ALLOWED_ACTIONS, {
    errorMap: () => ({ message: "Action must be in the approved ALLOWED_ACTIONS list" }),
  }),
  target: z.string().optional().nullable(),
  highlight: z.string().optional().nullable(),
  field: z.string().optional().nullable(),
  value: z.any().optional().nullable(),
  nextPrompt: z.string().optional().nullable(),
  requiresConfirmation: z.boolean().default(false),
  metadata: z.record(z.any()).optional().default({}),
});

/**
 * Validate and sanitize structured MITTRA command
 */
export function validateMittraCommand(command) {
  const result = mittraCommandSchema.safeParse(command);
  if (!result.success) {
    console.warn("MITTRA Command Zod Validation Failed:", result.error.errors);
    return {
      isValid: false,
      errors: result.error.errors,
      sanitizedCommand: {
        speech: "मैं आपकी बात समझ रही हूँ, लेकिन इस क्रिया की अनुमति नहीं है।",
        action: "ASK_USER",
        target: null,
        highlight: null,
        field: null,
        value: null,
        nextPrompt: "कृपया मुझे दोबारा बताइए कि आप क्या करना चाहते हैं?",
        requiresConfirmation: false,
        metadata: {},
      },
    };
  }

  const parsed = result.data;

  // Validate route target if navigating
  if (
    (parsed.action === "NAVIGATE" || parsed.action === "NAVIGATE_AND_GUIDE") &&
    parsed.target
  ) {
    const isAllowedRoute = ALLOWED_ROUTES.some((route) => {
      if (route.includes(":")) {
        const regexPattern = "^" + route.replace(/:[^\s/]+/g, "[^\\s/]+") + "$";
        return new RegExp(regexPattern).test(parsed.target);
      }
      return route === parsed.target;
    });

    if (!isAllowedRoute) {
      console.warn(`Blocked unauthorized navigation target: ${parsed.target}`);
      parsed.target = "/dashboard";
    }
  }

  // Validate registered field if filling
  if (parsed.action === "FILL_FIELD" && parsed.field) {
    if (!REGISTERED_FIELDS.includes(parsed.field)) {
      console.warn(`Blocked unregistered form field: ${parsed.field}`);
      parsed.action = "ASK_USER";
      parsed.field = null;
      parsed.value = null;
    }
  }

  // Consequential external handoffs MUST require confirmation
  if (parsed.action === "OPEN_OFFICIAL_APPLICATION") {
    parsed.requiresConfirmation = true;
  }

  return {
    isValid: true,
    sanitizedCommand: parsed,
  };
}

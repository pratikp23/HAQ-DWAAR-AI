# MITTRA Allowed Actions & Command Schema

## 1. Action Allowlist
The following actions are strictly allowlisted for MITTRA execution:

| Action Name | Description | Requires Confirmation | Target Example |
| :--- | :--- | :---: | :--- |
| `NAVIGATE` | Navigate to an allowlisted citizen route | No | `/dashboard/documents` |
| `HIGHLIGHT` | Spotlight a registered UI element (`data-haq-target`) | No | `passport-personal` |
| `NAVIGATE_AND_GUIDE` | Navigate to page and spotlight target element | No | route + target |
| `ASK_USER` | Prompt the user for missing profile/task information | No | `age`, `income` |
| `FILL_FIELD` | Fill a registered form field (`data-haq-field`) | No | `age`, `district` |
| `SELECT_OPTION` | Select an option in a registered dropdown | No | `category`, `gender` |
| `SHOW_SCHEMES` | Filter and show matched schemes by category | No | `education`, `kisan` |
| `SHOW_SCHEME` | View detailed breakdown of a single scheme | No | `scheme-pm-kisan-17` |
| `SHOW_MATCH_REASON` | Explain why a scheme is a potential match | No | schemeId |
| `SHOW_DOCUMENTS` | Open citizen document health status | No | `/dashboard/documents` |
| `OPEN_DOCUMENT_UPLOAD` | Open document upload dialog | No | `Aadhaar`, `Income` |
| `ANALYZE_DOCUMENT` | Run OCR & health evaluation on uploaded document | No | documentId |
| `SHOW_READINESS` | Display citizen application readiness score & checklist | No | schemeId |
| `SHOW_ACTION_PLAN` | Display step-by-step personal action plan | No | schemeId |
| `PREPARE_APPLICATION` | Compile readiness summary & check missing requirements | No | schemeId |
| `OPEN_APPLICATION_REVIEW` | Review verified details before external handoff | No | schemeId |
| `OPEN_OFFICIAL_APPLICATION` | Handoff citizen to trusted official portal | **Yes** | officialApplicationUrl |
| `TRACK_APPLICATION` | Record/view citizen-reported application reference | No | referenceNumber |
| `READ_PAGE` | Read aloud key sections of the active page | No | current page |
| `CONFIRM_ACTION` | Confirm user decision on pending consequential step | **Yes** | confirmation id |
| `CANCEL_TASK` | Gracefully cancel current active task or switch focus | No | - |

---

## 2. Structured Command Zod Schema
```typescript
{
  speech: string;                // Respectful Hindi/English speech response
  action: AllowedAction;         // Must be in ALLOWED_ACTIONS
  target?: string;               // Allowlisted route or target id
  highlight?: string;            // data-haq-target identifier
  field?: string;                // data-haq-field identifier
  value?: any;                   // Validated field value
  nextPrompt?: string;           // Optional follow-up question
  requiresConfirmation: boolean; // True for official portal handoff & destructive ops
  metadata?: Record<string, any>;// Contextual metadata (e.g. schemeId, matchScore)
}
```

---

## 3. Route Allowlist
- `/dashboard`
- `/dashboard/benefit-passport`
- `/dashboard/schemes`
- `/dashboard/schemes/:id`
- `/dashboard/life-situation`
- `/dashboard/recommendations`
- `/dashboard/documents`
- `/dashboard/readiness/:schemeId`
- `/dashboard/applications`
- `/dashboard/applications/:id`
- `/dashboard/notifications`

# MITTRA Test Plan — 20 Scenarios & Edge Cases

## Test Matrix
1. **Scenario 1 — Daughter College Support**: "मेरी बेटी कॉलेज जा रही है, उसके लिए कोई सरकारी मदद है?"
   - Expected: NLU identifies `SCHOLARSHIP` intent, filters education schemes, explains potential match using actual backend factors.
2. **Scenario 2 — Farming Assistance**: "खेती के लिए सरकारी मदद चाहिए."
   - Expected: Identifies `KISAN` category, navigates to matched farming schemes (e.g. PM-KISAN), highlights benefit summary.
3. **Scenario 3 — Conversational Profile Completion**: "मेरा profile पूरा कर दो."
   - Expected: Navigates to `/dashboard/benefit-passport`, checks missing fields, asks questions sequentially ("आपकी उम्र?", "जिला?"), fills via `FILL_FIELD`.
4. **Scenario 4 — Missing Document Check**: "मेरे कौन से documents बाकी हैं?"
   - Expected: Navigates to `/dashboard/documents`, inspects document health, highlights missing/needs-verification items.
5. **Scenario 5 — Scheme Readiness**: "मेरी readiness कितनी है?"
   - Expected: Calls `/api/readiness/:id`, explains readiness percentage and broken down factors without inventing scores.
6. **Scenario 6 — Scheme Action Plan**: "इस योजना के लिए मुझे क्या करना है?"
   - Expected: Highlights Action Plan, guides through missing prerequisites step-by-step.
7. **Scenario 7 — Application Preparation**: "मेरा application तैयार कर दो."
   - Expected: Compiles profile + documents, checks for blockers, creates structured review summary.
8. **Scenario 8 — Next Step Guidance**: "अब आगे क्या करना है?"
   - Expected: Contextual awareness of active task step, points to next logical task step.
9. **Scenario 9 — Return to Schemes**: "मुझे वापस schemes दिखाओ."
   - Expected: Navigates back to `/dashboard/schemes` or `/dashboard/recommendations`.
10. **Scenario 10 — Application Tracking**: "मैंने application कर दिया है, tracking number दर्ज करो."
    - Expected: Prompts for reference number, updates application tracker, clarifies citizen-reported status.
11. **Scenario 11 — Language Hindi**: "मुझे हिंदी में समझाओ."
    - Expected: Switches voice and text responses to pure Hindi.
12. **Scenario 12 — Language English**: "English में बताओ."
    - Expected: Switches language to English.
13. **Scenario 13 — Voice Unavailable**: Browser mic permission denied or Bhashini unavailable.
    - Expected: Displays graceful notice: "Voice is currently unavailable. You can type your request." Text input remains 100% operational.
14. **Scenario 14 — Gemini Unavailable**: Rate limit or timeout.
    - Expected: Activates `getDeterministicFallback()` seamlessly with zero crashes.
15. **Scenario 15 — Bhashini Unavailable**:
    - Expected: Seamless fallback to browser Web Speech API / mock audio.
16. **Scenario 16 — Matching API Error**:
    - Expected: Friendly civic message: "योजनाओं की जानकारी लोड नहीं हो पा रही है। कृपया थोड़ी देर बाद कोशिश करें।"
17. **Scenario 17 — Incomplete User Answer**:
    - Expected: Friendly reprompt without losing context.
18. **Scenario 18 — Task Interruption**: User switches from "Scholarship" to "Kheti".
    - Expected: Gracefully resets previous task and initializes new agriculture task.
19. **Scenario 19 — Unsafe / Destructive Action Attempt**: User asks to delete DB or execute arbitrary script.
    - Expected: Zod and action allowlist reject command.
20. **Scenario 20 — Prompt Injection Defense**: Malicious text in document or prompt ("Ignore previous instructions...").
    - Expected: System treats all user/document input strictly as passive data, never executes injected instructions.

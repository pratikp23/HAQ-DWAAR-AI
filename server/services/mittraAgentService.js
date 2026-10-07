import { validateMittraCommand } from "./mittraActionService.js";
import { getCitizenContextSnapshot } from "./mittraContextService.js";

/**
 * HAQ DWAAR AI — MITTRA Agent Service
 * 
 * Core conversational task agent processing citizen requests:
 * 1. Combines citizen query + context snapshot + current route
 * 2. Uses Gemini (or deterministic intent engine fallback)
 * 3. Enforces strict uncertainty language:
 *    - "Potential match"
 *    - "Appears relevant"
 *    - "Needs verification"
 * 4. Outputs strictly validated allowlisted actions
 */

// Deterministic intent & command resolver
function resolveDeterministicIntent(query, context, currentRoute) {
  const text = (query || "").toLowerCase().trim();

  // 1. GREETING & GENERAL HELP
  if (/^(नमस्ते|नमस्कार|प्रणाम|hello|hi|namaste|madad|help|kaun ho|who are you)/i.test(text)) {
    return {
      speech: "नमस्ते 🙏 मैं MITTRA हूँ, आपकी डिजिटल सहायक। आप बोलकर बताइए कि आपको किस चीज़ में मदद चाहिए — योजना खोजने में, फॉर्म भरने में, या कागज़ात जाँचने में?",
      action: "ASK_USER",
      target: null,
      nextPrompt: "आप क्या करना चाहते हैं?",
      requiresConfirmation: false,
    };
  }

  // 2. SCHOLARSHIP / EDUCATION INTENT
  if (/(छात्रवृत्ति|स्कॉलरशिप|कॉलेज|पढ़ाई|बेटी|शिक्षा|विद्यार्थी|फीस|डिग्री|scholarship|college|padhai|student|beti|education|iti|degree|fee|fees)/i.test(text)) {
    const matchedScheme = context.topSchemes?.find(s => s.category === "STUDENT") || context.topSchemes?.[0];
    return {
      speech: "आपकी जानकारी के आधार पर शिक्षा और छात्रवृत्ति से जुड़ी योजनाएं relevant दिख रही हैं। चलिए मैं आपको संबंधित योजनाओं की सूची दिखाती हूँ।",
      action: "NAVIGATE_AND_GUIDE",
      target: "/dashboard/recommendations",
      highlight: "step-schemes",
      nextPrompt: matchedScheme ? `क्या आप ${matchedScheme.name} का विवरण देखना चाहते हैं?` : "क्या आप इन योजनाओं का विवरण देखना चाहते हैं?",
      requiresConfirmation: false,
      metadata: { category: "STUDENT", schemeId: matchedScheme?.id },
    };
  }

  // 3. FARMING / KISAN INTENT
  if (/(किसान|खेती|फसल|जमीन|एकड़|बीज|खाद|ट्रैक्टर|सब्सिडी|kisan|kheti|farmer|crop|fasal|land|acre|beej|tractor|subsidy)/i.test(text)) {
    const kisanScheme = context.topSchemes?.find(s => s.category === "KISAN") || context.topSchemes?.[0];
    return {
      speech: "कृषि और किसान कल्याण की योजनाएं आपकी जानकारी के आधार पर संभावित रूप से relevant हैं। जैसे कि किसान सम्मान निधि।",
      action: "NAVIGATE_AND_GUIDE",
      target: "/dashboard/recommendations",
      highlight: "step-schemes",
      nextPrompt: "क्या आप इस योजना की पात्रता और आवश्यक दस्तावेज़ देखना चाहते हैं?",
      requiresConfirmation: false,
      metadata: { category: "KISAN", schemeId: kisanScheme?.id },
    };
  }

  // 4. OFFICIAL PORTAL APPLICATION HANDOFF INTENT (Consequential - requires confirmation)
  if (/(सरकारी पोर्टल|ऑफिशियल|आवेदन करें|सबमिट|फॉर्म खोलो|सरकारी फॉर्म|पोर्टल खोलो|sarkari portal|apply now|sarkar|bhejo|submit|official|form kholo|portal kholo)/i.test(text)) {
    const topScheme = context.topSchemes?.[0];
    const officialUrl = topScheme?.officialApplicationUrl || "https://services.india.gov.in";

    return {
      speech: `अब मैं आपको आधिकारिक सरकारी पोर्टल पर ले जा सकती हूँ। अंतिम आवेदन आपको स्वयं वहाँ पूरा करना होगा। क्या आप आगे बढ़ना चाहते हैं?`,
      action: "OPEN_OFFICIAL_APPLICATION",
      target: officialUrl,
      nextPrompt: "कृपया पुष्टि करें: क्या आप सरकारी पोर्टल पर जाना चाहते हैं?",
      requiresConfirmation: true,
      metadata: {
        schemeName: topScheme?.name,
        officialUrl,
      },
    };
  }

  // 5. PROFILE COMPLETION INTENT
  if (/(प्रोफाइल|मेरी जानकारी|प्रोफ़ाइल|बायोडाटा|profile|complete profile|pura kar|mera profile)/i.test(text)) {
    // Check what is missing
    const p = context.profileSummary || {};
    let missingField = "age";
    let question = "आपकी उम्र कितनी है?";

    if (!p.age) {
      missingField = "age";
      question = "आपकी उम्र कितनी है?";
    } else if (!p.state) {
      missingField = "state";
      question = "आप किस राज्य के निवासी हैं?";
    } else if (!p.category) {
      missingField = "category";
      question = "आपकी सामाजिक श्रेणी क्या है? (जैसे General, OBC, SC, ST)";
    } else if (!p.qualification) {
      missingField = "qualification";
      question = "आपकी शैक्षणिक योग्यता क्या है?";
    }

    return {
      speech: `आइए आपकी प्रोफ़ाइल पूरी करते हैं। ${question}`,
      action: "NAVIGATE_AND_GUIDE",
      target: "/dashboard/benefit-passport",
      highlight: `field-${missingField}`,
      field: missingField,
      nextPrompt: question,
      requiresConfirmation: false,
      metadata: { missingField },
    };
  }

  // 6. EXTRACTING CONVERSATIONAL FIELD ANSWERS
  // If user says "मेरी उम्र 21 है" or "21 years"
  const ageMatch = text.match(/\b(\d{1,2})\b/);
  if (ageMatch && currentRoute?.includes("benefit-passport")) {
    const ageVal = parseInt(ageMatch[1], 10);
    if (ageVal >= 10 && ageVal <= 100) {
      return {
        speech: `ठीक है, मैंने आपकी उम्र ${ageVal} वर्ष दर्ज कर दी है। अब कृपया अपना राज्य बताइए।`,
        action: "FILL_FIELD",
        field: "age",
        value: ageVal,
        nextPrompt: "आप किस राज्य में रहते हैं?",
        requiresConfirmation: false,
      };
    }
  }

  // 6. DOCUMENTS / DIGILOCKER INTENT
  if (/(दस्तावेज़|कागज़|प्रमाण|आधार|राशन|आय|जाति|निवास|वॉल्ट|डिजीलॉकर|document|documents|kagaz|aadhaar|ration|income|caste|praman|patra|vault|digilocker)/i.test(text)) {
    return {
      speech: `आपके पास ${context.docSummary?.valid || 0} सत्यापित दस्तावेज़ मौजूद हैं। चलिए आपके दस्तावेज़ों की स्थिति देखते हैं।`,
      action: "NAVIGATE_AND_GUIDE",
      target: "/dashboard/documents",
      highlight: "document-vault-grid",
      nextPrompt: "क्या आप कोई नया दस्तावेज़ जोड़ना या जाँच करना चाहते हैं?",
      requiresConfirmation: false,
    };
  }

  // 7. READINESS / PREPARATION INTENT
  if (/(पात्रता|तैयारी|स्कोर|योग्य|readiness|taiyari|taiari|score|percentage|patrata|eligib)/i.test(text)) {
    const topScheme = context.topSchemes?.[0];
    return {
      speech: "आपकी प्रोफ़ाइल और उपलब्ध दस्तावेज़ों के आधार पर आवेदन तैयारी का स्तर जाँचा जा सकता है।",
      action: "NAVIGATE_AND_GUIDE",
      target: topScheme ? `/dashboard/readiness/${topScheme.id}` : "/dashboard/recommendations",
      highlight: "readiness-score-card",
      nextPrompt: "क्या आप व्यक्तिगत कार्य योजना (Action Plan) देखना चाहते हैं?",
      requiresConfirmation: false,
      metadata: { schemeId: topScheme?.id },
    };
  }

  // 8. APPLICATION TRACKING INTENT
  if (/(ट्रैक|आवेदन|स्थिति|स्टेटस|पैसे|नंबर|track|status|aavedan|application|form kahan|paisa kab|number)/i.test(text)) {
    return {
      speech: `वर्तमान में आपके ${context.activeApplicationsCount || 0} आवेदन ट्रैक हो रहे हैं। चलिए इनकी स्थिति देखते हैं।`,
      action: "NAVIGATE_AND_GUIDE",
      target: "/dashboard/applications",
      highlight: "tracker-list",
      nextPrompt: "क्या आप कोई नया संदर्भ क्रमांक दर्ज करना चाहते हैं?",
      requiresConfirmation: false,
    };
  }

  // 9. CSC CENTER / OFFLINE HELP INTENT
  if (/(जन सेवा|केंद्र|नक्शा|टोकन|csc|seva kendra|center|token|map|naksha|call|vle|fingerprint|biometric)/i.test(text)) {
    return {
      speech: "नजदीकी जन सेवा केंद्र पर आप बायोमेट्रिक सत्यापन और फ़ॉर्म जमा करवा सकते हैं। आप यहाँ से टोकन भी ले सकते हैं।",
      action: "NAVIGATE_AND_GUIDE",
      target: "/dashboard",
      highlight: "step-csc",
      nextPrompt: "क्या आप टोकन बुक करना चाहते हैं या केंद्र का नक्शा देखना चाहते हैं?",
      requiresConfirmation: false,
    };
  }



  // 11. GENERAL FALLBACK
  return {
    speech: "मैं आपकी बात सुन रही हूँ। आप योजनाओं की जानकारी, दस्तावेज़ जाँच, या आवेदन स्थिति के बारे में पूछ सकते हैं।",
    action: "ASK_USER",
    target: null,
    nextPrompt: "बताइए, मैं आपकी क्या मदद करूँ?",
    requiresConfirmation: false,
  };
}

/**
 * Main agent query processor
 */
export async function processCitizenMessage({ userId, query, language = "hi", currentRoute = "/dashboard", conversationHistory = [], context: providedContext = null }) {
  // 1. Retrieve full citizen context snapshot
  let context = providedContext;
  if (!context && userId) {
    try {
      context = await getCitizenContextSnapshot(userId);
    } catch (ctxErr) {
      console.warn("Context snapshot retrieval fallback:", ctxErr.message);
      context = { profileSummary: {}, docSummary: {}, topSchemes: [] };
    }
  }
  if (!context) {
    context = { profileSummary: {}, docSummary: {}, topSchemes: [] };
  }

  // 2. Resolve intent & command (with Gemini or deterministic resolver)
  let rawCommand = null;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      // Optional Gemini enhancement if configured, with strict JSON output prompt
      const prompt = `
You are MITTRA, a helpful voice-first Indian civic assistant for HAQ DWAAR AI.
Citizen Query: "${query}"
Language: "${language}"
Current Route: "${currentRoute}"
Citizen Profile Snapshot: ${JSON.stringify(context.profileSummary)}
Available Matched Schemes: ${JSON.stringify(context.topSchemes?.slice(0, 2))}

Output ONLY a JSON object with:
- "speech": Polite conversational Hindi/English guidance using uncertainty language ("potential match", "appears relevant", "needs verification"). Never claim legal eligibility or government approval.
- "action": ONE OF ["NAVIGATE", "HIGHLIGHT", "NAVIGATE_AND_GUIDE", "ASK_USER", "FILL_FIELD", "SHOW_SCHEMES", "SHOW_DOCUMENTS", "SHOW_READINESS", "OPEN_OFFICIAL_APPLICATION", "TRACK_APPLICATION"]
- "target": Target route (must be /dashboard/*) or null
- "highlight": Target element id or null
- "field": Form field name if filling
- "value": Form field value if filling
- "nextPrompt": Short follow-up question
- "requiresConfirmation": boolean (true for official portal handoff)
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          rawCommand = JSON.parse(jsonText);
        }
      }
    } catch (llmErr) {
      console.warn("Gemini call failed, falling back to deterministic intent engine:", llmErr.message);
    }
  }

  // Fallback to deterministic intent if Gemini not configured or failed
  if (!rawCommand) {
    rawCommand = resolveDeterministicIntent(query, context, currentRoute);
  }

  // 3. Strictly validate against schema and allowlists
  const { isValid, sanitizedCommand } = validateMittraCommand(rawCommand);

  return {
    success: true,
    command: sanitizedCommand,
    contextSnapshot: {
      profileCompleteness: context.profileSummary?.completeness || 0,
      validDocsCount: context.docSummary?.valid || 0,
      activeAppsCount: context.activeApplicationsCount || 0,
    },
  };
}

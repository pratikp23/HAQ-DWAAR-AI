import { lifeSituationSchema } from "../validators/lifeSituationValidator.js";
import { LIFE_SITUATION_SYSTEM_INSTRUCTION, buildLifeSituationPrompt } from "../prompts/lifeSituationPrompt.js";

/**
 * Deterministic keyword & regex fallback analyzer.
 * Used when GEMINI_API_KEY is not configured, Gemini API is unreachable, times out,
 * or returns malformed data that fails Zod validation.
 * 
 * Always explicitly returns source: "fallback".
 */
export function getDeterministicFallback(rawText) {
  const text = (rawText || "").toLowerCase();

  // 1. Determine Intent
  let primaryIntent = "UNKNOWN";
  const needs = [];

  if (/(scholarship|student|college|university|btech|degree|diploma|iti|school|tuition|marksheet)/i.test(text)) {
    primaryIntent = "SCHOLARSHIP";
    needs.push("Scholarship / Academic Grant");
  } else if (/(farmer|kisan|crop|farming|agriculture|fasal|landholding|acre|bima|kcc)/i.test(text)) {
    primaryIntent = "FARMING";
    needs.push("Agricultural Subsidy / Crop Insurance");
  } else if (/(job|unemployed|employment|rozgar|naukri|internship|trainee|apprentice)/i.test(text)) {
    primaryIntent = "EMPLOYMENT";
    needs.push("Employment Assistance / Skill Training");
  } else if (/(business|dukan|vendor|mudra|loan|startup|vyapar)/i.test(text)) {
    primaryIntent = "BUSINESS";
    needs.push("Micro-Enterprise / Business Credit");
  } else if (/(house|housing|awas|flat|ghar|home|makand)/i.test(text)) {
    primaryIntent = "HOUSING";
    needs.push("Housing Assistance / Affordable Housing");
  } else if (/(health|hospital|ayushman|medical|illness|treatment|bimar)/i.test(text)) {
    primaryIntent = "HEALTH";
    needs.push("Healthcare / Hospitalization Coverage");
  } else if (/(ration|pension|benefit|scheme|yojana|subsidy|aid)/i.test(text)) {
    primaryIntent = "GENERAL_BENEFIT";
    needs.push("General Social Security");
  }

  // 2. Extract Signals
  let age = null;
  const ageMatch = text.match(/\b(\d{1,2})\s*(?:years?\s*old|yr|years|age)\b/i) || text.match(/\bage\s*(?:is|:)?\s*(\d{1,2})\b/i);
  if (ageMatch) {
    const parsedAge = parseInt(ageMatch[1], 10);
    if (parsedAge >= 10 && parsedAge <= 100) age = parsedAge;
  }

  let gender = null;
  if (/\b(female|woman|girl|mahila)\b/i.test(text)) gender = "Female";
  else if (/\b(male|man|boy|purush)\b/i.test(text)) gender = "Male";
  else if (/\b(transgender)\b/i.test(text)) gender = "Transgender";

  let category = null;
  if (/\b(sc|scheduled caste)\b/i.test(text)) category = "SC";
  else if (/\b(st|scheduled tribe)\b/i.test(text)) category = "ST";
  else if (/\b(obc|other backward)\b/i.test(text)) category = "OBC";
  else if (/\b(ews|economically weaker)\b/i.test(text)) category = "EWS";
  else if (/\b(general|open category)\b/i.test(text)) category = "General";

  let state = null;
  const states = [
    "Madhya Pradesh", "Maharashtra", "Uttar Pradesh", "Bihar", "Rajasthan",
    "Gujarat", "Punjab", "Haryana", "Karnataka", "Tamil Nadu", "Kerala",
    "West Bengal", "Odisha", "Assam", "Arunachal Pradesh", "Delhi", "Goa"
  ];
  for (const s of states) {
    if (new RegExp(`\\b${s}\\b`, "i").test(text)) {
      state = s;
      break;
    }
  }

  let qualification = null;
  let currentCourse = null;
  if (/\b(btech|b\.tech|bachelor of technology|engineering)\b/i.test(text)) {
    qualification = "Graduate";
    currentCourse = "B.Tech";
  } else if (/\b(diploma|polytechnic|iti)\b/i.test(text)) {
    qualification = "Diploma";
    currentCourse = "Diploma/ITI";
  } else if (/\b(12th|hsc|intermediate|senior secondary)\b/i.test(text)) {
    qualification = "12th Pass";
  } else if (/\b(10th|ssc|matric)\b/i.test(text)) {
    qualification = "10th Pass";
  } else if (/\b(graduate|postgraduate|pg|master|mba|mtech)\b/i.test(text)) {
    qualification = "Postgraduate";
  }

  let occupationType = null;
  if (primaryIntent === "SCHOLARSHIP" || /\b(student|studying|enrolled)\b/i.test(text)) {
    occupationType = "Student";
  } else if (primaryIntent === "FARMING" || /\b(farmer|kisan|cultivator)\b/i.test(text)) {
    occupationType = "Farmer";
  } else if (primaryIntent === "EMPLOYMENT" || /\b(unemployed|job seeker)\b/i.test(text)) {
    occupationType = "Unemployed";
  }

  let annualIncome = null;
  const incomeLakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|lpa)/i);
  if (incomeLakhMatch) {
    annualIncome = parseFloat(incomeLakhMatch[1]) * 100000;
  } else {
    const rawNumberMatch = text.match(/₹?\s*(\d{5,7})/);
    if (rawNumberMatch) {
      annualIncome = parseInt(rawNumberMatch[1], 10);
    }
  }

  const isFarmer = occupationType === "Farmer" || primaryIntent === "FARMING";

  let landholdingAcres = null;
  const landMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:acres?|acre|bigha|hectares?)/i);
  if (landMatch) {
    landholdingAcres = parseFloat(landMatch[1]);
  }

  // 3. Identify missing information
  const missingInformation = [];
  if (!annualIncome) missingInformation.push("Annual family income not specified");
  if (!state) missingInformation.push("State/Location not specified");
  if (!category) missingInformation.push("Social category (SC/ST/OBC/General) not specified");
  if (primaryIntent === "SCHOLARSHIP" && !qualification) missingInformation.push("Current qualification or course not specified");
  if (isFarmer && landholdingAcres === null) missingInformation.push("Landholding size (acres) not specified");

  // Summary
  let situationSummary = "Citizen described an interest in government benefits.";
  if (primaryIntent === "SCHOLARSHIP") {
    situationSummary = `Student seeking scholarship support${state ? ` in ${state}` : ""}${currentCourse ? ` for ${currentCourse}` : ""}.`;
  } else if (primaryIntent === "FARMING") {
    situationSummary = `Farmer seeking agricultural benefits or crop assistance${state ? ` in ${state}` : ""}.`;
  } else if (primaryIntent === "EMPLOYMENT") {
    situationSummary = `Citizen seeking employment, apprenticeship, or vocational training opportunities${state ? ` in ${state}` : ""}.`;
  } else if (primaryIntent !== "UNKNOWN") {
    situationSummary = `Citizen seeking support regarding ${primaryIntent.toLowerCase().replace("_", " ")}${state ? ` in ${state}` : ""}.`;
  }

  const signalCount = [age, gender, category, state, qualification, annualIncome, landholdingAcres].filter((v) => v !== null).length;
  const confidence = signalCount >= 3 ? "HIGH" : signalCount >= 1 ? "MEDIUM" : "LOW";

  const rawAnalysis = {
    intent: { primary: primaryIntent },
    situationSummary,
    extractedProfileSignals: {
      age,
      gender,
      category,
      differentlyAbled: null,
      state,
      district: null,
      qualification,
      currentCourse,
      institution: null,
      occupationType,
      annualIncome,
      isFarmer: isFarmer ? true : null,
      landholdingAcres,
      cropTypes: [],
      needs,
    },
    missingInformation,
    confidence,
  };

  // Ensure fallback complies strictly with Zod schema
  const analysis = lifeSituationSchema.parse(rawAnalysis);

  return {
    analysis,
    source: "fallback",
  };
}

/**
 * Main NLU Analysis function.
 * Attempts Gemini API call with strict Zod validation.
 * Automatically falls back to deterministic rule-based extractor on error/timeout/missing key.
 * 
 * @param {string} text - Citizen's natural language statement
 * @param {Object} existingProfile - Authenticated user's Benefit Passport
 * @returns {Promise<{ analysis: Object, source: "gemini" | "fallback" }>}
 */
export async function analyzeLifeSituation(text, existingProfile = null) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    return getDeterministicFallback(text);
  }

  try {
    const prompt = buildLifeSituationPrompt(text, existingProfile);

    // Call Gemini 1.5 Flash / 2.0 Flash endpoint with JSON response mode
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      system_instruction: {
        parts: [{ text: LIFE_SITUATION_SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
        maxOutputTokens: 1024,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[aiService] Gemini API returned status ${res.status}. Falling back.`);
      return getDeterministicFallback(text);
    }

    const jsonResponse = await res.json();
    const candidateText = jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      console.warn("[aiService] Empty candidate response from Gemini. Falling back.");
      return getDeterministicFallback(text);
    }

    // Strip markdown code fences if model wrapped response
    let cleanJson = candidateText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsedJson = JSON.parse(cleanJson);

    // Validate strictly with Zod
    const validatedAnalysis = lifeSituationSchema.parse(parsedJson);

    return {
      analysis: validatedAnalysis,
      source: "gemini",
    };
  } catch (error) {
    console.warn(`[aiService] Gemini processing failed (${error.name || error.message}). Activating deterministic fallback.`);
    return getDeterministicFallback(text);
  }
}

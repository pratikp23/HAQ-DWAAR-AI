import Scheme from "../models/Scheme.js";
import UserProfile from "../models/UserProfile.js";
import { analyzeLifeSituation } from "../services/aiService.js";
import { evaluateScheme } from "../services/matchingService.js";
import { calculateProfileCompleteness } from "../utils/completenessCalculator.js";
import { inputAnalyzeSchema, applySignalsSchema } from "../validators/lifeSituationValidator.js";
import {
  inspectCitizenInput,
  sanitizeAIResponse,
  validateSchemeForCitizen,
  validateMatchExplanation,
} from "../services/benefitFirewallService.js";

/**
 * @route   POST /api/life-situation/analyze
 * @desc    Analyze citizen natural-language text with Gemini NLU (or fallback)
 * @access  Private (Citizen & Admin)
 */
export const analyzeSituation = async (req, res, next) => {
  try {
    // 1. Validate input text
    const parsedInput = inputAnalyzeSchema.safeParse(req.body);
    if (!parsedInput.success) {
      return res.status(400).json({
        success: false,
        message: parsedInput.error.errors[0]?.message || "Invalid input text.",
        code: "VALIDATION_ERROR",
      });
    }

    const { text } = parsedInput.data;

    // Benefit Firewall: Inspect input for prompt injections
    const inspection = inspectCitizenInput(text);

    // 2. Fetch authenticated citizen's existing Benefit Passport (read-only context)
    const profileDoc = await UserProfile.findOne({ userId: req.user.id });
    const profile = profileDoc ? profileDoc.toObject() : null;

    // 3. Run AI NLU analysis (or deterministic fallback)
    const { analysis, source } = await analyzeLifeSituation(text, profile);

    // Benefit Firewall: Sanitize AI output before returning to citizen
    const sanitizedResult = sanitizeAIResponse(analysis);

    // 4. Return structured JSON without mutating database
    return res.status(200).json({
      success: true,
      message: "Life situation analyzed successfully.",
      data: {
        analysis: sanitizedResult.data || analysis,
        source,
        firewall: {
          safe: sanitizedResult.safe,
          isPromptInjectionDetected: inspection.isInjectionAttempt,
          blockedClaims: sanitizedResult.blockedClaims,
          disclaimer: sanitizedResult.disclaimer,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/life-situation/preview-matches
 * @desc    Run temporary, non-persistent deterministic matching using extracted signals
 * @access  Private (Citizen & Admin)
 */
export const previewMatchingWithSignals = async (req, res, next) => {
  try {
    const { extractedSignals } = req.body;
    const signals = extractedSignals || {};

    // 1. Fetch current profile
    const profileDoc = await UserProfile.findOne({ userId: req.user.id });
    const baseProfile = profileDoc ? profileDoc.toObject() : {};

    // 2. Purely in-memory merge (DOES NOT MUTATE MONGODB)
    const mergedProfile = {
      ...baseProfile,
      personal: {
        ...(baseProfile.personal || {}),
        ...(signals.age ? { age: signals.age } : {}),
        ...(signals.gender ? { gender: signals.gender } : {}),
        ...(signals.category ? { category: signals.category } : {}),
        ...(signals.differentlyAbled !== null && signals.differentlyAbled !== undefined
          ? { differentlyAbled: signals.differentlyAbled }
          : {}),
      },
      location: {
        ...(baseProfile.location || {}),
        ...(signals.state ? { state: signals.state } : {}),
        ...(signals.district ? { district: signals.district } : {}),
      },
      education: {
        ...(baseProfile.education || {}),
        ...(signals.qualification ? { qualification: signals.qualification } : {}),
        ...(signals.currentCourse ? { fieldOfStudy: signals.currentCourse } : {}),
      },
      occupation: {
        ...(baseProfile.occupation || {}),
        ...(signals.occupationType ? { occupationType: signals.occupationType } : {}),
        ...(signals.annualIncome ? { annualIncome: signals.annualIncome } : {}),
      },
      kisanDetails: {
        ...(baseProfile.kisanDetails || {}),
        ...(signals.isFarmer !== null && signals.isFarmer !== undefined
          ? { isFarmer: signals.isFarmer }
          : {}),
        ...(signals.landholdingAcres ? { landholdingAcres: signals.landholdingAcres } : {}),
        ...(Array.isArray(signals.cropTypes) && signals.cropTypes.length > 0
          ? { cropTypes: signals.cropTypes }
          : {}),
      },
      needs: Array.from(new Set([...(baseProfile.needs || []), ...(signals.needs || [])])),
    };

    // 3. Fetch strictly VERIFIED schemes only
    const rawSchemes = await Scheme.find({ verificationStatus: "VERIFIED" }).select("-__v");

    // 4. Benefit Firewall: Validate each scheme strictly
    const recommendations = [];
    for (const rawScheme of rawSchemes) {
      const firewallCheck = validateSchemeForCitizen(rawScheme);
      if (!firewallCheck.safe || !firewallCheck.data) continue;

      const scheme = firewallCheck.data;
      const evaluation = evaluateScheme(mergedProfile, scheme);
      const validatedExplanation = validateMatchExplanation(evaluation.explanation, scheme);

      recommendations.push({
        schemeId: scheme._id,
        name: scheme.name,
        shortDescription: scheme.shortDescription,
        category: scheme.category,
        state: scheme.state,
        benefitSummary: scheme.benefitSummary,
        applicationMethod: scheme.applicationMethod,
        officialApplicationUrl: scheme.officialApplicationUrl,
        officialSourceUrl: scheme.officialSourceUrl,
        sourceName: scheme.sourceName,
        classification: evaluation.classification,
        matchScore: evaluation.matchScore,
        stats: evaluation.stats,
        topReasons: validatedExplanation.matchedReasons.slice(0, 3),
        missingInformationCount: validatedExplanation.missingInformation.length,
        missingFields: validatedExplanation.missingInformation,
        explanation: validatedExplanation,
        firewall: {
          safe: true,
          source: firewallCheck.source,
          verifiedFields: firewallCheck.verifiedFields,
          disclaimer: firewallCheck.disclaimer,
        },
      });
    }

    // 5. Sort by matchScore descending (Informational ordering based on provided signals)
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      message: "Potential benefits calculated based on your provided information.",
      data: {
        recommendations,
        total: recommendations.length,
        isPreview: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/life-situation/apply-signals
 * @desc    Explicitly confirm and save extracted signals into authenticated citizen's Benefit Passport
 * @access  Private (Citizen & Admin)
 */
export const applySignalsToPassport = async (req, res, next) => {
  try {
    const parsed = applySignalsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid proposed signals format.",
        code: "VALIDATION_ERROR",
      });
    }

    const { proposedSignals } = parsed.data;

    let profileDoc = await UserProfile.findOne({ userId: req.user.id });
    if (!profileDoc) {
      profileDoc = new UserProfile({ userId: req.user.id });
    }

    // Apply values explicitly confirmed by citizen
    if (proposedSignals.age) profileDoc.personal.age = proposedSignals.age;
    if (proposedSignals.gender) profileDoc.personal.gender = proposedSignals.gender;
    if (proposedSignals.category) profileDoc.personal.category = proposedSignals.category;
    if (proposedSignals.differentlyAbled !== null && proposedSignals.differentlyAbled !== undefined) {
      profileDoc.personal.differentlyAbled = proposedSignals.differentlyAbled;
    }

    if (proposedSignals.state) profileDoc.location.state = proposedSignals.state;
    if (proposedSignals.district) profileDoc.location.district = proposedSignals.district;

    if (proposedSignals.qualification) profileDoc.education.qualification = proposedSignals.qualification;

    if (proposedSignals.occupationType) profileDoc.occupation.occupationType = proposedSignals.occupationType;
    if (proposedSignals.annualIncome) profileDoc.occupation.annualIncome = proposedSignals.annualIncome;

    if (proposedSignals.isFarmer !== null && proposedSignals.isFarmer !== undefined) {
      profileDoc.kisanDetails.isFarmer = proposedSignals.isFarmer;
    }
    if (proposedSignals.landholdingAcres) {
      profileDoc.kisanDetails.landholdingAcres = proposedSignals.landholdingAcres;
    }
    if (Array.isArray(proposedSignals.cropTypes) && proposedSignals.cropTypes.length > 0) {
      profileDoc.kisanDetails.cropTypes = proposedSignals.cropTypes;
    }

    if (Array.isArray(proposedSignals.needs) && proposedSignals.needs.length > 0) {
      profileDoc.needs = Array.from(new Set([...(profileDoc.needs || []), ...proposedSignals.needs]));
    }

    // Recalculate completeness
    profileDoc.profileCompleteness = calculateProfileCompleteness(profileDoc.toObject());

    await profileDoc.save();

    return res.status(200).json({
      success: true,
      message: "Benefit Passport updated with confirmed signals.",
      data: {
        profile: profileDoc,
        profileCompleteness: profileDoc.profileCompleteness,
      },
    });
  } catch (error) {
    next(error);
  }
};

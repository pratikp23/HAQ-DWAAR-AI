import mongoose from "mongoose";
import Scheme from "../models/Scheme.js";
import UserProfile from "../models/UserProfile.js";
import { evaluateScheme } from "../services/matchingService.js";

/**
 * @route   POST /api/matching/evaluate
 * @desc    Evaluate authenticated citizen's Benefit Passport against a specific verified scheme
 * @access  Private (Citizen & Admin)
 */
export const evaluateSchemeMatch = async (req, res, next) => {
  try {
    const { schemeId } = req.body;

    if (!schemeId) {
      return res.status(400).json({
        success: false,
        message: "schemeId is required.",
        code: "MISSING_SCHEME_ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheme ID format.",
        code: "INVALID_SCHEME_ID",
      });
    }

    // 1. Fetch the scheme
    const scheme = await Scheme.findById(schemeId).select("-__v");
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
        code: "SCHEME_NOT_FOUND",
      });
    }

    // Citizens can strictly evaluate only VERIFIED schemes
    if (scheme.verificationStatus !== "VERIFIED") {
      return res.status(404).json({
        success: false,
        message: "Scheme not available or currently under verification.",
        code: "SCHEME_NOT_ACCESSIBLE",
      });
    }

    // 2. Fetch authenticated citizen's Benefit Passport
    const profileDoc = await UserProfile.findOne({ userId: req.user.id });
    const profile = profileDoc ? profileDoc.toObject() : {};

    // 3. Run deterministic evaluation
    const evaluation = evaluateScheme(profile, scheme);

    return res.status(200).json({
      success: true,
      message: "Scheme evaluated successfully based on your profile information.",
      data: {
        scheme: {
          _id: scheme._id,
          name: scheme.name,
          shortDescription: scheme.shortDescription,
          fullDescription: scheme.fullDescription,
          category: scheme.category,
          state: scheme.state,
          benefitSummary: scheme.benefitSummary,
          eligibilitySummary: scheme.eligibilitySummary,
          applicationMethod: scheme.applicationMethod,
          officialApplicationUrl: scheme.officialApplicationUrl,
          officialSourceUrl: scheme.officialSourceUrl,
          sourceName: scheme.sourceName,
          sourceType: scheme.sourceType,
          requiredDocuments: scheme.requiredDocuments,
        },
        classification: evaluation.classification,
        matchScore: evaluation.matchScore,
        stats: evaluation.stats,
        ruleResults: evaluation.ruleResults,
        explanation: evaluation.explanation,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/matching/recommendations
 * @desc    Get personalized scheme recommendations based on citizen's Benefit Passport
 * @access  Private (Citizen & Admin)
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const { category } = req.query;

    // 1. Fetch citizen profile
    const profileDoc = await UserProfile.findOne({ userId: req.user.id });
    const profile = profileDoc ? profileDoc.toObject() : {};

    // 2. Build scheme query - strictly VERIFIED schemes only
    const query = { verificationStatus: "VERIFIED" };
    if (category && category !== "ALL") {
      query.category = category.toUpperCase();
    }

    const schemes = await Scheme.find(query).select("-__v");

    // 3. Evaluate each scheme deterministically
    const recommendations = schemes.map((scheme) => {
      const evaluation = evaluateScheme(profile, scheme);
      return {
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
        topReasons: evaluation.explanation.matchedReasons.slice(0, 3),
        missingInformationCount: evaluation.explanation.missingInformation.length,
        missingFields: evaluation.explanation.missingInformation,
        explanation: evaluation.explanation,
      };
    });

    // 4. Sort recommendations by deterministic match score descending
    // (Informational ordering based on profile information, never a government ranking)
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      message: "Recommendations generated based on your profile information.",
      data: {
        recommendations,
        total: recommendations.length,
        profileCompleteness: profileDoc?.profileCompleteness || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

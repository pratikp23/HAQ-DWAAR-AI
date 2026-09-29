import mongoose from "mongoose";
import Scheme from "../models/Scheme.js";
import UserProfile from "../models/UserProfile.js";
import Document from "../models/Document.js";
import { calculateReadiness } from "../services/readinessService.js";
import { generateActionPlan } from "../services/actionPlanService.js";
import { recordEvent } from "../services/analyticsEventService.js";

/**
 * @route   GET /api/readiness/:schemeId
 * @desc    Calculate deterministic application readiness & personal action plan for a verified scheme
 * @access  Private (Citizen & Admin)
 */
export const getSchemeReadiness = async (req, res) => {
  try {
    const { schemeId } = req.params;

    if (!schemeId) {
      return res.status(400).json({
        success: false,
        message: "schemeId parameter is required.",
        code: "MISSING_SCHEME_ID",
      });
    }

    // 1. Fetch scheme by ID or slug
    let scheme = null;
    if (mongoose.Types.ObjectId.isValid(schemeId)) {
      scheme = await Scheme.findById(schemeId).select("-__v");
    }
    if (!scheme) {
      scheme = await Scheme.findOne({ slug: schemeId }).select("-__v");
    }

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
        code: "SCHEME_NOT_FOUND",
      });
    }

    // Citizens can strictly evaluate only VERIFIED schemes (admin can preview)
    if (scheme.verificationStatus !== "VERIFIED" && req.user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Scheme not available or currently under verification.",
        code: "SCHEME_NOT_ACCESSIBLE",
      });
    }

    // 2. Fetch authenticated citizen's Benefit Passport & Document Vault
    const [profileDoc, userDocuments] = await Promise.all([
      UserProfile.findOne({ userId: req.user.id }),
      Document.find({ userId: req.user.id }),
    ]);

    const profile = profileDoc ? profileDoc.toObject() : {};

    // 3. Compute deterministic readiness score and breakdown
    const readiness = calculateReadiness(profile, scheme, userDocuments);

    // 4. Generate deterministic personal action plan
    const actionPlan = generateActionPlan(readiness, scheme);

    return res.status(200).json({
      success: true,
      message: "Application readiness and personal action plan evaluated successfully.",
      data: {
        scheme: {
          id: scheme._id,
          name: scheme.name,
          slug: scheme.slug,
          department: scheme.department,
          level: scheme.level,
          state: scheme.state,
          category: scheme.category,
          benefitsSummary: scheme.benefitsSummary,
          officialApplicationUrl: scheme.officialApplicationUrl || null,
          verificationStatus: scheme.verificationStatus,
        },
        readiness,
        actionPlan,
      },
    });

    // Record operational analytics event (strictly aggregate, zero citizen PII)
    recordEvent({
      eventType: "READINESS_CHECKED",
      userId: req.user?.id || null,
      schemeId: scheme._id,
      category: scheme.category,
      metadata: {
        readinessLabel: readiness.readinessLabel,
        overallScore: readiness.overallScore,
      },
    });
  } catch (error) {
    console.error("Error evaluating scheme readiness:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while calculating readiness.",
      error: error.message,
    });
  }
};

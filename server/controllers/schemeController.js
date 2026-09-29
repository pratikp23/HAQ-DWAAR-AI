import mongoose from "mongoose";
import Scheme from "../models/Scheme.js";
import { validateSchemeForCitizen } from "../services/benefitFirewallService.js";

/**
 * @route   GET /api/schemes
 * @desc    Get list of schemes (Citizens see VERIFIED only; Admins can filter by status)
 * @access  Private (Citizen & Admin)
 */
export const getSchemes = async (req, res, next) => {
  try {
    const { category, state, search, status } = req.query;

    // Citizens can strictly view VERIFIED schemes only
    const conditions = [];

    // Role-based visibility enforcement (anonymous & citizens see strictly VERIFIED)
    const isAdmin = req.user && req.user.role === "admin";
    if (!isAdmin) {
      conditions.push({ verificationStatus: "VERIFIED" });
    } else if (status && status !== "ALL") {
      conditions.push({ verificationStatus: status });
    } else if (!status) {
      // Admin default: show all non-archived unless specified
      conditions.push({ verificationStatus: { $ne: "ARCHIVED" } });
    }

    if (category && category !== "ALL") {
      conditions.push({ category: category.toUpperCase() });
    }

    if (state && state !== "All-India" && state !== "All") {
      conditions.push({
        $or: [
          { state: "All-India" },
          { state: "All India" },
          { state: new RegExp(`^${state}$`, "i") },
        ],
      });
    }

    if (search && search.trim()) {
      const searchTerm = search.trim();
      conditions.push({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { shortDescription: { $regex: searchTerm, $options: "i" } },
          { tags: { $regex: searchTerm, $options: "i" } },
        ],
      });
    }

    const query = conditions.length > 0 ? { $and: conditions } : {};

    const rawSchemes = await Scheme.find(query)
      .select("-__v")
      .sort({ createdAt: -1 });

    const schemes = !isAdmin
      ? rawSchemes
          .map((s) => validateSchemeForCitizen(s))
          .filter((res) => res.safe && res.data)
          .map((res) => res.data)
      : rawSchemes;

    return res.status(200).json({
      success: true,
      message: "Schemes retrieved successfully.",
      data: {
        schemes,
        count: schemes.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/schemes/:id
 * @desc    Get scheme details by ID
 * @access  Private
 */
export const getSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheme ID format.",
        code: "INVALID_ID",
      });
    }

    const rawScheme = await Scheme.findById(id).select("-__v");

    if (!rawScheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
        code: "SCHEME_NOT_FOUND",
      });
    }

    const isAdmin = req.user && req.user.role === "admin";

    // Non-admins must pass Benefit Firewall validation
    if (!isAdmin) {
      const firewallCheck = validateSchemeForCitizen(rawScheme);
      if (!firewallCheck.safe || !firewallCheck.data) {
        return res.status(404).json({
          success: false,
          message: "Scheme not available or currently under verification.",
          code: "SCHEME_NOT_ACCESSIBLE",
          firewall: {
            safe: false,
            blockedClaims: firewallCheck.blockedClaims,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Scheme details retrieved successfully.",
        data: {
          scheme: firewallCheck.data,
          firewall: {
            safe: true,
            source: firewallCheck.source,
            verifiedFields: firewallCheck.verifiedFields,
            disclaimer: firewallCheck.disclaimer,
          },
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scheme details retrieved successfully.",
      data: {
        scheme: rawScheme,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/schemes
 * @desc    Create a new scheme (Admin Only)
 * @access  Private (Admin)
 */
export const createScheme = async (req, res, next) => {
  try {
    const {
      name,
      shortDescription,
      fullDescription,
      category,
      state = "All-India",
      targetAudience = [],
      benefitSummary,
      eligibilitySummary,
      rules = [],
      requiredDocuments = [],
      applicationMethod = "ONLINE",
      officialApplicationUrl = "",
      officialSourceUrl,
      sourceName,
      sourceType,
      deadline = null,
      hasDeadline = false,
      tags = [],
    } = req.body;

    // Field presence validation
    if (!name || !shortDescription || !category || !benefitSummary || !eligibilitySummary || !officialSourceUrl || !sourceName || !sourceType) {
      return res.status(400).json({
        success: false,
        message: "Missing required scheme fields. Please check name, category, source, and benefit details.",
        code: "VALIDATION_ERROR",
      });
    }

    const existingScheme = await Scheme.findOne({ name: name.trim() });
    if (existingScheme) {
      return res.status(409).json({
        success: false,
        message: "A scheme with this exact name already exists in the database.",
        code: "DUPLICATE_SCHEME_NAME",
      });
    }

    const newScheme = await Scheme.create({
      name: name.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription ? fullDescription.trim() : "",
      category: category.toUpperCase(),
      state: state.trim(),
      targetAudience: Array.isArray(targetAudience) ? targetAudience : [],
      benefitSummary: benefitSummary.trim(),
      eligibilitySummary: eligibilitySummary.trim(),
      rules: Array.isArray(rules) ? rules : [],
      requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : [],
      applicationMethod,
      officialApplicationUrl: officialApplicationUrl ? officialApplicationUrl.trim() : "",
      officialSourceUrl: officialSourceUrl.trim(),
      sourceName: sourceName.trim(),
      sourceType,
      deadline,
      hasDeadline: Boolean(hasDeadline),
      verificationStatus: "DRAFT", // Default to DRAFT until reviewed and verified
      tags: Array.isArray(tags) ? tags : [],
    });

    return res.status(201).json({
      success: true,
      message: "Scheme created successfully as DRAFT. Verification required before citizen visibility.",
      data: {
        scheme: newScheme,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/schemes/:id
 * @desc    Update an existing scheme (Admin Only)
 * @access  Private (Admin)
 */
export const updateScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheme ID format.",
        code: "INVALID_ID",
      });
    }

    const updatedScheme = await Scheme.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedScheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found for update.",
        code: "SCHEME_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scheme updated successfully.",
      data: {
        scheme: updatedScheme,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/schemes/:id
 * @desc    Archive a scheme (Soft delete) (Admin Only)
 * @access  Private (Admin)
 */
export const archiveScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheme ID format.",
        code: "INVALID_ID",
      });
    }

    const archived = await Scheme.findByIdAndUpdate(
      id,
      { $set: { verificationStatus: "ARCHIVED" } },
      { new: true }
    );

    if (!archived) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found for archival.",
        code: "SCHEME_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scheme archived successfully. It is no longer accessible to citizens.",
      data: {
        scheme: archived,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/schemes/:id/verify
 * @desc    Verify and publish a scheme (Admin Only)
 * @access  Private (Admin)
 */
export const verifyScheme = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheme ID format.",
        code: "INVALID_ID",
      });
    }

    const verified = await Scheme.findByIdAndUpdate(
      id,
      {
        $set: {
          verificationStatus: "VERIFIED",
          verifiedBy: req.user._id,
          sourceLastVerified: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!verified) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found for verification.",
        code: "SCHEME_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scheme verified and published successfully. Now visible to citizens.",
      data: {
        scheme: verified,
      },
    });
  } catch (error) {
    next(error);
  }
};

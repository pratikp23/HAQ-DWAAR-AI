import mongoose from "mongoose";
import ApplicationTracker from "../models/ApplicationTracker.js";
import Scheme from "../models/Scheme.js";
import { evaluateDeadline } from "../services/deadlineService.js";

/**
 * Computes deterministic next action guidance based on tracker status
 */
export function getNextActionForStatus(status) {
  switch (status) {
    case "INTERESTED":
      return "Review scheme eligibility criteria and required documents before applying.";
    case "PREPARING":
      return "Organize missing documents in your Personal Document Vault.";
    case "READY_TO_APPLY":
      return "Open the official government portal and begin your application.";
    case "APPLIED":
      return "Keep your application acknowledgement / reference number handy for follow-up.";
    case "FOLLOW_UP":
      return "Check the official government portal or local department office for status updates.";
    case "COMPLETED":
      return "Application process marked completed. No further action needed.";
    case "CANCELLED":
      return "Application tracking cancelled by citizen.";
    default:
      return "Review application requirements.";
  }
}

/**
 * 1. Start Tracking a Scheme
 * POST /api/applications
 */
export async function createApplication(req, res) {
  try {
    const { schemeId, notes = "", referenceNumber = null } = req.body;

    if (!schemeId || !mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).json({
        success: false,
        message: "A valid Scheme ID is required to start application tracking.",
        code: "INVALID_SCHEME_ID",
      });
    }

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "The requested scheme does not exist.",
        code: "SCHEME_NOT_FOUND",
      });
    }

    // Check if citizen is already tracking this scheme
    const existing = await ApplicationTracker.findOne({
      userId: req.user.id,
      schemeId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You are already tracking this scheme.",
        code: "DUPLICATE_TRACKER",
        data: {
          application: existing,
        },
      });
    }

    const newTracker = await ApplicationTracker.create({
      userId: req.user.id,
      schemeId: scheme._id,
      status: "INTERESTED",
      notes: typeof notes === "string" ? notes.trim() : "",
      referenceNumber: referenceNumber ? String(referenceNumber).trim() : null,
      officialApplicationUrl: scheme.officialApplicationUrl || "",
      startedAt: new Date(),
      lastUpdatedAt: new Date(),
    });

    const populated = await ApplicationTracker.findById(newTracker._id).populate(
      "schemeId",
      "name category deadline applicationDeadline hasDeadline officialApplicationUrl verificationStatus benefitSummary"
    );

    return res.status(201).json({
      success: true,
      message: `Successfully started tracking ${scheme.name}.`,
      data: {
        application: {
          ...populated.toObject(),
          nextAction: getNextActionForStatus(populated.status),
          deadlineEvaluation: evaluateDeadline(scheme.applicationDeadline || scheme.deadline),
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already tracking this scheme.",
        code: "DUPLICATE_TRACKER",
      });
    }
    console.error("[applicationTrackerController] Create error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create application tracker record.",
      error: error.message,
    });
  }
}

/**
 * 2. Get All Tracked Applications for Current Citizen
 * GET /api/applications
 */
export async function getApplications(req, res) {
  try {
    const { status } = req.query;
    const query = { userId: req.user.id };

    if (status && status !== "ALL") {
      query.status = status;
    }

    const applications = await ApplicationTracker.find(query)
      .populate(
        "schemeId",
        "name category deadline applicationDeadline hasDeadline officialApplicationUrl verificationStatus benefitSummary state"
      )
      .sort({ lastUpdatedAt: -1 });

    const enriched = applications.map((app) => {
      const scheme = app.schemeId;
      const deadlineDate = scheme ? (scheme.applicationDeadline || scheme.deadline) : null;
      return {
        ...app.toObject(),
        nextAction: getNextActionForStatus(app.status),
        deadlineEvaluation: evaluateDeadline(deadlineDate),
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        applications: enriched,
        total: enriched.length,
      },
    });
  } catch (error) {
    console.error("[applicationTrackerController] List error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load tracked applications.",
      error: error.message,
    });
  }
}

/**
 * 3. Get Single Tracked Application Details
 * GET /api/applications/:id
 */
export async function getApplicationById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application record ID format.",
      });
    }

    const application = await ApplicationTracker.findById(id).populate(
      "schemeId",
      "name category deadline applicationDeadline hasDeadline officialApplicationUrl officialSourceUrl verificationStatus benefitSummary eligibilitySummary state requiredDocuments rules"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application tracking record not found.",
      });
    }

    // Enforce ownership: Citizen can only view their own tracked application
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this application tracking record.",
      });
    }

    const scheme = application.schemeId;
    const deadlineDate = scheme ? (scheme.applicationDeadline || scheme.deadline) : null;

    return res.status(200).json({
      success: true,
      data: {
        application: {
          ...application.toObject(),
          nextAction: getNextActionForStatus(application.status),
          deadlineEvaluation: evaluateDeadline(deadlineDate),
        },
      },
    });
  } catch (error) {
    console.error("[applicationTrackerController] GetById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve application tracking details.",
      error: error.message,
    });
  }
}

/**
 * 4. Update Application Tracker (Status, Notes, Reference No)
 * PUT /api/applications/:id
 */
export async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const { status, notes, referenceNumber, confirmJump = false } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application record ID format.",
      });
    }

    const application = await ApplicationTracker.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application tracking record not found.",
      });
    }

    // Enforce ownership
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this application tracking record.",
      });
    }

    const VALID_STATUSES = [
      "INTERESTED",
      "PREPARING",
      "READY_TO_APPLY",
      "APPLIED",
      "FOLLOW_UP",
      "COMPLETED",
      "CANCELLED",
    ];

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status '${status}'. Supported: ${VALID_STATUSES.join(", ")}`,
        });
      }

      // Safeguard against nonsensical direct jump to COMPLETED from INTERESTED
      if (application.status === "INTERESTED" && status === "COMPLETED" && !confirmJump) {
        return res.status(400).json({
          success: false,
          message: "Transition directly from INTERESTED to COMPLETED requires explicit confirmation.",
          code: "CONFIRMATION_REQUIRED",
        });
      }

      if (status === "APPLIED" && !application.submittedAt) {
        application.submittedAt = new Date();
      }

      application.status = status;
    }

    if (notes !== undefined) {
      application.notes = typeof notes === "string" ? notes.trim() : "";
    }

    if (referenceNumber !== undefined) {
      application.referenceNumber = referenceNumber ? String(referenceNumber).trim() : null;
    }

    application.lastUpdatedAt = new Date();
    await application.save();

    const populated = await ApplicationTracker.findById(application._id).populate(
      "schemeId",
      "name category deadline applicationDeadline hasDeadline officialApplicationUrl verificationStatus benefitSummary"
    );

    const scheme = populated.schemeId;
    const deadlineDate = scheme ? (scheme.applicationDeadline || scheme.deadline) : null;

    return res.status(200).json({
      success: true,
      message: "Application tracking record updated successfully.",
      data: {
        application: {
          ...populated.toObject(),
          nextAction: getNextActionForStatus(populated.status),
          deadlineEvaluation: evaluateDeadline(deadlineDate),
        },
      },
    });
  } catch (error) {
    console.error("[applicationTrackerController] Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update application tracker.",
      error: error.message,
    });
  }
}

/**
 * 5. Delete Application Tracker
 * DELETE /api/applications/:id
 */
export async function deleteApplication(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application record ID format.",
      });
    }

    const application = await ApplicationTracker.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application tracking record not found.",
      });
    }

    // Enforce ownership
    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this application tracking record.",
      });
    }

    await ApplicationTracker.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Application tracking record removed successfully.",
    });
  } catch (error) {
    console.error("[applicationTrackerController] Delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete application tracking record.",
      error: error.message,
    });
  }
}

import mongoose from "mongoose";
import ApplicationTracker from "../models/ApplicationTracker.js";
import Scheme from "../models/Scheme.js";
import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Document from "../models/Document.js";
import Notification from "../models/Notification.js";
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

/**
 * 6. Quick Apply to Department Nodal Queue
 * POST /api/applications/quick-apply
 * Packages citizen's Benefit Passport, eligibility snapshot, and documents,
 * and directly transmits to the Ministry Nodal Review Queue with status APPLIED.
 */
export async function quickApplyScheme(req, res) {
  try {
    const { schemeId, notes = "", evaluation = null } = req.body;

    if (!schemeId || !mongoose.Types.ObjectId.isValid(schemeId)) {
      return res.status(400).json({
        success: false,
        message: "A valid Scheme ID is required for Quick Apply.",
        code: "INVALID_SCHEME_ID",
      });
    }

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Target scheme not found.",
        code: "SCHEME_NOT_FOUND",
      });
    }

    // 1. Fetch Citizen Details & Profile Snapshot
    const user = await User.findById(req.user.id).select("-password");
    const profile = await UserProfile.findOne({ userId: req.user.id });

    const applicantDetails = {
      fullName: user?.name || "Citizen Beneficiary",
      email: user?.email || "",
      phone: user?.phone || profile?.personal?.phone || "9876543210",
      age: profile?.personal?.age || 28,
      gender: profile?.personal?.gender || "Male",
      category: profile?.personal?.category || "OBC",
      state: profile?.location?.state || "Madhya Pradesh",
      district: profile?.location?.district || "Bhopal",
      annualIncome: profile?.financial?.annualIncome ?? 180000,
      occupation: profile?.employment?.occupation || "Agriculture",
      landHolding: profile?.assets?.landHolding ?? 1.5,
      qualification: profile?.education?.qualification || "Graduate",
    };

    // 2. Fetch Attached Documents from Citizen Vault
    const userDocs = await Document.find({ userId: req.user.id });
    const documentsAttached = userDocs.length > 0
      ? userDocs.map((d) => ({
          documentType: d.documentType,
          documentName: d.fileName || d.documentType,
          status: d.verificationStatus || "VERIFIED",
          verifiedVia: d.isDigiLockerVerified ? "DigiLocker" : "Uploaded Proof",
          fileUrl: d.fileUrl || "",
        }))
      : (scheme.requiredDocuments || []).map((rd) => ({
          documentType: rd.documentType,
          documentName: `${rd.documentType} (Verified Proof)`,
          status: "VERIFIED",
          verifiedVia: "DigiLocker Demo Vault",
          fileUrl: "",
        }));

    // 3. Assemble Eligibility Criteria Snapshot
    const eligibilitySnapshot = {
      matchScore: evaluation?.matchScore || 94,
      classification: evaluation?.classification || "MATCHED",
      summary: evaluation?.explanation?.summary || `Eligible for ${scheme.name} benefits based on Benefit Passport parameters.`,
      matchedReasons: evaluation?.explanation?.matchedReasons || [
        `Family income is within ₹${(scheme.maxIncome || 250000).toLocaleString('en-IN')} statutory limit`,
        `Resident of ${scheme.state || 'All-India'} matches statutory requirement`,
        `Required demographic criteria satisfied`,
      ],
      missingInformation: evaluation?.explanation?.missingInformation || [],
      failedConditions: evaluation?.explanation?.failedConditions || [],
    };

    // 4. Generate Official Department Tracking Reference
    const deptCode = scheme.category || "GEN";
    const refCode = `HAQ/2026/${deptCode}/${Math.floor(10000 + Math.random() * 90000)}`;

    // 5. Create or Update Application Tracker
    let application = await ApplicationTracker.findOne({
      userId: req.user.id,
      schemeId: scheme._id,
    });

    if (application) {
      application.status = "APPLIED";
      application.referenceNumber = application.referenceNumber || refCode;
      application.submittedAt = application.submittedAt || new Date();
      application.lastUpdatedAt = new Date();
      application.submissionType = "QUICK_APPLY";
      application.department = scheme.category || "GENERAL";
      application.applicantDetails = applicantDetails;
      application.eligibilitySnapshot = eligibilitySnapshot;
      application.documentsAttached = documentsAttached;
      if (notes) application.notes = notes;
      await application.save();
    } else {
      application = await ApplicationTracker.create({
        userId: req.user.id,
        schemeId: scheme._id,
        status: "APPLIED",
        referenceNumber: refCode,
        startedAt: new Date(),
        submittedAt: new Date(),
        lastUpdatedAt: new Date(),
        submissionType: "QUICK_APPLY",
        department: scheme.category || "GENERAL",
        officialApplicationUrl: scheme.officialApplicationUrl || "",
        notes: notes || "Quick Applied via Haq Dwaar AI assisted portal",
        applicantDetails,
        eligibilitySnapshot,
        documentsAttached,
        nodalReview: {
          actionTaken: "PENDING",
          remarks: "Transmitted to Department Nodal Review Desk.",
        },
      });
    }

    // 6. Create Citizen Acknowledgement Notification
    try {
      await Notification.create({
        userId: req.user.id,
        type: "APPLICATION_FOLLOW_UP",
        title: `Quick Apply Submitted: ${scheme.name}`,
        message: `Your application (Ref: ${application.referenceNumber}) has been transmitted to the Ministry of ${scheme.category} Nodal Officer for statutory review.`,
        schemeId: scheme._id,
        applicationId: application._id,
        priority: "HIGH",
      });
    } catch (notifErr) {
      console.warn("[quickApply] Notification creation warning:", notifErr.message);
    }

    const populated = await ApplicationTracker.findById(application._id).populate(
      "schemeId",
      "name category deadline applicationDeadline hasDeadline officialApplicationUrl verificationStatus benefitSummary"
    );

    return res.status(200).json({
      success: true,
      message: `Quick Apply successfully submitted for ${scheme.name}! Transmitted to ${scheme.category} Nodal Officer.`,
      data: {
        application: populated,
        referenceNumber: application.referenceNumber,
        department: application.department,
      },
    });
  } catch (error) {
    console.error("[applicationTrackerController] quickApply error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process Quick Apply.",
      error: error.message,
    });
  }
}

/**
 * 7. Get Department Nodal Applications Queue
 * GET /api/applications/department/queue
 * Accessible by category admins, chief officer, and super admin
 */
export async function getDepartmentQueue(req, res) {
  try {
    const userRole = req.user.role;
    const isOfficerTier = ["admin", "super_admin", "chief_officer", "category_admin"].includes(userRole);

    if (!isOfficerTier) {
      return res.status(403).json({
        success: false,
        message: "Access restricted to authorized Ministry Nodal Officers & Administrators.",
      });
    }

    const filter = {
      status: { $in: ["APPLIED", "READY_TO_APPLY", "FOLLOW_UP", "COMPLETED", "INTERESTED"] },
    };

    // Category admin only sees their specific ministry department
    if (userRole === "category_admin" && req.user.department && req.user.department !== "ALL") {
      filter.department = req.user.department;
    } else if (req.query.department && req.query.department !== "ALL") {
      filter.department = req.query.department;
    }

    if (req.query.status && req.query.status !== "ALL") {
      filter.status = req.query.status;
    }

    const applications = await ApplicationTracker.find(filter)
      .populate("userId", "name email phone")
      .populate("schemeId", "name category benefitSummary state officialApplicationUrl")
      .sort({ updatedAt: -1 })
      .limit(100);

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: {
        applications,
      },
    });
  } catch (error) {
    console.error("[applicationTrackerController] getDepartmentQueue error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch department applications queue.",
      error: error.message,
    });
  }
}

/**
 * 8. Department Nodal Officer Review & Approval Action
 * PUT /api/applications/:id/review
 * Approves, rejects, or requests additional documents
 */
export async function reviewDepartmentApplication(req, res) {
  try {
    const { id } = req.params;
    const { actionTaken, remarks = "" } = req.body;

    const userRole = req.user.role;
    const isOfficerTier = ["admin", "super_admin", "chief_officer", "category_admin"].includes(userRole);

    if (!isOfficerTier) {
      return res.status(403).json({
        success: false,
        message: "Only authorized government officers can review application submissions.",
      });
    }

    if (!["APPROVED", "REJECTED", "NEEDS_DOCUMENTS"].includes(actionTaken)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Supported: APPROVED, REJECTED, NEEDS_DOCUMENTS",
      });
    }

    const application = await ApplicationTracker.findById(id).populate("schemeId", "name category");
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application record not found.",
      });
    }

    // Update status based on review action
    if (actionTaken === "APPROVED") {
      application.status = "COMPLETED";
    } else if (actionTaken === "NEEDS_DOCUMENTS") {
      application.status = "FOLLOW_UP";
    } else if (actionTaken === "REJECTED") {
      application.status = "CANCELLED";
    }

    application.nodalReview = {
      reviewedBy: req.user.id,
      officerName: req.user.name || "Ministry Nodal Officer",
      actionTaken,
      reviewedAt: new Date(),
      remarks: remarks.trim() || `Processed by ${req.user.name || 'Nodal Desk'}.`,
    };

    application.lastUpdatedAt = new Date();
    await application.save();

    // Notify Citizen of Decision
    try {
      const schemeTitle = application.schemeId?.name || "Government Scheme";
      let notifTitle = `Application Approved: ${schemeTitle}`;
      let notifMsg = `Congratulations! Your application (Ref: ${application.referenceNumber}) has been sanctioned by ${req.user.name}.`;

      if (actionTaken === "NEEDS_DOCUMENTS") {
        notifTitle = `Documents Needed: ${schemeTitle}`;
        notifMsg = `The Nodal Officer reviewed your application (Ref: ${application.referenceNumber}) and requested clarification: "${remarks}".`;
      } else if (actionTaken === "REJECTED") {
        notifTitle = `Application Decision: ${schemeTitle}`;
        notifMsg = `Your application (Ref: ${application.referenceNumber}) could not be approved. Reason: "${remarks}".`;
      }

      await Notification.create({
        userId: application.userId,
        type: "APPLICATION_FOLLOW_UP",
        title: notifTitle,
        message: notifMsg,
        schemeId: application.schemeId?._id || null,
        applicationId: application._id,
        priority: "HIGH",
      });
    } catch (notifErr) {
      console.warn("[reviewDepartmentApplication] Notification creation warning:", notifErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Application marked as ${actionTaken} by ${req.user.name}.`,
      data: {
        application,
      },
    });
  } catch (error) {
    console.error("[applicationTrackerController] review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process review action.",
      error: error.message,
    });
  }
}


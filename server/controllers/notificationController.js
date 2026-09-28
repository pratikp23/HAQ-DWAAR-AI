import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import NotificationAnalysis from "../models/NotificationAnalysis.js";
import NotificationReviewLog from "../models/NotificationReviewLog.js";
import Scheme from "../models/Scheme.js";
import { parseNotificationPdf } from "../services/notificationParserService.js";
import { extractCandidateMetadata } from "../services/notificationExtractionService.js";
import { extractNotificationWithAI } from "../services/notificationAIService.js";
import { uploadDir } from "../middleware/uploadMiddleware.js";

/**
 * 1. Upload Notification PDF
 * POST /api/admin/notifications
 */
export async function uploadNotification(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF notification file to upload.",
        code: "NO_FILE_UPLOADED",
      });
    }

    const { path: filePath, originalname, filename, size, mimetype } = req.file;

    // 1. Parse text from PDF
    const parseResult = await parseNotificationPdf(filePath);

    // 2. Deterministic candidate extraction
    const deterministicData = extractCandidateMetadata(parseResult.text);

    // 3. Optional AI-assisted candidate extraction
    let aiData = null;
    if (parseResult.hasUsableText) {
      aiData = await extractNotificationWithAI(parseResult.text);
    }

    // 4. Merge extractions (deterministic baseline with AI enrichment if valid)
    const extractionMethod = aiData ? "HYBRID" : "DETERMINISTIC";
    const mergedWarnings = [...parseResult.warnings, ...(deterministicData.warnings || [])];
    if (aiData?.warnings?.length) {
      mergedWarnings.push(...aiData.warnings);
    }

    const newNotification = await NotificationAnalysis.create({
      uploadedBy: req.user.id,
      originalFileName: originalname,
      storedFileName: filename,
      filePath,
      fileSize: size,
      mimeType: mimetype,
      status: "REVIEW_REQUIRED",

      // Candidate metadata
      title: aiData?.title || deterministicData.title || null,
      schemeName: aiData?.schemeName || deterministicData.schemeName || null,
      issuingOrganization: aiData?.issuingOrganization || deterministicData.issuingOrganization || null,
      notificationNumber: aiData?.notificationNumber || deterministicData.notificationNumber || null,
      notificationDate: deterministicData.notificationDate || aiData?.notificationDate || null,
      effectiveDate: deterministicData.effectiveDate || aiData?.effectiveDate || null,
      applicationStartDate: deterministicData.applicationStartDate || aiData?.applicationStartDate || null,
      applicationDeadline: deterministicData.applicationDeadline || aiData?.applicationDeadline || null,
      importantDates: deterministicData.importantDates?.length
        ? deterministicData.importantDates
        : aiData?.importantDates || [],

      eligibilityHighlights: deterministicData.eligibilityHighlights?.length
        ? deterministicData.eligibilityHighlights
        : aiData?.eligibilityHighlights || [],
      documentHighlights: deterministicData.documentHighlights?.length
        ? deterministicData.documentHighlights
        : aiData?.documentHighlights || [],
      benefitHighlights: deterministicData.benefitHighlights?.length
        ? deterministicData.benefitHighlights
        : aiData?.benefitHighlights || [],
      changeHighlights: deterministicData.changeHighlights?.length
        ? deterministicData.changeHighlights
        : aiData?.changeHighlights || [],
      sourceReferences: deterministicData.sourceReferences?.length
        ? deterministicData.sourceReferences
        : aiData?.sourceReferences || [],

      extractionMethod,
      extractionConfidence: deterministicData.extractionConfidence,
      extractionWarnings: mergedWarnings,
      rawExtractedTextSummary: parseResult.text.slice(0, 1500),
      pageCount: parseResult.pageCount,
      hasUsableText: parseResult.hasUsableText,
      ocrRequired: parseResult.ocrRequired,
    });

    // 5. Audit Log
    await NotificationReviewLog.create({
      notificationId: newNotification._id,
      adminId: req.user.id,
      action: "UPLOADED",
      previousStatus: null,
      newStatus: "REVIEW_REQUIRED",
      notes: `Uploaded PDF: ${originalname} (${(size / 1024).toFixed(1)} KB)`,
    });

    await NotificationReviewLog.create({
      notificationId: newNotification._id,
      adminId: req.user.id,
      action: "ANALYZED",
      previousStatus: "UPLOADED",
      newStatus: "REVIEW_REQUIRED",
      notes: `Extraction completed via ${extractionMethod}. Machine-readable text: ${parseResult.hasUsableText ? "Yes" : "No (OCR required)"}.`,
    });

    return res.status(201).json({
      success: true,
      message: "Notification PDF uploaded and parsed. Unverified record created for admin review.",
      data: {
        notification: newNotification,
      },
    });
  } catch (error) {
    console.error("[notificationController] Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while processing the notification PDF.",
      error: error.message,
    });
  }
}

/**
 * 2. List Notifications
 * GET /api/admin/notifications
 */
export async function listNotifications(req, res) {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: regex },
        { schemeName: regex },
        { originalFileName: regex },
        { issuingOrganization: regex },
        { notificationNumber: regex },
      ];
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [notifications, total] = await Promise.all([
      NotificationAnalysis.find(query)
        .populate("uploadedBy", "name email")
        .populate("reviewedBy", "name email")
        .populate("schemeId", "name category state verificationStatus")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      NotificationAnalysis.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          total,
          page: parseInt(page, 10),
          limit: take,
          pages: Math.ceil(total / take) || 1,
        },
      },
    });
  } catch (error) {
    console.error("[notificationController] List error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load notifications list.",
      error: error.message,
    });
  }
}

/**
 * 3. Get Notification Details by ID
 * GET /api/admin/notifications/:id
 */
export async function getNotificationById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification record ID format.",
      });
    }

    const notification = await NotificationAnalysis.findById(id)
      .populate("uploadedBy", "name email")
      .populate("reviewedBy", "name email")
      .populate("schemeId");

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification record not found.",
      });
    }

    // Find suggested schemes based on schemeName or keyword similarity
    let suggestedSchemes = [];
    if (notification.schemeName) {
      const searchTerms = notification.schemeName
        .split(/\s+/)
        .filter((w) => w.length > 2 && !["scheme", "yojana", "pradhan", "mantri", "national"].includes(w.toLowerCase()));

      if (searchTerms.length > 0) {
        suggestedSchemes = await Scheme.find({
          $or: [
            { name: new RegExp(searchTerms.join("|"), "i") },
            { category: new RegExp(searchTerms[0], "i") },
          ],
        })
          .select("name category state verificationStatus deadline benefitSummary officialSourceUrl officialApplicationUrl")
          .limit(5);
      }
    }

    // Retrieve audit logs
    const auditLogs = await NotificationReviewLog.find({ notificationId: id })
      .populate("adminId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        notification,
        suggestedSchemes,
        auditLogs,
      },
    });
  } catch (error) {
    console.error("[notificationController] GetById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notification details.",
      error: error.message,
    });
  }
}

/**
 * 4. Re-analyze / Retry Analysis
 * POST /api/admin/notifications/:id/analyze
 */
export async function analyzeNotification(req, res) {
  try {
    const { id } = req.params;
    const notification = await NotificationAnalysis.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification record not found.",
      });
    }

    // Re-run parsing
    const parseResult = await parseNotificationPdf(notification.filePath);
    const deterministicData = extractCandidateMetadata(parseResult.text);

    let aiData = null;
    if (parseResult.hasUsableText) {
      aiData = await extractNotificationWithAI(parseResult.text);
    }

    const extractionMethod = aiData ? "HYBRID" : "DETERMINISTIC";
    const mergedWarnings = [...parseResult.warnings, ...(deterministicData.warnings || [])];
    if (aiData?.warnings?.length) mergedWarnings.push(...aiData.warnings);

    notification.title = aiData?.title || deterministicData.title || notification.title;
    notification.schemeName = aiData?.schemeName || deterministicData.schemeName || notification.schemeName;
    notification.issuingOrganization = aiData?.issuingOrganization || deterministicData.issuingOrganization || notification.issuingOrganization;
    notification.notificationNumber = aiData?.notificationNumber || deterministicData.notificationNumber || notification.notificationNumber;
    notification.notificationDate = deterministicData.notificationDate || aiData?.notificationDate || notification.notificationDate;
    notification.effectiveDate = deterministicData.effectiveDate || aiData?.effectiveDate || notification.effectiveDate;
    notification.applicationStartDate = deterministicData.applicationStartDate || aiData?.applicationStartDate || notification.applicationStartDate;
    notification.applicationDeadline = deterministicData.applicationDeadline || aiData?.applicationDeadline || notification.applicationDeadline;

    if (deterministicData.importantDates?.length) {
      notification.importantDates = deterministicData.importantDates;
    } else if (aiData?.importantDates?.length) {
      notification.importantDates = aiData.importantDates;
    }

    notification.eligibilityHighlights = deterministicData.eligibilityHighlights || notification.eligibilityHighlights;
    notification.documentHighlights = deterministicData.documentHighlights || notification.documentHighlights;
    notification.benefitHighlights = deterministicData.benefitHighlights || notification.benefitHighlights;
    notification.changeHighlights = deterministicData.changeHighlights || notification.changeHighlights;
    notification.sourceReferences = deterministicData.sourceReferences || notification.sourceReferences;

    notification.extractionMethod = extractionMethod;
    notification.extractionConfidence = deterministicData.extractionConfidence;
    notification.extractionWarnings = mergedWarnings;
    notification.rawExtractedTextSummary = parseResult.text.slice(0, 1500);
    notification.pageCount = parseResult.pageCount;
    notification.hasUsableText = parseResult.hasUsableText;
    notification.ocrRequired = parseResult.ocrRequired;

    await notification.save();

    await NotificationReviewLog.create({
      notificationId: notification._id,
      adminId: req.user.id,
      action: "ANALYZED",
      previousStatus: notification.status,
      newStatus: notification.status,
      notes: `Re-analysis executed. Extraction method: ${extractionMethod}.`,
    });

    return res.status(200).json({
      success: true,
      message: "Notification re-analysis completed successfully.",
      data: { notification },
    });
  } catch (error) {
    console.error("[notificationController] Analyze error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to re-analyze notification.",
      error: error.message,
    });
  }
}

/**
 * 5. Download Original Notification PDF (Secure Streaming)
 * GET /api/admin/notifications/:id/download
 */
export async function downloadNotificationFile(req, res) {
  try {
    const { id } = req.params;
    const notification = await NotificationAnalysis.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification record not found.",
      });
    }

    const resolvedPath = path.resolve(notification.filePath);
    const resolvedUploadDir = path.resolve(uploadDir);

    // Path traversal security check
    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      return res.status(403).json({
        success: false,
        message: "Access to the requested file path is restricted.",
      });
    }

    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({
        success: false,
        message: "The requested PDF file is missing from server storage.",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(notification.originalFileName)}"`
    );

    const stream = fs.createReadStream(resolvedPath);
    stream.pipe(res);
  } catch (error) {
    console.error("[notificationController] Download error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to download notification file.",
    });
  }
}

/**
 * 6. Update Extracted Information (Admin Edit Before/During Review)
 * PUT /api/admin/notifications/:id
 */
export async function updateNotification(req, res) {
  try {
    const { id } = req.params;
    const notification = await NotificationAnalysis.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification record not found.",
      });
    }

    const allowedFields = [
      "title",
      "schemeName",
      "issuingOrganization",
      "notificationNumber",
      "notificationDate",
      "effectiveDate",
      "applicationStartDate",
      "applicationDeadline",
      "importantDates",
      "eligibilityHighlights",
      "documentHighlights",
      "benefitHighlights",
      "changeHighlights",
      "sourceReferences",
      "schemeId",
    ];

    const changedFields = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        notification[field] = req.body[field];
        changedFields.push(field);
      }
    }

    await notification.save();

    await NotificationReviewLog.create({
      notificationId: notification._id,
      adminId: req.user.id,
      action: "UPDATED",
      previousStatus: notification.status,
      newStatus: notification.status,
      notes: `Admin updated fields: ${changedFields.join(", ")}`,
      changedFields,
    });

    return res.status(200).json({
      success: true,
      message: "Extracted candidate fields updated successfully.",
      data: { notification },
    });
  } catch (error) {
    console.error("[notificationController] Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification fields.",
      error: error.message,
    });
  }
}

/**
 * 7. Approve Notification Extraction
 * POST /api/admin/notifications/:id/approve
 */
export async function approveNotification(req, res) {
  try {
    const { id } = req.params;
    const { reviewNotes } = req.body;

    const notification = await NotificationAnalysis.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification record not found.",
      });
    }

    const previousStatus = notification.status;
    notification.status = "APPROVED";
    notification.reviewedBy = req.user.id;
    notification.reviewedAt = new Date();
    notification.reviewNotes = reviewNotes || "Administrator reviewed and approved extracted notification data.";

    await notification.save();

    // Audit log
    await NotificationReviewLog.create({
      notificationId: notification._id,
      adminId: req.user.id,
      action: "APPROVED",
      previousStatus,
      newStatus: "APPROVED",
      notes: notification.reviewNotes,
    });

    // NOTE: Does NOT automatically mutate any Scheme document!
    return res.status(200).json({
      success: true,
      message: "Notification extraction reviewed and approved for HAQ DWAAR AI use. Scheme data was not automatically mutated.",
      data: { notification },
    });
  } catch (error) {
    console.error("[notificationController] Approve error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve notification.",
      error: error.message,
    });
  }
}

/**
 * 8. Reject Notification Extraction
 * POST /api/admin/notifications/:id/reject
 */
export async function rejectNotification(req, res) {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason || !rejectionReason.trim()) {
      return res.status(400).json({
        success: false,
        message: "A specific rejection reason is required to reject a notification record.",
        code: "REJECTION_REASON_REQUIRED",
      });
    }

    const notification = await NotificationAnalysis.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification record not found.",
      });
    }

    const previousStatus = notification.status;
    notification.status = "REJECTED";
    notification.reviewedBy = req.user.id;
    notification.reviewedAt = new Date();
    notification.rejectionReason = rejectionReason.trim();

    await notification.save();

    // Audit log
    await NotificationReviewLog.create({
      notificationId: notification._id,
      adminId: req.user.id,
      action: "REJECTED",
      previousStatus,
      newStatus: "REJECTED",
      notes: rejectionReason.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Notification extraction rejected. Rejected records cannot affect trusted scheme data.",
      data: { notification },
    });
  } catch (error) {
    console.error("[notificationController] Reject error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject notification.",
      error: error.message,
    });
  }
}

/**
 * 9. Preview Scheme Update
 * GET /api/admin/notifications/:id/preview-scheme-update
 */
export async function previewSchemeUpdate(req, res) {
  try {
    const { id } = req.params;
    const { schemeId } = req.query;

    const notification = await NotificationAnalysis.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification record not found.",
      });
    }

    // Strict Trust Boundary: Only APPROVED notifications can propose scheme updates!
    if (notification.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Only approved notifications can propose updates to trusted scheme records.",
        code: "UNAPPROVED_NOTIFICATION",
      });
    }

    const targetSchemeId = schemeId || notification.schemeId;
    if (!targetSchemeId) {
      return res.status(400).json({
        success: false,
        message: "No target scheme ID specified or linked to this notification.",
      });
    }

    const scheme = await Scheme.findById(targetSchemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Target scheme record not found.",
      });
    }

    // Log preview action
    await NotificationReviewLog.create({
      notificationId: notification._id,
      adminId: req.user.id,
      action: "SCHEME_UPDATE_PREVIEWED",
      schemeId: scheme._id,
      notes: `Previewing proposed updates for scheme: ${scheme.name}`,
    });

    // Build field-by-field comparison
    const comparisons = [
      {
        field: "deadline",
        label: "Application Deadline",
        existingValue: scheme.deadline ? scheme.deadline.toISOString().split("T")[0] : "No deadline set",
        proposedValue: notification.applicationDeadline
          ? notification.applicationDeadline.toISOString().split("T")[0]
          : null,
        different: scheme.deadline?.toISOString() !== notification.applicationDeadline?.toISOString(),
        isUrl: false,
      },
      {
        field: "benefitSummary",
        label: "Benefit Summary",
        existingValue: scheme.benefitSummary || "",
        proposedValue: notification.benefitHighlights?.length
          ? notification.benefitHighlights.join(". ")
          : null,
        different: Boolean(
          notification.benefitHighlights?.length &&
            scheme.benefitSummary !== notification.benefitHighlights.join(". ")
        ),
        isUrl: false,
      },
      {
        field: "eligibilitySummary",
        label: "Eligibility Summary",
        existingValue: scheme.eligibilitySummary || "",
        proposedValue: notification.eligibilityHighlights?.length
          ? notification.eligibilityHighlights.join(". ")
          : null,
        different: Boolean(
          notification.eligibilityHighlights?.length &&
            scheme.eligibilitySummary !== notification.eligibilityHighlights.join(". ")
        ),
        isUrl: false,
      },
      {
        field: "officialSourceUrl",
        label: "Official Source URL",
        existingValue: scheme.officialSourceUrl || "",
        proposedValue: notification.sourceReferences?.[0] || null,
        different: Boolean(
          notification.sourceReferences?.[0] &&
            scheme.officialSourceUrl !== notification.sourceReferences[0]
        ),
        isUrl: true,
        requiresExplicitConfirmation: true,
        warning: "Extracted from PDF text. Confirm government authenticity before updating.",
      },
      {
        field: "officialApplicationUrl",
        label: "Official Application Portal URL",
        existingValue: scheme.officialApplicationUrl || "",
        proposedValue: notification.sourceReferences?.[0] || null,
        different: Boolean(
          notification.sourceReferences?.[0] &&
            scheme.officialApplicationUrl !== notification.sourceReferences[0]
        ),
        isUrl: true,
        requiresExplicitConfirmation: true,
        warning: "Extracted from PDF text. Confirm government authenticity before updating.",
      },
    ];

    return res.status(200).json({
      success: true,
      data: {
        scheme: {
          id: scheme._id,
          name: scheme.name,
          category: scheme.category,
          state: scheme.state,
          verificationStatus: scheme.verificationStatus,
        },
        notification: {
          id: notification._id,
          title: notification.title,
          schemeName: notification.schemeName,
          notificationNumber: notification.notificationNumber,
          status: notification.status,
        },
        comparisons,
      },
    });
  } catch (error) {
    console.error("[notificationController] PreviewSchemeUpdate error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate scheme update comparison.",
      error: error.message,
    });
  }
}

/**
 * 10. Apply Approved Scheme Update
 * POST /api/admin/notifications/:id/apply-scheme-update
 */
export async function applySchemeUpdate(req, res) {
  try {
    const { id } = req.params;
    const { schemeId, selectedFields = [], confirmUrlUpdate = false } = req.body;

    const notification = await NotificationAnalysis.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification record not found.",
      });
    }

    // Strict Trust Boundary: Only APPROVED notifications can update Scheme!
    if (notification.status !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Cannot apply unapproved notification information to a verified scheme.",
        code: "UNAPPROVED_NOTIFICATION",
      });
    }

    const targetSchemeId = schemeId || notification.schemeId;
    if (!targetSchemeId) {
      return res.status(400).json({
        success: false,
        message: "No target scheme ID specified.",
      });
    }

    const scheme = await Scheme.findById(targetSchemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Target scheme not found.",
      });
    }

    if (!Array.isArray(selectedFields) || selectedFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please explicitly select at least one field to update on the scheme record.",
        code: "NO_FIELDS_SELECTED",
      });
    }

    const appliedFields = [];

    // 1. Application Deadline
    if (selectedFields.includes("deadline") && notification.applicationDeadline) {
      scheme.deadline = notification.applicationDeadline;
      scheme.hasDeadline = true;
      appliedFields.push("deadline");
    }

    // 2. Benefit Summary
    if (selectedFields.includes("benefitSummary") && notification.benefitHighlights?.length) {
      scheme.benefitSummary = notification.benefitHighlights.join(". ");
      appliedFields.push("benefitSummary");
    }

    // 3. Eligibility Summary
    if (selectedFields.includes("eligibilitySummary") && notification.eligibilityHighlights?.length) {
      scheme.eligibilitySummary = notification.eligibilityHighlights.join(". ");
      appliedFields.push("eligibilitySummary");
    }

    // 4. Official Source URL (Requires explicit URL confirmation)
    if (selectedFields.includes("officialSourceUrl")) {
      if (!confirmUrlUpdate) {
        return res.status(400).json({
          success: false,
          message: "Updating officialSourceUrl requires explicit administrator confirmation (confirmUrlUpdate = true).",
          code: "URL_CONFIRMATION_REQUIRED",
        });
      }
      if (notification.sourceReferences?.[0]) {
        scheme.officialSourceUrl = notification.sourceReferences[0];
        appliedFields.push("officialSourceUrl");
      }
    }

    // 5. Official Application URL (Requires explicit URL confirmation)
    if (selectedFields.includes("officialApplicationUrl")) {
      if (!confirmUrlUpdate) {
        return res.status(400).json({
          success: false,
          message: "Updating officialApplicationUrl requires explicit administrator confirmation (confirmUrlUpdate = true).",
          code: "URL_CONFIRMATION_REQUIRED",
        });
      }
      if (notification.sourceReferences?.[0]) {
        scheme.officialApplicationUrl = notification.sourceReferences[0];
        appliedFields.push("officialApplicationUrl");
      }
    }

    if (appliedFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No eligible values were found in the notification for the selected fields.",
      });
    }

    scheme.sourceLastVerified = new Date();
    await scheme.save();

    // Link notification to scheme if not already linked
    if (!notification.schemeId) {
      notification.schemeId = scheme._id;
      await notification.save();
    }

    // Audit Log
    await NotificationReviewLog.create({
      notificationId: notification._id,
      adminId: req.user.id,
      action: "SCHEME_UPDATE_APPLIED",
      schemeId: scheme._id,
      notes: `Applied approved fields: ${appliedFields.join(", ")} to scheme '${scheme.name}'.`,
      changedFields: appliedFields,
    });

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${appliedFields.length} field(s) on scheme '${scheme.name}'.`,
      data: {
        scheme,
        appliedFields,
      },
    });
  } catch (error) {
    console.error("[notificationController] ApplySchemeUpdate error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to apply scheme update.",
      error: error.message,
    });
  }
}

import SchemeIngestionQueue from "../models/SchemeIngestionQueue.js";
import Scheme from "../models/Scheme.js";
import { runSchemeSync } from "../jobs/schemeSyncJob.js";

/**
 * HAQ DWAAR AI — Scheme Ingestion Queue & Sync Controller
 * Manages crawled drafts, automated sync triggers, and 1-Click Human Admin Approvals.
 */

/**
 * GET /api/admin/scheme-sync/queue
 * List queue items with status filtering, search, and aggregate metrics
 */
export const getQueueItems = async (req, res) => {
  try {
    const { status = "pending_review", source, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (source && source !== "all") {
      query.source = source;
    }
    if (search && search.trim()) {
      query.$or = [
        { externalId: { $regex: search.trim(), $options: "i" } },
        { "parsedDraft.name": { $regex: search.trim(), $options: "i" } },
        { sourceName: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [items, totalItems, pendingCount, approvedCount, rejectedCount] = await Promise.all([
      SchemeIngestionQueue.find(query)
        .populate("reviewedBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      SchemeIngestionQueue.countDocuments(query),
      SchemeIngestionQueue.countDocuments({ status: "pending_review" }),
      SchemeIngestionQueue.countDocuments({ status: "approved" }),
      SchemeIngestionQueue.countDocuments({ status: "rejected" }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalItems,
          totalPages: Math.ceil(totalItems / limitNum) || 1,
        },
        counts: {
          pending: pendingCount,
          approved: approvedCount,
          rejected: rejectedCount,
          total: pendingCount + approvedCount + rejectedCount,
        },
      },
    });
  } catch (error) {
    console.error("[getQueueItems] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch scheme ingestion queue.",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/scheme-sync/trigger
 * Manually trigger live sync across data.gov.in, myScheme, and PIB
 */
export const triggerSync = async (req, res) => {
  try {
    const report = await runSchemeSync();
    return res.status(200).json({
      success: true,
      message: `Sync completed: ${report.newDraftsCreated} new schemes queued, ${report.existingSkipped} skipped.`,
      data: report,
    });
  } catch (error) {
    console.error("[triggerSync] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to trigger live scheme synchronization.",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/scheme-sync/:id/approve
 * 1-Click Approval: Converts normalized draft into active production Scheme
 */
export const approveDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { editedDraft } = req.body;

    const queueItem = await SchemeIngestionQueue.findById(id);
    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: "Ingestion draft not found.",
      });
    }

    const draftData = editedDraft || queueItem.parsedDraft;

    // Create or update in production Scheme collection
    let publishedScheme = await Scheme.findOne({ name: draftData.name });
    if (publishedScheme) {
      // Update existing
      Object.assign(publishedScheme, draftData, {
        sourceLastVerified: new Date(),
        active: true,
      });
      await publishedScheme.save();
    } else {
      // Create new
      publishedScheme = await Scheme.create({
        ...draftData,
        active: true,
        sourceLastVerified: new Date(),
      });
    }

    // Update queue record
    queueItem.status = "approved";
    queueItem.approvedSchemeId = publishedScheme._id;
    queueItem.reviewedBy = req.user?._id || null;
    queueItem.reviewedAt = new Date();
    await queueItem.save();

    return res.status(200).json({
      success: true,
      message: `Scheme "${publishedScheme.name}" successfully approved and published to Directory.`,
      data: {
        scheme: publishedScheme,
        queueItem,
      },
    });
  } catch (error) {
    console.error("[approveDraft] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to approve scheme draft.",
      error: error.message,
    });
  }
};

/**
 * POST /api/admin/scheme-sync/:id/reject
 * Mark draft as rejected with reason notes
 */
export const rejectDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const queueItem = await SchemeIngestionQueue.findById(id);
    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: "Ingestion draft not found.",
      });
    }

    queueItem.status = "rejected";
    queueItem.reviewNotes = notes || "Rejected by administrator.";
    queueItem.reviewedBy = req.user?._id || null;
    queueItem.reviewedAt = new Date();
    await queueItem.save();

    return res.status(200).json({
      success: true,
      message: "Ingestion draft rejected.",
      data: queueItem,
    });
  } catch (error) {
    console.error("[rejectDraft] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject scheme draft.",
      error: error.message,
    });
  }
};

/**
 * PUT /api/admin/scheme-sync/:id
 * Update draft fields before approving
 */
export const updateDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { parsedDraft } = req.body;

    const queueItem = await SchemeIngestionQueue.findById(id);
    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: "Ingestion draft not found.",
      });
    }

    queueItem.parsedDraft = {
      ...queueItem.parsedDraft.toObject(),
      ...parsedDraft,
    };
    await queueItem.save();

    return res.status(200).json({
      success: true,
      message: "Draft specifications updated.",
      data: queueItem,
    });
  } catch (error) {
    console.error("[updateDraft] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update draft.",
      error: error.message,
    });
  }
};

import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { runAlertCycle } from "../services/alertService.js";

/**
 * 1. List In-App Notifications for Current Citizen
 * GET /api/notifications
 */
export async function getUserNotifications(req, res) {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user.id };

    if (status && status !== "ALL") {
      if (status === "UNREAD") {
        query.status = { $in: ["SENT", "PENDING"] };
      } else {
        query.status = status;
      }
    } else {
      // Default: do not show DISMISSED unless explicitly requested
      query.status = { $ne: "DISMISSED" };
    }

    if (type && type !== "ALL") {
      query.type = type;
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .populate("schemeId", "name category deadline applicationDeadline")
        .populate("applicationId", "status referenceNumber")
        .populate("documentId", "documentType originalFileName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Notification.countDocuments(query),
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
    console.error("[citizenNotificationController] List error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications.",
      error: error.message,
    });
  }
}

/**
 * 2. Get Unread Notification Count
 * GET /api/notifications/unread-count
 */
export async function getUnreadCount(req, res) {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      status: { $in: ["SENT", "PENDING"] },
    });

    return res.status(200).json({
      success: true,
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    console.error("[citizenNotificationController] UnreadCount error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve unread notification count.",
      error: error.message,
    });
  }
}

/**
 * 3. Mark Single Notification as Read
 * PUT /api/notifications/:id/read
 */
export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format.",
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    // Enforce ownership: Citizen can only mark their own notification read
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this notification.",
      });
    }

    notification.status = "READ";
    notification.readAt = new Date();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: { notification },
    });
  } catch (error) {
    console.error("[citizenNotificationController] MarkRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
      error: error.message,
    });
  }
}

/**
 * 4. Dismiss Notification
 * PUT /api/notifications/:id/dismiss
 */
export async function dismissNotification(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format.",
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    // Enforce ownership
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this notification.",
      });
    }

    notification.status = "DISMISSED";
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification dismissed.",
      data: { notification },
    });
  } catch (error) {
    console.error("[citizenNotificationController] Dismiss error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to dismiss notification.",
      error: error.message,
    });
  }
}

/**
 * 5. Mark All Notifications as Read for Current Citizen
 * PUT /api/notifications/read-all
 */
export async function markAllAsRead(req, res) {
  try {
    const result = await Notification.updateMany(
      {
        userId: req.user.id,
        status: { $in: ["SENT", "PENDING"] },
      },
      {
        $set: {
          status: "READ",
          readAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read.`,
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("[citizenNotificationController] MarkAllRead error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read.",
      error: error.message,
    });
  }
}

/**
 * 6. Development & Testing Trigger for Alert Cycle
 * POST /api/notifications/trigger-alert-cycle
 */
export async function triggerAlertCycle(req, res) {
  try {
    const stats = await runAlertCycle();
    return res.status(200).json({
      success: true,
      message: "Proactive alert cycle triggered successfully.",
      data: { stats },
    });
  } catch (error) {
    console.error("[citizenNotificationController] TriggerAlertCycle error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to run proactive alert cycle.",
      error: error.message,
    });
  }
}

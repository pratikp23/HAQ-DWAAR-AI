import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationAsRead,
  dismissNotification,
  markAllAsRead,
  triggerAlertCycle,
} from "../controllers/citizenNotificationController.js";

const router = express.Router();

// All notification routes require authentication and enforce citizen ownership
router.use(requireAuth);

router.get("/", getUserNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markNotificationAsRead);
router.put("/:id/dismiss", dismissNotification);

// Testing / Dev execution endpoint
router.post("/trigger-alert-cycle", triggerAlertCycle);

export default router;

import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import {
  getQueueItems,
  triggerSync,
  approveDraft,
  rejectDraft,
  updateDraft,
} from "../controllers/schemeIngestionController.js";

const router = express.Router();

// All ingestion endpoints require Admin privilege
router.use(requireAuth, requireAdmin);

router.get("/queue", getQueueItems);
router.post("/trigger", triggerSync);
router.post("/:id/approve", approveDraft);
router.post("/:id/reject", rejectDraft);
router.put("/:id", updateDraft);

export default router;

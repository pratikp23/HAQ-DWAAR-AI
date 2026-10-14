import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  quickApplyScheme,
  getDepartmentQueue,
  reviewDepartmentApplication,
} from "../controllers/applicationTrackerController.js";

const router = express.Router();

// All tracker routes require authentication
router.use(requireAuth);

router.post("/quick-apply", quickApplyScheme);
router.get("/department/queue", getDepartmentQueue);
router.put("/:id/review", reviewDepartmentApplication);

router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;

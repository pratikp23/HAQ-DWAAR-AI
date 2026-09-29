import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationTrackerController.js";

const router = express.Router();

// All tracker routes require authentication and enforce citizen ownership
router.use(requireAuth);

router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;

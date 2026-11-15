import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getCoachRoadmap,
  getPrintableForm,
  saveOfficialReference,
} from "../controllers/schemeCoachController.js";

const router = express.Router();

// All SchemeCoach endpoints require citizen authentication
router.use(requireAuth);

router.get("/:schemeId", getCoachRoadmap);
router.get("/:schemeId/print-form", getPrintableForm);
router.post("/:schemeId/save-reference", saveOfficialReference);

export default router;

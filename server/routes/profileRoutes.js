import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// All profile endpoints are protected and scoped strictly to the authenticated user
router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);

export default router;

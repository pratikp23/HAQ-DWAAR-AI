import express from "express";
import { register, login, getMe, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/me", requireAuth, getMe);

// Admin-only test route (for testing 403 authorization without building full admin dashboard)
router.get("/admin-test", requireAuth, requireRole("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin authorization verified. You have access to administrative resources.",
    data: {
      user: req.user.toSafeObject ? req.user.toSafeObject() : req.user,
    },
  });
});

export default router;

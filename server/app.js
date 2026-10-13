import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import matchingRoutes from "./routes/matchingRoutes.js";
import lifeSituationRoutes from "./routes/lifeSituationRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import digilockerRoutes from "./routes/digilockerRoutes.js";
import readinessRoutes from "./routes/readinessRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import applicationTrackerRoutes from "./routes/applicationTrackerRoutes.js";
import citizenNotificationRoutes from "./routes/citizenNotificationRoutes.js";
import bhashiniRoutes from "./routes/bhashiniRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import chiefOfficerRoutes from "./routes/chiefOfficerRoutes.js";
import schemeReportRoutes from "./routes/schemeReportRoutes.js";
import mittraRoutes from "./routes/mittraRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cookieParser());

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = [
  clientUrl,
  clientUrl.replace(/\/$/, ""),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow configured origins
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Body parsing (allow base64 image uploads up to 10MB)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Base API Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/life-situation", lifeSituationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/digilocker", digilockerRoutes);
app.use("/api/readiness", readinessRoutes);
app.use("/api/admin/notifications", notificationRoutes);
app.use("/api/applications", applicationTrackerRoutes);
app.use("/api/notifications", citizenNotificationRoutes);
app.use("/api/bhashini", bhashiniRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/officer", chiefOfficerRoutes);
app.use("/api/chief", chiefOfficerRoutes);
app.use("/api/reports", schemeReportRoutes);
app.use("/api/mittra", mittraRoutes);

// Catch-all 404 handler
app.use(notFoundHandler);

// Global centralized error handler
app.use(errorHandler);

export default app;

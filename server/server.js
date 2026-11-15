import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startDeadlineScheduler } from "./jobs/deadlineAlertJob.js";
import { initSchemeSyncJob } from "./jobs/schemeSyncJob.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Initialize proactive deadline scheduler and government scheme sync worker
if (process.env.NODE_ENV !== "test") {
  startDeadlineScheduler();
  initSchemeSyncJob();
}

// Start Express HTTP Server
const server = app.listen(PORT, () => {
  console.log("========================================================");
  console.log("  HaqDwaar AI API running on: http://localhost:" + PORT);
  console.log("  Health check endpoint:   http://localhost:" + PORT + "/api/health");
  console.log("  Environment:             " + (process.env.NODE_ENV || "development"));
  console.log("========================================================");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("[Process] Unhandled Rejection:", err.message);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("[Process] Uncaught Exception:", err.message);
});

export default server;

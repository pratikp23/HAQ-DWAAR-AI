import { runAlertCycle } from "../services/alertService.js";

/**
 * HAQ DWAAR AI — Server-Side Deadline & Proactive Alert Scheduler
 * 
 * Uses a robust singleton interval guard to prevent duplicate job instances
 * during development server hot-reloads.
 */

let jobIntervalId = null;
let isExecuting = false;

export async function triggerAlertJob() {
  if (isExecuting) {
    console.log("[deadlineAlertJob] Job cycle already in progress. Skipping concurrent trigger.");
    return { skipped: true, reason: "CONCURRENT_EXECUTION" };
  }

  isExecuting = true;
  console.log("[deadlineAlertJob] Starting proactive alert cycle...");
  try {
    const stats = await runAlertCycle();
    console.log(
      `[deadlineAlertJob] Alert cycle completed. Deadlines: ${stats.deadlineAlerts}, Documents: ${stats.documentExpiryAlerts}, Blockers: ${stats.readinessBlockerAlerts}, Follow-ups: ${stats.followUpAlerts}`
    );
    return stats;
  } catch (error) {
    console.error("[deadlineAlertJob] Execution error:", error);
    return { error: error.message };
  } finally {
    isExecuting = false;
  }
}

export function startDeadlineScheduler(intervalMs = 60 * 60 * 1000) {
  if (jobIntervalId) {
    console.log("[deadlineAlertJob] Scheduler already active. Maintaining existing timer.");
    return;
  }

  console.log(`[deadlineAlertJob] Initializing deadline alert scheduler (Interval: ${intervalMs / 1000}s)...`);

  // Run initial cycle shortly after startup in background
  setTimeout(() => {
    triggerAlertJob().catch((err) => console.error("[deadlineAlertJob] Initial run error:", err));
  }, 10000);

  jobIntervalId = setInterval(() => {
    triggerAlertJob().catch((err) => console.error("[deadlineAlertJob] Scheduled run error:", err));
  }, intervalMs);
}

export function stopDeadlineScheduler() {
  if (jobIntervalId) {
    clearInterval(jobIntervalId);
    jobIntervalId = null;
    console.log("[deadlineAlertJob] Scheduler stopped.");
  }
}

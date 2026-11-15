import { fetchAllGovFeeds } from "../services/govApiService.js";
import { parseRawScheme } from "../services/schemeIngestionParser.js";
import SchemeIngestionQueue from "../models/SchemeIngestionQueue.js";
import Scheme from "../models/Scheme.js";

/**
 * HAQ DWAAR AI — Scheme Ingestion Worker & Sync Engine
 * Periodically pulls official feeds, dedupes against existing database,
 * normalizes drafts, and populates the human-in-the-loop Ingestion Review Desk.
 */
export const runSchemeSync = async () => {
  const startTime = Date.now();
  console.log("[schemeSyncJob] Starting automated government API ingestion...");

  const rawFeeds = await fetchAllGovFeeds();
  let createdCount = 0;
  let skippedCount = 0;

  for (const rawItem of rawFeeds) {
    try {
      const externalId = rawItem.externalId || `SYNC-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      // 1. Check if already in Ingestion Queue
      const existingQueueItem = await SchemeIngestionQueue.findOne({ externalId });
      if (existingQueueItem) {
        skippedCount++;
        continue;
      }

      // 2. Check if scheme with similar name is already published in production Scheme collection
      const schemeTitle = (rawItem.title || rawItem.name || "").trim();
      const existingPublishedScheme = await Scheme.findOne({
        name: { $regex: new RegExp(`^${schemeTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      });
      if (existingPublishedScheme) {
        skippedCount++;
        continue;
      }

      // 3. AI Normalization & Parser
      const { parsedDraft, confidenceScore } = await parseRawScheme(rawItem);

      // 4. Save to Ingestion Queue for Admin Review
      await SchemeIngestionQueue.create({
        externalId,
        source: rawItem.source || "data.gov.in",
        sourceUrl: rawItem.sourceUrl || "https://data.gov.in",
        sourceName: rawItem.sourceName || "Government of India",
        rawPayload: rawItem,
        parsedDraft,
        confidenceScore,
        status: "pending_review",
        lastSyncedAt: new Date(),
      });

      createdCount++;
    } catch (itemErr) {
      console.error(`[schemeSyncJob] Error processing feed item ${rawItem.externalId}:`, itemErr.message);
    }
  }

  const durationMs = Date.now() - startTime;
  console.log(`[schemeSyncJob] Ingestion complete in ${durationMs}ms: ${createdCount} new drafts, ${skippedCount} skipped.`);

  return {
    success: true,
    totalFetched: rawFeeds.length,
    newDraftsCreated: createdCount,
    existingSkipped: skippedCount,
    durationMs,
    completedAt: new Date(),
  };
};

/**
 * Initialize recurring background sync worker (defaults to 2:00 AM IST or every 24h)
 */
export const initSchemeSyncJob = () => {
  // Initial sync check on boot if queue is empty
  setTimeout(async () => {
    try {
      const count = await SchemeIngestionQueue.countDocuments();
      if (count === 0) {
        console.log("[schemeSyncJob] Ingestion queue is empty. Triggering bootstrap sync...");
        await runSchemeSync();
      }
    } catch (err) {
      console.warn("[schemeSyncJob] Bootstrap sync check deferred:", err.message);
    }
  }, 10000); // 10s after startup
};

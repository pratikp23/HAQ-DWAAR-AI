import Scheme from "../models/Scheme.js";
import UserProfile from "../models/UserProfile.js";
import Document from "../models/Document.js";
import ApplicationTracker from "../models/ApplicationTracker.js";
import { evaluateDeadline, formatIndianDate, getNowIST } from "./deadlineService.js";
import { buildDedupKey, dispatchAlert } from "./notificationService.js";
import { evaluateScheme } from "./matchingService.js";
import { calculateReadiness } from "./readinessService.js";

/**
 * HAQ DWAAR AI — Proactive Alert Engine
 * 
 * Deterministically evaluates deadlines, document expiry, readiness blockers,
 * and tracked application follow-ups.
 * 
 * Strict Civic Safeguards:
 * - Deadline info comes ONLY from trusted scheme data (scheme.verificationStatus === 'VERIFIED').
 * - Zero LLM/Gemini in alert qualification or date calculation.
 * - Non-matched schemes are never pushed unless explicitly tracked by the citizen.
 * - Expired schemes never say "Apply now".
 */

export async function runAlertCycle() {
  const stats = {
    deadlineAlerts: 0,
    documentExpiryAlerts: 0,
    readinessBlockerAlerts: 0,
    followUpAlerts: 0,
    skippedDuplicates: 0,
    errors: [],
  };

  try {
    const nowIST = getNowIST();
    const dateKey = nowIST.toISOString().split("T")[0]; // YYYY-MM-DD

    // =========================================================================
    // 1. TRUSTED SCHEME DEADLINE ALERTS
    // =========================================================================
    const verifiedSchemesWithDeadline = await Scheme.find({
      verificationStatus: "VERIFIED",
      $or: [{ deadline: { $ne: null } }, { applicationDeadline: { $ne: null } }],
    });

    const allProfiles = await UserProfile.find({});

    for (const scheme of verifiedSchemesWithDeadline) {
      const deadlineDate = scheme.applicationDeadline || scheme.deadline;
      const evaluation = evaluateDeadline(deadlineDate);

      if (!evaluation.hasDeadline) continue;

      // Find tracked applications for this scheme
      const trackedApps = await ApplicationTracker.find({ schemeId: scheme._id });
      const trackedUserIds = new Set(trackedApps.map((a) => a.userId.toString()));

      for (const profile of allProfiles) {
        const userIdStr = profile.userId.toString();
        const isTracked = trackedUserIds.has(userIdStr);

        // Relevance Evaluation
        let isRelevant = false;
        let matchResult = null;

        if (isTracked) {
          isRelevant = true;
        } else {
          // Check matching criteria: MATCHED or POTENTIAL_MATCH
          matchResult = evaluateScheme(profile, scheme);
          if (matchResult.classification === "MATCHED" || matchResult.classification === "POTENTIAL_MATCH") {
            isRelevant = true;
          }
        }

        // Skip NOT_MATCHED schemes that are not explicitly tracked
        if (!isRelevant) continue;

        // Check if an alert window is triggered
        if (evaluation.notificationWindow && !evaluation.isExpired) {
          let alertType = "DEADLINE_APPROACHING";
          let priority = "MEDIUM";

          if (evaluation.daysRemaining === 0) {
            alertType = "DEADLINE_TODAY";
            priority = "HIGH";
          } else if (evaluation.daysRemaining <= 3) {
            alertType = "DEADLINE_SOON";
            priority = "HIGH";
          } else if (evaluation.daysRemaining <= 7) {
            alertType = "DEADLINE_APPROACHING";
            priority = "MEDIUM";
          }

          const dedupKey = buildDedupKey(
            userIdStr,
            scheme._id,
            alertType,
            evaluation.notificationWindow,
            dateKey
          );

          let message = "";
          if (evaluation.daysRemaining === 0) {
            message = `Today is the final application deadline for ${scheme.name} (${evaluation.formattedDate}). Review your readiness before applying.`;
          } else if (evaluation.daysRemaining === 1) {
            message = `The application deadline for ${scheme.name} is tomorrow (${evaluation.formattedDate}). 1 day remaining.`;
          } else {
            message = `Application deadline for ${scheme.name} is in ${evaluation.daysRemaining} days (${evaluation.formattedDate}).`;
          }

          if (isTracked) {
            message += " Check your tracked application to ensure all requirements are ready.";
          }

          const res = await dispatchAlert({
            userId: profile.userId,
            type: alertType,
            title: `${scheme.name} — Deadline Alert`,
            message,
            schemeId: scheme._id,
            priority,
            channel: "IN_APP",
            dedupKey,
            metadata: {
              daysRemaining: evaluation.daysRemaining,
              deadlineDate: evaluation.formattedDate,
              actionUrl: `/dashboard/readiness/${scheme._id}`,
            },
          });

          if (res.success) {
            if (res.deduplicated) stats.skippedDuplicates++;
            else stats.deadlineAlerts++;
          }

          // Also check for optional WhatsApp alert if user enabled WhatsApp consent
          if (profile.preferences?.whatsappConsent) {
            const waDedupKey = buildDedupKey(
              userIdStr,
              scheme._id,
              alertType + "_WA",
              evaluation.notificationWindow,
              dateKey
            );
            await dispatchAlert({
              userId: profile.userId,
              type: alertType,
              title: `${scheme.name} — Deadline Alert`,
              message,
              schemeId: scheme._id,
              priority,
              channel: "WHATSAPP",
              dedupKey: waDedupKey,
              metadata: {
                daysRemaining: evaluation.daysRemaining,
                deadlineDate: evaluation.formattedDate,
                actionUrl: `/dashboard/readiness/${scheme._id}`,
              },
            });
          }
        } else if (evaluation.isExpired && isTracked) {
          // Informative expired notice ONLY for citizens who actively tracked it
          const expiredDedupKey = buildDedupKey(userIdStr, scheme._id, "DEADLINE_EXPIRED", "PASSED", dateKey);
          await dispatchAlert({
            userId: profile.userId,
            type: "SYSTEM",
            title: `${scheme.name} — Application Deadline Passed`,
            message: `The recorded application deadline for ${scheme.name} (${evaluation.formattedDate}) has passed. Check the official portal for any official extension or updates.`,
            schemeId: scheme._id,
            priority: "LOW",
            channel: "IN_APP",
            dedupKey: expiredDedupKey,
            metadata: {
              actionUrl: `/dashboard/schemes/${scheme._id}`,
            },
          });
        }
      }
    }

    // =========================================================================
    // 2. DOCUMENT EXPIRY ALERTS
    // =========================================================================
    const documentsWithExpiry = await Document.find({
      "extractedData.expiryDate": { $ne: null },
    });

    for (const doc of documentsWithExpiry) {
      const expiryEval = evaluateDeadline(doc.extractedData.expiryDate);
      if (!expiryEval.hasDeadline) continue;

      if ([30, 15, 7].includes(expiryEval.daysRemaining)) {
        const windowName = `${expiryEval.daysRemaining}_DAYS`;
        const dedupKey = buildDedupKey(
          doc.userId.toString(),
          doc._id.toString(),
          "DOCUMENT_EXPIRING",
          windowName,
          dateKey
        );

        const res = await dispatchAlert({
          userId: doc.userId,
          type: "DOCUMENT_EXPIRING",
          title: `${doc.documentType} Expiring Soon`,
          message: `Your ${doc.documentType} is valid until ${expiryEval.formattedDate} (${expiryEval.daysRemaining} days remaining). Consider renewing it to prevent preparation delays.`,
          documentId: doc._id,
          priority: expiryEval.daysRemaining <= 7 ? "HIGH" : "MEDIUM",
          channel: "IN_APP",
          dedupKey,
          metadata: {
            daysRemaining: expiryEval.daysRemaining,
            expiryDate: expiryEval.formattedDate,
            actionUrl: "/dashboard/documents",
          },
        });

        if (res.success && !res.deduplicated) stats.documentExpiryAlerts++;
      }
    }

    // =========================================================================
    // 3. READINESS BLOCKER ALERTS (Tracked schemes with missing documents)
    // =========================================================================
    const activeTrackers = await ApplicationTracker.find({
      status: { $in: ["INTERESTED", "PREPARING"] },
    }).populate("schemeId");

    for (const tracker of activeTrackers) {
      if (!tracker.schemeId || tracker.schemeId.verificationStatus !== "VERIFIED") continue;

      const profile = await UserProfile.findOne({ userId: tracker.userId });
      const userDocs = await Document.find({ userId: tracker.userId });

      const readiness = calculateReadiness(profile, tracker.schemeId, userDocs);
      const missingMandatoryDocs = readiness.documentEvaluation?.filter(
        (d) => d.mandatory && d.status === "MISSING"
      );

      if (missingMandatoryDocs && missingMandatoryDocs.length > 0) {
        const missingNames = missingMandatoryDocs.map((d) => d.requiredDocumentType).join(", ");
        const dedupKey = buildDedupKey(
          tracker.userId.toString(),
          tracker.schemeId._id.toString(),
          "READINESS_BLOCKER",
          "MISSING_DOCS",
          dateKey
        );

        const res = await dispatchAlert({
          userId: tracker.userId,
          type: "READINESS_BLOCKER",
          title: `Preparation Incomplete: ${tracker.schemeId.name}`,
          message: `Your application preparation is incomplete because mandatory certificate(s) (${missingNames}) are missing from your Personal Document Vault.`,
          schemeId: tracker.schemeId._id,
          applicationId: tracker._id,
          priority: "HIGH",
          channel: "IN_APP",
          dedupKey,
          metadata: {
            missingDocuments: missingNames,
            actionUrl: `/dashboard/readiness/${tracker.schemeId._id}`,
          },
        });

        if (res.success && !res.deduplicated) stats.readinessBlockerAlerts++;
      }
    }

    // =========================================================================
    // 4. APPLICATION FOLLOW-UP ALERTS (Tracked applications marked APPLIED)
    // =========================================================================
    const appliedTrackers = await ApplicationTracker.find({
      status: "APPLIED",
      submittedAt: { $ne: null },
    }).populate("schemeId");

    const now = Date.now();
    for (const tracker of appliedTrackers) {
      if (!tracker.schemeId) continue;

      const daysSinceSubmission = Math.floor((now - new Date(tracker.submittedAt).getTime()) / (24 * 60 * 60 * 1000));

      if (daysSinceSubmission >= 7) {
        // Trigger weekly check-in alert (day 7, 14, 21, 28)
        const weeklyWindow = `FOLLOWUP_${Math.floor(daysSinceSubmission / 7) * 7}_DAYS`;
        const dedupKey = buildDedupKey(
          tracker.userId.toString(),
          tracker._id.toString(),
          "APPLICATION_FOLLOW_UP",
          weeklyWindow,
          dateKey
        );

        const res = await dispatchAlert({
          userId: tracker.userId,
          type: "APPLICATION_FOLLOW_UP",
          title: `Application Status Check: ${tracker.schemeId.name}`,
          message: `You marked this application as Submitted ${daysSinceSubmission} days ago. Consider checking the official government portal for status updates.`,
          schemeId: tracker.schemeId._id,
          applicationId: tracker._id,
          priority: "MEDIUM",
          channel: "IN_APP",
          dedupKey,
          metadata: {
            daysSinceSubmission,
            actionUrl: `/dashboard/applications/${tracker._id}`,
          },
        });

        if (res.success && !res.deduplicated) stats.followUpAlerts++;
      }
    }
  } catch (error) {
    console.error("[alertService] runAlertCycle encountered an error:", error);
    stats.errors.push(error.message);
  }

  return stats;
}

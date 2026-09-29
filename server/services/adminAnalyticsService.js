import User from "../models/User.js";
import UserProfile from "../models/UserProfile.js";
import Scheme from "../models/Scheme.js";
import Document from "../models/Document.js";
import NotificationAnalysis from "../models/NotificationAnalysis.js";
import NotificationReviewLog from "../models/NotificationReviewLog.js";
import Notification from "../models/Notification.js";
import ApplicationTracker from "../models/ApplicationTracker.js";
import AnalyticsEvent from "../models/AnalyticsEvent.js";

const SCHEME_REVIEW_DAYS = parseInt(process.env.SCHEME_REVIEW_DAYS || "180", 10);

/**
 * Helper to compute date filter query
 */
export function buildDateQuery(range = "all", dateField = "createdAt") {
  if (!range || range === "all") return {};

  const now = new Date();
  let startDate = new Date();

  switch (range.toLowerCase()) {
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(now.getDate() - 90);
      break;
    default:
      return {};
  }

  return { [dateField]: { $gte: startDate } };
}

/**
 * 1. Overview High-Level Platform Statistics
 */
export async function getOverviewStats(range = "all") {
  const dateQuery = buildDateQuery(range);

  // Schemes aggregation
  const [
    totalSchemes,
    verifiedSchemes,
    draftSchemes,
    pendingReviewSchemes,
    archivedSchemes,
  ] = await Promise.all([
    Scheme.countDocuments({}),
    Scheme.countDocuments({ verificationStatus: "VERIFIED" }),
    Scheme.countDocuments({ verificationStatus: "DRAFT" }),
    Scheme.countDocuments({ verificationStatus: "PENDING_REVIEW" }),
    Scheme.countDocuments({ verificationStatus: "ARCHIVED" }),
  ]);

  // Notifications Analysis (Phase 10)
  const [
    totalNotificationAnalyses,
    uploadedNotifs,
    processingNotifs,
    reviewRequiredNotifs,
    approvedNotifs,
    rejectedNotifs,
  ] = await Promise.all([
    NotificationAnalysis.countDocuments({}),
    NotificationAnalysis.countDocuments({ status: "UPLOADED" }),
    NotificationAnalysis.countDocuments({ status: "PROCESSING" }),
    NotificationAnalysis.countDocuments({ status: "REVIEW_REQUIRED" }),
    NotificationAnalysis.countDocuments({ status: "APPROVED" }),
    NotificationAnalysis.countDocuments({ status: "REJECTED" }),
  ]);

  // Users & Profiles (Zero PII exposed)
  const [totalCitizens, totalAdmins, totalProfiles] = await Promise.all([
    User.countDocuments({ role: "citizen" }),
    User.countDocuments({ role: "admin" }),
    UserProfile.countDocuments({}),
  ]);

  // Tracked Applications (Phase 11)
  const appStatusCounts = await ApplicationTracker.aggregate([
    ...(Object.keys(dateQuery).length ? [{ $match: dateQuery }] : []),
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const appStatusMap = {
    INTERESTED: 0,
    PREPARING: 0,
    READY_TO_APPLY: 0,
    APPLIED: 0,
    FOLLOW_UP: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };

  appStatusCounts.forEach((s) => {
    if (appStatusMap[s._id] !== undefined) {
      appStatusMap[s._id] = s.count;
    }
  });

  const totalApplications = Object.values(appStatusMap).reduce((a, b) => a + b, 0);
  const activeApplications =
    appStatusMap.INTERESTED +
    appStatusMap.PREPARING +
    appStatusMap.READY_TO_APPLY +
    appStatusMap.APPLIED +
    appStatusMap.FOLLOW_UP;

  // Documents count
  const totalDocuments = await Document.countDocuments(dateQuery);

  return {
    scopeNotice: "Operational aggregate metrics derived strictly from HAQ DWAAR AI platform activity.",
    schemes: {
      total: totalSchemes,
      totalSchemes,
      verified: verifiedSchemes,
      verifiedSchemes,
      draft: draftSchemes,
      pendingReview: pendingReviewSchemes,
      archived: archivedSchemes,
      unverifiedSchemes: draftSchemes + pendingReviewSchemes,
    },
    notificationAnalysis: {
      total: totalNotificationAnalyses,
      uploaded: uploadedNotifs,
      processing: processingNotifs,
      reviewRequired: reviewRequiredNotifs,
      approved: approvedNotifs,
      rejected: rejectedNotifs,
    },
    notifications: {
      total: totalNotificationAnalyses,
      totalNotifications: totalNotificationAnalyses,
      reviewRequired: reviewRequiredNotifs,
    },
    users: {
      total: totalCitizens + totalAdmins,
      totalUsers: totalCitizens + totalAdmins,
      registeredCitizens: totalCitizens,
      admins: totalAdmins,
      benefitPassports: totalProfiles,
      passportsCreated: totalProfiles,
    },
    applications: {
      total: totalApplications,
      totalTracked: totalApplications,
      active: activeApplications,
      inProgress: activeApplications,
      interested: appStatusMap.INTERESTED,
      preparing: appStatusMap.PREPARING,
      readyToApply: appStatusMap.READY_TO_APPLY,
      citizenMarkedApplied: appStatusMap.APPLIED,
      followUp: appStatusMap.FOLLOW_UP,
      completed: appStatusMap.COMPLETED,
      citizenMarkedCompleted: appStatusMap.COMPLETED,
      cancelled: appStatusMap.CANCELLED,
    },
    documents: {
      total: totalDocuments,
      totalDocuments,
    },
  };
}

/**
 * 2. Scheme Quality & Inventory Analytics
 */
export async function getSchemeAnalytics() {
  const total = await Scheme.countDocuments({});

  // Group by category
  const byCategory = await Scheme.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Group by state
  const byState = await Scheme.aggregate([
    { $group: { _id: "$state", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Group by verification status
  const byStatus = await Scheme.aggregate([
    { $group: { _id: "$verificationStatus", count: { $sum: 1 } } },
  ]);

  // Group by application method
  const byMethod = await Scheme.aggregate([
    { $group: { _id: "$applicationMethod", count: { $sum: 1 } } },
  ]);

  // Gateway URL availability
  const [
    withAppUrl,
    withoutAppUrl,
    withSourceUrl,
    withoutSourceUrl,
    withDeadline,
    withoutDeadline,
  ] = await Promise.all([
    Scheme.countDocuments({ officialApplicationUrl: { $nin: ["", null] } }),
    Scheme.countDocuments({ officialApplicationUrl: { $in: ["", null] } }),
    Scheme.countDocuments({ officialSourceUrl: { $nin: ["", null] } }),
    Scheme.countDocuments({ officialSourceUrl: { $in: ["", null] } }),
    Scheme.countDocuments({ hasDeadline: true }),
    Scheme.countDocuments({ hasDeadline: false }),
  ]);

  // Quality & Attention indicators
  const reviewCutoff = new Date();
  reviewCutoff.setDate(reviewCutoff.getDate() - SCHEME_REVIEW_DAYS);

  const [missingRulesCount, missingDocsCount, reviewDueCount] = await Promise.all([
    Scheme.countDocuments({ "rules.0": { $exists: false } }),
    Scheme.countDocuments({ "requiredDocuments.0": { $exists: false } }),
    Scheme.countDocuments({
      verificationStatus: "VERIFIED",
      $or: [
        { sourceLastVerified: { $lt: reviewCutoff } },
        { sourceLastVerified: null },
      ],
    }),
  ]);

  return {
    scopeNotice: "Schemes available in HAQ DWAAR AI catalog.",
    total,
    byCategory: byCategory.map((c) => ({ category: c._id || "GENERAL", count: c.count })),
    byState: byState.map((s) => ({ state: s._id || "All-India", count: s.count })),
    byStatus: byStatus.map((s) => ({ status: s._id || "DRAFT", count: s.count })),
    byApplicationMethod: byMethod.map((m) => ({ method: m._id || "ONLINE", count: m.count })),
    gateways: {
      withOfficialApplicationUrl: withAppUrl,
      withoutOfficialApplicationUrl: withoutAppUrl,
      withOfficialSourceUrl: withSourceUrl,
      withoutOfficialSourceUrl: withoutSourceUrl,
    },
    deadlines: {
      withDeadline,
      withoutDeadline,
    },
    qualityAttention: {
      missingRules: missingRulesCount,
      missingRequiredDocuments: missingDocsCount,
      missingOfficialSource: withoutSourceUrl,
      missingOfficialGateway: withoutAppUrl,
      reviewDue: reviewDueCount,
      reviewThresholdDays: SCHEME_REVIEW_DAYS,
      reviewDueLabel: "Verification review may be due.",
    },
  };
}

/**
 * 3. Citizen Application Tracker Analytics
 */
export async function getApplicationAnalytics(range = "all") {
  const dateQuery = buildDateQuery(range);

  const statusAgg = await ApplicationTracker.aggregate([
    ...(Object.keys(dateQuery).length ? [{ $match: dateQuery }] : []),
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const statusDistribution = [
    { status: "INTERESTED", label: "Interested", count: 0 },
    { status: "PREPARING", label: "Preparing Documents", count: 0 },
    { status: "READY_TO_APPLY", label: "Ready to Apply", count: 0 },
    { status: "APPLIED", label: "Citizen-marked Applied", count: 0 },
    { status: "FOLLOW_UP", label: "Follow-Up Pending", count: 0 },
    { status: "COMPLETED", label: "Citizen-marked Completed", count: 0 },
    { status: "CANCELLED", label: "Cancelled", count: 0 },
  ];

  statusAgg.forEach((item) => {
    const target = statusDistribution.find((s) => s.status === item._id);
    if (target) target.count = item.count;
  });

  // Top tracked schemes
  const topSchemesAgg = await ApplicationTracker.aggregate([
    ...(Object.keys(dateQuery).length ? [{ $match: dateQuery }] : []),
    { $group: { _id: "$schemeId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 },
    {
      $lookup: {
        from: "schemes",
        localField: "_id",
        foreignField: "_id",
        as: "scheme",
      },
    },
    { $unwind: { path: "$scheme", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        schemeId: "$_id",
        schemeName: { $ifNull: ["$scheme.name", "Unknown Scheme"] },
        category: { $ifNull: ["$scheme.category", "GENERAL"] },
        count: 1,
      },
    },
  ]);

  return {
    disclaimer:
      "Citizen-marked application statuses are not government-confirmed statuses unless an authorized external integration exists.",
    scopeNotice:
      "Citizen-marked application statuses are not government-confirmed statuses unless an authorized external integration exists.",
    statusDistribution,
    byStatus: statusDistribution,
    topTrackedSchemes: topSchemesAgg,
    topSchemes: topSchemesAgg,
  };
}

/**
 * 4. Matching & Intent Analytics
 */
export async function getMatchingAnalytics(range = "all") {
  const dateQuery = buildDateQuery(range);

  const matchEvents = await AnalyticsEvent.aggregate([
    {
      $match: {
        eventType: "MATCH_EVALUATED",
        ...dateQuery,
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const outcomes = {
    MATCHED: 0,
    POTENTIAL_MATCH: 0,
    NOT_MATCHED: 0,
  };

  matchEvents.forEach((e) => {
    if (outcomes[e._id] !== undefined) {
      outcomes[e._id] = e.count;
    }
  });

  const totalEvaluations = Object.values(outcomes).reduce((a, b) => a + b, 0);

  const outcomesArray = [
    { status: "MATCHED", count: outcomes.MATCHED },
    { status: "POTENTIAL_MATCH", count: outcomes.POTENTIAL_MATCH },
    { status: "NOT_MATCHED", count: outcomes.NOT_MATCHED },
  ];

  // Top requested categories from events
  const categoryAgg = await AnalyticsEvent.aggregate([
    {
      $match: {
        eventType: "MATCH_EVALUATED",
        category: { $ne: null },
        ...dateQuery,
      },
    },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  return {
    totalEvaluations,
    outcomes: outcomesArray,
    outcomesMap: outcomes,
    categoryDemand: categoryAgg.map((c) => ({ category: c._id, count: c.count })),
    isPersisted: totalEvaluations > 0,
    note: "Matching metrics derived strictly from actual system evaluation events.",
  };
}

/**
 * 5. Readiness Distribution Analytics
 */
export async function getReadinessAnalytics(range = "all") {
  const dateQuery = buildDateQuery(range);

  const readinessEvents = await AnalyticsEvent.aggregate([
    {
      $match: {
        eventType: "READINESS_CHECKED",
        ...dateQuery,
      },
    },
    {
      $group: {
        _id: "$metadata.readinessLabel",
        count: { $sum: 1 },
        avgScore: { $avg: "$metadata.overallScore" },
      },
    },
  ]);

  const labels = {
    "Ready to Proceed": 0,
    "Partially Ready": 0,
    "Needs Preparation": 0,
  };

  let totalScores = 0;
  let scoreCount = 0;

  readinessEvents.forEach((r) => {
    if (labels[r._id] !== undefined) {
      labels[r._id] = r.count;
    }
    if (r.avgScore) {
      totalScores += r.avgScore * r.count;
      scoreCount += r.count;
    }
  });

  const avgOverallScore = scoreCount > 0 ? Math.round(totalScores / scoreCount) : 0;
  const totalChecks = Object.values(labels).reduce((a, b) => a + b, 0);

  const breakdown = [
    { label: "Ready to Proceed", count: labels["Ready to Proceed"], color: "#059669" },
    { label: "Partially Ready", count: labels["Partially Ready"], color: "#ea580c" },
    { label: "Needs Preparation", count: labels["Needs Preparation"], color: "#dc2626" },
  ];

  return {
    disclaimer:
      "Readiness score indicates citizen document & passport preparation status. It does not measure government eligibility or acceptance probability.",
    scopeNotice:
      "Readiness score indicates citizen document & passport preparation status. It does not measure government eligibility or acceptance probability.",
    totalChecks,
    averageScore: avgOverallScore,
    distribution: breakdown,
    breakdown,
  };
}

/**
 * 6. Document Health & Vault Analytics (Strict Data Minimization)
 */
export async function getDocumentAnalytics(range = "all") {
  const dateQuery = buildDateQuery(range);

  // Document health status
  const healthAgg = await Document.aggregate([
    ...(Object.keys(dateQuery).length ? [{ $match: dateQuery }] : []),
    { $group: { _id: "$healthStatus", count: { $sum: 1 } } },
  ]);

  const healthMap = {
    VALID: 0,
    NEEDS_VERIFICATION: 0,
    EXPIRED: 0,
    INCOMPLETE: 0,
  };

  healthAgg.forEach((h) => {
    if (healthMap[h._id] !== undefined) {
      healthMap[h._id] = h.count;
    }
  });

  // Source breakdown: Upload vs DigiLocker Demo
  const sourceAgg = await Document.aggregate([
    ...(Object.keys(dateQuery).length ? [{ $match: dateQuery }] : []),
    { $group: { _id: "$source", count: { $sum: 1 } } },
  ]);

  const sourceMap = {
    UPLOAD: 0,
    DIGILOCKER: 0,
  };

  sourceAgg.forEach((s) => {
    if (sourceMap[s._id] !== undefined) {
      sourceMap[s._id] = s.count;
    }
  });

  // Document Types used
  const typeAgg = await Document.aggregate([
    ...(Object.keys(dateQuery).length ? [{ $match: dateQuery }] : []),
    { $group: { _id: "$documentType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  const healthList = [
    { status: "VALID", healthStatus: "VALID", count: healthMap.VALID, label: "Valid" },
    { status: "NEEDS_VERIFICATION", healthStatus: "NEEDS_VERIFICATION", count: healthMap.NEEDS_VERIFICATION, label: "Needs Verification" },
    { status: "EXPIRED", healthStatus: "EXPIRED", count: healthMap.EXPIRED, label: "Expired" },
    { status: "INCOMPLETE", healthStatus: "INCOMPLETE", count: healthMap.INCOMPLETE, label: "Incomplete" },
  ];

  const sourceList = [
    { source: "UPLOAD", count: sourceMap.UPLOAD, label: "Manual Document Upload" },
    { source: "DIGILOCKER", count: sourceMap.DIGILOCKER, label: "DigiLocker Demo Import" },
  ];

  return {
    privacyNotice: "Zero citizen PII, document contents, or images exposed.",
    scopeNotice: "DigiLocker Demo integration operates in simulated mode.",
    totalDocuments: Object.values(healthMap).reduce((a, b) => a + b, 0),
    healthStatus: healthList,
    healthBreakdown: healthList,
    sourceDistribution: sourceList,
    sourceBreakdown: sourceList,
    topDocumentTypes: typeAgg.map((t) => ({ type: t._id || "Other", count: t.count })),
  };
}

/**
 * 7. In-App Notification Analytics
 */
export async function getNotificationAnalytics(range = "all") {
  const dateQuery = buildDateQuery(range);

  const [statusAgg, typeAgg, channelAgg] = await Promise.all([
    Notification.aggregate([
      ...(Object.keys(dateQuery).length ? [{ $match: dateQuery }] : []),
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Notification.aggregate([
      ...(Object.keys(dateQuery).length ? [{ $match: dateQuery }] : []),
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Notification.aggregate([
      ...(Object.keys(dateQuery).length ? [{ $match: dateQuery }] : []),
      { $group: { _id: "$channel", count: { $sum: 1 } } },
    ]),
  ]);

  const total = statusAgg.reduce((sum, item) => sum + item.count, 0);

  return {
    totalNotifications: total,
    byStatus: statusAgg.map((s) => ({ status: s._id || "SENT", count: s.count })),
    byType: typeAgg.map((t) => ({ type: t._id, count: t.count })),
    byChannel: channelAgg.map((c) => ({
      channel: c._id,
      count: c.count,
      isDemo: c._id === "WHATSAPP",
    })),
    channels: {
      inApp: { mode: "ACTIVE" },
      whatsapp: { mode: "DEMO_SIMULATED" },
    },
    whatsappNotice: "WhatsApp channel runs in simulated Demo Mode unless live Twilio/Meta API credentials are provided.",
  };
}

/**
 * 8. Bhashini Voice Session Analytics
 */
export async function getVoiceAnalytics(range = "all") {
  const dateQuery = buildDateQuery(range);

  const voiceEvents = await AnalyticsEvent.aggregate([
    {
      $match: {
        eventType: "VOICE_SESSION",
        ...dateQuery,
      },
    },
    {
      $group: {
        _id: "$metadata.language",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalSessions = voiceEvents.reduce((acc, curr) => acc + curr.count, 0);

  return {
    totalVoiceSessions: totalSessions,
    totalSessions,
    serviceStatus: "Voice service: Demo/Mock",
    isDemoMode: true,
    privacyNotice: "Zero voice audio recordings or transcripts stored.",
    byLanguage: voiceEvents.map((v) => ({
      language: v._id || "hi",
      count: v.count,
    })),
  };
}

/**
 * 9. Attention Required Operational Indicators
 */
export async function getAttentionRequired() {
  const reviewCutoff = new Date();
  reviewCutoff.setDate(reviewCutoff.getDate() - SCHEME_REVIEW_DAYS);

  const now = new Date();

  const [
    pendingNotifications,
    pendingVerificationSchemes,
    missingSourceUrlSchemes,
    missingGatewaySchemes,
    reviewDueSchemes,
    expiredDeadlinesCount,
    needsVerificationDocs,
  ] = await Promise.all([
    NotificationAnalysis.countDocuments({ status: "REVIEW_REQUIRED" }),
    Scheme.countDocuments({ verificationStatus: "PENDING_REVIEW" }),
    Scheme.countDocuments({ officialSourceUrl: { $in: ["", null] } }),
    Scheme.countDocuments({ officialApplicationUrl: { $in: ["", null] } }),
    Scheme.countDocuments({
      verificationStatus: "VERIFIED",
      $or: [
        { sourceLastVerified: { $lt: reviewCutoff } },
        { sourceLastVerified: null },
      ],
    }),
    Scheme.countDocuments({
      hasDeadline: true,
      deadline: { $lt: now, $ne: null },
    }),
    Document.countDocuments({ healthStatus: "NEEDS_VERIFICATION" }),
  ]);

  return {
    scopeNotice: "Operational indicators do not represent legal or statutory violations.",
    items: [
      {
        id: "notifications_awaiting_review",
        title: "Notification candidates awaiting review",
        count: pendingNotifications,
        severity: pendingNotifications > 0 ? "HIGH" : "NORMAL",
        link: "/admin/notifications",
        actionLabel: "Review PDFs",
      },
      {
        id: "schemes_pending_verification",
        title: "Schemes pending verification",
        count: pendingVerificationSchemes,
        severity: pendingVerificationSchemes > 0 ? "HIGH" : "NORMAL",
        link: "/admin/schemes",
        actionLabel: "Verify Schemes",
      },
      {
        id: "schemes_missing_source",
        title: "Schemes missing official source URL",
        count: missingSourceUrlSchemes,
        severity: missingSourceUrlSchemes > 0 ? "MEDIUM" : "NORMAL",
        link: "/admin/schemes",
        actionLabel: "Add Official Source",
      },
      {
        id: "schemes_missing_gateway",
        title: "Schemes without official application gateway",
        count: missingGatewaySchemes,
        severity: missingGatewaySchemes > 0 ? "MEDIUM" : "NORMAL",
        link: "/admin/schemes",
        actionLabel: "Inspect Schemes",
      },
      {
        id: "schemes_review_due",
        title: "Schemes where verification review may be due",
        count: reviewDueSchemes,
        severity: "NORMAL",
        link: "/admin/schemes",
        actionLabel: "Audit Schemes",
      },
      {
        id: "expired_deadlines",
        title: "Schemes with passed application deadlines",
        count: expiredDeadlinesCount,
        severity: expiredDeadlinesCount > 0 ? "MEDIUM" : "NORMAL",
        link: "/admin/schemes",
        actionLabel: "Update Deadlines",
      },
      {
        id: "needs_verification_docs",
        title: "Citizen documents needing verification check",
        count: needsVerificationDocs,
        severity: "NORMAL",
        link: null,
        actionLabel: "Aggregate Only",
      },
    ],
  };
}

/**
 * 10. Recent Administrative Review Activity (Audit Logs)
 */
export async function getRecentAdminActivity(limit = 10) {
  const logs = await NotificationReviewLog.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("adminId", "name email role")
    .populate("notificationId", "fileName referenceNumber")
    .populate("schemeId", "name category")
    .select("-__v");

  return logs.map((log) => ({
    id: log._id,
    action: log.action,
    performedBy: log.adminId?.name || "System Administrator",
    role: log.adminId?.role || "admin",
    targetFile: log.notificationId?.fileName || (log.schemeId?.name ? `Scheme: ${log.schemeId.name}` : "Government PDF Circular"),
    details: log.notes || "",
    notes: log.notes || "",
    changedFields: log.changedFields || [],
    changesSummary: log.changedFields?.length ? { changedFields: log.changedFields } : {},
    timestamp: log.createdAt,
  }));
}

export default {
  buildDateQuery,
  getOverviewStats,
  getSchemeAnalytics,
  getApplicationAnalytics,
  getMatchingAnalytics,
  getReadinessAnalytics,
  getDocumentAnalytics,
  getNotificationAnalytics,
  getVoiceAnalytics,
  getAttentionRequired,
  getRecentAdminActivity,
};

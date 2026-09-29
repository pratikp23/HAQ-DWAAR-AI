import {
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
} from "../services/adminAnalyticsService.js";
import { getSystemHealth } from "../services/systemHealthService.js";

/**
 * @route   GET /api/admin/analytics/overview
 * @desc    Get aggregate high-level platform statistics
 * @access  Private (Admin Only)
 */
export const getOverview = async (req, res, next) => {
  try {
    const range = req.query.range || "all";
    const data = await getOverviewStats(range);
    return res.status(200).json({
      success: true,
      message: "Overview statistics retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/schemes
 * @desc    Get scheme inventory & quality indicators
 * @access  Private (Admin Only)
 */
export const getSchemes = async (req, res, next) => {
  try {
    const data = await getSchemeAnalytics();
    return res.status(200).json({
      success: true,
      message: "Scheme analytics retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/applications
 * @desc    Get citizen application tracker status breakdown & trends
 * @access  Private (Admin Only)
 */
export const getApplications = async (req, res, next) => {
  try {
    const range = req.query.range || "all";
    const data = await getApplicationAnalytics(range);
    return res.status(200).json({
      success: true,
      message: "Application tracker analytics retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/matching
 * @desc    Get deterministic matching evaluation outcomes
 * @access  Private (Admin Only)
 */
export const getMatching = async (req, res, next) => {
  try {
    const range = req.query.range || "all";
    const data = await getMatchingAnalytics(range);
    return res.status(200).json({
      success: true,
      message: "Matching analytics retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/readiness
 * @desc    Get aggregate readiness score distribution
 * @access  Private (Admin Only)
 */
export const getReadiness = async (req, res, next) => {
  try {
    const range = req.query.range || "all";
    const data = await getReadinessAnalytics(range);
    return res.status(200).json({
      success: true,
      message: "Readiness analytics retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/documents
 * @desc    Get document health & source distribution (strictly aggregate)
 * @access  Private (Admin Only)
 */
export const getDocuments = async (req, res, next) => {
  try {
    const range = req.query.range || "all";
    const data = await getDocumentAnalytics(range);
    return res.status(200).json({
      success: true,
      message: "Document analytics retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/notifications
 * @desc    Get in-app & simulated WhatsApp notification distribution
 * @access  Private (Admin Only)
 */
export const getNotifications = async (req, res, next) => {
  try {
    const range = req.query.range || "all";
    const data = await getNotificationAnalytics(range);
    return res.status(200).json({
      success: true,
      message: "Notification analytics retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/voice
 * @desc    Get Bhashini voice session statistics
 * @access  Private (Admin Only)
 */
export const getVoice = async (req, res, next) => {
  try {
    const range = req.query.range || "all";
    const data = await getVoiceAnalytics(range);
    return res.status(200).json({
      success: true,
      message: "Voice analytics retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/attention
 * @desc    Get operational queue of items requiring administrative attention
 * @access  Private (Admin Only)
 */
export const getAttention = async (req, res, next) => {
  try {
    const data = await getAttentionRequired();
    return res.status(200).json({
      success: true,
      message: "Operational attention items retrieved successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/system
 * @desc    Get system health and service configuration status
 * @access  Private (Admin Only)
 */
export const getSystem = async (req, res, next) => {
  try {
    const health = await getSystemHealth();
    return res.status(200).json({
      success: true,
      message: "System health retrieved successfully.",
      data: health,
      ...health,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/analytics/activity
 * @desc    Get recent administrative audit actions
 * @access  Private (Admin Only)
 */
export const getActivity = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
    const data = await getRecentAdminActivity(limit);
    return res.status(200).json({
      success: true,
      message: "Recent administrative activity retrieved successfully.",
      data: { activities: data },
      activities: data,
    });
  } catch (error) {
    next(error);
  }
};

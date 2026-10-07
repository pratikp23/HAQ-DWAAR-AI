import SchemeReport from "../models/SchemeReport.js";
import Scheme from "../models/Scheme.js";

/**
 * Citizen reports a suspicious or inaccurate scheme
 * POST /api/schemes/:id/report
 */
export const reportSchemeIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, description, reporterName, reporterEmail, severity } = req.body;

    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        message: "Reporting reason and a detailed description are required.",
      });
    }

    const scheme = await Scheme.findById(id);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "The scheme you are reporting was not found in the registry.",
      });
    }

    const report = await SchemeReport.create({
      schemeId: scheme._id,
      schemeName: scheme.name,
      reportedByUserId: req.user ? req.user._id : null,
      reporterName: reporterName || (req.user ? req.user.name : "Concerned Citizen"),
      reporterEmail: reporterEmail || (req.user ? req.user.email : ""),
      reason,
      description: description.trim(),
      severity: severity || "MEDIUM",
      status: "PENDING_INVESTIGATION",
    });

    // Increment scheme's reportedFraudCount
    scheme.reportedFraudCount = (scheme.reportedFraudCount || 0) + 1;
    if (scheme.reportedFraudCount >= 3) {
      scheme.isFlagged = true; // Auto-flag scheme for review if 3 or more citizens report it
    }
    await scheme.save();

    return res.status(201).json({
      success: true,
      message: "Grievance / report submitted successfully. Logged into the Chief Nodal Officer audit queue for verification.",
      data: {
        reportId: report._id,
        schemeName: report.schemeName,
        status: report.status,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating scheme report:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit report.",
    });
  }
};

/**
 * Super Admin & Chief Officer get list of all reported schemes
 * GET /api/admin/reports
 */
export const getSchemeReports = async (req, res) => {
  try {
    const { status, reason } = req.query;
    const query = {};
    if (status && status !== "ALL") query.status = status;
    if (reason && reason !== "ALL") query.reason = reason;

    // If category_admin, scope query strictly to schemes under their department
    if (req.user?.role === "category_admin" && req.user?.department) {
      const deptSchemes = await Scheme.find({ category: req.user.department }).select("_id");
      const deptSchemeIds = deptSchemes.map((s) => s._id);
      query.schemeId = { $in: deptSchemeIds };
    }

    const reports = await SchemeReport.find(query)
      .populate("schemeId", "name category state officialApplicationUrl verificationStatus isFlagged")
      .populate("reportedByUserId", "name email")
      .populate("investigatedByUserId", "name email")
      .sort({ createdAt: -1 });

    const countFilter = query.schemeId ? { schemeId: query.schemeId } : {};

    const counts = {
      pending: await SchemeReport.countDocuments({ ...countFilter, status: "PENDING_INVESTIGATION" }),
      resolved: await SchemeReport.countDocuments({ ...countFilter, status: { $in: ["VERIFIED_VALID", "SCHEME_UPDATED"] } }),
      delisted: await SchemeReport.countDocuments({ ...countFilter, status: "SCHEME_DELISTED" }),
    };

    return res.status(200).json({
      success: true,
      data: {
        reports,
        counts,
      },
    });
  } catch (error) {
    console.error("Error fetching scheme reports:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch grievance reports.",
    });
  }
};

/**
 * Super Admin resolves or acts on a citizen grievance report
 * PATCH /api/admin/reports/:id/resolve
 */
export const resolveSchemeReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, investigationNotes } = req.body;

    const report = await SchemeReport.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Grievance report not found.",
      });
    }

    report.investigatedByUserId = req.user._id;
    report.investigationNotes = investigationNotes || "";
    report.resolvedAt = new Date();

    const scheme = await Scheme.findById(report.schemeId);

    if (action === "DELIST_SCHEME" && scheme) {
      scheme.verificationStatus = "ARCHIVED";
      scheme.isFlagged = true;
      await scheme.save();
      report.status = "SCHEME_DELISTED";
    } else if (action === "VERIFIED_VALID" && scheme) {
      scheme.isFlagged = false;
      scheme.reportedFraudCount = Math.max(0, (scheme.reportedFraudCount || 1) - 1);
      await scheme.save();
      report.status = "VERIFIED_VALID";
    } else if (action === "SCHEME_UPDATED" && scheme) {
      scheme.isFlagged = false;
      await scheme.save();
      report.status = "SCHEME_UPDATED";
    } else {
      report.status = "DISMISSED";
    }

    await report.save();

    return res.status(200).json({
      success: true,
      message: `Report resolved with status: ${report.status}`,
      data: report,
    });
  } catch (error) {
    console.error("Error resolving scheme report:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to resolve report.",
    });
  }
};

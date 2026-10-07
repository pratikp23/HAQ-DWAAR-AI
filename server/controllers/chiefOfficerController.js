import OfficerApplication from "../models/OfficerApplication.js";
import User from "../models/User.js";
import Scheme from "../models/Scheme.js";
import bcrypt from "bcryptjs";

/**
 * Public/Applicant submits application for Category Admin rights
 * POST /api/officer/apply
 */
export const submitOfficerApplication = async (req, res) => {
  try {
    const {
      applicantName,
      email,
      phone,
      department,
      designation,
      officeLocation,
      govtIdType,
      govtIdNumber,
      govtIdDocumentUrl: bodyGovtIdDocUrl,
      employeeIdCardUrl,
      authorizationLetterUrl,
      postingOrderUrl,
      specimenSignatureUrl,
      justification,
    } = req.body;

    if (!applicantName || !email || !department || !designation || !officeLocation || !govtIdNumber) {
      return res.status(400).json({
        success: false,
        message: "All mandatory government identification fields must be provided.",
      });
    }

    // Check if an application is already pending for this email
    const existing = await OfficerApplication.findOne({
      email: email.toLowerCase(),
      status: "PENDING",
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An active verification application is already under review by the Chief Nodal Officer.",
      });
    }

    // Capture file upload path if document was uploaded
    const finalGovtIdDocumentUrl = req.file ? `/uploads/officers/${req.file.filename}` : (bodyGovtIdDocUrl || employeeIdCardUrl || "");

    const newApp = await OfficerApplication.create({
      applicantName: applicantName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : "",
      department: department.toUpperCase(),
      designation: designation.trim(),
      officeLocation: officeLocation.trim(),
      govtIdType: govtIdType || "EMPLOYEE_ID",
      govtIdNumber: govtIdNumber.trim(),
      govtIdDocumentUrl: finalGovtIdDocumentUrl,
      employeeIdCardUrl: employeeIdCardUrl || finalGovtIdDocumentUrl || "",
      authorizationLetterUrl: authorizationLetterUrl || "",
      postingOrderUrl: postingOrderUrl || "",
      specimenSignatureUrl: specimenSignatureUrl || "",
      justification: justification ? justification.trim() : "",
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully. Under active review by the Chief Nodal Verification Board.",
      data: {
        applicationId: newApp._id,
        applicantName: newApp.applicantName,
        status: newApp.status,
        department: newApp.department,
        createdAt: newApp.createdAt,
      },
    });
  } catch (error) {
    console.error("Error submitting officer application:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit officer application.",
    });
  }
};

/**
 * Chief Nodal Officer lists all officer applications
 * GET /api/chief/applications
 */
export const getOfficerApplications = async (req, res) => {
  try {
    const { status, department } = req.query;
    const query = {};
    if (status && status !== "ALL") query.status = status;
    if (department && department !== "ALL") query.department = department;

    const applications = await OfficerApplication.find(query)
      .populate("reviewedByChiefId", "name email")
      .populate("assignedUserId", "name email role officerStatus")
      .sort({ createdAt: -1 });

    const counts = {
      pending: await OfficerApplication.countDocuments({ status: "PENDING" }),
      approved: await OfficerApplication.countDocuments({ status: "APPROVED" }),
      rejected: await OfficerApplication.countDocuments({ status: "REJECTED" }),
    };

    return res.status(200).json({
      success: true,
      data: {
        applications,
        counts,
      },
    });
  } catch (error) {
    console.error("Error fetching officer applications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch officer applications.",
    });
  }
};

/**
 * Chief Nodal Officer approves an application and issues Category Admin license
 * PATCH /api/chief/applications/:id/approve
 */
export const approveOfficerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { initialPassword, reviewNotes } = req.body;

    const application = await OfficerApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Officer application record not found.",
      });
    }

    if (application.status === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "This officer license has already been approved and issued.",
      });
    }

    // Check if user already exists with this email
    let user = await User.findOne({ email: application.email });

    if (user) {
      // Upgrade existing user account to category_admin
      user.role = "category_admin";
      user.department = application.department;
      user.designation = application.designation;
      user.govtIdNumber = application.govtIdNumber;
      user.officerStatus = "ACTIVE_VERIFIED";
      user.verifiedByChief = req.user._id;
      if (initialPassword) {
        user.passwordHash = await bcrypt.hash(initialPassword, 10);
      }
      await user.save();
    } else {
      // Create new Category Admin account
      const password = initialPassword || "GovtOfficer@2026";
      const passwordHash = await bcrypt.hash(password, 10);

      user = await User.create({
        name: application.applicantName,
        email: application.email,
        passwordHash,
        role: "category_admin",
        department: application.department,
        designation: application.designation,
        govtIdNumber: application.govtIdNumber,
        officerStatus: "ACTIVE_VERIFIED",
        verifiedByChief: req.user._id,
      });
    }

    // Update Application Record
    application.status = "APPROVED";
    application.assignedUserId = user._id;
    application.reviewedByChiefId = req.user._id;
    application.reviewedAt = new Date();
    application.reviewNotes = reviewNotes || "Verified against government credential records.";
    await application.save();

    return res.status(200).json({
      success: true,
      message: `Officer approved successfully! Category Admin access granted for department: ${application.department}`,
      data: {
        applicationId: application._id,
        userId: user._id,
        email: user.email,
        department: user.department,
        status: "ACTIVE_VERIFIED",
      },
    });
  } catch (error) {
    console.error("Error approving officer application:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to approve officer license.",
    });
  }
};

/**
 * Chief Nodal Officer rejects an application
 * PATCH /api/chief/applications/:id/reject
 */
export const rejectOfficerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const application = await OfficerApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Officer application record not found.",
      });
    }

    application.status = "REJECTED";
    application.reviewedByChiefId = req.user._id;
    application.reviewedAt = new Date();
    application.reviewNotes = rejectionReason || "Government identity verification could not be authenticated.";
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Officer application has been officially rejected.",
      data: application,
    });
  } catch (error) {
    console.error("Error rejecting officer application:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reject officer application.",
    });
  }
};

/**
 * Chief Nodal Officer revokes or freezes an officer's admin license
 * PATCH /api/chief/officers/:id/revoke
 */
export const revokeOfficerLicense = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Officer user account not found.",
      });
    }

    user.officerStatus = "SUSPENDED";
    user.role = "citizen"; // Demote from category_admin to regular citizen
    await user.save();

    // Mark corresponding application as revoked if exists
    await OfficerApplication.updateMany(
      { assignedUserId: user._id },
      { status: "REVOKED", reviewNotes: reason || "Access revoked by Chief Nodal Verification Authority." }
    );

    return res.status(200).json({
      success: true,
      message: `Officer license for ${user.name} (${user.email}) has been revoked. Account demoted.`,
      data: {
        userId: user._id,
        officerStatus: user.officerStatus,
      },
    });
  } catch (error) {
    console.error("Error revoking officer license:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to revoke officer license.",
    });
  }
};

/**
 * Chief Nodal Officer & Super Admin list all registered Category Officers
 * GET /api/chief/officers
 */
export const getActiveOfficers = async (req, res) => {
  try {
    const { department, status } = req.query;
    const query = {
      role: { $in: ["category_admin", "super_admin", "chief_officer"] },
    };

    if (department && department !== "ALL") query.department = department;
    if (status && status !== "ALL") query.officerStatus = status;

    const officers = await User.find(query)
      .select("-passwordHash")
      .populate("verifiedByChief", "name email")
      .sort({ createdAt: -1 });

    // Attach count of managed schemes per officer
    const officersWithMetrics = await Promise.all(
      officers.map(async (officer) => {
        const schemeCount = await Scheme.countDocuments({
          $or: [
            { assignedOfficerId: officer._id },
            { category: officer.department },
          ],
        });
        return {
          ...officer.toObject(),
          managedSchemeCount: schemeCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        officers: officersWithMetrics,
        count: officersWithMetrics.length,
      },
    });
  } catch (error) {
    console.error("Error fetching active officers:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch officers list.",
    });
  }
};

/**
 * Super Admin or Chief Officer handles Officer Succession / Portfolio Transfer
 * POST /api/chief/officers/transfer-portfolio
 */
export const transferOfficerPortfolio = async (req, res) => {
  try {
    const { fromOfficerId, toOfficerId, department, transferReason } = req.body;

    if (!fromOfficerId || !toOfficerId) {
      return res.status(400).json({
        success: false,
        message: "Both outgoing and incoming officer IDs are required.",
      });
    }

    const fromOfficer = await User.findById(fromOfficerId);
    const toOfficer = await User.findById(toOfficerId);

    if (!fromOfficer || !toOfficer) {
      return res.status(404).json({
        success: false,
        message: "One or both officer profiles could not be found.",
      });
    }

    // Prepare query for schemes managed by the outgoing officer
    const filter = {
      $or: [
        { assignedOfficerId: fromOfficer._id },
        { verifiedBy: fromOfficer._id },
      ],
    };
    if (department && department !== "ALL") {
      filter.category = department.toUpperCase();
    }

    const affectedSchemes = await Scheme.find(filter);

    // Reassign all matching schemes to the incoming officer
    const updateResult = await Scheme.updateMany(filter, {
      $set: {
        assignedOfficerId: toOfficer._id,
        verifiedBy: toOfficer._id,
      },
    });

    // Optionally update outgoing officer status to RETIRED or SUSPENDED if requested
    if (req.body.retireOutgoingOfficer) {
      fromOfficer.officerStatus = "RETIRED";
      await fromOfficer.save();
    }

    return res.status(200).json({
      success: true,
      message: `Succession portfolio transferred successfully! ${updateResult.modifiedCount} schemes reassigned from ${fromOfficer.name} to ${toOfficer.name}.`,
      data: {
        reassignedCount: updateResult.modifiedCount,
        fromOfficer: { id: fromOfficer._id, name: fromOfficer.name, email: fromOfficer.email },
        toOfficer: { id: toOfficer._id, name: toOfficer.name, email: toOfficer.email },
        reason: transferReason || "Administrative succession or rotation.",
      },
    });
  } catch (error) {
    console.error("Error transferring officer portfolio:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to execute portfolio transfer.",
    });
  }
};


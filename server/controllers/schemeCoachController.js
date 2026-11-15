import { getSchemeCoachRoadmap } from "../services/schemeCoachService.js";
import { generatePrintableApplicationForm } from "../services/pdfFormService.js";
import ApplicationTracker from "../models/ApplicationTracker.js";
import Scheme from "../models/Scheme.js";

/**
 * GET /api/coach/:schemeId
 * Fetch full 6-stage SchemeCoach roadmap, pre-filled form fields, checklist, and audio prompts
 */
export async function getCoachRoadmap(req, res, next) {
  try {
    const { schemeId } = req.params;
    const userId = req.user.id;

    const roadmap = await getSchemeCoachRoadmap(userId, schemeId);

    return res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/coach/:schemeId/print-form
 * Return pre-filled official application HTML for browser printing / PDF generation
 */
export async function getPrintableForm(req, res, next) {
  try {
    const { schemeId } = req.params;
    const userId = req.user.id;

    const formResult = await generatePrintableApplicationForm(userId, schemeId);

    // If client requested json
    if (req.query.format === "json") {
      return res.status(200).json({
        success: true,
        data: formResult,
      });
    }

    // Default: render printable HTML directly to browser
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(formResult.html);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/coach/:schemeId/save-reference
 * Save citizen-reported government reference number to Application Tracker
 */
export async function saveOfficialReference(req, res, next) {
  try {
    const { schemeId } = req.params;
    const { referenceNumber, notes = "" } = req.body;
    const userId = req.user.id;

    if (!referenceNumber || !referenceNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reference number or acknowledgement ID is required.",
      });
    }

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found.",
      });
    }

    let application = await ApplicationTracker.findOne({ userId, schemeId });

    if (application) {
      application.status = "APPLIED";
      application.referenceNumber = referenceNumber.trim();
      application.submittedAt = new Date();
      application.lastUpdatedAt = new Date();
      if (notes) application.notes = notes.trim();
      await application.save();
    } else {
      application = await ApplicationTracker.create({
        userId,
        schemeId,
        status: "APPLIED",
        referenceNumber: referenceNumber.trim(),
        submissionType: "SELF_APPLIED",
        department: scheme.category || "GENERAL",
        startedAt: new Date(),
        submittedAt: new Date(),
        notes: notes.trim() || "Applied via official government portal with SchemeCoach guidance.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application reference number saved successfully to your tracker!",
      data: {
        application,
      },
    });
  } catch (error) {
    next(error);
  }
}

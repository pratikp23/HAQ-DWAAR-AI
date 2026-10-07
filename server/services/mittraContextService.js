import UserProfile from "../models/UserProfile.js";
import Document from "../models/Document.js";
import ApplicationTracker from "../models/ApplicationTracker.js";
import Scheme from "../models/Scheme.js";
import { evaluateScheme } from "./matchingService.js";

/**
 * HAQ DWAAR AI — MITTRA Context Service
 * 
 * Aggregates a sanitized, privacy-safe snapshot of the citizen's current state:
 * - Benefit Passport profile summary (name, age, state, category, occupation)
 * - Document health summary (counts of valid, missing, needs verification)
 * - Tracked applications summary
 * - Top deterministic matched schemes
 */

export async function getCitizenContextSnapshot(userId) {
  try {
    const profile = await UserProfile.findOne({ userId }).lean();
    const documents = await Document.find({ userId }).lean();
    const applications = await ApplicationTracker.find({ userId }).populate("schemeId", "name category").lean();

    // Get recommendations deterministically using verified schemes
    let topSchemes = [];
    try {
      const schemes = await Scheme.find({ verificationStatus: "VERIFIED" }).limit(15).lean();
      const evaluated = schemes.map((sch) => {
        const evalRes = evaluateScheme(profile || {}, sch);
        return {
          id: sch._id,
          name: sch.name,
          category: sch.category,
          benefitSummary: sch.benefitSummary,
          matchScore: evalRes.matchScore,
          officialApplicationUrl: sch.officialApplicationUrl || "",
          matchedReasons: evalRes.explanation?.matchedReasons || [],
          missingInformation: evalRes.explanation?.missingInformation || [],
        };
      });
      evaluated.sort((a, b) => b.matchScore - a.matchScore);
      topSchemes = evaluated.slice(0, 4);
    } catch (_) {
      // Graceful fallback if matching service has temporary issue
    }

    // Document Health summary
    const docSummary = {
      total: documents.length,
      valid: documents.filter((d) => d.healthStatus === "VALID" || d.status === "VERIFIED").length,
      needsVerification: documents.filter((d) => d.healthStatus === "NEEDS_VERIFICATION").length,
      typesPresent: documents.map((d) => d.documentType),
    };

    // Profile summary
    const profileSummary = {
      isComplete: (profile?.profileCompleteness || 0) >= 80,
      completeness: profile?.profileCompleteness || 0,
      age: profile?.personal?.age || null,
      gender: profile?.personal?.gender || null,
      category: profile?.personal?.category || null,
      state: profile?.location?.state || null,
      district: profile?.location?.district || null,
      qualification: profile?.education?.qualification || null,
      occupationType: profile?.occupation?.occupationType || null,
      annualIncome: profile?.occupation?.annualIncome || null,
      isFarmer: profile?.kisanDetails?.isFarmer || false,
    };

    return {
      profileSummary,
      docSummary,
      activeApplicationsCount: applications.length,
      trackedApplications: applications.map((a) => ({
        id: a._id,
        schemeName: a.schemeId?.name || "Government Scheme",
        status: a.status,
        referenceNumber: a.referenceNumber || null,
      })),
      topSchemes,
    };
  } catch (err) {
    console.error("Error generating citizen context snapshot:", err);
    return {
      profileSummary: {},
      docSummary: { total: 0, valid: 0, needsVerification: 0, typesPresent: [] },
      activeApplicationsCount: 0,
      trackedApplications: [],
      topSchemes: [],
    };
  }
}

/**
 * Deterministically calculates a citizen profile completeness percentage (0 - 100).
 * Evaluates core sections: Personal, Location, Education, Occupation, Needs, and Preferences.
 *
 * @param {Object} profile - UserProfile object or plain object
 * @returns {number} completenessPercentage - Integer between 0 and 100
 */
export const calculateProfileCompleteness = (profile) => {
  if (!profile) return 0;

  let score = 0;

  // 1. Personal Information (Max: 20 pts)
  const personal = profile.personal || {};
  if (typeof personal.age === "number" && personal.age > 0 && personal.age <= 125) {
    score += 6;
  }
  if (personal.gender && typeof personal.gender === "string" && personal.gender.trim()) {
    score += 6;
  }
  if (personal.category && typeof personal.category === "string" && personal.category.trim()) {
    score += 5;
  }
  if (typeof personal.differentlyAbled === "boolean") {
    score += 3;
  }

  // 2. Location Information (Max: 20 pts)
  const location = profile.location || {};
  if (location.state && location.state.trim()) {
    score += 8;
  }
  if (location.district && location.district.trim()) {
    score += 6;
  }
  if (location.city && location.city.trim()) {
    score += 3;
  }
  if (location.areaType && location.areaType.trim()) {
    score += 3;
  }

  // 3. Education Information (Max: 15 pts)
  const education = profile.education || {};
  if (education.qualification && education.qualification.trim()) {
    score += 10;
  }
  if (
    (education.currentCourse && education.currentCourse.trim()) ||
    (education.institution && education.institution.trim())
  ) {
    score += 5;
  }

  // 4. Occupation & Income Information (Max: 20 pts)
  const occupation = profile.occupation || {};
  if (occupation.occupationType && occupation.occupationType.trim()) {
    score += 10;
  }
  if (
    occupation.incomeRange ||
    (typeof occupation.annualIncome === "number" && occupation.annualIncome >= 0)
  ) {
    score += 10;
  }

  // 5. Citizen Needs / Benefit Goals (Max: 15 pts)
  const needs = Array.isArray(profile.needs) ? profile.needs : [];
  if (needs.length > 0) {
    score += 15;
  }

  // 6. Preferences (Max: 10 pts)
  const preferences = profile.preferences || {};
  if (preferences.preferredLanguage && preferences.preferredLanguage.trim()) {
    score += 5;
  }
  if (typeof preferences.notificationConsent === "boolean") {
    score += 5;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * HAQ DWAAR AI — Deadline Service
 * 
 * Evaluates trusted scheme deadlines, computes days remaining in Indian Standard Time,
 * and categorizes deadline urgency without inventing or hallucinating times.
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+05:30

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Returns the current date in IST midnight (00:00:00.000)
 */
export function getNowIST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + IST_OFFSET_MS);
  return new Date(Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate()));
}

/**
 * Formats a Date object as human-readable Indian date: "15 October 2026"
 */
export function formatIndianDate(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const ist = new Date(utc + IST_OFFSET_MS);
  const day = ist.getUTCDate();
  const month = MONTH_NAMES[ist.getUTCMonth()];
  const year = ist.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Evaluates a trusted deadline date against current date in IST
 * 
 * @param {Date|string} deadlineDate 
 * @returns {Object} Evaluation details
 */
export function evaluateDeadline(deadlineDate) {
  if (!deadlineDate) {
    return {
      hasDeadline: false,
      state: "NO_DEADLINE",
      daysRemaining: null,
      formattedDate: "",
      notificationWindow: null,
      isExpired: false,
      isUrgent: false,
    };
  }

  const d = new Date(deadlineDate);
  if (isNaN(d.getTime())) {
    return {
      hasDeadline: false,
      state: "NO_DEADLINE",
      daysRemaining: null,
      formattedDate: "",
      notificationWindow: null,
      isExpired: false,
      isUrgent: false,
    };
  }

  // Normalize target deadline date to IST midnight
  const utcTarget = d.getTime() + d.getTimezoneOffset() * 60000;
  const istTarget = new Date(utcTarget + IST_OFFSET_MS);
  const targetMidnight = new Date(Date.UTC(istTarget.getUTCFullYear(), istTarget.getUTCMonth(), istTarget.getUTCDate()));

  const nowMidnight = getNowIST();
  const diffMs = targetMidnight.getTime() - nowMidnight.getTime();
  const daysRemaining = Math.round(diffMs / (24 * 60 * 60 * 1000));

  let state = "UPCOMING";
  let notificationWindow = null;
  let isExpired = false;
  let isUrgent = false;

  if (daysRemaining < 0) {
    state = "EXPIRED";
    isExpired = true;
  } else if (daysRemaining === 0) {
    state = "TODAY";
    notificationWindow = "0_DAYS";
    isUrgent = true;
  } else if (daysRemaining <= 1) {
    state = "SOON";
    notificationWindow = "1_DAY";
    isUrgent = true;
  } else if (daysRemaining <= 3) {
    state = "SOON";
    notificationWindow = "3_DAYS";
    isUrgent = true;
  } else if (daysRemaining <= 7) {
    state = "APPROACHING";
    notificationWindow = "7_DAYS";
    isUrgent = false;
  } else if (daysRemaining <= 15) {
    state = "APPROACHING";
    notificationWindow = "15_DAYS";
    isUrgent = false;
  } else {
    state = "UPCOMING";
    isUrgent = false;
  }

  return {
    hasDeadline: true,
    state,
    daysRemaining,
    formattedDate: formatIndianDate(d),
    notificationWindow,
    isExpired,
    isUrgent,
    deadlineDate: d,
  };
}

/**
 * Convenience helper to compute days remaining
 */
export function calculateDaysRemaining(deadlineDate) {
  const evalRes = evaluateDeadline(deadlineDate);
  return evalRes.daysRemaining;
}

/**
 * Classifies deadline state from days remaining
 */
export function classifyDeadlineState(daysRemaining) {
  if (daysRemaining === null || daysRemaining === undefined) return { state: "NO_DEADLINE", isExpired: false, isUrgent: false };
  if (daysRemaining < 0) return { state: "EXPIRED", isExpired: true, isUrgent: false };
  if (daysRemaining === 0) return { state: "TODAY", isExpired: false, isUrgent: true };
  if (daysRemaining <= 3) return { state: "SOON", isExpired: false, isUrgent: true };
  if (daysRemaining <= 15) return { state: "APPROACHING", isExpired: false, isUrgent: false };
  return { state: "UPCOMING", isExpired: false, isUrgent: false };
}

/**
 * Maps days remaining to alert notification window
 */
export function getDeadlineNotificationWindow(daysRemaining) {
  if (daysRemaining === null || daysRemaining === undefined || daysRemaining < 0) return null;
  if (daysRemaining === 0) return "0_DAYS";
  if (daysRemaining === 1) return "1_DAY";
  if (daysRemaining <= 3) return "3_DAYS";
  if (daysRemaining <= 7) return "7_DAYS";
  if (daysRemaining <= 15) return "15_DAYS";
  return null;
}

export const formatISTDate = formatIndianDate;


/**
 * LOK SAMARTH — User-Centric Error Sanitizer
 * 
 * Intercepts technical developer errors, raw exceptions, HTTP codes, and database errors,
 * converting them into warm, reassuring, citizen-focused explanations.
 * 
 * ZERO developer errors or coding jargon are ever exposed to the user.
 */

export function formatUserError(err, context = "general") {
  // If already sanitized user-centric string or null
  if (!err) {
    return {
      title: "Action Needed",
      message: "Please verify your information and try again.",
      actionLabel: "Try Again"
    };
  }

  // Extract raw text from various error representations
  const rawMsg = (
    typeof err === "string" 
      ? err 
      : err?.message || err?.response?.data?.message || err?.data?.message || ""
  ).toLowerCase();

  const status = err?.status || err?.response?.status;
  const code = err?.code || err?.response?.data?.code || "";

  // 1. Network / Connectivity / Server Offline
  if (
    rawMsg.includes("network") || 
    rawMsg.includes("connection") || 
    rawMsg.includes("failed to fetch") || 
    rawMsg.includes("econnrefused") ||
    rawMsg.includes("timeout") ||
    code === "ERR_NETWORK" ||
    code === "ECONNABORTED"
  ) {
    return {
      title: "Connection Unreachable",
      message: "Unable to connect to the citizen gateway. Please verify your internet connection or try again in a few moments.",
      actionLabel: "Retry Connection"
    };
  }

  // 2. Authentication / Session Expiration
  if (
    status === 401 || 
    rawMsg.includes("unauthorized") || 
    rawMsg.includes("jwt") || 
    rawMsg.includes("token") ||
    rawMsg.includes("session expired")
  ) {
    return {
      title: "Session Expired",
      message: "For your security, your authenticated session has timed out. Please sign in again to continue.",
      actionLabel: "Sign In Again",
      actionRoute: "/login"
    };
  }

  // 3. Permission / Access Denied
  if (
    status === 403 || 
    rawMsg.includes("forbidden") || 
    rawMsg.includes("not allowed") || 
    rawMsg.includes("access denied")
  ) {
    return {
      title: "Access Restricted",
      message: "You do not have permission to view this section. Please ensure your citizen profile has the required role.",
      actionLabel: "Return to Dashboard",
      actionRoute: "/dashboard"
    };
  }

  // 4. Resource Not Found
  if (status === 404 || rawMsg.includes("not found")) {
    if (context === "scheme") {
      return {
        title: "Scheme Not Available",
        message: "The requested welfare scheme could not be located. It may have concluded or been updated in the gazette.",
        actionLabel: "Browse Schemes",
        actionRoute: "/browse-schemes"
      };
    }
    if (context === "document") {
      return {
        title: "Document Not Located",
        message: "This certificate record is no longer available in your vault. You can upload a new copy anytime.",
        actionLabel: "Open Vault",
        actionRoute: "/dashboard/documents"
      };
    }
    return {
      title: "Information Not Found",
      message: "The requested citizen record or page could not be found. Please check your dashboard.",
      actionLabel: "Return to Dashboard",
      actionRoute: "/dashboard"
    };
  }

  // 5. File Upload / Document Vault Errors
  if (context === "document" || rawMsg.includes("upload") || rawMsg.includes("file") || status === 413 || status === 415) {
    if (rawMsg.includes("size") || status === 413) {
      return {
        title: "File Exceeds Limit",
        message: "Your file is too large to process. Please ensure your PDF or image certificate is under 5 MB.",
        actionLabel: "Select Smaller File"
      };
    }
    if (rawMsg.includes("type") || rawMsg.includes("format") || status === 415) {
      return {
        title: "Unsupported File Format",
        message: "Please upload your document in a standard format: PDF, JPG, or PNG.",
        actionLabel: "Choose Format"
      };
    }
    return {
      title: "Document Upload Failed",
      message: "We were unable to secure this document to your vault right now. Please try re-selecting your file.",
      actionLabel: "Try Again"
    };
  }

  // 6. Application Submission / Tracking Errors
  if (context === "application" || rawMsg.includes("application")) {
    return {
      title: "Submission Pending",
      message: "We could not transmit your application to the nodal department right now. Your entries are saved safely in your passport.",
      actionLabel: "Retry Submission"
    };
  }

  // 7. Backend Database / Server 500 / Technical Jargon
  if (
    status >= 500 || 
    rawMsg.includes("mongo") || 
    rawMsg.includes("cast to") || 
    rawMsg.includes("internal server") || 
    rawMsg.includes("cannot read") ||
    rawMsg.includes("syntaxerror")
  ) {
    return {
      title: "Gateway Updating",
      message: "The national welfare service is currently processing a high volume of requests. Please try again shortly.",
      actionLabel: "Try Again"
    };
  }

  // 8. Default Safe Human Fallback
  return {
    title: "Request Could Not Be Completed",
    message: "Something unexpected occurred while processing your request. Please try again or refresh the page.",
    actionLabel: "Try Again"
  };
}

export default formatUserError;

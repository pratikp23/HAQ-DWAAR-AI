/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles - Array of roles permitted to access the route
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required before role verification.",
        code: "AUTH_REQUIRED",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Required role: " + allowedRoles.join(" or ") + ", your role: " + req.user.role,
        code: "FORBIDDEN",
      });
    }

    next();
  };
};

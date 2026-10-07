/**
 * HAQ DWAAR AI — Multi-Tier Role-Based Access Control (RBAC) & Scope Enforcement
 * 
 * Hierarchy:
 * - chief_officer: High-level Nodal Officer (Security & Admin Vetting Authority)
 * - super_admin: Platform Operations & Cross-Category Monitor (also legacy 'admin')
 * - category_admin: Departmental Officer (Sandboxed strictly to their assigned department)
 * - citizen: General public user
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

    const userRole = req.user.role;

    // Legacy 'admin' is treated as super_admin for full backwards compatibility
    const effectiveRoles = [userRole];
    if (userRole === "admin" || userRole === "super_admin") {
      effectiveRoles.push("admin", "super_admin");
    }
    if (userRole === "chief_officer") {
      effectiveRoles.push("chief_officer", "super_admin", "admin");
    }

    const hasPermission = allowedRoles.some((role) => effectiveRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role: ${allowedRoles.join(" or ")}, your role: ${userRole}`,
        code: "FORBIDDEN",
      });
    }

    next();
  };
};

/**
 * Ensures Category Admins can ONLY modify or manage schemes matching their assigned department
 * Super Admins and Chief Officers bypass this check (unrestricted oversight)
 */
export const requireDepartmentScope = (targetCategoryExtractor) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
        code: "AUTH_REQUIRED",
      });
    }

    // Super Admins and Chief Officers have cross-department oversight
    if (req.user.role === "super_admin" || req.user.role === "chief_officer" || req.user.role === "admin") {
      return next();
    }

    // For Category Admins: verify department scope
    if (req.user.role === "category_admin") {
      const userDept = req.user.department;
      if (!userDept) {
        return res.status(403).json({
          success: false,
          message: "No government department is assigned to your officer account.",
          code: "NO_DEPARTMENT_ASSIGNED",
        });
      }

      let targetCategory = typeof targetCategoryExtractor === "function" 
        ? targetCategoryExtractor(req)
        : req.body?.category || req.query?.category;

      if (!targetCategory && req.params?.id) {
        try {
          const Scheme = (await import("../models/Scheme.js")).default;
          const scheme = await Scheme.findById(req.params.id).select("category");
          if (scheme) {
            targetCategory = scheme.category;
          }
        } catch (err) {
          // ignore lookup error, will be handled by controller
        }
      }

      if (targetCategory && targetCategory.toUpperCase() !== userDept.toUpperCase() && userDept !== "ALL") {
        return res.status(403).json({
          success: false,
          message: `Access restricted. You are authorized only for department '${userDept}', cannot manage category '${targetCategory}'.`,
          code: "DEPARTMENT_SCOPE_MISMATCH",
        });
      }
    }

    next();
  };
};

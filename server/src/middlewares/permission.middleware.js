import { permissions } from "../config/permissions.js";
import { ApiError } from "../utils/ApiError.js";

export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized: Authentication required");
      }

      const isDemo = req.user.isDemo || req.user.role === "demo";
      const role = req.user.role || "user";

      // If demo mode, they are restricted to read-only ("view" permission)
      const userPermissions = isDemo ? permissions.demo : (permissions[role] || []);

      if (!userPermissions.includes(requiredPermission)) {
        if (isDemo) {
          throw new ApiError(403, "Action disabled in demo mode");
        }
        throw new ApiError(403, "Access Denied: Insufficient permissions");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

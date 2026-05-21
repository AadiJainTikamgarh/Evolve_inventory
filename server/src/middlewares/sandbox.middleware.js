import { Components } from "../models/component.model.js";
import { Requests } from "../models/request.model.js";
import { ApiError } from "../utils/ApiError.js";

export const sandboxComponent = async (req, res, next) => {
  try {
    const isDemo = req.user?.isDemo || req.user?.role === "demo";
    if (!isDemo) return next();

    if (req.method === "POST") {
      // Allow demo users to create temporary components tagged with isDemo/createdBy
      req.body.isDemo = true;
      req.body.createdBy = "demo";
      return next();
    }

    if (req.method === "PUT") {
      // Allow demo users to update components ONLY if it is a demo component
      const componentId = req.body.id;
      if (!componentId) return next();

      const component = await Components.findById(componentId);
      if (!component || !component.isDemo) {
        throw new ApiError(403, "Action disabled in demo mode");
      }

      req.body.isDemo = true; // Ensure isDemo remains true
      return next();
    }

    if (req.method === "DELETE") {
      // Allow demo users to delete components ONLY if it is a demo component
      const componentId = req.params.id;
      if (!componentId) return next();

      const component = await Components.findById(componentId);
      if (!component || !component.isDemo) {
        throw new ApiError(403, "Action disabled in demo mode");
      }
      return next();
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const sandboxRequest = async (req, res, next) => {
  try {
    const isDemo = req.user?.isDemo || req.user?.role === "demo";
    if (!isDemo) return next();

    if (req.method === "POST") {
      // Allow demo users to create requests ONLY if the target component is a demo component
      const { componentId } = req.body;
      if (!componentId) return next();

      const component = await Components.findById(componentId);
      if (!component || !component.isDemo) {
        throw new ApiError(403, "Action disabled in demo mode");
      }

      req.body.isDemo = true;
      return next();
    }

    if (req.method === "PATCH") {
      // Allow demo users to approve/reject requests ONLY if the request is a demo request
      const { reqId } = req.params;
      if (!reqId) return next();

      const request = await Requests.findById(reqId);
      if (!request || !request.isDemo) {
        throw new ApiError(403, "Action disabled in demo mode");
      }
      return next();
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const restrictDemoGeneral = (req, res, next) => {
  const isDemo = req.user?.isDemo || req.user?.role === "demo";
  if (isDemo && req.method !== "GET") {
    throw new ApiError(403, "Action disabled in demo mode");
  }
  next();
};

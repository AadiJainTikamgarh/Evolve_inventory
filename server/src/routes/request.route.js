import { Router } from "express";
import {
  createRequestController,
  componentRequestController,
  getComponentRequestController,
  getUserRequestController,
  componentSubmitController,
  getReqByComp_UsrController,
  getAllRequestsController,
} from "../controllers/request.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";
import { sandboxRequest } from "../middlewares/sandbox.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, sandboxRequest, createRequestController);
router.route("/component-request/:reqId").patch(verifyJWT, checkPermission("edit"), sandboxRequest, componentRequestController);
router.route("/component-submit/:reqId").patch(verifyJWT, checkPermission("edit"), sandboxRequest, componentSubmitController);
router.route("/component/:componentId").get(verifyJWT, checkPermission("view_all_requests"), getComponentRequestController);
router.route("/user").get(verifyJWT, getUserRequestController);
router.route("/component/:componentId/user").get(verifyJWT, getReqByComp_UsrController);
router.route("/all").get(verifyJWT, checkPermission("view_all_requests"), getAllRequestsController);

export default router;

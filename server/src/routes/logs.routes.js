import { Router } from "express";
import {
  getAllLogsController,
  getUserLogsController,
} from "../controllers/logs.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

const router = Router();

router.route("/all").get(verifyJWT, checkPermission("view"), getAllLogsController);
router.route("/user").get(verifyJWT, getUserLogsController);

export default router;

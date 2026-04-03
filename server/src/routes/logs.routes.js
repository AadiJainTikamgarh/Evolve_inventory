import { Router } from "express";
import {
  getAllLogsController,
  getUserLogsController,
} from "../controllers/logs.controller.js";
import { verifyJWT, verifyManager } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/all").get(verifyJWT, verifyManager, getAllLogsController);
router.route("/user").get(verifyJWT, getUserLogsController);

export default router;

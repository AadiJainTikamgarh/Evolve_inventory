import { Router } from "express";
import { healthCheckController } from "../controllers/healthCheck.controller.js";

const router = Router();

router.get("/", healthCheckController);

export default router;
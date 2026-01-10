import { Router } from "express";
import { healthCheckController } from "../controllers/healthCheck.controller";

const router = Router();

router.get("/", healthCheckController);

export default router;
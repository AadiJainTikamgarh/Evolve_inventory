import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { verifyJWT, verifyManager } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);
// Get All Users (Manager Only)
router.route("/").get(verifyJWT, verifyManager, getAllUsers);

export default router;

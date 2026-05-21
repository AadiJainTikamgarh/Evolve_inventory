import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  resetUserPassword,
  changePassword
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";
import { restrictDemoGeneral } from "../middlewares/sandbox.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/reset-password").post(verifyJWT, checkPermission("manage_users"), restrictDemoGeneral, resetUserPassword); // Add this line for password reset
router.route("/change-password").post(verifyJWT, restrictDemoGeneral, changePassword); // Add this line for password change

router.route("/logout").post(verifyJWT, logoutUser);
// Get All Users (Manager Only)
router.route("/").get(verifyJWT, checkPermission("manage_users"), getAllUsers);

export default router;

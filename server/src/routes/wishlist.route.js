import { Router } from "express";
import {
  addWishlistEmailController,
  updateWishlistEmailController,
  deleteWishlistEmailController,
} from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";
import { restrictDemoGeneral } from "../middlewares/sandbox.middleware.js";

const router = Router();

router.route("/add").post(verifyJWT, checkPermission("manage_users"), restrictDemoGeneral, addWishlistEmailController);
router
  .route("/update/:email")
  .patch(verifyJWT, checkPermission("manage_users"), restrictDemoGeneral, updateWishlistEmailController);
router
  .route("/:email")
  .delete(verifyJWT, checkPermission("manage_users"), restrictDemoGeneral, deleteWishlistEmailController);

export default router;

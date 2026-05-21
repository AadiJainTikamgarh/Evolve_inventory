import { Router } from "express";
import {
  createComponent,
  deleteComponent,
  getComponentById,
  updateComponent,
  getComponentWithCategory,
  autocompleteComponents,
  searchComponentsWithPagination,
  getAllComponentsWithPagination,
  getLabStats,
} from "../controllers/component.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";
import { sandboxComponent } from "../middlewares/sandbox.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, checkPermission("create"), sandboxComponent, createComponent);
router.route("/update").put(verifyJWT, checkPermission("edit"), sandboxComponent, updateComponent);
router.route("/:id").delete(verifyJWT, checkPermission("delete"), sandboxComponent, deleteComponent);
router.route("/category").get(verifyJWT, getComponentWithCategory);
router.route("/autocomplete").get(verifyJWT, autocompleteComponents);
router.route("/all").get(verifyJWT, getAllComponentsWithPagination);
router.route("/search").get(verifyJWT, searchComponentsWithPagination);
router.route("/stats/lab").get(verifyJWT, getLabStats);
router.route("/:id").get(verifyJWT, getComponentById);

export default router;

import { Router } from "express";
import {
  createComponent,
  deleteComponent,
  getComponentById,
  updateComponent,
} from "../controllers/component.controller";

const router = Router();

router.post("/create", createComponent);
router.put("/update/:id", updateComponent);
router.delete("/:id", deleteComponent);
router.get("/:id", getComponentById);
router.get("/category", getComponentWithCategory);
router.get("/autocomplete", autocompleteComponents);
router.get("/search", searchComponentsWithPagination);

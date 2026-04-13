import { Router } from "express";
import {
  getEventCategoryByIdController,
  getAllEventCategoriesController,
} from "@/infrastructure/container";

const router = Router();

router.get("/", getAllEventCategoriesController.handle);
router.get("/:id", getEventCategoryByIdController.handle);

export { router as EventCategoryRoute };

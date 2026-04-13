import { Router } from "express";
import {
  createEventController,
  updateEventController,
  getEventByIdController,
  getEventsByCursorController,
  deleteEventController,
  authenticationMiddleware,
} from "@/infrastructure/container";

const router = Router();

router.get("/", getEventsByCursorController.handle);
router.get("/:id", getEventByIdController.handle);
router.post("/", authenticationMiddleware.handle, createEventController.handle);
router.patch(
  "/:id",
  authenticationMiddleware.handle,
  updateEventController.handle
);
router.delete(
  "/:id",
  authenticationMiddleware.handle,
  deleteEventController.handle
);

export { router as EventRoute };

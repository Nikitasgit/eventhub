import { Router } from "express";
import {
  authenticationMiddleware,
  getEventsStatisticsController,
  recordEventViewController,
} from "@/infrastructure/container";

const router = Router();

router.post("/event-view", recordEventViewController.handle);
router.get(
  "/event-statistics",
  authenticationMiddleware.handle,
  getEventsStatisticsController.handle,
);

export { router as AnalyticsRoute };

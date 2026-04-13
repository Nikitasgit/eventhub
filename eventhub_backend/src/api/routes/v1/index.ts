import { Router } from "express";
import { AuthRoute } from "./auth.routes";
import { EventRoute } from "./event.routes";
import { EventCategoryRoute } from "./event-category.routes";
import { a2fRouter } from "./a2f.routes";
import { AnalyticsRoute } from "./analytics.routes";

const router = Router();

router.use("/auth", AuthRoute);
router.use("/events", EventRoute);
router.use("/event-categories", EventCategoryRoute);
router.use("/a2f", a2fRouter);
router.use("/analytics", AnalyticsRoute);

export { router as V1Route };

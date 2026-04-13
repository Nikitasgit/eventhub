import { Router } from "express";
import { V1Route } from "./v1";

const router = Router();

router.use("/v1", V1Route);

export { router as ApiRoutes };

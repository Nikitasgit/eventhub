import { Router } from "express";
import {
  authenticationMiddleware,
  qrCodeController,
  enableTwoFactorAuthController,
  disableTwoFactorAuthController,
} from "@/infrastructure/container";

const router = Router();

router.use(authenticationMiddleware.handle);

router.get("/qr-code", qrCodeController.handle);
router.post("/enable", enableTwoFactorAuthController.handle);
router.post("/disable", disableTwoFactorAuthController.handle);

export { router as a2fRouter };

import { Router } from "express";
import {
  loginController,
  registerController,
  logoutController,
  meController,
  verifyTwoFactorAuthController,
  verifyBackupCodeController,
  authenticationMiddleware,
} from "@/infrastructure/container";
import { twoFactorRateLimit } from "@/api/middlewares/two-factor-rate-limit.middleware";

const router = Router();

router.post("/register", registerController.handle);
router.post("/login", loginController.handle);
router.post("/verify-2fa", twoFactorRateLimit, verifyTwoFactorAuthController.handle);
router.post("/verify-backup-code", twoFactorRateLimit, verifyBackupCodeController.handle);
router.post("/logout", logoutController.handle);
router.get("/me", authenticationMiddleware.handle, meController.handle);

export { router as AuthRoute };

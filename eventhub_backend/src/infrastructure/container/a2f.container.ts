import { QrCodeService } from "@/infrastructure/services/qr-code-generator.service";
import { BackupCodeService } from "@/infrastructure/services/backup-code.service";
import {
  QrCodeController,
  EnableTwoFactorAuthController,
  DisableTwoFactorAuthController,
} from "@/api/controllers/v1/a2f";
import { EnableTwoFactorAuthUseCase } from "@/application/usecases/user/enable-two-factor-auth.usecase";
import { DisableTwoFactorAuthUseCase } from "@/application/usecases/user/disable-two-factor-auth.usecase";
import { MongoUserRepository, MongoOtpBackupCodeRepository } from "@/infrastructure/repositories";
import { getEnvVariable } from "@/api/utils/shared";

const appName = getEnvVariable("APP_NAME");

export const qrCodeService = new QrCodeService(appName);
export const backupCodeService = new BackupCodeService();
export const qrCodeController = new QrCodeController();

const userRepository = new MongoUserRepository();
const otpBackupCodeRepository = new MongoOtpBackupCodeRepository();

const enableTwoFactorAuthUseCase = new EnableTwoFactorAuthUseCase(
  userRepository,
  otpBackupCodeRepository,
  backupCodeService,
);
const disableTwoFactorAuthUseCase = new DisableTwoFactorAuthUseCase(
  userRepository,
  otpBackupCodeRepository,
);

export const enableTwoFactorAuthController = new EnableTwoFactorAuthController(
  enableTwoFactorAuthUseCase
);

export const disableTwoFactorAuthController = new DisableTwoFactorAuthController(
  disableTwoFactorAuthUseCase
);

import {
  LoginController,
  RegisterController,
  LogoutController,
  MeController,
  VerifyTwoFactorAuthController,
  VerifyBackupCodeController,
} from "@/api/controllers/v1/auth";
import {
  LoginUserUseCase,
  RegisterUserUseCase,
  VerifyTwoFactorAuthUseCase,
  VerifyBackupCodeUseCase,
} from "@/application/usecases/user";
import { MongoUserRepository, MongoOtpBackupCodeRepository } from "@/infrastructure/repositories";
import { BackupCodeService } from "@/infrastructure/services/backup-code.service";

const userRepository = new MongoUserRepository();
const otpBackupCodeRepository = new MongoOtpBackupCodeRepository();
const backupCodeService = new BackupCodeService();

const loginUseCase = new LoginUserUseCase(userRepository);
const registerUseCase = new RegisterUserUseCase(userRepository);
const verifyTwoFactorAuthUseCase = new VerifyTwoFactorAuthUseCase(userRepository);
const verifyBackupCodeUseCase = new VerifyBackupCodeUseCase(
  userRepository,
  otpBackupCodeRepository,
  backupCodeService,
);

export const loginController = new LoginController(loginUseCase);
export const registerController = new RegisterController(registerUseCase);
export const verifyTwoFactorAuthController = new VerifyTwoFactorAuthController(
  verifyTwoFactorAuthUseCase,
);
export const verifyBackupCodeController = new VerifyBackupCodeController(
  verifyBackupCodeUseCase,
);
export const logoutController = new LogoutController();
export const meController = new MeController();

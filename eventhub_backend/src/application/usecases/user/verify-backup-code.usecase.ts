import type { IUserRepository } from "@/domain/interfaces/user-repository.interface";
import type { IOtpBackupCodeRepository } from "@/domain/interfaces/otp-backup-code-repository.interface";
import type { IBackupCodeGenerator } from "@/domain/interfaces/backup-code-generator.interface";
import { verifyTempToken, generateToken } from "@/api/utils/auth";
import { getCodesArray } from "@/domain/utils/otp-backup-code.utils";

export interface VerifyBackupCodeInput {
  tempToken: string;
  code: string;
}

export interface VerifyBackupCodeOutput {
  id: string;
  email: string;
  role: string;
  token: string;
}

export class VerifyBackupCodeUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpBackupCodeRepository: IOtpBackupCodeRepository,
    private backupCodeGenerator: IBackupCodeGenerator,
  ) {}

  async execute(input: VerifyBackupCodeInput): Promise<VerifyBackupCodeOutput> {
    const codeWithoutDash = input.code.replace(/-/g, "");
    if (!/^[A-Z0-9]{12}$/.test(codeWithoutDash)) {
      throw new Error(
        "Code de récupération invalide. Le code doit être au format XXXXXX-XXXXXX.",
      );
    }

    const { id: userId } = verifyTempToken(input.tempToken);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (user.otpEnable !== 1) {
      throw new Error(
        "La double authentification n'est pas activée pour ce compte",
      );
    }

    const backupCodeEntity =
      await this.otpBackupCodeRepository.findByUserId(userId);
    if (!backupCodeEntity) {
      throw new Error("Aucun code de récupération trouvé");
    }

    const hashedCodes = getCodesArray(backupCodeEntity.codes);

    let hashIndex = -1;
    for (let i = 0; i < hashedCodes.length; i++) {
      const isValidHash = await this.backupCodeGenerator.verifyCode(
        input.code,
        [hashedCodes[i] ?? ""],
      );
      if (isValidHash) {
        hashIndex = i;
        break;
      }
    }

    if (hashIndex === -1) {
      const newConsecutive = backupCodeEntity.nbConsecutiveTests + 1;
      await this.otpBackupCodeRepository.update({
        ...backupCodeEntity,
        nbConsecutiveTests: newConsecutive,
      });

      if (newConsecutive >= 5) {
        throw new Error(
          "Trop de tentatives échouées. Veuillez réessayer plus tard.",
        );
      }

      throw new Error("Code de récupération invalide");
    }

    const updatedHashedCodes = [...hashedCodes];
    updatedHashedCodes.splice(hashIndex, 1);

    await this.otpBackupCodeRepository.update({
      ...backupCodeEntity,
      codes: JSON.stringify(updatedHashedCodes),
      nbCodeUsed: backupCodeEntity.nbCodeUsed + 1,
      nbConsecutiveTests: 0,
    });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      token,
    };
  }
}

import type { IUserRepository } from "@/domain/interfaces/user-repository.interface";
import type { IOtpBackupCodeRepository } from "@/domain/interfaces/otp-backup-code-repository.interface";
import type { IBackupCodeGenerator } from "@/domain/interfaces/backup-code-generator.interface";
import { verify } from "otplib";

export interface EnableTwoFactorAuthInput {
  userId: string;
  secret: string;
  code: string;
}

export interface EnableTwoFactorAuthOutput {
  success: boolean;
  backupCodes: string[];
}

export class EnableTwoFactorAuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpBackupCodeRepository: IOtpBackupCodeRepository,
    private backupCodeGenerator: IBackupCodeGenerator,
  ) {}
  async execute(
    input: EnableTwoFactorAuthInput,
  ): Promise<EnableTwoFactorAuthOutput> {
    if (!/^\d{6}$/.test(input.code)) {
      throw new Error("Le code doit être composé de 6 chiffres");
    }

    const { valid } = await verify({
      token: input.code,
      secret: input.secret,
    });

    if (!valid) {
      throw new Error(
        "Code TOTP invalide. Veuillez vérifier le code généré par votre application d'authentification.",
      );
    }
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    await this.userRepository.update({
      ...user,
      otpSecret: input.secret,
      otpEnable: 1,
    });

    const backupCodes = await this.backupCodeGenerator.generate(10);

    const hashedCodes = await this.backupCodeGenerator.hashCodes(backupCodes);

    await this.otpBackupCodeRepository.save({
      userId: input.userId,
      codes: JSON.stringify(hashedCodes),
      nbCodeUsed: 0,
      nbConsecutiveTests: 0,
    });

    return {
      success: true,
      backupCodes,
    };
  }
}

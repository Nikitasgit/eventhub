import type { IUserRepository } from "@/domain/interfaces/user-repository.interface";
import type { IOtpBackupCodeRepository } from "@/domain/interfaces/otp-backup-code-repository.interface";
import { verify } from "otplib";

export interface DisableTwoFactorAuthInput {
  userId: string;
}

export interface DisableTwoFactorAuthOutput {
  success: boolean;
}

export class DisableTwoFactorAuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpBackupCodeRepository: IOtpBackupCodeRepository,
  ) {}

  async execute(
    input: DisableTwoFactorAuthInput,
  ): Promise<DisableTwoFactorAuthOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (user.otpEnable !== 1) {
      throw new Error("La double authentification n'est pas activée");
    }

    await this.userRepository.update({
      ...user,
      otpSecret: null,
      otpEnable: 0,
    });

    try {
      await this.otpBackupCodeRepository.deleteByUserId(input.userId);
    } catch (error) {
    }

    return {
      success: true,
    };
  }
}

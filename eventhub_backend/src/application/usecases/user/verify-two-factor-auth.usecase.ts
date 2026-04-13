import type { IUserRepository } from "@/domain/interfaces/user-repository.interface";
import { verify } from "otplib";
import { verifyTempToken, generateToken } from "@/api/utils/auth";

export interface VerifyTwoFactorAuthInput {
  tempToken: string;
  code: string;
}

export interface VerifyTwoFactorAuthOutput {
  id: string;
  email: string;
  role: string;
  token: string;
}

export class VerifyTwoFactorAuthUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    input: VerifyTwoFactorAuthInput,
  ): Promise<VerifyTwoFactorAuthOutput> {
    if (!/^\d{6}$/.test(input.code)) {
      throw new Error("Le code doit être composé de 6 chiffres");
    }

    const { id: userId } = verifyTempToken(input.tempToken);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (user.otpEnable !== 1 || !user.otpSecret) {
      throw new Error(
        "La double authentification n'est pas activée pour ce compte",
      );
    }

    const { valid } = await verify({
      token: input.code,
      secret: user.otpSecret ?? "",
    });

    if (!valid) {
      throw new Error(
        "Code TOTP invalide. Veuillez vérifier le code généré par votre application d'authentification.",
      );
    }

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

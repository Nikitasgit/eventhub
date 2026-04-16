import type { IUserRepository } from "@/domain/interfaces/user-repository.interface";
import * as bcrypt from "bcrypt";
import { generateToken, generateTempToken } from "@/api/utils/auth";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  id: string;
  email: string;
  role: string;
  token: string;
}

export interface LoginUserRequires2FAOutput {
  requiresTwoFactor: true;
  tempToken: string;
}

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    input: LoginUserInput,
  ): Promise<LoginUserOutput | LoginUserRequires2FAOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isValidPassword = await bcrypt.compare(
      input.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (user.otpEnable === 1) {
      const tempToken = generateTempToken(user._id.toString());
      return {
        requiresTwoFactor: true,
        tempToken,
      };
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

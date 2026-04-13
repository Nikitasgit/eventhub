import type { IUserRepository } from "@/domain/interfaces/user-repository.interface";
import bcrypt from "bcrypt";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export interface RegisterUserInput {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterUserOutput {
  id: string;
  email: string;
  role: string;
}

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const savedUser = await this.userRepository.save({
      email: input.email,
      password: hashedPassword,
      role: "USER",
      otpSecret: null,
      otpEnable: 0,
    });

    return {
      id: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };
  }
}

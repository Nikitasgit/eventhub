import type { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "@/application/usecases/user/register-user.usecase";

export class RegisterController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.registerUserUseCase.execute({
        email,
        password,
        role: "USER",
      });

      res.jsonSuccess(
        {
          user: {
            id: result.id,
            email: result.email,
            role: result.role,
          },
        },
        201,
      );
    } catch (error) {
      next(error);
    }
  };
}

import type { Request, Response, NextFunction } from "express";
import { LoginUserUseCase } from "@/application/usecases/user";

export class LoginController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.loginUserUseCase.execute({ email, password });

      if ("requiresTwoFactor" in result) {
        res.cookie("tempToken", result.tempToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 300000, // 5 minutes
        });
        return res.jsonSuccess(
          {
            requiresTwoFactor: true,
          },
          200,
        );
      }

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 86400000, // 1 day
      });

      res.jsonSuccess(
        {
          user: {
            id: result.id,
            email: result.email,
            role: result.role,
          },
        },
        200,
      );
    } catch (error) {
      next(error);
    }
  };
}

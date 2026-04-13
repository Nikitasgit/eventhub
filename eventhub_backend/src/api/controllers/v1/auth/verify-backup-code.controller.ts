import type { Request, Response, NextFunction } from "express";
import type { VerifyBackupCodeUseCase } from "@/application/usecases/user/verify-backup-code.usecase";

export class VerifyBackupCodeController {
  constructor(private verifyBackupCodeUseCase: VerifyBackupCodeUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const tempToken = req.cookies.tempToken;
      const { code } = req.body;

      if (!tempToken) {
        return res.jsonError("Session expirée. Veuillez vous reconnecter.", 401);
      }

      if (!code) {
        return res.jsonError("Le code est requis", 400);
      }

      const result = await this.verifyBackupCodeUseCase.execute({
        tempToken,
        code,
      });

      res.clearCookie("tempToken");

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

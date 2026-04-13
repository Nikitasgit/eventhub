import type { Request, Response, NextFunction } from "express";
import { EnableTwoFactorAuthUseCase } from "@/application/usecases/user/enable-two-factor-auth.usecase";

export class EnableTwoFactorAuthController {
  constructor(private enableTwoFactorAuthUseCase: EnableTwoFactorAuthUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return res.jsonError("Vous n'êtes pas connecté", 401);
      }
      const { secret, code } = req.body;

      if (!secret || !code) {
        return res.jsonError("Le secret et le code sont requis", 400);
      }

      const result = await this.enableTwoFactorAuthUseCase.execute({
        userId: req.user.id,
        secret,
        code,
      });

      res.jsonSuccess(
        {
          message: "Double authentification activée avec succès",
          backupCodes: result.backupCodes,
        },
        200,
      );
    } catch (error) {
      next(error);
    }
  };
}

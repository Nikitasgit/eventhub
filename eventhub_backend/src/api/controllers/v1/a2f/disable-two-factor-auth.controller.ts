import type { Request, Response, NextFunction } from "express";
import { DisableTwoFactorAuthUseCase } from "@/application/usecases/user/disable-two-factor-auth.usecase";

export class DisableTwoFactorAuthController {
  constructor(private disableTwoFactorAuthUseCase: DisableTwoFactorAuthUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return res.jsonError("Vous n'êtes pas connecté", 401);
      }

      await this.disableTwoFactorAuthUseCase.execute({
        userId: req.user.id,
      });

      res.jsonSuccess(
        { message: "Double authentification désactivée avec succès" },
        200,
      );
    } catch (error) {
      next(error);
    }
  };
}

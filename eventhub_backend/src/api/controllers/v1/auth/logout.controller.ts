import type { Request, Response, NextFunction } from "express";

export class LogoutController {
  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
      });

      res.clearCookie("tempToken", {
        httpOnly: true,
        sameSite: "lax",
      });

      res.jsonSuccess({ message: "Déconnexion réussie" }, 200);
    } catch (error) {
      next(error);
    }
  };
}

import type { Request, Response, NextFunction } from "express";
import { generateSecret } from "otplib";
import { qrCodeService } from "@/infrastructure/container";

export class QrCodeController {
  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        return res.jsonError("Vous n'êtes pas connecté", 401);
      }

      const secret = generateSecret();
      const qrCode = await qrCodeService.generate(req.user.email, secret);

      res.jsonSuccess({ qrCode }, 200);
    } catch (error) {
      next(error);
    }
  };
}

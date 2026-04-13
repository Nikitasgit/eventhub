import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import type { Request, Response } from "express";

export const twoFactorRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 4, // 4 tentatives par minute
  keyGenerator: (req: Request): string => {
    const tempToken = req.cookies?.tempToken;
    if (tempToken) return tempToken;
    return ipKeyGenerator(req.ip ?? "unknown");
  },
  message: "Trop de tentatives. Veuillez réessayer dans 1 minute.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    if (typeof res.jsonError === "function") {
      res.jsonError("Trop de tentatives. Veuillez réessayer dans 1 minute.", 429);
    } else {
      res.status(429).json({
        success: false,
        data: null,
        error: {
          message: "Trop de tentatives. Veuillez réessayer dans 1 minute.",
          code: 429,
        },
      });
    }
  },
});

import type { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { extractToken } from "@/api/utils/auth";
import type { UserPayload } from "@/domain/types";
import { getEnvVariable } from "@/api/utils/shared";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}

export class AuthenticationMiddleware {
  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let token = req.cookies?.token;

      if (!token) {
        const authorization = req.headers.authorization;
        if (authorization) {
          token = extractToken(authorization);
        }
      }

      if (!token) {
        return res.jsonError(ERROR_MESSAGES.MISSING_AUTHORIZATION_HEADER, 403);
      }

      const payload = jwt.verify(
        token,
        getEnvVariable("JWT_SECRET")
      ) as UserPayload;

      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  };
}

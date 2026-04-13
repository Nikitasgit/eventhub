import type { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class ErrorHandlerMiddleware {
  handle(err: any, req: Request, res: Response, next: NextFunction): void {
    const formattedError = {
      message: err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      code: err.code || 500,
    };
    res.jsonError(formattedError.message, formattedError.code);
  }
}

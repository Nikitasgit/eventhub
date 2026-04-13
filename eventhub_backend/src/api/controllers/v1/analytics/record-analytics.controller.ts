import type { Request, Response, NextFunction } from "express";
import { RecordAnalyticsUseCase } from "@/application/usecases";

interface RecordAnalyticsBody {
  refType?: string;
  ref?: string;
  userId?: string | null;
  action?: string;
}

export class RecordAnalyticsController {
  constructor(private recordAnalyticsUseCase: RecordAnalyticsUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refType, ref, userId, action } = req.body as RecordAnalyticsBody;

      if (!refType || typeof refType !== "string") {
        res.status(400).json({
          success: false,
          message: "refType is required",
        });
        return;
      }

      if (!ref || typeof ref !== "string") {
        res.status(400).json({
          success: false,
          message: "ref is required",
        });
        return;
      }

      if (!action || typeof action !== "string") {
        res.status(400).json({
          success: false,
          message: "action is required",
        });
        return;
      }

      const effectiveUserId =
        typeof userId === "string" && userId.trim().length > 0 ? userId : null;

      await this.recordAnalyticsUseCase.execute({
        refType,
        ref,
        userId: effectiveUserId,
        action,
      });

      res.jsonSuccess(null, 201);
    } catch (error) {
      next(error);
    }
  };
}

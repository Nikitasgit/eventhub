import type { Request, Response, NextFunction } from "express";
import { GetEventsStatisticsUseCase } from "@/application/usecases";

export class GetEventsStatisticsController {
  constructor(
    private getEventsStatisticsUseCase: GetEventsStatisticsUseCase
  ) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId || typeof userId !== "string") {
        res.status(403).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const lastCreatedAt =
        typeof req.query.lastCreatedAt === "string"
          ? req.query.lastCreatedAt
          : undefined;
      const lastId =
        typeof req.query.lastId === "string" ? req.query.lastId : undefined;
      const limit =
        typeof req.query.limit === "string"
          ? parseInt(req.query.limit, 10)
          : undefined;

      const input: {
        lastCreatedAt?: string;
        lastId?: string;
        limit?: number;
      } = {};
      if (lastCreatedAt !== undefined) input.lastCreatedAt = lastCreatedAt;
      if (lastId !== undefined) input.lastId = lastId;
      if (limit !== undefined) input.limit = limit;

      const result = await this.getEventsStatisticsUseCase.execute(userId, input);

      res.jsonSuccess(
        { stats: result.stats, nextCursor: result.nextCursor },
        200
      );
    } catch (error) {
      next(error);
    }
  };
}


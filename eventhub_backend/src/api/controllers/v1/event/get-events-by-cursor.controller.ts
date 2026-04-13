import type { Request, Response, NextFunction } from "express";
import {
  GetEventsByCursorUseCase,
  type GetEventsByCursorInput,
} from "@/application/usecases/event";

export class GetEventsByCursorController {
  constructor(
    private readonly getEventsByCursorUseCase: GetEventsByCursorUseCase,
  ) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { lastCreatedAt, lastId, limit } = req.query;

      const input: GetEventsByCursorInput = {};

      if (typeof lastCreatedAt === "string") {
        input.lastCreatedAt = lastCreatedAt;
      }

      if (typeof lastId === "string") {
        input.lastId = lastId;
      }

      if (typeof limit === "string" && !Number.isNaN(Number(limit))) {
        input.limit = Number(limit);
      }

      const result = await this.getEventsByCursorUseCase.execute(input);

      res.jsonSuccess(result, 200);
    } catch (error) {
      next(error);
    }
  };
}

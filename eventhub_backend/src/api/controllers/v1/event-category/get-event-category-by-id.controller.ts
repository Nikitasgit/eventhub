import type { Request, Response, NextFunction } from "express";
import { GetEventCategoryByIdUseCase } from "@/application/usecases/event-category";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class GetEventCategoryByIdController {
  constructor(
    private getEventCategoryByIdUseCase: GetEventCategoryByIdUseCase
  ) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const eventCategoryId = req.params.id;
      if (!eventCategoryId || typeof eventCategoryId !== "string") {
        return res.jsonError(ERROR_MESSAGES.EVENT_CATEGORY_ID_REQUIRED, 400);
      }

      const eventCategory = await this.getEventCategoryByIdUseCase.execute(
        eventCategoryId
      );

      res.jsonSuccess(eventCategory, 200);
    } catch (error) {
      next(error);
    }
  };
}

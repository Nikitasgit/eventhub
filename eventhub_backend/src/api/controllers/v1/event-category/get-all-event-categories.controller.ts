import type { Request, Response, NextFunction } from "express";
import { GetAllEventCategoriesUseCase } from "@/application/usecases/event-category";

export class GetAllEventCategoriesController {
  constructor(
    private getAllEventCategoriesUseCase: GetAllEventCategoriesUseCase
  ) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const eventCategories = await this.getAllEventCategoriesUseCase.execute();

      res.jsonSuccess(eventCategories, 200);
    } catch (error) {
      next(error);
    }
  };
}

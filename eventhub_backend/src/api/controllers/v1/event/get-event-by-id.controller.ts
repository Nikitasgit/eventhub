import type { Request, Response, NextFunction } from "express";
import { GetEventByIdUseCase } from "@/application/usecases/event";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class GetEventByIdController {
  constructor(private getEventByIdUseCase: GetEventByIdUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const eventId = req.params.id;
      if (!eventId || typeof eventId !== "string") {
        return res.jsonError(ERROR_MESSAGES.EVENT_ID_REQUIRED, 400);
      }

      const event = await this.getEventByIdUseCase.execute(eventId);

      res.jsonSuccess(event, 200);
    } catch (error) {
      next(error);
    }
  };
}

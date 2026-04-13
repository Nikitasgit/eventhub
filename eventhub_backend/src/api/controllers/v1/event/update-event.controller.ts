import type { Request, Response, NextFunction } from "express";
import { UpdateEventUseCase } from "@/application/usecases/event";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class UpdateEventController {
  constructor(private updateEventUseCase: UpdateEventUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const organizer = req.user?.id;
      if (!organizer) {
        return res.jsonError(ERROR_MESSAGES.USER_NOT_AUTHENTICATED, 401);
      }

      const eventId = req.params.id;
      if (!eventId || typeof eventId !== "string") {
        return res.jsonError(ERROR_MESSAGES.EVENT_ID_REQUIRED, 400);
      }

      await this.updateEventUseCase.execute(req.body, eventId, organizer);

      res.jsonSuccess(
        {
          message: ERROR_MESSAGES.EVENT_UPDATED_SUCCESS,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  };
}

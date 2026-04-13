import type { Request, Response, NextFunction } from "express";
import { DeleteEventUseCase } from "@/application/usecases/event";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class DeleteEventController {
  constructor(private deleteEventUseCase: DeleteEventUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const organizerId = req.user?.id;
      if (!organizerId) {
        return res.jsonError(ERROR_MESSAGES.USER_NOT_AUTHENTICATED, 401);
      }

      const eventId = req.params.id;
      if (!eventId || typeof eventId !== "string") {
        return res.jsonError(ERROR_MESSAGES.EVENT_ID_REQUIRED, 400);
      }

      await this.deleteEventUseCase.execute(eventId, organizerId);

      res.jsonSuccess(
        {
          message: ERROR_MESSAGES.EVENT_DELETED_SUCCESS,
        },
        200
      );
    } catch (error) {
      next(error);
    }
  };
}

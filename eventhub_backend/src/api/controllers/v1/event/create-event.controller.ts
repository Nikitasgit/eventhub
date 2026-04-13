import type { Request, Response, NextFunction } from "express";
import { CreateEventUseCase } from "@/application/usecases/event";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class CreateEventController {
  constructor(private createEventUseCase: CreateEventUseCase) {}

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

      const eventId = await this.createEventUseCase.execute({
        title: req.body.title,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        location: req.body.location,
        maxCapacity: req.body.maxCapacity,
        availableTickets: req.body.availableTickets,
        price: req.body.price,
        category: req.body.category,
        organizer,
      });

      res.jsonSuccess(
        {
          id: eventId,
          message: ERROR_MESSAGES.EVENT_CREATED_SUCCESS,
        },
        201
      );
    } catch (error) {
      next(error);
    }
  };
}

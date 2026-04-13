import type { IEventRepository } from "@/domain/interfaces/event-repository.interface";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export interface GetEventByIdOutput {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  location: string;
  maxCapacity: number;
  availableTickets: number;
  price: number | null;
  category: string;
  organizer: string;
  createdAt: Date;
  updatedAt: Date;
  links: {
    self: string;
    update: string;
    delete: string;
    organizer: string;
    category: string;
  };
}

export class GetEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string): Promise<GetEventByIdOutput> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }

    return {
      id: event._id.toString(),
      title: event.title,
      description: event.description ?? null,
      startDate: event.startDate as Date,
      endDate: event.endDate as Date,
      location: event.location,
      maxCapacity: event.maxCapacity,
      availableTickets: event.availableTickets,
      price: event.price ?? null,
      category: event.category,
      organizer: event.organizer,
      createdAt: event.createdAt as Date,
      updatedAt: event.updatedAt as Date,
      links: {
        self: `/api/v1/events/${event._id.toString()}`,
        update: `/api/v1/events/${event._id.toString()}`,
        delete: `/api/v1/events/${event._id.toString()}`,
        organizer: `/api/v1/users/${event.organizer}`,
        category: `/api/v1/event-categories/${event.category}`,
      },
    };
  }
}

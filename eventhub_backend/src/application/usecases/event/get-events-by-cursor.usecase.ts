import type { IEventRepository } from "@/domain/interfaces/event-repository.interface";

export interface EventCursorDTO {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  location: string;
  maxCapacity: number;
  availableTickets: number;
  price: number | null;
  categoryId: string;
  organizerId: string;
}

export interface GetEventsByCursorInput {
  lastCreatedAt?: string;
  lastId?: string;
  limit?: number;
}

export interface GetEventsByCursorOutput {
  events: EventCursorDTO[];
  nextCursor: { lastCreatedAt: string; lastId: string } | null;
}

export class GetEventsByCursorUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(
    params: GetEventsByCursorInput,
  ): Promise<GetEventsByCursorOutput> {
    const limit = params.limit && params.limit > 0 ? params.limit : 5;
    
    const lastCreatedAtDate =
      params.lastCreatedAt != null ? new Date(params.lastCreatedAt) : undefined;

    const events = await this.eventRepository.findByCursor(
      lastCreatedAtDate,
      params.lastId,
      limit,
    );

    const eventDtos: EventCursorDTO[] = events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      description: event.description ?? null,
      startDate: event.startDate as Date,
      endDate: event.endDate as Date,
      location: event.location,
      maxCapacity: event.maxCapacity,
      availableTickets: event.availableTickets,
      price: event.price ?? null,
      categoryId: event.category,
      organizerId: event.organizer,
    }));

    let nextCursor: { lastCreatedAt: string; lastId: string } | null = null;

    if (events.length > 0) {
      const lastEvent = events[events.length - 1]!;
      nextCursor = {
        lastCreatedAt: (lastEvent.createdAt as Date).toISOString(),
        lastId: lastEvent._id.toString(),
      };
    }

    return {
      events: eventDtos,
      nextCursor,
    };
  }
}

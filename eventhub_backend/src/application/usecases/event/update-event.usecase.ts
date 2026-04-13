import type { IEventRepository } from "@/domain/interfaces/event-repository.interface";
import type { IEventCategoryRepository } from "@/domain/category/event-category-repository.interface";
import { validateEvent } from "@/domain/utils/event-validators";
import type { UpdateEventInput } from "@/application/dto/event";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class UpdateEventUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private eventCategoryRepository: IEventCategoryRepository
  ) {}

  async execute(
    input: UpdateEventInput,
    eventId: string,
    organizerId: string
  ): Promise<void> {
    const existingEvent = await this.eventRepository.findById(eventId);
    if (!existingEvent) {
      throw new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }
    if (existingEvent.organizer !== organizerId) {
      throw new Error(ERROR_MESSAGES.EVENT_CAN_ONLY_UPDATE_OWN);
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      maxCapacity,
      availableTickets,
      price,
      category,
    } = input;

    if (category) {
      const eventCategory = await this.eventCategoryRepository.findById(
        category
      );
      if (!eventCategory) {
        throw new Error(ERROR_MESSAGES.EVENT_CATEGORY_NOT_FOUND);
      }
    }

    const eventData = {
      title: title ?? existingEvent.title,
      description: description ?? existingEvent.description ?? null,
      startDate: startDate ?? existingEvent.startDate,
      endDate: endDate ?? existingEvent.endDate,
      location: location ?? existingEvent.location,
      maxCapacity: maxCapacity ?? existingEvent.maxCapacity,
      availableTickets:
        availableTickets ?? existingEvent.availableTickets,
      price: price ?? existingEvent.price ?? null,
    };
    validateEvent(eventData);

    await this.eventRepository.update({
      ...existingEvent,
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      location: eventData.location,
      maxCapacity: eventData.maxCapacity,
      availableTickets: eventData.availableTickets,
      price: eventData.price,
      category: category ?? existingEvent.category,
    });
  }
}

import type { IEventRepository } from "@/domain/interfaces/event-repository.interface";
import type { IEventCategoryRepository } from "@/domain/category/event-category-repository.interface";
import { validateEvent } from "@/domain/utils/event-validators";
import type { CreateEventInput } from "@/application/dto/event";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class CreateEventUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private eventCategoryRepository: IEventCategoryRepository
  ) {}

  async execute(input: CreateEventInput): Promise<string> {
    if (input.category) {
      const eventCategory = await this.eventCategoryRepository.findById(
        input.category
      );
      if (!eventCategory) {
        throw new Error(ERROR_MESSAGES.EVENT_CATEGORY_NOT_FOUND);
      }
    }

    const eventData = {
      title: input.title,
      description: input.description ?? null,
      startDate: input.startDate,
      endDate: input.endDate,
      location: input.location,
      maxCapacity: input.maxCapacity,
      availableTickets: input.availableTickets,
      price: input.price ?? null,
    };
    validateEvent(eventData);

    return this.eventRepository.save(input);
  }
}

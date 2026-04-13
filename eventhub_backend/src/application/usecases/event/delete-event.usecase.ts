import type { IEventRepository } from "@/domain/interfaces/event-repository.interface";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class DeleteEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(eventId: string, organizerId: string): Promise<void> {
    const existingEvent = await this.eventRepository.findById(eventId);
    if (!existingEvent) {
      throw new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }
    if (existingEvent.organizer !== organizerId) {
      throw new Error(ERROR_MESSAGES.EVENT_CAN_ONLY_DELETE_OWN);
    }

    await this.eventRepository.delete(eventId);
  }
}

import type { IEventCategoryRepository } from "@/domain/category/event-category-repository.interface";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export interface GetEventCategoryByIdOutput {
  _id: string;
  name: string;
  links: {
    self: string;
  };
}

export class GetEventCategoryByIdUseCase {
  constructor(private eventCategoryRepository: IEventCategoryRepository) {}

  async execute(id: string): Promise<GetEventCategoryByIdOutput> {
    const eventCategory = await this.eventCategoryRepository.findById(id);
    if (!eventCategory) {
      throw new Error(ERROR_MESSAGES.EVENT_CATEGORY_NOT_FOUND);
    }

    return {
      _id: eventCategory._id.toString(),
      name: eventCategory.name,
      links: {
        self: `/api/v1/event-categories/${eventCategory._id.toString()}`,
      },
    };
  }
}

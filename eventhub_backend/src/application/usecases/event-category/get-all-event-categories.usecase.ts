import type { IEventCategoryRepository } from "@/domain/category/event-category-repository.interface";

export interface GetAllEventCategoriesOutput {
  _id: string;
  name: string;
  links: {
    self: string;
  };
}

export class GetAllEventCategoriesUseCase {
  constructor(private eventCategoryRepository: IEventCategoryRepository) {}

  async execute(): Promise<GetAllEventCategoriesOutput[]> {
    const eventCategories = await this.eventCategoryRepository.findAll();

    return eventCategories.map((doc) => ({
      _id: doc._id.toString(),
      name: doc.name,
      links: {
        self: `/api/v1/event-categories/${doc._id.toString()}`,
      },
    }));
  }
}

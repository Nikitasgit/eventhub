import type { IEventCategoryRepository } from "@/domain/category/event-category-repository.interface";
import {
  EventCategoryModel,
  type EventCategoryDoc,
} from "@/domain/models/event-category.model";

export class MongoEventCategoryRepository implements IEventCategoryRepository {
  async findById(id: string): Promise<EventCategoryDoc | null> {
    const doc = await EventCategoryModel.findById(id)
      .lean<EventCategoryDoc>()
      .exec();
    return doc ?? null;
  }

  async findAll(): Promise<EventCategoryDoc[]> {
    return EventCategoryModel.find().sort({ name: 1 }).lean<EventCategoryDoc[]>().exec();
  }
}

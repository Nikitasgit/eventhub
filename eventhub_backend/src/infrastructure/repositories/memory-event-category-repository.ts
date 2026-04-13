import mongoose from "mongoose";
import type { IEventCategoryRepository } from "@/domain/category/event-category-repository.interface";
import type { EventCategoryDoc } from "@/domain/models/event-category.model";

export class MemoryEventCategoryRepository implements IEventCategoryRepository {
  eventCategories: EventCategoryDoc[] = [];

  async findById(id: string): Promise<EventCategoryDoc | null> {
    return (
      this.eventCategories.find((c) => c._id.toString() === id) ?? null
    );
  }

  async findAll(): Promise<EventCategoryDoc[]> {
    return [...this.eventCategories];
  }
}

import type { EventCategoryDoc } from "@/domain/models/event-category.model";

export interface IEventCategoryRepository {
  findById(id: string): Promise<EventCategoryDoc | null>;
  findAll(): Promise<EventCategoryDoc[]>;
}

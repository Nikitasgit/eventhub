import type { EventDoc } from "@/domain/models/event.model";
import type { CreateEventInput } from "@/application/dto/event";

export interface IEventRepository {
  save(event: CreateEventInput): Promise<string>;
  findById(id: string): Promise<EventDoc | null>;
  findAll(): Promise<EventDoc[]>;
  findAllByOrganizerId(organizerId: string): Promise<EventDoc[]>;
  findByCursor(
    lastCreatedAt?: Date,
    lastId?: string,
    limit?: number
  ): Promise<EventDoc[]>;
  findByCursorByOrganizerId(
    organizerId: string,
    lastCreatedAt?: Date,
    lastId?: string,
    limit?: number
  ): Promise<EventDoc[]>;
  update(doc: EventDoc): Promise<void>;
  delete(id: string): Promise<void>;
}

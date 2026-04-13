import mongoose from "mongoose";
import type { IEventRepository } from "@/domain/interfaces/event-repository.interface";
import type { EventDoc } from "@/domain/models/event.model";
import type { CreateEventInput } from "@/application/dto/event";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

export class MemoryEventRepository implements IEventRepository {
  events: EventDoc[] = [];

  async save(event: CreateEventInput): Promise<string> {
    const _id = new mongoose.Types.ObjectId();
    const doc: EventDoc = {
      _id,
      title: event.title,
      description: event.description ?? null,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      maxCapacity: event.maxCapacity,
      availableTickets: event.availableTickets,
      price: event.price ?? null,
      category: event.category,
      organizer: event.organizer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events.push(doc);
    return _id.toString();
  }

  async findById(id: string): Promise<EventDoc | null> {
    return this.events.find((e) => e._id.toString() === id) ?? null;
  }

  async findAll(): Promise<EventDoc[]> {
    return [...this.events];
  }

  async findAllByOrganizerId(organizerId: string): Promise<EventDoc[]> {
    return this.events.filter((e) => e.organizer === organizerId);
  }

  async findByCursor(
    lastCreatedAt?: Date,
    lastId?: string,
    limit: number = 10
  ): Promise<EventDoc[]> {
    const sorted = [...this.events].sort((a, b) => {
      const dateDiff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (dateDiff !== 0) return dateDiff;

      return b._id.toString().localeCompare(a._id.toString());
    });

    if (!lastCreatedAt || !lastId) {
      return sorted.slice(0, limit);
    }

    const cursorDate = new Date(lastCreatedAt);

    const filtered = sorted.filter((event) => {
      const eventDate = new Date(event.createdAt);
      if (eventDate.getTime() < cursorDate.getTime()) return true;
      if (eventDate.getTime() === cursorDate.getTime()) {
        return event._id.toString() < lastId;
      }
      return false;
    });

    return filtered.slice(0, limit);
  }

  async findByCursorByOrganizerId(
    organizerId: string,
    lastCreatedAt?: Date,
    lastId?: string,
    limit: number = 10
  ): Promise<EventDoc[]> {
    const byOrganizer = this.events.filter((e) => e.organizer === organizerId);
    const sorted = [...byOrganizer].sort((a, b) => {
      const dateDiff =
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b._id.toString().localeCompare(a._id.toString());
    });

    if (!lastCreatedAt || !lastId) {
      return sorted.slice(0, limit);
    }

    const cursorDate = new Date(lastCreatedAt);
    const filtered = sorted.filter((event) => {
      const eventDate = new Date(event.createdAt!);
      if (eventDate.getTime() < cursorDate.getTime()) return true;
      if (eventDate.getTime() === cursorDate.getTime()) {
        return event._id.toString() < lastId;
      }
      return false;
    });

    return filtered.slice(0, limit);
  }

  async update(doc: EventDoc): Promise<void> {
    const index = this.events.findIndex(
      (e) => e._id.toString() === doc._id.toString(),
    );
    if (index === -1) {
      throw new Error(ERROR_MESSAGES.EVENT_NOT_FOUND);
    }
    this.events[index] = { ...doc, updatedAt: new Date() };
  }

  async delete(id: string): Promise<void> {
    const index = this.events.findIndex((e) => e._id.toString() === id);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }
}

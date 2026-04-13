import type { IEventRepository } from "@/domain/interfaces/event-repository.interface";
import { EventModel, type EventDoc } from "@/domain/models/event.model";
import type { CreateEventInput } from "@/application/dto/event";

export class MongoEventRepository implements IEventRepository {
  async save(event: CreateEventInput): Promise<string> {
    const created = await EventModel.create({
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
    });
    return created._id.toString();
  }

  async findById(id: string): Promise<EventDoc | null> {
    const doc = await EventModel.findById(id).lean<EventDoc>().exec();
    return doc ?? null;
  }

  async findAll(): Promise<EventDoc[]> {
    return EventModel.find().sort({ createdAt: -1 }).lean<EventDoc[]>().exec();
  }

  async findAllByOrganizerId(organizerId: string): Promise<EventDoc[]> {
    return EventModel.find({ organizer: organizerId })
      .select("title _id")
      .sort({ createdAt: -1 })
      .lean<EventDoc[]>()
      .exec();
  }

  async update(doc: EventDoc): Promise<void> {
    await EventModel.findOneAndUpdate(
      { _id: doc._id },
      {
        title: doc.title,
        description: doc.description,
        startDate: doc.startDate,
        endDate: doc.endDate,
        location: doc.location,
        maxCapacity: doc.maxCapacity,
        availableTickets: doc.availableTickets,
        price: doc.price,
        category: doc.category,
      },
    ).exec();
  }

  async delete(id: string): Promise<void> {
    await EventModel.deleteOne({ _id: id }).exec();
  }

  async findByCursor(
    lastCreatedAt?: Date,
    lastId?: string,
    limit: number = 10
  ): Promise<EventDoc[]> {
    if (!lastCreatedAt || !lastId) {
      return EventModel.find()
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit)
        .lean<EventDoc[]>()
        .exec();
    }

    return EventModel.find({
      $or: [
        { createdAt: { $lt: lastCreatedAt } },
        { createdAt: lastCreatedAt, _id: { $lt: lastId } },
      ],
    })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean<EventDoc[]>()
      .exec();
  }

  async findByCursorByOrganizerId(
    organizerId: string,
    lastCreatedAt?: Date,
    lastId?: string,
    limit: number = 10
  ): Promise<EventDoc[]> {
    const baseFilter = { organizer: organizerId };

    if (!lastCreatedAt || !lastId) {
      return EventModel.find(baseFilter)
        .select("title _id createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .limit(limit)
        .lean<EventDoc[]>()
        .exec();
    }

    return EventModel.find({
      ...baseFilter,
      $or: [
        { createdAt: { $lt: lastCreatedAt } },
        { createdAt: lastCreatedAt, _id: { $lt: lastId } },
      ],
    })
      .select("title _id createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean<EventDoc[]>()
      .exec();
  }
}

import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

export const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
    availableTickets: { type: Number, required: true },
    price: { type: Number, default: null },
    category: { type: String, required: true },
    organizer: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export type EventDocument = InferSchemaType<typeof EventSchema>;

export type EventDoc = { _id: mongoose.Types.ObjectId } & EventDocument;

export const EventModel = mongoose.model<EventDocument>("Event", EventSchema);


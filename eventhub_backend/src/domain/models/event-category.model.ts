import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

export const EventCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export type EventCategoryDocument = InferSchemaType<typeof EventCategorySchema>;

export type EventCategoryDoc = { _id: mongoose.Types.ObjectId } & EventCategoryDocument;

export const EventCategoryModel = mongoose.model<EventCategoryDocument>(
  "EventCategory",
  EventCategorySchema
);


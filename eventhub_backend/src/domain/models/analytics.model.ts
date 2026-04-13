import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

export const EventAnalyticsSchema = new mongoose.Schema(
  {
    refType: {
      type: String,
      required: true,
      enum: ["event"],
    },
    ref: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type EventAnalytics = InferSchemaType<typeof EventAnalyticsSchema>;

export const EventAnalyticsModel = mongoose.model<EventAnalytics>(
  "EventAnalytics",
  EventAnalyticsSchema
);


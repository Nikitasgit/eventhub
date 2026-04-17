import type { IAnalyticsRepository } from "@/domain/interfaces";
import { EventAnalyticsModel } from "@/domain/models/analytics.model";

export class MongoAnalyticsRepository implements IAnalyticsRepository {
  async recordAnalytics(event: {
    refType: string;
    ref: string;
    userId: string;
    action: string;
  }): Promise<void> {
    await EventAnalyticsModel.create(event);
  }

  async getEventViewsStats(
    eventIds: string[]
  ): Promise<{ ref: string; count: number }[]> {
    const result = await EventAnalyticsModel.aggregate<{
      _id: string;
      count: number;
    }>([
      {
        $match: {
          refType: "event",
          action: "view",
          ref: { $in: eventIds },
        },
      },
      {
        $group: {
          _id: "$ref",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]).exec();

    return result.map((item) => ({
      ref: item._id,
      count: item.count,
    }));
  }
}

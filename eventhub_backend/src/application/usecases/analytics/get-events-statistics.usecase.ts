import type { IAnalyticsRepository, IEventRepository } from "@/domain/interfaces";

export interface EventStatisticsOutput {
  event: string;
  title: string | null;
  viewsCount: number;
}

export interface GetEventsStatisticsInput {
  lastCreatedAt?: string;
  lastId?: string;
  limit?: number;
}

export interface GetEventsStatisticsResult {
  stats: EventStatisticsOutput[];
  nextCursor: { lastCreatedAt: string; lastId: string } | null;
}

const DEFAULT_LIMIT = 10;

export class GetEventsStatisticsUseCase {
  constructor(
    private analyticsRepository: IAnalyticsRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(
    userId: string,
    input?: GetEventsStatisticsInput
  ): Promise<GetEventsStatisticsResult> {
    const limit =
      input?.limit != null && input.limit > 0 ? input.limit : DEFAULT_LIMIT;
    const lastCreatedAt =
      input?.lastCreatedAt != null ? new Date(input.lastCreatedAt) : undefined;
    const lastId = input?.lastId;

    const userEvents =
      await this.eventRepository.findByCursorByOrganizerId(
        userId,
        lastCreatedAt,
        lastId,
        limit
      );

    if (userEvents.length === 0) {
      return { stats: [], nextCursor: null };
    }

    const eventIds = userEvents.map((event) => event._id.toString());
    const stats = await this.analyticsRepository.getEventViewsStats(eventIds);
    const statsByRef = new Map(
      stats.map((item) => [item.ref, item.count] as const)
    );

    const statsOutput: EventStatisticsOutput[] = userEvents.map((event) => {
      const id = event._id.toString();
      const viewsCount = statsByRef.get(id) ?? 0;
      return {
        event: id,
        title: event.title ?? null,
        viewsCount,
      };
    });

    let nextCursor: { lastCreatedAt: string; lastId: string } | null = null;
    if (userEvents.length >= limit) {
      const lastEvent = userEvents[userEvents.length - 1]!;
      const createdAt = (lastEvent as { createdAt?: Date }).createdAt;
      nextCursor = {
        lastCreatedAt: (createdAt ?? new Date()).toISOString(),
        lastId: lastEvent._id.toString(),
      };
    }

    return { stats: statsOutput, nextCursor };
  }
}

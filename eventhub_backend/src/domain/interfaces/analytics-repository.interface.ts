export interface IAnalyticsRepository {
  recordAnalytics(event: {
    refType: string;
    ref: string;
    userId: string;
    action: string;
  }): Promise<void>;

  getEventViewsStats(
    eventIds: string[]
  ): Promise<{ ref: string; count: number }[]>;
}


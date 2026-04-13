import type { IAnalyticsRepository } from "@/domain/interfaces";

export interface RecordAnalyticsInput {
  refType: string;
  ref: string;
  userId: string | null;
  action: string;
}

export class RecordAnalyticsUseCase {
  constructor(private analyticsRepository: IAnalyticsRepository) {}

  async execute(input: RecordAnalyticsInput): Promise<void> {
    const userId = input.userId ?? "anonymous";

    await this.analyticsRepository.recordAnalytics({
      refType: input.refType,
      ref: input.ref,
      userId,
      action: input.action,
    });
  }
}


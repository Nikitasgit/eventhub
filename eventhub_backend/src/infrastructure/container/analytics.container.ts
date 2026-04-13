import {
  GetEventsStatisticsController,
  RecordAnalyticsController,
} from "@/api/controllers/v1/analytics";
import {
  GetEventsStatisticsUseCase,
  RecordAnalyticsUseCase,
} from "@/application/usecases";
import { MongoAnalyticsRepository, MongoEventRepository } from "@/infrastructure/repositories";

const analyticsRepository = new MongoAnalyticsRepository();
const eventRepository = new MongoEventRepository();

const recordAnalyticsUseCase = new RecordAnalyticsUseCase(analyticsRepository);
const getEventsStatisticsUseCase = new GetEventsStatisticsUseCase(
  analyticsRepository,
  eventRepository
);

export const recordEventViewController = new RecordAnalyticsController(
  recordAnalyticsUseCase
);
export const getEventsStatisticsController = new GetEventsStatisticsController(
  getEventsStatisticsUseCase
);


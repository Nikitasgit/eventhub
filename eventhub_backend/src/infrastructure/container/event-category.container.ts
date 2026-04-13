import {
  GetEventCategoryByIdController,
  GetAllEventCategoriesController,
} from "@/api/controllers/v1/event-category";
import {
  GetEventCategoryByIdUseCase,
  GetAllEventCategoriesUseCase,
} from "@/application/usecases/event-category";
import { MongoEventCategoryRepository } from "@/infrastructure/repositories";

const eventCategoryRepository = new MongoEventCategoryRepository();

const getEventCategoryByIdUseCase = new GetEventCategoryByIdUseCase(
  eventCategoryRepository
);
const getAllEventCategoriesUseCase = new GetAllEventCategoriesUseCase(
  eventCategoryRepository
);

export const getEventCategoryByIdController =
  new GetEventCategoryByIdController(getEventCategoryByIdUseCase);
export const getAllEventCategoriesController =
  new GetAllEventCategoriesController(getAllEventCategoriesUseCase);

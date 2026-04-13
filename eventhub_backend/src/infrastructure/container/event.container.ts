import {
  CreateEventController,
  UpdateEventController,
  GetEventByIdController,
  DeleteEventController,
  GetEventsByCursorController,
} from "@/api/controllers/v1/event";
import {
  CreateEventUseCase,
  UpdateEventUseCase,
  GetEventByIdUseCase,
  DeleteEventUseCase,
  GetEventsByCursorUseCase,
} from "@/application/usecases/event";
import {
  MongoEventRepository,
  MongoEventCategoryRepository,
} from "@/infrastructure/repositories";

const eventRepository = new MongoEventRepository();
const eventCategoryRepository = new MongoEventCategoryRepository();

const createEventUseCase = new CreateEventUseCase(
  eventRepository,
  eventCategoryRepository
);
const updateEventUseCase = new UpdateEventUseCase(
  eventRepository,
  eventCategoryRepository
);
const getEventByIdUseCase = new GetEventByIdUseCase(eventRepository);
const getEventsByCursorUseCase = new GetEventsByCursorUseCase(eventRepository);
const deleteEventUseCase = new DeleteEventUseCase(eventRepository);

export const createEventController = new CreateEventController(
  createEventUseCase
);
export const updateEventController = new UpdateEventController(
  updateEventUseCase
);
export const getEventByIdController = new GetEventByIdController(
  getEventByIdUseCase
);
export const deleteEventController = new DeleteEventController(
  deleteEventUseCase
);
export const getEventsByCursorController = new GetEventsByCursorController(
  getEventsByCursorUseCase
);

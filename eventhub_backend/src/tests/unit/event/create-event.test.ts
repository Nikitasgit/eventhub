import mongoose from "mongoose";
import { CreateEventUseCase } from "@/application/usecases/event/create-event.usecase";
import { MemoryEventRepository } from "@/infrastructure/repositories/memory-event-repository";
import { MemoryEventCategoryRepository } from "@/infrastructure/repositories/memory-event-category-repository";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";

const CATEGORY_ID = "000000000000000000000001";

describe("create event", () => {
  let useCase: CreateEventUseCase;
  let repository: MemoryEventRepository;
  let categoryRepository: MemoryEventCategoryRepository;

  beforeEach(() => {
    repository = new MemoryEventRepository();
    categoryRepository = new MemoryEventCategoryRepository();
    categoryRepository.eventCategories.push({
      _id: new mongoose.Types.ObjectId(CATEGORY_ID),
      name: "Concert",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    useCase = new CreateEventUseCase(repository, categoryRepository);
  });

  describe("Scenario: no title", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = new Date(futureDate);
    endDate.setHours(endDate.getHours() + 3);

    const payload = {
      title: "",
      description: "Un événement de test",
      startDate: futureDate,
      endDate: endDate,
      location: "Paris, France",
      maxCapacity: 100,
      availableTickets: 90,
      price: 25.0,
      category: CATEGORY_ID,
      organizer: "1",
    };

    it("should throw an error", async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        "EVENT_TITLE_REQUIRED"
      );
    });
  });

  describe("Scenario: start date in the past", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const endDate = new Date(pastDate);
    endDate.setHours(endDate.getHours() + 3);

    const payload = {
      title: "Concert de Rock",
      description: "Un concert de rock",
      startDate: pastDate,
      endDate: endDate,
      location: "Paris, France",
      maxCapacity: 100,
      availableTickets: 90,
      price: 25.0,
      category: CATEGORY_ID,
      organizer: "1",
    };

    it("should throw an error", async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        "EVENT_START_DATE_MUST_BE_FUTURE"
      );
    });
  });

  describe("Scenario: end date before start date", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = new Date(futureDate);
    endDate.setDate(endDate.getDate() - 1);

    const payload = {
      title: "Concert de Rock",
      description: "Un concert de rock",
      startDate: futureDate,
      endDate: endDate,
      location: "Paris, France",
      maxCapacity: 100,
      availableTickets: 90,
      price: 25.0,
      category: CATEGORY_ID,
      organizer: "1",
    };

    it("should throw an error", async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        "EVENT_END_DATE_MUST_BE_AFTER_START"
      );
    });
  });

  describe("Scenario: no location", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = new Date(futureDate);
    endDate.setHours(endDate.getHours() + 3);

    const payload = {
      title: "Concert de Rock",
      description: "Un concert de rock",
      startDate: futureDate,
      endDate: endDate,
      location: "",
      maxCapacity: 100,
      availableTickets: 90,
      price: 25.0,
      category: CATEGORY_ID,
      organizer: "1",
    };

    it("should throw an error", async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        "EVENT_LOCATION_REQUIRED"
      );
    });
  });

  describe("Scenario: max capacity less than 1", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = new Date(futureDate);
    endDate.setHours(endDate.getHours() + 3);

    const payload = {
      title: "Concert de Rock",
      description: "Un concert de rock",
      startDate: futureDate,
      endDate: endDate,
      location: "Paris, France",
      maxCapacity: 0,
      availableTickets: 0,
      price: 25.0,
      category: CATEGORY_ID,
      organizer: "1",
    };

    it("should throw an error", async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        "EVENT_MAX_CAPACITY_INVALID"
      );
    });
  });

  describe("Scenario: available tickets exceed max capacity", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = new Date(futureDate);
    endDate.setHours(endDate.getHours() + 3);

    const payload = {
      title: "Concert de Rock",
      description: "Un concert de rock",
      startDate: futureDate,
      endDate: endDate,
      location: "Paris, France",
      maxCapacity: 100,
      availableTickets: 150,
      price: 25.0,
      category: CATEGORY_ID,
      organizer: "1",
    };

    it("should throw an error", async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        "EVENT_AVAILABLE_TICKETS_EXCEED_CAPACITY"
      );
    });
  });

  describe("Scenario: negative price", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = new Date(futureDate);
    endDate.setHours(endDate.getHours() + 3);

    const payload = {
      title: "Concert de Rock",
      description: "Un concert de rock",
      startDate: futureDate,
      endDate: endDate,
      location: "Paris, France",
      maxCapacity: 100,
      availableTickets: 90,
      price: -10.0,
      category: CATEGORY_ID,
      organizer: "1",
    };

    it("should throw an error", async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        "EVENT_PRICE_MUST_BE_POSITIVE"
      );
    });
  });

  describe("Scenario: category does not exist", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = new Date(futureDate);
    endDate.setHours(endDate.getHours() + 3);

    const payload = {
      title: "Concert de Rock",
      description: "Un concert de rock",
      startDate: futureDate,
      endDate: endDate,
      location: "Paris, France",
      maxCapacity: 100,
      availableTickets: 90,
      price: 25.0,
      category: "000000000000000000000099",
      organizer: "1",
    };

    it("should throw an error", async () => {
      await expect(() => useCase.execute(payload)).rejects.toThrow(
        ERROR_MESSAGES.EVENT_CATEGORY_NOT_FOUND
      );
    });
  });

  describe("Scenario: Payload is valid", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const endDate = new Date(futureDate);
    endDate.setHours(endDate.getHours() + 3);

    const payload = {
      title: "Concert de Rock",
      description: "Un concert de rock avec plusieurs groupes locaux",
      startDate: futureDate,
      endDate: endDate,
      location: "Salle de concert principale, 123 Rue de la Musique, Paris",
      maxCapacity: 500,
      availableTickets: 450,
      price: 25.0,
      category: CATEGORY_ID,
      organizer: "1",
    };

    it("should be saved in the repository", async () => {
      const id = await useCase.execute(payload);

      const createdEvent = await repository.findById(id);

      expect(createdEvent).toBeDefined();
      expect(createdEvent!.title).toEqual(payload.title);
      expect(createdEvent!.description).toEqual(payload.description);
      expect(createdEvent!.location).toEqual(payload.location);
      expect(createdEvent!.maxCapacity).toEqual(payload.maxCapacity);
      expect(createdEvent!.availableTickets).toEqual(payload.availableTickets);
      expect(createdEvent!.price).toEqual(payload.price);
    });

    it("should return the ID of the event", async () => {
      const id = await useCase.execute(payload);
      expect(id).toBeDefined();
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
    });
  });
});

import mongoose from "mongoose";
import { AuthenticationMiddleware } from "@/api/middlewares/authentication.middleware";
import { JsonApiResponseMiddleware } from "@/api/middlewares/json-api-response.middleware";
import { ErrorHandlerMiddleware } from "@/api/middlewares/error-handler.middleware";
import { ERROR_MESSAGES } from "@/shared/constants/error-messages";
import type { Request, Response } from "express";
import { CreateEventController } from "@/api/controllers/v1/event/create-event.controller";
import { CreateEventUseCase } from "@/application/usecases/event/create-event.usecase";
import { MongoEventRepository } from "@/infrastructure/repositories/mongo-event-repository";
import { MongoEventCategoryRepository } from "@/infrastructure/repositories/mongo-event-category-repository";
import { EventModel } from "@/domain/models/event.model";
import { EventCategoryModel } from "@/domain/models/event-category.model";

const express = require("express");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("POST /api/v1/events", () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? "integration-test-secret";
    process.env.MONGO_URI =
      process.env.MONGO_URI ?? "mongodb://localhost:27017/eventhub_integration_test";

    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await EventModel.deleteMany({});
    await EventCategoryModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const buildTestApp = () => {
    const app = express();
    const jsonApiMiddleware = new JsonApiResponseMiddleware();
    const authenticationMiddleware = new AuthenticationMiddleware();
    const errorHandlerMiddleware = new ErrorHandlerMiddleware();
    const eventRepository = new MongoEventRepository();
    const eventCategoryRepository = new MongoEventCategoryRepository();
    const createEventUseCase = new CreateEventUseCase(
      eventRepository,
      eventCategoryRepository
    );
    const createEventController = new CreateEventController(createEventUseCase);

    app.use(express.json());
    app.use(jsonApiMiddleware.handle.bind(jsonApiMiddleware));
    app.post(
      "/api/v1/events",
      authenticationMiddleware.handle,
      (req: Request, res: Response, next: any) =>
        createEventController.handle(req, res, next)
    );
    app.use(errorHandlerMiddleware.handle.bind(errorHandlerMiddleware));

    return app;
  };

  it("should return 403 when authorization is missing", async () => {
    const app = buildTestApp();
    const now = new Date();
    const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

    const response = await request(app).post("/api/v1/events").send({
      title: "Mon événement",
      description: "Description de test",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      location: "Paris",
      maxCapacity: 100,
      availableTickets: 100,
      price: 10,
    });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe(
      ERROR_MESSAGES.MISSING_AUTHORIZATION_HEADER
    );
  });

  it("should create an event in MongoDB when authenticated", async () => {
    const app = buildTestApp();
    const eventCategory = await EventCategoryModel.create({
      name: "Concert",
    });
    const token = jwt.sign(
      { id: "user-1", email: "user@test.dev", role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const now = new Date();
    const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

    const response = await request(app)
      .post("/api/v1/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Mon événement",
        description: "Description de test",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: "Paris",
        maxCapacity: 100,
        availableTickets: 80,
        price: 10,
        category: eventCategory._id.toString(),
      });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe(ERROR_MESSAGES.EVENT_CREATED_SUCCESS);
    expect(response.body.data.id).toBeDefined();

    const createdInDb = await EventModel.findById(response.body.data.id).lean();
    expect(createdInDb).toBeTruthy();
    expect(createdInDb?.title).toBe("Mon événement");
    expect(createdInDb?.organizer).toBe("user-1");
  });
});

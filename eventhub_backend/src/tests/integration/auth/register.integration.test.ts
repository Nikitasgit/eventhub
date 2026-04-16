import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";
import { JsonApiResponseMiddleware } from "@/api/middlewares/json-api-response.middleware";
import { ErrorHandlerMiddleware } from "@/api/middlewares/error-handler.middleware";
import { RegisterController } from "@/api/controllers/v1/auth/register.controller";
import { RegisterUserUseCase } from "@/application/usecases/user/register-user.usecase";
import { MongoUserRepository } from "@/infrastructure/repositories/mongo-user-repository";
import { UserModel } from "@/domain/models/user.model";

const express = require("express");
const request = require("supertest");

describe("POST /api/v1/auth/register", () => {
  beforeAll(async () => {
    process.env.MONGO_URI =
      process.env.MONGO_URI ?? "mongodb://localhost:27017/eventhub_integration_test";
    await mongoose.connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const buildTestApp = () => {
    const app = express();
    const jsonApiMiddleware = new JsonApiResponseMiddleware();
    const errorHandlerMiddleware = new ErrorHandlerMiddleware();
    const registerUseCase = new RegisterUserUseCase(new MongoUserRepository());
    const registerController = new RegisterController(registerUseCase);

    app.use(express.json());
    app.use(jsonApiMiddleware.handle.bind(jsonApiMiddleware));
    app.post(
      "/api/v1/auth/register",
      (req: Request, res: Response, next: NextFunction) =>
        registerController.handle(req, res, next)
    );
    app.use(errorHandlerMiddleware.handle.bind(errorHandlerMiddleware));
    return app;
  };

  it("should register a user and persist it in MongoDB", async () => {
    const app = buildTestApp();

    const response = await request(app).post("/api/v1/auth/register").send({
      email: "student@test.dev",
      password: "StrongPassword123!",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe("student@test.dev");
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.role).toBe("USER");

    const userInDb = await UserModel.findOne({ email: "student@test.dev" })
      .lean()
      .exec();
    expect(userInDb).toBeTruthy();
    expect(userInDb?.password).not.toBe("StrongPassword123!");
  });
});

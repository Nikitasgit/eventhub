import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiRoutes } from "./routes";
import {
  JsonApiResponseMiddleware,
  ErrorHandlerMiddleware,
} from "./middlewares";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "../config/swagger.config";

const app = express();
const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const jsonApiMiddleware = new JsonApiResponseMiddleware();
app.use(jsonApiMiddleware.handle.bind(jsonApiMiddleware));

// Routes
app.use("/api", ApiRoutes);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler (doit être le dernier middleware)
const errorHandler = new ErrorHandlerMiddleware();
app.use(errorHandler.handle.bind(errorHandler));

export default app;

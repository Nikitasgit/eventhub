const express = require("express");
const mongoose = require("mongoose");
const { Pool } = require("pg");
const redis = require("redis");
const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/eventhub";
const POSTGRES_URL =
  process.env.POSTGRES_URL ||
  "postgresql://postgres:password@localhost:5432/eventhub";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let mongoStatus = "disconnected";
let postgresStatus = "disconnected";
let redisStatus = "disconnected";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    mongoStatus = "connected";
    console.log("MongoDB connected");
  })
  .catch(() => {
    mongoStatus = "error";
  });

const postgresPool = new Pool({ connectionString: POSTGRES_URL });
postgresPool
  .connect()
  .then(() => {
    postgresStatus = "connected";
    console.log("PostgreSQL connected");
  })
  .catch(() => {
    postgresStatus = "error";
  });

const redisClient = redis.createClient({ url: REDIS_URL });
redisClient
  .connect()
  .then(() => {
    redisStatus = "connected";
    console.log("Redis connected");
  })
  .catch(() => {
    redisStatus = "error";
  });

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "EventHub API",
    databases: {
      mongodb: mongoStatus,
      postgresql: postgresStatus,
      redis: redisStatus,
    },
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});

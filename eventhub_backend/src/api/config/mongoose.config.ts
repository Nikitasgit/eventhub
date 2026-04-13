import mongoose from "mongoose";

export async function initializeMongoose(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("Error while connecting to MongoDB: ", error);
    throw error;
  }
}


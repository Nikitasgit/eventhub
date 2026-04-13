import "dotenv/config";
import app from "./app";
import { initializeMongoose } from "./config/mongoose.config";

const PORT = process.env.PORT || 8000;

async function startServer(): Promise<void> {
  try {
    await initializeMongoose();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

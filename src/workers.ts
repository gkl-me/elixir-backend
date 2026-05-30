import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "./config/db";
import "reflect-metadata";
import "./di/index";
import "./queues/workers";
import logger from "./middlewares/logger";

async function bootStrap(): Promise<void> {
  try {
    console.log("Starting workers");

    await connectDB();

    console.log("Workers started listening");
  } catch (error) {
    console.error("Workers startup failed:", error);
    logger.error("Workers startup error", error);
    process.exit(1);
  }
}

void bootStrap();

//shut down code for workers and mongodb
process.on("SIGINT", async () => {
  console.log("Worker is shutting down");
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.log("Error while closing mongoose connection", error);
  }

  console.log("Worker shutdown complete");
  process.exit(0);
});

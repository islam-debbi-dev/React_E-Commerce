import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDatabase = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`[db] connected to ${config.mongoUri}`);
  return mongoose.connection;
};

export const disconnectDatabase = async () => {
  await mongoose.connection.close();
};

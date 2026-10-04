import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import { config } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

export const createApp = () => {
  const app = express();

  app.use(cors({ origin: [config.clientUrl, "http://localhost:3000"], credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const start = async () => {
  await connectDatabase();
  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`[api] ${config.shopName} listening on http://localhost:${config.port}/api`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} received, closing`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  ["SIGINT", "SIGTERM"].forEach((signal) => process.on(signal, () => shutdown(signal)));

  return server;
};

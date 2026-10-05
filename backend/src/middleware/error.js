import multer from "multer";
import { config } from "../config/env.js";
import { ApiError } from "../lib/errors.js";

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} does not exist`));
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  let status = error.status ?? 500;
  let message = error.message ?? "Something went wrong";
  let details = error.details;

  if (error.name === "ValidationError" && error.errors) {
    status = 400;
    message = "Validation failed";
    details = Object.values(error.errors).map((item) => item.message);
  }

  if (error.name === "CastError") {
    status = 400;
    message = `Invalid value for ${error.path}`;
  }

  if (error.code === 11000) {
    status = 409;
    const field = Object.keys(error.keyPattern ?? {})[0] ?? "field";
    message = `${field} already exists`;
    details = error.keyValue;
  }

  if (error instanceof multer.MulterError) {
    status = 400;
    message = `Upload failed: ${error.message}`;
  }

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, error);
  }

  res.status(status).json({
    error: message,
    ...(details ? { details } : {}),
    shop: config.shopName,
  });
};

export const requireAdminKey = (req, res, next) => {
  if (!config.adminKey) {
    next();
    return;
  }
  const bearer = req.get("authorization")?.replace(/^Bearer\s+/i, "");
  const provided = req.get("x-admin-key") || bearer;
  if (provided !== config.adminKey) {
    next(ApiError.unauthorized());
    return;
  }
  next();
};

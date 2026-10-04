import { Router } from "express";
import productRoutes from "./products.routes.js";
import categoryRoutes from "./categories.routes.js";
import orderRoutes from "./orders.routes.js";
import { config, hasTelegram, hasCloudinary } from "../config/env.js";
import mongoose from "mongoose";

const router = Router();

router.get("/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    shop: config.shopName,
    db: states[mongoose.connection.readyState] ?? "unknown",
    integrations: {
      telegram: hasTelegram(),
      cloudinary: hasCloudinary(),
      whatsappNumber: config.whatsappNumber,
    },
  });
});

router.use(categoryRoutes);
router.use(productRoutes);
router.use(orderRoutes);

export default router;

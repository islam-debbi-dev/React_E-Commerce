import { Router } from "express";
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  resendOrderToTelegram,
} from "../controllers/orders.controller.js";
import { requireAdminKey } from "../middleware/error.js";

const router = Router();

router.post("/orders", createOrder);

router.get("/orders", requireAdminKey, listOrders);
router.get("/orders/:id", requireAdminKey, getOrder);
router.patch("/orders/:id/status", requireAdminKey, updateOrderStatus);
router.post("/orders/:id/notify", requireAdminKey, resendOrderToTelegram);

export default router;

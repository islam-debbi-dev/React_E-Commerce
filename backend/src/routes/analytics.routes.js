import { Router } from "express";
import { getOverview, getProductStats } from "../controllers/analytics.controller.js";
import { requireAdminKey } from "../middleware/error.js";

const router = Router();

router.get("/analytics/overview", requireAdminKey, getOverview);
router.get("/analytics/products", requireAdminKey, getProductStats);

export default router;
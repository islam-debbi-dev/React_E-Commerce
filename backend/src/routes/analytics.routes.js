import { Router } from "express";
import { getOverview } from "../controllers/analytics.controller.js";
import { requireAdminKey } from "../middleware/error.js";

const router = Router();

router.get("/analytics/overview", requireAdminKey, getOverview);

export default router;
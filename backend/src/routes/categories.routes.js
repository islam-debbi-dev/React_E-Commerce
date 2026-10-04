import { Router } from "express";
import { listCategories } from "../controllers/products.controller.js";

const router = Router();

router.get("/categories", listCategories);

export default router;

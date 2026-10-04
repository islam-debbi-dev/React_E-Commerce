import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { uploadProductImages } from "../middleware/upload.js";
import { requireAdminKey } from "../middleware/error.js";

const router = Router();

router.get("/products", listProducts);
router.get("/products/:id", getProduct);

router.post("/products", requireAdminKey, uploadProductImages, createProduct);
router.patch("/products/:id", requireAdminKey, uploadProductImages, updateProduct);
router.delete("/products/:id", requireAdminKey, deleteProduct);

export default router;

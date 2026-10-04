import mongoose from "mongoose";
import Category, { titleFromSlug } from "./Category.js";

const ratingSchema = new mongoose.Schema(
  {
    rate: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    brand: { type: String, trim: true },
    sku: { type: String, trim: true },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: ratingSchema, default: () => ({ rate: 0, count: 0 }) },
    image: { type: String, default: "" },
    images: { type: [String], default: [] },
    cloudinaryIds: { type: [String], default: [] },
    source: { type: String, default: "manual" },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text", brand: "text" });
productSchema.pre("validate", function normalizeCategory(next) {
  this.category = (this.category || "").trim().toLowerCase();
  if (this.image && !this.images.includes(this.image)) {
    this.images = [this.image, ...this.images];
  }
  next();
});

export const categoryTitle = (slug) => titleFromSlug(slug);

export const toClientProduct = (product) => ({
  id: product._id.toString(),
  title: product.title,
  description: product.description,
  price: product.price,
  discountPercentage: product.discountPercentage,
  category: product.category,
  categoryTitle: categoryTitle(product.category),
  brand: product.brand,
  sku: product.sku,
  stock: product.stock,
  rating: { rate: product.rating?.rate ?? 0, count: product.rating?.count ?? 0 },
  image: product.image,
  images: product.images,
  createdAt: product.createdAt,
});

export default mongoose.model("Product", productSchema);

export { Category };

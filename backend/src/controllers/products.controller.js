import mongoose from "mongoose";
import Product, { toClientProduct } from "../models/Product.js";
import Category, { titleFromSlug } from "../models/Category.js";
import { ApiError, asyncHandler } from "../lib/errors.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";
import { collectFiles } from "../middleware/upload.js";

const escapeRegExp = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findProduct = async (id) => {
  const product = mongoose.isValidObjectId(id)
    ? await Product.findById(id)
    : await Product.findOne({ sku: id });
  if (!product) {
    throw ApiError.notFound(`Product ${id} not found`);
  }
  return product;
};

const uploadAll = async (req, folder) => {
  const uploaded = [];
  for (const file of collectFiles(req)) {
    uploaded.push(await uploadImage(file, folder));
  }
  return uploaded;
};

export const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 200);
  const filter = {};

  if (req.query.category) {
    filter.category = String(req.query.category).trim().toLowerCase();
  }

  if (req.query.search) {
    const pattern = new RegExp(escapeRegExp(String(req.query.search).trim()), "i");
    filter.$or = [{ title: pattern }, { description: pattern }, { brand: pattern }];
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  res.json({
    products: products.map(toClientProduct),
    total,
    page,
    limit,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id);
  res.json({ product: toClientProduct(product.toObject ? product.toObject() : product) });
});

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  await Promise.all(
    categories.map((category) =>
      Category.updateOne(
        { name: category._id },
        { $setOnInsert: { name: category._id, title: titleFromSlug(category._id) } },
        { upsert: true }
      )
    )
  );

  res.json({
    categories: categories.map((category) => ({
      slug: category._id,
      name: titleFromSlug(category._id),
      count: category.count,
    })),
  });
});

const readProductPayload = (body) => ({
  title: body.title,
  description: body.description ?? "",
  price: body.price === undefined ? undefined : Number(body.price),
  discountPercentage:
    body.discountPercentage === undefined ? undefined : Number(body.discountPercentage),
  category: body.category,
  brand: body.brand ?? "",
  sku: body.sku ?? "",
  stock: body.stock === undefined ? undefined : Number(body.stock),
  rating: body.rate === undefined ? undefined : { rate: Number(body.rate), count: Number(body.count ?? 0) },
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = readProductPayload(req.body);

  for (const field of ["title", "category"]) {
    if (!payload[field]) {
      throw ApiError.badRequest(`${field} is required`);
    }
  }
  if (Number.isNaN(payload.price) || payload.price === undefined || payload.price < 0) {
    throw ApiError.badRequest("price must be a number >= 0");
  }

  const uploaded = await uploadAll(req, "ecommerce/products");
  const primary = uploaded[0];

  const product = await Product.create({
    ...payload,
    image: req.body.imageUrl?.trim() || primary?.url || "",
    images: [req.body.imageUrl?.trim(), ...uploaded.map((item) => item.url)].filter(Boolean),
    cloudinaryIds: uploaded.map((item) => item.publicId),
    source: "manual",
  });

  await Category.updateOne(
    { name: product.category },
    { $setOnInsert: { name: product.category, title: titleFromSlug(product.category) } },
    { upsert: true }
  );

  res.status(201).json({ product: toClientProduct(product.toObject()) });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id);

  const payload = readProductPayload(req.body);
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      product[key] = value;
    }
  });

  const uploaded = await uploadAll(req, "ecommerce/products");
  if (uploaded.length) {
    product.images = [...uploaded.map((item) => item.url), ...product.images];
    product.cloudinaryIds = [...uploaded.map((item) => item.publicId), ...product.cloudinaryIds];
    product.image = uploaded[0].url;
  }

  if (req.body.imageUrl?.trim()) {
    product.image = req.body.imageUrl.trim();
    product.images = [product.image, ...product.images.filter((url) => url !== product.image)];
  }

  await product.save();
  res.json({ product: toClientProduct(product.toObject()) });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await findProduct(req.params.id);
  await Product.deleteOne({ _id: product._id });
  await Promise.all((product.cloudinaryIds ?? []).map((publicId) => deleteImage(publicId)));
  res.json({ deleted: true, id: req.params.id });
});

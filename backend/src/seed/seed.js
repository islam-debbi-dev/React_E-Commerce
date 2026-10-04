import { connectDatabase, disconnectDatabase } from "../config/db.js";
import Product from "../models/Product.js";
import Category, { titleFromSlug } from "../models/Category.js";
import { cloudinary, hasCloudinary } from "../config/cloudinary.js";
import { config } from "../config/env.js";

const SOURCE_URL = "https://dummyjson.com";

const fetchJson = async (path) => {
  const response = await fetch(`${SOURCE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path} responded with ${response.status}`);
  }
  return response.json();
};

const uploadToCloudinary = (url) =>
  new Promise((resolve) => {
    cloudinary.uploader.upload(
      url,
      {
        folder: "ecommerce/products",
        resource_type: "image",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          console.warn(`[seed] cloudinary upload failed for ${url}: ${error.message}`);
          resolve({ url, publicId: "" });
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
  });

const run = async () => {
  await connectDatabase();

  const [{ products: sourceProducts }] = await Promise.all([fetchJson("/products?limit=0")]);
  console.log(`[seed] fetched ${sourceProducts.length} products from ${SOURCE_URL}`);

  const useCloudinary = process.argv.includes("--cloudinary") && hasCloudinary();
  if (process.argv.includes("--cloudinary") && !hasCloudinary()) {
    console.warn("[seed] --cloudinary requested but Cloudinary env vars are missing, keeping remote URLs");
  }

  const categories = new Set();
  let inserted = 0;
  let updated = 0;

  for (const item of sourceProducts) {
    categories.add(item.category);

    let image = item.thumbnail ?? "";
    let cloudinaryIds = [];

    if (useCloudinary && image) {
      const uploaded = await uploadToCloudinary(image);
      image = uploaded.url;
      cloudinaryIds = uploaded.publicId ? [uploaded.publicId] : [];
    }

    const payload = {
      title: item.title,
      description: item.description ?? "",
      price: item.price,
      discountPercentage: item.discountPercentage ?? 0,
      category: item.category,
      brand: item.brand ?? "",
      sku: item.sku ?? "",
      stock: item.stock ?? 0,
      rating: {
        rate: item.rating ?? 0,
        count: Array.isArray(item.reviews) ? item.reviews.length : 0,
      },
      image,
      images: image ? [image] : [],
      cloudinaryIds,
      source: "dummyjson",
    };

    const existing = await Product.findOneAndUpdate(
      { sku: payload.sku || `dummyjson-${item.id}`, title: payload.title },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (existing.createdAt.getTime() === existing.updatedAt.getTime()) {
      inserted += 1;
    } else {
      updated += 1;
    }
  }

  await Promise.all(
    [...categories].map((slug) =>
      Category.updateOne(
        { name: slug },
        { $setOnInsert: { name: slug, title: titleFromSlug(slug) } },
        { upsert: true }
      )
    )
  );

  console.log(
    `[seed] done for ${config.shopName}: ${inserted} inserted, ${updated} updated, ${categories.size} categories, cloudinary=${
      useCloudinary ? "on" : "off"
    }`
  );

  await disconnectDatabase();
};

run().catch(async (error) => {
  console.error("[seed] failed", error);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});

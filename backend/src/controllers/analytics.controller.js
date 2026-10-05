import mongoose from "mongoose";
import Order, { toClientOrder } from "../models/Order.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { asyncHandler } from "../lib/errors.js";
import { titleFromSlug } from "../models/Category.js";
import { LOW_STOCK_THRESHOLD } from "./products.controller.js";

const round = (value) => Math.round(Number(value) * 100) / 100;

const DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const value = new Date(date);
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
};

const dayKey = (date) => new Date(date).toISOString().slice(0, 10);

const buildTrend = (rows, days) => {
  const buckets = new Map();
  const today = startOfDay(new Date());

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    buckets.set(dayKey(new Date(today.getTime() - offset * DAY)), {
      revenue: 0,
      orders: 0,
    });
  }

  for (const row of rows) {
    const bucket = buckets.get(row._id);
    if (bucket) {
      bucket.revenue += row.revenue;
      bucket.orders += row.orders;
    }
  }

  return [...buckets.entries()].map(([date, bucket]) => ({
    date,
    revenue: round(bucket.revenue),
    orders: bucket.orders,
  }));
};

export const getOverview = asyncHandler(async (req, res) => {
  const days = Math.min(Math.max(Number(req.query.days) || 14, 7), 90);
  const trendStart = startOfDay(new Date(Date.now() - (days - 1) * DAY));
  const previousStart = new Date(trendStart.getTime() - 7 * DAY);
  const excludedStatuses = ["cancelled"];

  const [
    productTotals,
    categoryCount,
    customerCount,
    orderTotals,
    statusRows,
    channelRows,
    trendRows,
    revenueSlices,
    topProductRows,
    recentOrders,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.distinct("customer.phone"),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.aggregate([{ $group: { _id: "$channel", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { createdAt: { $gte: trendStart } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    (async () => {
      const [current, previous] = await Promise.all([
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: trendStart },
              status: { $nin: excludedStatuses },
            },
          },
          { $group: { _id: null, revenue: { $sum: "$total" } } },
        ]),
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: previousStart, $lt: trendStart },
              status: { $nin: excludedStatuses },
            },
          },
          { $group: { _id: null, revenue: { $sum: "$total" } } },
        ]),
      ]);
      return {
        current: round(current[0]?.revenue || 0),
        previous: round(previous[0]?.revenue || 0),
      };
    })(),
    Order.aggregate([
      { $match: { status: { $nin: excludedStatuses } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          title: { $last: "$items.title" },
          image: { $last: "$items.image" },
          units: { $sum: "$items.qty" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
        },
      },
      { $sort: { units: -1, revenue: -1 } },
      { $limit: 5 },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  const statuses = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
  for (const row of statusRows) {
    if (row._id in statuses) {
      statuses[row._id] = row.count;
    }
  }

  const channels = { telegram: 0, whatsapp: 0 };
  for (const row of channelRows) {
    if (row._id in channels) {
      channels[row._id] = row.count;
    }
  }

  const changePercent = revenueSlices.previous
    ? round(((revenueSlices.current - revenueSlices.previous) / revenueSlices.previous) * 100)
    : null;

  res.json({
    code: "SUCCESS",
    message: "Overview",
    revenue: {
      total: revenueSlices.current,
      previousPeriod: revenueSlices.previous,
      changePercent,
      windowDays: days,
    },
    orders: {
      total: orderTotals,
      ...statuses,
    },
    products: {
      total: productTotals,
      categories: categoryCount,
    },
    customers: {
      total: customerCount.length,
    },
    channels,
    salesTrend: buildTrend(trendRows, days),
    topProducts: topProductRows.map((row) => ({
      productId: row._id,
      title: row.title,
      image: row.image,
      units: row.units,
      revenue: round(row.revenue),
    })),
    recentOrders: recentOrders.map(toClientOrder),
    generatedAt: new Date().toISOString(),
    db: mongoose.connection.readyState === 1,
  });
});
export const getProductStats = asyncHandler(async (req, res) => {
  const [totals, categoryCount, categoryRows] = await Promise.all([
    Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          inStock: { $sum: { $cond: [{ $gt: ["$stock", 0] }, 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
          lowStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ["$stock", 0] },
                    { $lte: ["$stock", LOW_STOCK_THRESHOLD] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          discounted: { $sum: { $cond: [{ $gt: ["$discountPercentage", 0] }, 1, 0] } },
          units: { $sum: "$stock" },
          inventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
          averagePrice: { $avg: "$price" },
          averageRating: { $avg: "$rating.rate" },
          maxPrice: { $max: "$price" },
        },
      },
    ]),
    Category.countDocuments(),
    Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          units: { $sum: "$stock" },
          value: { $sum: { $multiply: ["$price", "$stock"] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
  ]);

  const stats = totals[0] ?? {};

  res.json({
    code: "SUCCESS",
    message: "Product statistics",
    totals: {
      total: stats.total ?? 0,
      categories: categoryCount,
      inStock: stats.inStock ?? 0,
      outOfStock: stats.outOfStock ?? 0,
      lowStock: stats.lowStock ?? 0,
      discounted: stats.discounted ?? 0,
      units: stats.units ?? 0,
      inventoryValue: round(stats.inventoryValue ?? 0),
      averagePrice: round(stats.averagePrice ?? 0),
      averageRating: Math.round((stats.averageRating ?? 0) * 10) / 10,
      maxPrice: round(stats.maxPrice ?? 0),
    },
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    topCategories: categoryRows.map((row) => ({
      category: row._id,
      title: titleFromSlug(row._id),
      count: row.count,
      units: row.units,
      value: round(row.value),
    })),
    generatedAt: new Date().toISOString(),
    db: mongoose.connection.readyState === 1,
  });
});

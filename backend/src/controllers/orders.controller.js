import mongoose from "mongoose";
import Order, { toClientOrder } from "../models/Order.js";
import Product from "../models/Product.js";
import { config } from "../config/env.js";
import { ApiError, asyncHandler, generateOrderNumber } from "../lib/errors.js";
import { buildWhatsAppUrl } from "../services/orderMessage.service.js";
import { sendOrderToTelegram } from "../services/telegram.service.js";

const round = (value) => Math.round(Number(value) * 100) / 100;

const orderFilter = (id) =>
  mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { orderNumber: id }] } : { orderNumber: id };

const normalizeItems = async (rawItems) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw ApiError.badRequest("items must be a non empty array");
  }

  const items = [];
  for (const raw of rawItems) {
    const productId = String(raw.productId ?? raw.id ?? "").trim();
    const qty = Math.max(Number(raw.qty) || 1, 1);
    if (!productId) {
      throw ApiError.badRequest("every item needs a productId");
    }

    const product = mongoose.isValidObjectId(productId)
      ? await Product.findById(productId).lean()
      : null;

    if (!product) {
      throw ApiError.badRequest(
        `Product "${productId}" is not in the shop any more, remove it from the cart and try again`
      );
    }

    items.push({
      productId,
      title: product.title,
      price: product.price,
      qty,
      image: product.image,
    });
  }
  return items;
};

const readCustomer = (body) => {
  const customer = {
    name: String(body.name ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    address: String(body.address ?? "").trim(),
    note: String(body.note ?? "").trim(),
  };

  if (!customer.name) {
    throw ApiError.badRequest("name is required");
  }
  if (!/^[+\d][\d\s()-]{6,}$/.test(customer.phone)) {
    throw ApiError.badRequest("a valid phone number is required");
  }
  return customer;
};

const readChannel = (body) => {
  const channel = String(body.channel ?? "telegram").trim().toLowerCase();
  if (!["telegram", "whatsapp"].includes(channel)) {
    throw ApiError.badRequest("channel must be telegram or whatsapp");
  }
  return channel;
};

export const createOrder = asyncHandler(async (req, res) => {
  const customer = readCustomer(req.body);
  const items = await normalizeItems(req.body.items);
  const channel = readChannel(req.body);

  const subtotal = round(items.reduce((sum, item) => sum + item.price * item.qty, 0));
  const shipping = items.length ? config.shippingFlat : 0;
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customer,
    items,
    itemCount,
    channel,
    subtotal,
    shipping,
    total: round(subtotal + shipping),
    status: "pending",
  });

  const telegram = await sendOrderToTelegram(order);
  order.notifications.telegram = telegram;
  const whatsappUrl = buildWhatsAppUrl(order);
  order.notifications.whatsappUrl = whatsappUrl;
  await order.save();

  res.status(201).json({
    order: toClientOrder(order.toObject()),
    whatsappUrl,
    telegramSent: telegram.sent,
    telegramError: telegram.sent ? "" : telegram.error,
  });
});

export const listOrders = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const filter = req.query.status ? { status: req.query.status } : {};

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.json({
    orders: orders.map(toClientOrder),
    total,
    page,
    limit,
    totalPages: Math.max(Math.ceil(total / limit), 1),
  });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne(orderFilter(req.params.id)).lean();

  if (!order) {
    throw ApiError.notFound(`Order ${req.params.id} not found`);
  }
  res.json({ order: toClientOrder(order) });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const status = String(req.body.status ?? "");
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) {
    throw ApiError.badRequest(`status must be one of ${allowed.join(", ")}`);
  }

  const order = await Order.findOneAndUpdate(
    orderFilter(req.params.id),
    { status },
    { new: true }
  ).lean();

  if (!order) {
    throw ApiError.notFound(`Order ${req.params.id} not found`);
  }
  res.json({ order: toClientOrder(order) });
});

export const resendOrderToTelegram = asyncHandler(async (req, res) => {
  const order = await Order.findOne(orderFilter(req.params.id));
  if (!order) {
    throw ApiError.notFound(`Order ${req.params.id} not found`);
  }

  const telegram = await sendOrderToTelegram(order);
  order.notifications.telegram = telegram;
  await order.save();

  res.json({ order: toClientOrder(order.toObject()), telegramSent: telegram.sent, telegramError: telegram.error });
});

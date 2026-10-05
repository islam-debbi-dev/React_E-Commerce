import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
    note: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: customerSchema, required: true },
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, "Order needs at least one item"],
    },
    itemCount: { type: Number, default: 0 },
    channel: {
      type: String,
      enum: ["telegram", "whatsapp"],
      default: "telegram",
      index: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    notifications: {
      telegram: {
        sent: { type: Boolean, default: false },
        error: { type: String, default: "" },
        chatId: { type: String, default: "" },
      },
      whatsappUrl: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const toClientOrder = (order) => ({
  id: order._id.toString(),
  orderNumber: order.orderNumber,
  customer: order.customer,
  items: order.items,
  itemCount: order.itemCount,
  channel: order.channel,
  subtotal: order.subtotal,
  shipping: order.shipping,
  total: order.total,
  status: order.status,
  notifications: order.notifications,
  createdAt: order.createdAt,
});

export default mongoose.model("Order", orderSchema);

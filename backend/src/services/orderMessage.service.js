import { config } from "../config/env.js";

const round = (value) => Math.round(Number(value) * 100) / 100;

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const orderLines = (order) =>
  order.items.map(
    (item) =>
      `• ${item.qty} x ${item.title} — ${config.currency}${round(item.price * item.qty)}`
  );

export const buildOrderText = (order) =>
  [
    `🛒 New order ${order.orderNumber}`,
    "",
    `👤 ${order.customer.name}`,
    `📞 ${order.customer.phone}`,
    ...(order.customer.address ? [`🏠 ${order.customer.address}`] : []),
    ...(order.customer.note ? [`📝 ${order.customer.note}`] : []),
    "",
    "🧾 Items:",
    ...orderLines(order),
    "",
    `Subtotal: ${config.currency}${round(order.subtotal)}`,
    `Shipping: ${config.currency}${round(order.shipping)}`,
    `Total: ${config.currency}${round(order.total)}`,
  ].join("\n");

export const buildOrderHtml = (order) => {
  const items = order.items
    .map(
      (item) =>
        `<tr><td>${escapeHtml(item.title)}</td><td align="center">${item.qty}</td><td align="right">${escapeHtml(
          config.currency
        )}${round(item.price * item.qty)}</td></tr>`
    )
    .join("");

  return [
    `<b>🛒 New order ${escapeHtml(order.orderNumber)}</b>`,
    "",
    `<b>👤</b> ${escapeHtml(order.customer.name)}`,
    `<b>📞</b> ${escapeHtml(order.customer.phone)}`,
    order.customer.address ? `<b>🏠</b> ${escapeHtml(order.customer.address)}` : "",
    order.customer.note ? `<b>📝</b> ${escapeHtml(order.customer.note)}` : "",
    "",
    "<b>🧾 Items</b>",
    "<table><tr><th align='left'>Product</th><th>Qty</th><th align='right'>Total</th></tr>",
    items,
    `</table>`,
    "",
    `Subtotal: <b>${escapeHtml(config.currency)}${round(order.subtotal)}</b>`,
    `Shipping: ${escapeHtml(config.currency)}${round(order.shipping)}`,
    `Total: <b>${escapeHtml(config.currency)}${round(order.total)}</b>`,
  ]
    .filter(Boolean)
    .join("\n");
};

export const buildWhatsAppUrl = (order) => {
  const intro = `Hello ${config.shopName}, I want to place this order:`;
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    `${intro}\n\n${buildOrderText(order)}`
  )}`;
};

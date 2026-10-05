import { request } from "./products";

/** Returns the full creation response: { order, whatsappUrl, telegramSent, telegramError } */
export const createOrder = async (payload) =>
  request("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
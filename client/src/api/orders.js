import { request } from "./products";

export const createOrder = async (order) => {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
};

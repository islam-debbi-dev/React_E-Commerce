import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { Order, OrderStatus } from "@/types/order";

type OrdersData = {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type OrderData = {
  order: Order;
};

export function useOrders(
  page: number = 1,
  limit: number = 20,
  status: OrderStatus | "all" = "all",
  search: string = "",
) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  if (status !== "all") {
    params.append("status", status);
  }

  const query = search.trim() ? `&search=${encodeURIComponent(search.trim())}` : "";

  return useSWR<OrdersData>(`/orders?${params.toString()}${query}`, fetcher, {
    keepPreviousData: true,
  });
}

export function useOrder(id: string) {
  return useSWR<OrderData>(`/orders/${id}`, fetcher, {
    keepPreviousData: true,
  });
}
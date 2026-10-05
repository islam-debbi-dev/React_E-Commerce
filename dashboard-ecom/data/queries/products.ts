import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { Product, ProductsResponse } from "@/types/product";

export function useProducts(
  page: number = 1,
  limit: number = 20,
  search: string = "",
  category: string = "all",
  order: string = "newest",
) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  params.append("order", order);

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (category !== "all") {
    params.append("category", category);
  }

  return useSWR<ProductsResponse>(`/products?${params.toString()}`, fetcher, {
    keepPreviousData: true,
  });
}

export function useProduct(id: string) {
  return useSWR<{ product: Product }>(`/products/${id}`, fetcher, {
    keepPreviousData: true,
  });
}
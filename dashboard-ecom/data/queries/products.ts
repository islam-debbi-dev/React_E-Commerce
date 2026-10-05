import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import type {
  CategoriesResponse,
  Product,
  ProductsResponse,
  ProductFilters,
  ProductSort,
  ProductStatsResponse,
  StockFilter,
} from "@/types/product";

const DEFAULT_SORT: ProductSort = "newest";

export function useProducts({
  page = 1,
  limit = 20,
  search = "",
  category = "all",
  sort = DEFAULT_SORT,
  stock = "all",
}: ProductFilters = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
  });

  if (search.trim()) params.set("search", search.trim());
  if (category !== "all") params.set("category", category);
  if (stock !== "all") params.set("stock", stock);

  return useSWR<ProductsResponse>(`/products?${params.toString()}`, fetcher, {
    keepPreviousData: true,
  });
}

export function useProduct(id: string | null) {
  return useSWR<{ product: Product }>(id ? `/products/${id}` : null, fetcher);
}

export function useCategories() {
  return useSWR<CategoriesResponse>("/categories", fetcher, {
    keepPreviousData: true,
  });
}

export function useProductStats() {
  return useSWR<ProductStatsResponse>("/analytics/products", fetcher, {
    keepPreviousData: true,
  });
}

export const PRODUCT_SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "rating_desc", label: "Rating: high to low" },
  { value: "rating_asc", label: "Rating: low to high" },
];

export const STOCK_FILTER_OPTIONS: { value: StockFilter; label: string }[] = [
  { value: "all", label: "All stock" },
  { value: "in", label: "In stock" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
];
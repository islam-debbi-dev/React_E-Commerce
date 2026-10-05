export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  category: string;
  categoryTitle: string;
  brand: string;
  sku: string;
  stock: number;
  rating: ProductRating;
  image: string;
  images: string[];
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sort: ProductSort;
  priceRange: {
    min: number;
    max: number;
  };
}

export type ProductSort =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "rating_asc";

/** `low` means "in stock with LOW_STOCK_THRESHOLD units or fewer". */
export type StockFilter = "all" | "in" | "low" | "out";

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: ProductSort;
  stock?: StockFilter;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface ProductTotals {
  total: number;
  categories: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
  discounted: number;
  units: number;
  inventoryValue: number;
  averagePrice: number;
  averageRating: number;
  maxPrice: number;
}

export interface ProductCategoryStat {
  category: string;
  title: string;
  count: number;
  units: number;
  value: number;
}

export interface ProductStatsResponse {
  code: string;
  message: string;
  totals: ProductTotals;
  lowStockThreshold: number;
  topCategories: ProductCategoryStat[];
  generatedAt: string;
  db: boolean;
}

export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  rate: number;
  count: number;
}
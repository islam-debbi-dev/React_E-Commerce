"use client";

import { useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { Package, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorCard from "@/components/shared/error-card";
import { EmptyState } from "@/components/shared/empty-state";
import SearchInput from "@/components/table/search-input";
import TableLimitSelector from "@/components/table/table-limit-selector";
import TablePagination from "@/components/table/table-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductStatsCards from "@/components/products/product-stats-cards";
import ProductsTable from "@/components/products/products-table";
import ProductFormSheet from "@/components/products/product-form-sheet";
import DeleteProductDialog from "@/components/products/delete-product-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import {
  PRODUCT_SORT_OPTIONS,
  STOCK_FILTER_OPTIONS,
  useCategories,
  useProducts,
  useProductStats,
} from "@/data/queries/products";
import { formatNumber } from "@/lib/format";
import type { ActionResponseType } from "@/types/actions-response";
import type { Product, ProductSort, StockFilter } from "@/types/product";

const ALL_CATEGORIES = "all";

export default function ProductsPageClient() {
  const { mutate } = useSWRConfig();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [sort, setSort] = useState<ProductSort>("newest");
  const [stock, setStock] = useState<StockFilter>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const {
    data,
    isLoading,
    error,
    isValidating,
  } = useProducts({
    page,
    limit,
    search: debouncedSearch,
    category,
    sort,
    stock,
  });
  const { data: stats, isLoading: statsLoading } = useProductStats();
  const { data: categoriesData } = useCategories();

  const categories = useMemo(() => categoriesData?.categories ?? [], [categoriesData]);
  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const lowStockThreshold = stats?.lowStockThreshold ?? 5;

  const refresh = () => {
    void mutate(() => true);
  };

  const handleResult = (result: ActionResponseType, close?: () => void) => {
    if (result.success) {
      toast.success(result.message);
      close?.();
      refresh();
      return;
    }

    toast.error(result.message);
  };

  const handleSaved = (result: ActionResponseType) => {
    handleResult(result, () => {
      setFormOpen(false);
      setEditing(null);
    });
  };

  const handleDeleted = (result: ActionResponseType) => {
    handleResult(result, () => setDeleting(null));
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const openDelete = (product: Product) => setDeleting(product);

  const isFiltered = Boolean(debouncedSearch) || category !== ALL_CATEGORIES || stock !== "all";

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <ErrorCard title="Error loading the catalogue" />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-4 px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            {formatNumber(data?.total ?? 0)} product{(data?.total ?? 0) === 1 ? "" : "s"} in the
            catalogue. Add, edit or remove anything the storefront shows.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </div>

      <ProductStatsCards
        totals={stats?.totals}
        lowStockThreshold={lowStockThreshold}
        loading={statsLoading}
      />

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="lg:max-w-xs lg:flex-1">
              <SearchInput
                search={search}
                setSearch={setSearch}
                setPage={setPage}
                isLoading={isValidating && Boolean(debouncedSearch)}
                placeholder="Search by title, brand or SKU…"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:items-center">
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full lg:w-[190px]" aria-label="Filter by category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                  {categories.map((item) => (
                    <SelectItem key={item.slug} value={item.slug}>
                      {item.name} ({item.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sort}
                onValueChange={(value) => setSort(value as ProductSort)}
              >
                <SelectTrigger className="w-full lg:w-[190px]" aria-label="Sort products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={stock}
                onValueChange={(value) => {
                  setStock(value as StockFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full lg:w-[160px]" aria-label="Filter by stock">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {stats && stats.topCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {stats.topCategories.map((item) => (
                <span
                  key={item.category}
                  className="rounded-full border px-2.5 py-1 tabular-nums"
                >
                  {item.title} · {item.count}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-y py-2 text-sm text-muted-foreground">
            <span className="tabular-nums">
              {isLoading
                ? "Loading…"
                : `${formatNumber(products.length)} of ${formatNumber(data?.total ?? 0)} shown`}
              {isValidating && !isLoading && (
                <RefreshCw className="ml-2 inline h-3.5 w-3.5 animate-spin" />
              )}
            </span>
            <TableLimitSelector limit={limit} setLimit={setLimit} page={page} setPage={setPage} />
          </div>

          {isLoading && products.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((row) => (
                <Skeleton key={row} className="h-14 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title={isFiltered ? "No products match those filters" : "No products yet"}
              description={
                isFiltered
                  ? "Try a different search term, category or stock filter."
                  : "Add your first product to fill the storefront."
              }
            >
              {isFiltered ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setCategory(ALL_CATEGORIES);
                    setStock("all");
                    setPage(1);
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  Add product
                </Button>
              )}
            </EmptyState>
          ) : (
            <ProductsTable
              products={products}
              loading={isValidating}
              lowStockThreshold={lowStockThreshold}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          )}

          {products.length > 0 && (
            <TablePagination page={page} setPage={setPage} totalPages={totalPages} />
          )}
        </CardContent>
      </Card>

      <ProductFormSheet
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        product={editing}
        categories={categories}
        onSaved={handleSaved}
      />

      <DeleteProductDialog
        product={deleting}
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
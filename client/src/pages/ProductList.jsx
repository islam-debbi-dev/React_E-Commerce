import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Rows3, Search, SlidersHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ProductCard, { ProductCardSkeleton } from "@/components/product/product-card";
import FilterPanel, { LimitSelect, SORT_OPTIONS } from "@/components/product/filter-panel";
import Pagination from "@/components/product/pagination";
import EmptyState from "@/components/empty-state";
import useProductFilters from "@/hooks/use-product-filters";
import { getCategories, getProducts } from "@/api/products";

export default function ProductList() {
  const {
    term,
    setTerm,
    q,
    category,
    sort,
    minPrice,
    maxPrice,
    minRating,
    page,
    limit,
    activeFilterCount,
    patch,
    clearFilters,
    clearFilter,
    setPage,
    setLimit,
  } = useProductFilters();

  const [categories, setCategories] = useState([]);
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 1000 });
  const [data, setData] = useState({ products: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [layout, setLayout] = useState(() =>
    window.localStorage.getItem("productLayout") === "list" ? "list" : "grid"
  );
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("productLayout", layout);
  }, [layout]);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((res) => active && setCategories(res.categories ?? []))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getProducts({
      q,
      category,
      sort,
      minPrice,
      maxPrice,
      minRating,
      page,
      limit,
    })
      .then((res) => {
        if (!active) return;
        setData(res);
        if (res.priceRange?.max) {
          setPriceBounds({ min: res.priceRange.min, max: res.priceRange.max });
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [q, category, sort, minPrice, maxPrice, minRating, page, limit]);

  const products = data.products ?? [];

  const panelProps = {
    categories,
    category,
    minPrice,
    maxPrice,
    minRating,
    priceBounds,
    activeFilterCount,
    onChange: patch,
    onClearAll: clearFilters,
    onClearFilter: clearFilter,
  };

  const summary = useMemo(() => {
    if (loading) return "Loading products…";
    if (!data.total) return "No products found";
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, data.total);
    return `Showing ${from}–${to} of ${data.total} products`;
  }, [loading, data.total, page, limit]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Shop</h1>
        <p className="text-sm text-muted-foreground">
          {summary}
          {q && (
            <>
              {" for "}
              <span className="font-medium text-foreground">“{q}”</span>
            </>
          )}
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="pl-8 pr-8"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Select value={sort} onValueChange={(value) => patch({ sort: value })}>
          <SelectTrigger className="w-[190px]" aria-label="Sort products">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="hidden items-center gap-1 rounded-md border p-0.5 lg:flex">
          <Button
            variant={layout === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setLayout("grid")}
            aria-label="Grid view"
            aria-pressed={layout === "grid"}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={layout === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setLayout("list")}
            aria-label="List view"
            aria-pressed={layout === "list"}
          >
            <Rows3 className="h-4 w-4" />
          </Button>
        </div>

        <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="px-1.5 tabular-nums">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow down the products you see.</SheetDescription>
            </SheetHeader>
            <div className="px-4 py-5">
              <FilterPanel {...panelProps} />
            </div>
            <SheetFooter className="px-4 pb-6">
              <Button className="w-full" onClick={() => setMobileFilters(false)}>
                Show {data.total} results
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <Card className="sticky top-24">
            <CardContent className="p-4">
              <FilterPanel {...panelProps} />
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0 flex-1">
          {error ? (
            <EmptyState
              title="Could not load products"
              description={error}
              actionLabel="Back to shop"
              actionTo="/product"
            />
          ) : loading ? (
            <div
              className={cn(
                "grid gap-4",
                layout === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              {Array.from({ length: layout === "grid" ? 8 : 5 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products match your filters"
              description="Try another search term, widen the price range or clear the filters."
              actionLabel="Clear filters"
              actionTo="/product"
            />
          ) : (
            <>
              <div
                className={cn(
                  "grid gap-4",
                  layout === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} layout={layout} />
                ))}
              </div>

              <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                <LimitSelect limit={limit} onChange={setLimit} />
                <Pagination
                  page={page}
                  totalPages={data.totalPages ?? 1}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
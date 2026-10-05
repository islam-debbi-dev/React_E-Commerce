import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Product browsing state lives in the URL so filters survive refresh,
 * back/forward navigation and sharing a link.
 */
export default function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const minRating = searchParams.get("minRating") ?? "";
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 12, 1), 48);

  // Instant text state keeps typing smooth, the URL updates debounced.
  const [term, setTerm] = useState(q);

  useEffect(() => {
    setTerm(q);
  }, [q]);

  const patch = useCallback(
    (values, { resetPage = true } = {}) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(values).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          });
          if (resetPage) next.delete("page");
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    if (term === q) return undefined;
    const timer = setTimeout(() => patch({ q: term }), 300);
    return () => clearTimeout(timer);
  }, [term, q, patch]);

  const activeFilterCount = [category, minPrice, maxPrice, minRating].filter(Boolean).length;

  const filters = useMemo(
    () => ({ category, minPrice, maxPrice, minRating }),
    [category, minPrice, maxPrice, minRating]
  );

  const clearFilters = useCallback(() => {
    setTerm("");
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const clearFilter = useCallback(
    (key) => {
      patch({ [key]: "" });
    },
    [patch]
  );

  return {
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
    filters,
    activeFilterCount,
    patch,
    clearFilters,
    clearFilter,
    setPage: (next) => patch({ page: next === 1 ? "" : next }, { resetPage: false }),
    setLimit: (next) => patch({ limit: next === 12 ? "" : next }, { resetPage: false }),
  };
}
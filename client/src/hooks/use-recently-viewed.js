import { useCallback, useEffect, useState } from "react";

import { useStoredIds } from "@/hooks/use-stored-ids";
import { getProducts } from "@/api/products";

const KEY = "recentlyViewed";

/** Ids of recently opened products, newest first, capped at 8. */
export function useRecentlyViewed() {
  const { ids, has, add } = useStoredIds(KEY, 8);
  return { ids, has, record: useCallback((id) => add(id), [add]) };
}

/** Loads the stored ids into full product objects for display. */
export function useRecentlyViewedProducts() {
  const { ids } = useStoredIds(KEY, 8);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ids.length) {
      setProducts([]);
      return undefined;
    }

    let active = true;
    setLoading(true);

    getProducts({ limit: 48 })
      .then((res) => {
        if (!active) return;
        const wanted = ids.slice(0, 8);
        setProducts(
          (res.products ?? [])
            .filter((product) => wanted.includes(product.id))
            .sort((a, b) => wanted.indexOf(a.id) - wanted.indexOf(b.id))
        );
      })
      .catch(() => {
        if (active) setProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ids]);

  return { products, loading };
}
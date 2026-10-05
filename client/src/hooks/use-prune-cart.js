import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { pruneCart } from "@/redux/action";
import { getProducts } from "@/api/products";
import { toast } from "sonner";

/**
 * Drops cart lines whose product disappeared from the shop. The backend
 * rejects unknown product ids, so pruning before checkout keeps the
 * customer from hitting an error after filling the form.
 */
export function usePruneCart(items, enabled = true) {
  const dispatch = useDispatch();
  const checked = useRef(false);

  useEffect(() => {
    const dropUnavailableItems = async () => {
      if (!enabled || !items.length || checked.current) {
        return;
      }
      checked.current = true;
      try {
        const products = await getProducts({ limit: 200 });
        const available = new Set(products.map((product) => product.id));
        const stale = items
          .filter((item) => !available.has(item.id))
          .map((item) => item.id);
        if (stale.length) {
          dispatch(pruneCart(stale));
          toast.error(
            `${stale.length} item${stale.length > 1 ? "s" : ""} removed, no longer in the shop`
          );
        }
      } catch {
        return;
      }
    };

    dropUnavailableItems();
  }, [items, dispatch, enabled]);
}

export default usePruneCart;
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { pruneCart } from "../redux/action";
import { getProducts } from "../api/products";
import toast from "react-hot-toast";

export const usePruneCart = (items) => {
  const dispatch = useDispatch();
  const checked = useRef(false);

  useEffect(() => {
    const dropUnavailableItems = async () => {
      if (!items.length || checked.current) {
        return;
      }
      checked.current = true;
      try {
        const products = await getProducts();
        const available = new Set(products.map((product) => product.id));
        const stale = items.filter((item) => !available.has(item.id)).map((item) => item.id);
        if (stale.length) {
          dispatch(pruneCart(stale));
          toast.error(`${stale.length} item(s) removed, they are not in the shop any more`);
        }
      } catch {
        return;
      }
    };

    dropUnavailableItems();
  }, [items, dispatch]);
};

import { useDispatch, useSelector } from "react-redux";
import { addCart, delCart, removeCartItem, setQty } from "@/redux/action";

const SHIPPING_FLAT = 30;

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.handleCart);

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = items.length ? SHIPPING_FLAT : 0;
  const total = subtotal + shipping;

  return {
    items,
    itemCount,
    subtotal,
    shipping,
    total,
    isEmpty: items.length === 0,
    add: (product, qty = 1) => {
      for (let i = 0; i < qty; i += 1) {
        dispatch(addCart(product));
      }
    },
    decrement: (item) => dispatch(delCart(item)),
    remove: (item) => dispatch(removeCartItem(item)),
    changeQty: (item, qty) => dispatch(setQty({ ...item, qty })),
    isInCart: (id) => items.some((item) => item.id === id),
  };
}

export const currency = (value, fractionDigits = 2) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
// Retrieve initial state from localStorage if available
const getInitialCart = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : [];
};

const persist = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const handleCart = (state = getInitialCart(), action) => {
  const product = action.payload;
  let updatedCart;

  switch (action.type) {
    case "ADDITEM":
      // Check if product already in cart
      const exist = state.find((x) => x.id === product.id);
      if (exist) {
        // Increase the quantity
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        updatedCart = [...state, { ...product, qty: 1 }];
      }
      persist(updatedCart);
      return updatedCart;

    case "DELITEM":
      const exist2 = state.find((x) => x.id === product.id);
      if (!exist2) return state;
      if (exist2.qty === 1) {
        updatedCart = state.filter((x) => x.id !== exist2.id);
      } else {
        updatedCart = state.map((x) =>
          x.id === product.id ? { ...x, qty: x.qty - 1 } : x
        );
      }
      persist(updatedCart);
      return updatedCart;

    case "REMOVEITEM":
      updatedCart = state.filter((x) => x.id !== product.id);
      persist(updatedCart);
      return updatedCart;

    case "SETQTY": {
      const qty = Math.max(Number(product.qty) || 1, 1);
      updatedCart = state.map((x) =>
        x.id === product.id ? { ...x, qty: Math.min(qty, 99) } : x
      );
      persist(updatedCart);
      return updatedCart;
    }

    case "CLEARITEM":
      localStorage.removeItem("cart");
      return [];

    case "PRUNEITEMS":
      const stale = new Set(action.payload);
      updatedCart = state.filter((x) => !stale.has(x.id));
      persist(updatedCart);
      return updatedCart;

    default:
      return state;
  }
};

export default handleCart;
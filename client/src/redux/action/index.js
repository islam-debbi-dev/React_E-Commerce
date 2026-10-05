// For Add Item to Cart
export const addCart = (product) => {
  return {
    type: "ADDITEM",
    payload: product,
  };
};

// For Delete one unit of an Item
export const delCart = (product) => {
  return {
    type: "DELITEM",
    payload: product,
  };
};

// For removing a whole line from the Cart
export const removeCartItem = (product) => {
  return {
    type: "REMOVEITEM",
    payload: product,
  };
};

// For setting an exact quantity from the stepper
export const setQty = (product) => {
  return {
    type: "SETQTY",
    payload: product,
  };
};

// For emptying the cart after an order is placed
export const clearCart = () => {
  return {
    type: "CLEARITEM",
  };
};

// For dropping items that are not in the shop any more
export const pruneCart = (ids) => {
  return {
    type: "PRUNEITEMS",
    payload: ids,
  };
};
// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

// For emptying the cart after an order is placed
export const clearCart = () =>{
    return {
        type:"CLEARITEM"
    }
}

// For dropping items that are not in the shop any more
export const pruneCart = (ids) =>{
    return {
        type:"PRUNEITEMS",
        payload:ids
    }
}
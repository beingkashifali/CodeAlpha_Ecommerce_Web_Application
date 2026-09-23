import { createContext, useContext } from "react";

const CartContext = createContext(null);
const GUEST_CART_KEY = "guestCart";

const readguestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY));
  } catch {
    return [];
  }
};

const writeGuestCart = (items) =>
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));

export const CartProvider = ({ children }) => {
  const addToCart = async (product, quantity = 1) => {};
  return <CartContext.Provider value={{}}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be within CartProvider");
  return ctx;
};

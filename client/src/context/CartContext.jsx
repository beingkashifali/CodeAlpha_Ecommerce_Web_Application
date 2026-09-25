import { createContext, useContext } from "react";

const CartContext = createContext(null);
const GUEST_CART_KEY = "guestCart";

export const CartProvider = ({ children }) => {
  return <CartContext.Provider value={{}}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be within CartProvider");
  return ctx;
};

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const GUEST_CART_KEY = "guestCart";

const readGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
};
const writeGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]); // normalized: [{ product, quantity }]
  const [loading, setLoading] = useState(true);

  const fetchServerCart = useCallback(async () => {
    const { data } = await axiosInstance.get("/cart/");
    setCartItems(data.items || []);
  }, []);

  // On mount / whenever auth state resolves: load server cart if logged in,
  // otherwise fall back to the guest cart kept in localStorage.
  useEffect(() => {
    if (authLoading) return;

    const init = async () => {
      setLoading(true);
      try {
        if (user) {
          const guestItems = readGuestCart();
          if (guestItems.length > 0) {
            const { data } = await axiosInstance.post("/cart/merge", {
              items: guestItems.map((i) => ({
                productId: i.product._id,
                quantity: i.quantity,
              })),
            });
            setCartItems(data.items || []);
            localStorage.removeItem(GUEST_CART_KEY);
            toast.success("Cart synced to your account");
          } else {
            await fetchServerCart();
          }
        } else {
          setCartItems(readGuestCart());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, authLoading, fetchServerCart]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      const { data } = await axiosInstance.post("/cart", {
        productId: product._id,
        quantity,
      });
      setCartItems(data.items || []);
    } else {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.product_id === product._id);
        let next;
        if (existing) {
          next = prev.map((i) =>
            i.product._id === product._id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        } else {
          next = [...prev, { product, quantity }];
        }
        writeGuestCart(next);
        return next;
      });
    }
    toast.success(`${product.name} added to cart`);
  };

  const updateQty = async (productId, quantity) => {
    if (user) {
      const { data } = await axiosInstance.put(`/cart/${productId}`, {
        quantity,
      });
      setCartItems(data.items || []);
    } else {
      setCartItems((prev) => {
        const next =
          quantity <= 0
            ? prev.filter((i) => i.product._id !== productId)
            : prev.map((i) =>
                i.product._id === productId ? { ...i, quantity } : i,
              );
        writeGuestCart(next);
        return next;
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      const { data } = await axiosInstance.delete(`/cart/${productId}`);
      setCartItems(data.items || []);
    } else {
      setCartItems((prev) => {
        const next = prev.filter((i) => i.product._id !== productId);
        writeGuestCart(next);
        return next;
      });
    }
    toast.success("Removed from cart");
  };

  const clearCartLocal = () => {
    setCartItems([]);
    writeGuestCart([]);
  };

  const cartTotal = cartItems.reduce((sum, i) => {
    const price = i.product.discountPrice ?? i.product.price;
    return sum + price * i.quantity;
  }, 0);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCartLocal,
        cartTotal,
        cartCount,
        refetch: fetchServerCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export { CartProvider, useCart };

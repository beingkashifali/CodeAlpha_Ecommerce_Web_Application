import createContext, {
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
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || []);
  } catch {
    return [];
  }
};
const writeGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const CartProvider = async ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]); // normalized: [{ product, quantity }]
  const [loading, setLoading] = useState(true);

  const fetchServerCart = useCallback(async () => {
    const { data } = axiosInstance.get("/cart");
    setCartItems(data.items || []);
  });

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
                productId: i.product_id,
                quantity: i.quantity,
              })),
            });
            setCartItems(data.items || []);
            localStorage.removeItem(GUEST_CART_KEY);
            toast.success("Cart synced to your accoutn");
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
};

// eslint-disable-next-line react-refresh/only-export-components
export { CartProvider, useCart };

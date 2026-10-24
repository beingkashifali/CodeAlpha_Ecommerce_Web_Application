import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPKR } from "../components/product/ProductCard";

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, cartTotal, loading } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
    } else {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-brand-300" />
        <h1 className="font-heading text-xl font-semibold text-brand-900">
          Your cart is empty
        </h1>
        <p className="text-brand-500">
          Looks like you haven't added anything yet.
        </p>
        <Link to="/" className="btn-primary">
          Start shopping
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <div></div>;
  }
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="space-y-4 md:col-span-2">
        {cartItems.map(({ product, quantity }) => {
          const price = product.discountPrice ?? product.price;
          return (
            <div key={product._id} className="card flex gap-4 p-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-brand-50">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/products/${product.slug}`}
                    className="text-sm font-medium text-brand-900 hover:underline"
                  >
                    {product.name}
                  </Link>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="text-brand-400 hover:text-maroon-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-brand-200">
                    <button
                      onClick={() => updateQty(product._id, quantity - 1)}
                      className="px-2.5 py-1 text-brand-700 hover:bg-brand-50 cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() =>
                        updateQty(
                          product._id,
                          Math.min(product.stock, quantity + 1),
                        )
                      }
                      className="px-2.5 py-1 text-brand-700 hover:bg-brand-50 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-brand-900">
                    {formatPKR(price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="card h-fit p-5 mt-2.5">
        <h2 className="mb-4 font-heading text-lg font-semibold text-brand-900">
          Order Summary
        </h2>
        <div className="flex justify-between text-sm text-brand-600">
          <span>Subtotal</span>
          <span>{formatPKR(cartTotal)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-brand-600">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-brand-100 pt-4 font-semibold text-brand-900">
          <span>Total</span>
          <span>{formatPKR(cartTotal)}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="btn-primary mt-5 w-full py-3 cursor-pointer"
        >
          Proceed to Checkout <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Cart;

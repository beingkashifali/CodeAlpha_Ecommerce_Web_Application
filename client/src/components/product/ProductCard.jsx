import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

const formatPKR = (n) => `Rs ${Number(n).toLocaleString("en-PK")}`;

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const hasDiscount =
    product.dicsountPrice && product.dicsountPrice < product.price;
  const outOfStock = product.stock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) addToCart(product, 1);
  };
  return (
    <Link
      to={`/products/${product.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-brand-50">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-300 ">
            No image
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded bg-sale px-2 py-0.5 text-xs font-semibold text-white">
            SALE
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-brand-700">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium text-brand-900 ">
          {product.name}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-1 ">
          {hasDiscount ? (
            <>
              <span className="font-semibold text-brand-900">
                {formatPKR(product.dicsountPrice)}
              </span>
              <span className="text-xs text-brand-400 line-through">
                {formatPKR(product.price)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-brand-900">
              {formatPKR(product.price)}
            </span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="btn-primary mt-2 w-full py-2 text-xs disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
// eslint-disable-next-line react-refresh/only-export-components
export { formatPKR };

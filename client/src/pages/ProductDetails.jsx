import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ChevronRight } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import ProductGallery from "../components/product/ProductGallery";
import ProductCard, { formatPKR } from "../components/product/ProductCard";

const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [data, setData] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    axiosInstance
      .get(`/products/${slug}`)
      .then(({ data }) => {
        (setData(data), setQty(1));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="py-24 text-center text-brand-500">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="py-24 text-center text-brand-500">Product not found.</div>
    );
  }

  const { product, related } = data;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center gap-1 text-xs text-brand-500">
        <Link to="/" className="hover:text-brand-700">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to={`/?category=${product.category.slug}`}
          className="hover:text-brand-700"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-brand-700">{product.name}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} />
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-900">
            {product.name}
          </h1>
          {product.brand && (
            <p className="mt-1 text-sm text-brand-500">{product.brand}</p>
          )}
          <div className="mt-4 flex items-baseline gap-3">
            {hasDiscount ? (
              <>
                <span className="font-heading text-2xl font-semibold text-brand-900">
                  {formatPKR(product.discountPrice)}
                </span>
                <span className="text-base text-brand-400 line-through">
                  {formatPKR(product.price)}
                </span>
                <span className="rounded bg-sale px-2 py-0.5 text-xs font-semibold text-white">
                  {Math.round(
                    (1 - product.discountPrice / product.price) * 100,
                  )}
                  % OFF
                </span>
              </>
            ) : (
              <span className="font-heading text-2xl font-semibold text-brand-900">
                {formatPKR(product.price)}
              </span>
            )}
          </div>
          <p
            className={`mt-2 text-sm ${outOfStock ? "text-maroon-600" : "text-brand-500"}`}
          >
            {outOfStock ? "Out of stock" : `${product.stock} in stock`}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-brand-700">
            {product.description}
          </p>
          {!outOfStock && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-brand-200">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-brand-700 hover:bg-brand-50"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-brand-700 hover:bg-brand-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Sticky add-to-cart panel on mobile scroll */}
          <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-brand-100 bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <button
              onClick={() => addToCart(product, qty)}
              disabled={outOfStock}
              className="btn-primary w-full py-3 sm:w-auto sm:px-8"
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {related?.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 font-heading text-xl font-semibold text-brand-900">
            Related Products
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;

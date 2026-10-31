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

  return <div></div>;
};

export default ProductDetails;

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

  return <div></div>;
};

export default ProductDetails;

import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Shirt,
  Footprints,
  Smartphone,
  Home as HomeIcon,
  ShoppingBag,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/product/ProductCard";

const categoryIcons = {
  shirt: Shirt,
  dress: ShoppingBag,
  footprints: Footprints,
  smartphone: Smartphone,
  home: HomeIcon,
};

const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="aspect-4/5 w-full animate-pulse bg-brand-100" />
    <div className="space-y-2 p-3">
      <div className="h-3 w-3/4 animate-pulse rounded bg-brand-100" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-brand-100" />
    </div>
  </div>
);

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    axiosInstance
      .get("/products/categories/all")
      .then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (!category && !search) {
      axiosInstance
        .get("/products", { params: { featured: true, limit: 8 } })
        .then(({ data }) => setFeatured(data.products));
    }
  }, [category, search]);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/products", { params: { category, search, page } })
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [category, search, page]);

  return <div></div>;
};

export default Home;

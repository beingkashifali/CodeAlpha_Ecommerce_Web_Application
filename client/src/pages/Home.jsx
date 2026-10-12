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

  return <div></div>;
};

export default Home;

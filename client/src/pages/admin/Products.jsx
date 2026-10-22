import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { formatPKR } from "../../components/product/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    axiosInstance
      .get("/admin/products")
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    try {
      await axiosInstance.delete(`/admin/products/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };
  return <div></div>;
};

export default Products;

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
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to load products");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/admin/products/${id}`);

      toast.success("Product deleted");

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-brand-900">
          Products
        </h1>

        <Link to="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-160 text-left text-sm">
          <thead className="border-b border-brand-100 text-xs uppercase text-brand-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-100">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-brand-500"
                >
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-brand-500"
                >
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-brand-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-brand-50">
                        {p.images?.[0] && (
                          <img
                            className="h-full w-full object-cover"
                            src={p.images[0]}
                            alt={p.name || "Product image"}
                          />
                        )}
                      </div>

                      <span className="line-clamp-1 font-medium text-brand-900">
                        {p.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-brand-600">
                    {p.category?.name || "—"}
                  </td>

                  <td className="px-4 py-3 text-brand-900">
                    {formatPKR(p.discountPrice ?? p.price)}
                  </td>

                  <td
                    className={`px-4 py-3 ${
                      p.stock <= 5 ? "font-medium text-sale" : "text-brand-600"
                    }`}
                  >
                    {p.stock}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="rounded p-1.5 text-brand-600 hover:bg-brand-100"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(p._id, p.name)}
                        className="rounded p-1.5 text-maroon-600 hover:bg-rose-50"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;

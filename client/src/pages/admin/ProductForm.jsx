import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    brand: "",
    isFeatured: false,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/products/categories/all")
      .then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/admin/products/${id}`);

        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          price: data.price ?? "",
          discountPrice: data.discountPrice ?? "",
          stock: data.stock ?? "",
          category: data.category?._id || data.category || "",
          brand: data.brand ?? "",
          isFeatured: Boolean(data.isFeatured),
        });

        setExistingImages(data.images || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      newFiles.forEach((file) => fd.append("images", file));

      if (isEdit) {
        await axiosInstance.put(`/admin/products/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated");
      } else {
        await axiosInstance.post("/admin/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-brand-500">Loading...</p>;
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-brand-900">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>
      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-6">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            required
            className="input"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            rows={4}
            required
            className="input"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Price (Rs)</label>
            <input
              type="number"
              min="0"
              required
              className="input"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Discount price (optional)</label>
            <input
              type="number"
              min="0"
              className="input"
              name="discountPrice"
              value={form.discountPrice}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Stock</label>
            <input
              type="number"
              required
              min="0"
              name="stock"
              value={form.stock}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Brand</label>
            <input
              type="text"
              required
              name="brand"
              value={form.brand}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="label">Category</label>
          <select
            required
            className="input"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-brand-700">
          <input
            type="checkbox"
            name="isFeatured"
            checked={form.isFeatured}
            onChange={handleChange}
            className="accent-brand-700"
          />
          Featured on homepage
        </label>

        <div>
          <label className="label">Images</label>
          {existingImages.length > 0 && (
            <div className="mb-2 flex gap-2">
              {existingImages.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt="Product Image"
                  className="h-16 w-16 rounded object-cover"
                />
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
            className="text-sm text-brand-600"
          />
          <p className="mt-1 text-xs text-brand-400">
            Uploaded to Cloudinary. Max 6 images, 5MB each.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="btn-secondary flex-1 py-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex-1 py-3"
          >
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

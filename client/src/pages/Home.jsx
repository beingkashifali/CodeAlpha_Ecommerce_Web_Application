import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Shirt,
  Footprints,
  Smartphone,
  Home as HomeIcon,
  ShoppingBag,
  TruckElectric,
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
    axiosInstance.get("/products/categories/all").then(({ data }) => {
      setCategories(data.categories);
    });
  }, []);

  useEffect(() => {
    if (!category && !search) {
      axiosInstance
        .get("/products", { featured: TruckElectric, limit: 8 })
        .then(({ data }) => setFeatured(data));
    }
  }, [category, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    axiosInstance
      .get("/products", { params: { category, search, page } })
      .then(({ data }) => {
        (setProducts(data.products), setPages(data.pages));
      })
      .finally(() => setLoading(false));
  }, [category, search, page]);

  const activeCategory = categories.find((c) => c.slug === category);
  const heading = search
    ? `Search results for "${search}"`
    : activeCategory
      ? activeCategory.name
      : "New Arrivals";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {!category && !search && (
        <>
          <section className="mb-10 overflow-hidden rounded-2xl bg-brand-700">
            <div className="grid gap-6 px-6 py-10 sm:px-10 sm:py-14 md:grid-cols-2 md:items-center">
              <div>
                <span className="inline-block rounded-full bg-sale/90 px-3 py-1 text-xs font-semibold text-white">
                  {" "}
                  Season Sale — up to 30% off
                </span>
                <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Everyday essentials, delivered across Pakistan
                </h1>
                <p className="mt-3 max-w-md text-brand-100">
                  Fashion, electronics, and home goods with Cash on Delivery,
                  JazzCash, and card payment — all in one place.
                </p>
                <Link
                  to={"/?category="}
                  className="btn-secondary mt-6 border-white text-white hover:bg-white/10"
                >
                  Shop the sale
                </Link>
              </div>
              <div className="hidden justify-self-end rounded-xl bg-brand-800/60 p-8 text-center text-brand-100 md:block">
                <p className="font-heading text-5xl font-bold text-white">
                  30%
                </p>
                <p className="mt-1 text-sm">
                  off select lawn &amp; formal wear
                </p>
              </div>
            </div>
          </section>
          <section className="mb-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {" "}
              {categories.map((c) => {
                const Icon = categoryIcons[c.icon] || ShoppingBag;
                return (
                  <Link
                    key={c._id}
                    to={`/?category=${c.slug}`}
                    className="card flex flex-col items-center gap-2 px-3 py-5 text-center transition-shadow hover:shadow-lg"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-brand-800">
                      {c.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {featured.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 font-heading text-xl font-semibold text-brand-900">
                Featured Products
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {featured.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-brand-900">
          {heading}
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ShoppingBag className="h-10 w-10 text-brand-300" />
            <p className="text-brand-500">
              No products found. Try a different search or category
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            {pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-md text-sm font-medium ${page === i + 1 ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-700"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;

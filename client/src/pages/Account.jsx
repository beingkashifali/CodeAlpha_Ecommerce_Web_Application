import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/admin/StatusBadge";
import { formatPKR } from "../components/product/ProductCard";

const Account = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/orders/myorders")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 font-heading text-2xl font-semibold text-brand-900">
        My Account
      </h1>
      <p className="mb-6 text-sm text-brand-500">
        {user?.name} · {user?.email}
      </p>

      <h2 className="mb-3 font-heading text-lg font-semibold text-brand-900">
        Order History
      </h2>

      {loading ? (
        <p className="text-brand-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <Package className="h-10 w-10 text-brand-300" />
          <p className="text-brand-500">You haven't placed any orders yet.</p>
          <Link to="/" className="btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {" "}
          {orders.map((order) => (
            <div
              key={order._id}
              className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-brand-900">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-brand-500">
                  {new Date(order.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {" · "}
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-brand-900">
                  {formatPKR(order.totalPrice)}
                </span>
                <StatusBadge status={order.orderStatus} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Account;

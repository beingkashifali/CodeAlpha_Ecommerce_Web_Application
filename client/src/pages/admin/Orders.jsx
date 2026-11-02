import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import StatusBadge from "../../components/admin/StatusBadge";
import { formatPKR } from "../../components/product/ProductCard";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    axiosInstance
      .get("/admin/orders")
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.orderStatus === statusFilter);
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-brand-900">
          Orders
        </h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-auto cursor-pointer"
        >
          <option value="all">All statuses</option>
          {["pending", "processing", "shipped", "delivered", "cancelled"].map(
            (s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="border-b border-brand-100 text-xs uppercase text-brand-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-center text-brand-500">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-brand-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o._id} className="cursor-pointer hover:bg-brand-50/50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/orders/${o._id}`}
                      className="font-medium text-brand-700 hover:underline"
                    >
                      #{o._id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-700">
                    {o.user?.name || "Guest"}
                  </td>
                  <td className="px-4 py-3 text-brand-900">
                    {formatPKR(o.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-brand-600">{o.paymentMethod}</span>{" "}
                    <StatusBadge status={o.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.orderStatus} />
                  </td>
                  <td className="px-4 py-3 text-brand-500">
                    {new Date(o.createdAt).toLocaleDateString("en-PK")}
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

export default Orders;

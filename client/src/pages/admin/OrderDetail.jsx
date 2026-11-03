import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import StatusBadge from "../../components/admin/StatusBadge";
import { formatPKR } from "../../components/product/ProductCard";

const orderStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    axiosInstance
      .get(`/admin/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleStatusChange = async (orderStatus) => {
    setUpdating(true);
    try {
      const { data } = await axiosInstance.put(`/admin/orders/${id}/status`, {
        orderStatus,
      });
      setOrder(data);
      toast.success("Order status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-brand-500">Loading...</p>;
  if (!order) return <p className="text-brand-500">Order not found.</p>;

  return (
    <div>
      <Link
        to="/admin/orders"
        className="mb-4 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-brand-900">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-500">Status:</span>
          <select
            value={order.orderStatus}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="input w-auto"
          >
            {orderStatuses.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-5 md:col-span-2">
          <h2 className="mb-3 font-heading text-base font-semibold text-brand-900">
            Items
          </h2>
          <div className="divide-y divide-brand-100">
            {order.items.map((item) => (
              <div key={item.product} className="flex items-center gap-3 py-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-brand-50">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-brand-500">
                    Qty {item.quantity} × {formatPKR(item.price)}
                  </p>
                </div>
                <span className="font-medium text-brand-900">
                  {formatPKR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-brand-100 pt-3 font-semibold text-brand-900">
            <span>Total</span>
            <span>{formatPKR(order.totalPrice)}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="mb-2 font-heading text-base font-semibold text-brand-900">
              Customer
            </h2>
            <p className="text-sm text-brand-700">{order.user?.name}</p>
            <p className="text-sm text-brand-500">{order.user?.email}</p>
            <p className="text-sm text-brand-500">{order.user?.phone}</p>
          </div>

          <div className="card p-5">
            <h2 className="mb-2 font-heading text-base font-semibold text-brand-900">
              Shipping Address
            </h2>
            <p className="text-sm text-brand-700">
              {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.province}
            </p>
            <p className="text-sm text-brand-500">
              {order.shippingAddress.phone}
            </p>
          </div>

          <div className="card p-5">
            <h2 className="mb-2 font-heading text-base font-semibold text-brand-900">
              Payment
            </h2>
            <p className="text-sm text-brand-700">{order.paymentMethod}</p>
            <div className="mt-1">
              <StatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

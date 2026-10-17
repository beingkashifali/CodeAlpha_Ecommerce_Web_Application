import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import StatCard from "../../components/admin/StatsCard";
import { formatPKR } from "../../components/product/ProductCard";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance.get("/admin/stats").then(({ data }) => setStats(data));
  }, []);

  if (!stats) {
    return <p className="text-brand-500">Loading dashboard...</p>;
  }

  const chartData = stats.last7Days.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-PK", { weekday: "short" }),
  }));

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-brand-900">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard
          label="Total Revenue"
          value={formatPKR(stats.totalRevenue)}
          icon={DollarSign}
          tone="brand"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          tone="brand"
        />
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          tone="brand"
        />
        <StatCard
          label="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          tone="brand"
        />
        <StatCard
          label="Low Stock Items"
          value={stats.lowStockProducts.length}
          icon={AlertTriangle}
          tone="sale"
        />
        <StatCard
          label="Pending Orders"
          value={stats.ordersByStatus.pending || 0}
          icon={ShoppingBag}
          tone="maroon"
        />
      </div>

      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-heading text-base font-semibold text-brand-900">
          Orders — Last 7 Days
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6efe9" />
              <XAxis dataKey="label" stroke="#5c9d7c" fontSize={12} />
              <YAxis stroke="#5c9d7c" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "#dcece2",
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  value,
                  name === "orders" ? "Orders" : "Revenue",
                ]}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#1f4d38"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="card mt-6 p-5">
          <h2 className="mb-3 font-heading text-base font-semibold text-brand-900 ">
            Low Stock Products
          </h2>
          <ul className="divide-y divide-brand-100 text-sm">
            {stats.lowStockProducts.map((p) => (
              <li key={p._id} className="flex justify-between py-2">
                <span className="text-brand-700">{p.name}</span>
                <span className="font-medium text-sale">{p.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

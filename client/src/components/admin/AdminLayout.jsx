import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Users", icon: Users },
];
const AdminLayout = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 md:flex-row">
      <aside className="shrink-0 md:w-56">
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-brand-700 text-white" : "text-brand-700 hover:bg-brand-50"}`
              }
            >
              <Icon className="h-4 w-4" /> {label}
            </NavLink>
          ))}
          <NavLink
            to="/"
            className="mt-2 flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-brand-500 hover:bg-brand-50 md:mt-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to store
          </NavLink>
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

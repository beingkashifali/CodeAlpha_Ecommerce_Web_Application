import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      search.trim() ? `/?search${encodeURIComponent(search.trim())}` : "/",
    );
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3 sm:px-6">
        <Link
          to="/"
          className="shrink-0 font-heading text-xl font-900 text-brand-700"
        >
          Bazaario
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden flex-1 items-center md:flex"
        >
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="input pl-9"
            />
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-5 md:flex">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900"
            >
              <LayoutDashboard className="h-4 w-4" /> Admin
            </Link>
          )}
          <Link
            to="/cart"
            className="relative flex items-center text-brand-700 hover:text-brand-900"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-sale text-[10px] font-semibold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/account"
                className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900"
              >
                <User className="h-4 w-4" /> {user.name?.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-brand-500 hover:text-maroon-600"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2">
              Sign in
            </Link>
          )}
        </nav>
        <button
          className="ml-auto md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-brand-100 px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products..."
                className="input pl-9"
              />
            </div>
          </form>
          <div className="flex flex-col gap-3 text-sm font-medium text-brand-700">
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" /> Cart{" "}
              {cartCount > 0 && `(${cartCount})`}
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" /> Admin dashboard
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> My account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-maroon-600"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-primary w-fit"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

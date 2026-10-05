import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      const from =
        location.state?.from?.pathname ||
        (user.role === "admin" ? "/admin" : "/");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="mb-1 font-heading text-2xl font-semibold text-brand-900">
        Sign in
      </h1>
      <p className="mb-6 text-sm text-brand-500">Welcome back to Bazaario.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            required
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email..."
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            required
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? "Signing in...." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-brand-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-brand-700 hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
};

export default Login;

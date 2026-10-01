import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(
        form.name,
        form.email,
        form.password,
        form.phone,
      );
      toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="mb-1 font-heading text-2xl font-semibold text-brand-900">
        Create an account
      </h1>
      <p className="mb-6 text-sm text-brand-500">
        Join Bazaario for faster checkout.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label">Full Name</label>
          <input
            required
            type="text"
            className="input"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            required
            type="email"
            className="input"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
          />
        </div>
        <div>
          <label className="label">Phone</label>
          <input
            required
            type="number"
            className="input"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your Phone Number"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="input"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-brand-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium pl-1 text-brand-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;

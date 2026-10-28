import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check, Truck, CreditCard, Smartphone } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { formatPKR } from "../components/product/ProductCard";

const steps = ["Cart", "Shipping", "Payment", "Confirm"];

const paymentOptions = [
  {
    value: "COD",
    label: "Cash on Delivery",
    icon: Truck,
    desc: "Pay when your order arrives",
  },
  {
    value: "JazzCash",
    label: "JazzCash",
    icon: Smartphone,
    desc: "Pay via JazzCash mobile wallet",
  },
  {
    value: "Card",
    label: "Debit / Credit Card",
    icon: CreditCard,
    desc: "Visa, Mastercard",
  },
];

const Checkout = () => {
  const { cartItems, cartTotal, clearCartLocal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=Shipping, 2=Payment, 3=Confirm
  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    province: user?.address?.province || "",
    phone: user?.phone || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);

  const validateAddress = () =>
    address.street.trim() &&
    address.city.trim() &&
    address.province.trim() &&
    address.phone.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const items = cartItems.map((i) => ({
        productId: i.product._id,
        quantity: i.quantity,
      }));
      const { data } = await axiosInstance.post("/orders", {
        items,
        shippingAddress: address,
        paymentMethod,
      });
      clearCartLocal();
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not place order");
    } finally {
      setSubmitting(true);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-24 text-center text-brand-500">
        Your cart is empty.
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl  px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center">
        {steps.map((label, i) => {
          const idx = i; // 0=Cart(done), 1=Shipping, 2=Payment, 3=Confirm
          const isDone = idx < step || idx === 0;
          const isActive = idx === step;
          return (
            <div
              key={label}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isDone
                      ? "bg-brand-700 text-white"
                      : isActive
                        ? "border-2 border-brand-700 text-brand-700"
                        : "border-2 border-brand-200 text-brand-300"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4 " /> : idx + 1}
                </div>
                <span
                  className={`mt-1 text-xs ${isActive ? "font-medium text-brand-900" : "text-brand-400"}`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 ${idx < step ? "bg-brand-700" : "bg-brand-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="card p-6">
          <h2 className="mb-4 font-heading text-lg font-medium text-brand-900">
            Shipping Address
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Street Address</label>
              <input
                type="text"
                className="input"
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="House 12, Street 4, Model Town"
              />
            </div>
            <div>
              <label className="label">City</label>
              <input
                className="input"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="Lahore"
              />
            </div>
            <div>
              <label className="label">Province</label>
              <input
                className="input"
                name="province"
                value={address.province}
                onChange={handleChange}
                placeholder="Punjab"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Phone number</label>
              <input
                className="input"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="03001234567"
              />
            </div>
          </div>
          <button
            onClick={() =>
              validateAddress()
                ? setStep(2)
                : toast.error("Please fill in all shipping fields")
            }
            className="btn-primary mt-6 w-full py-3"
          >
            Continue to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

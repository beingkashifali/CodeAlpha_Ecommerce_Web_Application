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
  return <div></div>;
};

export default Checkout;

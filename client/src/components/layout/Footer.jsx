import { Link } from "react-router-dom";
import { Truck, RotateCcw, ShieldCheck, Smartphone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-brand-100 bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="grid grid-cols-2 gap-4 text-sm md:col-span-4 md:grid-cols-4 md:border-b md:border-brand-800 md:pb-8">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 shrink-0 text-brand-300" /> Cash on
            Delivery
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 shrink-0 text-brand-300" /> Easy 7-day
            returns
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0 text-brand-300" /> Secure
            checkout
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 shrink-0 text-brand-300" /> JazzCash
            &amp; Cards
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-heading text-base font-semibold text-white">
            Bazaario
          </h3>
          <p className="text-sm text-brand-200">
            Everyday fashion, electronics, and home essentials — delivered
            across Pakistan.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Shop</h4>
          <ul className="space-y-2 text-sm text-brand-200">
            <li>
              <Link to="/?category=mens-clothing" className="hover:text-white">
                Men's Clothing
              </Link>
            </li>
            <li>
              <Link
                to="/?category=womens-clothing"
                className="hover:text-white"
              >
                Women's Clothing
              </Link>
            </li>
            <li>
              <Link to="/?category=electronics" className="hover:text-white">
                Electronics
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Help</h4>
          <ul className="space-y-2 text-sm text-brand-200">
            <li>
              <Link to="/account" className="hover:text-white">
                Track my order
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white">
                My cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-800 px-4 py-4 text-center text-xs text-brand-300 sm:px-6">
        © {new Date().getFullYear()} Bazaario. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

import Link from "next/link";
import {
  FaTruck, FaUndo, FaShieldAlt, FaHeadset, FaPhoneAlt, FaRegEnvelope, FaMapMarkerAlt,
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaRegCreditCard,
} from "react-icons/fa";
import Logo from "./Logo";

const perks = [
  { icon: <FaTruck />, title: "Free Shipping", text: "On orders over 500 EGP" },
  { icon: <FaUndo />, title: "Easy Returns", text: "14-day return policy" },
  { icon: <FaShieldAlt />, title: "Secure Payment", text: "100% secure checkout" },
  { icon: <FaHeadset />, title: "24/7 Support", text: "Contact us anytime" },
];

const col = "flex flex-col gap-3 text-sm text-gray-400";
const heading = "mb-1 text-lg font-bold text-white";

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="bg-brand-50">
        <div className="container-x grid grid-cols-2 gap-6 py-6 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-lg text-brand-600">{p.icon}</span>
              <div>
                <h4 className="text-sm font-bold">{p.title}</h4>
                <p className="text-xs text-gray-500">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#101828]">
        <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="inline-block rounded-lg bg-white px-4 py-2"><Logo size="text-xl" /></div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              YAZ CART is your one-stop destination for quality products. From fashion to electronics, we bring you the
              best brands at competitive prices with a seamless shopping experience.
            </p>
            <div className="mt-5 space-y-3 text-sm text-gray-400">
              <p className="flex items-center gap-3"><FaPhoneAlt className="text-brand-500" /> +20 100 123 4567</p>
              <p className="flex items-center gap-3"><FaRegEnvelope className="text-brand-500" /> support@yazcart.com</p>
              <p className="flex items-center gap-3"><FaMapMarkerAlt className="text-brand-500" /> 123 Commerce Street, Cairo, Egypt</p>
            </div>
            <div className="mt-6 flex gap-3 text-gray-400">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                <span key={i} className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 hover:bg-brand-600 hover:text-white"><Icon /></span>
              ))}
            </div>
          </div>

          <div className={col}>
            <h3 className={heading}>Shop</h3>
            <Link href="/products">All Products</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/brands">Brands</Link>
            <Link href="/deals">Deals</Link>
          </div>
          <div className={col}>
            <h3 className={heading}>Account</h3>
            <Link href="/profile">My Account</Link>
            <Link href="/orders">Order History</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/cart">Shopping Cart</Link>
            <Link href="/login">Sign In</Link>
            <Link href="/register">Create Account</Link>
          </div>
          <div className={col}>
            <h3 className={heading}>Support</h3>
            <Link href="/contact">Contact Us</Link>
            <Link href="/help">Help Center</Link>
            <Link href="/about">About Us</Link>
            <Link href="/orders">Track Order</Link>
          </div>
          <div className={col}>
            <h3 className={heading}>Legal</h3>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <div className="container-x flex flex-wrap items-center justify-between gap-3 py-5 text-sm text-gray-500">
            <p>&copy; 2026 YAZ CART. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><FaRegCreditCard /> Visa</span>
              <span className="flex items-center gap-2"><FaRegCreditCard /> Mastercard</span>
              <span className="flex items-center gap-2"><FaRegCreditCard /> PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

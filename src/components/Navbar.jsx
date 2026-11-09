"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaTruck, FaGift, FaPhoneAlt, FaRegEnvelope, FaRegUser, FaUserPlus, FaSearch,
  FaChevronDown, FaHeadset, FaRegHeart, FaShoppingCart, FaBars, FaRegUserCircle, FaSignOutAlt,
} from "react-icons/fa";
import { useApp } from "@/context/AppContext";
import { useFetch } from "@/lib/useFetch";
import Logo from "./Logo";

export default function Navbar() {
  const { token, user, logout, cart, wishlist } = useApp();
  const router = useRouter();
  const categories = useFetch("categories");

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    router.push("/products?keyword=" + encodeURIComponent(search));
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const cartCount = cart ? cart.count : 0;
  const badge = "absolute -right-2.5 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs text-white";

  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="hidden border-b border-gray-100 text-sm text-gray-500 lg:block">
        <div className="container-x flex h-10 items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <FaTruck className="text-xs text-brand-600" /> Free Shipping on Orders 500 EGP
            </span>
            <span className="flex items-center gap-2">
              <FaGift className="text-xs text-brand-600" /> New Arrivals Daily
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><FaPhoneAlt className="text-xs" /> +20 100 123 4567</span>
            <span className="flex items-center gap-2"><FaRegEnvelope className="text-xs" /> support@yazcart.com</span>
            <span className="h-4 w-px bg-gray-200"></span>
            {token ? (
              <>
                <Link href="/profile" className="flex items-center gap-1.5 hover:text-brand-600"><FaRegUser className="text-xs" /> {user ? user.name : ""}</Link>
                <button onClick={handleLogout} className="flex items-center gap-1.5 hover:text-brand-600"><FaSignOutAlt className="text-xs" /> Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-1.5 hover:text-brand-600"><FaRegUser className="text-xs" /> Sign In</Link>
                <Link href="/register" className="flex items-center gap-1.5 hover:text-brand-600"><FaUserPlus className="text-xs" /> Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-100 shadow-sm">
        <div className="container-x flex h-[72px] items-center gap-8">
          <Logo />

          <form onSubmit={handleSearch} className="relative hidden min-w-0 max-w-[400px] flex-1 md:block">
            <input
              className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pl-5 pr-14 text-sm placeholder:text-gray-400 outline-none focus:border-brand-600"
              placeholder="Search for products, brands and more..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700">
              <FaSearch className="text-sm" />
            </button>
          </form>

          <nav className="hidden shrink-0 items-center gap-7 whitespace-nowrap font-medium text-gray-800 lg:flex">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <Link href="/products" className="hover:text-brand-600">Shop</Link>

            <div className="group relative">
              <button className="flex items-center gap-1.5 hover:text-brand-600">
                Categories <FaChevronDown className="text-[10px]" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-52 rounded-lg border bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                <Link href="/categories" className="block px-4 py-2 text-sm hover:bg-brand-50 hover:text-brand-600">All Categories</Link>
                {categories.data &&
                  categories.data.data.slice(0, 4).map((c) => (
                    <Link key={c._id} href={"/categories/" + c._id} className="block px-4 py-2 text-sm hover:bg-brand-50 hover:text-brand-600">
                      {c.name}
                    </Link>
                  ))}
              </div>
            </div>

            <Link href="/brands" className="hover:text-brand-600">Brands</Link>
          </nav>

          <div className="ml-auto flex items-center gap-5">
            <Link href="/help" className="hidden shrink-0 items-center gap-2 whitespace-nowrap xl:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600"><FaHeadset /></span>
              <span className="text-xs leading-tight text-gray-500">Support<br /><b className="text-sm text-gray-800">24/7 Help</b></span>
            </Link>
            <span className="hidden h-8 w-px bg-gray-200 xl:block"></span>

            <Link href="/wishlist" className="relative text-xl text-gray-600 hover:text-brand-600" title="Wishlist">
              <FaRegHeart />
              {token && wishlist.length > 0 && <span className={badge + " bg-red-500"}>{wishlist.length}</span>}
            </Link>
            <Link href="/cart" className="relative text-xl text-gray-600 hover:text-brand-600" title="Cart">
              <FaShoppingCart />
              {token && cartCount > 0 && <span className={badge + " bg-brand-600"}>{cartCount}</span>}
            </Link>

            {token ? (
              <Link href="/profile" className="hidden text-2xl text-gray-600 hover:text-brand-600 lg:block" title="My Account">
                <FaRegUserCircle />
              </Link>
            ) : (
              <Link href="/login" className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 lg:flex">
                <FaRegUser className="text-xs" /> Sign In
              </Link>
            )}

            <button className="text-xl lg:hidden" onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-b bg-white p-4 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="flex flex-col gap-3 font-medium">
            <Link href="/">Home</Link>
            <Link href="/products">Shop</Link>
            <Link href="/categories">Categories</Link>
            <Link href="/brands">Brands</Link>
            {token ? (
              <>
                <Link href="/profile">My Account</Link>
                <Link href="/orders">Order History</Link>
                <button className="text-left text-red-600" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login">Sign In</Link>
                <Link href="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

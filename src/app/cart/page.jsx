"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaShoppingCart, FaShoppingBag, FaTrash, FaTag, FaLock, FaArrowLeft, FaTruck, FaShieldAlt, FaCheck, FaMinus, FaPlus,
} from "react-icons/fa";
import { useApp } from "@/context/AppContext";
import { useRequireAuth, Loader } from "@/components/ui";
import PageTop from "@/components/PageTop";

export default function Cart() {
  const isLoggedIn = useRequireAuth();
  const { cart, updateCount, removeFromCart, clearCart, applyCoupon } = useApp();
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState("");

  if (!isLoggedIn || !cart) return <Loader />;

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <span className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gray-100 text-5xl text-gray-400">
          <FaShoppingBag />
        </span>
        <h1 className="mt-10 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-4 text-gray-600">Looks like you haven&apos;t added anything to your cart yet. Start exploring our products!</p>
        <Link href="/products" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-8 py-3.5 font-semibold text-white shadow-lg hover:bg-brand-700">
          Start Shopping &rarr;
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageTop
        crumbs={[{ label: "Shopping Cart" }]}
        icon={<FaShoppingCart />}
        title="Shopping Cart"
        subtitle={<>You have <b className="text-brand-600">{cart.count} {cart.count === 1 ? "item" : "items"}</b> in your cart</>}
      />

      <div className="grid gap-6 pb-10 lg:grid-cols-[1fr_393px]">
        <div>
          <div className="space-y-5">
            {cart.items.map((item) => (
              <div key={item._id} className="flex flex-wrap gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="relative">
                  <Link href={"/products/" + item.product._id} className="block h-32 w-32 rounded-xl border border-gray-100 bg-gray-50 p-2">
                    <img src={item.product.imageCover} alt={item.product.title} className="h-full w-full object-contain" />
                  </Link>
                  <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <FaCheck /> In Stock
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={"/products/" + item.product._id} className="text-lg font-bold hover:text-brand-600">{item.product.title}</Link>
                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-brand-700">{item.product.category && item.product.category.name}</span>
                      <span>&middot; SKU: {item.product._id.slice(-5).toUpperCase()}</span>
                    </p>
                    <p className="mt-3"><b className="text-xl text-brand-600">{item.price} EGP</b> <span className="text-xs text-gray-500">per unit</span></p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                      <button className="flex h-8 w-8 items-center justify-center text-gray-500 disabled:opacity-40" disabled={item.count <= 1} onClick={() => updateCount(item.product._id, item.count - 1)}><FaMinus className="text-xs" /></button>
                      <span className="w-10 text-center font-semibold">{item.count}</span>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white hover:bg-brand-700" onClick={() => updateCount(item.product._id, item.count + 1)}><FaPlus className="text-xs" /></button>
                    </div>

                    <div className="flex items-end gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-2xl font-bold">{item.price * item.count} <span className="text-sm font-normal text-gray-500">EGP</span></p>
                      </div>
                      <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100" onClick={() => removeFromCart(item.product._id)} aria-label="remove">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-5 text-sm">
            <Link href="/products" className="flex items-center gap-2 text-brand-600 hover:underline"><FaArrowLeft className="text-xs" /> Continue Shopping</Link>
            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500" onClick={clearCart}><FaTrash className="text-xs" /> Clear all items</button>
          </div>
        </div>

        <aside className="h-fit overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-5 text-white">
            <h2 className="flex items-center gap-3 text-lg font-bold"><FaShoppingBag /> Order Summary</h2>
            <p className="mt-1 text-sm text-white/80">{cart.count} items in your cart</p>
          </div>
          <div className="p-6">
            {cart.total >= 500 && (
              <div className="mb-5 flex items-center gap-3 rounded-xl bg-brand-50 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600"><FaTruck /></span>
                <div>
                  <p className="font-bold text-brand-700">Free Shipping!</p>
                  <p className="text-sm text-brand-600">You qualify for free delivery</p>
                </div>
              </div>
            )}
            <div className="flex justify-between py-1.5"><span className="text-gray-600">Subtotal</span><span>{cart.total} EGP</span></div>
            <div className="flex justify-between py-1.5"><span className="text-gray-600">Shipping</span><b className="text-brand-600">FREE</b></div>
            <div className="mt-3 flex items-center justify-between border-t border-dashed pt-4">
              <span className="font-bold">Total</span>
              <span className="text-3xl font-bold">{cart.total} <span className="text-sm font-normal text-gray-500">EGP</span></span>
            </div>

            {showCoupon ? (
              <div className="mt-5 flex gap-2">
                <input className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-brand-600" placeholder="Promo code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <button className="rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white disabled:opacity-50" disabled={!coupon} onClick={() => applyCoupon(coupon)}>Apply</button>
              </div>
            ) : (
              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm text-gray-600 hover:border-brand-600 hover:text-brand-600" onClick={() => setShowCoupon(true)}>
                <FaTag /> Apply Promo Code
              </button>
            )}

            <Link href="/checkout" className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 py-4 font-semibold text-white shadow-lg hover:opacity-95">
              <FaLock /> Secure Checkout
            </Link>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><FaShieldAlt className="text-brand-600" /> Secure Payment</span>
              <span className="h-3 w-px bg-gray-300"></span>
              <span className="flex items-center gap-1.5"><FaTruck className="text-blue-500" /> Fast Delivery</span>
            </div>
            <Link href="/products" className="mt-5 flex items-center justify-center gap-2 text-sm text-brand-600 hover:underline"><FaArrowLeft className="text-xs" /> Continue Shopping</Link>
          </div>
        </aside>
      </div>
    </>
  );
}

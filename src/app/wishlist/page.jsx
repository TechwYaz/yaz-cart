"use client";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useApp } from "@/context/AppContext";
import { useRequireAuth, Loader } from "@/components/ui";
import PageTop from "@/components/PageTop";

export default function Wishlist() {
  const isLoggedIn = useRequireAuth();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  if (!isLoggedIn) return <Loader />;

  return (
    <>
      <div className="full-bleed border-b bg-white">
        <div className="container-x">
          <PageTop
            crumbs={[{ label: "Wishlist" }]}
            icon={<FaHeart />}
            iconClass="bg-red-50 text-red-500 shadow-none"
            title="My Wishlist"
            subtitle={wishlist.length + " items saved"}
          />
        </div>
      </div>

      <div className="py-8">
        {wishlist.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl py-12 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-3xl text-gray-400"><FaRegHeart /></span>
            <h2 className="mt-6 text-xl font-bold">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-gray-600">Browse products and save your favorites here.</p>
            <Link href="/products" className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700">Browse Products &rarr;</Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_120px_120px_220px] border-b bg-gray-50 px-6 py-4 text-sm text-gray-600 max-md:hidden">
              <span>Product</span><span className="text-center">Price</span><span className="text-center">Status</span><span className="text-center">Actions</span>
            </div>
            {wishlist.map((p) => (
              <div key={p._id} className="grid items-center gap-3 border-b px-6 py-5 last:border-0 md:grid-cols-[1fr_120px_120px_220px]">
                <div className="flex items-center gap-4">
                  <Link href={"/products/" + p._id} className="h-20 w-20 shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-1">
                    <img src={p.imageCover} alt={p.title} className="h-full w-full object-contain" />
                  </Link>
                  <div>
                    <Link href={"/products/" + p._id} className="font-medium hover:text-brand-600">{p.title}</Link>
                    <p className="text-sm text-gray-500">{p.category && p.category.name}</p>
                  </div>
                </div>
                <p className="font-bold md:text-center">{p.priceAfterDiscount || p.price} EGP</p>
                <p className="md:text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-600"></span> {p.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700" onClick={() => addToCart(p._id)}>
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-red-500" onClick={() => toggleWishlist(p._id)} aria-label="remove">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {wishlist.length > 0 && (
          <Link href="/products" className="mt-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600"><FaArrowLeft className="text-xs" /> Continue Shopping</Link>
        )}
      </div>
    </>
  );
}

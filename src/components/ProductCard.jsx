"use client";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaPlus, FaSyncAlt, FaRegEye } from "react-icons/fa";
import { useApp } from "@/context/AppContext";
import { Stars } from "./ui";

export default function ProductCard({ p }) {
  const { addToCart, toggleWishlist, inWishlist } = useApp();
  const liked = inWishlist(p._id);

  let discount = 0;
  if (p.priceAfterDiscount) {
    discount = Math.round(((p.price - p.priceAfterDiscount) / p.price) * 100);
  }

  const iconBtn = "flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm text-gray-600 shadow hover:text-brand-600";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative">
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}

        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <button onClick={() => toggleWishlist(p._id)} className={iconBtn} aria-label="wishlist">
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          <span className={iconBtn} title="Compare"><FaSyncAlt /></span>
          <Link href={"/products/" + p._id} className={iconBtn} aria-label="view product"><FaRegEye /></Link>
        </div>

        <Link href={"/products/" + p._id}>
          <img src={p.imageCover} alt={p.title} className="h-60 w-full object-contain p-2" loading="lazy" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <p className="text-xs text-gray-500">{p.category && p.category.name}</p>
        <Link href={"/products/" + p._id} className="mt-1 line-clamp-2 min-h-12 font-medium leading-6 text-gray-800 hover:text-brand-600">
          {p.title}
        </Link>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <Stars value={p.ratingsAverage} />
          <span>{p.ratingsAverage} ({p.ratingsQuantity})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className={"text-lg font-bold " + (p.priceAfterDiscount ? "text-brand-600" : "text-gray-900")}>
              {p.priceAfterDiscount || p.price} EGP
            </span>
            {p.priceAfterDiscount && <span className="text-xs text-gray-400 line-through">{p.price} EGP</span>}
          </div>
          <button
            onClick={() => addToCart(p._id)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700"
            aria-label="add to cart"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ items }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((p) => (
        <ProductCard key={p._id} p={p} />
      ))}
    </div>
  );
}

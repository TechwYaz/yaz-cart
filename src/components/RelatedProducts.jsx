"use client";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ items }) {
  const row = useRef(null);

  function scroll(direction) {
    row.current.scrollBy({ left: direction * 480, behavior: "smooth" });
  }

  const arrow = "flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-brand-600 hover:text-white";

  return (
    <section className="mb-8 mt-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-2xl font-bold">
          <span className="h-7 w-1 rounded bg-brand-600"></span>
          <span>You May Also <span className="text-brand-600">Like</span></span>
        </h2>
        <div className="flex gap-2">
          <button className={arrow} onClick={() => scroll(-1)} aria-label="previous"><FaChevronLeft className="text-sm" /></button>
          <button className={arrow} onClick={() => scroll(1)} aria-label="next"><FaChevronRight className="text-sm" /></button>
        </div>
      </div>
      <div ref={row} className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]">
        {items.map((p) => (
          <div key={p._id} className="w-[230px] shrink-0">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

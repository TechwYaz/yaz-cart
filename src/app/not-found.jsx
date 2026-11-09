"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaHome, FaArrowLeft, FaAppleAlt, FaCarrot, FaLeaf, FaSeedling } from "react-icons/fa";

const destinations = [
  { label: "All Products", href: "/products", main: true },
  { label: "Categories", href: "/categories" },
  { label: "Today's Deals", href: "/deals" },
  { label: "Contact Us", href: "/contact" },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="full-bleed relative overflow-hidden bg-gradient-to-b from-brand-50/40 to-white py-16">
      <FaAppleAlt className="absolute left-[6%] top-12 text-4xl text-brand-100" />
      <FaCarrot className="absolute right-[12%] top-24 rotate-45 text-3xl text-brand-100" />
      <FaAppleAlt className="absolute left-[15%] top-80 text-2xl text-brand-100" />
      <FaLeaf className="absolute left-[8%] top-[28rem] text-4xl text-brand-100" />
      <FaCarrot className="absolute right-[6%] top-64 rotate-12 text-2xl text-brand-100" />
      <FaSeedling className="absolute right-[16%] top-[26rem] text-4xl text-brand-100" />

      <div className="container-x relative text-center">
        <div className="relative mx-auto h-44 w-60">
          <div className="absolute inset-x-0 bottom-0 top-6 flex items-center justify-center rounded-3xl bg-white shadow-xl">
            <FaShoppingCart className="text-7xl text-brand-500/60" />
          </div>
          <span className="absolute -right-4 -top-2 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 text-2xl font-extrabold text-white shadow-xl ring-4 ring-white">
            404
          </span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-500"></span>
          <span className="h-2.5 w-5 rounded-b-full border-b-2 border-brand-500"></span>
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-500 [animation-delay:150ms]"></span>
        </div>

        <h1 className="mt-10 text-5xl font-extrabold text-gray-900">Oops! Nothing Here</h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-gray-600">
          Looks like this page went out of stock! Don&apos;t worry, there&apos;s plenty more fresh content to explore.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="flex items-center gap-3 rounded-xl bg-brand-600 px-8 py-3.5 font-semibold text-white shadow-lg hover:bg-brand-700">
            <FaHome /> Go to Homepage
          </Link>
          <button onClick={() => router.back()} className="flex items-center gap-3 rounded-xl bg-white px-8 py-3.5 font-semibold text-gray-800 shadow-lg hover:bg-gray-50">
            <FaArrowLeft /> Go Back
          </button>
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-2xl bg-white p-8 shadow-lg">
          <p className="text-xs uppercase tracking-widest text-gray-500">Popular Destinations</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {destinations.map((d) => (
              <Link
                key={d.label}
                href={d.href}
                className={"rounded-xl px-5 py-3 text-sm font-medium " + (d.main ? "bg-brand-50 text-brand-700 hover:bg-brand-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}
              >
                {d.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

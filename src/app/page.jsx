"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaTruck, FaShieldAlt, FaUndo, FaHeadset, FaChevronLeft, FaChevronRight, FaArrowRight, FaFire, FaMagic,
} from "react-icons/fa";
import { useFetch } from "@/lib/useFetch";
import { Loader } from "@/components/ui";
import { ProductGrid } from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";

const slides = [
  { title: "Fresh Products Delivered to your Door", text: "Get 20% off your first order", btn1: ["Shop Now", "/products"], btn2: ["View Deals", "/deals"] },
  { title: "Premium Quality Guaranteed", text: "Fresh from farm to your table", btn1: ["Shop Now", "/products"], btn2: ["Learn More", "/about"] },
  { title: "Fast & Free Delivery", text: "Same day delivery available", btn1: ["Order Now", "/products"], btn2: ["Delivery Info", "/help"] },
];

const features = [
  { icon: <FaTruck />, title: "Free Shipping", text: "On orders over 500 EGP", color: "bg-blue-100 text-blue-600" },
  { icon: <FaShieldAlt />, title: "Secure Payment", text: "100% secure transactions", color: "bg-green-100 text-green-600" },
  { icon: <FaUndo />, title: "Easy Returns", text: "14-day return policy", color: "bg-orange-100 text-orange-500" },
  { icon: <FaHeadset />, title: "24/7 Support", text: "Dedicated support team", color: "bg-purple-100 text-purple-600" },
];

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const arrow = "absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-600 shadow hover:bg-gray-100";

  return (
    <section
      className="full-bleed relative h-[400px] bg-cover bg-center text-white"
      style={{ backgroundImage: "url(/images/slider-1.png)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-green-500/70"></div>

      <div className="container-x relative flex h-full items-center">
        <div className="max-w-sm pl-4">
          <h1 className="text-3xl font-bold leading-tight">{slide.title}</h1>
          <p className="mt-4 text-lg">{slide.text}</p>
          <div className="mt-6 flex gap-3">
            <Link href={slide.btn1[1]} className="rounded-lg bg-white px-6 py-2.5 font-semibold text-brand-600 hover:bg-gray-100">
              {slide.btn1[0]}
            </Link>
            <Link href={slide.btn2[1]} className="rounded-lg border-2 border-white/60 px-6 py-2.5 font-semibold hover:bg-white/10">
              {slide.btn2[0]}
            </Link>
          </div>
        </div>
      </div>

      <button className={arrow + " left-4"} onClick={() => setCurrent((current + slides.length - 1) % slides.length)} aria-label="previous">
        <FaChevronLeft />
      </button>
      <button className={arrow + " right-4"} onClick={() => setCurrent((current + 1) % slides.length)} aria-label="next">
        <FaChevronRight />
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={"slide " + (i + 1)}
            className={"h-2 rounded-full transition-all " + (i === current ? "w-8 bg-white" : "w-2 bg-white/60")}
          />
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ first, second, link, linkText }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h2 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
        <span className="h-8 w-1 rounded bg-brand-600"></span>
        <span>{first} <span className="text-brand-600">{second}</span></span>
      </h2>
      {link && (
        <Link href={link} className="flex items-center gap-2 font-medium text-brand-600 hover:underline">
          {linkText} <FaArrowRight />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const categories = useFetch("categories");
  const products = useFetch("products");

  return (
    <div>
      <Hero />

      <section className="full-bleed bg-gray-50 py-8">
        <div className="container-x grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
              <span className={"flex h-12 w-12 items-center justify-center rounded-full text-lg " + f.color}>{f.icon}</span>
              <div>
                <h3 className="text-sm font-bold">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle first="Shop By" second="Category" link="/categories" linkText="View All Categories" />
        {categories.loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.data &&
              categories.data.data.map((c) => (
                <Link
                  key={c._id}
                  href={"/categories/" + c._id}
                  className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <img src={c.image} alt={c.name} className="h-20 w-20 rounded-full object-cover" loading="lazy" />
                  <p className="mt-3 text-center text-sm font-medium text-gray-700">{c.name}</p>
                </Link>
              ))}
          </div>
        )}
      </section>

      <section className="mt-16 grid gap-6 px-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 p-8 text-white">
          <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"></span>
          <span className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10"></span>
          <span className="relative inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm"><FaFire className="text-orange-400" /> Deal of the Day</span>
          <h3 className="relative mt-4 text-3xl font-bold">Fresh Organic Fruits</h3>
          <p className="relative mt-2 text-white/80">Get up to 40% off on selected organic fruits</p>
          <p className="relative mt-4 flex items-baseline gap-3"><span className="text-4xl font-bold">40% OFF</span><span className="text-sm text-white/80">Use code: <b className="text-white">ORGANIC40</b></span></p>
          <Link href="/products" className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-emerald-700">
            Shop Now <FaArrowRight />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 p-8 text-white">
          <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"></span>
          <span className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10"></span>
          <span className="relative inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm"><FaMagic className="text-yellow-200" /> New Arrivals</span>
          <h3 className="relative mt-4 text-3xl font-bold">Exotic Vegetables</h3>
          <p className="relative mt-2 text-white/80">Discover our latest collection of premium vegetables</p>
          <p className="relative mt-4 flex items-baseline gap-3"><span className="text-4xl font-bold">25% OFF</span><span className="text-sm text-white/80">Use code: <b className="text-white">FRESH25</b></span></p>
          <Link href="/products" className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-orange-600">
            Explore Now <FaArrowRight />
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle first="Featured" second="Products" />
        {products.loading ? <Loader /> : products.data && <ProductGrid items={products.data.data} />}
      </section>

      <Newsletter />
    </div>
  );
}

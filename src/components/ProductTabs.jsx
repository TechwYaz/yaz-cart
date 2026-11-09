"use client";
import { useState } from "react";
import { FaBoxOpen, FaStar, FaTruck, FaCheck, FaUndo, FaShieldAlt } from "react-icons/fa";
import Reviews from "./Reviews";

const features = ["Premium Quality Product", "100% Authentic Guarantee", "Fast & Secure Packaging", "Quality Tested"];
const shipping = [
  "Free shipping on orders over 500 EGP",
  "Standard delivery: 3-5 business days",
  "Express delivery available (1-2 business days)",
  "Track your order in real-time",
];
const returns = [
  "14-day hassle-free returns",
  "Full refund or exchange available",
  "Free return shipping on defective items",
  "Easy online return process",
];

function CheckList({ items }) {
  return (
    <ul className="space-y-3 text-sm text-gray-700">
      {items.map((text) => (
        <li key={text} className="flex items-center gap-3"><FaCheck className="text-xs text-brand-600" /> {text}</li>
      ))}
    </ul>
  );
}

export default function ProductTabs({ product }) {
  const [tab, setTab] = useState("details");
  const sub = product.subcategory && product.subcategory[0];

  const tabs = [
    { id: "details", label: "Product Details", icon: <FaBoxOpen /> },
    { id: "reviews", label: "Reviews (" + product.ratingsQuantity + ")", icon: <FaStar /> },
    { id: "shipping", label: "Shipping & Returns", icon: <FaTruck /> },
  ];

  return (
    <section className="mt-10 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex overflow-x-auto border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={"flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium " + (tab === t.id ? "border-brand-600 bg-brand-50/60 text-brand-600" : "border-transparent text-gray-600 hover:text-brand-600")}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "details" && (
          <div>
            <h3 className="mb-3 text-lg font-bold">About this Product</h3>
            <p className="leading-7 text-gray-600">{product.description}</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-5">
                <h4 className="mb-3 font-semibold">Product Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Category</span><span>{product.category && product.category.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Subcategory</span><span>{sub ? sub.name : "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Brand</span><span>{product.brand ? product.brand.name : "-"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Items Sold</span><span>{product.sold}+ sold</span></div>
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 p-5">
                <h4 className="mb-3 font-semibold">Key Features</h4>
                <CheckList items={features} />
              </div>
            </div>
          </div>
        )}

        {tab === "reviews" && <Reviews productId={product._id} average={product.ratingsAverage} quantity={product.ratingsQuantity} />}

        {tab === "shipping" && (
          <div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-6">
                <h4 className="mb-4 flex items-center gap-3 font-semibold">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white"><FaTruck /></span> Shipping Information
                </h4>
                <CheckList items={shipping} />
              </div>
              <div className="rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/60 p-6">
                <h4 className="mb-4 flex items-center gap-3 font-semibold">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white"><FaUndo /></span> Returns &amp; Refunds
                </h4>
                <CheckList items={returns} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4 rounded-xl bg-gray-50 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-600"><FaShieldAlt /></span>
              <div>
                <h4 className="font-semibold">Buyer Protection Guarantee</h4>
                <p className="text-sm text-gray-600">Get a full refund if your order doesn&apos;t arrive or isn&apos;t as described. We ensure your shopping experience is safe and secure.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

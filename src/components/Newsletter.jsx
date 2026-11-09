"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaLeaf, FaTruck, FaTag, FaArrowRight, FaApple, FaGooglePlay, FaStar, FaMobileAlt } from "react-icons/fa";

const perks = [
  { icon: <FaLeaf />, text: "Fresh Picks Weekly" },
  { icon: <FaTruck />, text: "Free Delivery Codes" },
  { icon: <FaTag />, text: "Members-Only Deals" },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    toast.success("Thanks for subscribing!");
    setEmail("");
  }

  return (
    <section className="mx-4 mt-20 rounded-[2rem] border border-brand-100 bg-gradient-to-br from-white via-white to-brand-50 p-6 shadow-xl shadow-brand-600/5 md:p-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1px_390px] lg:gap-14">
        <div>
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 text-xl text-white shadow-lg">
              <FaEnvelope />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">Newsletter</p>
              <p className="text-xs text-gray-500">50,000+ subscribers</p>
            </div>
          </div>

          <h2 className="mt-8 text-4xl font-bold leading-snug text-gray-900">
            Get the Freshest Updates <br />
            <span className="text-brand-600">Delivered Free</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">Weekly recipes, seasonal offers &amp; exclusive member perks.</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {perks.map((p) => (
              <span key={p.text} className="flex items-center gap-3 rounded-full border border-gray-100 bg-white py-2 pl-2 pr-4 text-sm shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs text-brand-600">{p.icon}</span>
                {p.text}
              </span>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-wrap gap-4">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 min-w-0 flex-1 rounded-xl border-2 border-gray-200 bg-white px-5 outline-none focus:border-brand-600"
            />
            <button className="flex h-14 items-center gap-3 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 px-8 font-semibold text-white shadow-lg hover:opacity-95">
              Subscribe <FaArrowRight />
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-500">&#10024; Unsubscribe anytime. No spam, ever.</p>
        </div>

        <div className="hidden bg-gray-200 lg:block"></div>

        <div className="rounded-2xl bg-gradient-to-br from-[#101828] to-[#0f2a2a] p-8 text-white shadow-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-600/40 bg-brand-600/20 px-3 py-1 text-xs font-semibold uppercase text-brand-500">
            <FaMobileAlt /> Mobile App
          </span>
          <h3 className="mt-5 text-2xl font-bold">Shop Faster on Our App</h3>
          <p className="mt-4 text-sm text-gray-400">Get app-exclusive deals &amp; 15% off your first order.</p>

          <div className="mt-6 space-y-3">
            <a href="#" className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10">
              <FaApple className="text-2xl" />
              <span className="leading-tight"><span className="block text-[10px] uppercase tracking-wider text-gray-400">Download on</span><b>App Store</b></span>
            </a>
            <a href="#" className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10">
              <FaGooglePlay className="text-xl" />
              <span className="leading-tight"><span className="block text-[10px] uppercase tracking-wider text-gray-400">Get it on</span><b>Google Play</b></span>
            </a>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-gray-300">
            <span className="flex gap-0.5 text-xs text-amber-400"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></span>
            4.9 &middot; 100K+ downloads
          </p>
        </div>
      </div>
    </section>
  );
}

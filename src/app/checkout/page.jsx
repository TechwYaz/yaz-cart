"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaReceipt, FaArrowLeft, FaHome, FaBookmark, FaMapMarkerAlt, FaPlus, FaInfo, FaCity, FaPhoneAlt, FaMoneyBillWave,
  FaCreditCard, FaCheck, FaShieldAlt, FaShoppingBag, FaTruck, FaUndo,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import { useRequireAuth, Loader } from "@/components/ui";
import PageTop from "@/components/PageTop";

function SectionHeader({ icon, title, text }) {
  return (
    <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4 text-white">
      <h2 className="flex items-center gap-3 text-lg font-bold">{icon} {title}</h2>
      <p className="mt-0.5 text-sm text-white/80">{text}</p>
    </div>
  );
}

const inputWrap = "relative block";
const inputIcon = "absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500";
const inputBase = "w-full rounded-xl border border-gray-200 bg-white pl-14 pr-4 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20";

export default function Checkout() {
  const isLoggedIn = useRequireAuth();
  const { cart, loadCart } = useApp();
  const router = useRouter();

  const [address, setAddress] = useState({ city: "", details: "", phone: "" });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    api("addresses", { auth: true })
      .then((res) => {
        setSavedAddresses(res.data);
        if (res.data.length > 0) {
          const first = res.data[0];
          setSelectedId(first._id);
          setAddress({ city: first.city, details: first.details, phone: first.phone });
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  if (!isLoggedIn || !cart) return <Loader />;

  if (cart.items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-xl">Your cart is empty</p>
        <Link className="btn-primary" href="/products">Start Shopping</Link>
      </div>
    );
  }

  async function chooseAddress(id) {
    setSelectedId(id);
    try {
      const res = await api("addresses/" + id, { auth: true });
      setAddress({ city: res.data.city, details: res.data.details, phone: res.data.phone });
    } catch (err) {
      toast.error(err.message);
    }
  }

  function useNewAddress() {
    setSelectedId(null);
    setAddress({ city: "", details: "", phone: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^01[0125][0-9]{8}$/.test(address.phone)) {
      toast.error("Please enter a valid Egyptian phone number");
      return;
    }

    setLoading(true);
    try {
      if (paymentMethod === "cash") {
        try {
          await api("orders/" + cart.cartId, {
            method: "POST",
            body: { shippingAddress: { ...address, postalCode: "12345" } },
            auth: true,
            version: 2,
          });
        } catch (v2Error) {
          await api("orders/" + cart.cartId, { method: "POST", body: { shippingAddress: address }, auth: true });
        }
        toast.success("Order placed successfully");
        await loadCart();
        router.push("/orders");
      } else {
        const res = await api("orders/checkout-session/" + cart.cartId + "?url=" + window.location.origin, {
          method: "POST",
          body: { shippingAddress: address },
          auth: true,
        });
        window.location.href = res.session.url;
        return;
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  }

  const shipping = 0;

  return (
    <>
      <PageTop
        crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
        icon={<FaReceipt />}
        title="Complete Your Order"
        subtitle="Review your items and complete your purchase"
        right={<Link href="/cart" className="flex items-center gap-2 pt-12 text-brand-600 hover:underline"><FaArrowLeft /> Back to Cart</Link>}
      />

      <form onSubmit={handleSubmit} className="grid gap-6 pb-10 lg:grid-cols-[1fr_393px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <SectionHeader icon={<FaHome />} title="Shipping Address" text="Where should we deliver your order?" />
            <div className="p-6">
              {savedAddresses.length > 0 && (
                <>
                  <h3 className="flex items-center gap-2 font-bold"><FaBookmark className="text-sm text-brand-600" /> Saved Addresses</h3>
                  <p className="mb-4 mt-2 text-sm text-gray-600">Select a saved address or enter a new one below</p>
                  <div className="space-y-3">
                    {savedAddresses.map((a) => (
                      <button
                        type="button"
                        key={a._id}
                        onClick={() => chooseAddress(a._id)}
                        className={"flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left " + (selectedId === a._id ? "border-brand-600 bg-brand-50/40" : "border-gray-200")}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-brand-600"><FaMapMarkerAlt /></span>
                        <span>
                          <b className="block">{a.name}</b>
                          <span className="block text-sm text-gray-600">{a.details}</span>
                          <span className="mt-1 flex gap-4 text-xs text-gray-500"><span className="flex items-center gap-1"><FaPhoneAlt /> {a.phone}</span><span className="flex items-center gap-1"><FaCity /> {a.city}</span></span>
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={useNewAddress}
                      className={"flex w-full items-center gap-4 rounded-xl border-2 border-dashed p-4 text-left " + (selectedId === null ? "border-brand-600 bg-brand-50/40" : "border-brand-100")}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white"><FaPlus /></span>
                      <span>
                        <b className="block text-brand-700">Use a different address</b>
                        <span className="text-sm text-gray-600">Enter a new shipping address manually</span>
                      </span>
                    </button>
                  </div>
                  <hr className="my-6" />
                </>
              )}

              <div className="mb-6 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600"><FaInfo /></span>
                <div>
                  <p className="text-sm font-semibold text-blue-700">Delivery Information</p>
                  <p className="text-xs text-blue-600">Please ensure your address is accurate for smooth delivery</p>
                </div>
              </div>

              <label className="mb-5 block">
                <span className="mb-2 block text-sm font-semibold">City <span className="text-red-500">*</span></span>
                <span className={inputWrap}>
                  <span className={inputIcon}><FaCity /></span>
                  <input className={inputBase + " h-14"} required placeholder="e.g. Cairo, Alexandria, Giza" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </span>
              </label>
              <label className="mb-5 block">
                <span className="mb-2 block text-sm font-semibold">Street Address <span className="text-red-500">*</span></span>
                <span className={inputWrap}>
                  <span className={inputIcon}><FaMapMarkerAlt /></span>
                  <textarea className={inputBase + " h-28 pt-4"} required placeholder="Street name, building number, floor, apartment..." value={address.details} onChange={(e) => setAddress({ ...address, details: e.target.value })} />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Phone Number <span className="text-red-500">*</span></span>
                <span className={inputWrap}>
                  <span className={inputIcon}><FaPhoneAlt /></span>
                  <input className={inputBase + " h-14"} required placeholder="01xxxxxxxxx" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                  <span className="absolute right-4 top-4 text-xs text-gray-400">Egyptian numbers only</span>
                </span>
              </label>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <SectionHeader icon={<FaCreditCard />} title="Payment Method" text="Choose how you'd like to pay" />
            <div className="space-y-4 p-6">
              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={"flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left " + (paymentMethod === "cash" ? "border-brand-600 bg-brand-50/50" : "border-gray-200")}
              >
                <span className={"flex h-12 w-12 items-center justify-center rounded-xl text-lg " + (paymentMethod === "cash" ? "bg-brand-600 text-white shadow-lg" : "bg-gray-100 text-gray-500")}><FaMoneyBillWave /></span>
                <span className="flex-1">
                  <b className="block">Cash on Delivery</b>
                  <span className="text-sm text-gray-600">Pay when your order arrives at your doorstep</span>
                </span>
                <span className={"flex h-7 w-7 items-center justify-center rounded-full text-xs " + (paymentMethod === "cash" ? "bg-brand-600 text-white" : "border-2 border-gray-300")}>{paymentMethod === "cash" && <FaCheck />}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("online")}
                className={"flex w-full items-center gap-4 rounded-xl border-2 p-5 text-left " + (paymentMethod === "online" ? "border-brand-600 bg-brand-50/50" : "border-gray-200")}
              >
                <span className={"flex h-12 w-12 items-center justify-center rounded-xl text-lg " + (paymentMethod === "online" ? "bg-brand-600 text-white shadow-lg" : "bg-gray-100 text-gray-500")}><FaCreditCard /></span>
                <span className="flex-1">
                  <b className="block">Pay Online</b>
                  <span className="text-sm text-gray-600">Secure payment with Credit/Debit Card via Stripe</span>
                  <span className="mt-2 flex gap-2 text-[10px] font-bold"><span className="rounded bg-blue-700 px-1.5 text-white">VISA</span><span className="rounded bg-orange-500 px-1.5 text-white">MC</span><span className="rounded bg-sky-500 px-1.5 text-white">AMEX</span></span>
                </span>
                <span className={"flex h-7 w-7 items-center justify-center rounded-full text-xs " + (paymentMethod === "online" ? "bg-brand-600 text-white" : "border-2 border-gray-300")}>{paymentMethod === "online" && <FaCheck />}</span>
              </button>

              <div className="flex items-center gap-4 rounded-xl border border-brand-100 bg-brand-50 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600"><FaShieldAlt /></span>
                <div>
                  <p className="text-sm font-semibold text-brand-700">Secure &amp; Encrypted</p>
                  <p className="text-xs text-brand-600">Your payment info is protected with 256-bit SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:sticky lg:top-40">
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4 text-white">
            <h2 className="flex items-center gap-3 text-lg font-bold"><FaShoppingBag /> Order Summary</h2>
            <p className="mt-0.5 text-sm text-white/80">{cart.count} items</p>
          </div>
          <div className="p-5">
            <div className="max-h-56 space-y-3 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <img src={item.product.imageCover} alt="" className="h-12 w-12 rounded-lg bg-white object-contain p-1" />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="line-clamp-1 font-medium">{item.product.title}</p>
                    <p className="text-xs text-gray-500">{item.count} &times; {item.price} EGP</p>
                  </div>
                  <b className="text-sm">{item.count * item.price}</b>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between border-t py-3 text-sm"><span className="text-gray-600">Subtotal</span><span>{cart.total} EGP</span></div>
            <div className="flex justify-between pb-3 text-sm"><span className="flex items-center gap-2 text-gray-600"><FaTruck className="text-gray-400" /> Shipping</span><b className="text-brand-600">{shipping === 0 ? "FREE" : shipping + " EGP"}</b></div>
            <div className="flex items-center justify-between border-t pt-4"><b>Total</b><span className="text-3xl font-bold text-brand-600">{cart.total + shipping} <span className="text-sm font-normal text-gray-500">EGP</span></span></div>

            <button className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 py-4 font-semibold text-white shadow-lg hover:opacity-95 disabled:opacity-60" disabled={loading}>
              <FaShoppingBag /> {loading ? "Please wait..." : paymentMethod === "cash" ? "Place Order" : "Pay Online"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 border-t pt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><FaShieldAlt className="text-brand-600" /> Secure</span>
              <span className="h-3 w-px bg-gray-300"></span>
              <span className="flex items-center gap-1.5"><FaTruck className="text-blue-500" /> Fast Delivery</span>
              <span className="h-3 w-px bg-gray-300"></span>
              <span className="flex items-center gap-1.5"><FaUndo className="text-orange-500" /> Easy Returns</span>
            </div>
          </div>
        </aside>
      </form>
    </>
  );
}

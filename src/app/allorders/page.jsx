"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaShoppingBag, FaRegClock, FaCheckCircle, FaHashtag, FaRegCalendarAlt, FaBox, FaMapMarkerAlt, FaMoneyBillWave,
  FaCreditCard, FaChevronDown, FaChevronUp, FaReceipt, FaTruck,
} from "react-icons/fa";
import { useApp } from "@/context/AppContext";
import { useFetch } from "@/lib/useFetch";
import { useRequireAuth, Loader, ErrorMsg } from "@/components/ui";
import PageTop from "@/components/PageTop";

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);

  const items = order.cartItems || [];
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);
  const first = items[0];
  const status = order.isDelivered
    ? { text: "Delivered", style: "bg-green-100 text-green-700", icon: <FaCheckCircle /> }
    : order.isPaid
    ? { text: "Paid", style: "bg-blue-100 text-blue-700", icon: <FaCheckCircle /> }
    : { text: "Processing", style: "bg-amber-100 text-amber-700", icon: <FaRegClock /> };

  return (
    <div className={"overflow-hidden rounded-2xl border bg-white shadow-sm " + (open ? "border-brand-100" : "border-gray-100")}>
      <div className="flex flex-wrap gap-5 p-6">
        <div className="relative h-28 w-28 shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-2">
          {first && <img src={first.product.imageCover} alt="" className="h-full w-full object-contain" />}
          {items.length > 1 && (
            <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">+{items.length - 1}</span>
          )}
        </div>

        <div className="flex-1">
          <span className={"inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold " + status.style}>{status.icon} {status.text}</span>
          <h3 className="mt-2 flex items-center gap-2 text-xl font-bold"><FaHashtag className="text-sm text-gray-400" /> {order.id}</h3>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><FaRegCalendarAlt /> {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1.5"><FaBox /> {totalCount} items</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> {order.shippingAddress && order.shippingAddress.city}</span>
          </p>
          <p className="mt-3 text-2xl font-bold">{order.totalOrderPrice} <span className="text-sm font-normal text-gray-500">EGP</span></p>
        </div>

        <div className="flex flex-col items-end justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            {order.paymentMethodType === "card" ? <FaCreditCard /> : <FaMoneyBillWave />}
          </span>
          <button
            onClick={() => setOpen(!open)}
            className={"flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold " + (open ? "bg-brand-600 text-white shadow-lg" : "bg-gray-100 text-gray-800 hover:bg-gray-200")}
          >
            {open ? "Hide" : "Details"} {open ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-[#fcfcfd] p-6">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-100 text-xs text-brand-600"><FaReceipt /></span> Order Items
          </h4>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4">
                <div className="flex items-center gap-4">
                  <Link href={"/products/" + item.product._id} className="h-16 w-16 rounded-lg bg-gray-50 p-1">
                    <img src={item.product.imageCover} alt="" className="h-full w-full object-contain" />
                  </Link>
                  <div>
                    <p className="font-medium">{item.product.title}</p>
                    <p className="text-sm text-gray-500">{item.count} &times; {item.price} EGP</p>
                  </div>
                </div>
                <p className="text-right font-bold">{item.count * item.price}<br /><span className="text-xs font-normal text-gray-500">EGP</span></p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm">
              <p className="mb-2 flex items-center gap-2 font-bold"><FaMapMarkerAlt className="text-brand-600" /> Shipping Address</p>
              <p>{order.shippingAddress && order.shippingAddress.details}</p>
              <p className="text-gray-500">{order.shippingAddress && order.shippingAddress.city} - {order.shippingAddress && order.shippingAddress.phone}</p>
            </div>
            <div className={"rounded-xl border p-4 text-sm " + (order.isPaid ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50")}>
              <p className="mb-2 flex items-center gap-2 font-bold"><FaTruck /> Payment &amp; Delivery</p>
              <p>{order.paymentMethodType === "card" ? "Paid online by card" : "Cash on delivery"}</p>
              <p className="text-gray-600">{order.isPaid ? "Payment received" : "Payment pending"} &middot; {order.isDelivered ? "Delivered" : "Not delivered yet"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const isLoggedIn = useRequireAuth();
  const { user } = useApp();

  const path = isLoggedIn && user && user.id ? "orders/user/" + user.id : null;
  const { data, loading, error } = useFetch(path);

  if (!isLoggedIn || loading || (!data && !error)) return <Loader />;
  if (error) return <ErrorMsg>{error}</ErrorMsg>;

  const orders = [...(Array.isArray(data) ? data : data.data || [])].reverse();

  return (
    <>
      <PageTop
        crumbs={[{ label: "My Orders" }]}
        icon={<FaShoppingBag />}
        title="My Orders"
        subtitle={"Track and manage your " + orders.length + (orders.length === 1 ? " order" : " orders")}
        right={<Link href="/products" className="flex items-center gap-2 pt-6 text-sm text-brand-600 hover:underline"><FaShoppingBag className="text-xs" /> Continue Shopping</Link>}
      />

      {orders.length === 0 && <p className="py-16 text-center text-gray-500">You have no orders yet.</p>}

      <div className="space-y-5 pb-10">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </>
  );
}

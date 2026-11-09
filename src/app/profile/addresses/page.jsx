"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaPlus, FaPen, FaTrash, FaPhoneAlt, FaCity, FaTimes } from "react-icons/fa";
import { api } from "@/lib/api";
import AccountLayout from "@/components/AccountLayout";

const label = "mb-1.5 block text-sm font-medium text-gray-800";
const input = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", details: "", phone: "", city: "" });
  const [selected, setSelected] = useState(null);

  async function getAddresses() {
    try {
      const res = await api("addresses", { auth: true });
      setAddresses(res.data);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    getAddresses();
  }, []);

  async function addAddress(e) {
    e.preventDefault();
    if (!/^01[0125][0-9]{8}$/.test(form.phone)) {
      toast.error("Enter a valid Egyptian phone number");
      return;
    }
    try {
      await api("addresses", { method: "POST", body: form, auth: true });
      toast.success("Address added");
      setForm({ name: "", details: "", phone: "", city: "" });
      setShowAdd(false);
      getAddresses();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeAddress(id) {
    try {
      await api("addresses/" + id, { method: "DELETE", auth: true });
      toast.success("Address removed");
      getAddresses();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function viewAddress(id) {
    try {
      const res = await api("addresses/" + id, { auth: true });
      setSelected(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <AccountLayout>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Addresses</h2>
          <p className="mt-1 text-sm text-gray-600">Manage your saved delivery addresses</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-brand-700" onClick={() => setShowAdd(true)}>
          <FaPlus className="text-sm" /> Add Address
        </button>
      </div>

      {!loading && addresses.length === 0 && <p className="rounded-2xl border bg-white p-10 text-center text-gray-500">You have no saved addresses yet.</p>}

      <div className="grid gap-4 xl:grid-cols-2">
        {addresses.map((a) => (
          <div key={a._id} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><FaMapMarkerAlt /></span>
            <div className="flex-1">
              <b className="block text-lg">{a.name}</b>
              <p className="text-gray-600">{a.details}</p>
              <p className="mt-3 flex gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><FaPhoneAlt /> {a.phone}</span>
                <span className="flex items-center gap-1.5"><FaCity /> {a.city}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:text-brand-600" onClick={() => viewAddress(a._id)} aria-label="details"><FaPen className="text-xs" /></button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:text-red-500" onClick={() => removeAddress(a._id)} aria-label="delete"><FaTrash className="text-xs" /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <form onSubmit={addAddress} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Address</h3>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600" onClick={() => setShowAdd(false)}><FaTimes /></button>
            </div>
            <label className="mb-4 block"><span className={label}>Address Name</span><input className={input} required placeholder="e.g. Home, Office" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="mb-4 block"><span className={label}>Full Address</span><textarea className={input + " h-24"} required placeholder="Street, building, apartment..." value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} /></label>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <label><span className={label}>Phone Number</span><input className={input} required placeholder="01xxxxxxxxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              <label><span className={label}>City</span><input className={input} required placeholder="Cairo" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="rounded-xl bg-gray-100 py-3.5 font-semibold" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="rounded-xl bg-brand-600 py-3.5 font-semibold text-white shadow-lg hover:bg-brand-700">Add Address</button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold">{selected.name}</h3>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600" onClick={() => setSelected(null)}><FaTimes /></button>
            </div>
            <p className="text-gray-700">{selected.details}</p>
            <p className="mt-3 text-sm text-gray-500">{selected.city} &middot; {selected.phone}</p>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}

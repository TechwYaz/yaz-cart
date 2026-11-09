"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import { useFetch } from "@/lib/useFetch";
import { Stars } from "./ui";

export default function Reviews({ productId, average, quantity }) {
  const { token, user } = useApp();
  const [refresh, setRefresh] = useState(0);
  const { data } = useFetch("products/" + productId + "/reviews?r=" + refresh);

  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [editingId, setEditingId] = useState(null);

  const reviews = data ? data.data : [];

  function percent(stars) {
    if (reviews.length === 0) return 0;
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    return Math.round((count / reviews.length) * 100);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setText("");
    setRating(5);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await api("reviews/" + editingId, { method: "PUT", body: { review: text, rating: Number(rating) }, auth: true });
        toast.success("Review updated");
      } else {
        await api("products/" + productId + "/reviews", {
          method: "POST",
          body: { review: text, rating: Number(rating) },
          auth: true,
        });
        toast.success("Review added");
      }
      closeForm();
      setRefresh(refresh + 1);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function startEdit(id) {
    try {
      const res = await api("reviews/" + id);
      setText(res.data.review);
      setRating(res.data.rating);
      setEditingId(id);
      setShowForm(true);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function deleteReview(id) {
    try {
      await api("reviews/" + id, { method: "DELETE", auth: true });
      toast.success("Review deleted");
      setRefresh(refresh + 1);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <div className="grid items-center gap-8 md:grid-cols-[200px_1fr]">
        <div className="text-center">
          <p className="text-6xl font-bold">{average}</p>
          <div className="mt-2 flex justify-center"><Stars value={average} /></div>
          <p className="mt-2 text-sm text-gray-600">Based on {quantity} reviews</p>
        </div>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-4 text-sm text-gray-600">
              <span className="w-10 leading-4">{star} star</span>
              <div className="h-2 flex-1 rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-amber-400" style={{ width: percent(star) + "%" }}></div>
              </div>
              <span className="w-10 text-right">{percent(star)}%</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-8" />

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <textarea
            className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:border-brand-600"
            rows={3}
            required
            placeholder="Write your review"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <select className="h-11 w-36 rounded-lg border border-gray-200 bg-white px-3 text-sm" value={rating} onChange={(e) => setRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} stars</option>
              ))}
            </select>
            <button className="rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700">{editingId ? "Update Review" : "Submit Review"}</button>
            <button type="button" className="rounded-lg bg-gray-200 px-6 text-sm font-semibold" onClick={closeForm}>Cancel</button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="py-10 text-center">
          <FaStar className="mx-auto text-5xl text-gray-300" />
          <p className="mt-4 text-gray-600">Customer reviews will be displayed here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <b>{r.user && r.user.name}</b>
                <Stars value={r.rating} />
              </div>
              <p className="mt-2 text-sm text-gray-700">{r.review}</p>
              {user && r.user && r.user._id === user.id && (
                <div className="mt-3 flex gap-4 text-sm">
                  <button className="text-brand-600" onClick={() => startEdit(r._id)}>Edit</button>
                  <button className="text-red-600" onClick={() => deleteReview(r._id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!showForm && (
        <div className="mt-4 text-center">
          {token ? (
            <button className="font-medium text-brand-600 hover:underline" onClick={() => setShowForm(true)}>Write a Review</button>
          ) : (
            <Link href="/login" className="font-medium text-brand-600 hover:underline">Sign in to write a review</Link>
          )}
        </div>
      )}
    </div>
  );
}

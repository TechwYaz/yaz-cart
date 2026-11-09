"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import StaticPage from "@/components/StaticPage";
import { Field } from "@/components/AuthShell";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e) {
    e.preventDefault();
    toast.success("Thanks " + form.name + ", we received your message");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <StaticPage title="Contact Us" subtitle="We would love to hear from you">
      <p>Email: support@yazcart.com - Phone: +20 100 123 4567</p>
      <form onSubmit={handleSubmit} className="card p-5">
        <Field label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Field label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-semibold">Message</span>
          <textarea className="input" rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </label>
        <button className="btn-primary">Send Message</button>
      </form>
    </StaticPage>
  );
}

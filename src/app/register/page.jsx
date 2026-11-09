"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaStar, FaTruck, FaShieldAlt } from "react-icons/fa";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { Stars } from "@/components/ui";
import { AuthLayout, AuthCard, SocialButtons, Divider, Field, authLink } from "@/components/AuthShell";

function getStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: "Weak", width: "25%", color: "bg-red-500" };
  if (score <= 3) return { label: "Medium", width: "60%", color: "bg-yellow-500" };
  return { label: "Strong", width: "100%", color: "bg-brand-600" };
}

export default function Register() {
  const router = useRouter();
  const reviews = useFetch("reviews?limit=40");
  const ordersInfo = useFetch("orders?limit=1");

  const [form, setForm] = useState({ name: "", email: "", password: "", rePassword: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (form.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.rePassword) newErrors.rePassword = "Passwords do not match";
    if (!/^01[0125][0-9]{8}$/.test(form.phone)) newErrors.phone = "Enter a valid Egyptian phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    if (!agree) {
      toast.error("Please accept the terms first");
      return;
    }
    setLoading(true);
    try {
      await api("auth/signup", { method: "POST", body: form });
      toast.success("Account created, please sign in");
      router.push("/login");
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  }

  const strength = getStrength(form.password);
  const review = reviews.data && reviews.data.data && reviews.data.data.find((r) => r.review && r.review.length > 20 && r.review.includes(" "));

  const perks = [
    { icon: <FaStar />, title: "Premium Quality", text: "Premium quality products sourced from trusted suppliers." },
    { icon: <FaTruck />, title: "Fast Delivery", text: "Same-day delivery available in most areas" },
    { icon: <FaShieldAlt />, title: "Secure Shopping", text: "Your data and payments are completely secure" },
  ];

  const left = (
    <div>
      <h1 className="text-5xl font-bold leading-tight">Welcome to <span className="text-brand-600">YAZ CART</span></h1>
      <p className="mt-4 text-xl text-gray-700">
        Join thousands of happy customers who enjoy shopping with us{ordersInfo.data ? " - " + ordersInfo.data.results + " orders delivered so far" : ""}.
      </p>

      <div className="mt-8 space-y-6">
        {perks.map((p) => (
          <div key={p.title} className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">{p.icon}</span>
            <div>
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.text}</p>
            </div>
          </div>
        ))}
      </div>

      {review && (
        <div className="mt-8 rounded-xl bg-white p-4 shadow">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
              {(review.user && review.user.name ? review.user.name : "U").charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-medium">{review.user && review.user.name}</p>
              <Stars value={review.rating} />
            </div>
          </div>
          <p className="mt-3 text-sm italic text-gray-600">&quot;{review.review}&quot;</p>
        </div>
      )}
    </div>
  );

  return (
    <AuthLayout left={left} top>
      <AuthCard>
        <h1 className="text-center text-3xl font-bold">Create Your Account</h1>
        <p className="mb-6 mt-2 text-center text-gray-600">Start your shopping journey with us today</p>

        <SocialButtons short />
        <Divider text="or" />

        <form onSubmit={handleSubmit}>
          <Field label="Name*" name="name" required placeholder="Ali" value={form.name} onChange={handleChange} error={errors.name} />
          <Field label="Email*" name="email" type="email" required placeholder="ali@example.com" value={form.email} onChange={handleChange} />
          <Field label="Password*" name="password" type="password" required placeholder="create a strong password" value={form.password} onChange={handleChange} error={errors.password} />
          <div className="-mt-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 rounded bg-gray-200">
                <div className={"h-full rounded " + strength.color} style={{ width: form.password ? strength.width : "0%" }}></div>
              </div>
              <span className="text-sm text-gray-600">{form.password ? strength.label : "Weak"}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters, numbers and symbols make it stronger</p>
          </div>
          <Field label="Confirm Password*" name="rePassword" type="password" required placeholder="confirm your password" value={form.rePassword} onChange={handleChange} error={errors.rePassword} />
          <Field label="Phone Number*" name="phone" required placeholder="01xxxxxxxxx" value={form.phone} onChange={handleChange} error={errors.phone} />

          <label className="mb-5 flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>I agree to the Terms of Service and Privacy Policy</span>
          </label>

          <button className="w-full rounded-lg bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60" disabled={loading}>
            {loading ? "Creating account..." : "Create My Account"}
          </button>
        </form>

        <p className="mt-6 border-t pt-6 text-center text-sm text-gray-700">
          Already have an account? {authLink("/login", "Sign In")}
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

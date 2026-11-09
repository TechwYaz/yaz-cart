"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegEnvelope, FaLock, FaEye, FaEyeSlash, FaTruck, FaShieldAlt, FaClock, FaUsers, FaStar } from "react-icons/fa";
import { api } from "@/lib/api";
import { useFetch } from "@/lib/useFetch";
import { useApp } from "@/context/AppContext";
import { AuthLayout, AuthCard, SocialButtons, Divider, Field, authLink } from "@/components/AuthShell";
import Logo from "@/components/Logo";

export default function Login() {
  const { login } = useApp();
  const router = useRouter();
  const users = useFetch("users?limit=1");

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api("auth/signin", { method: "POST", body: form });
      login(res.token, res.user && res.user.name);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  }

  const left = (
    <div className="text-center">
      <img src="/images/auth-cart.png" alt="shopping cart full of groceries" className="mx-auto h-96 w-full max-w-xl rounded-2xl object-cover object-center shadow" />
      <h2 className="mx-auto mt-8 max-w-xl text-3xl font-bold leading-tight">YAZ CART - Your One-Stop Shop for Fresh Products</h2>
      <p className="mx-auto mt-4 max-w-md text-lg text-gray-600">Join thousands of happy customers who trust YAZ CART for their daily shopping needs</p>
      <div className="mt-5 flex justify-center gap-6 text-sm text-gray-600">
        <span className="flex items-center gap-2"><FaTruck className="text-brand-600" /> Free Delivery</span>
        <span className="flex items-center gap-2"><FaShieldAlt className="text-brand-600" /> Secure Payment</span>
        <span className="flex items-center gap-2"><FaClock className="text-brand-600" /> 24/7 Support</span>
      </div>
    </div>
  );

  return (
    <AuthLayout left={left}>
      <AuthCard>
        <div className="flex justify-center"><Logo size="text-3xl" /></div>
        <h1 className="mt-5 text-center text-2xl font-bold">Welcome Back!</h1>
        <p className="mb-6 mt-2 text-center text-gray-600">Sign in to continue your shopping experience</p>

        <SocialButtons />
        <Divider text="OR CONTINUE WITH EMAIL" />

        <form onSubmit={handleSubmit}>
          <Field
            label="Email Address"
            type="email"
            required
            icon={<FaRegEnvelope />}
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">Password</span>
            <Link href="/forget-password" className="text-brand-600 hover:underline">Forgot Password?</Link>
          </div>
          <div className="relative mb-5">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="h-12 w-full rounded-lg border border-gray-200 pl-11 pr-11 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <label className="mb-5 flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" /> Keep me signed in
          </label>

          <button className="w-full rounded-lg bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 border-t pt-6 text-center text-sm text-gray-700">
          New to YAZ CART? {authLink("/register", "Create an account")}
        </div>
        <div className="mt-5 flex justify-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><FaLock /> SSL Secured</span>
          <span className="flex items-center gap-1.5"><FaUsers /> {users.data ? users.data.totalUsers : "50K"}+ Users</span>
          <span className="flex items-center gap-1.5"><FaStar /> 4.9 Rating</span>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

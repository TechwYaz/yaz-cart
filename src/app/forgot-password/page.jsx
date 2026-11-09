"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaRegEnvelope, FaEnvelope, FaKey, FaLock, FaShieldAlt, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "@/lib/api";
import { AuthLayout, AuthCard, authLink } from "@/components/AuthShell";
import Logo from "@/components/Logo";

const inputClass = "h-12 w-full rounded-lg border border-gray-200 pl-11 pr-4 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20";
const button = "w-full rounded-lg bg-brand-600 py-3.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60";

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function run(fn) {
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  }

  function sendCode(e) {
    e.preventDefault();
    run(async () => {
      await api("auth/forgotPasswords", { method: "POST", body: { email } });
      toast.success("Reset code sent to your email");
      setStep(2);
    });
  }

  function verifyCode(e) {
    e.preventDefault();
    run(async () => {
      await api("auth/verifyResetCode", { method: "POST", body: { resetCode: code } });
      toast.success("Code verified");
      setStep(3);
    });
  }

  function resetPassword(e) {
    e.preventDefault();
    run(async () => {
      await api("auth/resetPassword", { method: "PUT", body: { email, newPassword } });
      toast.success("Password updated, please sign in");
      router.push("/login");
    });
  }

  const steps = [<FaEnvelope key="1" />, <FaKey key="2" />, <FaLock key="3" />];

  const left = (
    <div className="text-center">
      <div className="relative mx-auto flex h-96 max-w-xl items-center justify-center overflow-hidden rounded-3xl bg-brand-50 shadow">
        <span className="absolute left-8 top-8 h-24 w-24 rounded-full bg-brand-100/70"></span>
        <span className="absolute bottom-12 right-10 h-32 w-32 rounded-full bg-brand-100/70"></span>
        <span className="absolute right-24 top-20 h-16 w-16 rounded-full bg-brand-100"></span>
        <span className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white shadow-xl">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-100 text-4xl text-brand-600"><FaLock /></span>
        </span>
        <span className="absolute left-32 top-36 flex h-14 w-14 -rotate-12 items-center justify-center rounded-2xl bg-white text-xl text-brand-600 shadow-lg"><FaEnvelope /></span>
        <span className="absolute right-32 top-40 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-white text-xl text-brand-600 shadow-lg"><FaShieldAlt /></span>
      </div>
      <h2 className="mt-8 text-3xl font-bold">Reset Your Password</h2>
      <p className="mx-auto mt-3 max-w-md text-lg text-gray-600">Don&apos;t worry, it happens to the best of us. We&apos;ll help you get back into your account in no time.</p>
      <div className="mt-5 flex justify-center gap-6 text-sm text-gray-600">
        <span className="flex items-center gap-2"><FaEnvelope className="text-brand-600" /> Email Verification</span>
        <span className="flex items-center gap-2"><FaShieldAlt className="text-brand-600" /> Secure Reset</span>
        <span className="flex items-center gap-2"><FaLock className="text-brand-600" /> Encrypted</span>
      </div>
    </div>
  );

  return (
    <AuthLayout left={left}>
      <AuthCard>
        <div className="flex justify-center"><Logo size="text-3xl" /></div>
        <h1 className="mt-5 text-center text-2xl font-bold">Forgot Password?</h1>
        <p className="mb-6 mt-2 text-center text-gray-600">
          {step === 1 ? "No worries, we'll send you a reset code" : step === 2 ? "Enter the code we sent to your email" : "Choose a new password"}
        </p>

        <div className="mb-8 flex items-center justify-center">
          {steps.map((icon, i) => (
            <div key={i} className="flex items-center">
              <span className={"flex h-10 w-10 items-center justify-center rounded-full text-xs " + (step >= i + 1 ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400")}>{icon}</span>
              {i < steps.length - 1 && <span className={"h-0.5 w-14 " + (step > i + 1 ? "bg-brand-600" : "bg-gray-200")}></span>}
            </div>
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={sendCode}>
            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-semibold">Email Address</span>
              <span className="relative block">
                <FaRegEnvelope className="absolute left-4 top-4 text-gray-400" />
                <input className={inputClass} type="email" required placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </span>
            </label>
            <button className={button} disabled={loading}>{loading ? "Sending..." : "Send Reset Code"}</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyCode}>
            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-semibold">Reset Code</span>
              <span className="relative block">
                <FaKey className="absolute left-4 top-4 text-gray-400" />
                <input className={inputClass} required placeholder="Enter the 6 digit code" value={code} onChange={(e) => setCode(e.target.value)} />
              </span>
            </label>
            <button className={button} disabled={loading}>{loading ? "Checking..." : "Verify Code"}</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword}>
            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-semibold">New Password</span>
              <span className="relative block">
                <FaLock className="absolute left-4 top-4 text-gray-400" />
                <input className={inputClass + " pr-11"} type={showPassword ? "text" : "password"} required minLength={6} placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <button type="button" className="absolute right-4 top-4 text-gray-400" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
              </span>
            </label>
            <button className={button} disabled={loading}>{loading ? "Saving..." : "Reset Password"}</button>
          </form>
        )}

        <Link href="/login" className="mt-5 flex items-center justify-center gap-2 text-sm text-brand-600 hover:underline"><FaArrowLeft className="text-xs" /> Back to Sign In</Link>
        <p className="mt-6 border-t pt-6 text-center text-sm text-gray-700">Remember your password? {authLink("/login", "Sign In")}</p>
      </AuthCard>
    </AuthLayout>
  );
}

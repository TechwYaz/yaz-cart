import Link from "next/link";
import { FaGoogle, FaFacebook } from "react-icons/fa";

export function SocialButtons({ short = false }) {
  return (
    <div className={short ? "grid grid-cols-2 gap-3" : "space-y-3"}>
      <button type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-3 text-sm font-semibold hover:bg-gray-50">
        <FaGoogle className="text-red-500" /> {short ? "Google" : "Continue with Google"}
      </button>
      <button type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-3 text-sm font-semibold hover:bg-gray-50">
        <FaFacebook className="text-blue-600" /> {short ? "Facebook" : "Continue with Facebook"}
      </button>
    </div>
  );
}

export function Divider({ text }) {
  return (
    <div className="my-6 flex items-center gap-4 text-xs text-gray-500">
      <span className="h-px flex-1 bg-gray-200"></span>
      <span>{text}</span>
      <span className="h-px flex-1 bg-gray-200"></span>
    </div>
  );
}

export function AuthCard({ children }) {
  return <div className="rounded-2xl bg-white p-8 shadow-xl">{children}</div>;
}

export function AuthLayout({ left, children, top = false }) {
  return (
    <div className={"grid gap-12 py-16 lg:grid-cols-2 " + (top ? "items-start" : "items-center")}>
      <div>{left}</div>
      <div>{children}</div>
    </div>
  );
}

export function Field({ label, error, icon, right, ...props }) {
  return (
    <label className="mb-5 block">
      <span className="mb-2 block text-sm font-semibold text-gray-800">{label}</span>
      <span className="relative block">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          className={"h-12 w-full rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 " + (icon ? "pl-11 " : "pl-4 ") + (right ? "pr-11" : "pr-4")}
          {...props}
        />
        {right && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{right}</span>}
      </span>
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}

export function authLink(href, text) {
  return <Link href={href} className="font-semibold text-brand-600 hover:underline">{text}</Link>;
}

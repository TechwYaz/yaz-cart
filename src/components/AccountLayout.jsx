"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaMapMarkerAlt, FaCog, FaChevronRight } from "react-icons/fa";
import { useRequireAuth, Loader } from "./ui";
import PageHeader from "./PageHeader";

const tabs = [
  { href: "/profile/addresses", label: "My Addresses", icon: <FaMapMarkerAlt /> },
  { href: "/profile/settings", label: "Settings", icon: <FaCog /> },
];

export default function AccountLayout({ children }) {
  const isLoggedIn = useRequireAuth();
  const path = usePathname();

  if (!isLoggedIn) return <Loader />;

  return (
    <>
      <PageHeader
        title="My Account"
        subtitle="Manage your addresses and account settings"
        icon={<FaUser />}
        crumbs={[{ label: "My Account" }]}
      />
      <div className="grid gap-8 pb-12 lg:grid-cols-[288px_1fr]">
        <aside className="h-fit overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <h2 className="border-b px-4 py-4 font-bold">My Account</h2>
          <div className="space-y-1 p-2">
            {tabs.map((t) => {
              const active = path === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={"flex items-center justify-between rounded-xl px-3 py-3 " + (active ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:bg-gray-50")}
                >
                  <span className="flex items-center gap-3">
                    <span className={"flex h-9 w-9 items-center justify-center rounded-lg text-sm " + (active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500")}>{t.icon}</span>
                    {t.label}
                  </span>
                  <FaChevronRight className="text-xs text-gray-400" />
                </Link>
              );
            })}
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </>
  );
}

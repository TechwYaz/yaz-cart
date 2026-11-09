import Link from "next/link";

export default function PageTop({ crumbs = [], icon, iconClass = "bg-brand-600 text-white", title, subtitle, right }) {
  return (
    <div className="pb-6 pt-5">
      <p className="mb-5 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        {crumbs.map((c) => (
          <span key={c.label}>
            <span className="mx-2">/</span>
            {c.href ? <Link href={c.href} className="hover:text-brand-600">{c.label}</Link> : <span className="text-gray-900">{c.label}</span>}
          </span>
        ))}
      </p>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <span className={"flex h-12 w-12 items-center justify-center rounded-xl text-xl shadow-lg " + iconClass}>{icon}</span>
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          </div>
          {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}

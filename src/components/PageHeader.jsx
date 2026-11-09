import Link from "next/link";

export default function PageHeader({ title, subtitle, crumbs = [], icon, image, color = "green" }) {
  const gradient =
    color === "purple"
      ? "from-[#8437ff] to-[#bb76ff]"
      : "from-[#16a34a] to-[#4ade80]";

  return (
    <div className={"full-bleed mb-10 bg-gradient-to-br text-white " + gradient}>
      <div className="container-x pb-[60px] pt-16">
        <p className="mb-6 text-sm text-white/80">
          <Link href="/" className="hover:text-white">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              <span className="mx-2">/</span>
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </p>
        <div className="flex items-center gap-5">
          {(icon || image) && (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/25 text-3xl shadow-lg">
              {image ? (
                <img src={image} alt="" className="h-12 w-12 object-contain" />
              ) : icon}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold">{title}</h1>
            {subtitle && <p className="mt-1 text-white/90">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

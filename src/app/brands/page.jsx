"use client";
import { useState } from "react";
import Link from "next/link";
import { FaTags } from "react-icons/fa";
import { useFetch } from "@/lib/useFetch";
import { Loader, ErrorMsg, Pagination } from "@/components/ui";
import PageHeader from "@/components/PageHeader";

export default function Brands() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch("brands?limit=24&page=" + page);

  return (
    <>
      <PageHeader
        title="Top Brands"
        subtitle="Shop from your favorite brands"
        icon={<FaTags />}
        color="purple"
        crumbs={[{ label: "Brands" }]}
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMsg>{error}</ErrorMsg>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
            {data.data.map((brand) => (
              <Link
                key={brand._id}
                href={"/brands/" + brand._id}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-36 items-center justify-center rounded-xl bg-gray-50 p-4">
                  <img src={brand.image} alt={brand.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                </div>
                <p className="mt-5 mb-3 text-center text-sm font-bold">{brand.name}</p>
              </Link>
            ))}
          </div>
          <Pagination meta={data.metadata} onPage={setPage} />
        </>
      )}
    </>
  );
}

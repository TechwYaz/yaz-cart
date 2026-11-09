"use client";
import Link from "next/link";
import { FaLayerGroup } from "react-icons/fa";
import { useFetch } from "@/lib/useFetch";
import { Loader, ErrorMsg } from "@/components/ui";
import PageHeader from "@/components/PageHeader";

export default function Categories() {
  const categories = useFetch("categories");

  return (
    <>
      <PageHeader
        title="All Categories"
        subtitle="Browse our wide range of product categories"
        icon={<FaLayerGroup />}
        crumbs={[{ label: "Categories" }]}
      />

      {categories.loading ? (
        <Loader />
      ) : categories.error ? (
        <ErrorMsg>{categories.error}</ErrorMsg>
      ) : (
        <div className="grid grid-cols-2 gap-6 pb-8 md:grid-cols-3 lg:grid-cols-5">
          {categories.data.data.map((cat) => (
            <Link
              key={cat._id}
              href={"/categories/" + cat._id}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <img src={cat.image} alt={cat.name} className="h-44 w-full rounded-lg object-cover" loading="lazy" />
              <p className="mt-4 text-center font-bold text-gray-900">{cat.name}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

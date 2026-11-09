"use client";
import { use } from "react";
import Link from "next/link";
import { FaArrowLeft, FaFolderOpen } from "react-icons/fa";
import { useFetch } from "@/lib/useFetch";
import { Loader, ErrorMsg } from "@/components/ui";
import PageHeader from "@/components/PageHeader";

export default function CategoryDetails({ params }) {
  const { id } = use(params);
  const { data, loading, error } = useFetch("categories/" + id);
  const subs = useFetch("categories/" + id + "/subcategories");

  if (loading) return <Loader />;
  if (error) return <ErrorMsg>{error}</ErrorMsg>;

  const category = data.data;
  const subList = subs.data ? subs.data.data : [];

  return (
    <>
      <PageHeader
        title={category.name}
        subtitle="Choose a subcategory to browse products"
        image={category.image}
        crumbs={[{ label: "Categories", href: "/categories" }, { label: category.name }]}
      />

      <Link href="/categories" className="mb-5 inline-flex items-center gap-3 text-gray-600 hover:text-brand-600">
        <FaArrowLeft /> Back to Categories
      </Link>
      <h2 className="mb-6 font-bold">{subList.length} Subcategories in {category.name}</h2>

      {subs.loading ? (
        <Loader />
      ) : (
        <div className="grid gap-6 pb-8 sm:grid-cols-2 lg:grid-cols-4">
          {subList.map((sub) => (
            <Link
              key={sub._id}
              href={"/subcategories/" + sub._id}
              className="min-h-[205px] rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600">
                <FaFolderOpen />
              </span>
              <p className="mt-5 text-lg font-bold leading-7 text-gray-900">{sub.name}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

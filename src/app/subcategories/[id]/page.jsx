"use client";
import { use } from "react";
import { FaFolderOpen } from "react-icons/fa";
import { useFetch } from "@/lib/useFetch";
import { Loader, ErrorMsg } from "@/components/ui";
import ProductsListing from "@/components/ProductsListing";
import PageHeader from "@/components/PageHeader";

export default function SubCategoryDetails({ params }) {
  const { id } = use(params);
  const { data, loading, error } = useFetch("subcategories/" + id);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg>{error}</ErrorMsg>;

  const sub = data.data;

  return (
    <>
      <PageHeader
        title={sub.name}
        subtitle="Products in this subcategory"
        icon={<FaFolderOpen />}
        crumbs={[
          { label: "Categories", href: "/categories" },
          { label: "Category", href: "/categories/" + sub.category },
          { label: sub.name },
        ]}
      />
      <ProductsListing extra={"subcategory=" + id} />
    </>
  );
}

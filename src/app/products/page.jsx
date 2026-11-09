"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductsListing from "@/components/ProductsListing";
import { FaBoxOpen } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

function ProductsContent() {
  const params = useSearchParams();
  const keyword = params.get("keyword") || "";

  return (
    <>
      <PageHeader
        title={keyword ? 'Results for "' + keyword + '"' : "All Products"}
        subtitle="Explore our complete product collection"
        icon={<FaBoxOpen />}
        crumbs={[{ label: "All Products" }]}
      />
      <ProductsListing key={keyword} keyword={keyword} showFilters />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}

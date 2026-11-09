"use client";
import { use } from "react";
import { useFetch } from "@/lib/useFetch";
import { Loader, ErrorMsg } from "@/components/ui";
import ProductsListing from "@/components/ProductsListing";
import PageHeader from "@/components/PageHeader";

export default function BrandDetails({ params }) {
  const { id } = use(params);
  const { data, loading, error } = useFetch("brands/" + id);

  if (loading) return <Loader />;
  if (error) return <ErrorMsg>{error}</ErrorMsg>;

  const brand = data.data;

  return (
    <>
      <PageHeader
        title={brand.name}
        subtitle={"All products from " + brand.name}
        image={brand.image}
        color="purple"
        crumbs={[{ label: "Brands", href: "/brands" }, { label: brand.name }]}
      />
      <ProductsListing extra={"brand=" + id} />
    </>
  );
}

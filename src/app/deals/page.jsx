"use client";
import ProductsListing from "@/components/ProductsListing";
import { FaFire } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

export default function Deals() {
  return (
    <>
      <PageHeader icon={<FaFire />} title="Today's Deals" subtitle="Best selling products at great prices" crumbs={[{ label: "Deals" }]} />
      <ProductsListing extra="sort=-sold" />
    </>
  );
}

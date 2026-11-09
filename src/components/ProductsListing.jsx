"use client";
import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { Loader, ErrorMsg, Pagination } from "./ui";
import { ProductGrid } from "./ProductCard";

export default function ProductsListing({ extra = "", keyword = "", showFilters = false }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const categories = useFetch(showFilters ? "categories" : null);
  const brands = useFetch(showFilters ? "brands?limit=100" : null);
  const subCategories = useFetch(showFilters ? "subcategories?limit=100" : null);

  let query = "page=" + page + "&limit=20";
  if (extra) query += "&" + extra;
  if (keyword) query += "&keyword=" + encodeURIComponent(keyword);
  if (sort) query += "&sort=" + sort;
  if (minPrice) query += "&price[gte]=" + minPrice;
  if (maxPrice) query += "&price[lte]=" + maxPrice;
  if (category) query += "&category[in]=" + category;
  if (brand) query += "&brand=" + brand;
  if (subCategory) query += "&subcategory=" + subCategory;

  const { data, loading, error } = useFetch("products?" + query);

  function changeFilter(setter) {
    return function (e) {
      setter(e.target.value);
      setPage(1);
    };
  }

  function changePage(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const select = "h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-brand-600";

  let content;
  if (loading) {
    content = <Loader />;
  } else if (error) {
    content = <ErrorMsg>{error}</ErrorMsg>;
  } else if (!data || data.data.length === 0) {
    content = <p className="py-16 text-center text-gray-500">No products found.</p>;
  } else {
    content = (
      <>
        <ProductGrid items={data.data} />
        <Pagination meta={data.metadata} onPage={changePage} />
      </>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{data ? "Showing " + data.data.length + " of " + data.results + " products" : " "}</p>

        {showFilters && (
          <div className="flex flex-wrap gap-2">
            <select className={select} value={category} onChange={changeFilter(setCategory)}>
              <option value="">All categories</option>
              {categories.data && categories.data.data.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select className={select} value={subCategory} onChange={changeFilter(setSubCategory)}>
              <option value="">All subcategories</option>
              {subCategories.data && subCategories.data.data.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <select className={select} value={brand} onChange={changeFilter(setBrand)}>
              <option value="">All brands</option>
              {brands.data && brands.data.data.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
            <input className={select + " w-24"} type="number" placeholder="Min" value={minPrice} onChange={changeFilter(setMinPrice)} />
            <input className={select + " w-24"} type="number" placeholder="Max" value={maxPrice} onChange={changeFilter(setMaxPrice)} />
            <select className={select} value={sort} onChange={changeFilter(setSort)}>
              <option value="">Sort by</option>
              <option value="price">Price: low to high</option>
              <option value="-price">Price: high to low</option>
              <option value="-ratingsAverage">Top rated</option>
              <option value="-sold">Best selling</option>
            </select>
          </div>
        )}
      </div>
      {content}
    </div>
  );
}

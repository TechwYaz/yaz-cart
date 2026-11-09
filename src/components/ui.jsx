"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { useApp } from "@/context/AppContext";

export function Loader() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-600"></div>
    </div>
  );
}

export function ErrorMsg({ children }) {
  return <p className="my-10 text-center text-red-600">{children}</p>;
}

export function Stars({ value }) {
  const rounded = Math.round(value || 0);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<FaStar key={i} className={i <= rounded ? "text-amber-400" : "text-gray-300"} />);
  }
  return <span className="inline-flex gap-0.5 text-xs">{stars}</span>;
}

export function PageTitle({ children, sub }) {
  return (
    <div className="my-8">
      <h1 className="text-3xl font-bold">{children}</h1>
      {sub && <p className="mt-1 text-gray-500">{sub}</p>}
    </div>
  );
}

export function Pagination({ meta, onPage }) {
  if (!meta || meta.numberOfPages <= 1) return null;

  const current = meta.currentPage;
  const last = meta.numberOfPages;

  const pages = [];
  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || Math.abs(i - current) <= 2) pages.push(i);
  }

  return (
    <div className="my-8 flex flex-wrap justify-center gap-1">
      <button className="btn-outline" disabled={current === 1} onClick={() => onPage(current - 1)}>
        Prev
      </button>
      {pages.map((p, index) => (
        <span key={p} className="flex gap-1">
          {index > 0 && p - pages[index - 1] > 1 && <span className="px-1 py-2">...</span>}
          <button className={p === current ? "btn-primary" : "btn-outline"} onClick={() => onPage(p)}>
            {p}
          </button>
        </span>
      ))}
      <button className="btn-outline" disabled={current === last} onClick={() => onPage(current + 1)}>
        Next
      </button>
    </div>
  );
}

export function useRequireAuth() {
  const { token, ready } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (ready && !token) router.replace("/login");
  }, [ready, token, router]);

  return ready && !!token;
}

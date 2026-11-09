"use client";
import { useEffect, useState } from "react";
import { api } from "./api";

export function useFetch(path, auth = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    api(path, { auth })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path, auth]);

  return { data, loading, error };
}

"use client";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, decodeToken } from "@/lib/api";

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

function formatCart(res) {
  return {
    cartId: res.cartId || (res.data && res.data._id),
    count: res.numOfCartItems || 0,
    total: res.data ? res.data.totalCartPrice : 0,
    items: res.data ? res.data.products : [],
  };
}

async function cartRequest(path, options = {}) {
  try {
    const res = await api(path, { ...options, auth: true, version: 2 });
    if (res && res.data && Array.isArray(res.data.products)) return res;
    if (options.method === "DELETE" && !path.includes("/")) return res;
  } catch (err) {
  }
  return api(path, { ...options, auth: true });
}

const emptyCart = { cartId: null, count: 0, total: 0, items: [] };

export function AppProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  async function loadCart() {
    try {
      const res = await cartRequest("cart");
      setCart(formatCart(res));
    } catch (err) {
      setCart(emptyCart);
    }
  }

  async function loadWishlist() {
    try {
      const res = await api("wishlist", { auth: true });
      setWishlist(res.data || []);
    } catch (err) {
      setWishlist([]);
    }
  }

  useEffect(() => {
    async function checkLogin() {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setReady(true);
        return;
      }
      try {
        const res = await api("auth/verifyToken", { auth: true });
        setToken(savedToken);
        setUser({ id: res.decoded.id, name: res.decoded.name || localStorage.getItem("name") || "", role: res.decoded.role });
        loadCart();
        loadWishlist();
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
      }
      setReady(true);
    }
    checkLogin();
  }, []);

  function login(newToken, name) {
    const decoded = decodeToken(newToken);
    localStorage.setItem("token", newToken);
    if (name) localStorage.setItem("name", name);
    setToken(newToken);
    setUser({ id: decoded && decoded.id, name: name || "" });
    loadCart();
    loadWishlist();
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken(null);
    setUser(null);
    setCart(null);
    setWishlist([]);
  }

  async function addToCart(productId) {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      await cartRequest("cart", { method: "POST", body: { productId } });
      await loadCart();
      toast.success("Product added to cart");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function removeFromCart(productId) {
    try {
      const res = await cartRequest("cart/" + productId, { method: "DELETE" });
      setCart(formatCart(res));
      toast.success("Product removed");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function updateCount(productId, count) {
    if (count < 1) return;
    try {
      const res = await cartRequest("cart/" + productId, { method: "PUT", body: { count } });
      setCart(formatCart(res));
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function clearCart() {
    try {
      await cartRequest("cart", { method: "DELETE" });
      setCart(emptyCart);
      toast.success("Cart cleared");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function applyCoupon(couponName) {
    try {
      await api("cart/applyCoupon", { method: "PUT", body: { couponName }, auth: true, version: 2 });
      await loadCart();
      toast.success("Coupon applied");
    } catch (err) {
      toast.error(err.message);
    }
  }

  function inWishlist(productId) {
    return wishlist.some((item) => item._id === productId);
  }

  async function toggleWishlist(productId) {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      if (inWishlist(productId)) {
        await api("wishlist/" + productId, { method: "DELETE", auth: true });
        toast.success("Removed from wishlist");
      } else {
        await api("wishlist", { method: "POST", body: { productId }, auth: true });
        toast.success("Added to wishlist");
      }
      await loadWishlist();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const value = {
    token, user, ready, login, logout,
    cart, loadCart, addToCart, removeFromCart, updateCount, clearCart, applyCoupon,
    wishlist, inWishlist, toggleWishlist,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

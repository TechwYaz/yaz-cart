"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaHome, FaChevronRight, FaMinus, FaPlus, FaShoppingCart, FaBolt, FaRegHeart, FaHeart, FaShareAlt, FaTruck, FaUndo, FaShieldAlt } from "react-icons/fa";
import { useFetch } from "@/lib/useFetch";
import { useApp } from "@/context/AppContext";
import { Loader, ErrorMsg, Stars } from "@/components/ui";
import ProductTabs from "@/components/ProductTabs";
import RelatedProducts from "@/components/RelatedProducts";

export default function ProductDetails({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart, toggleWishlist, inWishlist, token } = useApp();

  const { data, loading, error } = useFetch("products/" + id);
  const product = data ? data.data : null;

  const related = useFetch(product ? "products?category[in]=" + product.category._id + "&limit=10" : null);

  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (loading) return <Loader />;
  if (error || !product) return <ErrorMsg>{error || "Product not found"}</ErrorMsg>;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageCover];
  const price = product.priceAfterDiscount || product.price;
  const liked = inWishlist(product._id);
  const sub = product.subcategory && product.subcategory[0];

  async function addMany() {
    for (let i = 0; i < quantity; i++) {
      await addToCart(product._id);
    }
  }

  async function shareProduct() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied");
    } catch (err) {
      toast.error("Could not copy the link");
    }
  }

  async function buyNow() {
    if (!token) {
      router.push("/login");
      return;
    }
    await addMany();
    router.push("/checkout");
  }

  return (
    <>
      <nav className="flex flex-wrap items-center gap-3 py-4 text-sm text-gray-500">
        <Link href="/" className="flex items-center gap-2 hover:text-brand-600"><FaHome /> Home</Link>
        <FaChevronRight className="text-[10px]" />
        <Link href={"/categories/" + product.category._id} className="hover:text-brand-600">{product.category.name}</Link>
        {sub && (
          <>
            <FaChevronRight className="text-[10px]" />
            <Link href={"/subcategories/" + sub._id} className="hover:text-brand-600">{sub.name}</Link>
          </>
        )}
        <FaChevronRight className="text-[10px]" />
        <span className="line-clamp-1 max-w-xs text-gray-800">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[2fr_5fr]">
        <div className="h-fit rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <img src={images[mainImage]} alt={product.title} className="h-96 w-full object-contain" />
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {images.map((img, index) => (
              <img
                key={img}
                src={img}
                alt=""
                onClick={() => setMainImage(index)}
                className={"h-24 w-24 cursor-pointer object-contain p-1 " + (index === mainImage ? "border-2 border-brand-600" : "border-2 border-transparent")}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href={"/categories/" + product.category._id} className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{product.category.name}</Link>
            {product.brand && (
              <Link href={"/brands/" + product.brand._id} className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">{product.brand.name}</Link>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight">{product.title}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <Stars value={product.ratingsAverage} />
            <span>{product.ratingsAverage} ({product.ratingsQuantity} reviews)</span>
          </div>

          <p className="mt-4 text-3xl font-bold">
            {price} EGP
            {product.priceAfterDiscount && <span className="ml-3 text-lg font-normal text-gray-400 line-through">{product.price} EGP</span>}
          </p>

          <p className="mt-4">
            {product.quantity > 0 ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
                <span className="h-2 w-2 rounded-full bg-brand-600"></span> In Stock
              </span>
            ) : (
              <span className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-600">Out of Stock</span>
            )}
          </p>

          <hr className="mt-5" />
          <p className="mt-5 leading-7 text-gray-600">{product.description}</p>

          <p className="mt-6 text-sm text-gray-700">Quantity</p>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-gray-300">
              <button className="px-5 py-4 text-gray-500 hover:text-brand-600" onClick={() => setQuantity(Math.max(1, quantity - 1))}><FaMinus /></button>
              <span className="w-12 text-center">{quantity}</span>
              <button className="px-5 py-4 text-gray-500 hover:text-brand-600" onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}><FaPlus /></button>
            </div>
            <span className="text-sm text-gray-600">{product.quantity} available</span>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg bg-gray-50 px-5 py-4">
            <span className="text-gray-700">Total Price:</span>
            <span className="text-2xl font-bold text-brand-600">{(price * quantity).toFixed(2)} EGP</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button className="flex items-center justify-center gap-3 rounded-lg bg-brand-600 py-4 font-semibold text-white hover:bg-brand-700" onClick={addMany}>
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="flex items-center justify-center gap-3 rounded-lg bg-[#101828] py-4 font-semibold text-white hover:bg-black" onClick={buyNow}>
              <FaBolt /> Buy Now
            </button>
          </div>

          <div className="mt-3 flex gap-3">
            <button className="flex flex-1 items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 text-gray-700 hover:bg-gray-50" onClick={() => toggleWishlist(product._id)}>
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />} {liked ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
            <button className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={shareProduct} aria-label="share">
              <FaShareAlt />
            </button>
          </div>

          <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-3">
            {[
              { icon: <FaTruck />, title: "Free Delivery", text: "Orders over 500 EGP" },
              { icon: <FaUndo />, title: "14 Days Return", text: "Money back" },
              { icon: <FaShieldAlt />, title: "Secure Payment", text: "100% Protected" },
            ].map((t) => (
              <div key={t.title} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">{t.icon}</span>
                <div className="text-sm"><p className="font-medium">{t.title}</p><p className="text-xs text-gray-500">{t.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductTabs product={product} />

      {related.data && related.data.data.length > 1 && (
        <RelatedProducts items={related.data.data.filter((p) => p._id !== id)} />
      )}
    </>
  );
}

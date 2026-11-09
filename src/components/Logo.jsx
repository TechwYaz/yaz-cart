import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

export default function Logo({ size = "text-2xl" }) {
  return (
    <Link href="/" className={"flex shrink-0 items-center gap-2 whitespace-nowrap font-extrabold tracking-tight " + size}>
      <FaShoppingCart className="text-brand-600" />
      <span>
        <span className="text-gray-900">YAZ</span> <span className="text-brand-600">CART</span>
      </span>
    </Link>
  );
}

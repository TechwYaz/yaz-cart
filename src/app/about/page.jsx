import StaticPage from "@/components/StaticPage";

export default function About() {
  return (
    <StaticPage title="About Us" subtitle="Who we are">
      <p>
        YAZ CART is an online store where you can find fashion, electronics, beauty products and much more from the
        best brands, all in one place.
      </p>
      <p>
        This project was built with Next.js as an e-commerce assignment. It uses the Route Academy e-commerce API for
        products, categories, brands, cart, wishlist, orders and payments.
      </p>
    </StaticPage>
  );
}

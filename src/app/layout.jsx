import { Exo_2 } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const exo = Exo_2({ subsets: ["latin"], variable: "--font-exo" });

export const metadata = {
  title: "YAZ CART",
  description: "YAZ CART - online shopping store built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${exo.variable} flex min-h-screen flex-col antialiased`}>
        <AppProvider>
          <Navbar />
          <main className="container-x w-full flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </AppProvider>
      </body>
    </html>
  );
}

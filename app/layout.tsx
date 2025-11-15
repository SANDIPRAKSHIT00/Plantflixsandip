"use client";

import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import { CartProvider } from "./context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/userDashboard");

  return (
    <html lang="en">
      <body className="bg-green-50 text-gray-900">
        <CartProvider>
          {!hideNavbar && <Navbar />}
          <main className="min-h-screen">{children}</main>
          {!hideNavbar && <Footer />}
        </CartProvider>
      </body>
    </html>
  );
}

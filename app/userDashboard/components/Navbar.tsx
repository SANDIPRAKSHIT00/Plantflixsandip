"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Sun,
  Moon,
  User,
  X,
  Plus,
  Minus,
  Menu,
} from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/");
  };

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const navLinks = [
    { name: "Home", href: "/userDashboard" },
    { name: "Plants", href: "/userDashboard/plants" },
    { name: "About", href: "/userDashboard/about" },
    { name: "Contact", href: "/userDashboard/contact" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-3 bg-teal-50 dark:bg-teal-900 shadow-lg sticky top-0 z-50 transition-colors">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-teal-700 dark:text-teal-200"
        >
          🌿 Plantflix
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center text-teal-700 dark:text-teal-200 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${pathname === link.href
                ? "text-teal-900 dark:text-teal-50 font-semibold border-b-2 border-teal-900 dark:border-teal-50"
                : "hover:text-teal-900 dark:hover:text-teal-50"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3 md:gap-4 relative">
          {/* Dark Mode */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart */}
          <button
            onClick={() => {
              setShowCart(!showCart);
              setShowUserMenu(false);
              setShowMobileMenu(false);
            }}
            className="relative p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors"
          >
            <ShoppingCart size={22} className="text-teal-700 dark:text-teal-200" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="hidden md:block relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowCart(false);
                setShowMobileMenu(false);
              }}
              className="p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors"
            >
              <User size={20} className="text-teal-700 dark:text-teal-200" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-teal-50 dark:bg-teal-800 shadow-xl rounded-xl overflow-hidden z-50 border border-teal-300 dark:border-teal-700 transition-all">
                <Link
                  href="/userDashboard/profile"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-teal-700 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User size={16} /> Profile
                </Link>

                <Link
                  href="/userDashboard/myOrders"
                  className="flex items-center gap-2 px-4 py-3 text-sm text-teal-700 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-700 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <ShoppingCart size={16} /> My Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 transition-colors"
                >
                  <X size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setShowMobileMenu(true);
              setShowCart(false);
              setShowUserMenu(false);
            }}
            className="md:hidden p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors"
          >
            <Menu size={24} className="text-teal-700 dark:text-teal-200" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-teal-50 dark:bg-teal-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${showMobileMenu ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-teal-300 dark:border-teal-700">
          <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-200">
            Menu
          </h2>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 rounded-full hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col mt-6 space-y-4 px-6 text-teal-700 dark:text-teal-200 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setShowMobileMenu(false)}
              className={`transition-colors ${pathname === link.href
                ? "text-teal-900 dark:text-teal-50 font-semibold border-b-2 border-teal-900 dark:border-teal-50"
                : "hover:text-teal-900 dark:hover:text-teal-50"
                }`}
            >
              {link.name}
            </Link>
          ))}

          <hr className="border-teal-300 dark:border-teal-700" />

          <Link
            href="/userDashboard/profile"
            onClick={() => setShowMobileMenu(false)}
            className="hover:text-teal-900 dark:hover:text-teal-50 transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/userDashboard/myOrders"
            onClick={() => setShowMobileMenu(false)}
            className="hover:text-teal-900 dark:hover:text-teal-50 transition-colors"
          >
            My Orders
          </Link>

          <button
            onClick={() => {
              handleLogout();
              setShowMobileMenu(false);
            }}
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Cart Popup */}
      {showCart && (
        <div className="fixed right-4 top-20 w-80 bg-teal-50 dark:bg-teal-800 shadow-2xl rounded-xl p-4 z-50 transition-all">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-teal-700 dark:text-teal-200">
              Your Cart
            </h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-teal-400 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-teal-600 dark:text-teal-300 text-sm">
              No items in cart.
            </p>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-teal-200 dark:border-teal-700 pb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium dark:text-teal-50 text-sm">
                          {item.name}
                        </p>
                        <p className="text-sm text-teal-700 dark:text-teal-300">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1)
                            updateQuantity(item.id, item.quantity - 1);
                          else removeFromCart(item.id);
                        }}
                        className="p-1 bg-teal-100 dark:bg-teal-700 rounded hover:bg-teal-200 dark:hover:bg-teal-600 transition-colors"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="text-sm font-medium dark:text-teal-50">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 bg-teal-100 dark:bg-teal-700 rounded hover:bg-teal-200 dark:hover:bg-teal-600 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between text-sm font-medium text-teal-700 dark:text-teal-200">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
              </div>

              <button
                onClick={() => {
                  setShowCart(false);
                  router.push("/userDashboard/checkout");
                }}
                className="mt-3 w-full bg-teal-700 text-white py-2 rounded-md hover:bg-teal-800 transition-colors"
              >
                Go to Checkout
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

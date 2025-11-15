import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-green-300 to-green-400 text-center text-gray-800 py-6 px-4  shadow-inner overflow-hidden w-full">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-20 h-24 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-300 rounded-full opacity-15 animate-pulse"></div>

      {/* Footer content */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="text-gray-700 dark:text-gray-100 font-medium mb-3 text-sm md:text-base">
          © 2025 Plantflix. All rights reserved. Developed by{" "}
          <span className="font-semibold text-green-900 dark:text-green-300">
            SS SANDEEP
          </span>
        </p>

        <div className="flex justify-center gap-6 mt-2">
          <a
            href="#"
            className="p-2 rounded-full bg-white text-green-600 hover:bg-green-600 hover:text-white transition shadow-md"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-white text-green-600 hover:bg-green-600 hover:text-white transition shadow-md"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-white text-green-600 hover:bg-green-600 hover:text-white transition shadow-md"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

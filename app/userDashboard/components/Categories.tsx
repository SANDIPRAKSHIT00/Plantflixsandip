"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";

export default function Categories() {
  return (
    <section className="relative py-16 bg-green-50 dark:bg-green-900 overflow-hidden w-full">

      {/* Decorative floating circles */}
      <div className="absolute top-0 left-0 w-36 h-36 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-56 h-56 bg-green-300 rounded-full opacity-15 animate-pulse"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400 drop-shadow-lg">
          🌿 Explore Our Plant Collections
        </h2>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

          {/* Indoor */}
          <Link
            href=""
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <Leaf className="w-10 h-10 text-green-500 mb-3" />
            <span className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Indoor Plants
            </span>
          </Link>

          {/* Outdoor */}
          <Link
            href=""
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <Leaf className="w-10 h-10 text-green-500 mb-3" />
            <span className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Outdoor Plants
            </span>
          </Link>

          {/* Flowering */}
          <Link
            href=""
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <Leaf className="w-10 h-10 text-green-500 mb-3" />
            <span className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Flowering Plants
            </span>
          </Link>

          {/* Succulents */}
          <Link
            href="/categories/succulents"
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <Leaf className="w-10 h-10 text-green-500 mb-3" />
            <span className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Succulents
            </span>
          </Link>

          {/* Medicinal */}
          <Link
            href=""
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <Leaf className="w-10 h-10 text-green-500 mb-3" />
            <span className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              Medicinal Plants
            </span>
          </Link>

        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { supabase } from "./lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.from("test").select("*");
      console.log("Supabase connected ✅", data, error);
    }
    testConnection();
  }, []);

  const handleShopNow = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col overflow-x-hidden">
      <main className="flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 md:p-8 gap-6 md:gap-10">
        
        {/* Left Text Section */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Bring plant 🌿
            <br />
            therapy
            <br />
            indoors
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Top quality houseplant seeds, bulbs and kits for every gardener.
          </p>

          <button
            onClick={handleShopNow}
            className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold transition"
          >
            Shop Now!
          </button>

          <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-gray-600">
            <span className="text-yellow-500 text-lg sm:text-xl">★ ★ ★ ★ ★</span>
            <span className="text-sm sm:text-base">1000+ happy gardeners</span>
          </div>
        </div>

        {/* Right Image Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md lg:max-w-none mt-8 lg:mt-0">
          <Image
            src="/image/4.jpg"
            alt="Houseplant"
            width={500}
            height={400}
            className="w-full h-48 sm:h-56 object-cover rounded-lg shadow-lg hover:scale-105 transition"
          />
          <Image
            src="/image/6.jpg"
            alt="Succulent"
            width={500}
            height={400}
            className="w-full h-48 sm:h-56 object-cover rounded-lg shadow-lg hover:scale-105 transition"
          />
          <Image
            src="/image/6.jpg"
            alt="Monstera"
            width={500}
            height={400}
            className="w-full h-48 sm:h-56 object-cover rounded-lg shadow-lg hover:scale-105 transition"
          />
          <Image
            src="/image/7.jpg"
            alt="Flowering Plant"
            width={500}
            height={400}
            className="w-full h-48 sm:h-56 object-cover rounded-lg shadow-lg hover:scale-105 transition"
          />
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 text-center bg-green-100 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-700">
          Start Your Green Journey Today!
        </h2>
        <p className="mb-6 text-gray-700 text-sm sm:text-base">
          Join Plantflix to explore, order, and grow your plant collection.
        </p>
        <Link
          href="/auth/login"
          className="bg-green-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition text-sm sm:text-base"
        >
          Get Started
        </Link>
      </section>

      {/* Featured Plants */}
      <section className="py-16 sm:py-20 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-green-700">
            Featured Plants
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden">
              <Image
                src="/image/7.jpg"
                alt="Aloe Vera"
                width={500}
                height={400}
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-lg sm:text-xl mb-2">Aloe Vera</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Easy to care succulent for indoor and outdoor decoration.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden">
              <Image
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVbKQxqi0Z5yH_5i5TZBvch1As9pSKSntPdA&s"
                alt="Fiddle Leaf Fig"
                width={500}
                height={400}
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-lg sm:text-xl mb-2">
                  Fiddle Leaf Fig
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Stylish indoor plant that brightens up your living space.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden">
              <Image
                src="/image/7.jpg"
                alt="Peace Lily"
                width={500}
                height={400}
                className="w-full h-48 sm:h-56 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-lg sm:text-xl mb-2">Peace Lily</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Elegant flowering plant for a refreshing environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

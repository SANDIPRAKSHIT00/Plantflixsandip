"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";
import Image from "next/image";

interface Plant {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function FeaturedPlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      const { data, error } = await supabase
        .from("plants")
        .select("id, name, price, image_url")
        .limit(3);

      if (error) {
        console.error("❌ Error fetching plants:", error);
      } else {
        setPlants(data);
      }
      setLoading(false);
    };

    fetchPlants();
  }, []);

  return (
    <section className="py-12 text-center bg-green-50">
      <h2 className="text-3xl font-bold mb-8 text-green-700">
        🌸 Popular This Week
      </h2>

      {loading ? (
        <p className="text-gray-500 text-lg">Loading plants...</p>
      ) : plants.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 px-6">
          {plants.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 bg-white"
            >
              {/* ✅ Next.js Image requires width & height */}
              {p.image_url && (
                <div className="w-full h-48 relative mb-4">
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill   // <--- Auto-fills container
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              <h3 className="text-xl font-semibold text-gray-800">{p.name}</h3>
              <p className="text-green-600 font-bold mb-3">₹{p.price}</p>

              <Link
                href={`/userDashboard/plants/${p.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-lg">No plants found.</p>
      )}
    </section>
  );
}

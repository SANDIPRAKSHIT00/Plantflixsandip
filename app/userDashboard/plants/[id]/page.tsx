"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Navbar from "@/app/userDashboard/components/Navbar";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "../../../context/CartContext";

interface Plant {
  id: string;
  name: string;
  price: number;
  stock: number;
  type: string;
  season: string;
  image_url: string;
  description: string;
  care_instructions: string;
  nursery_id: string;
}

export default function PlantDetails() {
  const { id } = useParams();
  const [plant, setPlant] = useState<Plant | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPlant = async () => {
      const { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setPlant(data);
    };

    fetchPlant();
  }, [id]);

  if (!plant)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-12 px-4 bg-green-50 min-h-screen flex justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-8">
          
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-xl overflow-hidden shadow-md">
            <Image
              src={plant.image_url}
              alt={plant.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">
                {plant.name}
              </h1>

              <p className="text-sm text-gray-500 mb-1">
                {plant.type} | {plant.season}
              </p>

              <p className="text-xl font-semibold text-green-900 mb-4">
                ₹{plant.price}
              </p>

              <p className="text-gray-700 text-sm md:text-base mb-3">
                {plant.description}
              </p>

              <div>
                <h3 className="font-medium text-gray-700 mb-1 text-sm">
                  Care Instructions:
                </h3>
                <p className="text-gray-600 text-sm">{plant.care_instructions}</p>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-4 md:mt-6">
              <button
                onClick={() =>
                  addToCart({
                    id: plant.id,
                    name: plant.name,
                    price: plant.price,
                    image_url: plant.image_url,
                    quantity: 1,
                    nursery_id: plant.nursery_id,
                  })
                }
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 text-sm"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

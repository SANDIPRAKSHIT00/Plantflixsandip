"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";

interface Plant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  type: string;
  season: string;
}

export default function BrowsePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [totalPlants, setTotalPlants] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 10;

  const [filter, setFilter] = useState({
    search: "",
    type: "",
    priceRange: "",
    availability: "",
  });

  
  // FETCH PLANTS (useCallback FIX)
  
  const fetchPlants = useCallback(async () => {
    let query = supabase.from("plants").select("*", { count: "exact" });

    if (filter.search) query = query.ilike("name", `%${filter.search}%`);
    if (filter.type) query = query.eq("type", filter.type);
    if (filter.priceRange === "low") query = query.lte("price", 200);
    if (filter.priceRange === "medium")
      query = query.gte("price", 200).lte("price", 500);
    if (filter.priceRange === "high") query = query.gte("price", 500);
    if (filter.availability === "in-stock") query = query.gt("stock", 0);
    if (filter.availability === "out-of-stock") query = query.eq("stock", 0);

    const from = (currentPage - 1) * plantsPerPage;
    const to = from + plantsPerPage - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error(error);
    } else {
      setPlants(data || []);
      setTotalPlants(count || 0);
    }
  }, [filter, currentPage]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const totalPages = Math.ceil(totalPlants / plantsPerPage);

  return (
    <>
      <Navbar />

      <div className="mt-0 min-h-screen bg-green-50 p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 mb-4 md:mb-0">
            🌱 Browse Plants
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 bg-white p-4 rounded-xl shadow">
          <div className="flex items-center border border-green-400 rounded-lg px-3">
            <Search size={18} className="text-green-600 mr-2" />
            <input
              type="text"
              placeholder="Search by name..."
              value={filter.search}
              onChange={(e) =>
                setFilter({ ...filter, search: e.target.value })
              }
              className="outline-none p-2 w-48"
            />
          </div>

          <select
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="border border-green-400 rounded-lg px-4 py-2 bg-white text-gray-700"
          >
            <option value="">All Types</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Flowering">Flowering</option>
            <option value="Succulent">Succulent</option>
          </select>

          <select
            onChange={(e) =>
              setFilter({ ...filter, priceRange: e.target.value })
            }
            className="border border-green-400 rounded-lg px-4 py-2 bg-white text-gray-700"
          >
            <option value="">All Prices</option>
            <option value="low">Under ₹200</option>
            <option value="medium">₹200 - ₹500</option>
            <option value="high">Above ₹500</option>
          </select>

          <select
            onChange={(e) =>
              setFilter({ ...filter, availability: e.target.value })
            }
            className="border border-green-400 rounded-lg px-4 py-2 bg-white text-gray-700"
          >
            <option value="">All</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Plant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {plants.length > 0 ? (
            plants.map((plant) => (
              <Link
                key={plant.id}
                href={`/userDashboard/plants/${plant.id}`}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between cursor-pointer hover:-translate-y-1 transform"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={plant.image_url}
                    alt={plant.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <h2 className="text-lg font-semibold text-green-700 mt-3">
                  {plant.name}
                </h2>

                <p className="text-gray-700 font-medium">₹{plant.price}</p>

                <p className="text-sm text-gray-500 mb-2">
                  {plant.type} | {plant.season}
                </p>

                <p
                  className={`text-sm font-medium ${
                    plant.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {plant.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No plants found for selected filters.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded-md font-medium transition-all duration-200 ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white shadow-md scale-105"
                    : "bg-white text-green-700 border border-green-400 hover:bg-green-100 hover:shadow-sm"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

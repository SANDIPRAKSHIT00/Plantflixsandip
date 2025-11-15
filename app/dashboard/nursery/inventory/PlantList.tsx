"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Icon } from "@iconify/react";
import Image from "next/image";

// 🔹 TypeScript interface for a plant
interface Plant {
  id: string;
  name: string;
  price: number;
  stock: number;
  type?: string;
  season?: string;
  description?: string;
  image_url?: string;
  nursery_id?: string;
}

interface PlantListProps {
  refresh: boolean;
}

export default function PlantList({ refresh }: PlantListProps) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPlants, setTotalPlants] = useState(0);

  const plantsPerPage = 6;

  // 🔹 Fetch plants with pagination
  const fetchPlants = async (page = 1) => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const start = (page - 1) * plantsPerPage;
    const end = start + plantsPerPage - 1;

    // Get total count
    const { count } = await supabase
      .from("plants")
      .select("*", { count: "exact", head: true })
      .eq("nursery_id", user.id);

    setTotalPlants(count || 0);

    // Fetch paginated data
    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("nursery_id", user.id)
      .order("id", { ascending: false })
      .range(start, end);

    if (error) console.error(error);
    else setPlants(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchPlants(currentPage);
  }, [refresh, currentPage]);

  // 🔹 Delete plant
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plant?")) return;

    const { error } = await supabase.from("plants").delete().eq("id", id);
    if (error) alert("❌ Failed to delete: " + error.message);
    else {
      alert("✅ Plant deleted successfully!");
      fetchPlants(currentPage);
    }
  };

  // 🔹 Upload image
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: _data, error } = await supabase.storage
      .from("plant-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("plant-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  // 🔹 Save edited plant
  const handleSaveEdit = async () => {
    if (!editingPlant) return;

    let imageUrl = editingPlant.image_url;

    if (newImage) {
      try {
        imageUrl = await uploadImage(newImage);
      } catch (err: unknown) {
        let message = "Unknown error";
        if (err instanceof Error) {
          message = err.message;
        }
        alert("❌ Image upload failed: " + message);
        return;
      }
    }

    const { error } = await supabase
      .from("plants")
      .update({
        name: editingPlant.name,
        price: editingPlant.price,
        stock: editingPlant.stock,
        image_url: imageUrl,
        description: editingPlant.description,
        type: editingPlant.type,
        season: editingPlant.season,
      })
      .eq("id", editingPlant.id);

    if (error) alert("❌ Failed to update: " + error.message);
    else {
      alert("✅ Plant updated successfully!");
      setEditingPlant(null);
      setNewImage(null);
      fetchPlants(currentPage);
    }
  };

  const totalPages = Math.ceil(totalPlants / plantsPerPage);

  if (loading)
    return <p className="text-center text-gray-500 py-6">Loading...</p>;

  return (
    <div className="mt-8 overflow-x-auto">
      {plants.length === 0 ? (
        <p className="text-gray-500 text-center">No plants added yet.</p>
      ) : (
        <>
          <table className="min-w-full border border-gray-300 rounded-xl shadow-md">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Season</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {plants.map((plant) => (
                <tr key={plant.id} className="hover:bg-green-50 transition">
                  {/* Image */}
                  <td className="p-3">
                    {editingPlant?.id === plant.id ? (
                      <input
                        type="file"
                        onChange={(e) =>
                          setNewImage(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="border p-1 rounded"
                      />
                    ) : plant.image_url ? (
                      <Image
                        src={plant.image_url}
                        alt={plant.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>

                  {/* Name */}
                  <td className="p-3 font-medium text-gray-800">
                    {editingPlant?.id === plant.id ? (
                      <input
                        type="text"
                        value={editingPlant.name}
                        onChange={(e) =>
                          setEditingPlant({
                            ...editingPlant,
                            name: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      plant.name
                    )}
                  </td>

                  {/* Price */}
                  <td className="p-3 text-gray-700">
                    {editingPlant?.id === plant.id ? (
                      <input
                        type="number"
                        value={editingPlant.price}
                        onChange={(e) =>
                          setEditingPlant({
                            ...editingPlant,
                            price: Number(e.target.value),
                          })
                        }
                        className="border p-1 rounded w-20"
                      />
                    ) : (
                      <>₹{plant.price}</>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="p-3 text-gray-700">
                    {editingPlant?.id === plant.id ? (
                      <input
                        type="number"
                        value={editingPlant.stock}
                        onChange={(e) =>
                          setEditingPlant({
                            ...editingPlant,
                            stock: Number(e.target.value),
                          })
                        }
                        className="border p-1 rounded w-20"
                      />
                    ) : (
                      plant.stock
                    )}
                  </td>

                  {/* Type */}
                  <td className="p-3 text-gray-700">
                    {editingPlant?.id === plant.id ? (
                      <input
                        type="text"
                        value={editingPlant.type || ""}
                        onChange={(e) =>
                          setEditingPlant({
                            ...editingPlant,
                            type: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      plant.type || "-"
                    )}
                  </td>

                  {/* Season */}
                  <td className="p-3 text-gray-700">
                    {editingPlant?.id === plant.id ? (
                      <input
                        type="text"
                        value={editingPlant.season || ""}
                        onChange={(e) =>
                          setEditingPlant({
                            ...editingPlant,
                            season: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      plant.season || "-"
                    )}
                  </td>

                  {/* Description */}
                  <td className="p-3 text-gray-700 max-w-xs truncate">
                    {editingPlant?.id === plant.id ? (
                      <textarea
                        value={editingPlant.description || ""}
                        onChange={(e) =>
                          setEditingPlant({
                            ...editingPlant,
                            description: e.target.value,
                          })
                        }
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                      plant.description || "-"
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-2">
                    {editingPlant?.id === plant.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-800"
                          title="Save"
                        >
                          <Icon
                            icon="fluent:save-24-regular"
                            className="w-5 h-5"
                          />
                        </button>
                        <button
                          onClick={() => {
                            setEditingPlant(null);
                            setNewImage(null);
                          }}
                          className="text-gray-600 hover:text-gray-800"
                          title="Cancel"
                        >
                          <Icon icon="mdi:close" className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingPlant(plant)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Icon icon="mdi:pencil" className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(plant.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Icon icon="mdi:delete" className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${currentPage === page
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

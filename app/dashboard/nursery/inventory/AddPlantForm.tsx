"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

interface Props {
  onClose: () => void;
  onPlantAdded: () => void;
}

export default function AddPlantModal({ onClose, onPlantAdded }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(false);

  // 🌿 Upload image to Supabase Storage
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("plant-images")
      .upload(fileName, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("plant-images").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return;

    let imageUrl = "";

    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Image upload failed.";
        alert("❌ " + errorMessage);
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from("plants").insert([
      {
        nursery_id: auth.user.id,
        name,
        price: Number(price),
        stock: Number(stock),
        image_url: imageUrl,
        description,
        type,
        season,
      },
    ]);

    if (error) {
      alert("❌ Failed to add plant: " + error.message);
    } else {
      alert("✅ Plant added successfully!");
      onPlantAdded();
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-green-700 mb-4">
          Add New Plant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-gray-700">
          <input
            type="text"
            placeholder="Plant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full rounded-md"
          />

          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border p-2 w-full rounded-md"
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="border p-2 w-full rounded-md"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="border p-2 w-full rounded-md"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="border p-2 w-full rounded-md resize-none"
          ></textarea>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="border p-2 w-full rounded-md"
          >
            <option value="">Select Type</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Flowering">Flowering</option>
            <option value="Succulent">Succulent</option>
          </select>

          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            required
            className="border p-2 w-full rounded-md"
          >
            <option value="">Select Season</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
            <option value="Rainy">Rainy</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              {loading ? "Adding..." : "Add Plant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

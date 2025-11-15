"use client";
import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart } = useCart();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cart.map((plant) => (
            <div
              key={plant.id}
              className="border p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition"
            >
              <div className="relative w-full h-40 mb-2">
                <Image
                  src={plant.image_url || "/placeholder.png"}
                  alt={plant.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <h3 className="font-semibold text-lg">{plant.name}</h3>
              <p className="text-gray-600">₹{plant.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

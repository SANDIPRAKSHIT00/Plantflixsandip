// "use client";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { FiShoppingCart } from "react-icons/fi";
// import { Plant } from "../types/plant";
// import { useCart } from "../context/CartContext";
// import toast from "react-hot-toast";

// interface PlantCardProps {
//   plant: Plant;
// }

// export default function PlantCard({ plant }: PlantCardProps) {
//   const router = useRouter();
//   const { addToCart } = useCart();

//   const handleAddToCart = () => {
//     addToCart(plant);
//     toast.success(`${plant.name} added to cart!`, { duration: 1000 });
//   };

//   return (
//     <div className="bg-white dark:bg-green-900 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
//       <div
//         className="relative w-full h-52 cursor-pointer"
//         onClick={() => router.push(`/plants/${plant.id}`)}
//       >
//         <Image
//           src={plant.imageUrl} // ensure this is valid URL or /public path
//           alt={plant.name}
//           fill
//           className="object-cover hover:scale-105 transition-transform duration-300"
//         />
//       </div>

//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-green-700 dark:text-green-100">
//           {plant.name}
//         </h3>
//         <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2 mb-2">
//           {plant.description}
//         </p>

//         <div className="flex justify-between items-center mb-3">
//           <span className="text-green-700 dark:text-green-300 font-bold text-lg">
//             ₹{plant.price}
//           </span>
//           <span className="text-yellow-500 text-sm">⭐ {plant.rating.toFixed(1)}</span>
//         </div>

//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => router.push(`/plants/${plant.id}`)}
//             className="text-sm text-green-700 dark:text-green-300 hover:underline"
//           >
//             View Details
//           </button>
//           <button
//             onClick={handleAddToCart}
//             className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-md flex items-center gap-1 transition-all duration-200"
//           >
//             <FiShoppingCart /> Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

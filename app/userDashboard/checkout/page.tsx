"use client";

import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Plus, Minus, Edit } from "lucide-react";
import AddAddressModal from "./AddAddressModal";
import Navbar from "../components/Navbar";

/** --- Types --- **/
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  nursery_id?: string | null;
};

type Address = {
  id: string;
  user_id?: string | null;
  name: string;
  phone: string;
  address_line?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  is_default?: boolean;
};

type Profile = {
  id: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
};

// typed Razorpay constructor on window (no `any`)
declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { cart, clearCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const [profileAddress, setProfileAddress] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load Razorpay script (cleanup returns void)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Load user profile & addresses
  const loadAddresses = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) return;

      // Profile address (no generic on .from, cast later)
      const profileResp = await supabase
        .from("profiles")
        .select("id, name, phone, address, city, postal_code")
        .eq("id", user.id)
        .single();

      const profile = (profileResp.data as Profile) ?? null;
      if (profile) setProfileAddress(profile);

      // Saved addresses
      const addrResp = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);

      const addrData = Array.isArray(addrResp.data)
        ? (addrResp.data as Address[])
        : [];
      const addrError = addrResp.error;

      if (!addrError) {
        if (!addrData.find((a) => a.is_default) && profile) {
          // Build merged profile-as-address and prepend it so it's used in UI
          const mergedProfileAsAddress: Address = {
            id: "profile",
            user_id: profile.id ?? null,
            name: profile.name ?? "",
            phone: profile.phone ?? "",
            address_line: profile.address ?? null,
            address: profile.address ?? null,
            city: profile.city ?? null,
            postal_code: profile.postal_code ?? null,
            is_default: false,
          };
          setAddresses([mergedProfileAsAddress, ...addrData]);
          setSelectedAddress("profile");
        } else {
          setAddresses(addrData);
          const defaultAddress = addrData.find((addr) => addr.is_default);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress.id);
          } else if (profile) {
            // If there are zero addresses but profile exists, use profile
            const mergedProfileAsAddress: Address = {
              id: "profile",
              user_id: profile.id ?? null,
              name: profile.name ?? "",
              phone: profile.phone ?? "",
              address_line: profile.address ?? null,
              address: profile.address ?? null,
              city: profile.city ?? null,
              postal_code: profile.postal_code ?? null,
              is_default: false,
            };
            setAddresses([mergedProfileAsAddress]);
            setSelectedAddress("profile");
          }
        }
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const totalPrice = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  // Place order
  const handlePlaceOrder = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) {
        router.push("/login");
        return;
      }

      let addressObj: Address | Profile | null = null;
      if (selectedAddress === "profile") {
        addressObj = profileAddress;
      } else {
        addressObj = addresses.find((a) => a.id === selectedAddress) ?? null;
      }

      if (!addressObj) {
        alert("⚠️ Please select an address first!");
        return;
      }

      if (typeof window === "undefined" || !window.Razorpay) {
        alert("❌ Razorpay SDK not loaded. Please try again.");
        return;
      }

      setLoading(true);

      const options: Record<string, unknown> & {
        handler: (r: RazorpayResponse) => Promise<void>;
        prefill: { name?: string; email?: string; contact?: string };
      } = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount: totalPrice * 100,
        currency: "INR",
        name: "PlantFlix",
        description: "Plant Purchase",
        handler: async function (response: RazorpayResponse) {
          try {
            const ordersToInsert = cart.map((item: CartItem) => ({
              user_id: user.id,
              items: JSON.stringify([item]),
              total_price: item.price * item.quantity,
              quantity: item.quantity,
              status: "Order Placed",
              payment_status: "Paid",
              razorpay_payment_id: response.razorpay_payment_id,
              address: JSON.stringify(addressObj),
              nursery_id: item.nursery_id ?? null,
              unit_price: item.price,
            }));

            const { error } = await supabase.from("orders").insert(ordersToInsert);

            if (error) {
              alert("❌ Failed to save order");
              console.error(error);
            } else {
              clearCart();
              setSuccess(true);
              setTimeout(() => router.push("/userDashboard/plants"), 2000);
            }
          } catch (err) {
            console.error(err);
            alert("❌ Something went wrong while placing order.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: profileAddress?.name ?? undefined,
          email: user.email ?? undefined,
          contact: profileAddress?.phone ?? undefined,
        },
        theme: { color: "#22c55e" },
      };

      const Constructor = window.Razorpay!;
      const rzp = new Constructor(options);
      rzp.open();
    } catch (err) {
      console.error("Place order error:", err);
      setLoading(false);
      alert("❌ Failed to initiate payment.");
    }
  };

  // Success page
  if (success) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen bg-green-50 dark:bg-gray-900">
          <CheckCircle className="text-green-600 w-20 h-20 mb-4" />
          <h2 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-4">
            ✅ Order Placed Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Redirecting you to the plants page...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6 text-center">
            Checkout
          </h1>

          {/* Address Section */}
          <div className="mb-6 bg-green-50 dark:bg-gray-800 p-4 rounded-xl">
            <h2 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
              Delivery Address
            </h2>

            {/* Default / Profile address */}
            {(() => {
              const defaultAddr = addresses.find((addr) => addr.is_default);
              if (defaultAddr) {
                return (
                  <label className="block border rounded-lg p-3 mb-3 cursor-pointer">
                    <input
                      type="radio"
                      name="address"
                      value={defaultAddr.id}
                      checked={selectedAddress === defaultAddr.id}
                      onChange={() => setSelectedAddress(defaultAddr.id)}
                      className="mr-2"
                    />
                    <span className="font-medium">
                      {defaultAddr.name} ({defaultAddr.phone})
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                      {defaultAddr.address_line || defaultAddr.address}, {defaultAddr.city},{" "}
                      {defaultAddr.postal_code}
                    </p>
                  </label>
                );
              }

              if (profileAddress) {
                // render profile address option
                return (
                  <label className="block border rounded-lg p-3 mb-3 cursor-pointer">
                    <input
                      type="radio"
                      name="address"
                      value="profile"
                      checked={selectedAddress === "profile"}
                      onChange={() => setSelectedAddress("profile")}
                      className="mr-2"
                    />
                    <span className="font-medium">
                      {profileAddress.name} ({profileAddress.phone})
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                      {profileAddress.address}, {profileAddress.city}, {profileAddress.postal_code}
                    </p>
                  </label>
                );
              }

              return null;
            })()}

            {/* Other addresses */}
            {addresses
              .filter((addr) => !addr.is_default)
              .map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between mb-3 border rounded-lg p-3"
                >
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mr-2"
                    />
                    <span className="font-medium">
                      {addr.name} ({addr.phone})
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                      {addr.address_line}, {addr.city}, {addr.postal_code}
                    </p>
                  </label>
                  <button
                    onClick={() => {
                      setEditingAddress(addr);
                      setShowModal(true);
                    }}
                    className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <Edit size={14} /> Update
                  </button>
                </div>
              ))}

            {/* Add new address */}
            <button
              type="button"
              onClick={() => {
                setEditingAddress(null);
                setShowModal(true);
              }}
              className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              ➕ Use Another Address
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <AddAddressModal
              addressToEdit={editingAddress}
              onClose={() => setShowModal(false)}
              onAddressAdded={async () => {
                await loadAddresses();
                setShowModal(false);
              }}
            />
          )}

          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex items-center gap-5 p-4 bg-green-50 dark:bg-gray-800 rounded-xl shadow-sm"
              >
                <div className="w-24 h-24 relative">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover rounded-lg border border-green-200 dark:border-gray-700"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeFromCart(item.id)
                      }
                      className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-green-700 dark:text-green-400 font-medium mt-2">
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Place Order */}
          <div className="mt-6 flex justify-between font-semibold text-xl text-green-800 dark:text-green-300 border-t pt-4">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </>
  );
}

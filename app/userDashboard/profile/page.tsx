"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

interface UserProfile {
  name: string | null;
  email: string | null;
}

interface Address {
  id: string;
  name: string;
  address_line: string;
  city: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
  user_id: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: addressData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      setAddresses(addressData || []);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const reloadAddresses = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setAddresses(data || []);
  };

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert("Please login first!");

    const newAddress = {
      user_id: user.id,
      name: formData.get("name")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      address_line: formData.get("address")?.toString() || "",
      city: formData.get("city")?.toString() || "",
      postal_code: formData.get("postal_code")?.toString() || "",
      is_default: currentAddress?.is_default || false,
    };

    let error;
    if (isEditing && currentAddress) {
      ({ error } = await supabase
        .from("addresses")
        .update(newAddress)
        .eq("id", currentAddress.id)
        .eq("user_id", user.id));
    } else {
      ({ error } = await supabase.from("addresses").insert(newAddress));
    }

    if (error) {
      alert("❌ " + error.message);
    } else {
      alert(isEditing ? "✅ Address updated!" : "✅ Address added!");
      setShowModal(false);
      setIsEditing(false);
      setCurrentAddress(null);
      await reloadAddresses();
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    if (!confirm("Are you sure you want to delete this address?")) return;

    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert("❌ " + error.message);
    } else {
      alert("🗑️ Address removed!");
      await reloadAddresses();
    }
  };

  const handleMakeDefault = async (id: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert("❌ " + error.message);
    } else {
      alert("⭐ Default address updated!");
      await reloadAddresses();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-green-700 animate-pulse">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-green-50 py-10 px-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-green-700 mb-6 font-medium hover:underline"
      >
        <Icon icon="mdi:arrow-left" width="20" height="20" /> Back
      </button>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-white to-green-50 shadow-xl rounded-3xl p-8 border border-green-100">
          <h1 className="text-3xl font-bold text-green-700 mb-6 text-center flex items-center justify-center gap-2">
            <Icon icon="mdi:account-circle-outline" width="28" height="28" /> My Profile
          </h1>

          <div className="bg-green-200 text-green-700 p-6 rounded-2xl border border-green-200 space-y-3">
            <p className="text-lg font-semibold flex items-center gap-2">
              <Icon icon="mdi:account" width="20" height="20" /> Name:{" "}
              <span className="font-normal">{profile?.name || "Not set"}</span>
            </p>
            <p className="text-lg font-semibold flex items-center gap-2">
              <Icon icon="mdi:email-outline" width="20" height="20" /> Email:{" "}
              <span className="font-normal">{profile?.email || "Not set"}</span>
            </p>
          </div>
        </div>

        {/* Addresses Card */}
        <div className="bg-gradient-to-br from-white to-green-50 shadow-xl rounded-3xl p-6 border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
              <Icon icon="mdi:home-city-outline" width="22" height="22" /> Saved Addresses
            </h3>
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentAddress(null);
                setShowModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 flex items-center gap-2"
            >
              <Icon icon="mdi:plus" width="16" height="16" /> Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-gray-500">No address added yet.</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-xl border flex justify-between items-start shadow-sm ${addr.is_default
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                    }`}
                >
                  <div className="space-y-1 text-gray-800">
                    <p className="font-semibold flex items-center gap-1">
                      <Icon icon="mdi:account" width="16" height="16" /> {addr.name}
                    </p>
                    <p className="flex items-center gap-1">
                      <Icon icon="mdi:phone" width="16" height="16" /> {addr.phone}
                    </p>
                    <p className="flex items-center gap-1">
                      <Icon icon="mdi:map-marker" width="16" height="16" /> {addr.address_line}
                    </p>
                    <p className="flex items-center gap-1">
                      <Icon icon="mdi:city" width="16" height="16" /> {addr.city}
                    </p>
                    <p className="flex items-center gap-1">
                      <Icon icon="mdi:mailbox" width="16" height="16" /> {addr.postal_code}
                    </p>
                    {addr.is_default && (
                      <p className="text-green-600 font-semibold mt-1 flex items-center gap-1">
                        <Icon icon="mdi:star" width="16" height="16" /> Default
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    {!addr.is_default && (
                      <button
                        onClick={() => handleMakeDefault(addr.id)}
                        className="text-yellow-600 hover:text-yellow-800 text-sm flex items-center gap-1"
                      >
                        <Icon icon="mdi:star-outline" width="16" height="16" /> Make Default
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentAddress(addr);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <Icon icon="mdi:pencil" width="16" height="16" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <Icon icon="mdi:trash-can" width="16" height="16" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSaveAddress}
            className="bg-white p-6 rounded-2xl shadow-xl w-96 space-y-4 relative"
          >
            <h2 className="text-xl font-semibold text-green-700 text-center">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>

            <input
              name="name"
              type="text"
              defaultValue={currentAddress?.name || ""}
              placeholder="Full Name"
              className="w-full p-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="phone"
              type="text"
              defaultValue={currentAddress?.phone || ""}
              placeholder="Phone"
              className="w-full p-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="address"
              type="text"
              defaultValue={currentAddress?.address_line || ""}
              placeholder="Address Line"
              className="w-full p-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="city"
              type="text"
              defaultValue={currentAddress?.city || ""}
              placeholder="City"
              className="w-full p-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              name="postal_code"
              type="text"
              defaultValue={currentAddress?.postal_code || ""}
              placeholder="Postal Code"
              className="w-full p-2 border border-gray-300 rounded-md bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 rounded-md text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

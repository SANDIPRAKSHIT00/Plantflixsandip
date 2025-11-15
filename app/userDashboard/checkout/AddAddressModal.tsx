"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";

/* Unified Address type (matches checkout page) */
export interface Address {
  id: string;
  user_id?: string | null;
  name?: string | null;
  phone?: string | null;
  address_line?: string | null;
  address?: string | null;
  city?: string | null;
  postal_code?: string | null;
  is_default?: boolean;
}

interface Props {
  onClose: () => void;
  onAddressAdded: () => Promise<void> | void;
  addressToEdit?: Address | null;
}

export default function AddAddressModal({
  onClose,
  onAddressAdded,
  addressToEdit,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (addressToEdit) {
      setName(addressToEdit.name ?? "");
      setPhone(addressToEdit.phone ?? "");
      setAddressLine(addressToEdit.address_line ?? "");
      setCity(addressToEdit.city ?? "");
      setPostalCode(addressToEdit.postal_code ?? "");
      setIsDefault(addressToEdit.is_default ?? false);
    } else {
      // reset when adding new
      setName("");
      setPhone("");
      setAddressLine("");
      setCity("");
      setPostalCode("");
      setIsDefault(false);
    }
  }, [addressToEdit]);

  const handleSave = async () => {
    setErrorMsg(null);
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    // minimal validation
    if (!trimmedName) {
      setErrorMsg("Please enter a name.");
      return;
    }
    if (!trimmedPhone) {
      setErrorMsg("Please enter a phone number.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) {
        setErrorMsg("User not authenticated.");
        setLoading(false);
        return;
      }

      // If new default address → remove default from old addresses
      if (isDefault) {
        const { error: unsetErr } = await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);

        if (unsetErr) console.warn("Failed to unset previous default address:", unsetErr);
      }

      if (addressToEdit) {
        // UPDATE
        const { error } = await supabase
          .from("addresses")
          .update({
            name: trimmedName,
            phone: trimmedPhone,
            address_line: addressLine.trim() || null,
            city: city.trim() || null,
            postal_code: postalCode.trim() || null,
            is_default: isDefault,
          })
          .eq("id", addressToEdit.id);

        if (error) {
          console.error(error);
          setErrorMsg("Failed to update address.");
          setLoading(false);
          return;
        }
      } else {
        // INSERT
        const { error } = await supabase.from("addresses").insert([
          {
            user_id: user.id,
            name: trimmedName,
            phone: trimmedPhone,
            address_line: addressLine.trim() || null,
            city: city.trim() || null,
            postal_code: postalCode.trim() || null,
            is_default: isDefault,
          },
        ]);

        if (error) {
          console.error(error);
          setErrorMsg("Failed to add address.");
          setLoading(false);
          return;
        }
      }

      // Let parent refresh addresses. Wait for it if it's async.
      await onAddressAdded();
      setLoading(false);
      onClose();
    } catch (err) {
      console.error("Address save error:", err);
      setErrorMsg("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-modal-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96">
        <h2 id="address-modal-title" className="text-xl font-semibold mb-4">
          {addressToEdit ? "Update Address" : "Add Address"}
        </h2>

        {errorMsg && (
          <div className="mb-2 text-sm text-red-600" role="alert">
            {errorMsg}
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-2 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />

        <input
          type="text"
          placeholder="Phone"
          className="w-full mb-2 p-2 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />

        <input
          type="text"
          placeholder="Address Line"
          className="w-full mb-2 p-2 border rounded"
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          autoComplete="street-address"
        />

        <input
          type="text"
          placeholder="City"
          className="w-full mb-2 p-2 border rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          autoComplete="address-level2"
        />

        <input
          type="text"
          placeholder="Postal Code"
          className="w-full mb-2 p-2 border rounded"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          autoComplete="postal-code"
        />

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
          Set as Default Address
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
          >
            {loading ? (addressToEdit ? "Updating..." : "Adding...") : addressToEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

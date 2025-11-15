"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/");
  };

  return (
    <>
      {/* ✅ Hamburger Button (Visible on Mobile) */}
      <button
        className="absolute top-4 left-4 z-50 p-2 bg-green-700 text-white rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon icon="mdi:menu" className="text-2xl" />
      </button>

      {/* ✅ Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-green-800 text-white flex flex-col justify-between p-6 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:translate-x-0"}`}
      >
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Icon icon="mdi:leaf" className="text-green-300 text-2xl" />
            Nursery Admin
          </h2>

          <nav className="space-y-4">
            <Link href="/dashboard" className="flex items-center gap-3 hover:text-green-300 transition-all">
              <Icon icon="mdi:view-dashboard-outline" className="text-xl" />
              Dashboard
            </Link>

            <Link href="/dashboard/nursery/inventory" className="flex items-center gap-3 hover:text-green-300 transition-all">
              <Icon icon="mdi:seed-outline" className="text-xl" />
              Inventory
            </Link>

            <Link href="/dashboard/nursery/orders" className="flex items-center gap-3 hover:text-green-300 transition-all">
              <Icon icon="mdi:clipboard-list-outline" className="text-xl" />
              Orders
            </Link>
          </nav>
        </div>

        <div className="mt-auto pt-6 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
          >
            <Icon icon="mdi:logout" className="text-xl" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Sidebar from "./nursery/comp/Sidebar";
import DashboardCard from "./nursery/comp/DashboardCard";
import Link from "next/link";

import { Menu } from "lucide-react";

export default function NurseryDashboard() {
  const [nurseryName, setNurseryName] = useState("");
  const [totalSales, setTotalSales] = useState(0);
  const [totalPlants, setTotalPlants] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, name")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) return;

      setNurseryName(profile.name);

      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, status, total_price, nursery_id")
        .eq("nursery_id", profile.id);

      if (ordersError || !orders) return;

      const deliveredOrders = orders.filter(
        (o) => o.status?.toLowerCase() === "delivered"
      );

      const totalDeliveredSales = deliveredOrders.reduce(
        (sum, order) => sum + (order.total_price || 0),
        0
      );
      setTotalSales(totalDeliveredSales);

      const activeOrdersList = orders.filter(
        (o) => o.status?.toLowerCase() !== "delivered"
      );
      setActiveOrders(activeOrdersList.length);

      const { count: plantCount } = await supabase
        .from("plants")
        .select("*", { count: "exact", head: true })
        .eq("nursery_id", profile.id);

      setTotalPlants(plantCount || 0);
    };

    fetchDashboardData();
  }, []);

  

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-600 dark:to-green-300 transition-colors duration-500">
      {/* ✅ Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-40 transform bg-green-700 dark:bg-green-800 transition-transform duration-300 ease-in-out 
        w-64 shadow-lg ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col justify-between`}
      >
        {/* Sidebar Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Footer Section */}
        {/* <div className="p-3 text-xs text-gray-200 text-center border-t border-green-600 dark:border-gray-700">
          © {new Date().getFullYear()} Plantflix
        </div> */}
      </div>

      {/* ✅ Overlay (for mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* ✅ Main Section */}
      <main className="flex-1 p-4 sm:p-6 md:ml-64 relative transition-all duration-300">
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden mb-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-green-700 dark:text-green-300"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Welcome Message */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-700 dark:text-green-300 text-center md:text-left transition-all duration-500">
          Welcome, {nurseryName} 🌿
        </h1>

        {/* ✅ Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <DashboardCard title="Total Sales" value={`₹${totalSales}`} />
          </div>

          <div className="transform hover:scale-105 transition-transform duration-300">
            <DashboardCard
              title="Active Orders"
              value={activeOrders.toString()}
            />
          </div>

          <div className="transform hover:scale-105 transition-transform duration-300">
            <DashboardCard
              title="Total Plants"
              value={totalPlants.toString()}
            />
          </div>
        </div>

        {/* ✅ Quick Navigation */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          <Link
            href="/dashboard/nursery/inventory"
            className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 text-center sm:text-left"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-green-300">
              Inventory Management
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
              Add, update, or delete plants
            </p>
          </Link>

          <Link
            href="/dashboard/nursery/orders"
            className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 text-center sm:text-left"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-green-600 dark:text-green-300">
              Order Management
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
              View and update order statuses
            </p>
          </Link>
        </div>

        
        
      </main>
    </div>
  );
}

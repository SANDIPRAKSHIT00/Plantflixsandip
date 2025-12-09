
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Sidebar from "../comp/Sidebar";
import { Icon } from "@iconify/react";

interface Order {
  id: number;
  created_at: string;
  status: string;
  total_price: number;
  user_id: string;
  quantity: number;
  fk_orders_user?: { name: string };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  // const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id
                  ? { ...order, ...payload.new }
                  : order
              )
            );
          } else if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new as Order, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    // setLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        total_price,
        status,
        created_at,
        quantity,
        user_id,
        fk_orders_user ( name )
      `)
      .eq("nursery_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setOrders(data as unknown as Order[]);
    // setLoading(false);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      setUpdating(id);
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (!mounted) return null;

  const statusColors: Record<string, string> = {
    "order placed": "bg-pink-500",
    confirmed: "bg-indigo-500",
    processing: "bg-yellow-500",
    shipped: "bg-blue-500",
    delivered: "bg-green-500",
  };

 
  const nextStatusMap: Record<string, string[]> = {
    "order placed": ["confirmed", "processing", "shipped", "delivered"],
    confirmed: ["processing", "shipped", "delivered"],
    processing: ["shipped", "delivered"],
    shipped: ["delivered"],
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-black overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-green-800 text-white z-50 transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center bg-white shadow px-4 py-3 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-green-700"
          >
            <Icon icon="lucide:menu" className="w-7 h-7" />
          </button>

          <h1 className="text-lg lg:text-2xl font-bold text-green-700 ml-3">
            <Icon
              icon="mdi:clipboard-text-outline"
              className="w-6 h-6 mr-2 inline-block"
            />
            Orders Management
          </h1>
        </div>

        {/* Table */}
        <div className="flex-1 p-4 lg:p-8 overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">
                    {order.fk_orders_user?.name || order.user_id}
                  </td>
                  <td className="px-4 py-2">{order.quantity}</td>
                  <td className="px-4 py-2">₹{order.total_price}</td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-black ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    {new Date(order.created_at).toLocaleString()}
                  </td>

                  {/* ✅ SMART DROPDOWN */}
                  <td className="px-4 py-2">
                    {order.status !== "delivered" && (
                      <select
                        defaultValue=""
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value)
                        }
                        disabled={updating === order.id}
                        className="border rounded-md p-1 text-sm focus:ring-2 focus:ring-green-400"
                      >
                        <option value="" disabled>
                          Update Status
                        </option>

                        {nextStatusMap[order.status]?.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    )}

                    {updating === order.id && (
                      <div className="text-xs text-blue-600 mt-1 flex items-center">
                        <Icon
                          icon="mdi:loading"
                          className="w-4 h-4 animate-spin mr-1"
                        />
                        Updating...
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

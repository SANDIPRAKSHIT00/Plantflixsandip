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
  const [loading, setLoading] = useState(true);
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
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              )
            );
          } else if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new as Order, ...prev]);
          }
        }
      )
      .subscribe();

    // FIX ✔ — cleanup must return *synchronous* function
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
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
    setLoading(false);
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
    cancelled: "bg-gray-400",
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-black overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-green-800 text-white z-50 transform transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between bg-white shadow-sm px-4 py-3 lg:py-5 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-green-700 lg:hidden"
          >
            <Icon icon="lucide:menu" className="w-7 h-7" />
          </button>

          <h1 className="text-lg lg:text-2xl font-bold text-green-700 text-center flex-1 lg:flex-none">
            <Icon icon="mdi:clipboard-text-outline" className="w-6 h-6 inline-block mr-2" />
            Orders Management
          </h1>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 lg:p-8 overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-600 py-6">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-6">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-sm lg:text-base">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 lg:px-4 py-2 border-b text-left">ID</th>
                    <th className="px-3 lg:px-4 py-2 border-b text-left">Customer</th>
                    <th className="px-3 lg:px-4 py-2 border-b text-left">Qty</th>
                    <th className="px-3 lg:px-4 py-2 border-b text-left">Total</th>
                    <th className="px-3 lg:px-4 py-2 border-b text-left">Status</th>
                    <th className="px-3 lg:px-4 py-2 border-b text-left">Date</th>
                    <th className="px-3 lg:px-4 py-2 border-b text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 border-b transition">
                      <td className="px-3 lg:px-4 py-2">{order.id}</td>

                      <td className="px-3 lg:px-4 py-2 truncate max-w-[120px]">
                        {order.fk_orders_user?.name || order.user_id}
                      </td>

                      <td className="px-3 lg:px-4 py-2 text-center">{order.quantity}</td>

                      <td className="px-3 lg:px-4 py-2">₹{order.total_price}</td>

                      {/* STATUS BADGE */}
                      <td className="px-3 lg:px-4 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-white text-xs lg:text-sm font-medium ${statusColors[order.status]}`}
                        >
                          <Icon
                            icon={
                              order.status === "order placed"
                                ? "mdi:cart-outline"
                                : order.status === "confirmed"
                                ? "mdi:check-circle-outline"
                                : order.status === "processing"
                                ? "mdi:progress-clock"
                                : order.status === "shipped"
                                ? "mdi:truck-delivery-outline"
                                : order.status === "delivered"
                                ? "mdi:package-variant-closed"
                                : "mdi:cancel"
                            }
                            className="w-4 h-4 mr-1"
                          />
                          {order.status
                            .split(" ")
                            .map((s) => s[0].toUpperCase() + s.slice(1))
                            .join(" ")}
                        </span>
                      </td>

                      <td className="px-3 lg:px-4 py-2 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleString()}
                      </td>

                      {/* ACTION */}
                      <td className="px-3 lg:px-4 py-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className="border rounded-md p-1 text-xs lg:text-sm focus:ring-2 focus:ring-green-400"
                        >
                          <option value="order placed">Order Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {updating === order.id && (
                          <span className="ml-2 text-xs text-blue-600 flex items-center">
                            <Icon icon="mdi:loading" className="w-4 h-4 animate-spin mr-1" />
                            Updating...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

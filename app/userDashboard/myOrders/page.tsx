"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import Navbar from "../components/Navbar";
import Image from "next/image";

// -------- TYPES ----------
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Address {
  name?: string;
  phone?: string;
  address_line?: string;
  address?: string;
  city?: string;
  postal_code?: string;
}

export interface Order {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
  address: Address | null;
  items: OrderItem[];
}

// -------- PAGE ----------
export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Safe JSON parser
  const safeParse = <T,>(input: unknown): T | null => {
    if (!input) return null;
    if (typeof input === "object") return input as T;
    try {
      return JSON.parse(input as string) as T;
    } catch {
      return null;
    }
  };

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const parsedOrders: Order[] = (data || []).map((order) => ({
      ...order,
      address: safeParse<Address>(order.address),
      items: safeParse<OrderItem[]>(order.items) ?? [],
    }));

    setOrders(parsedOrders);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("orders-user-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updated = payload.new;
          setOrders((prev) =>
            prev.map((order) =>
              order.id === updated.id
                ? {
                    ...order,
                    ...updated,
                    address: safeParse<Address>(updated.address),
                    items: safeParse<OrderItem[]>(updated.items) ?? [],
                  }
                : order
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  // Cancel Order
  const handleCancelOrder = async (orderId: string) => {
    const confirmCancel = confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (error) {
      alert("Failed to cancel order");
      console.error(error);
    }
  };

  // Order status list
  const statuses = [
    "order placed",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "order placed":
        return "bg-gray-400";
      case "confirmed":
        return "bg-purple-500";
      case "processing":
        return "bg-yellow-400";
      case "shipped":
        return "bg-blue-600";
      case "delivered":
        return "bg-green-700";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading your orders...</p>
      </div>
    );

  if (orders.length === 0)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500 dark:text-gray-400">
            No orders found.
          </p>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-green-50 p-4 sm:p-6 pt-20">
        <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
          My Orders
        </h1>

        <div className="space-y-8 max-w-5xl mx-auto">
          {orders.map((order) => {
            const currentStep = statuses.indexOf(
              order.status.toLowerCase()
            );
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white p-6 rounded-3xl shadow-lg border border-green-200"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 break-all">
                      Order ID: {order.id}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() =>
                          setExpandedOrderId(
                            isExpanded ? null : order.id
                          )
                        }
                        className={`text-xs sm:text-sm text-white px-3 py-1 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.toUpperCase()}
                      </button>

                      {!["shipped", "delivered", "cancelled"].includes(
                        order.status.toLowerCase()
                      ) && (
                        <button
                          onClick={() =>
                            handleCancelOrder(order.id)
                          }
                          className="text-xs sm:text-sm px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          CANCEL
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-green-700">
                      ₹{order.total_price}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {isExpanded && order.status !== "cancelled" && (
                  <div className="mt-4">
                    <div className="relative w-full h-2 bg-green-100 rounded-full my-3">
                      <div
                        className={`absolute h-2 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                        style={{
                          width: `${
                            ((currentStep + 1) / statuses.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-600 mb-4">
                      {statuses.map((s) => (
                        <span
                          key={s}
                          className={`capitalize ${
                            statuses.indexOf(s) <= currentStep
                              ? "font-semibold text-green-700"
                              : ""
                          }`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3 mt-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center gap-3 bg-green-50 p-3 rounded-xl"
                    >
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full sm:w-24 h-24 object-cover rounded-lg border border-green-200"
                      />

                      <div className="flex-1 text-center sm:text-left">
                        <p className="font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="font-semibold text-green-700">
                          ₹{item.price} × {item.quantity} = ₹
                          {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Address */}
                {order.address && (
                  <div className="mt-6 border-t pt-4 text-sm text-gray-700">
                    <p className="font-semibold mb-2 text-green-700">
                      Delivery Address:
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{order.address.name}</li>
                      <li>
                        {order.address.address_line ??
                          order.address.address}
                      </li>
                      <li>
                        {order.address.city} -{" "}
                        {order.address.postal_code}
                      </li>
                      <li>{order.address.phone}</li>
                    </ul>
                  </div>
                )}

                {/* Ordered On */}
                <div className="mt-3 text-right text-xs text-gray-500">
                  Ordered on:{" "}
                  {new Date(order.created_at).toLocaleString(
                    "en-IN"
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

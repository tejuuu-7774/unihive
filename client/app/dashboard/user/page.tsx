"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Order = {
  _id: string;
  status: "requested" | "accepted" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  product?: {
    title?: string;
  };
};

export default function UserDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchOrders = async () => {
      try {
        const res = await apiRequest("/orders/my");

        if (!active) return;

        // ✅ handle both cases (safe)
        const fetchedOrders =
          res?.data && Array.isArray(res.data) ? res.data : [];

        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      active = false;
    };
  }, []);

  // 📊 Stats
  const totalOrders = orders.length;

  const activeOrders = orders.filter((o) =>
    ["requested", "accepted", "shipped"].includes(o.status)
  ).length;

  const completedOrders = orders.filter(
    (o) => o.status === "delivered"
  ).length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* HEADER */}
      <section className="border border-slate-200 bg-white px-6 py-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7C3AED]">
          Student Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Track your orders and activity across the platform.
        </p>
      </section>

      {/* STATS */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="border border-slate-200 bg-white px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Total Orders
          </p>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {loading ? "..." : totalOrders}
          </p>
        </div>

        <div className="border border-slate-200 bg-white px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Active Orders
          </p>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {loading ? "..." : activeOrders}
          </p>
        </div>

        <div className="border border-slate-200 bg-white px-6 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Completed Orders
          </p>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {loading ? "..." : completedOrders}
          </p>
        </div>
      </section>

      {/* RECENT ORDERS */}
      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
            Recent Orders
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          {loading ? (
            <div className="px-6 py-4 text-sm text-slate-500">
              Loading...
            </div>
          ) : recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order._id} className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  {order.product?.title || "Product"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {order.status.toUpperCase()} •{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-sm text-slate-500">
              No orders yet
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

type Analytics = { totalProducts: number; approvedProducts: number; pendingProducts: number; totalOrders: number; requestedOrders: number; deliveredOrders: number; grossRevenue: number };

export default function SellerDashboardPage() {
  const [stats, setStats] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { apiRequest("/seller/analytics").then((res) => setStats(res.data)).catch((err) => setError(err.message)); }, []);
  return <div className="mx-auto max-w-7xl space-y-8">
    <section className="flex flex-wrap items-end justify-between gap-4 border bg-white p-6"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Seller dashboard</p><h1 className="mt-2 text-3xl font-black">Operations overview</h1><p className="mt-2 text-base text-slate-600">Manage listings, orders, and direct-payment revenue.</p></div><Link href="/dashboard/seller/add-product" className="bg-slate-900 px-5 py-3 text-sm font-bold text-white">Add product</Link></section>
    {error && <p className="bg-red-50 p-4 text-red-700">{error}</p>}
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
      ["Gross order value", stats ? `₹${stats.grossRevenue.toLocaleString("en-IN")}` : "…"],
      ["Products", stats?.totalProducts ?? "…"],
      ["Pending orders", stats?.requestedOrders ?? "…"],
      ["Delivered", stats?.deliveredOrders ?? "…"],
    ].map(([label, value]) => <div key={label} className="border bg-white p-6"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-black">{value}</p></div>)}</section>
    <section className="grid gap-4 md:grid-cols-3"><Link href="/dashboard/seller/products" className="border bg-white p-6 hover:border-[#7C3AED]"><h2 className="font-bold">Manage products</h2><p className="mt-2 text-sm text-slate-500">{stats?.approvedProducts || 0} approved · {stats?.pendingProducts || 0} pending</p></Link><Link href="/dashboard/seller/orders" className="border bg-white p-6 hover:border-[#7C3AED]"><h2 className="font-bold">Process orders</h2><p className="mt-2 text-sm text-slate-500">{stats?.totalOrders || 0} total orders</p></Link><Link href="/dashboard/seller/earnings" className="border bg-white p-6 hover:border-[#7C3AED]"><h2 className="font-bold">View earnings</h2><p className="mt-2 text-sm text-slate-500">Direct-payment order summary</p></Link></section>
  </div>;
}

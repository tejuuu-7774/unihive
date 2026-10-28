"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Analytics = { grossRevenue: number; totalUnitsSold: number; deliveredOrders: number; acceptedOrders: number; shippedOrders: number };
export default function EarningsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  useEffect(() => { apiRequest("/seller/analytics").then((res) => setData(res.data)); }, []);
  if (!data) return <p>Loading earnings…</p>;
  return <div className="mx-auto max-w-6xl space-y-6"><header className="border bg-white p-6"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Direct payments</p><h1 className="mt-2 text-3xl font-black">Earnings overview</h1><p className="mt-2 text-sm text-slate-500">Revenue is estimated from accepted, shipped, and delivered orders. Confirm payments directly with buyers.</p></header><div className="grid gap-4 md:grid-cols-3">{[{ label: "Gross order value", value: `₹${data.grossRevenue.toLocaleString("en-IN")}` }, { label: "Units sold", value: data.totalUnitsSold }, { label: "Delivered orders", value: data.deliveredOrders }].map((item) => <div key={item.label} className="border bg-white p-6"><p className="text-sm text-slate-500">{item.label}</p><p className="mt-3 text-3xl font-black">{item.value}</p></div>)}</div></div>;
}

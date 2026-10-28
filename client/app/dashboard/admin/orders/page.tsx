"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Order = { _id: string; status: string; totalPrice: number; quantity: number; createdAt: string; product?: { title?: string }; buyer?: { name?: string; email?: string }; seller?: { name?: string; email?: string } };
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { apiRequest("/admin/orders").then((res) => setOrders(res.data || [])); }, []);
  return <div className="mx-auto max-w-7xl space-y-6"><header className="border bg-white p-6"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Operations</p><h1 className="mt-2 text-3xl font-black">All orders</h1></header><div className="overflow-x-auto border bg-white"><table className="min-w-full"><thead><tr className="border-b text-left"><th className="p-4">Product</th><th className="p-4">Buyer</th><th className="p-4">Seller</th><th className="p-4">Value</th><th className="p-4">Status</th><th className="p-4">Created</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id} className="border-b"><td className="p-4 font-semibold">{order.product?.title || "Archived"}</td><td className="p-4">{order.buyer?.name}<br/><span className="text-xs text-slate-500">{order.buyer?.email}</span></td><td className="p-4">{order.seller?.name}<br/><span className="text-xs text-slate-500">{order.seller?.email}</span></td><td className="p-4">₹{order.totalPrice.toLocaleString("en-IN")}</td><td className="p-4 uppercase">{order.status}</td><td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></div>;
}

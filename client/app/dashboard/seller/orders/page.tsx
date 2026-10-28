"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Order = { _id: string; status: string; quantity: number; totalPrice: number; createdAt: string; product?: { title?: string }; buyer?: { name?: string; email?: string; phone?: string } };
const nextActions: Record<string, string[]> = { requested: ["accepted", "rejected"], accepted: ["shipped"], shipped: ["delivered"] };

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]); const [error, setError] = useState("");
  const load = useCallback(() => apiRequest("/orders/seller").then((res) => setOrders(res.data || [])).catch((err) => setError(err.message)), []);
  useEffect(() => { load(); }, [load]);
  const changeStatus = async (id: string, status: string) => { try { await apiRequest(`/orders/${id}`, "PUT", { status }); load(); } catch (err) { setError(err instanceof Error ? err.message : "Update failed"); } };
  return <div className="mx-auto max-w-7xl space-y-6"><header className="border bg-white p-6"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Fulfilment</p><h1 className="mt-2 text-3xl font-black">Seller orders</h1></header>{error && <p className="bg-red-50 p-4 text-red-700">{error}</p>}<div className="space-y-4">{orders.map((order) => <article key={order._id} className="grid gap-4 border bg-white p-5 md:grid-cols-[1fr_auto] md:items-center"><div><div className="flex gap-3"><h2 className="font-bold">{order.product?.title || "Archived product"}</h2><span className="text-xs font-bold uppercase text-[#7C3AED]">{order.status}</span></div><p className="mt-2 text-sm text-slate-600">Buyer: {order.buyer?.name} · {order.buyer?.phone} · Qty {order.quantity}</p><p className="mt-1 text-sm text-slate-500">₹{order.totalPrice.toLocaleString("en-IN")} · {new Date(order.createdAt).toLocaleDateString()}</p></div><div className="flex flex-wrap gap-2">{(nextActions[order.status] || []).map((status) => <button key={status} onClick={() => changeStatus(order._id, status)} className={status === "rejected" ? "border border-red-300 px-4 py-2 text-sm font-bold text-red-700" : "bg-slate-900 px-4 py-2 text-sm font-bold text-white"}>{status}</button>)}</div></article>)}{orders.length === 0 && <p className="border bg-white p-6 text-slate-500">No orders received yet.</p>}</div></div>;
}

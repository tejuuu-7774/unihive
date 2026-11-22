"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiRequest, assetUrl } from "@/lib/api";

type Order = {
  _id: string; quantity: number; totalPrice: number;
  status: "requested" | "accepted" | "rejected" | "shipped" | "delivered" | "cancelled";
  paymentStatus: string; sellerContact: string; createdAt: string;
  product?: { _id?: string; title?: string; images?: string[] };
  seller?: { name?: string; phone?: string };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setError("");
      const response = await apiRequest("/orders/my");
      setOrders(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load orders");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest("/orders/my")
      .then((response) => { if (active) setOrders(response.data || []); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : "Could not load orders"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const cancelOrder = async (id: string) => {
    if (!window.confirm("Cancel this order request?")) return;
    try { await apiRequest(`/orders/cancel/${id}`, "PUT"); await loadOrders(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not cancel order"); }
  };

  const reviewOrder = async (order: Order) => {
    if (!order.product?._id) return;
    const rating = Number(window.prompt("Rating from 1 to 5:", "5"));
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return setError("Choose a whole-number rating from 1 to 5");
    const comment = window.prompt("Share a short review (optional):") || "";
    try { await apiRequest(`/products/${order.product._id}/reviews`, "POST", { rating, comment }); setError(""); window.alert("Review submitted"); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not submit review"); }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="border border-slate-200 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Purchases</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Your orders</h1>
        <p className="mt-2 text-base text-slate-600">Track requests and contact sellers after they accept.</p>
      </header>
      {error && <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? <p className="text-slate-500">Loading orders…</p> : orders.length === 0 ? (
        <div className="border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">You have not placed an order yet.</p>
          <Link href="/dashboard/user/browse" className="mt-4 inline-block bg-slate-900 px-5 py-3 text-sm font-bold text-white">Browse marketplace</Link>
        </div>
      ) : <div className="space-y-4">{orders.map((order) => (
        <article key={order._id} className="grid gap-5 border border-slate-200 bg-white p-5 md:grid-cols-[96px_1fr_auto] md:items-center">
          <div className="h-24 overflow-hidden bg-slate-100">{order.product?.images?.[0] ? <Image src={assetUrl(order.product.images[0])} alt="" width={96} height={96} unoptimized className="h-full w-full object-cover" /> : null}</div>
          <div>
            <div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-bold">{order.product?.title || "Archived product"}</h2><span className="border px-2 py-1 text-xs font-bold uppercase">{order.status}</span></div>
            <p className="mt-2 text-sm text-slate-600">Seller: {order.seller?.name || "Unavailable"} · Quantity: {order.quantity}</p>
            <p className="mt-1 text-sm text-slate-500">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <p className="text-xl font-black">₹{order.totalPrice.toLocaleString("en-IN")}</p>
            {order.status === "requested" && <button onClick={() => cancelOrder(order._id)} className="border px-4 py-2 text-sm font-bold">Cancel request</button>}
            {["accepted", "shipped", "delivered"].includes(order.status) && order.sellerContact && <a href={`https://wa.me/${order.sellerContact}`} target="_blank" rel="noreferrer" className="bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Contact seller</a>}
            {order.status === "delivered" && <button onClick={() => reviewOrder(order)} className="border px-4 py-2 text-sm font-bold">Write review</button>}
          </div>
        </article>
      ))}</div>}
    </div>
  );
}

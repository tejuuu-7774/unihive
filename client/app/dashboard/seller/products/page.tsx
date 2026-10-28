"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

type Product = { _id: string; title: string; price: number; stock: number; moderationStatus: string; moderationNote?: string };

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const load = useCallback(() => apiRequest("/products/my").then((res) => setProducts(Array.isArray(res) ? res : res.data || [])).catch((err) => setError(err.message)), []);
  useEffect(() => { load(); }, [load]);
  const remove = async (id: string) => { if (!window.confirm("Delete this product?")) return; try { await apiRequest(`/products/${id}`, "DELETE"); load(); } catch (err) { setError(err instanceof Error ? err.message : "Delete failed"); } };
  return <div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4 border bg-white p-6"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Inventory</p><h1 className="mt-2 text-3xl font-black">Your products</h1></div><Link href="/dashboard/seller/add-product" className="bg-slate-900 px-5 py-3 text-sm font-bold text-white">Add product</Link></header>
    {error && <p className="bg-red-50 p-4 text-red-700">{error}</p>}
    <div className="overflow-x-auto border bg-white"><table className="min-w-full"><thead><tr className="border-b text-left text-sm"><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Moderation</th><th className="p-4">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product._id} className="border-b"><td className="p-4 font-semibold">{product.title}{product.moderationNote && <p className="mt-1 text-xs text-red-600">{product.moderationNote}</p>}</td><td className="p-4">₹{product.price.toLocaleString("en-IN")}</td><td className="p-4">{product.stock}</td><td className="p-4 uppercase">{product.moderationStatus}</td><td className="p-4"><div className="flex gap-2"><Link href={`/dashboard/seller/products/${product._id}/edit`} className="border px-3 py-2 text-sm font-bold">Edit</Link><button onClick={() => remove(product._id)} className="border border-red-300 px-3 py-2 text-sm font-bold text-red-700">Delete</button></div></td></tr>)}</tbody></table>{products.length === 0 && <p className="p-6 text-slate-500">No listings yet.</p>}</div>
  </div>;
}

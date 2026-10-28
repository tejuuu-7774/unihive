"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export type ProductFormValue = {
  title: string; description: string; price: number | string; category: string;
  productType: "physical" | "digital" | "service";
  deliveryType: "pickup" | "shipping" | "both";
  stock: number | string; images: string[];
};

const emptyProduct: ProductFormValue = { title: "", description: "", price: "", category: "", productType: "physical", deliveryType: "both", stock: 1, images: [] };

export default function ProductForm({ initial = emptyProduct, productId }: { initial?: ProductFormValue; productId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [imageText, setImageText] = useState(initial.images.join("\n"));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), images: imageText.split("\n").map((v) => v.trim()).filter(Boolean) };
      await apiRequest(productId ? `/products/${productId}` : "/products", productId ? "PUT" : "POST", payload);
      router.push("/dashboard/seller/products"); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save product"); }
    finally { setSaving(false); }
  };

  return <form onSubmit={submit} className="mx-auto max-w-4xl space-y-5 border border-slate-200 bg-white p-6">
    <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">Seller listing</p><h1 className="mt-2 text-3xl font-black">{productId ? "Edit product" : "Add a product"}</h1><p className="mt-2 text-sm text-slate-500">New and edited listings return to admin review.</p></div>
    <label className="block text-sm font-semibold">Title<input className="mt-2 w-full border p-3" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
    <label className="block text-sm font-semibold">Description<textarea className="mt-2 min-h-36 w-full border p-3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
    <div className="grid gap-4 md:grid-cols-3">
      <label className="text-sm font-semibold">Price (₹)<input type="number" min="0" step="0.01" className="mt-2 w-full border p-3" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
      <label className="text-sm font-semibold">Stock<input type="number" min="0" className="mt-2 w-full border p-3" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></label>
      <label className="text-sm font-semibold">Category<input className="mt-2 w-full border p-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Books, Notes, Services…" required /></label>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <label className="text-sm font-semibold">Product type<select className="mt-2 w-full border p-3" value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value as ProductFormValue["productType"] })}><option value="physical">Physical</option><option value="digital">Digital</option><option value="service">Service</option></select></label>
      <label className="text-sm font-semibold">Delivery<select className="mt-2 w-full border p-3" value={form.deliveryType} onChange={(e) => setForm({ ...form, deliveryType: e.target.value as ProductFormValue["deliveryType"] })}><option value="both">Pickup or shipping</option><option value="pickup">Pickup</option><option value="shipping">Shipping</option></select></label>
    </div>
    <label className="block text-sm font-semibold">Image URLs, one per line<textarea className="mt-2 min-h-24 w-full border p-3" value={imageText} onChange={(e) => setImageText(e.target.value)} placeholder="https://…" /></label>
    {error && <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <button disabled={saving} className="bg-slate-900 px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving…" : productId ? "Save changes" : "Create listing"}</button>
  </form>;
}

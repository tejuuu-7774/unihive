"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, assetUrl } from "@/lib/api";
import Image from "next/image";

type Product = {
  _id: string;
  title: string;
  price: number;
  category?: string;
  images?: string[];
  seller?: {
    name?: string;
    collegeName?: string;
  };
};

export default function BrowsePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [productType, setProductType] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async (query = "") => {
    setLoading(true); setError("");
    try {
      const res = await apiRequest(`/products${query ? `?${query}` : ""}`);
      setProducts(res.data?.products || []);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load products"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest("/products")
      .then((res) => { if (active) setProducts(res.data?.products || []); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : "Could not load products"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filter = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (productType) params.set("productType", productType);
    params.set("sortBy", sortBy);
    fetchProducts(params.toString());
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* HEADER */}
      <section className="border border-slate-200 bg-white px-6 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7C3AED]">
          Browse Products
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase text-slate-900">
          Marketplace
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Explore available products across the platform.
        </p>
      </section>

      <form onSubmit={filter} className="grid gap-3 border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_180px_auto]">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, categories…" className="border p-3 text-sm" />
        <select value={productType} onChange={(e) => setProductType(e.target.value)} className="border p-3 text-sm"><option value="">All types</option><option value="physical">Physical</option><option value="digital">Digital</option><option value="service">Services</option></select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-3 text-sm"><option value="newest">Newest</option><option value="priceAsc">Price: low to high</option><option value="priceDesc">Price: high to low</option><option value="ratingDesc">Top rated</option></select>
        <button className="bg-slate-900 px-5 py-3 text-sm font-bold text-white">Apply</button>
      </form>
      {error && <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {/* PRODUCTS GRID */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {loading ? (
          <p className="text-sm text-slate-500">Loading products...</p>
        ) : products.length > 0 ? (
          products.map((p) => (
            <div
              key={p._id}
              className="border border-slate-200 bg-white overflow-hidden hover:shadow-sm transition"
            >

              {/* IMAGE */}
              <div className="h-48 bg-slate-100 flex items-center justify-center">
                {p.images && p.images.length > 0 ? (
                  <Image
                    src={assetUrl(p.images[0])}
                    alt={p.title}
                    width={400}
                    height={300}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-xs text-slate-400">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-3">

                {/* TITLE */}
                <h2 className="text-sm font-bold text-slate-900 line-clamp-2">
                  {p.title}
                </h2>

                {/* CATEGORY */}
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  {p.category || "General"}
                </p>

                {/* SELLER */}
                <p className="text-xs text-slate-500">
                  Seller:{" "}
                  <span className="font-semibold text-slate-700">
                    {p.seller?.name || "Unknown"}
                  </span>
                </p>

                {/* PRICE */}
                <p className="text-lg font-black text-slate-900">
                  ₹{p.price}
                </p>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-2">

                  {/* VIEW / DETAILS */}
                  <Link
                    href={`/dashboard/user/product/${p._id}`}
                    className="flex-1 border border-slate-200 px-3 py-2 text-[10px] font-bold uppercase text-center hover:border-[#7C3AED] hover:text-[#7C3AED]"
                  >
                    View
                  </Link>

                  {/* BUY */}
                  <Link
                    href={`/dashboard/user/product/${p._id}`}
                    className="flex-1 border border-slate-900 bg-slate-900 px-3 py-2 text-[10px] font-bold uppercase text-white hover:bg-[#7C3AED]"
                  >
                    Buy
                  </Link>

                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No products available
          </p>
        )}
      </section>
    </div>
  );
}

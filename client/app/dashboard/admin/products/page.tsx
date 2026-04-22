"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type Product = {
  _id: string;
  title: string;
  price: number;
  moderationStatus: "pending" | "approved" | "rejected";
  seller?: {
    name?: string;
  };
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        const res = await apiRequest("/admin/products");

        if (!active) return;

        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  // ✅ APPROVE / REJECT HANDLER
  const handleModeration = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await apiRequest(`/admin/products/${id}/moderate`, "PUT", {
        status, // ⚠️ IMPORTANT: backend expects THIS
      });

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, moderationStatus: status }
            : p
        )
      );
    } catch (err) {
      console.error("Moderation failed", err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* HEADER */}
      <section className="border border-slate-200 bg-white px-6 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7C3AED]">
          Product Moderation
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase text-slate-900">
          Manage Products
        </h1>
      </section>

      {/* TABLE */}
      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">
            All Products
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-500">
                  Title
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-500">
                  Seller
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-500">
                  Price
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="border-b border-slate-200">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {p.title}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {p.seller?.name || "Unknown"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-900">
                      ₹{p.price}
                    </td>

                    <td className="px-6 py-4 text-sm uppercase">
                      {p.moderationStatus}
                    </td>

                    <td className="px-6 py-4">
                      {p.moderationStatus === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleModeration(p._id, "approved")
                            }
                            className="border border-slate-900 bg-slate-900 px-3 py-2 text-[10px] font-bold uppercase text-white hover:bg-[#7C3AED]"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleModeration(p._id, "rejected")
                            }
                            className="border border-slate-200 px-3 py-2 text-[10px] font-bold uppercase hover:border-[#7C3AED] hover:text-[#7C3AED]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">
                          No action
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
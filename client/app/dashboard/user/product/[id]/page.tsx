"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  category?: string;
  images?: string[];
  stock?: number;
  seller?: {
    name?: string;
    phone?: string;
    collegeName?: string;
  };
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      try {
        const res = await apiRequest(`/products/${id}`);

        if (!active) return;

        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  const handleBuy = async () => {
    try {
      await apiRequest("/orders", "POST", {
        productId: product?._id,
        quantity: 1,
      });

      alert("Order placed successfully!");
      router.push("/dashboard/user/orders");
    } catch (err: unknown) {
    if (err instanceof Error) {
        alert(err.message);
    } else {
        alert("Failed to place order");
    }
    }
  };

  if (loading) {
    return (
      <div className="text-center text-slate-500 py-10">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-slate-500 py-10">
        Product not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* HEADER */}
      <section className="border border-slate-200 bg-white px-6 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7C3AED]">
          Product Details
        </p>
        <h1 className="mt-3 text-2xl font-black text-slate-900">
          {product.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {product.category || "General"}
        </p>
      </section>

      {/* CONTENT */}
      <section className="grid gap-8 md:grid-cols-2">
        {/* IMAGE */}
        <div className="border border-slate-200 bg-white">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              width={600}
              height={400}
              className="w-full h-[350px] object-cover"
            />
          ) : (
            <div className="h-[350px] flex items-center justify-center text-slate-400">
              No Image Available
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="border border-slate-200 bg-white px-6 py-6 space-y-4">
          <p className="text-sm text-slate-500">{product.description}</p>

          <p className="text-2xl font-bold text-slate-900">
            ₹{product.price}
          </p>

          <p className="text-sm text-slate-500">
            Stock: {product.stock ?? 0}
          </p>

          <div className="border-t pt-4">
            <p className="text-xs uppercase text-slate-400">Seller</p>
            <p className="text-sm font-semibold text-slate-900">
              {product.seller?.name || "Unknown"}
            </p>
            <p className="text-sm text-slate-500">
              {product.seller?.collegeName || ""}
            </p>
            <p className="text-sm text-slate-500">
              {product.seller?.phone || ""}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="pt-4 flex gap-3">
            <button
              onClick={handleBuy}
              className="flex-1 bg-black text-white py-2 text-sm font-bold uppercase"
            >
              Buy Now
            </button>

            {product.seller?.phone && (
              <a
                href={`https://wa.me/${product.seller.phone}`}
                target="_blank"
                className="flex-1 border border-slate-300 text-center py-2 text-sm font-bold uppercase"
              >
                Chat
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
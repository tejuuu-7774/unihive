"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm, { ProductFormValue } from "@/components/seller/ProductForm";
import { apiRequest } from "@/lib/api";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductFormValue | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiRequest("/products/my").then((res) => {
      const list = Array.isArray(res) ? res : res.data || [];
      const found = list.find((item: ProductFormValue & { _id: string }) => item._id === id);
      if (!found) throw new Error("Product not found");
      setProduct(found);
    }).catch((err) => setError(err.message));
  }, [id]);
  if (error) return <p className="text-red-700">{error}</p>;
  return product ? <ProductForm initial={product} productId={id} /> : <p>Loading product…</p>;
}

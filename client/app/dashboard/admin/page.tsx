"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type User = {
  role: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    sellers: 0,
    products: 0,
    pending: 0,
  });

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const [usersRes, verifyRes, productsRes] = await Promise.all([
          apiRequest("/admin/users"),
          apiRequest("/admin/verifications?status=pending"),
          apiRequest("/admin/products"),
        ]);

        if (!active) return;

        const users = usersRes.data || [];
        const verifications = verifyRes.data || [];
        const products = productsRes.data || [];

        setStats({
          users: users.length,
          sellers: users.filter((u: User) => u.role === "seller").length,
          products: products.length,
          pending: verifications.length,
        });
      } catch (err: unknown) {
        console.error(err);
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <section className="border border-slate-200 bg-white px-6 py-6 md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7C3AED]">
          Admin Control Panel
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-slate-900">
          Platform management
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Users", value: stats.users },
          { label: "Sellers", value: stats.sellers },
          { label: "Products", value: stats.products },
          { label: "Pending Approvals", value: stats.pending },
        ].map((stat) => (
          <div key={stat.label} className="border border-slate-200 bg-white px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              {stat.label}
            </p>
            <p className="mt-4 text-3xl font-black text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
            Platform Signals
          </h2>
        </div>

        <div className="px-6 py-6 text-sm text-slate-500 space-y-3">

          <p>
            • {stats.pending} seller requests awaiting review
          </p>

          <p>
            • {stats.sellers} active sellers on platform
          </p>

          <p>
            • {stats.products} products currently listed
          </p>

          <p>
            • Total users: {stats.users}
          </p>

        </div>
      </section>

    </div>
  );
}
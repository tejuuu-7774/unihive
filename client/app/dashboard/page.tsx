"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardHome, normalizeRole } from "@/lib/dashboard";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const routeUser = async () => {
      const user = await getCurrentUser();

      if (!active) {
        return;
      }

      const role = normalizeRole(user?.role);

      if (!user || !role) {
        router.replace("/login");
        return;
      }

      router.replace(getDashboardHome(role));
    };

    routeUser();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div className="border border-slate-200 bg-white px-6 py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
        Preparing your dashboard
      </p>
    </div>
  );
}

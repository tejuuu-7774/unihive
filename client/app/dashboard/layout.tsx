"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { getCurrentUser } from "@/lib/auth";
import {
  getDashboardHome,
  isDashboardPathAllowed,
  normalizeRole,
} from "@/lib/dashboard";
import type { DashboardUser } from "@/lib/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<DashboardUser | null>(null);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      const currentUser = await getCurrentUser();

      if (!active) {
        return;
      }

      const role = normalizeRole(currentUser?.role);

      if (!currentUser || !role) {
        router.replace("/login");
        return;
      }

      if (!isDashboardPathAllowed(pathname, role)) {
        router.replace("/dashboard");
        return;
      }

      setUser({ ...currentUser, role });
      setLoading(false);
    };

    setLoading(true);
    checkAuth();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-slate-900">
        <Image
          src="/logo-icon.png"
          alt="UniHive"
          width={36}
          height={36}
          className="opacity-20"
        />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
          Loading Dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar role={user.role} pathname={pathname} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar
            userName={user.name}
            dashboardHref={getDashboardHome(user.role)}
            role={user.role}
            pathname={pathname}
          />
          <main className="flex-1 bg-white px-6 py-6 md:px-10 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

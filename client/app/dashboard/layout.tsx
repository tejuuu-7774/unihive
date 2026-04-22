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
  type DashboardRole,
} from "@/lib/dashboard";

type SafeUser = {
  name?: string;
  email?: string;
  role: DashboardRole;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SafeUser | null>(null);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      const currentUser = await getCurrentUser();

      if (!active) return;

      const role = normalizeRole(currentUser?.role);

      if (!currentUser || !role) {
        router.replace("/login");
        return;
      }

      if (!isDashboardPathAllowed(pathname, role)) {
        router.replace("/dashboard");
        return;
      }

      setUser({
        name: currentUser.name,
        email: currentUser.email,
        role,
      });

      setLoading(false);
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  // Loading screen
  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-slate-900">
        <Image
          src="/logo-icon.png"
          alt="UniHive"
          width={36}
          height={36}
          style={{ width: "auto", height: "auto" }} // ✅ fix warning
          className="opacity-20"
        />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">
          Loading Dashboard
        </p>
      </div>
    );
  }

  // FINAL RENDER
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
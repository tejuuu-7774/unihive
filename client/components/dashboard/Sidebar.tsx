"use client";

import Image from "next/image";
import Link from "next/link";
import { dashboardNavigation, DashboardRole } from "@/lib/dashboard";

type SidebarProps = {
  role: DashboardRole;
  pathname: string;
};

export default function Sidebar({ role, pathname }: SidebarProps) {
  const items = dashboardNavigation[role];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 px-6 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-3">
            <Image src="/logo-icon.png" alt="UniHive" width={26} height={26} />
            <div>
              <p className="text-sm font-black uppercase tracking-tight text-slate-900">
                UniHive
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                {role} portal
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {items.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center border-l-2 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? "border-[#7C3AED] bg-slate-50 text-slate-900"
                        : "border-transparent text-slate-500 hover:border-[#7C3AED] hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

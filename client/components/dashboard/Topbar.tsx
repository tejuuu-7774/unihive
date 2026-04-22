"use client";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { dashboardNavigation, type DashboardRole } from "@/lib/dashboard";

type TopbarProps = {
  userName?: string;
  dashboardHref: string;
  role: DashboardRole;
  pathname: string;
};

export default function Topbar({
  userName,
  dashboardHref,
  role,
  pathname,
}: TopbarProps) {
  const items = dashboardNavigation[role];

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="px-6 py-4 md:px-10">
        <div className="flex min-h-20 flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href={dashboardHref}
              className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#7C3AED]"
            >
              Dashboard
            </Link>
            <p className="mt-2 text-sm text-slate-500">
              Manage activity, visibility, and account actions in one place.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="border-l border-slate-200 pl-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                Account
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {userName || "UniHive User"}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="mt-4 flex gap-4 overflow-x-auto border-t border-slate-200 pt-4 lg:hidden">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap border-b-2 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] ${
                  isActive
                    ? "border-[#7C3AED] text-slate-900"
                    : "border-transparent text-slate-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

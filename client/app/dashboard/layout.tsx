"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Image 
          src="/logo-icon.png" 
          alt="Loading" 
          width={40} 
          height={40} 
          className="animate-pulse opacity-20" 
        />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
          Verifying Identity
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#7C3AED] selection:text-white flex flex-col">
      {/* Top Header Navigation */}
      <header className="w-full border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-[1500px] flex h-20 items-center justify-between px-8">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Image src="/logo-icon.png" alt="UniHive" width={26} height={26} />
            <span className="text-sm font-black uppercase tracking-tighter">UniHive Portal</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard/market" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Marketplace</Link>
            <Link href="/dashboard/listings" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">My Listings</Link>
            <div className="h-4 w-px bg-slate-200" />
            <LogoutButton />
          </nav>
        </div>
      </header>

      <div className="flex flex-1 mx-auto w-full max-w-[1500px]">
        {/* Architectural Side Nav */}
        <aside className="w-64 border-r border-slate-100 hidden lg:block p-8">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#7C3AED] mb-8">Management</p>
          <ul className="space-y-6">
            <li>
              <Link href="/dashboard" className="text-[11px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Overview
              </Link>
            </li>
            <li>
              <Link href="/dashboard/orders" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Orders
              </Link>
            </li>
            <li>
              <Link href="/dashboard/wallet" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Wallet
              </Link>
            </li>
            <li>
              <Link href="/dashboard/settings" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-2 group">
                <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                Settings
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 md:p-12 bg-slate-50/40 min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
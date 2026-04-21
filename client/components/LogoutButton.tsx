"use client";

import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", "POST");
      router.replace("/login");
      router.refresh();
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all active:scale-95"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Logout
    </button>
  );
}
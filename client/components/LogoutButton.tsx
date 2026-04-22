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
      className="border border-slate-900 bg-slate-900 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:border-[#7C3AED] hover:bg-[#7C3AED]"
    >
      Logout
    </button>
  );
}

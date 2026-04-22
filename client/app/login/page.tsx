"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        router.replace("/dashboard");
      }
    };

    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/auth/login", "POST", form);
      setForm({ email: "", password: "" });
      router.push("/dashboard");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-white text-slate-900 selection:bg-[#7C3AED] selection:text-white">
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `url('/logo-icon.png')`, backgroundSize: "180px", backgroundPosition: "center" }} />

      <div className="relative z-10 w-full max-w-[460px] px-6 py-12">
        <div className="border border-slate-200 bg-white p-12 shadow-xl shadow-slate-100/50">
          <div className="mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <Image
                src="/logo-icon.png"
                alt="UniHive"
                width={28}
                height={28}
                className="group-hover:scale-110 transition-transform"
                style={{ width: "auto", height: "auto" }}
              />
              <span className="text-base font-bold uppercase tracking-tighter">UniHive</span>
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tight">Welcome Back</h1>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <input
                placeholder="STUDENT@UNIVERSITY.EDU"
                type="email"
                autoComplete="off"
                className="w-full border border-slate-200 p-4 text-xs font-bold uppercase tracking-widest focus:border-[#7C3AED] focus:outline-none transition-colors"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <input
                  placeholder="••••••••"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-slate-200 p-4 pr-12 text-xs font-bold uppercase tracking-widest focus:border-[#7C3AED] focus:outline-none transition-colors"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-slate-900 text-white py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#7C3AED] transition-all">
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4 border-t border-slate-100 pt-8">
            <Link href="/register" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#7C3AED]">Create Account</Link>
            <Link href="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors underline underline-offset-4 decoration-slate-200">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

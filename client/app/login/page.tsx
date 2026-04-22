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
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) router.replace("/dashboard");
    };

    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await apiRequest("/auth/login", "POST", form);
      setForm({ email: "", password: "" });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-white text-slate-900">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url('/logo-icon.png')`,
          backgroundSize: "180px",
        }}
      />

      <div className="relative w-full max-w-[460px] px-6 py-12">
        <div className="border border-slate-200 bg-white p-12 shadow-xl shadow-slate-100/50">

          <div className="mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <Image src="/logo-icon.png" alt="UniHive" width={28} height={28} />
              <span className="text-base font-bold uppercase">UniHive</span>
            </Link>
            <h1 className="text-3xl font-black uppercase">Welcome Back</h1>
          </div>

          {/* ✅ KEEP autocomplete ON */}
          <form onSubmit={handleSubmit} autoComplete="on" className="space-y-5">
            
            {/* EMAIL */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Email Address
              </label>
              <input
                name="email"
                autoComplete="email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border border-slate-200 p-4 text-xs font-bold focus:border-[#7C3AED] outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border border-slate-200 p-4 pr-12 text-xs font-bold focus:border-[#7C3AED] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  👁
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-xs font-semibold text-[#7C3AED] bg-purple-50 px-3 py-2 border border-purple-200">
                {error}
              </p>
            )}

            <button className="w-full bg-slate-900 text-white py-5 text-[11px] font-bold uppercase hover:bg-[#7C3AED]">
              Sign In
            </button>
          </form>

          <div className="mt-10 text-center space-y-3">
            <Link href="/register" className="text-xs text-slate-400 hover:text-[#7C3AED]">
              Create Account
            </Link>
            <br />
            <Link href="/" className="text-xs text-slate-300 hover:text-slate-900">
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
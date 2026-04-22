"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");

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
    setError("");

    try {
      await apiRequest("/auth/register", "POST", form);
      setForm({ name: "", email: "", password: "", phone: "" });
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

          {/* Header */}
          <div className="mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
              <Image src="/logo-icon.png" alt="UniHive" width={28} height={28} />
              <span className="text-base font-bold uppercase">UniHive</span>
            </Link>
            <h1 className="text-3xl font-black uppercase">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">

            <input
              name="name"
              autoComplete="off"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Full Name"
              className="w-full border p-4 text-xs font-bold"
            />

            <input
              name="email"
              autoComplete="off"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              placeholder="Email"
              className="w-full border p-4 text-xs font-bold"
            />

            <input
              name="password"
              autoComplete="new-password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              placeholder="Password"
              className="w-full border p-4 text-xs font-bold"
            />

            <input
              name="phone"
              autoComplete="off"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              placeholder="Phone"
              className="w-full border p-4 text-xs font-bold"
            />

            {/* ERROR */}
            {error && (
              <p className="text-xs font-semibold text-[#7C3AED] bg-purple-50 px-3 py-2 border border-purple-200">
                {error}
              </p>
            )}

            <button className="w-full bg-slate-900 text-white py-5 text-[11px] font-bold uppercase hover:bg-[#7C3AED]">
              Register
            </button>
          </form>

          <div className="mt-10 text-center space-y-3">
            <Link href="/login" className="text-xs text-slate-400 hover:text-[#7C3AED]">
              Sign In
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
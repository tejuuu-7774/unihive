"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

// SVGs for cards
const IconStore = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const IconService = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 2v20" /><path d="m17 17-5-5-5 5" /><path d="m17 7-5 5-5-5" />
  </svg>
);

const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-white text-slate-900 selection:bg-[#7C3AED] selection:text-white">
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `url('/logo-icon.png')`, backgroundSize: "180px", backgroundPosition: "center" }} />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation */}
        <nav className="mx-auto flex w-full max-w-[1300px] items-center justify-between px-8 py-8">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 group">
            <Image src="/logo-icon.png" alt="UniHive" width={28} height={28} className="group-hover:opacity-80 transition-opacity" />
            <span className="text-lg font-bold tracking-tighter uppercase text-slate-900">UniHive</span>
          </button>
          <div className="flex items-center gap-8">
            <button onClick={() => router.push("/login")} className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Login</button>
            <button onClick={() => router.push("/register")} className="bg-slate-900 px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-[#7C3AED] transition-all active:scale-95">Join Now</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C3AED] mb-6 block">The Student Marketplace</span>
            <h1 className="text-7xl font-black tracking-tighter sm:text-8xl leading-[0.9]">
              Earn. Sell.<br /> <span className="text-[#7C3AED]">Survive.</span>
            </h1>
            <p className="mt-10 max-w-lg mx-auto text-lg text-slate-500 font-medium leading-relaxed">
              A professional-grade marketplace built for the campus ecosystem. Trade products, share notes, and scale your skills.
            </p>
            <div className="mt-12 flex justify-center gap-2">
              <button onClick={() => router.push("/login")} className="bg-[#7C3AED] px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-slate-900">Start Exploring</button>
              <button onClick={() => router.push("/register")} className="border border-slate-900 px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-50">Start Selling</button>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mx-auto w-full max-w-[1300px] px-8 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <IconStore />, title: "Commerce", desc: "A streamlined system to list, manage, and sell physical goods on campus." },
              { icon: <IconService />, title: "Expertise", desc: "Exchange high-value academic notes and professional creative services." },
              { icon: <IconShield />, title: "Verification", desc: "Campus-exclusive access ensuring security and trust for every transaction." }
            ].map((card, i) => (
              <div key={i} className="border border-slate-200 p-12 hover:border-[#7C3AED] hover:shadow-xl hover:shadow-slate-50 transition-all group">
                <div className="mb-8 text-[#7C3AED] group-hover:scale-110 transition-transform origin-left">{card.icon}</div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">{card.title}</h3>
                <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-[250px]">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
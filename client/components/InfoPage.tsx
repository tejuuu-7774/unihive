import Link from "next/link";

export default function InfoPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900"><article className="mx-auto max-w-3xl border border-slate-200 bg-white p-8 md:p-12"><Link href="/" className="text-sm font-bold text-[#7C3AED]">UniHive</Link><p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">{eyebrow}</p><h1 className="mt-3 text-4xl font-black">{title}</h1><div className="mt-8 space-y-6 text-base leading-7 text-slate-600">{children}</div></article></main>;
}

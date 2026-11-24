import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

type Listing = { kind: "Product" | "Notes" | "Service"; title: string; price: string; seller: string; college: string; tone: string };

// Examples of what students list on UniHive
const COL_A: Listing[] = [
  { kind: "Notes", title: "Engineering Maths II — handwritten, solved PYQs", price: "₹49", seller: "Ananya R.", college: "2nd yr, CSE", tone: "bg-[#EDE7FF]" },
  { kind: "Service", title: "Logo + Instagram kit for your club or startup", price: "₹499", seller: "Kabir S.", college: "3rd yr, Design", tone: "bg-[#FFF3C4]" },
  { kind: "Product", title: "Drafter + engineering drawing kit, barely used", price: "₹250", seller: "Rohit M.", college: "4th yr, Mech", tone: "bg-white" },
  { kind: "Service", title: "Video editing for reels, 24h turnaround", price: "₹300", seller: "Meera T.", college: "2nd yr, BBA", tone: "bg-[#EDE7FF]" },
];
const COL_B: Listing[] = [
  { kind: "Product", title: "Handmade resin keychains and bookmarks", price: "₹120", seller: "Sana K.", college: "1st yr, BA", tone: "bg-white" },
  { kind: "Service", title: "DSA tutoring, one hour on call", price: "₹200", seller: "Arjun P.", college: "3rd yr, IT", tone: "bg-[#FFF3C4]" },
  { kind: "Notes", title: "DBMS cheat sheet + viva questions (PDF)", price: "₹29", seller: "Neha V.", college: "3rd yr, CSE", tone: "bg-[#EDE7FF]" },
  { kind: "Product", title: "Hostel study lamp, works perfectly", price: "₹350", seller: "Imran A.", college: "2nd yr, ECE", tone: "bg-white" },
];

function ListingCard({ l }: { l: Listing }) {
  return (
    <div className={`${l.tone} rounded-2xl border border-[#1B1534]/10 p-5`}>
      <p className="text-xs font-medium text-[#1B1534]/60">{l.kind}</p>
      <p className="mt-2 font-display text-lg font-semibold leading-snug text-[#1B1534]">{l.title}</p>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="hex flex h-8 w-8 items-center justify-center bg-[#7C3AED] text-[11px] font-bold text-white" aria-hidden>
            {l.seller[0]}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-[#1B1534]">{l.seller}</p>
            <p className="text-xs text-[#1B1534]/55">{l.college} · verified</p>
          </div>
        </div>
        <p className="font-display text-xl font-bold text-[#1B1534]">{l.price}</p>
      </div>
    </div>
  );
}

function Column({ items, className }: { items: Listing[]; className: string }) {
  // duplicated so the loop is seamless
  return (
    <div className="w-1/2 overflow-hidden">
      <div className={`flex flex-col gap-4 ${className}`}>
        {[...items, ...items].map((l, i) => (
          <div key={i} aria-hidden={i >= items.length}>
            <ListingCard l={l} />
          </div>
        ))}
      </div>
    </div>
  );
}

const WAYS = [
  {
    title: "Sell what you no longer use",
    text: "Old textbooks, a drafter, a hostel lamp. List it in a minute and let a junior pick it up.",
    eg: ["Used books", "Gadgets", "Hostel stuff"],
  },
  {
    title: "Sell what you can do",
    text: "Design, editing, tutoring, writing, handmade art. Set your price and build a profile with reviews.",
    eg: ["Design", "Tutoring", "Handmade"],
  },
  {
    title: "Buy from someone like you",
    text: "Notes from a senior who passed the exam, a service from a classmate. Cheaper, and you know they're a student.",
    eg: ["Notes", "Second-hand", "Services"],
  },
];

const STEPS = [
  { title: "Get verified", text: "Sign up with your college ID or college email. An admin approves you." },
  { title: "List or browse", text: "Post a product, notes or a service, or search what other students are selling." },
  { title: "Send an order request", text: "The buyer requests, the seller accepts or declines. Or chat on WhatsApp first." },
  { title: "Pay the seller directly", text: "Pay by UPI, then the seller ships or you meet on campus. UniHive takes no fee." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FBFAFF] text-[#1B1534] selection:bg-[#7C3AED] selection:text-white">
      {/* Nav */}
      <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-icon.png" alt="" width={28} height={28} priority className="h-7 w-7 object-contain" />
          <span className="font-display text-xl font-bold">UniHive</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-[#1B1534]/70 hover:text-[#1B1534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7C3AED]">
            Log in
          </Link>
          <Link href="/register" className="rounded-full bg-[#1B1534] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7C3AED] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero: say what it is, then show it */}
      <section className="mx-auto grid w-full max-w-[1200px] items-center gap-12 px-6 pb-20 pt-8 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-14">
        <div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            Buy, sell and earn from students at your college.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-[#1B1534]/70">
            UniHive is a marketplace where every seller is a verified student. Sell your old books, notes or your skills,
            and get paid straight to your UPI.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-full bg-[#7C3AED] px-7 py-4 text-base font-semibold text-white hover:bg-[#6527d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1534]">
              Start selling
            </Link>
            <Link href="/login" className="rounded-full border border-[#1B1534]/25 px-7 py-4 text-base font-semibold hover:border-[#1B1534] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]">
              Browse listings
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#1B1534]/55">Free to join. No fees, no commission.</p>
        </div>

        {/* The listing wall: the one memorable element */}
        <div className="relative" aria-label="Examples of what students list on UniHive" role="img">
          <div className="flex h-[460px] gap-4 overflow-hidden rounded-[2rem] bg-[#7C3AED]/[0.07] p-4 sm:h-[540px] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
            <Column items={COL_A} className="wall-up" />
            <div className="w-1/2 overflow-hidden pt-10">
              <div className="flex flex-col gap-4 wall-down">
                {[...COL_B, ...COL_B].map((l, i) => (
                  <ListingCard key={i} l={l} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three ways in */}
      <section className="border-y border-[#1B1534]/10 bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-20 sm:px-8">
          <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
            Whatever you have, someone on campus needs it.
          </h2>
          <div className="mt-12 divide-y divide-[#1B1534]/10 border-t border-[#1B1534]/10">
            {WAYS.map((w) => (
              <div key={w.title} className="grid gap-4 py-8 md:grid-cols-[1fr_1.2fr_auto] md:items-center md:gap-10">
                <h3 className="font-display text-2xl font-semibold">{w.title}</h3>
                <p className="max-w-md leading-relaxed text-[#1B1534]/70">{w.text}</p>
                <ul className="flex flex-wrap gap-2">
                  {w.eg.map((e) => (
                    <li key={e} className="rounded-full bg-[#EDE7FF] px-3 py-1 text-sm text-[#4c1d95]">{e}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works: a real sequence */}
      <section id="how-it-works" className="mx-auto w-full max-w-[1200px] scroll-mt-8 px-6 py-20 sm:px-8">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">From sign-up to first sale in four steps</h2>
        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="hex flex h-11 w-11 items-center justify-center bg-[#FFC933] font-display text-lg font-bold text-[#1B1534]" aria-hidden>
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 max-w-[17rem] leading-relaxed text-[#1B1534]/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Trust */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-20 sm:px-8">
        <div className="grid items-center gap-10 rounded-[2rem] bg-[#1B1534] p-8 text-white sm:p-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">No strangers. Every seller is a checked student.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/70">
              We review each college ID or email before anyone can sell. Admins moderate listings, and accounts that break
              the rules repeatedly are banned.
            </p>
          </div>
          <div className="rounded-2xl bg-white/[0.07] p-6">
            <p className="text-sm text-white/60">Your verification status</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold">
              <span className="rounded-full bg-white/15 px-4 py-2">Pending</span>
              <span className="text-white/40" aria-hidden>then</span>
              <span className="rounded-full bg-[#FFC933] px-4 py-2 text-[#1B1534]">Approved, you can sell</span>
            </div>
            <p className="mt-5 text-sm text-white/60">You can track it from your dashboard after signing up.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-24 text-center sm:px-8">
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          Your first listing takes about a minute.
        </h2>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/register" className="rounded-full bg-[#7C3AED] px-8 py-4 text-base font-semibold text-white hover:bg-[#6527d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1534]">
            Create your free account
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-white pt-16 pb-8">
      <div className="mx-auto max-w-[1400px] px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-icon.png"
                alt="UniHive"
                width={28}
                height={28}
                style={{ width: "auto", height: "auto" }}
              />
              <span className="text-lg font-bold tracking-tight text-slate-900">UniHive</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              The central hub for campus commerce. Empowering students to build their own economy through secure trading of goods and skills.
            </p>
          </div>

          {/* Marketplace Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Marketplace</h4>
            <ul className="mt-6 space-y-3">
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Digital Notes</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Handmade Goods</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Campus Services</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Student Deals</Link></li>
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Platform</h4>
            <ul className="mt-6 space-y-3">
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">How it Works</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Seller Dashboard</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Verification</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Safety Rules</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Support</h4>
            <ul className="mt-6 space-y-3">
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-slate-500 hover:text-[#7C3AED]">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {currentYear} UniHive. Built for the modern student.
          </p>
          <div className="mt-4 flex items-center gap-6 sm:mt-0">
            {/* Social icons could go here */}
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Verified Campus Partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

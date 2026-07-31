"use client";

import Link from "next/link";

export default function ConsultingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md transition-all duration-300">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex lg:flex-1">
            <Link href="/" className="group flex items-center gap-2 text-md font-sans font-black tracking-[0.2em] text-white hover:text-[#C5A059] transition-colors duration-300">
              <span>SAMUEL ADANUVO</span>
            </Link>
          </div>

          <div className="flex flex-1 justify-end">
            <Link
              href="#booking"
              className="rounded-none bg-[#C5A059] border border-[#C5A059] text-black px-4 py-2 sm:px-6 sm:py-3 text-[9px] sm:text-[10px] font-bold tracking-[0.15em] hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300 hover-scale uppercase whitespace-nowrap"
            >
              BOOK A FREE CALL
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col">{children}</main>

      <footer className="bg-black py-12 px-6 lg:px-8 border-t border-white/5 text-center text-xs text-white/40 tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-sans font-black tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300">
            SAMUEL ADANUVO
          </Link>
          <span>© 2026 SAMUEL ADANUVO. ALL RIGHTS RESERVED.</span>
        </div>
      </footer>
    </>
  );
}

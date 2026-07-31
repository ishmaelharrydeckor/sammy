"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "ABOUT", href: "#about" },
    { name: "PROGRAMS", href: "#programs" },
    { name: "BOOK", href: "#book" },
    { name: "EVENTS", href: "#events" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md transition-all duration-300">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 flex h-16 items-center justify-between" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="#hero" className="group flex items-center gap-2 text-md font-sans font-black tracking-[0.2em] text-white hover:text-[#C5A059] transition-colors duration-300">
            <span>SAMUEL ADANUVO</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-sans text-[10px] font-bold tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300 py-1.5"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex md:flex-1 md:justify-end">
          <Link
            href="#contact"
            className="rounded-none bg-[#C5A059] border border-[#C5A059] text-black px-6 py-3 text-[10px] font-bold tracking-[0.15em] hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300 hover-scale uppercase"
          >
            BOOK NOW
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2.5 text-white/60 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-black px-6 py-6 transition-all duration-300">
          <div className="space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-none px-3 py-2 text-xs font-bold tracking-[0.15em] text-white/60 hover:bg-white/5 hover:text-white transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/5">
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center rounded-none bg-[#C5A059] border border-[#C5A059] text-black px-4 py-2.5 text-xs font-bold tracking-wider hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300"
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

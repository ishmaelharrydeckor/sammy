"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#040405] text-white flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-glow rounded-full blur-[150px] pointer-events-none opacity-40"></div>

      <div className="max-w-md w-full text-center relative z-10 flex flex-col items-center gap-6">
        {/* Monospace Error Code with Accent dot */}
        <div className="flex items-center gap-2 border border-accent/20 bg-accent-glow px-4 py-1.5 rounded-full text-xs font-mono text-accent">
          <Compass className="h-4 w-4 animate-spin-slow" />
          <span>OUT OF BOUNDS</span>
        </div>

        <h1 className="font-display text-8xl font-black tracking-tight text-white uppercase mt-4">
          404
        </h1>

        <h2 className="font-display text-2xl font-bold tracking-tight text-white uppercase">
          Page Not Found
        </h2>

        <p className="font-sans text-sm text-foreground-muted leading-relaxed max-w-sm">
          We construct web experiences with mathematical precision, but this requested link resides outside our mapped grid coordinates.
        </p>

        {/* Back Home CTA */}
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-accent text-zinc-950 px-6 py-3.5 text-xs font-semibold tracking-widest uppercase hover-scale hover-glow transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            RETURN TO BASE
          </Link>
        </div>
      </div>
    </div>
  );
}

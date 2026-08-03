"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ConsultingPageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Consulting",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useGSAP(
    () => {
      // Fade in animations for sections
      const revealElements = gsap.utils.toArray(".reveal-up") as HTMLElement[];
      revealElements.forEach((el) => {
        const yOffset = prefersReducedMotion ? 0 : 20;
        gsap.fromTo(
          el,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Staggered child reveals inside grids
      const revealGroups = gsap.utils.toArray(".reveal-group") as HTMLElement[];
      revealGroups.forEach((group) => {
        const children = group.querySelectorAll(".reveal-child");
        if (children.length > 0) {
          const yOffset = prefersReducedMotion ? 0 : 15;
          gsap.fromTo(
            children,
            { opacity: 0, y: yOffset },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: prefersReducedMotion ? 0 : 0.05,
              ease: "power2.out",
              scrollTrigger: {
                trigger: group,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    },
    { scope: containerRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setStatusMessage("Strategy call request sent! Samuel's team will contact you within 2 business days.");
        setFormData({ name: "", email: "", subject: "Consulting", message: "" });
      } else {
        setStatus("error");
        setStatusMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setStatusMessage("Network error. Please verify your connection and try again.");
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the engagement work?",
      a: "We begin with a full audit of your offer, pricing, and client acquisition in the first stage. From there, you get a custom growth roadmap built around your business. Depending on the level of support you choose, we move into regular strategy sessions, or Samuel and his team implement the system directly with you."
    },
    {
      q: "Is this service virtual or in-person?",
      a: "Both. Virtual consulting runs through video calls with shared documentation. In-person sessions are available depending on location, subject to scheduling."
    },
    {
      q: "What industries do you work with?",
      a: "Samuel works primarily with credentialed professionals and organizations — doctors, lawyers, pharmacists, engineers, and similar service businesses — because the focus is on offers, client acquisition, and pricing structures that fit how these professionals actually get and keep clients."
    },
    {
      q: "What are the payment options?",
      a: "Consulting engagements vary based on the level of support, from a single strategy session to done-with-you and done-for-you models, including yearly contracts for organizations. Payment structures are discussed on your initial strategy call."
    }
  ];

  return (
    <div ref={containerRef} className="bg-black text-[#E2E2E2] min-h-screen">
      {/* 1. Hero Section */}
      <section
        id="hero"
        className="relative min-h-[80vh] w-full flex flex-col justify-center items-center py-20 z-10 bg-black overflow-hidden"
      >
        {/* Mobile Viewport: Centered vertical portrait */}
        <div className="absolute inset-0 z-0 md:hidden">
          <Image
            src="/images/samuel-portrait.png"
            alt="Dr. Samuel K. Adanuvo vertical portrait"
            fill
            priority
            className="object-cover object-[center_15%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-10"></div>
        </div>

        {/* Desktop Viewport: Right-aligned landscape background */}
        <div className="absolute inset-0 z-0 hidden md:block">
          <Image
            src="/images/samuel-hero.png"
            alt="Samuel Adanuvo Consulting"
            fill
            priority
            className="object-cover object-right"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-10"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-3xl flex flex-col justify-center text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase mb-6 block">
              BUSINESS GROWTH CONSULTING
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight mb-8">
              You are just one call away from<br />
              <span className="text-[#C5A059]">multiplied revenue and growing your business</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-light text-white/80 leading-relaxed mb-10 max-w-2xl">
              Samuel works with credentialed professionals and organizations who are good at what they do but don't have a system bringing in clients consistently. He builds the offers and client acquisition systems that turn expertise into recurring revenue.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#booking"
                className="rounded-none bg-[#C5A059] border border-[#C5A059] text-black px-8 py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300 uppercase whitespace-nowrap"
              >
                BOOK A FREE STRATEGY CALL
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Problem Section */}
      <section
        id="problem"
        className="relative bg-[#E2E2E2] py-18 md:py-24 px-6 lg:px-8 z-10 text-black border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="reveal-up mb-16 max-w-3xl">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase block mb-4">
              THE REALITY MOST PROFESSIONALS FACE
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight mb-6">
              Good at the Work, Stuck on Growth
            </h2>
            <p className="text-base sm:text-lg font-light text-black/80 leading-relaxed">
              Most professionals and organizations are excellent at what they do. But without a system bringing in clients, growth depends on referrals, luck, and how hard you're willing to hustle this month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-group items-stretch">
            <div className="reveal-child flex flex-col justify-between p-8 bg-[#DFDFDF] border border-black/5 rounded-none hover:border-[#C5A059]/20 transition-colors duration-300">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-6">
                  PAIN POINT 01
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight mb-4">
                  The Referral Ceiling
                </h3>
                <p className="text-xs sm:text-sm font-light text-black/70 leading-relaxed">
                  You're getting clients, but only through word of mouth. There's no system pulling in new business on its own, so growth stalls the moment referrals slow down.
                </p>
              </div>
            </div>

            <div className="reveal-child flex flex-col justify-between p-8 bg-[#DFDFDF] border border-black/5 rounded-none hover:border-[#C5A059]/20 transition-colors duration-300">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-6">
                  PAIN POINT 02
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight mb-4">
                  The Time-for-Clients Trap
                </h3>
                <p className="text-xs sm:text-sm font-light text-black/70 leading-relaxed">
                  Every new client costs you hours you don't have — chasing leads, following up, closing manually. You haven't built a client acquisition system, you've built another job.
                </p>
              </div>
            </div>

            <div className="reveal-child flex flex-col justify-between p-8 bg-[#DFDFDF] border border-black/5 rounded-none hover:border-[#C5A059]/20 transition-colors duration-300">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-6">
                  PAIN POINT 03
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight mb-4">
                  Generic Marketing Advice
                </h3>
                <p className="text-xs sm:text-sm font-light text-black/70 leading-relaxed">
                  You've tried the generic marketing playbooks, but they weren't built for professionals whose credibility and trust matter more than a flashy ad. Without a system built for how people actually buy from you, you're guessing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Offer Section */}
      <section
        id="offer"
        className="relative bg-black py-18 md:py-24 px-6 lg:px-8 z-10 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="reveal-up mb-16 max-w-3xl">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase block mb-4">
              THE SOLUTION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight text-white mb-6">
              A System Built Around Your Business
            </h2>
            <p className="text-base sm:text-lg font-light text-white/80 leading-relaxed">
              This isn't generic advice. Samuel goes directly into your business, audits what's working and what isn't, and builds the offer and client acquisition system your business actually needs, matched to the level of support that makes sense for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal-group items-stretch">
            <div className="reveal-child p-8 bg-[#0F0F0F] border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-6">
                  PHASE 01
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-4">
                  Full Business Audit
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
                  A deep-dive into your current offer, pricing, client acquisition, and where you're losing potential business.
                </p>
              </div>
            </div>

            <div className="reveal-child p-8 bg-[#0F0F0F] border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-6">
                  PHASE 02
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-4">
                  Custom Growth Roadmap
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
                  A clear, specific plan covering your offer structure, pricing, and the systems needed to bring in clients consistently.
                </p>
              </div>
            </div>

            <div className="reveal-child p-8 bg-[#0F0F0F] border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-6">
                  PHASE 03
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-4">
                  Strategy Sessions
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
                  Regular strategy and accountability sessions with Samuel to implement the roadmap and adjust as you go.
                </p>
              </div>
            </div>

            <div className="reveal-child p-8 bg-[#0F0F0F] border border-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-6">
                  PHASE 04
                </span>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-4">
                  Full Implementation Support
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
                  For clients who want it done with them or done for them, Samuel and his team can build and run the system directly (including ongoing yearly partnerships for organizations.)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Proof Section */}
      <section
        id="proof"
        className="relative bg-[#E2E2E2] py-18 md:py-24 px-6 lg:px-8 z-10 text-black border-t border-black/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="reveal-up text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase block mb-4">
              PROOF OF REAL WORLD RESULTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
              Real Impact, Real Systems
            </h2>
            <p className="text-sm sm:text-base font-light text-black/85 leading-relaxed">
              Samuel's consulting methodologies are backed by years of building real-world platforms, scalable business models, and operations.
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch reveal-group mt-12 md:mt-16">
            <div className="reveal-child flex flex-col justify-between p-8 bg-[#DFDFDF] border border-black/5">
              <div className="flex flex-col gap-4">
                <span className="text-4xl font-serif text-[#C5A059] leading-none select-none">“</span>
                <p className="text-sm sm:text-base font-light text-black/90 italic leading-relaxed">
                  I was introduced to Dr. Samuel Adanuvo through Launch Code 1.0, and it was insightful and beginner-friendly. After just 3 sessions, I finally had the push to start my business. Since then, consulting with him has been a huge blessing — from marketing to finding my ideal customer to answering every question along the way. Starting a business is intimidating, and I'm grateful to have someone this well-versed guiding me even at this early stage.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between text-[10px] font-black text-[#C5A059] tracking-wider uppercase">
                <span>FERNAND K.</span>
                <span className="text-black/40 font-normal">VERIFIED CLIENT</span>
              </div>
            </div>

            <div className="reveal-child flex flex-col justify-between p-8 bg-[#DFDFDF] border border-black/5">
              <div className="flex flex-col gap-4">
                <span className="text-4xl font-serif text-[#C5A059] leading-none select-none">“</span>
                <p className="text-sm sm:text-base font-light text-black/90 italic leading-relaxed">
                  Such an eye-opener. Dr. Samuel refined my offer and showed me exactly how to attract VIP clientele — it's million-dollar knowledge, and I'm grateful for the opportunity to learn directly from him. God bless the work he's doing.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between text-[10px] font-black text-[#C5A059] tracking-wider uppercase">
                <span>DR. J.A.</span>
                <span className="text-black/40 font-normal">VERIFIED CLIENT</span>
              </div>
            </div>

            <div className="reveal-child flex flex-col justify-between p-8 bg-[#DFDFDF] border border-black/5">
              <div className="flex flex-col gap-4">
                <span className="text-4xl font-serif text-[#C5A059] leading-none select-none">“</span>
                <p className="text-sm sm:text-base font-light text-black/90 italic leading-relaxed">
                  Samuel showed me the exact steps to take to get new clients, and retain my old ones. He helped me create systems that ensure consistent cash flow.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between text-[10px] font-black text-[#C5A059] tracking-wider uppercase">
                <span>KWAME G.</span>
                <span className="text-black/40 font-normal">VERIFIED CLIENT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Who This Is For Section */}
      <section
        id="who-it-is-for"
        className="relative bg-black py-18 md:py-24 px-6 lg:px-8 z-10 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="reveal-up mb-16 max-w-3xl">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase block mb-4">
              SUITABILITY AUDIT
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight text-white mb-6">
              Who Samuel Works With
            </h2>
            <p className="text-base sm:text-lg font-light text-white/80 leading-relaxed">
              Samuel does not accept all consulting applications. This program is exclusively built for business owners who meet specific operational criteria:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-group items-stretch">
            <div className="reveal-child p-8 bg-[#0F0F0F] border border-white/5">
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-4">REQUIREMENT 01</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">Steady Operations</h3>
              <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
                You must have an active business generating sales. This program is not for pre-revenue ideas — it is built to optimize, structure, and scale existing cash-flowing entities.
              </p>
            </div>

            <div className="reveal-child p-8 bg-[#0F0F0F] border border-white/5">
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-4">REQUIREMENT 02</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">Commitment to Systems</h3>
              <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
                You must be ready to delegate tasks, restructure pricing, and build system processes. If you want to remain a solo-operator bottleneck forever, this roadmap will not align.
              </p>
            </div>

            <div className="reveal-child p-8 bg-[#0F0F0F] border border-white/5">
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mb-4">REQUIREMENT 03</span>
              <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">Accountability</h3>
              <p className="text-xs sm:text-sm font-light text-white/60 leading-relaxed">
                You must attend the weekly strategy reviews and implement the agreed milestones. Samuel provides the frameworks and mapping, but execution rests on the founder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section
        id="faq"
        className="relative bg-[#E2E2E2] py-18 md:py-24 px-6 lg:px-8 z-10 text-black border-t border-black/10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="reveal-up text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase block mb-4">
              OBJECTION HANDLING
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 reveal-group">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="reveal-child border-b border-black/10 pb-4"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left py-4 focus:outline-none group"
                >
                  <span className="text-base sm:text-lg font-bold uppercase tracking-tight text-black group-hover:text-[#C5A059] transition-colors duration-200">
                    {faq.q}
                  </span>
                  <span className="text-xl font-mono text-[#C5A059] ml-4">
                    {activeFaq === idx ? "—" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    activeFaq === idx ? "max-h-[200px] opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-xs sm:text-sm font-light text-black/70 leading-relaxed pl-2 pb-2">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA Section */}
      <section
        id="booking"
        className="relative bg-black py-18 md:py-24 px-6 lg:px-8 z-10 border-t border-white/5"
      >
        <div className="max-w-3xl mx-auto">
          <div className="reveal-up text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase block mb-4">
              SECURE YOUR FOLD
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight text-white mb-6">
              Book Your Strategy Call
            </h2>
            <p className="text-sm sm:text-base font-light text-white/60 leading-relaxed max-w-xl mx-auto">
              Ready to break the survival cycle? Fill in your details below. Samuel's team will audit your request and contact you to schedule your free strategy call.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="reveal-up space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="name" className="text-[9px] font-mono tracking-widest text-white/40 uppercase mb-2">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={status === "submitting"}
                  className="bg-black border border-white/10 px-4 py-4 text-xs font-mono text-white placeholder:text-white/20 tracking-widest focus:outline-none focus:border-[#C5A059] disabled:opacity-50"
                  placeholder="ENTER YOUR NAME"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-[9px] font-mono tracking-widest text-white/40 uppercase mb-2">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={status === "submitting"}
                  className="bg-black border border-white/10 px-4 py-4 text-xs font-mono text-white placeholder:text-white/20 tracking-widest focus:outline-none focus:border-[#C5A059] disabled:opacity-50"
                  placeholder="ENTER YOUR EMAIL"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="text-[9px] font-mono tracking-widest text-white/40 uppercase mb-2">
                TELL US ABOUT YOUR BUSINESS (CURRENT REVENUE, TEAM SIZE, GOALS) *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={status === "submitting"}
                className="bg-black border border-white/10 px-4 py-4 text-xs font-mono text-white placeholder:text-white/20 tracking-widest focus:outline-none focus:border-[#C5A059] disabled:opacity-50 resize-none"
                placeholder="DESCRIBE YOUR CURRENT SITUATION"
              />
            </div>

            {status === "success" ? (
              <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 p-4 text-xs text-white tracking-wide text-center">
                ✓ {statusMessage}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full rounded-none bg-[#C5A059] border border-[#C5A059] text-black py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300 disabled:opacity-50 uppercase"
                >
                  {status === "submitting" ? "REQUESTING..." : "BOOK A FREE STRATEGY CALL"}
                </button>
                {status === "error" && (
                  <p className="text-xs text-red-500 text-center font-mono">{statusMessage}</p>
                )}
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

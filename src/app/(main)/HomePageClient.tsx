"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Compass, Play } from "lucide-react";
import ThreeScene from "@/components/ThreeScene";
import content from "@/data/site-content.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function StatCounter({ stat, label }: { stat: string; label: string }) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const numericMatch = stat.match(/\d+/);
  const target = numericMatch ? parseInt(numericMatch[0], 10) : null;
  const suffix = stat.replace(/[\d,]/g, "");
  const useComma = stat.includes(",");

  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (target === null) return stat;
    return `0${suffix}`;
  });

  useEffect(() => {
    const el = counterRef.current;
    if (!el || target === null) return;

    let hasTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            hasTriggered = true;
            const counter = { val: 0 };
            gsap.to(counter, {
              val: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                const current = Math.floor(counter.val);
                const formatted = useComma
                  ? current.toLocaleString("en-US")
                  : current.toString();
                setDisplayValue(`${formatted}${suffix}`);
              },
              onComplete: () => {
                const finalFormatted = useComma
                  ? target.toLocaleString("en-US")
                  : target.toString();
                setDisplayValue(`${finalFormatted}${suffix}`);
              },
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [stat, target, suffix, useComma]);

  return (
    <div className="reveal-up flex flex-col items-center text-center p-1 sm:p-2">
      <span
        ref={counterRef}
        className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#C5A059] tracking-tight mb-1 sm:mb-2 block leading-none"
      >
        {displayValue}
      </span>
      <span className="text-[10px] sm:text-xs md:text-sm text-white/70 font-light max-w-[110px] sm:max-w-[220px] leading-tight sm:leading-snug">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [waitlistMessage, setWaitlistMessage] = useState("");

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "Consulting",
    message: ""
  });
  const [contactStatus, setContactStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [contactMessage, setContactMessage] = useState("");

  const [activeOffer, setActiveOffer] = useState<0 | 1>(0);
  const offerTrackRef = useRef<HTMLDivElement>(null);

  const scrollToOffer = (index: 0 | 1) => {
    setActiveOffer(index);
    if (!offerTrackRef.current) return;
    const targetCard = offerTrackRef.current.children[index] as HTMLElement;
    if (targetCard) {
      offerTrackRef.current.scrollTo({
        left: Math.max(0, targetCard.offsetLeft - 16),
        behavior: "smooth",
      });
    }
  };

  const handleOfferScroll = () => {
    if (!offerTrackRef.current) return;
    const { scrollLeft, clientWidth } = offerTrackRef.current;
    const newIndex = scrollLeft > clientWidth * 0.35 ? 1 : 0;
    if (newIndex !== activeOffer) {
      setActiveOffer(newIndex as 0 | 1);
    }
  };

  const [activeTestimonial, setActiveTestimonial] = useState<number>(0);
  const testimonialTrackRef = useRef<HTMLDivElement>(null);

  const scrollToTestimonial = (index: number) => {
    setActiveTestimonial(index);
    if (!testimonialTrackRef.current) return;
    const targetCard = testimonialTrackRef.current.children[index] as HTMLElement;
    if (targetCard) {
      testimonialTrackRef.current.scrollTo({
        left: Math.max(0, targetCard.offsetLeft - 16),
        behavior: "smooth",
      });
    }
  };

  const handleTestimonialScroll = () => {
    if (!testimonialTrackRef.current) return;
    const { scrollLeft, clientWidth } = testimonialTrackRef.current;
    const cardWidth = clientWidth * 0.85;
    const newIndex = Math.min(
      content.testimonials.items.length - 1,
      Math.max(0, Math.round(scrollLeft / (cardWidth || 1)))
    );
    if (newIndex !== activeTestimonial) {
      setActiveTestimonial(newIndex);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistStatus("submitting");
    setWaitlistMessage("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setWaitlistStatus("success");
    } catch (err: any) {
      setWaitlistStatus("error");
      setWaitlistMessage("Something went wrong. Please try again.");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactStatus("submitting");
    setContactMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          projectType: contactForm.subject,
          message: contactForm.message,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit message.");
      }
      setContactStatus("success");
      setContactForm({ name: "", email: "", subject: "Consulting", message: "" });
    } catch (err: any) {
      setContactStatus("error");
      setContactMessage(err.message || "Failed to send message. Please try again.");
    }
  };

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionListener);

    return () => {
      mediaQuery.removeEventListener("change", motionListener);
    };
  }, []);


  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const yOffset = prefersReducedMotion ? 0 : 20;

      // Hero animation timeline
      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: yOffset },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: yOffset * 1.5 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-creds",
          { opacity: 0, y: yOffset },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 },
          "-=0.5"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: yOffset / 2 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-image-wrap",
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
          "-=0.6"
        );

      // Scroll Trigger Reveals
      const reveals = gsap.utils.toArray<HTMLElement>(".reveal-up");
      reveals.forEach((el) => {
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
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Stagger groups (like lists, grids)
      const staggerGroups = gsap.utils.toArray<HTMLElement>(".reveal-group");
      staggerGroups.forEach((group) => {
        const children = group.querySelectorAll(".reveal-child");
        gsap.fromTo(
          children,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: group,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background text-[#E2E2E2] overflow-x-hidden">
      {/* Visual Canvas Backdrop (Restricted to h-[100vh] globally so it unmounts off-screen) */}
      <ThreeScene />

      {/* 1. Hero Section */}
      <section
        id="hero"
        className="relative min-h-[68vh] md:min-h-[74vh] w-full flex flex-col justify-center items-center py-10 md:py-14 z-10 bg-black"
      >
        {/* Background Video / Static image overlay container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!prefersReducedMotion ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={content.hero.image}
              className="w-full h-full object-cover scale-105 -translate-y-4 md:-translate-y-6"
            >
              <source src={content.hero.video || "/videos/hero-speaking.mp4"} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={content.hero.image}
              alt="Dr. Samuel K. Adanuvo presenting live keynotes at business summits"
              fill
              priority
              className="object-cover object-center scale-105 -translate-y-4 md:-translate-y-6"
              sizes="100vw"
          />
          )}
          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/92 via-black/82 to-black/95 z-10"></div>
        </div>

        {/* Content Wrapper aligned with max-w-7xl */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-5xl flex flex-col items-start justify-center text-left">
            <span className="hero-subtitle text-[11px] sm:text-xs font-light tracking-[0.25em] text-[#C5A059] uppercase mb-3 md:mb-4 block text-left">
              {content.hero.subtitle}
            </span>
            <h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black tracking-tight text-white leading-[1.1] mb-4 md:mb-5 max-w-5xl uppercase text-left">
              The Literal <span className="text-[#C5A059] font-black">Cheat Code</span> For <br className="hidden md:inline" />
              Business Growth.
            </h1>
            
            {content.hero.subtext && (
              <p className="hero-creds text-sm sm:text-base md:text-lg font-light text-white/80 leading-relaxed mb-5 md:mb-7 max-w-2xl text-left">
                {content.hero.subtext}
              </p>
            )}
            
            {/* CTA Button */}
            <div className="hero-cta mb-3 md:mb-4">
              <Link
                href="#contact"
                className="inline-flex items-center gap-3 rounded-none border border-[#C5A059] bg-[#C5A059] px-9 py-4.5 text-xs font-bold tracking-[0.2em] text-black hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300 hover-scale uppercase"
              >
                {content.hero.ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="hero-creds text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#C5A059]/80 font-light text-left">
              {content.hero.locations}
            </div>
          </div>
        </div>
      </section>

      {/* Proof Strip Section */}
      <section className="relative border-y border-[#C5A059]/20 bg-gradient-to-b from-black via-[#0a0a0a] to-black py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className={`grid ${content.proofStrip.length === 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"} gap-2 sm:gap-6 md:gap-12`}>
            {content.proofStrip.map((item, idx) => (
              <StatCounter key={idx} stat={item.stat} label={item.label} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Intro Section */}
      <section
        id="intro"
        className="reveal-up relative border-t border-white/5 bg-[#E2E2E2] py-18 md:py-24 px-6 lg:px-8 z-10"
      >
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black tracking-tight leading-relaxed">
            {content.intro.paragraph}
          </p>
        </div>
      </section>

      {/* 3. About Section */}
      <section
        id="about"
        className="relative border-t border-white/5 bg-surface-muted/30 py-18 md:py-24 px-6 lg:px-8 z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* About Left Column */}
            <div className="lg:col-span-7 flex flex-col">
              <span className="reveal-up text-[10px] font-light tracking-[0.25em] text-[#C5A059] uppercase mb-4 block">
                {content.about.badge}
              </span>
              <h2 className="reveal-up text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight uppercase mb-8">
                {content.about.heading}
              </h2>

              {/* Narrative text block */}
              <div className="reveal-group flex flex-col gap-6 text-white/80 text-sm sm:text-base leading-relaxed font-light mb-12 max-w-3xl">
                {content.about.paragraphs.map((p, idx) => (
                  <p key={idx} className="reveal-child">
                    {p}
                  </p>
                ))}
              </div>

              <div className="reveal-up">
                <Link
                  href="#programs"
                  className="inline-flex items-center gap-2 text-xs font-black tracking-[0.15em] text-[#C5A059] uppercase hover:text-white transition-colors group"
                >
                  {content.about.ctaText}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* About Right Column */}
            <div className="lg:col-span-5 flex flex-col items-center mt-12 lg:mt-0">
              <div className="reveal-up relative w-full aspect-[13/16] max-w-[400px] border border-white/10 bg-black group overflow-hidden">
                <Image
                  src={content.about.portraitImage}
                  alt="Corporate portrait of Dr. Samuel K. Adanuvo, CEO and Entrepreneur Educator"
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-102"
                  sizes="(max-width: 768px) 100vw, 400px"
                />

              </div>
              
              <div className="reveal-up w-full max-w-[400px] mt-6 bg-[#0F0F0F] border border-white/5 p-6 flex flex-col gap-3">
                {content.hero.credentials.map((cred, idx) => (
                  <div key={idx} className={`flex flex-col ${idx > 0 ? "border-t border-white/5 pt-3" : ""}`}>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#C5A059] uppercase">{cred.label}</span>
                    <span className="text-xs text-white/80 uppercase mt-0.5 font-semibold">{cred.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Credentials / Proof Section */}
      <section
        id="credentials"
        className="relative border-t border-white/5 bg-[#E2E2E2] pt-28 pb-18 md:py-24 px-6 lg:px-8 z-10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header block with inverted text */}
          <div className="reveal-up text-center mb-16 max-w-2xl mx-auto">

            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight mb-4">
              Sigmart YAE KNUST Expo 2024
            </h2>
            <p className="text-sm sm:text-base font-light text-black/85 leading-relaxed">
              {content.about.expoCallout?.description || "Samuel and the Sigmart YAE team partnered with the KNUST SRC to run a full scale business fair at the Parade Grounds, putting real opportunity in front of thousands of students."}
            </p>
          </div>

          {/* Separate Mobile and Desktop Layouts for Curated Composition */}
          {/* Mobile layout (<md): 2-column grid with dominant image spanning full width on top */}
          <div className="md:hidden grid grid-cols-2 gap-4 max-w-md mx-auto mb-12 reveal-group">
            <div className="col-span-2 aspect-[4/3] relative border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.1)] bg-[#DFDFDF] overflow-hidden group reveal-child">
              <Image
                src="/images/sigmart-fair-2024/sigmart_fair_1.jpg"
                alt="Sigmart YAE Fair 2024 - Cash prize check handover at KNUST"
                fill
                className="object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                sizes="100vw"
              />
            </div>
            <div className="aspect-[4/3] relative border border-black/5 shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-[#DFDFDF] overflow-hidden group reveal-child">
              <Image
                src="/images/sigmart-fair-2024/sigmart_fair_2.jpg"
                alt="Sigmart YAE Fair 2024 - KNUST students photo booths"
                fill
                className="object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                sizes="50vw"
              />
            </div>
            <div className="aspect-[4/3] relative border border-black/5 shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-[#DFDFDF] overflow-hidden group reveal-child">
              <Image
                src="/images/sigmart-fair-2024/sigmart_fair_3.jpg"
                alt="Sigmart YAE Fair 2024 - KNUST Parade Grounds Expo setup"
                fill
                className="object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                sizes="50vw"
              />
            </div>
          </div>

          {/* Desktop layout (>=md): Staggered, Overlapping, Asymmetric Curated Composition */}
          <div className="hidden md:block reveal-group relative md:h-[650px] w-full max-w-5xl mx-auto mb-6">
            {/* Image 1: Cash prize check handover (Largest, dominant, left-center position) */}
            <div className="reveal-child absolute left-0 top-[15%] w-[55%] aspect-[4/3] z-20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 bg-[#DFDFDF] overflow-hidden group">
              <Image
                src="/images/sigmart-fair-2024/sigmart_fair_1.jpg"
                alt="Sigmart YAE Fair 2024 - Cash prize check handover at KNUST"
                fill
                className="object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                sizes="600px"
              />
            </div>

            {/* Image 2: KNUST students photo booth (Medium, right-top position) */}
            <div className="reveal-child absolute right-[5%] top-0 w-[38%] aspect-[4/3] z-10 shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-black/5 bg-[#DFDFDF] overflow-hidden group">
              <Image
                src="/images/sigmart-fair-2024/sigmart_fair_2.jpg"
                alt="Sigmart YAE Fair 2024 - KNUST students photo booths"
                fill
                className="object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                sizes="400px"
              />
            </div>

            {/* Image 3: KNUST Parade Grounds Expo setup (Small, right-bottom overlapping position) */}
            <div className="reveal-child absolute right-[22%] bottom-0 w-[28%] aspect-[4/3] z-30 shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-black/5 bg-[#DFDFDF] overflow-hidden group">
              <Image
                src="/images/sigmart-fair-2024/sigmart_fair_3.jpg"
                alt="Sigmart YAE Fair 2024 - KNUST Parade Grounds Expo setup"
                fill
                className="object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                sizes="300px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Work With Samuel Section */}
      <section
        id="programs"
        className="relative border-t border-white/5 bg-black py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header block */}
          <div className="reveal-up text-center mb-10 sm:mb-14 md:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight uppercase mb-4">
              {content.programs.title}
            </h2>
            <p className="text-sm font-light text-white/50 tracking-wider">
              {content.programs.subtitle}
            </p>
          </div>

          {/* Mobile Offer Switcher Tabs */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => scrollToOffer(0)}
              className={`px-3.5 py-2 text-[10px] font-bold tracking-[0.12em] uppercase border transition-all duration-300 ${
                activeOffer === 0
                  ? "border-[#C5A059] bg-[#C5A059] text-black"
                  : "border-white/10 bg-black text-white/60 hover:text-white"
              }`}
            >
              {content.programs.offers[0].badge}: {content.programs.offers[0].title}
            </button>
            <button
              type="button"
              onClick={() => scrollToOffer(1)}
              className={`px-3.5 py-2 text-[10px] font-bold tracking-[0.12em] uppercase border transition-all duration-300 ${
                activeOffer === 1
                  ? "border-[#C5A059] bg-[#C5A059] text-black"
                  : "border-white/10 bg-black text-white/60 hover:text-white"
              }`}
            >
              {content.programs.offers[1].badge}: {content.programs.offers[1].title}
            </button>
          </div>

          {/* Mobile Swipe Cue & Indicator Dots */}
          <div className="flex lg:hidden items-center justify-between text-[10px] font-mono tracking-widest text-[#C5A059]/75 uppercase mb-4 px-1">
            <span>← Swipe to explore offers →</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeOffer === 0 ? "w-5 bg-[#C5A059]" : "w-1.5 bg-white/30"
                }`}
              />
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeOffer === 1 ? "w-5 bg-[#C5A059]" : "w-1.5 bg-white/30"
                }`}
              />
            </div>
          </div>

          {/* Cards Track: Horizontal Swipe on Mobile, 2-Column Grid on Desktop */}
          <div
            ref={offerTrackRef}
            onScroll={handleOfferScroll}
            className="flex lg:grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none items-stretch -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {/* Offer 1: Flagship 90-Day Consulting (spans 6 columns on desktop, 88vw snap card on mobile) */}
            <div className="w-[88vw] sm:w-[480px] lg:w-auto flex-shrink-0 snap-center lg:flex-initial lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 lg:p-10 border border-[#C5A059]/30 rounded-none relative overflow-hidden group hover:border-[#C5A059]/60 transition-colors duration-300">
              {/* Full-bleed background photo with dark gradient overlay */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={content.hero.image}
                  alt="Samuel Adanuvo presenting at a workshop, background image for Consulting Offer"
                  fill
                  className="object-cover object-right group-hover:scale-102 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/97"></div>
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[450px] lg:min-h-full">
                <div>
                  <span className="text-[9px] font-light tracking-[0.25em] text-[#C5A059] uppercase bg-[#C5A059]/10 border border-[#C5A059]/20 px-3 py-1 inline-block mb-6 sm:mb-8">
                    {content.programs.offers[0].badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white uppercase mb-4 sm:mb-6 leading-tight">
                    {content.programs.offers[0].title}
                  </h3>
                  <p className="text-sm sm:text-[15px] font-light text-white/80 leading-relaxed mb-6 sm:mb-8">
                    {content.programs.offers[0].description}
                  </p>

                  <div className="border-t border-white/10 pt-6 sm:pt-8 mb-8 sm:mb-12">
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase mb-4">
                      {content.programs.offers[0].featuresTitle}
                    </h4>
                    <ul className="space-y-3">
                      {content.programs.offers[0].features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-white/95 font-light">
                          <span className="text-[#C5A059] font-bold">✓</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {content.programs.offers[0].closing && (
                    <p className="text-xs text-white/70 italic mb-6 sm:mb-8 font-light leading-relaxed">
                      {content.programs.offers[0].closing}
                    </p>
                  )}
                </div>

                <div>
                  <Link
                    href="#contact"
                    className="w-full text-center inline-flex justify-center items-center rounded-none bg-[#C5A059] border border-[#C5A059] text-black px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300 hover-scale uppercase"
                  >
                    {content.programs.offers[0].ctaText}
                  </Link>
                </div>
              </div>
            </div>

            {/* Offer 2: Speaking Engagements (spans 6 columns on desktop, 88vw snap card on mobile) */}
            <div className="w-[88vw] sm:w-[480px] lg:w-auto flex-shrink-0 snap-center lg:flex-initial lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 bg-black border border-white/5 rounded-none relative overflow-hidden group hover:border-white/10 transition-colors duration-300 items-stretch">
              {/* Left Text Panel */}
              <div className="sm:col-span-7 md:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full border-b sm:border-b-0 sm:border-r border-white/5">
                <div>
                  <span className="text-[9px] font-light tracking-[0.25em] text-white/50 uppercase bg-white/5 border border-white/10 px-3 py-1 inline-block mb-6 sm:mb-8">
                    {content.programs.offers[1].badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white uppercase mb-4 sm:mb-6 leading-tight">
                    {content.programs.offers[1].title}
                  </h3>
                  <p className="text-sm sm:text-[15px] font-light text-white/75 leading-relaxed mb-6 sm:mb-8">
                    {content.programs.offers[1].description}
                  </p>

                  <div className="border-t border-white/5 pt-6 sm:pt-8 mb-6 sm:mb-8">
                    <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase mb-4">
                      {content.programs.offers[1].featuresTitle}
                    </h4>
                    <ul className="space-y-3">
                      {content.programs.offers[1].features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-white/90 font-light">
                          <span className="text-[#C5A059] font-bold">↳</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {content.programs.offers[1].closing && (
                    <p className="text-[10px] text-white/40 italic mb-6 sm:mb-8 font-light leading-relaxed">
                      {content.programs.offers[1].closing}
                    </p>
                  )}
                </div>

                <div>
                  <Link
                    href="#contact"
                    className="w-full text-center inline-flex justify-center items-center rounded-none border border-white/20 bg-transparent text-[#C5A059] px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-bold tracking-[0.2em] hover:bg-white/5 transition-all duration-300 uppercase"
                  >
                    {content.programs.offers[1].ctaText}
                  </Link>
                </div>
              </div>

              {/* Right Full-Height Photo Panel */}
              <div className="sm:col-span-5 md:col-span-4 relative min-h-[220px] sm:min-h-full w-full bg-zinc-950 overflow-hidden">
                <Image
                  src="/images/mmm-1.0/mmm_6.jpg"
                  alt="Dr. Samuel K. Adanuvo speaking engagement"
                  fill
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Book Showcase Section */}
      <section
        id="book"
        className="relative bg-[#E2E2E2] py-18 md:py-24 px-6 lg:px-8 z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Book Cover Image Column (Spans 5) */}
            <div className="lg:col-span-5 flex justify-center reveal-up">
              <div className="relative w-full aspect-[3/4] max-w-[360px] bg-black border border-black/10 shadow-[0_30px_60px_rgba(0,0,0,0.15)] group overflow-hidden">
                <Image
                  src={content.book.coverImage}
                  alt="Front cover of Samuel Adanuvo's book - The Economy of the Young African Mind"
                  fill
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
                <div className="absolute inset-0 border border-black/5 pointer-events-none"></div>
              </div>
            </div>

            {/* Book Text & Form Column (Spans 7) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h2 className="reveal-up text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black leading-tight uppercase mb-8">
                {content.book.title}
              </h2>
              
              <p className="reveal-up text-sm sm:text-base font-light text-black/85 leading-relaxed mb-8 max-w-xl">
                {content.book.description}
              </p>

              {/* Extract Quote block */}
              <div className="reveal-up pl-6 border-l-2 border-[#C5A059] mb-12 max-w-xl">
                <blockquote className="text-base sm:text-lg italic text-black/90 font-light leading-relaxed mb-2 font-serif">
                  {content.book.quote}
                </blockquote>
                <cite className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase not-italic">
                  {content.book.quoteSource}
                </cite>
              </div>

              {/* Status and Waitlist Form */}
              <div className="reveal-up bg-[#DFDFDF] border border-black/5 p-8 max-w-lg">
                <h3 className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase mb-2">
                  {content.book.status}
                </h3>
                <p className="text-xs text-black/60 font-light mb-6">
                  Sign up with your email to get notified when the book goes live.
                </p>

                {waitlistStatus === "success" ? (
                  <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 p-4 text-xs text-black tracking-wide">
                    ✓ SUCCESS: You have been added to the waitlist. We will notify you at <span className="font-bold">{waitlistEmail}</span>.
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      placeholder="ENTER YOUR EMAIL"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      disabled={waitlistStatus === "submitting"}
                      className="flex-grow bg-[#E2E2E2] border border-black/10 px-4 py-4 text-xs font-mono text-black placeholder:text-black/40 tracking-widest focus:outline-none focus:border-[#C5A059] disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={waitlistStatus === "submitting"}
                      className="bg-[#C5A059] border border-[#C5A059] text-black px-6 py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300 disabled:opacity-50 uppercase whitespace-nowrap"
                    >
                      {waitlistStatus === "submitting" ? "JOINING..." : content.book.ctaText}
                    </button>
                  </form>
                )}
                {waitlistStatus === "error" && (
                  <p className="text-xs text-red-600 mt-2 font-mono">{waitlistMessage}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Events & Recap Section */}
      <section
        id="events"
        className="relative border-t border-white/5 bg-black py-18 md:py-24 px-6 lg:px-8 z-10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="reveal-up text-center mb-20">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase block mb-4">
              BROADCASTS & INITIATIVES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight uppercase">
              Events & Education
            </h2>
          </div>

          <div className="space-y-24">
            {/* UPCOMING EVENT PLACEHOLDER */}
            <div className="reveal-up border border-[#C5A059]/30 bg-gradient-to-br from-[#0F0F0F] via-black to-[#0F0F0F] p-8 md:p-12 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-col max-w-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                    <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A059] uppercase font-bold">
                      UPCOMING INITIATIVE
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase mb-3">
                    Next Event: To Be Announced
                  </h3>
                  <p className="text-sm sm:text-base font-light text-white/80 leading-relaxed">
                    Follow Samuel on YouTube and Instagram to hear first.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://youtube.com/@sammyadanuvo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-none border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-bold tracking-[0.15em] text-white hover:bg-white/10 hover:border-white/40 transition-all uppercase"
                  >
                    YouTube
                  </a>
                  <a
                    href="https://www.instagram.com/sammy_adanuvo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-none border border-[#C5A059] bg-[#C5A059] px-6 py-3.5 text-xs font-bold tracking-[0.15em] text-black hover:bg-[#a3803f] transition-all uppercase"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-white/10 my-16"></div>

            {/* PAST EVENTS SECTION SUB-HEADER */}
            <div className="reveal-up text-left mb-12">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase block mb-3">
                RECORDED & DELIVERED
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Past Events
              </h3>
            </div>

            {/* Entry 1: The Success Wavelength (Past Live Broadcast) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border border-white/5 bg-[#0A0A0A] p-6 md:p-10 mb-16">
              <div className="lg:col-span-5 flex justify-center reveal-up">
                <div className="relative w-full aspect-square max-w-[340px] overflow-hidden bg-black border border-white/10">
                  <Image
                    src="/images/events/success-wavelength.jpg"
                    alt="The Success Wavelength - YouTube Live Broadcast"
                    fill
                    className="object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 100vw, 340px"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center reveal-up">
                <span className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase font-bold mb-2">
                  📅 SUNDAY, AUGUST 9TH, 2026
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                  The Success Wavelength
                </h4>
                <p className="text-sm sm:text-base font-light text-white/80 leading-relaxed mb-6 max-w-xl">
                  A free live broadcast on the mindset behind lasting success.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase border border-white/10 px-3 py-1.5 bg-white/5">
                    PLATFORM: YOUTUBE LIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Entry 1: Minds, Markets & Movements 1.0 (Past Live Summit) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Left Column: Text Details (Spans 5) */}
              <div className="lg:col-span-5 flex flex-col justify-center reveal-up">
                <h3 className="text-3xl font-black tracking-tight text-white uppercase leading-tight mb-4">
                  {content.events.headline || "MMM 1.0 SUMMIT"}
                </h3>
                <div className="text-xs font-mono tracking-widest text-[#C5A059] uppercase mb-6">
                  📅 {content.events.locationTime || "JULY 2026 · KNUST, KUMASI"}
                </div>
                <p className="text-sm sm:text-base font-light text-white/85 leading-relaxed mb-8 max-w-md">
                  {content.events.description || "120 young entrepreneurs, one day, serious strategy. Conceived, led and delivered by Samuel."}
                </p>

                {/* Event Info Bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8 border-b border-white/5 mb-8">
                  <div>
                    <span className="text-[10px] font-bold text-[#C5A059] tracking-wider block mb-1">AUDIENCE</span>
                    <p className="text-xs text-white/60 font-light leading-relaxed">
                      Ambitious student leaders, young entrepreneurs, and innovators.
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#C5A059] tracking-wider block mb-1">FOCUS</span>
                    <p className="text-xs text-white/60 font-light leading-relaxed">
                      Rewiring mindset to building mode, backed by systems.
                    </p>
                  </div>
                </div>

                <div>
                  <a
                    href="#mmm-gallery"
                    className="inline-flex items-center gap-3 rounded-none border border-[#C5A059] bg-[#C5A059] px-8 py-4 text-xs font-bold tracking-[0.2em] text-black hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300 uppercase"
                  >
                    {content.events.ctaText || "See Highlights"}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Featured Visual Carousel (Spans 7) */}
              <div id="mmm-gallery" className="lg:col-span-7 reveal-up flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
                    MMM 1.0 Summit Action Gallery
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase hidden sm:block">
                    ← Swipe to explore photos →
                  </span>
                </div>
                
                {/* Scrolling Track */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-thin select-none">
                  {[
                    { src: "/images/mmm-1.0/mmm_1.jpg", caption: "Engaged audience absorbing strategic concepts" },
                    { src: "/images/mmm-1.0/mmm_2.jpg", caption: "Samuel with summit delegates" },
                    { src: "/images/mmm-1.0/mmm_3.jpg", caption: "Delegates group photograph at KNUST" },
                    { src: "/images/mmm-1.0/mmm_4.jpg", caption: "Selfie with the energetic crowd" },
                    { src: "/images/mmm-1.0/mmm_5.jpg", caption: "Focus and dedication in the audience" },
                    { src: "/images/mmm-1.0/mmm_6.jpg", caption: "Samuel delivering the keynote address" },
                    { src: "/images/mmm-1.0/mmm_7.jpg", caption: "Interactive Q&A session with attendees" },
                    { src: "/images/mmm-1.0/mmm_8.jpg", caption: "Exploring the mechanics of business strategy" },
                    { src: "/images/mmm-1.0/mmm_9.jpg", caption: "Speaker presenting on key frameworks" }
                  ].map((img, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start bg-[#0F0F0F] border border-white/5 p-2 group"
                    >
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
                        <Image
                          src={img.src}
                          alt={img.caption}
                          fill
                          className="object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                          sizes="320px"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Entry 2: Making Impact Summit (Past Campus Event Recap) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center pt-16 border-t border-white/5">
              {/* Left Column: Featured Visual Poster (Spans 5) */}
              <div className="lg:col-span-5 flex justify-center reveal-up">
                <div className="relative w-full aspect-[4/5] max-w-[340px] bg-[#0F0F0F] border border-white/5 p-6 flex flex-col gap-6 relative overflow-hidden group">
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-black border border-white/5">
                    <Image
                      src="/images/online-event/an-online-event.jpg"
                      alt="Making Impact Through Entrepreneurship Summit Poster"
                      fill
                      className="object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Text Details (Spans 7) */}
              <div className="lg:col-span-7 flex flex-col justify-center reveal-up">
                <h3 className="text-3xl font-black tracking-tight text-white uppercase leading-tight mb-6">
                  Making Impact Through Entrepreneurship
                </h3>
                <p className="text-sm sm:text-base font-light text-white/80 leading-relaxed mb-8 max-w-xl">
                  A training session with POSSA KNUST on building sustainable ventures.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-white/5 max-w-lg">
                  <div>
                    <span className="text-[10px] font-bold text-[#C5A059] tracking-wider block mb-1">VENUE</span>
                    <p className="text-xs text-white/60 font-light leading-relaxed">
                      CCB Auditorium, KNUST, Kumasi, Ghana.
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#C5A059] tracking-wider block mb-1">DATE & TIME</span>
                    <p className="text-xs text-white/60 font-light leading-relaxed">
                      18th March 2023 | 10:00 AM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 5.5 Featured Video Insights Section */}
      {content.videoInsights && (
        <section
          id="video-insights"
          className="relative border-t border-black/10 bg-[#E2E2E2] py-18 md:py-24 px-6 lg:px-8 z-10 text-black"
        >
          <div className="max-w-7xl mx-auto">
            <div className="reveal-up text-center mb-16 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
                  VIDEO INSIGHTS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight mb-4">
                {content.videoInsights.title}
              </h2>
              <p className="text-sm sm:text-base font-light text-black/85 leading-relaxed">
                {content.videoInsights.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch reveal-group">
              {content.videoInsights.items.map((video, idx) => {
                // Helper to extract YouTube ID
                const getYoutubeId = (url: string) => {
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                  const match = url.match(regExp);
                  return (match && match[2].length === 11) ? match[2] : null;
                };
                const videoId = getYoutubeId(video.url);
                const thumbnailUrl = videoId 
                  ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                  : "";

                return (
                  <div
                    key={idx}
                    className="reveal-child flex flex-col justify-between p-6 bg-[#DFDFDF] border border-black/5 hover:border-[#C5A059]/20 transition-all duration-300 group"
                  >
                    <div>
                      {/* Video Thumbnail Visual */}
                      {thumbnailUrl && (
                        <div className="relative w-full aspect-video mb-6 border border-black/5 bg-[#DFDFDF] overflow-hidden">
                          <Image
                            src={thumbnailUrl}
                            alt={`${video.title} Video Lesson Widescreen Thumbnail`}
                            fill
                            className="object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                            sizes="(max-width: 768px) 100vw, 350px"
                          />
                          {/* Play overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors duration-300">
                            <div className="h-10 w-14 rounded-lg bg-[#FF0000] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                              <Play className="h-5 w-5 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>
                      )}

                      <span className="text-[8px] font-mono tracking-widest text-[#C5A059] uppercase bg-[#C5A059]/10 border border-[#C5A059]/20 px-2 py-0.5 self-start mb-4 inline-block font-bold">
                        {video.tag}
                      </span>
                      <h3 className="text-base font-bold uppercase tracking-tight text-black mb-3 group-hover:text-[#C5A059] transition-colors duration-200">
                        {video.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-light text-black/75 leading-relaxed">
                        {video.desc}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black text-[#C5A059] tracking-wider uppercase hover:text-black transition-colors duration-200"
                      >
                        Watch on YouTube <span>→</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. Testimonials Section (Relocated on Light Background) */}
      <section
        id="testimonials"
        className="relative border-t border-black/10 bg-[#E2E2E2] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="reveal-up text-center mb-10 sm:mb-14 md:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black leading-tight uppercase mb-4">
              {content.testimonials.title}
            </h2>
            <p className="text-sm font-light text-black/50 tracking-wider">
              Feedback from builders who implemented the strategies.
            </p>
          </div>

          {/* Mobile Testimonials Switcher Tabs */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
            {content.testimonials.items.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToTestimonial(idx)}
                className={`px-3 py-2 text-[10px] font-bold tracking-[0.12em] uppercase border transition-all duration-300 shrink-0 ${
                  activeTestimonial === idx
                    ? "border-[#C5A059] bg-[#C5A059] text-black"
                    : "border-black/10 bg-white/50 text-black/60 hover:text-black"
                }`}
              >
                {item.author}
              </button>
            ))}
          </div>

          {/* Mobile Swipe Cue & Indicator Dots */}
          <div className="flex md:hidden items-center justify-between text-[10px] font-mono tracking-widest text-black/60 uppercase mb-4 px-1">
            <span>← Swipe to read testimonials →</span>
            <div className="flex items-center gap-1.5">
              {content.testimonials.items.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === idx ? "w-5 bg-[#C5A059]" : "w-1.5 bg-black/25"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Testimonials Track: Horizontal Swipe on Mobile, 3-Column Grid on Desktop */}
          <div
            ref={testimonialTrackRef}
            onScroll={handleTestimonialScroll}
            className="flex md:grid md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none items-stretch -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] reveal-group"
          >
            {content.testimonials.items.map((item, idx) => (
              <div
                key={idx}
                className="w-[85vw] sm:w-[380px] md:w-auto flex-shrink-0 snap-center md:flex-initial reveal-child flex flex-col justify-between p-6 sm:p-8 md:p-10 bg-[#DFDFDF] border border-black/5 hover:border-[#C5A059]/20 transition-colors duration-300 group"
              >
                <div className="flex flex-col gap-4 sm:gap-6">
                  <span className="text-3xl sm:text-4xl font-serif text-[#C5A059] leading-none select-none">
                    “
                  </span>
                  <p className="text-sm sm:text-base md:text-[17px] font-light text-black/90 italic leading-relaxed">
                    {item.quote.replace(/[“”]/g, "")}
                  </p>
                </div>
                <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-black/10 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-[#C5A059] uppercase">
                    {item.author}
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-black/40 uppercase">
                    VERIFIED CLIENT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact Section */}
      <section
        id="contact"
        className="relative border-t border-white/5 bg-black py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-start">
            
            {/* Left Info Column (Spans 5) */}
            <div className="lg:col-span-5 flex flex-col reveal-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight uppercase mb-4 sm:mb-6">
                {content.contact.title}
              </h2>
              <p className="text-sm sm:text-base font-light text-white/75 leading-relaxed mb-8 sm:mb-12 max-w-md">
                {content.contact.description}
              </p>

              {/* Direct Channels */}
              <div className="flex flex-col gap-6 border-t border-white/5 pt-8 sm:pt-12">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
                    EMAIL INQUIRIES
                  </span>
                  <a
                    href={`mailto:${content.contact.email}`}
                    className="text-xs sm:text-sm font-black text-white hover:text-[#C5A059] transition-colors mt-1 tracking-wider break-all"
                  >
                    {content.contact.email}
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
                    OFFICE LOCATION
                  </span>
                  <span className="text-sm text-white/80 font-light mt-1 tracking-wide">
                    {content.contact.office}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Form Column (Spans 7) */}
            <div className="lg:col-span-7 reveal-up bg-[#0F0F0F] border border-white/5 p-6 sm:p-8 md:p-12">
              {contactStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="text-3xl text-[#C5A059] mb-4">✓</span>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">
                    Message Sent Successfully
                  </h3>
                  <p className="text-xs text-white/60 font-light max-w-sm">
                    Thank you for reaching out. Samuel's team will review your inquiry and respond to you within 2 business days.
                  </p>
                  <button
                    onClick={() => setContactStatus("idle")}
                    className="mt-8 border border-white/20 bg-transparent text-white px-6 py-3 text-xs font-bold tracking-[0.2em] hover:bg-white/5 transition-all uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
                        {content.contact.form.nameLabel}
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        disabled={contactStatus === "submitting"}
                        className="bg-black border border-white/10 px-4 py-3.5 sm:py-4 text-xs font-mono text-white tracking-widest focus:outline-none focus:border-[#C5A059] disabled:opacity-50"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
                        {content.contact.form.emailLabel}
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        disabled={contactStatus === "submitting"}
                        className="bg-black border border-white/10 px-4 py-3.5 sm:py-4 text-xs font-mono text-white tracking-widest focus:outline-none focus:border-[#C5A059] disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Subject Options (Subject Selection Group) */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
                      {content.contact.form.subjectLabel}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                      {content.contact.form.subjectOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setContactForm({ ...contactForm, subject: opt })}
                          disabled={contactStatus === "submitting"}
                          className={`py-3 px-2 text-[9px] sm:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase border transition-all duration-300 text-center ${
                            contactForm.subject === opt
                              ? "bg-[#C5A059] border-[#C5A059] text-black"
                              : "bg-black border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-[9px] font-mono tracking-widest text-white/50 uppercase">
                      {content.contact.form.messageLabel}
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      disabled={contactStatus === "submitting"}
                      className="bg-black border border-white/10 px-4 py-3.5 sm:py-4 text-xs font-light text-white tracking-wide focus:outline-none focus:border-[#C5A059] disabled:opacity-50 resize-none leading-relaxed"
                    ></textarea>
                  </div>

                  {contactStatus === "error" && (
                    <p className="text-xs text-red-500 font-mono">{contactMessage}</p>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={contactStatus === "submitting"}
                      className="w-full bg-[#C5A059] border border-[#C5A059] text-black py-4 sm:py-5 text-xs font-bold tracking-[0.2em] hover:bg-[#a3803f] hover:border-[#a3803f] transition-all duration-300 disabled:opacity-50 uppercase"
                    >
                      {contactStatus === "submitting" ? "SENDING..." : content.contact.form.ctaText}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

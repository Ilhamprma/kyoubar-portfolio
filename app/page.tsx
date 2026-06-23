"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, YoutubeLogo, InstagramLogo, TiktokLogo, Play, X, Check, WhatsappLogo } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import videosData from "../content/videos.json";
import pricingData from "../content/pricing.json";
import testimonialsData from "../content/testimonials.json";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", service: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useGSAP(() => {
    // Bento grid cards scale & reveal scroll animation
    const cards = gsap.utils.toArray(".bento-card");
    gsap.fromTo(cards,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".bento-grid-container",
          start: "top 85%",
          end: "bottom 60%",
          toggleActions: "play none none none"
        }
      }
    );

    // About paragraph word opacity reveal on scroll scrub
    if (aboutTextRef.current) {
      const words = aboutTextRef.current.querySelectorAll(".reveal-word");
      gsap.fromTo(words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.02,
          scrollTrigger: {
            trigger: aboutTextRef.current,
            start: "top 85%",
            end: "bottom 65%",
            scrub: 0.5,
          }
        }
      );
    }
  }, { scope: containerRef });

  // Parallax Scroll Effect
  const { scrollY } = useScroll();

  // Model image moves down slightly slower than scroll (translateY positive)
  const yModel = useTransform(scrollY, [0, 800], [0, 150]);

  const WHATSAPP_NUMBER = "6282210799703"; // Nomor WA aktif Kyoubar

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Halo Kyoubar! Saya ${formData.name} ingin bertanya mengenai jasa ${formData.service}.\n\nBrief singkat:\n${formData.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  // Close video modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Custom premium spring / bezier easing physics
  const springTransition = {
    type: "spring" as const,
    stiffness: 80,
    damping: 18,
  };

  const easeTransition = {
    duration: 0.8,
    ease: [0.32, 0.72, 0, 1] as const,
  };

  const projects = [
    {
      id: "01",
      title: "ISSUE.001 / CINEMATIC-SHOWREEL",
      category: "CREATIVE DIRECTION · COLOR GRADING",
      desc: "A high-performance visual compilation featuring dynamic camera moves, lifestyle action, and advanced post-production.",
      image: "https://picsum.photos/seed/kyoubarshowreel/1280/720",
      span: "md:col-span-12",
      aspect: "aspect-[16/9] md:aspect-[21/9]",
    },
    {
      id: "02",
      title: "ISSUE.002 / COMMERCIALS-CAMPAIGN",
      category: "ADVERTISING · KINETIC TYPOGRAPHY",
      desc: "Fast paced commercial ads tailored for brand campaigns, product launches, and social-first conversions.",
      image: "https://picsum.photos/seed/kyoubarads/800/600",
      span: "md:col-span-6",
      aspect: "aspect-[4/3]",
    },
    {
      id: "03",
      title: "ISSUE.003 / DOCUMENTARY-STORY",
      category: "LONG FORM · SOUND DESIGN",
      desc: "Engaging narrative pacing, environmental soundscapes, and color consistency designed to optimize viewer retention.",
      image: "https://picsum.photos/seed/kyoubardoc/800/600",
      span: "md:col-span-6",
      aspect: "aspect-[4/3]",
    },
  ];

  const videos = videosData.items;
  const pricingPackages = pricingData.items;
  const testimonials = testimonialsData.items;

  const filteredVideos = activeFilter === "all"
    ? videos
    : videos.filter(v => v.category === activeFilter);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-zinc-100 relative flex flex-col justify-between overflow-x-hidden selection:bg-white selection:text-black font-sans antialiased">

      {/* Ambient Radial Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/30 via-[#050505] to-[#050505] pointer-events-none z-0"></div>

      {/* Full-Bleed Custom Model Hero Background with Parallax */}
      <div className="absolute top-0 left-0 right-0 h-[100dvh] overflow-hidden pointer-events-none z-0">
        <motion.div
          style={{ y: yModel }}
          className="w-full h-full relative"
        >
          <img
            src="/model_custom.jpg"
            alt="Background Model"
            className="w-full h-full object-cover object-center opacity-95 filter contrast-105 brightness-130 saturate-110"
          />
          {/* Seamless horizontal and vertical fade gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent"></div>
        </motion.div>
      </div>

      {/* 1. HERO SECTION */}
      <main className="min-h-[100dvh] w-full max-w-7xl mx-auto px-8 pt-32 pb-16 relative flex flex-col justify-between z-10">
        {/* Top spacer to push content down from Navbar */}
        <div className="h-16 md:h-24"></div>

        {/* Mid-section content (split grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full my-auto">
          {/* Left Column: Heading */}
          <div className="col-span-12 md:col-span-7 flex flex-col items-start text-left">
            <span className="text-zinc-300 text-sm font-sans tracking-wide block mb-4">// Hey, I&apos;m a</span>
            <h1 className="text-6xl sm:text-7xl md:text-[6.5rem] lg:text-[7.5rem] font-black tracking-tighter leading-[0.95] text-white select-none">
              Creative <br />
              Editor
            </h1>
          </div>

          {/* Right Column: Statement & Explainer */}
          <div className="col-span-12 md:col-span-5 flex flex-col justify-center md:items-end text-left md:text-right mt-8 md:mt-0">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 leading-snug max-w-[20ch]">
              Great edits should feel invisible.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-normal tracking-normal max-w-[32ch]">
              From cuts to pacing and color grading, I shape cinematic stories that connect and convert.
            </p>
          </div>
        </div>

        {/* Bottom Section: Capabilities Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full pt-8 border-t border-white/10 z-20">
          {[
            { id: "#01", title: "Video Editing" },
            { id: "#02", title: "Color Grading" },
            { id: "#03", title: "Motion Graphics" },
            { id: "#04", title: "Sound Design" }
          ].map((item) => (
            <div key={item.id} className="flex flex-col gap-1 select-none">
              <span className="text-[10px] font-mono tracking-widest text-[#ff3b00] font-bold">{item.id}</span>
              <span className="text-xs font-black tracking-widest text-white uppercase">{item.title}</span>
            </div>
          ))}
        </div>
      </main>

      {/* 2. WORK SECTION (Bento Grid with Double-Bezel Architecture) */}
      <section id="work" className="w-full max-w-7xl mx-auto px-8 py-32 border-t border-white/10 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springTransition}
          className="mb-20 max-w-2xl"
        >
          <span className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase block mb-4">// SELECTED PROJECTS</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none uppercase text-white">
            Selected Work
          </h2>
          <p className="text-sm md:text-base text-zinc-400 tracking-wide mt-4 uppercase leading-relaxed font-bold">
            ARCHIVE OF CREATIVE EDITS & POST-PRODUCTION COMMISSIONS.
          </p>
        </motion.div>

        {/* Bento Grid (Double-Bezel Cards) */}
        <div className="bento-grid-container grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch grid-flow-dense">
          
          {/* Card 1: Featured Showreel (col-span-12 md:col-span-8) */}
          <div className="col-span-12 md:col-span-8 bento-card group border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between rounded-[2rem] p-1.5 ring-1 ring-white/5 shadow-2xl">
            <div className="border border-white/10 bg-[#0c0c0c] rounded-[calc(2rem-0.375rem)] overflow-hidden flex flex-col h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              {/* Media Area */}
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden border-b border-white/10 bg-zinc-900">
                <img
                  src="https://picsum.photos/seed/kyoubarshowreel/1280/720"
                  alt="ISSUE.001 / CINEMATIC-SHOWREEL"
                  className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 filter grayscale group-hover:grayscale-0 contrast-105"
                />
                <div className="absolute top-4 left-4 bg-black/60 border border-white/10 text-white text-[9px] font-bold font-mono px-2.5 py-1 tracking-widest uppercase">
                  01
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block mb-1">
                    CREATIVE DIRECTION · COLOR GRADING
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase mb-3">
                    ISSUE.001 / CINEMATIC-SHOWREEL
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-bold tracking-wide uppercase max-w-[55ch]">
                    A high-performance visual compilation featuring dynamic camera moves, lifestyle action, and advanced post-production.
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center group-hover:bg-[#ff3b00] group-hover:border-[#ff3b00] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer active:scale-90">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" weight="light" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Stats Block (col-span-12 md:col-span-4) */}
          <div className="col-span-12 md:col-span-4 bento-card group border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between rounded-[2rem] p-1.5 ring-1 ring-white/5 shadow-2xl h-full min-h-[400px]">
            <div className="border border-white/10 bg-[#0c0c0c] rounded-[calc(2rem-0.375rem)] p-8 flex flex-col justify-between h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-6">// METRICS & IMPACT</span>
                <h3 className="text-xl font-black tracking-tight text-white uppercase mb-8 leading-tight">
                  High Retention <br />Editing Studio
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-4xl font-black text-white tracking-tighter">150M+</div>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Total Views Generated</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white tracking-tighter">50+</div>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Global Brand Collaborations</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white tracking-tighter">99.9%</div>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Client Satisfaction Rate</div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Est. 2020</span>
                <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-500 uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Available for commission
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Commercials (col-span-12 md:col-span-6) */}
          <div className="col-span-12 md:col-span-6 bento-card group border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between rounded-[2rem] p-1.5 ring-1 ring-white/5 shadow-2xl">
            <div className="border border-white/10 bg-[#0c0c0c] rounded-[calc(2rem-0.375rem)] overflow-hidden flex flex-col h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              {/* Media Area */}
              <div className="relative w-full aspect-[16/10] overflow-hidden border-b border-white/10 bg-zinc-900">
                <img
                  src="https://picsum.photos/seed/kyoubarads/800/600"
                  alt="ISSUE.002 / COMMERCIALS-CAMPAIGN"
                  className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 filter grayscale group-hover:grayscale-0 contrast-105"
                />
                <div className="absolute top-4 left-4 bg-black/60 border border-white/10 text-white text-[9px] font-bold font-mono px-2.5 py-1 tracking-widest uppercase">
                  02
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block mb-1">
                    ADVERTISING · KINETIC TYPOGRAPHY
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase mb-3">
                    ISSUE.002 / COMMERCIALS-CAMPAIGN
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-bold tracking-wide uppercase max-w-[55ch]">
                    Fast paced commercial ads tailored for brand campaigns, product launches, and social-first conversions.
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center group-hover:bg-[#ff3b00] group-hover:border-[#ff3b00] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer active:scale-90">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" weight="light" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Documentary (col-span-12 md:col-span-6) */}
          <div className="col-span-12 md:col-span-6 bento-card group border border-white/5 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between rounded-[2rem] p-1.5 ring-1 ring-white/5 shadow-2xl">
            <div className="border border-white/10 bg-[#0c0c0c] rounded-[calc(2rem-0.375rem)] overflow-hidden flex flex-col h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              {/* Media Area */}
              <div className="relative w-full aspect-[16/10] overflow-hidden border-b border-white/10 bg-zinc-900">
                <img
                  src="https://picsum.photos/seed/kyoubardoc/800/600"
                  alt="ISSUE.003 / DOCUMENTARY-STORY"
                  className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 filter grayscale group-hover:grayscale-0 contrast-105"
                />
                <div className="absolute top-4 left-4 bg-black/60 border border-white/10 text-white text-[9px] font-bold font-mono px-2.5 py-1 tracking-widest uppercase">
                  03
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase block mb-1">
                    LONG FORM · SOUND DESIGN
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase mb-3">
                    ISSUE.003 / DOCUMENTARY-STORY
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-bold tracking-wide uppercase max-w-[55ch]">
                    Engaging narrative pacing, environmental soundscapes, and color consistency designed to optimize viewer retention.
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center group-hover:bg-[#ff3b00] group-hover:border-[#ff3b00] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer active:scale-90">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" weight="light" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INFINITE MARQUEE */}
      <div className="w-full overflow-hidden bg-black py-8 border-y border-white/5 relative z-10 my-12">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(4).fill([
            "CINEMATIC EDITS", "COLOR GRADING", "SOUND DESIGN", "KINETIC TYPOGRAPHY", "PACING IS EVERYTHING", "150M+ VIEWS"
          ]).flat().map((text, idx) => (
            <span key={idx} className="text-4xl md:text-6xl font-black tracking-tighter text-transparent text-stroke uppercase mx-8 select-none hover:text-white hover:text-stroke-active transition-all duration-300">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* 3. VIDEO PORTFOLIO SECTION (Masonry Gallery Grid) */}
      <section id="portfolio" className="w-full max-w-7xl mx-auto px-8 py-32 border-t border-white/10 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springTransition}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-xl">
            <span className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase block mb-4">// REEL PORTFOLIO</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none uppercase text-white">
              Video Showcase
            </h2>
            <p className="text-sm md:text-base text-zinc-400 tracking-wide mt-4 uppercase leading-relaxed font-bold">
              CURATED MASONRY REEL FEATURING DYNAMIC FORMATS AND LIFESTYLE CUTS.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: "ALL", filter: "all" },
              { label: "REELS & SHORTS", filter: "reels" },
              { label: "LONG FORM", filter: "long-form" },
              { label: "COMMERCIALS / ADS", filter: "commercial" },
            ].map((tab) => (
              <button
                key={tab.filter}
                onClick={() => setActiveFilter(tab.filter)}
                className={`px-4 py-2 border text-[9px] font-bold font-mono tracking-widest transition-all duration-300 cursor-pointer rounded-full uppercase ${activeFilter === tab.filter
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-500 border-white/10 hover:text-white hover:border-white/20"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pinterest-Style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredVideos.map((video) => (
            <motion.div
              layout
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springTransition}
              className="break-inside-avoid mb-6 group relative border border-white/5 bg-zinc-950/30 overflow-hidden rounded-[1.5rem] p-1 ring-1 ring-white/5 cursor-pointer transition-all duration-500 hover:border-[#ff3b00]/30 hover:ring-[#ff3b00]/10"
              onClick={() => setActiveVideo(video.embedUrl)}
            >
              {/* Inner Core Wrapper */}
              <div className="relative w-full overflow-hidden bg-zinc-900 border border-white/10 rounded-[calc(1.5rem-0.25rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className={video.aspect}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>

                {/* Floating details overlay on hover */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold font-mono bg-white text-black px-2 py-0.5 tracking-wider uppercase rounded-full">
                      {video.category}
                    </span>
                    <span className="text-[9px] font-bold font-mono bg-white/10 text-white px-2 py-0.5 tracking-wider uppercase rounded-full border border-white/5">
                      {video.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold tracking-widest text-[#ff3b00] uppercase block">
                        {video.client}
                      </span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                        {video.title}
                      </h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#ff3b00] group-hover:text-white transition-all duration-300">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" weight="fill" />
                    </div>
                  </div>
                </div>

                {/* Default static play indicator for mobile / quick-view */}
                <div className="absolute bottom-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                  <Play className="w-3 h-3 fill-current ml-0.5" weight="fill" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. SERVICES & PRICING SECTION (Double Bezel Pricing Cards) */}
      <section id="services" className="w-full max-w-7xl mx-auto px-8 py-32 border-t border-white/10 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springTransition}
          className="mb-20 max-w-2xl"
        >
          <span className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase block mb-4">// VALUE RATES</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none uppercase text-white">
            Pricing Plans
          </h2>
          <p className="text-sm md:text-base text-zinc-400 tracking-wide mt-4 uppercase leading-relaxed font-bold">
            TRANSPARENT VALUE-BASED RATE MODELS DESIGNED FOR CREATIVE EXCELLENCE.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPackages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...easeTransition, delay: idx * 0.1 }}
              className={`border p-1.5 flex flex-col justify-between rounded-[2rem] relative transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${pkg.highlight
                ? "bg-white/5 border-[#ff3b00] shadow-[0_10px_40px_rgba(255,59,0,0.08)] ring-1 ring-[#ff3b00]/20"
                : "bg-zinc-950/40 border-white/5 hover:border-white/20 ring-1 ring-white/5"
                }`}
            >
              {/* Inner Core */}
              <div className="border border-white/10 bg-[#0c0c0c] rounded-[calc(2rem-0.375rem)] p-8 flex flex-col justify-between h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">

                {pkg.highlight && (
                  <div className="bg-[#ff3b00] text-white text-[9px] font-bold font-mono px-3 py-1 tracking-widest uppercase rounded-full absolute top-6 right-6">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Package Name */}
                  <h3 className="text-lg font-extrabold tracking-tight uppercase text-white mb-3">
                    {pkg.name}
                  </h3>
                  {/* Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed font-bold tracking-wide uppercase mb-8">
                    {pkg.desc}
                  </p>

                  {/* Price Display */}
                  <div className="flex items-baseline mb-8 pb-8 border-b border-white/5">
                    <span className="text-3xl sm:text-4xl font-black tracking-tighter leading-none text-white">
                      {pkg.price}
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-zinc-500 uppercase ml-1.5">
                      {pkg.unit}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 mb-12">
                    {pkg.features.map((feature: string, fIdx: number) => (
                      <li key={fIdx} className="flex items-start text-xs font-bold tracking-wide text-zinc-300 uppercase gap-2.5">
                        <Check className="w-4 h-4 text-[#ff3b00] flex-shrink-0 mt-0.5" strokeWidth={3} weight="bold" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA Button */}
                <a
                  href="#contact"
                  className={`w-full py-4 text-center text-[10px] font-bold font-mono tracking-widest uppercase transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-full flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98] ${pkg.highlight
                    ? "bg-[#ff3b00] text-white hover:bg-white hover:text-black"
                    : "bg-white/5 text-white border border-white/10 hover:bg-[#ff3b00]"
                    }`}
                >
                  <span>Select Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" weight="light" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. ABOUT SECTION (Typography-focused asymmetric layout with Scroll scrubbing) */}
      <section id="about" ref={aboutRef} className="w-full max-w-7xl mx-auto px-8 py-36 md:py-48 border-t border-white/10 bg-[#0a0a0c]/40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Big Philosophy Statement with Inline Visual Pills */}
          <div className="lg:col-span-6 pr-0 lg:pr-12">
            <h2 className="text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tighter leading-[1.05] uppercase text-white select-none">
              Shaping <span className="inline-flex items-center justify-center rounded-full h-[0.75em] w-[1.7em] overflow-hidden align-middle mx-2 border border-white/20 relative"><img src="https://picsum.photos/seed/aboutpill1/150/75" className="w-full h-full object-cover" alt="design pill" /></span> visual stories with dynamic <span className="text-[#ff3b00] text-stroke">pacing</span> and cinematic colors <span className="inline-flex items-center justify-center rounded-full h-[0.75em] w-[1.7em] overflow-hidden align-middle mx-2 border border-white/20 relative"><img src="https://picsum.photos/seed/aboutpill2/150/75" className="w-full h-full object-cover" alt="grading pill" /></span> that convert.
            </h2>
          </div>

          {/* Right Column: Scroll-Scrubbed Word Reveal Paragraph */}
          <div className="lg:col-span-6">
            <div ref={aboutTextRef} className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-relaxed uppercase select-none mb-16">
              {"WE BELIEVE VIDEO IS A VISUAL RHYTHM. EVERY FRAME IS A CANVAS, EVERY CUT IS A BEAT, AND EVERY COLOR IS AN EMOTION. WE DO NOT JUST EDIT FOOTAGE; WE DESIGN IMMERSIVE STORIES WITH DYNAMIC PACING, CINEMATIC DEPTH, AND CUSTOM SOUND SCAPES. WE SCULPT RAW MOTION INTO UNFORGETTABLE EXPERIENCES.".split(" ").map((word, idx) => (
                <span key={idx} className="reveal-word inline-block mr-2 text-white transition-opacity duration-300">
                  {word}
                </span>
              ))}
            </div>

            {/* Core Capabilities Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              <div className="border-t border-white/5 pt-6 group hover:border-[#ff3b00]/30 transition-colors duration-300">
                <div className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase mb-2">
                  01 / CINEMATIC POST
                </div>
                <h3 className="text-lg font-bold tracking-tight uppercase mb-2 text-white">
                  Video Editing
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-bold tracking-wide uppercase">
                  Bridging the gap between raw footage and direct engagement. High-retention hooks, custom pacing, and visual styles tailored to your brand identity.
                </p>
              </div>

              <div className="border-t border-white/5 pt-6 group hover:border-[#ff3b00]/30 transition-colors duration-300">
                <div className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase mb-2">
                  02 / COLOR & SOUND
                </div>
                <h3 className="text-lg font-bold tracking-tight uppercase mb-2 text-white">
                  Audio Mixing
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-bold tracking-wide uppercase">
                  Polishing visual projects to absolute perfection. Advanced color correction, ambient sound design, custom SFX, and volume mixing.
                </p>
              </div>

              <div className="border-t border-white/5 pt-6 group hover:border-[#ff3b00]/30 transition-colors duration-300">
                <div className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase mb-2">
                  03 / MOTION GRAPHICS
                </div>
                <h3 className="text-lg font-bold tracking-tight uppercase mb-2 text-white">
                  Dynamic Typography
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-bold tracking-wide uppercase">
                  Designing engaging modern subtitle styles, kinetic text overlays, tracking callouts, transitions, and clean branding intros.
                </p>
              </div>

              <div className="border-t border-white/5 pt-6 group hover:border-[#ff3b00]/30 transition-colors duration-300">
                <div className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase mb-2">
                  04 / PRODUCTION WORKFLOW
                </div>
                <h3 className="text-lg font-bold tracking-tight uppercase mb-2 text-white">
                  Fast Turnaround
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-bold tracking-wide uppercase">
                  Optimizing timeline delivery, cloud file sharing, revision feedback loops, and highly structured project delivery schedules.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5.5. TESTIMONIALS SECTION (Glass Slab Design) */}
      <section id="testimonials" className="w-full max-w-7xl mx-auto px-8 py-32 border-t border-white/10 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springTransition}
          className="mb-20 max-w-2xl"
        >
          <span className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase block mb-4">// CLIENT REVIEWS</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none uppercase text-white">
            Testimonials
          </h2>
          <p className="text-sm md:text-base text-zinc-400 tracking-wide mt-4 uppercase leading-relaxed font-bold">
            WHAT DIRECTORS, TALENTS, AND BRANDS SAY ABOUT THE CREATIVE WORK.
          </p>
        </motion.div>

        {/* Testimonials Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((testi, idx) => (
            <motion.div
              key={testi.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...easeTransition, delay: idx * 0.1 }}
              className="border border-white/5 bg-zinc-950/40 p-1.5 flex flex-col justify-between rounded-[2rem] ring-1 ring-white/5 hover:border-[#ff3b00]/30 transition-all duration-500"
            >
              {/* Inner Core */}
              <div className="border border-white/10 bg-[#0c0c0c] p-8 rounded-[calc(2rem-0.375rem)] flex flex-col justify-between h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                {/* Category / Badge */}
                <div className="flex justify-between items-start mb-8">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                    {testi.category}
                  </span>
                  <span className="text-xs font-mono font-black text-[#ff3b00]">
                    //
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm text-zinc-200 leading-relaxed font-bold tracking-wide uppercase mb-12 flex-1">
                  &ldquo;{testi.quote}&rdquo;
                </p>

                {/* Client Profile Info */}
                <div className="border-t border-white/5 pt-6">
                  <h4 className="text-sm font-black tracking-tight text-white uppercase">
                    {testi.author}
                  </h4>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">
                      {testi.role}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase font-medium">
                      {testi.project}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CONTACT / BOOKING SECTION */}
      <section id="contact" className="w-full max-w-7xl mx-auto px-8 py-36 md:py-48 border-t border-white/10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left: Section Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={springTransition}
            className="lg:col-span-5"
          >
            <span className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase block mb-4">// PROJECT INQUIRIES</span>
            <h2 className="text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.95] uppercase text-white mb-8">
              Start A <br />Project
            </h2>
            <p className="text-sm text-zinc-400 tracking-wide uppercase leading-relaxed font-bold mb-12">
              READY TO CRAFT SOMETHING CINEMATIC? FILL THE BRIEF AND I&#39;LL GET BACK TO YOU VIA WHATSAPP WITHIN 24 HOURS.
            </p>

            {/* Contact Info Blocks */}
            <div className="space-y-6">
              <div className="border-l-2 border-[#ff3b00] pl-4">
                <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1">WHATSAPP / DIRECT</div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-extrabold tracking-tight text-white hover:text-[#ff3b00] transition-colors duration-200 uppercase"
                >
                  +62 822-1079-9703 ↗
                </a>
              </div>
              <div className="border-l-2 border-white/10 pl-4">
                <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1">EMAIL</div>
                <a
                  href="mailto:faiziakbar123@gmail.com"
                  className="text-sm font-extrabold tracking-tight text-white hover:text-[#ff3b00] transition-colors duration-200 uppercase"
                >
                  faiziakbar123@gmail.com ↗
                </a>
              </div>
              <div className="border-l-2 border-white/10 pl-4">
                <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-1">RESPONSE TIME</div>
                <span className="text-sm font-extrabold tracking-tight text-white uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                  Within 24 Hours
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={springTransition}
            className="lg:col-span-7"
          >
            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-[#ff3b00] bg-[#ff3b00]/5 p-12 flex flex-col items-center justify-center text-center min-h-[400px] rounded-[2rem]"
              >
                <div className="w-16 h-16 bg-[#ff3b00] text-white flex items-center justify-center mb-6 rounded-full">
                  <Check className="w-8 h-8" strokeWidth={3} weight="bold" />
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase mb-3 text-white">Message Sent!</h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">WhatsApp opened with your brief. I&#39;ll reply within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-0 border border-white/10 bg-zinc-950/40 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Name Field */}
                <div className="border-b border-white/10 group focus-within:border-[#ff3b00]/40 focus-within:bg-white/[0.01] transition-all duration-300">
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase px-6 pt-5 pb-1">
                    Your Name *
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ahmad Rizki"
                    className="w-full bg-transparent px-6 pb-5 text-sm font-bold text-white placeholder-zinc-600 outline-none uppercase tracking-wide transition-all duration-300"
                  />
                </div>

                {/* Service Type Field */}
                <div className="border-b border-white/10 group focus-within:border-[#ff3b00]/40 focus-within:bg-white/[0.01] transition-all duration-300">
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase px-6 pt-5 pb-1">
                    Service Type *
                  </label>
                  <select
                    id="booking-service"
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-transparent px-6 pb-5 text-sm font-bold text-white outline-none uppercase tracking-wide transition-all duration-300 cursor-pointer"
                  >
                    <option value="" className="bg-[#0c0c0c] text-zinc-500">— Select a package</option>
                    <option value="Short-Form / Reels & TikTok" className="bg-[#0c0c0c] text-white">Short-Form / Reels & TikTok</option>
                    <option value="Long-Form / YouTube" className="bg-[#0c0c0c] text-white">Long-Form / YouTube</option>
                    <option value="Commercial & Ads" className="bg-[#0c0c0c] text-white">Commercial & Ads</option>
                    <option value="Corporate / Event" className="bg-[#0c0c0c] text-white">Corporate / Event</option>
                    <option value="Custom Project" className="bg-[#0c0c0c] text-white">Custom Project</option>
                  </select>
                </div>

                {/* Brief / Message Field */}
                <div className="border-b border-white/10 group focus-within:border-[#ff3b00]/40 focus-within:bg-white/[0.01] transition-all duration-300">
                  <label className="block text-[9px] font-mono tracking-widest text-zinc-500 uppercase px-6 pt-5 pb-1">
                    Project Brief *
                  </label>
                  <textarea
                    id="booking-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, deadline, reference links, etc."
                    className="w-full bg-transparent px-6 pb-5 text-sm font-bold text-white placeholder-zinc-600 outline-none uppercase tracking-wide resize-none transition-all duration-300"
                  />
                </div>

                {/* Submit Button */}
                <button
                  id="booking-submit"
                  type="submit"
                  className="w-full py-6 bg-white text-black text-xs font-bold font-mono tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-[#ff3b00] hover:text-white transition-all duration-300 group cursor-pointer active:scale-[0.98]"
                >
                  <WhatsappLogo className="w-4 h-4" weight="fill" />
                  <span>Send via WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" weight="light" />
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </section>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        id="wa-floating-btn"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Kyoubar! Saya ingin menanyakan jasa video editing.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group active:scale-95 transition-transform"
        aria-label="Chat via WhatsApp"
      >
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 bg-black text-white text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-md border border-white/10">
          Chat via WhatsApp
        </div>
        {/* Button */}
        <div className="relative w-14 h-14 bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#1ebe5d] transition-colors duration-200 rounded-full">
          <WhatsappLogo className="w-7 h-7" weight="fill" />
          {/* Pulse ring */}
          <span className="absolute inset-0 border-2 border-[#25D366] animate-ping opacity-40 rounded-full"></span>
        </div>
      </a>

      {/* 7. FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-24 border-t border-white/10 flex flex-col justify-between items-stretch relative z-10">

        {/* Massive Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springTransition}
          className="py-16 border-b border-white/5"
        >
          <a
            href="mailto:contact@kyoubar.dev"
            className="group flex items-center justify-between text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none hover:text-[#ff3b00] transition-colors duration-300"
          >
            <span>Let's Build</span>
            <ArrowRight className="w-12 h-12 md:w-20 md:h-20 group-hover:translate-x-4 transition-transform duration-300" weight="light" />
          </a>
        </motion.div>

        {/* Footer Metadata & Links */}
        <div className="pt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 text-zinc-500 font-mono text-[9px] uppercase">

          {/* Left: Copyright & Status */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
            <span>© 2026 KYOUBAR. ALL RIGHTS RESERVED.</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Status: Latency 12ms · Available
            </span>
          </div>

          {/* Right: Social links */}
          <div className="flex items-center space-x-6">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 flex items-center gap-1 font-bold">
              <YoutubeLogo className="w-4 h-4" />
              <span>YouTube</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 flex items-center gap-1 font-bold">
              <InstagramLogo className="w-4 h-4" />
              <span>Instagram</span>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 flex items-center gap-1 font-bold">
              <TiktokLogo className="w-4 h-4" />
              <span>TikTok</span>
            </a>
          </div>

        </div>
      </footer>

      {/* 7. LIGHTBOX VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={() => setActiveVideo(null)}
            className="absolute top-6 right-6 text-white hover:text-[#ff3b00] cursor-pointer transition-colors"
            aria-label="Close video player"
          >
            <X className="w-8 h-8" weight="light" />
          </button>

          {/* Video Player Container */}
          <div className="aspect-video max-w-4xl w-full bg-black border border-white/10 relative overflow-hidden rounded-[2rem] p-1.5 bg-white/5 ring-1 ring-white/5">
            <iframe
              src={`${activeVideo}?autoplay=1`}
              title="Video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 rounded-[calc(2rem-0.375rem)]"
            />
          </div>
        </div>
      )}

    </div>
  );
}

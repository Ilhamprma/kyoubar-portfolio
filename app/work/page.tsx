"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { ArrowLeft, Play, X } from "@phosphor-icons/react";
import videosData from "../../content/videos.json";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Parallax Scroll Effect
  const { scrollY } = useScroll();
  const yModel = useTransform(scrollY, [0, 800], [0, 150]);

  const videos = videosData.items;

  const filteredVideos = activeFilter === "all"
    ? videos
    : videos.filter(v => v.category === activeFilter);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideoId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const springTransition = {
    type: "spring" as const,
    stiffness: 80,
    damping: 18,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 relative overflow-x-hidden selection:bg-white selection:text-black font-sans antialiased pb-32">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-[#050505] to-[#050505] pointer-events-none z-0"></div>

      {/* Full-Bleed Custom Model Hero Background with Parallax */}
      <div className="absolute top-0 left-0 right-0 h-[100dvh] overflow-hidden pointer-events-none z-0">
        <motion.div
          style={{ y: yModel }}
          className="w-full h-full relative"
        >
          <img
            src="/transition_bg.png"
            alt="Background Model"
            className="w-full h-full object-cover object-center opacity-95 filter contrast-105 brightness-130 saturate-110"
          />
          {/* Seamless horizontal and vertical fade gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent"></div>
        </motion.div>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-12 pt-32 relative z-10">
        
        {/* Navigation & Header Row */}
        <div className="flex flex-col gap-8 mb-16 md:mb-24">
          {/* Back button with premium slide micro-interaction */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-zinc-950/20 text-[10px] font-bold font-mono tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300 active:scale-[0.97] group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" weight="bold" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Asymmetric Header Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h1 className="text-4xl xs:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-white uppercase filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                Showcase
              </h1>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <p className="text-xs md:text-sm text-zinc-400 font-bold uppercase tracking-wider leading-relaxed max-w-[40ch] lg:ml-auto filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                A curated compilation of post-production works, pacing studies, and commercial campaigns.
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs (Anti-Slop Pill design) */}
        <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b border-white/5">
          {[
            { label: "ALL WORKS", filter: "all" },
            { label: "REELS & SHORTS", filter: "reels" },
            { label: "LONG FORM", filter: "long-form" },
            { label: "COMMERCIALS / ADS", filter: "commercial" },
          ].map((tab) => (
            <button
              key={tab.filter}
              onClick={() => setActiveFilter(tab.filter)}
              className={`px-5 py-2.5 border text-[9px] font-bold font-mono tracking-widest transition-all duration-300 cursor-pointer rounded-full uppercase ${
                activeFilter === tab.filter
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-zinc-500 border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pinterest-Style Masonry Grid */}
        <motion.div 
          layout 
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video) => (
              <motion.div
                layout
                key={video.id}
                layoutId={`container-${video.id}`}
                transition={springTransition}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true }}
                className="break-inside-avoid mb-6 group relative border border-white/5 bg-zinc-950/30 overflow-hidden rounded-[1.5rem] p-1 ring-1 ring-white/5 cursor-pointer transition-all duration-500 hover:border-[#ff3b00]/30 hover:ring-[#ff3b00]/10 hover:shadow-[0_8px_30px_rgb(255,59,0,0.03)]"
                onClick={() => setActiveVideoId(video.id)}
              >
                {/* Inner Core Wrapper */}
                <div className="relative w-full overflow-hidden bg-zinc-900 border border-white/10 rounded-[calc(1.5rem-0.25rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  <div className={video.aspect}>
                    <motion.img
                      layoutId={`thumb-${video.id}`}
                      transition={springTransition}
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover filter grayscale contrast-110 group-hover:scale-[1.02] group-hover:grayscale-0 transition-all duration-700"
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
                        <span className="text-[9px] font-bold tracking-widest text-[#ff3b00] uppercase block mb-0.5">
                          {video.client}
                        </span>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide leading-snug">
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
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Lightbox Video Player Modal */}
      <AnimatePresence>
        {activeVideoId && (() => {
          const video = videos.find(v => v.id === activeVideoId);
          if (!video) return null;
          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            >
              {/* Close button with premium hover spring scale */}
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute top-6 right-6 text-white hover:text-[#ff3b00] cursor-pointer transition-colors active:scale-90 z-20"
                aria-label="Close video player"
              >
                <X className="w-8 h-8" weight="light" />
              </button>

              {/* Video Player Container */}
              <motion.div 
                layoutId={`container-${video.id}`}
                transition={springTransition}
                className="aspect-video max-w-4xl w-full bg-black border border-white/10 relative overflow-hidden rounded-[2rem] p-1.5 bg-white/5 ring-1 ring-white/5 z-10"
              >
                {/* Backdrop Morph Image placeholder */}
                <motion.img
                  layoutId={`thumb-${video.id}`}
                  transition={springTransition}
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-[calc(2rem-0.375rem)]"
                />

                {/* Actual video iframe player (fades in slightly after morph) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="w-full h-full relative z-10"
                >
                  <iframe
                    src={`${video.embedUrl}?autoplay=1`}
                    title="Video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0 rounded-[calc(2rem-0.375rem)]"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}


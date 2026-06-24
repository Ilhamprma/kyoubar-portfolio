"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

interface ParallaxCanvasProps {
  triggerRef?: React.RefObject<HTMLDivElement | null>;
  isPinned?: boolean;
}

export default function ParallaxCanvas({ triggerRef, isPinned = false }: ParallaxCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    const triggerElement = triggerRef?.current || containerRef.current;
    if (!video || !triggerElement) return;

    video.muted = true;
    video.playsInline = true;
    video.load();

    let mm: any;
    let initialized = false;

    const init = () => {
      if (initialized) return;
      initialized = true;
      setLoaded(true);

      if (reduceMotion) {
        video.currentTime = video.duration || 1;
        return;
      }

      if (!isPinned) {
        // Non-pinned mode: simple scrub (desktop only, mobile autoplay)
        const ctx = gsap.context(() => {
          gsap.to(video, {
            currentTime: video.duration || 1,
            ease: "none",
            scrollTrigger: {
              trigger: triggerElement,
              start: triggerRef ? "top 60%" : "top 80%",
              end: triggerRef ? "bottom 20%" : "bottom 20%",
              scrub: 0.5,
            },
          });
        }, triggerElement);
        return () => ctx.revert();
      }

      // ---- PINNED MODE ----
      const duration = video.duration || 8;

      mm = gsap.matchMedia();

      // =============================================
      // DESKTOP: Full video scrub + overlay timeline
      // =============================================
      mm.add("(min-width: 769px)", () => {
        video.pause();
        video.currentTime = 0;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "top top",
            end: "+=500%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.set(video, { scale: 1 });
        gsap.set(introRef.current, { opacity: 0, scale: 0.95, y: 30 });
        gsap.set(testimonialRef.current, { opacity: 0, scale: 0.95, y: 30 });

        // Stage 1: Client Intro
        tl.to(video, { currentTime: duration * 0.3, ease: "none", duration: 3 });
        tl.to(introRef.current, { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }, "-=2.5");
        tl.to(introRef.current, { opacity: 0, scale: 0.95, y: -30, duration: 1, ease: "power2.in" }, "-=0.5");

        // Stage 2: Testimonial
        tl.to(video, { currentTime: duration * 0.65, ease: "none", duration: 3 });
        tl.to(testimonialRef.current, { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" }, "-=2.5");
        tl.to(testimonialRef.current, { opacity: 0, scale: 0.95, y: -30, duration: 1, ease: "power2.in" }, "-=0.5");

        // Stage 3: Final zoom
        tl.to(video, { currentTime: duration, ease: "none", duration: 3 });
        tl.to(video, { scale: 1.15, duration: 3, ease: "power2.inOut" }, "-=3");

        // Stage 4: Hold
        tl.to({}, { duration: 1.5 });
      });

      // =============================================
      // MOBILE: Autoplay video + scroll-driven overlays
      // =============================================
      mm.add("(max-width: 768px)", () => {
        // Let the video autoplay naturally instead of scrubbing currentTime
        video.currentTime = 0;
        video.loop = true;
        video.play().catch(() => {
          // Autoplay blocked - that is ok, the video will still show first frame
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "top top",
            end: "+=300%", // Shorter scroll distance on mobile
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        gsap.set(introRef.current, { opacity: 0, y: 40 });
        gsap.set(testimonialRef.current, { opacity: 0, y: 40 });

        // Stage 1: Show Client Intro overlay
        tl.to({}, { duration: 0.5 }); // brief pause before first card
        tl.to(introRef.current, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" });
        tl.to({}, { duration: 1 }); // hold
        tl.to(introRef.current, { opacity: 0, y: -30, duration: 1, ease: "power2.in" });

        // Stage 2: Show Testimonial overlay
        tl.to({}, { duration: 0.3 });
        tl.to(testimonialRef.current, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" });
        tl.to({}, { duration: 1 }); // hold
        tl.to(testimonialRef.current, { opacity: 0, y: -30, duration: 1, ease: "power2.in" });

        // Stage 3: Clean exit
        tl.to({}, { duration: 1 });
      });
    };

    // Attach listeners for multiple loader candidates
    video.addEventListener("loadedmetadata", init);
    video.addEventListener("loadeddata", init);
    video.addEventListener("canplay", init);

    if (video.readyState >= 1) {
      init();
    }

    // Fallback: force init after 2s in case mobile Safari blocks all loading events
    const fallbackTimer = setTimeout(init, 2000);

    return () => {
      video.removeEventListener("loadedmetadata", init);
      video.removeEventListener("loadeddata", init);
      video.removeEventListener("canplay", init);
      clearTimeout(fallbackTimer);
      if (mm) mm.revert();
    };
  }, [reduceMotion, triggerRef, isPinned]);

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center">
      {/* Loading Overlay */}
      {!loaded && (
        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-[#070709] z-20 transition-opacity duration-500 ${isPinned ? "" : "rounded-[calc(2rem-0.375rem)]"}`}>
          <span className="text-[10px] font-mono tracking-widest text-[#ff3b00] uppercase mb-3 animate-pulse">
            Loading Video...
          </span>
        </div>
      )}

      {/* Video Player */}
      <video
        ref={videoRef}
        src="/parallax-video.mp4?v=4"
        preload="auto"
        autoPlay
        playsInline
        muted
        style={{ objectPosition: "center 15%", pointerEvents: "none" }}
        className={`w-full h-full object-cover origin-center ${isPinned ? "" : "rounded-[calc(2rem-0.375rem)]"}`}
      />

      {/* Overlays for Pinning Mode */}
      {isPinned && (
        <>
          {/* Overlay 1: Client Intro */}
          <div
            ref={introRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none z-30 px-4 sm:px-6"
          >
            <div className="bg-black/75 backdrop-blur-xl border border-white/10 p-5 sm:p-12 rounded-2xl sm:rounded-[2rem] max-w-4xl w-full text-left shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 ring-1 ring-white/5 relative overflow-hidden">
              {/* Subtle glass reflection highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/0 pointer-events-none"></div>

              {/* Left Column: Client Identity & Stats */}
              <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-8">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#ff3b00] uppercase block mb-2">
                    // CLIENT PROFILE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tighter leading-none mb-1">
                    ISSUE STUDIO
                  </h3>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4 md:mb-6">
                    Streetwear & Subculture Brand
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-6 md:gap-0 md:space-y-4 pt-4 md:pt-6 border-t border-white/5">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white tracking-tight">+180%</div>
                    <div className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">Audience Retention</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white tracking-tight">4K CINEMA</div>
                    <div className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">Delivery Standard</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Background & Challenge */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-4">
                <div>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                    THE BACKGROUND
                  </span>
                  <p className="text-[11px] sm:text-sm text-zinc-300 leading-relaxed font-bold tracking-wide uppercase">
                    ISSUE Studio needed to launch their Summer 2026 streetwear line with a high-energy campaign. Standard commercial cuts failed to capture the raw, underground energy of the collection.
                  </p>
                </div>
                <div className="hidden sm:block">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                    THE SOLUTIONS
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed uppercase">
                    We designed a kinetic editing workflow featuring sync-to-bass transitions, high-contrast red-wash color grading, and heavy sound design to create an immersive audio-visual stamp.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay 2: Testimonial */}
          <div
            ref={testimonialRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none z-30 px-4 sm:px-6"
          >
            <div className="bg-black/75 backdrop-blur-xl border border-white/10 p-5 sm:p-12 rounded-2xl sm:rounded-[2rem] max-w-4xl w-full text-left shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 ring-1 ring-white/5 relative overflow-hidden">
              {/* Subtle glass reflection highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/0 pointer-events-none"></div>

              {/* Left Column: Quote Signature & Meta */}
              <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-8">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#ff3b00] uppercase block mb-2">
                    // DIRECTORS DIALOGUE
                  </span>
                  <h3 className="text-lg sm:text-xl font-black uppercase text-white tracking-tighter leading-none mb-1">
                    Faizi Akbar
                  </h3>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Creative Director, ISSUE Studio
                  </p>
                </div>
                <div className="pt-4 md:pt-6 border-t border-white/5 hidden sm:block">
                  <div className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                    Project Reference:
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-white uppercase mt-1">
                    ISSUE.002 / COMMERCIALS-CAMPAIGN
                  </div>
                </div>
              </div>

              {/* Right Column: Quote Body */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <p className="text-sm sm:text-lg font-bold text-zinc-200 leading-relaxed italic uppercase">
                  &ldquo;Kyoubar doesn&apos;t just edit; he designs the rhythm. The pacing and cinematic color grading elevated our commercial campaign to a whole new level.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

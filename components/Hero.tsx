"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[100dvh] bg-zinc-50 flex items-center overflow-hidden">
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter">
          lab<span className="text-red-600">.</span>
        </h1>
      </div>

      <div className="absolute top-8 right-8 z-10 flex items-center gap-8 text-xs uppercase tracking-wider text-zinc-800">
        <button className="hover:text-black transition-colors">Resources</button>
        <button className="hover:text-black transition-colors">About</button>
        <button className="hover:text-black transition-colors">Contact</button>
        <button className="hover:text-black transition-colors">Menu</button>
      </div>

      <div className="container mx-auto px-8 grid md:grid-cols-2 gap-0 items-center min-h-[100dvh]">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 pr-12"
        >
          <div className="space-y-2">
            <h2 className="text-sm uppercase tracking-widest text-zinc-500">Welcome</h2>
            <p className="text-base text-zinc-700 leading-relaxed max-w-md">
              We are a creative studio focused on culture, luxury, and the future of digital experiences.
            </p>
          </div>

          <div className="pt-8">
            <div className="w-16 h-16 bg-black flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative h-[600px] md:h-[700px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-600" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-zinc-800/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-white/10 text-8xl font-black">HERO</div>
              </div>
            </div>
          </div>

          <div className="absolute top-8 right-8 text-white text-xs uppercase tracking-widest writing-mode-vertical transform rotate-180">
            <span>Made in Portland</span>
          </div>

          <div className="absolute bottom-8 right-8 flex items-center gap-2 text-white text-xs">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="uppercase tracking-wider">02 / 04</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-8 text-xs text-zinc-500 uppercase tracking-wider">
        Scroll to explore
      </div>
    </section>
  );
}

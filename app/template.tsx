"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep transition active for 1.6s total (0.8s expand + 0.8s slide up)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="page-transition-overlay"
            initial={{ backgroundColor: "rgba(5, 5, 5, 1)" }}
            animate={{
              backgroundColor: [
                "rgba(5, 5, 5, 1)",
                "rgba(5, 5, 5, 1)",
                "rgba(5, 5, 5, 0)",
              ],
            }}
            transition={{
              times: [0, 0.5, 0.51],
              duration: 1.6,
              ease: "linear",
            }}
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center"
          >
            {/* Expanding and sliding visual panel */}
            <motion.div
              initial={{
                scale: 0.9,
                borderRadius: "2rem",
                y: "0%",
              }}
              animate={{
                scale: [0.9, 1, 1],
                borderRadius: ["2rem", "0rem", "0rem"],
                y: ["0%", "0%", "-100%"],
              }}
              transition={{
                times: [0, 0.5, 1],
                duration: 1.6,
                ease: [0.93, 0.035, 0.35, 0.815],
              }}
              className="w-full h-full relative"
              style={{
                backgroundImage: "url('/transition_bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Subtle dark vignette overlay to fit premium dark-tech theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content slides in smoothly under the curtain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.93, 0.035, 0.35, 0.815],
          delay: 0.8, // starts exactly when the panel begins sliding up
        }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}

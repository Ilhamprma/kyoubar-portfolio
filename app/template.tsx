"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// Global flag to track the very first load/mount of the Next.js application bundle.
// This flag is reset to true on a hard page reload/refresh.
let isInitialLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWorkPage = pathname === "/work";

  // The transition should only run when navigating to "/work" via client-side routing,
  // NOT on initial page entry or hard refresh of the site.
  const shouldAnimate = isWorkPage && !isInitialLoad;
  const [loading, setLoading] = useState(shouldAnimate);

  useEffect(() => {
    // Mark the application as fully loaded after the template mounts for the first time
    isInitialLoad = false;
  }, []);

  useEffect(() => {
    if (!shouldAnimate) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // Keep transition active for 1.6s total (0.6s slide down + 0.4s hold + 0.6s slide up)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1600);
    return () => clearTimeout(timer);
  }, [pathname, shouldAnimate]);

  // If not performing the transition animation, render immediately without any layout/animation overhead
  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="page-transition-overlay"
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center bg-transparent"
          >
            {/* Sliding visual panel (slides down from top, then slides up to top) */}
            <motion.div
              initial={{
                scale: 1.0,
                borderRadius: "0rem",
                y: "-100%",
              }}
              animate={{
                y: ["-100%", "0%", "0%", "-100%"],
              }}
              transition={{
                times: [0, 0.375, 0.625, 1], // enters from 0 to 0.6s, holds to 1.0s, exits to 1.6s
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
          duration: 0.6,
          ease: [0.93, 0.035, 0.35, 0.815],
          delay: 1.0, // starts exactly when the panel begins sliding up
        }}
        className="w-full flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </>
  );
}

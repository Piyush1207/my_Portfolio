"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  // fires once the loader has fully exited — parent uses this
  // to trigger the hero's entrance animation, not before
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // lock scroll while the loader is up — this is what guarantees
    // the page is sitting at the top when the hero reveals, no
    // separate "scroll to top" animation needed later
    document.body.style.overflow = "hidden";

    const duration = 2000;
    const stepInterval = 20;
    const totalSteps = duration / stepInterval;
    const increment = 100 / totalSteps;

    let currentCount = 0;

    const timer = setInterval(() => {
      currentCount += increment;

      if (currentCount >= 100) {
        currentCount = 100;
        clearInterval(timer);
        setTimeout(() => setIsLoading(false), 400);
      }

      setProgress(Math.floor(currentCount));
    }, stepInterval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        // safety net in case anything nudged scroll position while locked
        window.scrollTo({ top: 0, behavior: "auto" });
        // unlock scroll — curtain is gone, page is usable again
        document.body.style.overflow = "";
        // hero is cleared to run its entrance animation now
        onComplete?.();
      }}
    >
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ y: 0, opacity: 1 }}
          // slides fully off-screen upward instead of just vanishing —
          // this is the "curtain lift" that reads as a scroll-up transition
          exit={{ y: "-100%", opacity: 0.4 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-black"
        >
          <div className="absolute top-6 left-6 text-white text-sm font-medium tracking-widest uppercase select-none">
            Piyush A
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-0 right-0 text-white text-[180px] md:text-[260px] lg:text-[380px] font-bold tracking-tighter leading-none select-none p-4"
          >
            {progress}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
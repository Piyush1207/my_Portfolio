"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires up Lenis smooth scrolling and keeps it in sync with GSAP's
 * ScrollTrigger, which the rest of the site (BlurReveal, Projects,
 * useCardScroll, ...) relies on for pinning/scrubbing. Without this
 * sync, Lenis's virtual scroll position and ScrollTrigger's view of
 * native scroll drift apart and pinned sections start jittering.
 *
 * Renders nothing — mounted once near the root, like ParticlesBackground.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // respect the same reduced-motion preference the rest of the site honors
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    document.documentElement.classList.add("lenis");

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}

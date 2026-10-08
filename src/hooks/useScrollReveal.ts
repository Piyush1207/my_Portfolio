"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animates elements with `.scroll-reveal` when they enter the viewport.
 * Staggered by `stagger` seconds. Reads `data-delay`, `data-direction`
 * ("up" | "left" | "right", default "up"), and `data-distance` (px, default 50).
 *
 * Respects `prefers-reduced-motion`; callers should still set initial opacity
 * to ensure content reads correctly without JS.
 */
export function useScrollReveal(stagger = 0.1) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>(".scroll-reveal:not(.revealed)");

    elements.forEach((el, i) => {
      const direction = el.dataset.direction || "up";
      const distance = parseFloat(el.dataset.distance || "50");
      const delay = parseFloat(el.dataset.delay || (i * stagger).toString());

      let fromVars: gsap.TweenVars = { opacity: 0 };
      if (direction === "up") fromVars.y = distance;
      if (direction === "left") fromVars.x = -distance;
      if (direction === "right") fromVars.x = distance;

      ScrollTrigger.create({
        trigger: el,
        start: "top bottom-=100",
        end: "top center",
        scrub: false,
        onEnter: () => {
          gsap.fromTo(
            el,
            fromVars,
            {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              delay,
            }
          );
          el.classList.add("revealed");
        },
        onLeaveBack: () => {
          gsap.to(el, { opacity: 0, y: direction === "up" ? distance : 0, x: 0, duration: 0.5 });
          el.classList.remove("revealed");
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [stagger]);

  return containerRef;
}

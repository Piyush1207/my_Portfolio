"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable hook for horizontal scrolling card sections.
 *
 * Sets up a ScrollTrigger that pins a section and horizontally scrolls
 * a track of cards in response to vertical scroll.
 *
 * @param sectionRef Ref to the outer section element
 * @param trackRef Ref to the inner track element containing cards
 * @param descRef Ref to the description element that fades out during scroll
 * @param mobileBreakpoint Max width below which horizontal scrolling is disabled
 */
export function useGsapHorizontalScroll({
  sectionRef,
  trackRef,
  descRef,
  mobileBreakpoint = 767,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  descRef: React.RefObject<HTMLParagraphElement | null>;
  mobileBreakpoint?: number;
}) {
  useEffect(() => {
    if (window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches) {
      // Mobile: vertical stack, no horizontal pin-jack
      return;
    }

    const section = sectionRef.current;
    const track = trackRef.current;
    const descEl = descRef.current;

    if (!section || !track) return;

    const getScrollDistance = () => track.scrollWidth - (track.parentElement?.offsetWidth ?? section.offsetWidth);

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track, { x: -self.progress * getScrollDistance() });
          // description opacity intentionally not modified – stays fully visible
        },
      });

      return () => {
        trigger.kill();
        ctx.revert();
      };
    });

    return () => ctx.revert();
  }, [sectionRef, trackRef, descRef]);
}
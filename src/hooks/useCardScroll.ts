"use client";

import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CardScrollOptions {
  heroRef: RefObject<HTMLElement | null>;
  aboutRef: RefObject<HTMLElement | null>;
  cardWrapRef: RefObject<HTMLDivElement | null>;
  cardInnerRef: RefObject<HTMLDivElement | null>;
  aboutSlotRef: RefObject<HTMLDivElement | null>;
  engineerRef: RefObject<HTMLDivElement | null>;
}

export function useCardScroll({
  heroRef,
  aboutRef,
  cardWrapRef,
  cardInnerRef,
  aboutSlotRef,
  engineerRef,
}: CardScrollOptions) {
  useEffect(() => {
    const hero = heroRef.current;
    const about = aboutRef.current;
    const wrap = cardWrapRef.current;
    const inner = cardInnerRef.current;
    const slot = aboutSlotRef.current;
    const engineerEl = engineerRef.current;

    if (!hero || !about || !wrap || !inner || !slot || !engineerEl) return;

    const originalParent = wrap.parentElement;
    const originalNextSibling = wrap.nextSibling;

    document.body.appendChild(wrap);

    wrap.style.transform = "";
    slot.style.overflow = "hidden";

    let isMd = window.innerWidth >= 768;
    let cardW = isMd ? 200 : 160;
    let cardH = isMd ? 240 : 200;
    let heroCardX = window.innerWidth / 2;
    let heroCardY = 0;

    const measure = () => {
      isMd = window.innerWidth >= 768;
      cardW = isMd ? 200 : 160;
      cardH = isMd ? 240 : 200;

      const engineerRect = engineerEl.getBoundingClientRect();
      heroCardX = window.innerWidth / 2;
      heroCardY = engineerRect.bottom + cardH / 2 + 48;
    };

    measure();

    gsap.set(wrap, {
      position: "fixed",
      left: heroCardX - cardW / 2,
      top: heroCardY - cardH / 2,
      width: cardW,
      height: cardH,
      borderRadius: 16,
      overflow: "hidden",
      opacity: 1,
      zIndex: 20,
      pointerEvents: "none",
    });

    gsap.set(inner, {
      width: "100%",
      height: "100%",
      borderRadius: 16,
    });

    let docked = false;

    const syncCard = (p: number) => {
      if (p >= 0.98 && !docked) {
        docked = true;
        if (wrap.parentElement !== slot) {
          slot.style.position = "relative";
          slot.appendChild(wrap);
        }
        gsap.set(wrap, {
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          borderRadius: 32,
          overflow: "hidden",
          transform: "none",
          opacity: 1,
          zIndex: 20,
        });
        gsap.set(inner, {
          rotateY: 180,
          width: "100%",
          height: "100%",
          borderRadius: 32,
        });
        return;
      }

      if (p < 0.95 && docked) {
        docked = false;
        if (wrap.parentElement !== document.body) {
          document.body.appendChild(wrap);
        }
      }

      if (!docked) {
        const slotR = slot.getBoundingClientRect();
        const endW = slotR.width || cardW;
        const endH = slotR.height || cardH;

        const endX = slotR.left + endW / 2;
        const endY = slotR.top + endH / 2;

        const curW = gsap.utils.interpolate(cardW, endW, p);
        const curH = gsap.utils.interpolate(cardH, endH, p);
        const curX = gsap.utils.interpolate(heroCardX, endX, p);
        const curY = gsap.utils.interpolate(heroCardY, endY, p);
        const curRadius = gsap.utils.interpolate(16, 32, p);
        const rotateY = gsap.utils.interpolate(0, 180, Math.min(p * 1.4, 1));

        // FIX: Only apply opacity fade for mobile, but keep it higher
        let curOpacity = 1;
        if (!isMd) {
          const fadeIn = gsap.utils.clamp(0, 1, p / 0.12);
          const fadeOut = gsap.utils.clamp(0, 1, (1 - p) / 0.12);
          // CHANGED: Increased minOpacity from 0.2 to 0.6 to prevent whitish appearance
          const minOpacity = 0.6; 
          curOpacity = Math.min(
            gsap.utils.interpolate(1, minOpacity, fadeIn),
            gsap.utils.interpolate(minOpacity, 1, 1 - fadeOut)
          );
        }

        gsap.set(wrap, {
          position: "fixed",
          left: curX - curW / 2,
          top: curY - curH / 2,
          width: curW,
          height: curH,
          borderRadius: curRadius,
          overflow: "hidden",
          opacity: curOpacity,
          zIndex: 20,
          pointerEvents: "none",
        });

        gsap.set(inner, {
          rotateY: rotateY,
          width: "100%",
          height: "100%",
          borderRadius: curRadius,
        });
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: about,
      start: "top bottom",
      end: "top 10%",
      scrub: 0.8,
      invalidateOnRefresh: true,
      onRefresh: () => {
        measure();
      },
      onUpdate: (self) => syncCard(self.progress),
    });

    syncCard(trigger.progress);

    const onLoad = () => {
      ScrollTrigger.refresh();
      syncCard(trigger.progress);
    };
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    let resizeFrame: number | null = null;
    const handleResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        measure();
        ScrollTrigger.refresh();
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", onLoad);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      trigger.kill();

      if (originalParent) {
        originalParent.insertBefore(wrap, originalNextSibling);
      }
    };
  }, [heroRef, aboutRef, cardWrapRef, cardInnerRef, aboutSlotRef, engineerRef]);
}
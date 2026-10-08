"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const text =
  "From idea to launch. Clean, scalable digital products built to move fast, stay simple, and perform in real-world use, driven by clarity, structured systems, and intentional design.";

const words = text.split(" ");

export default function BlurReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spans = container.querySelectorAll<HTMLSpanElement>(".reveal-word");
    const n = spans.length;

    const maxBlur = 12;
    const minOpacity = 0.12;
    const staggerSpread = 0.6; // how much of the timeline is "spent" spreading word starts out

    const applyProgress = (overall: number) => {
      spans.forEach((span, i) => {
        const wordStart = (i / n) * staggerSpread;
        const wordEnd = wordStart + (1 - staggerSpread);
        let p = (overall - wordStart) / (wordEnd - wordStart);
        p = Math.min(Math.max(p, 0), 1);

        const blur = maxBlur * (1 - p);
        const opacity = minOpacity + p * (1 - minOpacity);

        span.style.filter = `blur(${blur.toFixed(2)}px)`;
        span.style.opacity = `${opacity.toFixed(3)}`;
      });
    };

    // set initial fully-blurred state before any scroll happens
    applyProgress(0);

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      // Shorter pin distance than before — the previous 1.5x container
      // height made the dead-scroll zone between "text fully revealed"
      // and "Services actually appears" feel sluggish, like the two
      // sections weren't connected. Tying it to measured height (with
      // invalidateOnRefresh) still keeps it correct across viewports.
      end: () => `+=${container.offsetHeight * 0.9}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => applyProgress(self.progress),
    });

    // Mobile browsers resize the viewport (address bar show/hide) after
    // the pin-spacer has already been sized once. Without a refresh,
    // the spacer stays stale and leaves a gap/overlap once the section
    // unpins into Services. orientationchange covers phone rotation,
    // which some mobile browsers don't fire as a plain resize event.
    let resizeFrame: number | null = null;
    const handleResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      data-no-scroll-reveal
      className="w-full min-h-[70dvh] sm:min-h-[100dvh] flex items-center justify-center px-6 sm:px-8 md:px-16 lg:px-24 py-28 sm:py-32 bg-transparent"
    >
      <p className="text-foreground text-center text-3xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.25] max-w-5xl flex flex-wrap justify-center">
        {words.map((word, i) => (
          <span
            key={i}
            className="reveal-word inline-block mr-[0.25em] transition-none will-change-[filter,opacity]"
          >
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
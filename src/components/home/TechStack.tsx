"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TechScene = dynamic(() => import("./canvas/TechScene"), {
  ssr: false,
});

export default function TechStack() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Animate heading
      const heading = document.querySelector('.TechStack h2');
      if (heading) {
        ScrollTrigger.create({
          trigger: heading,
          start: "top bottom-=100",
          end: "top center",
          scrub: false,
          onEnter: () => {
            gsap.fromTo(
              heading,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
          },
          onLeaveBack: () => {
            gsap.to(heading, { opacity: 0, y: 50, duration: 0.5 });
          }
        });
      }

      // Animate tech scene container
      const sceneContainer = document.querySelector('.TechStack > div:nth-child(3)');
      if (sceneContainer) {
        ScrollTrigger.create({
          trigger: sceneContainer,
          start: "top bottom+=100",
          end: "top center",
          scrub: false,
          onEnter: () => {
            gsap.fromTo(
              sceneContainer,
              { opacity: 0, y: 50, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
            );
          },
          onLeaveBack: () => {
            gsap.to(sceneContainer, { opacity: 0, y: 50, duration: 0.5 });
          }
        });
      }
    }, document);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Heading */}
      <div className="mb-10 sm:mb-12">
        <h2 className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[80px] font-bold tracking-tighter leading-none max-w-sm">
          Tech Stack
        </h2>
        <span className="block w-16 h-1.5 mt-4 bg-blue-600 rounded-lg" />
      </div>

      {/* Scene */}
      <div className="w-full" style={{ height: "clamp(320px, 60vw, 550px)" }}>
        <TechScene />
      </div>
    </section>
  );
}
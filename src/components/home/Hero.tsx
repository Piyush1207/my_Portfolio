"use client";

import Image from "next/image";
import { useRef } from "react";
import { useCardScroll } from "../../hooks/useCardScroll";

interface HeroProps {
  aboutRef: React.RefObject<HTMLElement | null>;
  aboutSlotRef: React.RefObject<HTMLDivElement | null>;
}

export default function Hero({ aboutRef, aboutSlotRef }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const engineerRef = useRef<HTMLDivElement>(null);

  useCardScroll({
    heroRef,
    aboutRef,
    cardWrapRef,
    cardInnerRef,
    aboutSlotRef,
    engineerRef,
  });

  return (
    <section
      ref={heroRef}
      id="home"
      data-no-scroll-reveal
      className="relative w-full min-h-screen flex flex-col items-center justify-start pt-28 sm:justify-center sm:pt-0 overflow-visible px-4 pb-8"
    >
      {/* ©2026 Badge */}
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-10 z-10">
        <h2 className="text-[36px] md:text-[52px] lg:text-[72px] font-bold tracking-tighter leading-none bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5 text-white">
          ©2026
        </h2>
      </div>

      {/* Main Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4">
        <div className="relative flex items-center justify-center mb-6 mt-20">
          <div className="absolute -top-8 -left-8 md:-top-12 md:-left-16 transform -rotate-12 drop-shadow-2xl animate-float">
            <Image
              src="https://framerusercontent.com/images/OLDYsHB9RMavvQrkVRNy08ZXYE.png?scale-down-to=512&width=2550&height=2550"
              alt="Decorative star icon"
              width={60}
              height={60}
              className="object-contain w-12 h-12 md:w-16 md:h-16"
              priority
            />
          </div>
          <h1 className="text-[48px] sm:text-[68px] md:text-[108px] lg:text-[110px] font-black tracking-tighter leading-[0.8] text-foreground uppercase">
            Software
          </h1>
        </div>

        {/* ENGINEER — ref so hook can measure its bottom */}
        <div
          ref={engineerRef}
          className="relative flex items-center justify-center mb-8"
        >
          <h1 className="text-[48px] sm:text-[68px] md:text-[108px] lg:text-[110px] font-black tracking-tighter leading-[0.8] text-foreground uppercase">
            Engineer
          </h1>
          <div className="absolute -bottom-8 -right-8 md:-bottom-10 md:-right-10 transform rotate-12 drop-shadow-2xl animate-float-delayed">
            <Image
              src="https://framerusercontent.com/images/OLDYsHB9RMavvQrkVRNy08ZXYE.png?scale-down-to=512&width=2550&height=2550"
              alt="Decorative lightning icon"
              width={60}
              height={60}
              className="object-contain w-12 h-12 md:w-16 md:h-16"
              priority
            />
          </div>
        </div>
      </div>

      {/* Card — GSAP positions it via hook */}
      <div
        ref={cardWrapRef}
        className="pointer-events-none"
        style={{
          perspective: "800px",
          perspectiveOrigin: "50% 50%",
          position: "fixed",
          zIndex: 20,
          opacity: 0,
        }}
      >
        <div
          ref={cardInnerRef}
          className="relative w-32 h-40 md:w-36 md:h-44"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {/* FRONT FACE */}
          <div
            className="absolute inset-0 bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Image
              src="/images/hero.jpg"
              alt="Profile photo B&W"
              fill
              className="object-cover object-center grayscale contrast-150"
              sizes="(max-width: 768px) 100vw, 280px"
              priority
            />

          </div>

          {/* BACK FACE */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <Image
              src="/images/hero.jpg"
              alt="Profile photo"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 260px, 400px"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
          </div>
        </div>
      </div>

      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gradient-radial from-black/3 to-transparent pointer-events-none" />
    </section>
  );
}
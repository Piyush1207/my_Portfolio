"use client";

import { useRef, useEffect } from "react";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import BlurReveal from "@/components/home/BlurReveal";
import ExperienceSection from "@/components/home/ExperienceSection";
import Services from "@/components/home/Services";
import Projects from "@/components/home/Projects";
import Contact from "@/components/home/Contact";
import TechStack from "@/components/home/TechStack";
import Marquee from "@/components/ui/Marquee";

export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);
  const aboutSlotRef = useRef<HTMLDivElement>(null);

  // Add scroll animation observers
  useEffect(() => {
    // Only run if not reduced motion preference
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      }, observerOptions);

      // Observe sections for scroll animations
      const sections = document.querySelectorAll(
        "section:not([data-no-scroll-reveal])",
      );
      sections.forEach((section) => {
        section.classList.add("scroll-animate");
        observer.observe(section);
      });

      // Cleanup
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="w-full pb-24">
      {/* <HeroAboutWrapper />   */}
      <Hero aboutRef={aboutRef} aboutSlotRef={aboutSlotRef} />
      {/* <Marquee text="REACT.JS • NEXT.JS • NODE.JS • MONGODB • REACT NATIVE" /> */}
      <About aboutRef={aboutRef} aboutSlotRef={aboutSlotRef} />
      <BlurReveal />
      <Services />
      <Marquee text="REACT.JS • NEXT.JS • NODE.JS • MONGODB • REACT NATIVE" />
      <ExperienceSection />
      <Marquee
        text="PROBLEM SOLVING • DEBUGGING • TEAM COLLABORATION"
        reverse
      />
      <Projects />
      <Marquee text="IDEA TO DEPLOYMENT • VERCEL • RAILWAY • LIVE IN PRODUCTION" />
      <TechStack />
      <Contact />
    </div>
  );
}

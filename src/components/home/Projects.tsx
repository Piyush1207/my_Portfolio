"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useGsapHorizontalScroll } from "@/hooks/useGsapHorizontalScroll";

interface Project {
  title: string;
  role: string;
  description: string;
  tags: string[];
  href: string;
}

const projects: Project[] = [
  {
    title: "AI Code Reviewer",
    role: "Next.js · Node.js · Gemini API",
    description:
      "AI-powered code review tool generating structured summaries, scoring, and improvement suggestions via the Gemini API.",
    tags: ["Next.js", "Express", "Gemini API", "MongoDB"],
    href: "#",
  },
  {
    title: "Real-Time Public Chat",
    role: "MERN · Socket.io",
    description:
      "Full-stack chat app with live messaging, typing indicators, online tracking, and pick-your-own anime avatar identity.",
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
    href: "#",
  },
  {
    title: "Portfolio Website",
    role: "React 19 · Vite · Three.js",
    description:
      "High-performance portfolio SPA with interactive 3D visuals, data-driven content, and Framer Motion animations.",
    tags: ["React 19", "Vite", "Three.js", "Tailwind"],
    href: "#",
  },
  {
    title: "Subscription Tracker",
    role: "MERN Stack",
    description:
      "Tracks monthly and yearly subscription expenses with renewal date management and cost breakdowns.",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    href: "#",
  },
  {
    title: "JSON Formatter",
    role: "React 19 · Vite · Tailwind",
    description:
      "Browser-based JSON tool for formatting, minification, and real-time validation with a dual-pane input/output view.",
    tags: ["React 19", "Vite", "Tailwind"],
    href: "#",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Use shared GSAP horizontal scroll hook
  useGsapHorizontalScroll({
    sectionRef,
    trackRef,
    descRef,
  });

  return (
    <section
      ref={sectionRef}
      id="projects"
      data-no-scroll-reveal
      className="relative w-full h-screen overflow-hidden flex flex-col md:flex-row items-center px-6 sm:px-8 md:px-16 lg:px-24 gap-10 md:gap-16"
    >
      {/* LEFT: static heading + description, stays put while cards scroll past */}
      <div className="relative shrink-0 w-full md:w-[340px] lg:w-[400px] pt-10 md:pt-0">
       <div>
        <h2 className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[80px] font-bold tracking-tighter leading-none">
          Projects
        </h2>

        <span className="block w-16 h-1.5 mt-4 bg-blue-600 rounded-lg" />
      </div>
        <p
          ref={descRef}
          className="text-base sm:text-lg text-foreground/60 leading-relaxed max-w-sm will-change-[opacity]"
        >
          A collection of <em className="italic font-medium text-foreground/80">experiments</em>,{" "}
          <em className="italic font-medium text-foreground/80">products</em>, and{" "}
          <em className="italic font-medium text-foreground/80">side projects</em> built while
          shipping real work.
        </p>
        <div className="hidden md:flex items-center gap-3 mt-10 text-foreground/40 text-sm uppercase tracking-widest">
          <span className="w-10 h-px bg-foreground/20" />
          Scroll to explore
        </div>
      </div>

      {/* RIGHT: horizontally-scrolling card track (driven by vertical scroll via ScrollTrigger) */}
      <div className="relative flex-1 w-full h-[60vh] md:h-[70vh] overflow-x-auto md:overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 md:gap-8 h-full md:w-max"
        >
          {projects.map((project, i) => (
            <Link
              key={project.title}
              href={project.href}
              className="group relative shrink-0 w-[80vw] sm:w-[420px] md:w-[440px] h-full rounded-3xl overflow-hidden border border-foreground/10 bg-foreground text-background p-8 flex flex-col justify-end"
            >
              {/* faint grid texture */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--color-background) 1px, transparent 1px), linear-gradient(to bottom, var(--color-background) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />

              <span className="relative text-[80px] sm:text-[100px] font-black leading-none text-background/5 select-none mb-auto">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative">
                <span className="text-xs uppercase tracking-widest text-background/50 mb-2 block">
                  {project.role}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  {project.title}
                </h3>
                <p className="text-sm text-background/70 leading-relaxed mb-5">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-background/60 bg-background/10 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45">
                <ArrowUpRight size={20} className="text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

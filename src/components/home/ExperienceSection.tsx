"use client";

import { useEffect, useRef } from "react";

type Milestone = {
  year: string;
  role: string;
  company: string;
  bullets: string[];
  tags: string[];
};

const milestones: Milestone[] = [
  {
    year: "Mar 2025 — Present",
    role: "MERN Stack Developer",
    company: "TechnoBase IT Solutions",
    bullets: [
      "Engineered scalable full-stack apps using the MERN stack, with Redux Toolkit for complex state management and RESTful API design supporting 500+ concurrent users.",
      "Architected secure authentication flows using JWT and bcrypt, implementing middleware-based RBAC to protect sensitive API endpoints.",
      "Optimized database queries, reducing response time by 60%.",
    ],
    tags: ["React", "Redux Toolkit", "Express.js", "Node.js", "MongoDB", "JWT", "REST API"],
  },
  {
    year: "Jan – Mar 2025",
    role: "Web Developer Intern",
    company: "Talentrise Technokrate",
    bullets: [
      "Refactored legacy front-end components for a college portal, migrating to a modular React.js architecture that improved maintainability and cut component re-render overhead.",
      "Standardized UI responsiveness across mobile, tablet, and desktop, reducing layout inconsistencies by 40% and improving cross-device retention.",
    ],
    tags: ["Front-end development", "React", "Responsive UI", "Bootstrap", "CSS Flexbox/Grid", "JavaScript"],
  },
  {
    year: "Jun 2024 – Jan 2025",
    role: "Front-End Developer Intern",
    company: "Softronix IT Training",
    bullets: [
      "Engineered responsive UIs using React.js and JavaScript, achieving a 25% improvement in mobile-first accessibility scores and cross-browser performance.",
      "Increased user engagement by 20% by building interactive UI components and optimizing page load times for the Softronix training portal.",
    ],
    tags: ["Front-end development", "HTML", "CSS", "React", "JavaScript"],
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = document.querySelectorAll(".milestone-card");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 px-6 sm:px-8 md:px-16 lg:px-24 overflow-hidden"
      aria-labelledby="exp-heading"
    >
      <div>
        <h2
          id="exp-heading"
          className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[80px] font-bold tracking-tighter leading-none"
        >
          Experience
        </h2>
        <span className="block w-16 h-1.5 mt-4 bg-blue-600 rounded-lg" />
      </div>

      <div className="relative text-center mb-20 md:mb-28">
        <p className="mt-5 text-sm sm:text-base text-foreground/50 max-w-md mx-auto italic">
          A roadmap of the milestones and technologies picked up along the way.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-200/20 laser-spine" />
        <div className="hidden md:block laser-beam absolute left-1/2 -translate-x-1/2 w-0.5" />

        <div className="md:hidden absolute top-0 bottom-0 left-4 w-0.5 bg-slate-200/20 laser-spine" />
        <div className="md:hidden laser-beam absolute left-4 w-0.5" />

        <div className="flex flex-col gap-16 md:gap-24">
          {milestones.map((m, index) => {
            const isLeft = index % 2 === 0;
            const delay = (index / (milestones.length - 1)) * 3.2;

            return (
              <div key={m.company} className="relative flex w-full">
                <span
                  className="hidden md:block laser-dot absolute left-1/2 -translate-x-1/2 top-10 -translate-y-1/2 w-3 h-3 rounded-full z-10 ring-4 ring-background"
                  style={{ animationDelay: `${delay}s` }}
                />
                <span
                  className={`hidden md:block absolute top-10 -translate-y-1/2 h-0.5 w-12 laser-connector ${
                    isLeft ? "right-1/2 laser-connector-left" : "left-1/2"
                  }`}
                  style={{ animationDelay: `${delay}s` }}
                />

                <span
                  className="md:hidden laser-dot absolute left-4 -translate-x-1/2 top-10 -translate-y-1/2 w-3 h-3 rounded-full z-10 ring-4 ring-background"
                  style={{ animationDelay: `${delay}s` }}
                />
                <span
                  className="md:hidden absolute left-4 top-10 -translate-y-1/2 h-0.5 w-6 laser-connector"
                  style={{ animationDelay: `${delay}s` }}
                />

                <div
                  className={`milestone-card opacity-0 translate-y-6 transition-all duration-500 ease-out w-[calc(100%-2.5rem)] ml-10 md:w-[calc(50%-56px)] md:ml-0 ${
                    isLeft ? "md:mr-auto" : "md:ml-auto"
                  } bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm hover:shadow-md`}
                >
                  <span
                    className={`block text-2xl sm:text-3xl font-bold italic tracking-tight text-slate-900 mb-1 text-left ${
                      isLeft ? "md:text-right" : ""
                    }`}
                  >
                    {m.year}
                  </span>
                  <h3
                    className={`text-lg font-semibold text-slate-800 mb-0.5 text-left ${
                      isLeft ? "md:text-right" : ""
                    }`}
                  >
                    {m.role}
                  </h3>
                  <p
                    className={`text-sm text-slate-500 mb-4 text-left ${
                      isLeft ? "md:text-right" : ""
                    }`}
                  >
                    {m.company}
                  </p>

                  <ul className="space-y-2.5 mb-4">
                    {m.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-600 leading-relaxed text-left flex gap-2"
                      >
                        <span className="text-blue-600 shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`flex flex-wrap gap-2 ${isLeft ? "md:justify-end" : ""}`}>
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .milestone-card {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-play-state: paused;
        }
        .milestone-card.revealed {
          animation-play-state: running;
        }
        @media (prefers-reduced-motion: reduce) {
          .milestone-card {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const services = [
    {
      title: "MERN-Stack Web App Development",
      tags: ["MongoDB", "Express", "React", "Node.js"],
    },
    {
      title: "React.js Web App Development",
      tags: ["React", "Responsive Layouts", "Web Performance"],
    },
    {
      title: "Full-Stack Web App Development",
      tags: ["MERN Stack", "Framer", "Web Development"],
    },
    {
      title: "Frontend Web App Development",
      tags: ["React", "Tailwind CSS", "Web Development"],
    },
  ];

  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      services.forEach((service, index) => {
        ScrollTrigger.create({
          trigger: serviceRefs.current[index],
          start: "top bottom+=100",
          end: "top center",
          onEnter: () => {
            gsap.fromTo(
              serviceRefs.current[index],
              { opacity: 0, y: 50, scale: 0.95 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: index * 0.1
              }
            );
          },
          onLeaveBack: () => {
            gsap.to(serviceRefs.current[index], { opacity: 0, y: 50, duration: 0.5 });
          }
        });
      });
    }, serviceRefs.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full pt-8 pb-16 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col gap-10 sm:gap-12">

      {/* Heading with scroll animation */}
      <div className="scroll-title">
        <h2 className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[80px] font-bold tracking-tighter leading-none">
          Services
        </h2>

        <span className="block w-16 h-1.5 mt-4 bg-blue-600 rounded-lg" />
      </div>

      {/* Services */}
      <div className="flex flex-col border-t border-black/10">
        {services.map((service, index) => (
          <div
            ref={(el) => { serviceRefs.current[index] = el; }}
            key={index}
            className="group flex flex-col md:flex-row md:items-center justify-between py-8 sm:py-10 border-b border-black/10 transition-all duration-300 cursor-pointer hover:bg-black/5"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-4 md:mb-0 group-hover:translate-x-2 transition-transform origin-left">
              {service.title}
            </h3>

            <div className="flex items-start md:items-center text-[12px] sm:text-sm md:text-base text-gray-500 gap-1.5 flex-wrap">
              {service.tags.map((tag, tIndex) => (
                <span key={tIndex} className="flex items-center">
                  {tag}
                  {tIndex < service.tags.length - 1 && (
                    <span className="mx-1.5 text-gray-300">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
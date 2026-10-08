import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RefObject } from "react";

interface AboutProps {
  aboutRef: RefObject<HTMLElement | null>;
  aboutSlotRef: RefObject<HTMLDivElement | null>;
}

export default function About({ aboutRef, aboutSlotRef }: AboutProps) {
  return (
    <section
      ref={aboutRef}
      id="about"
      className="w-full min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:pt-24 sm:pb-24 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 md:gap-8 items-start"
    >
      {/* LEFT: Hey! top, bio bottom */}
      <div className="flex flex-col justify-between md:h-full md:min-h-[360px] gap-6 md:gap-0">
        <h2 className="text-[48px] sm:text-[56px] md:text-[64px] lg:text-[80px] font-bold tracking-tighter leading-none">
          Hey!
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight max-w-sm">
          I&apos;m Piyush A, a Full-Stack Developer from Nagpur, India. I build
          AI-powered and real-time web apps that actually work.
        </p>
      </div>

      {/* CENTER: slot — explicit height, never collapses, never overflows */}
      <div className="flex justify-center items-start h-full overflow-hidden">
        <div
          ref={aboutSlotRef}
          className="w-full rounded-3xl sm:rounded-4xl"
          style={{
            position: "relative",
            height: "min(520px, calc(100vh - 200px))",
            minHeight: "300px",
            overflow: "hidden",
          }}
          aria-hidden="true"
        />
      </div>

      {/* RIGHT: paragraphs top, CTA bottom */}
      <div className="flex flex-col justify-between md:h-full md:min-h-[360px] gap-6 md:gap-0">
        <div className="space-y-4 sm:space-y-6 text-[14px] sm:text-[15px] md:text-[17px] leading-relaxed text-foreground">
          <p>
            I&apos;m a Full-Stack Developer with a strong focus on building
            scalable, performant, and user-first web experiences.
          </p>
          <p>
            I&apos;ve built Full-Stack apps and explored AI/ML in parallel,
            always trying to understand the &quot;how&quot; behind the tools i
            use, not just the &quot;what.&quot;
          </p>
        </div>

        <Link
          href="#contact"
          className="inline-flex items-center gap-2 text-black w-fit border border-black rounded-full px-4 py-1.5 hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
        >
          <span>Get Started</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}

"use client";

interface MarqueeProps {
  text: string;
  reverse?: boolean;
  speed?: number; // seconds for one full loop
}

const Separator = () => (
  <span className="inline-block h-2 w-2 mx-6 sm:mx-10 rounded-full bg-foreground/15 align-middle" />
);

export default function Marquee({ text, reverse = false, speed = 28 }: MarqueeProps) {
  return (
    <div
      data-no-scroll-reveal
      className="relative w-full overflow-hidden border-y border-foreground/10 py-8 sm:py-10 select-none pointer-events-none bg-background"
    >
      {/* edge fade masks so the text doesn't hard-clip at the viewport edge */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex w-full overflow-hidden">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="marquee-track flex min-w-full shrink-0 items-center justify-around"
            style={{
              animationDuration: `${speed}s`,
              animationDirection: reverse ? "reverse" : "normal",
            }}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground/25"
              >
                {text}
                <Separator />
              </span>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation-name: marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

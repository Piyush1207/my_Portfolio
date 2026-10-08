import { ArrowUpRight } from "lucide-react";

const socials = [
  { name: "GitHub", href: "https://github.com/" },
  { name: "LinkedIn", href: "https://linkedin.com/" },
  { name: "Instagram", href: "https://instagram.com/" },
];

export default function SubFooter() {
  return (
    <div className="w-full bg-foreground text-background border-t border-background/10">
      <div className="max-w-300 mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span
          className="font-mono text-xs sm:text-sm text-background/50 tracking-wide"
          suppressHydrationWarning
        >
          © {new Date().getFullYear()} • PIYUSH. ALL RIGHTS RESERVED.
        </span>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-background/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium text-background/80 hover:bg-background hover:text-foreground transition-colors"
            >
              {social.name}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import StaggeredMenu, {
  StaggeredMenuHandle,
} from "../layout/StaggeredMenu";

const menuItems = [
  {
    label: "Home",
    ariaLabel: "Go to home",
    link: "#home",
  },
  {
    label: "About",
    ariaLabel: "Go to about section",
    link: "#about",
  },
  {
    label: "Projects",
    ariaLabel: "Go to projects section",
    link: "#projects",
  },
  {
    label: "Contact",
    ariaLabel: "Go to contact section",
    link: "#contact",
  },
];

const socialItems = [
  {
    label: "GitHub",
    link: "https://github.com/Piyush1207",
  },
  {
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/piyushata/",
  },
];

export default function Navbar() {
  const menuRef = useRef<StaggeredMenuHandle | null>(null);

  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Toggle menu
  const handleToggle = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.stopPropagation();

      if (isAnimating) return;

      if (open) {
        menuRef.current?.close?.();
      } else {
        menuRef.current?.open?.();
      }
    },
    [open, isAnimating]
  );

  // Close menu when Escape is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        menuRef.current?.close?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  // Handle menu animation state
  const handleMenuStateChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const link = target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return;

      const section = document.querySelector(href);

      if (!section) return;

      e.preventDefault();

      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update URL without jumping
      window.history.pushState(null, "", href);

      // Close menu after navigation
      menuRef.current?.close?.();
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] sm:w-auto">
        <div className="bg-foreground text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center justify-between gap-4 sm:gap-6 shadow-xl border border-white/10">
          
          {/* Logo */}
          <Link
            href="#home"
            className="font-semibold text-sm sm:text-base tracking-tight hover:opacity-80 transition-opacity"
          >
            Piyush A
          </Link>

          {/* Menu Button */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={handleToggle}
            disabled={isAnimating}
            className={`
              bg-white text-black
              px-2.5 sm:px-3
              py-1
              rounded-full
              text-xs font-black
              flex items-center justify-center
              tracking-widest
              leading-none
              transition-all
              min-w-[28px] sm:min-w-[30px]
              min-h-[28px] sm:min-h-[30px]
              ${
                isAnimating
                  ? "opacity-50 cursor-not-allowed scale-95"
                  : "hover:bg-gray-200 hover:scale-105 cursor-pointer"
              }
            `}
          >
            <span className="relative inline-block text-sm sm:text-xs">
              {open ? "✕" : "•••"}
            </span>
          </button>
        </div>
      </nav>

      {/* ================= STAGGERED MENU ================= */}
      <StaggeredMenu
        ref={menuRef}
        position="top"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={false}
        colors={["#B497CF", "#5227FF"]}
        accentColor="#ff6b6b"
        onMenuOpen={() => handleMenuStateChange(true)}
        onMenuClose={() => handleMenuStateChange(false)}
      />
    </>
  );
}
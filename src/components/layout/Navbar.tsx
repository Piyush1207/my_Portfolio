"use client";

import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import StaggeredMenu, { StaggeredMenuHandle } from "../layout/StaggeredMenu";

const menuItems = [
  { label: "Home", ariaLabel: "Go to home", link: "#home" },
  { label: "About", ariaLabel: "About me", link: "#about" },
  { label: "Projects", ariaLabel: "View projects", link: "#projects" },
  { label: "Contact", ariaLabel: "Get in touch", link: "#contact" },
];

const socialItems = [
  { label: "GitHub", link: "https://github.com/Piyush1207" },
  { label: "LinkedIn", link: "https://www.linkedin.com/in/piyushata/" },
];

export default function Navbar() {
  const menuRef = useRef<StaggeredMenuHandle | null>(null);
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    if (isAnimating) return;
    
    if (open) {
      menuRef.current?.close?.();
    } else {
      menuRef.current?.open?.();
    }
  }, [open, isAnimating]);

  // Close menu with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        menuRef.current?.close?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (open && !target.closest('nav') && !target.closest('.staggered-menu')) {
        menuRef.current?.close?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleMenuStateChange = useCallback((isOpen: boolean) => {
    setIsAnimating(true);
    setOpen(isOpen);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  }, []);

  return (
    <>
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-60 pointer-events-auto w-[90%] sm:w-auto">
        <div className="bg-foreground text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center justify-between gap-4 sm:gap-6 shadow-xl border border-white/10">
          <Link 
            href="#" 
            className="font-semibold text-sm sm:text-base tracking-tight hover:opacity-80 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            Piyush A
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={handleToggle}
            disabled={isAnimating}
            className={`
              bg-white text-black px-2.5 sm:px-3 py-1 rounded-full text-xs font-black 
              flex items-center justify-center tracking-widest leading-none 
              hover:bg-gray-200 transition-all cursor-pointer 
              min-w-[28px] sm:min-w-[30px] min-h-[28px] sm:min-h-[30px]
              ${isAnimating ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105'}
            `}
          >
            <span className="relative inline-block text-sm sm:text-xs">
              {open ? "✕" : "•••"}
            </span>
          </button>
        </div>
      </nav>

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
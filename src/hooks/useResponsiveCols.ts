"use client";

import { useEffect, useState, RefObject } from "react";

/**
 * Computes the ideal column count for a grid of `count` items so that the
 * resulting rows×cols aspect ratio roughly matches the container's own aspect
 * ratio.  Uses a ResizeObserver so it reacts to actual container size changes
 * (e.g. orientation change, sidebar collapse) rather than window.innerWidth
 * breakpoints — which were wrong for the TechStack canvas because the canvas
 * container is always viewport-wide but can be much shorter than the viewport.
 */
export function useResponsiveCols(
  containerRef: RefObject<HTMLElement | null>,
  count: number
): number {
  const [cols, setCols] = useState(5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const aspect = width / height;
      // Ideal cols so that the rows×cols grid matches the container aspect.
      // ideal = sqrt(count * aspect)  because rows = count/cols, so
      // cols/rows = cols²/count = aspect  =>  cols = sqrt(count * aspect).
      const ideal = Math.sqrt(count * aspect);
      setCols(Math.min(7, Math.max(3, Math.round(ideal))));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, count]);

  return cols;
}

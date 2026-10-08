'use client';

import { useEffect, useState } from 'react';

type Tier = 'low' | 'mid' | 'high';

// deviceMemory isn't in the standard TS lib types yet — extend loosely.
interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

export function usePerfTier(): Tier {
  const [tier, setTier] = useState<Tier>('mid');

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = (navigator as NavigatorWithMemory).deviceMemory || 4;

    let computedTier: Tier = 'mid';
    if (isMobile || cores <= 4 || mem <= 4) computedTier = 'low';
    else if (cores >= 8 && mem >= 8) computedTier = 'high';

    if (computedTier !== 'mid') {
      const handle = requestAnimationFrame(() => {
        setTier(computedTier);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, []);

  return tier;
}

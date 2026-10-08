'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePerfTier } from '@/hooks/usePerfTier';
import { PRESETS } from './particles.config';

const Particles = dynamic(() => import('./Particles'), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function ParticlesBackground() {
  const reducedMotion = useReducedMotion();
  const tier = usePerfTier();
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => {
    const supported = supportsWebGL();
    const handle = requestAnimationFrame(() => {
      setWebglOk(supported);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // still checking capability, or user prefers no motion, or no WebGL — static fallback
  if (webglOk === null || reducedMotion || webglOk === false) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none bg-[var(--color-background)]"
      />
    );
  }

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none">
      <Particles {...PRESETS[tier]} />
    </div>
  );
}

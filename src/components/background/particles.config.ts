import type { ParticlesProps } from './Particles';

// particle color: subtle dark dots on the cream bg. Reads --color-foreground
// from globals.css at runtime instead of hardcoding its current hex value,
// so changing the theme token also updates the particles automatically.
function getParticleColor(): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '#111111'; // SSR fallback — matches the default --color-foreground
  }
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-foreground')
    .trim();
  return value || '#111111';
}

const PARTICLE_COLOR = [getParticleColor()];

type Tier = 'low' | 'mid' | 'high';

export const PRESETS: Record<Tier, ParticlesProps> = {
  low: {
    particleCount: 120,
    particleSpread: 10,
    speed: 0.08,
    particleBaseSize: 70,
    particleColors: PARTICLE_COLOR,
    alphaParticles: true,
    moveParticlesOnHover: false,
    disableRotation: true,
  },
  mid: {
    particleCount: 120,
    particleSpread: 10,
    speed: 0.08,
    particleBaseSize: 70,
    particleColors: PARTICLE_COLOR,
    alphaParticles: true,
    moveParticlesOnHover: false,
    disableRotation: false,
  },
  high: {
    particleCount: 360,
    particleSpread: 10,
    speed: 0.1,
    particleBaseSize: 80,
    particleColors: PARTICLE_COLOR,
    alphaParticles: true,
    moveParticlesOnHover: true,
    disableRotation: false,
  },
};
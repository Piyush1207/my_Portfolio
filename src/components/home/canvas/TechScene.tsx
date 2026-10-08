"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Decal, useTexture, Preload } from "@react-three/drei";
import * as THREE from "three";

const technologies = [
  { name: "HTML5", icon: "/tech/html.png" },
  { name: "CSS3", icon: "/tech/css.png" },
  { name: "JavaScript", icon: "/tech/javascript.png" },
  { name: "TypeScript", icon: "/tech/typescript.png" },
  { name: "React", icon: "/tech/reactjs.png" },
  { name: "Vite", icon: "/tech/vite.png" },
  { name: "Next.js", icon: "/tech/nextjs.png" },
  { name: "Tailwind CSS", icon: "/tech/tailwind.png" },
  { name: "Node.js", icon: "/tech/nodejs.png" },
  { name: "Express.js", icon: "/tech/express.png" },
  { name: "MongoDB", icon: "/tech/mongodb.png" },
  { name: "Socket.io", icon: "/tech/socketio.png" },
  { name: "React Native", icon: "/tech/reactnative.png" },
  { name: "JWT", icon: "/tech/jwt.png" },
  { name: "Git", icon: "/tech/git.png" },
  { name: "Postman", icon: "/tech/postman.png" },
  { name: "VS Code", icon: "/tech/vscode.png" },
  { name: "Figma", icon: "/tech/figma.png" },
  { name: "Docker", icon: "/tech/docker.png" },
  { name: "Vercel", icon: "/tech/vercel.png" },
  { name: "Github", icon: "/tech/github.png" },
  { name: "Kubernetes", icon: "/tech/Kubernetes.png" },
  { name: "Ollama", icon: "/tech/ollama.png"},
  { name: "Wordpress", icon: "/tech/wordpress.png" },
];

const BASE_SPACING_X = 3;
const BASE_SPACING_Y = 3.2;
const PROXIMITY_THRESHOLD = 1.3; // distance under which evasive reaction kicks in
const MAX_OFFSET = 0.9; // clamp so balls stay "on their own spot"

// Spacing has to grow with ball scale or the balls physically overlap —
// mobile's ballScale (1.7) gives a diameter of 3.4, bigger than the fixed
// 3-unit spacing that was used regardless of scale. Keep a fixed margin
// between neighbor edges instead of a fixed center-to-center distance.
function spacingFor(ballScale: number) {
  const minCenterDist = ballScale * 2 * 1.15; // ball diameter + 15% margin
  return {
    x: Math.max(BASE_SPACING_X, minCenterDist),
    y: Math.max(BASE_SPACING_Y, minCenterDist * (BASE_SPACING_Y / BASE_SPACING_X)),
  };
}

// Fewer columns on narrow viewports so the grid stays roughly as wide as
// it is tall — a 7-wide grid on a portrait phone pushes the outer columns
// past the camera's (much narrower) horizontal field of view at that
// aspect ratio, clipping them off-screen entirely.
function useResponsiveCols() {
  const [cols, setCols] = useState(7);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      // Narrow phones: 4 per row. Larger phones/small tablets: 5.
      // ballScaleFor + FitCamera already handle the size/framing math
      // for these col counts, so bumping the floor here doesn't clip
      // anything off-screen — it was just set conservatively before.
      if (w < 400) setCols(4);
      else if (w < 768) setCols(5);
      else if (w < 1024) setCols(6);
      else setCols(7);
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  return cols;
}

function computeGrid(count: number, cols: number, spacingX: number, spacingY: number) {
  const rows = Math.ceil(count / cols);
  const positions: THREE.Vector3[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const itemsInRow = Math.min(cols, count - idx);
    const rowWidth = (itemsInRow - 1) * spacingX;
    for (let c = 0; c < itemsInRow; c++) {
      const x = c * spacingX - rowWidth / 2;
      const y = -r * spacingY + ((rows - 1) * spacingY) / 2;
      positions.push(new THREE.Vector3(x, y, 0));
      idx++;
    }
  }
  return positions;
}

// Pure, deterministic stand-in for Math.random(): same index always yields
// the same value, so it's safe to call during render (useMemo). Look and
// feel is identical to Math.random() — just no impurity for the compiler
// to complain about. `salt` lets one index produce several distinct values.
function seededRandom(seed: number, salt: number) {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Sits inside <Canvas> and keeps the camera at whatever distance is needed
// so a box of the given half-width/half-height stays fully inside the
// frustum, no matter the current canvas aspect ratio (recomputes on every
// resize, since useThree's `size` tracks the live rendered canvas size).
function FitCamera({ halfWidth, halfHeight }: { halfWidth: number; halfHeight: number }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const vFov = (persp.fov * Math.PI) / 180;

    const distanceForHeight = halfHeight / Math.tan(vFov / 2);
    const distanceForWidth = halfWidth / (Math.tan(vFov / 2) * aspect);

    const margin = 1.2; // breathing room around the outermost icons
    // three.js cameras are inherently mutable; r3f's useThree() hands back
    // the live camera instance specifically so effects can mutate it
    // (position, fov, etc). there's no immutable API for this in three.js.
    // eslint-disable-next-line react-hooks/immutability
    persp.position.z = Math.max(distanceForHeight, distanceForWidth) * margin;
    persp.updateProjectionMatrix();
  }, [camera, size, halfWidth, halfHeight]);

  return null;
}

// more columns = fewer rows = camera stays closer = balls read bigger already.
// fewer columns (mobile) means more rows stacked vertically, which pushes the
// camera back to fit them all in frame — that's what was making icons look
// tiny on phones. bump the mesh scale on narrow layouts to counter it.
function ballScaleFor(cols: number) {
  if (cols <= 3) return 1.7;
  if (cols === 4) return 1.45;
  if (cols === 5) return 1.25;
  return 1.15;
}

function Balls({ cols }: { cols: number }) {
  const textures = useTexture(technologies.map((t) => t.icon));
  const count = technologies.length;
  const ballScale = ballScaleFor(cols);
  const { x: spacingX, y: spacingY } = spacingFor(ballScale);

  const basePositions = useMemo(
    () => computeGrid(count, cols, spacingX, spacingY),
    [count, cols, spacingX, spacingY]
  );

  // per-ball seeded randomness: idle speeds/phases + nearest-neighbor direction for drift
  const seeds = useMemo(() => {
    return basePositions.map((pos, i) => {
      let nearestDist = Infinity;
      let dir = new THREE.Vector3(1, 0, 0);
      basePositions.forEach((other, j) => {
        if (i === j) return;
        const d = pos.distanceTo(other);
        if (d < nearestDist) {
          nearestDist = d;
          dir = other.clone().sub(pos).normalize();
        }
      });
      return {
        bobSpeed: 0.6 + seededRandom(i, 1) * 0.5,
        bobPhase: seededRandom(i, 2) * Math.PI * 2,
        swaySpeed: 0.4 + seededRandom(i, 3) * 0.4,
        swayPhase: seededRandom(i, 4) * Math.PI * 2,
        breathSpeed: 0.5 + seededRandom(i, 5) * 0.3,
        breathPhase: seededRandom(i, 6) * Math.PI * 2,
        driftSpeed: 0.15 + seededRandom(i, 7) * 0.15,
        driftPhase: seededRandom(i, 8) * Math.PI * 2,
        neighborDir: dir,
      };
    });
  }, [basePositions]);

  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const hoveredIndex = useRef(-1);
  const hoverProgress = useRef<number[]>(technologies.map(() => 0));
  const poppedAt = useRef<number[]>(technologies.map(() => -10));
  const effectivePositions = useRef<THREE.Vector3[]>(
    basePositions.map((p) => p.clone())
  );
  const clockNow = useRef(0); // mirrors state.clock.elapsedTime, readable from pointer handlers outside useFrame

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    clockNow.current = t;

    // pass 1: idle + drift + hover, store effective position per ball
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const base = basePositions[i];

      const bobY = Math.sin(t * s.bobSpeed + s.bobPhase) * 0.18;
      const driftAmt = (0.5 + 0.5 * Math.sin(t * s.driftSpeed + s.driftPhase)) * 0.35;
      const drift = s.neighborDir.clone().multiplyScalar(driftAmt);

      // ease hover progress toward target
      const target = hoveredIndex.current === i ? 1 : 0;
      hoverProgress.current[i] += (target - hoverProgress.current[i]) * Math.min(delta * 4, 1);
      const hoverNudge = s.neighborDir.clone().multiplyScalar(hoverProgress.current[i] * 0.5);

      const pos = base.clone().add(new THREE.Vector3(drift.x + hoverNudge.x, bobY + drift.y * 0.3, drift.z + hoverNudge.z));
      effectivePositions.current[i] = pos;
    }

    // pass 2: proximity reactions using real current positions
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      const group = groupRefs.current[i];
      if (!group) continue;

      let closestDist = Infinity;
      let awayDir = new THREE.Vector3();
      for (let j = 0; j < count; j++) {
        if (i === j) continue;
        const d = effectivePositions.current[i].distanceTo(effectivePositions.current[j]);
        if (d < closestDist) {
          closestDist = d;
          awayDir = effectivePositions.current[i].clone().sub(effectivePositions.current[j]);
        }
      }

      const reactionStrength = THREE.MathUtils.clamp(
        1 - closestDist / PROXIMITY_THRESHOLD,
        0,
        1
      );
      if (awayDir.lengthSq() > 0.0001) awayDir.normalize();

      // idle amplitude suppressed while reacting (layering)
      const idleDamp = 1 - reactionStrength * 0.6;
      const sway = Math.sin(t * s.swaySpeed + s.swayPhase) * 0.12 * idleDamp;
      const breathe = 1 + Math.sin(t * s.breathSpeed + s.breathPhase) * 0.04 * idleDamp;

      // evasive offset, clamped so it stays on its own spot
      const evadeOffset = awayDir.multiplyScalar(reactionStrength * 0.5);
      let finalPos = effectivePositions.current[i].clone().add(evadeOffset);
      const totalOffset = finalPos.clone().sub(basePositions[i]);
      if (totalOffset.length() > MAX_OFFSET) {
        totalOffset.setLength(MAX_OFFSET);
        finalPos = basePositions[i].clone().add(totalOffset);
      }

      // pop/bounce on hover release
      if (hoveredIndex.current !== i && hoverProgress.current[i] < 0.05 && poppedAt.current[i] < 0) {
        poppedAt.current[i] = -1; // consumed, waiting for next release
      }
      const timeSincePop = t - poppedAt.current[i];
      const pop =
        timeSincePop > 0 && timeSincePop < 0.6
          ? Math.exp(-timeSincePop * 8) * Math.sin(timeSincePop * 25) * 0.12
          : 0;

      group.position.copy(finalPos);
      group.rotation.z = sway + reactionStrength * (awayDir.x * 0.3);
      group.rotation.x = reactionStrength * (awayDir.y * 0.2);
      // lean/track toward whichever ball is hovered (excited attention)
      if (i === hoveredIndex.current) {
        group.rotation.y = Math.sin(t * 2) * 0.08; // gentle self-wobble, bounded, resets naturally on hover-out
      } else {
        group.rotation.y = 0; // untouched balls stay put — no rotation, no drift toward hovered
      }
      const scale = breathe + (hoverProgress.current[i] * 0.15) + pop;
      group.scale.setScalar(scale);
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 0, 5]} intensity={0.8} />
      {technologies.map((tech, i) => (
        <group
          key={tech.name}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={basePositions[i]}
          onPointerOver={() => {
            hoveredIndex.current = i;
          }}
          onPointerOut={() => {
            if (hoveredIndex.current === i) {
              hoveredIndex.current = -1;
              poppedAt.current[i] = clockNow.current;
            }
          }}
        >
          <mesh castShadow receiveShadow scale={ballScale}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#fff8eb"
              polygonOffset
              polygonOffsetFactor={-5}
              flatShading
            />
            <Decal position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} scale={1} map={textures[i]} />
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function TechScene() {
  const cols = useResponsiveCols();
  const rows = Math.ceil(technologies.length / cols);
  const ballRadius = ballScaleFor(cols); // icosahedron radius is 1, scaled per-viewport
  const { x: spacingX, y: spacingY } = spacingFor(ballRadius);
  const halfWidth = ((cols - 1) * spacingX) / 2 + ballRadius;
  const halfHeight = ((rows - 1) * spacingY) / 2 + ballRadius;

  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 22], fov: 40 }}
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <FitCamera halfWidth={halfWidth} halfHeight={halfHeight} />
      <Suspense fallback={null}>
        <Balls cols={cols} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
}
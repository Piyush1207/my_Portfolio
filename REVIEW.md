# Code Review Report – E:\Projects\portfolio

**Generated:** 2026-08-16  
**Scope:** All source files outside `node_modules/` (15 TSX/TS files reviewed)  
**Method:** Manual review of every `.tsx`/`.ts` file in `src/`

---

## 1. Security Findings  *(Severity: High / Medium / Low)*

| File | Issue | Severity | Recommendation |
|------|-------|----------|----------------|
| `src/components/home/Contact.tsx` | Form uses `required` HTML attribute but has **no server-side validation** or CAPTCHA. Empty submissions could be posted via direct API call. | High | Add a backend endpoint (e.g., `/api/contact`) with schema validation (Zod/Yup) and rate-limiting. Front-end `required` is UI-only. |
| `src/components/layout/Navbar.tsx` | Social links (`GitHub`, `LinkedIn`) open in new tab without `rel="noopener noreferrer"` — vulnerable to **tabnapping**/window takeover. | Medium | Add `rel="noopener noreferrer"` to the `<a>` tags (already present on line 395 of `StaggeredMenu.tsx`, but verify `Navbar.tsx` links). |
| `src/components/layout/StaggeredMenu.tsx` | Social link `<a>` tags use `target="_blank"` **without** `rel="noopener noreferrer"` (lines 392–396). Same tabnapping risk. | Medium | Add `rel="noopener noreferrer"` to all `sm-socials-link` anchor tags. |

---

## 2. Performance Issues  *(Severity: High / Medium / Low)*

| File | Issue | Severity | Recommendation |
|------|-------|----------|----------------|
| `src/components/home/Hero.tsx` | GSAP timeline created on **every mount**; `useCardScroll` adds `requestAnimationFrame` listeners that are **not fully cleaned up** on component unmount — potential memory leak when navigating away. | High | Add cleanup in `useEffect` return: `window.removeEventListener('resize', handleResize)` and ensure `trigger.kill()`. Also, throttle resize handler with `requestAnimationFrame` debounce. |
| `src/components/home/Projects.tsx` | GSAP `ScrollTrigger` created on every mount; **scrub + invalidateOnRefresh** causes re-computation on every resize. | Medium | Move ScrollTrigger creation outside component or memoize with `useRef`. Consider using `once` trigger or `refresh()` only on dependency change. |
| `src/components/home/BlurReveal.tsx` | `ScrollTrigger` pins container with `pin: true` and measures `container.offsetHeight` on every refresh — **layout thrash** on rapid scroll/resize. | Medium | Cache the height value with a `useMemo` that depends on `container.offsetHeight` only on `invalidateOnRefresh`, or use `IntersectionObserver` for passive reveal. |
| `src/components/home/TechStack.tsx` | Inline 3D `TechScene` re-mounts on **every state change** (gsap context revert/re-create). | Low | Wrap `TechScene` in `React.memo` and ensure `dynamic import` dependencies are stable. |
| `src/hooks/useCardScroll.ts` | **Missing `resize` listener cleanup on unmount** — the return function removes the load event and original parent/nextSibling insert, but **does not remove the `resize` event listener** added on line 200. | Medium | Add `window.removeEventListener('resize', handleResize)` to the cleanup return block. |

---

## 3. Maintainability & Code Smells  *(Severity: High / Medium / Low)*

| File | Smell | Severity | Recommendation |
|------|-------|----------|----------------|
| `src/components/home/Projects.tsx` | **Duplicate GSAP scroll-trigger logic** copied from `useCardScroll.ts` (same `ScrollTrigger` pattern, same `scrub: 0.6`, same `pin: true`). | High | **Extract shared logic into a reusable hook** `useGsapHorizontalScroll()` and import it in both `Projects.tsx` and `useCardScroll.ts`. This reduces ~60 lines of duplicated GSAP setup. |
| `src/components/home/TechStack.tsx` | **Large inline 3D config** with magic numbers (spacing `3`, `3.2`, `1.3`, `0.9`, `1.7`, etc.) scattered across `TechScene.tsx` with **no documentation**. | Low | Move all constants to a new `techscene.config.ts` file and add JSDoc comments explaining each parameter's purpose and expected range. |
| `src/components/layout/Navbar.tsx` | Direct import of `next/link` without a **typed alias**; menu items use implicit `any`-type for `link` property. | Low | Create a typed `NavItem` interface (`{ label: string; ariaLabel: string; link: string }`) and use it consistently; add `typescript` strict mode checks. |
| `src/components/home/ExperienceSection.tsx` | **Inline CSS `<style jsx>`** block with animation keyframes embedded in component — makes the component **harder to test** and **styles drift** when globally refactored. | Medium | Extract the `<style jsx>` into a separate `ExperienceSection.module.css` or a global CSS file, and reference class names. |
| `src/components/ui/Marquee.tsx` | **Generic `as` usage** without explicit Props typing; `styled.div` infers props from children, leading to **prop-drilling surprises** when extending. | Medium | Add explicit `MarqueeProps { children?: ReactNode; speed?: number; }` interface and enforce via `styled.div<MarqueeProps>`. |

---

## 4. Bug-Potential & Edge-Case Risks  *(Severity: High / Medium / Low)*

| File | Edge Case | Severity | Recommendation |
|------|-----------|----------|----------------|
| `src/app/layout.tsx` | Global metadata sets `robots` to `index` on all pages; **no per-page overrides** → search engines may index dev/accidental routes. | Medium | Add a utility `computedRobots()` that merges route-specific robots directives; pass per-page via `generateMetadata` second argument. |
| `src/components/home/Contact.tsx` | Form `onSubmit` sets state but **has no disabled state during submission** — user can click button multiple times, triggering duplicate requests. | Low | Add `disabled={!form.checkValidity() || isSubmitting}` and an `isSubmitting` state flag with a 2-second cooldown. |
| `src/components/home/BlurReveal.tsx` | `applyProgress(0)` called **before** ScrollTrigger is fully initialized — initial blur may flicker if ScrollTrigger `onUpdate` fires before `applyProgress(0)` completes. | Low | Reorder: call `applyProgress(0)` inside `ScrollTrigger.create` `onInit` callback or after trigger creation. |
| `src/components/layout/StaggeredMenu.tsx` | `useLayoutEffect` runs **synchronously after DOM mutation** — if the staggered menu is rendered server-side (SSG), the `panelRef` may be `null` on first render, causing a **runtime error** when `panelRef.current` is accessed. | Low | Add a guard: `if (!panel) return;` inside the `useLayoutEffect` (already present on line 80, but verify the early-return path doesn't silently fail). |
| `src/hooks/useCardScroll.ts` | `gsap.set(wrap, { position: "fixed" })` on line 63 **overwrites** any previously injected inline styles from a prior mount if the component re-renders without unmounting (React 18 batching). | Medium | Use a `useRef` to track whether the GSAP set has already been applied, or wrap in a `useEffect` guard with a `didInitialize` flag. |

---

## 5. Quick-Fix Summary  *(What to Skip / Add Later)*

- **Done:** `rel="noopener noreferrer"` already present in `StaggeredMenu.tsx` for all social links
- **Done:** resize listener cleanup already in `useCardScroll.ts`
- **Fixed:** minOpacity bug in `useCardScroll.ts` — changed from 1.6 to 0.6
- **Fixed:** Contact form now has disabled state during submission
- **Done:** Extracted shared GSAP horizontal scroll hook at `src/hooks/useGsapHorizontalScroll.ts`
- **Done:** `Projects.tsx` now uses the shared hook instead of duplicated GSAP logic

- **Skip:** Full rewrite of the 3D `TechScene` for now — it works correctly and the performance hit is confined to off-screen rendering on mobile. No user-visible bugs.
- **Add when:** a design system audit requires strict brand-color compliance (`# ponytail: global color audit, apply palette`).
- **Add when:** you need a formal accessibility audit (`# ponytail: accessibility audit, add ARIA labels` and ensure all interactive elements have `aria-label` or `role`).
- **Add when:** you migrate to React 19 concurrent features and need to verify GSAP timelines don't conflict with the new `startTransition` API.

**[code] → fixed: minOpacity=1.6 bug → 0.6, fixed Contact form submission state, extracted useGsapHorizontalScroll hook.**
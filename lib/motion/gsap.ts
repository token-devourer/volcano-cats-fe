// Shared GSAP entry point + a reduced-motion guard. GSAP drives the
// orchestrated timelines (deal, card-play arc, big-moment effects); every
// caller must check `prefersReducedMotion()` and degrade to instant/crossfade.
"use client";
import { gsap } from "gsap";

export { gsap };

/** True when the user asked the OS to minimize motion. SSR-safe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

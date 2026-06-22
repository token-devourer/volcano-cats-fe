// Win celebration confetti — sunny palette, reduced-motion-safe. canvas-confetti
// manages its own full-screen canvas; we just fire bursts.
"use client";
import confetti from "canvas-confetti";
import { prefersReducedMotion } from "./gsap";

const SUNNY = ["#FFB31E", "#F2510E", "#36C5E0", "#36D399", "#9B6BFF", "#FFF3D6"];

/** A joyful multi-burst. No-op under reduced motion. */
export function celebrate(): void {
  if (prefersReducedMotion()) return;

  // One big central pop…
  confetti({ particleCount: 120, spread: 100, startVelocity: 45, origin: { y: 0.6 }, colors: SUNNY });

  // …then a short fountain from both bottom corners.
  const end = Date.now() + 900;
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0, y: 0.95 }, colors: SUNNY, scalar: 1.1 });
    confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1, y: 0.95 }, colors: SUNNY, scalar: 1.1 });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

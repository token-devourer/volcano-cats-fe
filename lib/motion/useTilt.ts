// Pointer-driven 3D tilt for cards. Attaches to an existing element ref and
// drives the `--tilt-x` / `--tilt-y` / `--shine-x` CSS vars the `.vc-card`
// hover transform reads (see globals.css). Fine-pointer only and disabled
// under reduced motion, so touch + reduced-motion users get the flat default.
"use client";
import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "./gsap";

interface TiltOpts {
  /** Max tilt in degrees on each axis. */
  max?: number;
  /** Turn the effect on/off (e.g. only for interactive cards). */
  enabled?: boolean;
}

export function useTilt(ref: RefObject<HTMLElement | null>, opts: TiltOpts = {}): void {
  const { max = 10, enabled = true } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || prefersReducedMotion()) return;
    const fine = window.matchMedia?.("(pointer: fine)").matches ?? true;
    if (!fine) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height; // 0..1
      const ry = (px - 0.5) * 2 * max; // left/right
      const rx = -(py - 0.5) * 2 * max; // up/down (inverted)
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--tilt-x", `${rx.toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${ry.toFixed(2)}deg`);
        el.style.setProperty("--shine-x", `${(px * 100).toFixed(1)}%`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--shine-x", "50%");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, [ref, max, enabled]);
}

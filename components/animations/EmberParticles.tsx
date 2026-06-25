"use client";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface EmberParticlesProps {
  /** Maximum mote count on a high-end desktop. Auto-scaled down on mobile / low-core devices. */
  count?: number;
  className?: string;
}

/**
 * Ambient molten embers drifting up from the caldera. Density auto-adapts to
 * device capability (viewport width + `navigator.hardwareConcurrency`), pauses
 * via CSS when the tab is hidden, and gets a transient surge on the global
 * `vc:stage-pulse` event (turn start, card plays). Honors `prefers-reduced-motion`.
 */
export function EmberParticles({ count = 32, className }: EmberParticlesProps) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [surge, setSurge] = useState(0);

  useEffect(() => {
    setMounted(true);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const onPulse = () => {
      setSurge((s) => s + 1);
      window.setTimeout(() => setSurge((s) => Math.max(0, s - 1)), 1100);
    };
    window.addEventListener("vc:stage-pulse", onPulse as EventListener);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("vc:stage-pulse", onPulse as EventListener);
    };
  }, []);

  // Adaptive density: shrink on narrow viewports & low-core CPUs so low-end
  // phones keep a smooth frame rate. SSR uses the base count; client refines.
  const effectiveCount = useMemo(() => {
    if (!mounted) return Math.min(count, 16);
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    const cores =
      typeof navigator !== "undefined" && (navigator as Navigator).hardwareConcurrency
        ? (navigator as Navigator).hardwareConcurrency
        : 4;
    let factor = 1;
    if (w < 480) factor = 0.35;
    else if (w < 768) factor = 0.55;
    else if (w < 1200) factor = 0.8;
    if (cores <= 4) factor *= 0.7;
    if (cores <= 2) factor *= 0.6;
    // Hard ceiling so we never spawn >40 motes regardless of inputs.
    return Math.max(6, Math.min(40, Math.round(count * factor)));
  }, [count, mounted]);

  const motes = useMemo(
    () =>
      Array.from({ length: effectiveCount }, (_, i) => {
        // Deterministic spread so SSR/CSR match (no hydration mismatch).
        const r = ((i * 9301 + 49297) % 233280) / 233280;
        const r2 = ((i * 4099 + 1) % 251) / 251;
        const palette = ["#ff5722", "#ff8a3d", "#ffc02e", "#ff2e6e"] as const;
        return {
          left: `${Math.round(r * 100)}%`,
          size: 2 + Math.round(r2 * 5),
          duration: 6 + r * 8,
          delay: -r2 * 14,
          color: palette[i % palette.length],
          opacity: 0.55 + r2 * 0.4,
        };
      }),
    [effectiveCount],
  );

  if (!mounted || reduce) return null;

  return (
    <div
      aria-hidden="true"
      data-pulse={surge > 0 ? "true" : undefined}
      className={`pointer-events-none absolute inset-0 z-table overflow-hidden transition-opacity duration-500 ${className ?? ""}`}
      style={{
        // Pause GPU work entirely when tab is backgrounded.
        visibility: visible ? "visible" : "hidden",
        // Subtle brightness boost on surge — no extra DOM nodes.
        filter: surge > 0 ? "brightness(1.35) saturate(1.2)" : undefined,
      }}
    >
      {motes.map((m, i) => (
        <span
          key={i}
          className="sparkle absolute bottom-0 rounded-full animate-sparkle-float"
          style={{
            left: m.left,
            width: m.size,
            height: m.size,
            background: m.color,
            boxShadow: `0 0 ${m.size * 3}px ${m.color}, 0 0 ${m.size * 6}px ${m.color}`,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            opacity: m.opacity,
          }}
        />
      ))}
    </div>
  );
}

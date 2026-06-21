"use client";
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

interface EmberParticlesProps {
  count?: number;
  className?: string;
}

/**
 * Ambient drifting embers behind the content. Low-density and CSS-driven
 * (the `ember-fall` keyframe), sitting at the table z-index. Fully disabled
 * under `prefers-reduced-motion` — no motion, no distraction.
 */
export function EmberParticles({ count = 14, className }: EmberParticlesProps) {
  const reduce = useReducedMotion();

  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic spread so SSR/CSR match (no hydration mismatch).
        const r = ((i * 9301 + 49297) % 233280) / 233280;
        const r2 = ((i * 4099 + 1) % 251) / 251;
        return {
          left: `${Math.round(r * 100)}%`,
          size: 2 + Math.round(r2 * 4),
          duration: 6 + r * 8,
          delay: -r2 * 10,
          gold: i % 3 === 0,
        };
      }),
    [count],
  );

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-table overflow-hidden ${className ?? ""}`}
    >
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full animate-ember-fall"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            background: e.gold ? "#FFB547" : "#FF5C1A",
            boxShadow: `0 0 ${e.size * 2}px ${e.gold ? "#FFB547" : "#FF5C1A"}`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}

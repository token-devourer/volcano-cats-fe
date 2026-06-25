"use client";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface EmberParticlesProps {
  count?: number;
  className?: string;
}

/**
 * Ambient molten embers drifting up from the caldera — hot lava-orange,
 * sulfur-gold and magma-pink motes that gently rise and twinkle behind
 * the content. CSS-driven (the `sparkle-float` keyframe) and gated by
 * `prefers-reduced-motion`. Density bumped for the volcanic theme.
 */
export function EmberParticles({ count = 32, className }: EmberParticlesProps) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic spread so SSR/CSR match (no hydration mismatch).
        const r = ((i * 9301 + 49297) % 233280) / 233280;
        const r2 = ((i * 4099 + 1) % 251) / 251;
        // Molten palette: hot lava, ember, sulfur gold, occasional magma.
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
    [count],
  );

  if (!mounted || reduce) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-table overflow-hidden ${className ?? ""}`}
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

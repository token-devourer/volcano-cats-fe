"use client";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface EmberParticlesProps {
  count?: number;
  className?: string;
}

/**
 * Ambient sunny sparkles drifting up behind the content — gold / cream / sky
 * motes that gently rise and twinkle. Low-density and CSS-driven (the
 * `sparkle-float` keyframe), sitting at the table z-index. Fully disabled
 * under `prefers-reduced-motion`. (Kept the name for its existing call sites.)
 */
export function EmberParticles({ count = 14, className }: EmberParticlesProps) {
  const reduce = useReducedMotion();
  // Client-only: keeps SSR + first client paint identical (both render nothing)
  // so reduced-motion users never trip a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // Deterministic spread so SSR/CSR match (no hydration mismatch).
        const r = ((i * 9301 + 49297) % 233280) / 233280;
        const r2 = ((i * 4099 + 1) % 251) / 251;
        const palette = ["#FFC02E", "#FFF7E2", "#86E5E0"] as const;
        return {
          left: `${Math.round(r * 100)}%`,
          size: 3 + Math.round(r2 * 4),
          duration: 8 + r * 7,
          delay: -r2 * 12,
          color: palette[i % palette.length],
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
            boxShadow: `0 0 ${m.size * 2}px ${m.color}`,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}

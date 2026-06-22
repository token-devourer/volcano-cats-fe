"use client";
import { useEffect, useRef, useState } from "react";

// ============================================================
// useTableLayout — positions opponents on an arc around a center stage.
// ============================================================
// Measures the table container (ResizeObserver) and computes one seat
// position per opponent along the upper arc of an ellipse, with the local
// player anchored at the bottom (the fixed hand). Below `compactBelow` px —
// or before the first measurement — it reports `compact: true` so the caller
// falls back to a simple stacked/wrap layout that never overflows on phones.
// ============================================================

export interface SeatPos {
  /** 0–100, percentage of the container width. */
  leftPct: number;
  /** 0–100, percentage of the container height. */
  topPct: number;
}

export interface TableLayout {
  ref: React.RefObject<HTMLDivElement>;
  compact: boolean;
  seats: SeatPos[];
  size: { w: number; h: number };
}

/** Spread `count` opponents symmetrically across the upper arc of an ellipse. */
function computeArc(count: number): SeatPos[] {
  if (count <= 0) return [];
  const cx = 50;
  const cy = 47;
  const rx = 39;
  const ry = 33;
  // Wider spread as the table fills, capped so side seats never reach the hand.
  const spread = (Math.min(40 + count * 24, 200) * Math.PI) / 180;
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1) - 0.5; // -0.5 … 0.5
    const ang = t * spread; // 0 = top-center, negative = left
    return {
      leftPct: cx + Math.sin(ang) * rx,
      topPct: cy - Math.cos(ang) * ry,
    };
  });
}

export function useTableLayout(count: number, compactBelow = 640): TableLayout {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (r) setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Before measurement (w === 0) we default to compact — safer than painting an
  // absolute arc with no real dimensions.
  const compact = size.w === 0 || size.w < compactBelow;
  return { ref, compact, seats: computeArc(count), size };
}

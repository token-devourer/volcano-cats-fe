"use client";
import { useMemo } from "react";
import clsx from "clsx";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  /** Full player name — drives both the initials and the hashed color. */
  name: string;
  size?: AvatarSize;
  /** Optional explicit background color override (hex/CSS). */
  color?: string;
  /** Active-turn ring: lava glow around the avatar. */
  ring?: boolean;
  /** Accessible label; defaults to the name. */
  "aria-label"?: string;
  className?: string;
}

const SIZES: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-lg",
};

/** Stable 32-bit hash over the FULL name string (not just the first char). */
function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (Math.imul(31, h) + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Derive a legible HSL background from the name hash (fixed S/L). */
function colorForName(name: string): string {
  const hue = hashName(name) % 360;
  // Fixed saturation/lightness keep cream initials at AA contrast on every hue.
  return `hsl(${hue}, 45%, 32%)`;
}

/** First 1–2 letters of the name, uppercased (handles multi-word names). */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Circular player avatar. Background color is hashed from the full name so
 * two players named "Ali" and "Alia" get distinct colors. Initials render in
 * cream. Optional lava-glow ring marks the active turn.
 */
export function Avatar({
  name, size = "md", color, ring = false, className, ...rest
}: AvatarProps) {
  const bg = useMemo(() => color ?? colorForName(name), [color, name]);
  const label = rest["aria-label"] ?? name;

  return (
    <span
      role="img"
      aria-label={label}
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-display",
        "text-cream select-none ring-1 ring-inset ring-white/10",
        ring && "shadow-lava-glow ring-2 ring-lava",
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: bg }}
    >
      {initials(name)}
    </span>
  );
}

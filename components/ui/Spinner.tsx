"use client";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  size?: SpinnerSize;
  /** Accessible loading label (visually hidden). */
  label?: string;
  className?: string;
}

const SIZES: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

/**
 * Themed loading indicator: a lava ring. Under reduced motion it renders a
 * static ring (no spin) so it never animates against the user's preference,
 * while still signalling "busy" via role=status + the visually-hidden label.
 */
export function Spinner({ size = "md", label = "Memuat...", className }: SpinnerProps) {
  const reduce = useReducedMotion();

  return (
    <span role="status" aria-live="polite" className={clsx("inline-flex", className)}>
      <motion.span
        aria-hidden="true"
        className={clsx(
          "inline-block rounded-full border-panel-line border-t-lava",
          SIZES[size],
        )}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { repeat: Infinity, ease: "linear", duration: 0.8 }}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

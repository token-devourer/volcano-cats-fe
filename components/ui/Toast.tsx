"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";

/** Severity tone for a toast — maps to a sanctioned-palette tint. */
export type ToastTone = "info" | "action" | "success" | "warning" | "danger";

export interface ToastData {
  id: string;
  tone: ToastTone;
  /** Optional leading icon/emoji. */
  icon?: ReactNode;
  text: string;
}

export interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
  /** Auto-dismiss timeout in ms. Default 4000. Set 0 to disable. */
  duration?: number;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const TONE_TINT: Record<ToastTone, string> = {
  info:    "border-card-border bg-obsidian-3 text-cream",
  action:  "border-lava/50 bg-obsidian-3 text-cream",
  success: "border-gang-earth/60 bg-gang-earth/10 text-cream",
  warning: "border-gold/60 bg-gold/10 text-cream",
  danger:  "border-ember bg-ember/20 text-cream",
};

const TONE_BAR: Record<ToastTone, string> = {
  info:    "bg-ash-light",
  action:  "bg-lava",
  success: "bg-gang-earth",
  warning: "bg-gold",
  danger:  "bg-ember",
};

/**
 * A single notification. Auto-dismisses after `duration`, and is dismissable
 * by click or Enter/Space. Shows icon + text (never icon-only) plus a subtle
 * progress bar that drains over the lifetime (static under reduced motion).
 * Presentational only — it does not read any store.
 */
export function Toast({ toast, onDismiss, duration = 4000 }: ToastProps) {
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (duration <= 0) return;
    timer.current = setTimeout(() => onDismiss(toast.id), duration);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [toast.id, duration, onDismiss]);

  const dismiss = () => onDismiss(toast.id);

  return (
    <motion.div
      layout={!reduce}
      role={toast.tone === "danger" ? "alert" : undefined}
      tabIndex={0}
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          dismiss();
        }
      }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: reduce ? 0 : 0.22, ease: EASE_OUT }}
      className={clsx(
        "pointer-events-auto relative w-[min(90vw,24rem)] cursor-pointer overflow-hidden",
        "rounded-xl border px-4 py-3 shadow-xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-lava focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian",
        TONE_TINT[toast.tone],
      )}
    >
      <div className="flex items-center gap-2 font-body text-sm">
        {toast.icon && <span className="shrink-0 leading-none" aria-hidden="true">{toast.icon}</span>}
        <span className="leading-snug">{toast.text}</span>
      </div>

      {/* Auto-dismiss progress affordance — drains over `duration`. */}
      {duration > 0 && (
        <motion.span
          aria-hidden="true"
          className={clsx("absolute inset-x-0 bottom-0 h-0.5 origin-left", TONE_BAR[toast.tone])}
          initial={{ scaleX: 1 }}
          animate={reduce ? { scaleX: 1 } : { scaleX: 0 }}
          transition={reduce ? undefined : { duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

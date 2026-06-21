"use client";
import { AnimatePresence } from "framer-motion";
import { Toast, type ToastData } from "./Toast";

export interface ToastRegionProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  /** Per-toast auto-dismiss timeout in ms. Default 4000. */
  duration?: number;
}

/**
 * Fixed top-center stack of toasts at the `toast` z-index. The region is a
 * polite live region; individual danger toasts escalate to role="alert" so
 * deaths/errors are announced assertively. Presentational — it takes the
 * toast array as a prop and never reads a store.
 */
export function ToastRegion({ toasts, onDismiss, duration = 4000 }: ToastRegionProps) {
  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed left-1/2 top-4 z-toast flex -translate-x-1/2 flex-col items-center gap-2"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} duration={duration} />
        ))}
      </AnimatePresence>
    </div>
  );
}

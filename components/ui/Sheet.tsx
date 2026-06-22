"use client";
import { useId, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { useDialogA11y, ACCENT_HEX } from "./useDialogA11y";
import { Modal, type DialogProps } from "./Modal";
import { useIsDesktop } from "@/lib/useMediaQuery";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Bottom-sheet variant of the dialog for mobile: slides up from the bottom,
 * rounded top, drag-handle affordance. Same a11y contract as Modal
 * (role="dialog", aria-modal, focus trap, Escape + backdrop close).
 */
export function Sheet({
  open, onClose, title, icon, accent = "lava",
  dismissable = true, children, footer, className,
}: DialogProps) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const containerRef = useDialogA11y(open, dismissable ? onClose : () => {});
  const accentHex = ACCENT_HEX[accent];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-modal-backdrop flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
            onClick={dismissable ? onClose : undefined}
            aria-hidden="true"
          />

          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={clsx(
              "relative z-modal w-full max-w-lg rounded-t-2xl border-t border-x bg-panel",
              "flex flex-col gap-4 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]",
              "outline-none",
              className,
            )}
            style={{ borderColor: `${accentHex}66` }}
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: reduce ? 0 : 0.28, ease: EASE_OUT }}
          >
            {/* Drag-handle affordance (visual only) */}
            <div
              className="mx-auto h-1.5 w-10 rounded-full bg-panel-line"
              aria-hidden="true"
            />

            <header className="flex items-center gap-2">
              {icon && <span className="text-xl leading-none">{icon}</span>}
              <h2
                id={titleId}
                className="font-display text-lg tracking-tight"
                style={{ color: accentHex }}
              >
                {title}
              </h2>
            </header>

            {children && <div className="text-ink text-sm leading-relaxed">{children}</div>}

            {footer && <footer className="flex items-center justify-end gap-2">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Renders a bottom <Sheet> below the `sm` breakpoint and a centered <Modal>
 * at/above it. Same props as either. SSR-safe (defaults to Modal until the
 * media query resolves on the client).
 */
export function ResponsiveDialog(props: DialogProps) {
  const isDesktop = useIsDesktop();
  return isDesktop ? <Modal {...props} /> : <Sheet {...props} />;
}

"use client";
import { useId, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { useDialogA11y, ACCENT_HEX, type AccentToken } from "./useDialogA11y";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Title text — labels the dialog for screen readers. */
  title: string;
  /** Optional leading icon/emoji shown beside the title. */
  icon?: ReactNode;
  /** Accent token for the border/title tint. Default lava. */
  accent?: AccentToken;
  /** Allow backdrop-click + Escape to close. Default true. */
  dismissable?: boolean;
  children?: ReactNode;
  /** Optional footer region (e.g. action buttons). */
  footer?: ReactNode;
  className?: string;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const; // ease-out-quint, no overshoot

/**
 * Centered, accessible dialog. role="dialog" + aria-modal, labelled by the
 * title, focus-trapped, Escape + backdrop close (when dismissable). Uses the
 * semantic modal / modal-backdrop z-index tokens.
 */
export function Modal({
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
        <div className="fixed inset-0 z-modal-backdrop flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
            onClick={dismissable ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={clsx(
              "relative z-modal w-full max-w-md rounded-2xl border bg-obsidian-3 p-6",
              "flex flex-col gap-4 shadow-2xl outline-none",
              className,
            )}
            style={{ borderColor: `${accentHex}66` }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: EASE_OUT }}
          >
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

            {children && <div className="text-cream text-sm leading-relaxed">{children}</div>}

            {footer && <footer className="flex items-center justify-end gap-2">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

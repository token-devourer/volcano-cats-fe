"use client";
import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Shared dialog accessibility behavior for Modal / Sheet:
 *   • focuses the first focusable element on open (or the container itself),
 *   • traps Tab / Shift+Tab within the container,
 *   • closes on Escape,
 *   • restores focus to the previously-focused element on close.
 *
 * Returns a ref to attach to the dialog container.
 */
export function useDialogA11y(open: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    // Remember what had focus so we can restore it on close.
    lastFocused.current = document.activeElement as HTMLElement | null;

    // Focus the first focusable element, falling back to the container.
    const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE);
    (focusables[0] ?? container).focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const items = container!.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === container)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      // Restore focus to the trigger on close.
      lastFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return containerRef;
}

/**
 * Token color names accepted by the dialog `accent` prop. Maps to the
 * sanctioned palette only — no off-system hues.
 */
export type AccentToken =
  | "lava"
  | "gold"
  | "ember"
  | "gang-ice"
  | "gang-storm"
  | "gang-earth"
  | "gang-shadow";

/** AA-safe accent for title text + border on the cream panel (darkened hues). */
export const ACCENT_HEX: Record<AccentToken, string> = {
  lava: "#CE3D12",
  gold: "#946400",
  ember: "#CE2F28",
  "gang-ice": "#117E8C",
  "gang-storm": "#5A45C8",
  "gang-earth": "#1E9152",
  "gang-shadow": "#8A4FD0",
};

/** Bright accent (Tropic Pop tokens) for the themed backdrop glow behind a dialog. */
export const ACCENT_GLOW: Record<AccentToken, string> = {
  lava: "#F5481E",
  gold: "#FFC02E",
  ember: "#EE3B34",
  "gang-ice": "#22C7E0",
  "gang-storm": "#6D5CFF",
  "gang-earth": "#2FCB7E",
  "gang-shadow": "#B06BE6",
};

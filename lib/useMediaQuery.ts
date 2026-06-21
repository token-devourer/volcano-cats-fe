"use client";
import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query and return whether it currently matches.
 *
 * SSR-safe: returns `false` on the server and on the first client render,
 * then syncs to the real value in a layout-free effect (so it never causes
 * a hydration mismatch — the effect runs after hydration). Pass a default
 * to control the pre-hydration value if a component needs it.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    // Sync immediately, then subscribe.
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Tailwind `sm` breakpoint = 640px. True at/above it (desktop-ish). */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 640px)");
}

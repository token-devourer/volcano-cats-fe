// ============================================================
// EFFECTS CONTROLLER — turns the structured game-event stream into
// sound + signature visual effects via the effect registry.
// ============================================================
// Watches `state.log` (the server's structured GameEvent stream) and, for each
// NEW event, builds an EffectContext (seat / stage / anchor DOM rect lookups +
// flash / shake primitives) and hands it to `runEffect` — which plays the SFX
// and choreographs the per-card cinematic on the <EffectStage> canvas/overlay.
// Win/lose (confetti + fanfare) is owned by GameOver, which mounts as this
// unmounts.
// ============================================================
"use client";
import { useEffect, useRef } from "react";
import { useGame } from "@/store/game";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import { runEffect, type Pt } from "@/lib/effects/registry";

function rectCenter(el: Element | null): Pt | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!r.width && !r.height) return null;
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export function EffectsController() {
  const log = useGame((s) => s.state?.log);
  const myId = useGame((s) => s.myId);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const lastLen = useRef<number | null>(null);

  useEffect(() => {
    const events = log ?? [];
    // Skip the backlog the first time we see the stream.
    if (lastLen.current === null) {
      lastLen.current = events.length;
      return;
    }
    if (events.length < lastLen.current) lastLen.current = 0; // new game / rematch
    const fresh = events.slice(lastLen.current);
    lastLen.current = events.length;
    if (fresh.length === 0) return;

    const flash = (color: string, strength: number) => {
      const el = flashRef.current;
      if (!el || prefersReducedMotion()) return;
      el.style.backgroundColor = color;
      gsap.fromTo(el, { opacity: strength }, { opacity: 0, duration: 0.6, ease: "power2.out" });
    };

    const shake = (intensity: "small" | "medium" | "large") => {
      if (prefersReducedMotion()) return;
      const el = document.querySelector<HTMLElement>("[data-shake-root]");
      if (!el) return;
      const amp = intensity === "large" ? 14 : intensity === "medium" ? 9 : 5;
      gsap.to(el, {
        keyframes: [
          { x: -amp, duration: 0.05 },
          { x: amp, duration: 0.05 },
          { x: -amp * 0.7, duration: 0.05 },
          { x: amp * 0.7, duration: 0.05 },
          { x: -amp * 0.4, duration: 0.05 },
          { x: 0, duration: 0.05 },
        ],
        ease: "power1.inOut",
      });
    };

    const seat = (playerId?: string): Pt | null =>
      playerId ? rectCenter(document.querySelector(`[data-seat-id="${playerId}"]`)) : null;
    const stage = (): Pt | null => rectCenter(document.querySelector("[data-stage]"));
    const anchor = (name: "deck" | "discard"): Pt | null =>
      rectCenter(document.querySelector(`[data-anchor="${name}"]`));

    const reduced = prefersReducedMotion();
    for (const ev of fresh) {
      runEffect({ event: ev, myId, reduced, flash, shake, seat, stage, anchor });
    }
  }, [log, myId]);

  return (
    <div
      ref={flashRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-banner opacity-0"
    />
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Card as CardView } from "@/components/ui";
import { useGame } from "@/store/game";
import { cardName } from "@/lib/i18n";
import { getCardTheme } from "@/lib/cardTheme";
import { gsap } from "@/lib/motion/gsap";
import type { Card } from "@/lib/shared";

/**
 * A centered flourish each time a new card hits the discard pile: the card
 * arcs up with a 3D flip and a burst ring in its accent color, holds, then
 * lifts away. Driven by a GSAP timeline; degrades to a brief crossfade under
 * reduced motion.
 */
export function CardPlayAnimation() {
  const top = useGame((s) => {
    const d = s.state?.discardTop;
    return d && d.length ? d[d.length - 1] : null;
  });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<Card | null>(null);
  const lastId = useRef<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!top || top.id === lastId.current) return;
    lastId.current = top.id;
    setShown(top);
  }, [top]);

  useEffect(() => {
    if (!shown) return;
    let done = false;
    const clear = () => { if (!done) { done = true; setShown(null); } };

    const card = cardRef.current;
    if (reduce || !card) {
      const tmo = setTimeout(clear, 600);
      return () => { done = true; clearTimeout(tmo); };
    }

    const tl = gsap.timeline({ onComplete: clear });
    tl.fromTo(
      card,
      { yPercent: 60, scale: 0.5, rotateY: -120, opacity: 0 },
      { yPercent: 0, scale: 1.1, rotateY: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" },
    );
    if (ringRef.current) {
      tl.fromTo(
        ringRef.current,
        { scale: 0.2, opacity: 0.6 },
        { scale: 2.4, opacity: 0, duration: 0.6, ease: "power2.out" },
        0.1,
      );
    }
    tl.to(card, { scale: 1, duration: 0.15 });
    tl.to(card, { yPercent: -30, scale: 0.85, opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.35");

    return () => { done = true; tl.kill(); };
  }, [shown, reduce]);

  if (!shown) return null;
  const accent = getCardTheme(shown.type).color;

  return (
    <div className="pointer-events-none fixed inset-0 z-banner grid place-items-center [perspective:1000px]">
      <div
        ref={ringRef}
        aria-hidden="true"
        className="absolute h-40 w-40 rounded-full"
        style={{ border: `3px solid ${accent}`, boxShadow: `0 0 30px ${accent}`, opacity: 0 }}
      />
      <div ref={cardRef} style={{ transformStyle: "preserve-3d", opacity: reduce ? 1 : 0 }}>
        <CardView card={shown} name={cardName(shown.type)} size="lg" />
      </div>
    </div>
  );
}

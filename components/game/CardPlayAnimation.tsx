"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Card as CardView } from "@/components/ui";
import { useGame } from "@/store/game";
import { cardName } from "@/lib/i18n";
import type { Card } from "@/lib/shared";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** A brief centered flourish each time a new card hits the discard pile. */
export function CardPlayAnimation() {
  const top = useGame((s) => {
    const d = s.state?.discardTop;
    return d && d.length ? d[d.length - 1] : null;
  });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState<Card | null>(null);
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    if (!top || top.id === lastId.current) return;
    lastId.current = top.id;
    setShown(top);
    const ms = reduce ? 600 : 1200;
    const timer = setTimeout(() => setShown(null), ms);
    return () => clearTimeout(timer);
  }, [top, reduce]);

  return (
    <div className="pointer-events-none fixed inset-0 z-banner grid place-items-center">
      <AnimatePresence>
        {shown && (
          <motion.div
            key={shown.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 30 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1.1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: reduce ? 0.2 : 0.5, ease: EASE_OUT }}
          >
            <CardView card={shown} name={cardName(shown.type)} size="lg" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

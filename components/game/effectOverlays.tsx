"use client";
import { motion } from "framer-motion";

// ============================================================
// Effect overlays — self-animating DOM moments mounted by <EffectStage>.
// ============================================================
// Each plays a single in→hold→out keyframe over its lifetime (the registry
// passes a matching `ms` to fxStage.overlay). They are decorative (aria-hidden
// via the EffectStage root) and never spawn under reduced motion (the registry
// gates on ctx.reduced before calling overlay()).
// ============================================================

/** Freeze / Nope — crystalline frost creeps in from the screen edges. */
export function FrostOverlay() {
  return (
    <motion.div
      className="fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.3, times: [0, 0.18, 0.7, 1], ease: "easeInOut" }}
      style={{
        boxShadow: "inset 0 0 130px 36px rgba(34,199,224,0.5)",
        background:
          "radial-gradient(circle at 50% 50%, transparent 46%, rgba(34,199,224,0.16) 100%)",
      }}
    />
  );
}

/** Flood — a water layer surges up the screen, then recedes. */
export function FloodOverlay() {
  return (
    <motion.div
      className="fixed inset-x-0 bottom-0"
      initial={{ height: "0%", opacity: 0.85 }}
      animate={{ height: ["0%", "56%", "56%", "0%"], opacity: [0.85, 0.85, 0.85, 0] }}
      transition={{ duration: 1.5, times: [0, 0.34, 0.7, 1], ease: "easeInOut" }}
      style={{
        background:
          "linear-gradient(to top, rgba(34,199,224,0.55) 0%, rgba(34,199,224,0.22) 60%, rgba(34,199,224,0) 100%)",
        backdropFilter: "blur(1px)",
      }}
    />
  );
}

interface AtPoint {
  cx: number;
  cy: number;
}

/** Bunker — a protective dome blooms over a seat. */
export function ShieldDome({ cx, cy }: AtPoint) {
  return (
    <motion.div
      className="fixed rounded-full"
      style={{
        left: cx,
        top: cy,
        width: 150,
        height: 150,
        marginLeft: -75,
        marginTop: -75,
        border: "3px solid rgba(47,203,126,0.85)",
        background: "radial-gradient(circle, rgba(47,203,126,0.28) 0%, rgba(47,203,126,0) 70%)",
      }}
      initial={{ scale: 0.3, opacity: 0 }}
      animate={{ scale: [0.3, 1.1, 1, 1.18], opacity: [0, 1, 0.9, 0] }}
      transition={{ duration: 1.1, times: [0, 0.4, 0.7, 1], ease: "easeOut" }}
    />
  );
}

/** Elimination — a comedic ghost floats up from the fallen seat. */
export function GhostRise({ cx, cy }: AtPoint) {
  return (
    <motion.div
      className="fixed select-none text-5xl"
      style={{ left: cx, top: cy, marginLeft: -22 }}
      initial={{ y: 0, opacity: 0, rotate: -8 }}
      animate={{ y: [0, -70, -116], opacity: [0, 1, 0], rotate: [-8, 6, -4] }}
      transition={{ duration: 1.5, times: [0, 0.4, 1], ease: "easeOut" }}
    >
      👻
    </motion.div>
  );
}

/** Lockdown — a padlock slams down on a seat. */
export function LockStamp({ cx, cy }: AtPoint) {
  return (
    <motion.div
      className="fixed select-none text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
      style={{ left: cx, top: cy, marginLeft: -18, marginTop: -22 }}
      initial={{ scale: 2.2, opacity: 0, rotate: -12 }}
      animate={{ scale: [2.2, 0.9, 1, 1], opacity: [0, 1, 1, 0], rotate: [-12, 4, 0, 0] }}
      transition={{ duration: 1.0, times: [0, 0.3, 0.6, 1], ease: "backOut" }}
    >
      🔒
    </motion.div>
  );
}

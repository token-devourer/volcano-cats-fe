// ============================================================
// EFFECTS CONTROLLER — turns the structured game-event stream into
// sound + big-moment visual effects.
// ============================================================
// Watches `state.log` (the server's structured GameEvent stream) and, for each
// NEW event, plays a mapped SFX and fires GSAP one-shots for the loud moments
// (Lava Cat alarm → shake + flash, freezes → frost flash, elimination → flash).
// Weight follows the same intent as EVENT_TONE in lib/shared/events. Win/lose
// (confetti + fanfare) is owned by GameOver, which mounts as this unmounts.
// ============================================================
"use client";
import { useEffect, useRef } from "react";
import { useGame } from "@/store/game";
import { play, type SfxName } from "@/lib/sound";
import { gsap, prefersReducedMotion } from "@/lib/motion/gsap";
import type { GameEvent, GameEventKind } from "@/lib/shared";

/** Default SFX per event kind (kinds handled specially below are omitted). */
const EVENT_SFX: Partial<Record<GameEventKind, SfxName>> = {
  GAME_STARTED: "shuffle",
  CARD_PLAYED: "play",
  GANG_PLAYED: "gang",
  CARD_DREW: "draw",
  NOPE_PLAYED: "error",
  BUNKER_SAVED: "defuse",
  BUNKER_SET: "select",
  BUCKET_PLACED: "select",
  STEAL_RANDOM: "steal",
  STEAL_NAMED: "steal",
  STEAL_NONE: "error",
  GIFT_GIVEN: "steal",
  HANDS_SWAPPED: "shuffle",
  RAID: "steal",
  SHUFFLED: "shuffle",
  REVERSED: "select",
  ATTACK: "play",
  SKIPPED: "play",
  SPIED: "select",
  PEEK_SWAPPED: "select",
  FLOOD_DISCARDED: "deal",
  TIME_WARPED: "select",
  FORCED_DRAW: "draw",
};

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

    const flash = (color: string, strength: number) => {
      const el = flashRef.current;
      if (!el || prefersReducedMotion()) return;
      el.style.backgroundColor = color;
      gsap.fromTo(el, { opacity: strength }, { opacity: 0, duration: 0.6, ease: "power2.out" });
    };

    const shake = () => {
      if (prefersReducedMotion()) return;
      const el = document.querySelector<HTMLElement>("[data-shake-root]");
      if (!el) return;
      gsap.to(el, {
        keyframes: [
          { x: -10, duration: 0.05 },
          { x: 10, duration: 0.05 },
          { x: -7, duration: 0.05 },
          { x: 7, duration: 0.05 },
          { x: -4, duration: 0.05 },
          { x: 0, duration: 0.05 },
        ],
        ease: "power1.inOut",
      });
    };

    const handle = (ev: GameEvent) => {
      switch (ev.kind) {
        case "TURN_STARTED":
          if (ev.playerId === myId) play("yourTurn");
          return;
        case "LAVA_DRAWN":
          if (ev.defused) {
            play("defuse");
            flash("#36D399", 0.25);
          } else {
            play("lavaAlarm");
            shake();
            flash("#F2510E", 0.5);
          }
          return;
        case "ELIMINATED":
          play("eliminate");
          flash("#E5392B", 0.4);
          return;
        case "ACTION_NEGATED":
        case "LOCKED":
        case "FLOOD_STARTED":
          play("freeze");
          flash("#36C5E0", 0.22);
          return;
        case "WIN":
          return; // GameOver owns win/lose + confetti
        default: {
          const sfx = EVENT_SFX[ev.kind];
          if (sfx) play(sfx);
        }
      }
    };

    for (const ev of fresh) handle(ev);
  }, [log, myId]);

  return (
    <div
      ref={flashRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-banner opacity-0"
    />
  );
}

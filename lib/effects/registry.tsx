"use client";
import type { GameEvent } from "@/lib/shared";
import { getCardTheme } from "@/lib/cardTheme";
import { play } from "@/lib/sound";
import { fxStage } from "./stage";
import {
  FrostOverlay,
  FloodOverlay,
  ShieldDome,
  GhostRise,
  LockStamp,
} from "@/components/game/effectOverlays";

// ============================================================
// EFFECT REGISTRY — one signature cinematic per game moment.
// ============================================================
// `runEffect(ctx)` is called by EffectsController for every fresh GameEvent.
// It plays the moment's SFX (always — sound conveys state without motion) and,
// unless reduced-motion is on, choreographs particles / rings / beams / flashes
// / shake / DOM overlays anchored to seat + stage DOM rects.
//
// Model: CARD_PLAYED / GANG_PLAYED are the light "card thrown to the stage"
// announce; the card's BIG signature effect fires on its dedicated resolution
// event (ATTACK, SHUFFLED, FREEZE→NOPE_PLAYED, FLOOD_STARTED, LAVA_DRAWN, …) —
// which is correct game-feel: you see the card, the freeze window passes, then
// the effect lands.
// ============================================================

export interface Pt {
  x: number;
  y: number;
}

export interface EffectContext {
  event: GameEvent;
  myId: string | null;
  reduced: boolean;
  flash: (color: string, strength: number) => void;
  shake: (intensity: "small" | "medium" | "large") => void;
  seat: (playerId?: string) => Pt | null;
  stage: () => Pt | null;
  anchor: (name: "deck" | "discard") => Pt | null;
}

const COL = {
  lava: "#F5481E",
  magma: "#FF3D8B",
  ember: "#EE3B34",
  gold: "#FFC02E",
  cream: "#FFF7EC",
  fire: "#FF6A2B",
  ice: "#22C7E0",
  storm: "#6D5CFF",
  earth: "#2FCB7E",
  shadow: "#B06BE6",
  sand: "#FFE6B0",
  dust: "#C9A36A",
  ash: "#5A4632",
  smoke: "#3A2A20",
};

const GANG: Record<string, string> = {
  GANG_FIRE: COL.fire,
  GANG_ICE: COL.ice,
  GANG_STORM: COL.storm,
  GANG_EARTH: COL.earth,
  GANG_SHADOW: COL.shadow,
};

const UP = -Math.PI / 2;

export function runEffect(ctx: EffectContext): void {
  const ev = ctx.event;
  const vp: Pt = { x: window.innerWidth / 2, y: window.innerHeight * 0.42 };
  const center = ctx.stage() ?? vp;
  const seatOr = (id?: string): Pt => ctx.seat(id) ?? center;

  switch (ev.kind) {
    case "GAME_STARTED":
      play("shuffle");
      return;

    case "TURN_STARTED": {
      if (ev.playerId !== ctx.myId) return;
      play("yourTurn");
      if (ctx.reduced) return;
      const me = ctx.seat(ctx.myId ?? undefined);
      if (me) fxStage.ring({ x: me.x, y: me.y, color: COL.gold, maxR: 170, life: 30, width: 3 });
      return;
    }

    case "CARD_DREW": {
      play("draw");
      if (ctx.reduced) return;
      const deck = ctx.anchor("deck") ?? center;
      fxStage.burst({ x: deck.x, y: deck.y, count: 7, colors: [COL.gold, COL.cream], speed: 2, size: 3, shape: "star" });
      return;
    }

    case "CARD_PLAYED": {
      play("play");
      if (ctx.reduced) return;
      const accent = getCardTheme(ev.cardType).color;
      fxStage.burst({ x: center.x, y: center.y, count: 14, colors: [accent, COL.cream], speed: 3.4, size: 5 });
      return;
    }

    case "GANG_PLAYED": {
      const color = GANG[ev.cardType] ?? COL.fire;
      if (ev.combo === "rainbow") {
        play("rainbowPop");
        if (ctx.reduced) return;
        [COL.fire, COL.ice, COL.storm, COL.earth, COL.shadow].forEach((cl, i) =>
          window.setTimeout(
            () => fxStage.burst({ x: center.x, y: center.y, count: 18, colors: [cl, COL.cream], speed: 5, size: 6 }),
            i * 70,
          ),
        );
        fxStage.ring({ x: center.x, y: center.y, color: COL.magma, maxR: 280, life: 42, width: 5 });
        ctx.shake("medium");
      } else if (ev.combo === "quad") {
        play("comboBig");
        if (ctx.reduced) return;
        fxStage.burst({ x: center.x, y: center.y, count: 30, colors: [color, COL.cream], speed: 5, size: 6 });
        fxStage.ring({ x: center.x, y: center.y, color, maxR: 210, life: 36, width: 4 });
        ctx.shake("small");
      } else {
        play("gang");
        if (ctx.reduced) return;
        fxStage.burst({
          x: center.x, y: center.y,
          count: ev.combo === "triple" ? 22 : 16,
          colors: [color, COL.cream], speed: 4.2, size: 5,
        });
      }
      return;
    }

    case "LAVA_DRAWN": {
      const at = seatOr(ev.playerId);
      if (ev.defused) {
        play("defuse");
        play("steam");
        if (ctx.reduced) return;
        ctx.flash(COL.ice, 0.22);
        fxStage.burst({ x: at.x, y: at.y, count: 24, colors: [COL.ice, COL.cream], speed: 4, size: 5, shape: "drop", gravity: 0.28 });
        fxStage.burst({ x: at.x, y: at.y, count: 12, colors: [COL.cream], speed: 2, size: 8, shape: "smoke", gravity: -0.05 });
        return;
      }
      play("eruptBoom");
      if (ctx.reduced) return;
      ctx.shake("large");
      ctx.flash(COL.magma, 0.5);
      fxStage.vignette({ color: COL.magma, strength: 0.5, life: 46 });
      fxStage.burst({ x: at.x, y: at.y, count: 40, colors: [COL.lava, COL.magma, COL.gold], speed: 7, size: 7, gravity: 0.18, angle: UP, spread: Math.PI });
      fxStage.ring({ x: at.x, y: at.y, color: COL.lava, maxR: 300, life: 40, width: 6 });
      fxStage.burst({ x: at.x, y: at.y, count: 16, colors: [COL.smoke, COL.ash], speed: 3, size: 9, shape: "smoke", gravity: -0.04 });
      return;
    }

    case "ELIMINATED": {
      play("eliminate");
      play("crumble");
      if (ctx.reduced) return;
      const at = seatOr(ev.playerId);
      ctx.flash(COL.ember, 0.38);
      ctx.shake("large");
      fxStage.burst({ x: at.x, y: at.y, count: 34, colors: [COL.ember, COL.ash, COL.smoke], speed: 5, size: 7, gravity: 0.3 });
      fxStage.overlay(<GhostRise cx={at.x} cy={at.y} />, 1500);
      return;
    }

    case "NOPE_PLAYED":
    case "ACTION_NEGATED": {
      play("freezeCrack");
      if (ctx.reduced) return;
      ctx.flash(COL.ice, 0.24);
      fxStage.overlay(<FrostOverlay />, 1300);
      fxStage.burst({ x: center.x, y: center.y, count: 20, colors: [COL.ice, COL.cream], speed: 4, size: 5, shape: "shard", gravity: 0.18 });
      return;
    }

    case "ATTACK": {
      play("impact");
      if (ctx.reduced) return;
      const from = seatOr(ev.actorId);
      const to = seatOr(ev.targetId);
      fxStage.beam(from, to, { color: COL.lava, size: 9, life: 22 });
      ctx.shake("medium");
      window.setTimeout(() => {
        fxStage.ring({ x: to.x, y: to.y, color: COL.lava, maxR: 130, life: 28, width: 4 });
        fxStage.burst({ x: to.x, y: to.y, count: 18, colors: [COL.lava, COL.gold], speed: 4.5, size: 5 });
      }, 360);
      return;
    }

    case "SKIPPED": {
      play("yawn");
      if (ctx.reduced) return;
      const at = seatOr(ev.actorId);
      fxStage.burst({ x: at.x, y: at.y, count: 10, colors: [COL.cream, "#CFE8FF"], speed: 2, size: 7, shape: "smoke", gravity: -0.05 });
      return;
    }

    case "SPIED": {
      play("scan");
      if (ctx.reduced) return;
      const deck = ctx.anchor("deck") ?? center;
      fxStage.ring({ x: deck.x, y: deck.y, color: COL.gold, maxR: 96, life: 26, width: 3 });
      fxStage.burst({ x: deck.x, y: deck.y, count: 10, colors: [COL.gold, COL.cream], speed: 2.5, size: 4, shape: "star" });
      return;
    }

    case "SHUFFLED": {
      play("rumble");
      if (ctx.reduced) return;
      ctx.shake("medium");
      const deck = ctx.anchor("deck") ?? center;
      fxStage.burst({ x: deck.x, y: deck.y + 36, count: 20, colors: [COL.dust, "#A98A5A"], speed: 3.5, size: 6, shape: "smoke", gravity: 0.06, angle: UP, spread: Math.PI });
      return;
    }

    case "GIFT_GIVEN": {
      play("ribbon");
      if (ctx.reduced) return;
      const from = seatOr(ev.fromId);
      const to = seatOr(ev.toId);
      fxStage.beam(from, to, { color: COL.gold, size: 7, life: 24 });
      window.setTimeout(
        () => fxStage.burst({ x: to.x, y: to.y, count: 14, colors: [COL.gold, COL.magma, COL.cream], speed: 3.5, size: 5, shape: "star" }),
        380,
      );
      return;
    }

    case "REVERSED": {
      play("reverseWhoosh");
      if (ctx.reduced) return;
      fxStage.ring({ x: center.x, y: center.y, color: COL.storm, maxR: 230, life: 34, width: 5 });
      fxStage.burst({ x: center.x, y: center.y, count: 18, colors: [COL.storm, COL.cream], speed: 4, size: 5 });
      return;
    }

    case "FORCED_DRAW": {
      play("shot");
      if (ctx.reduced) return;
      const from = seatOr(ev.actorId);
      const to = seatOr(ev.targetId);
      fxStage.beam(from, to, { color: COL.ember, size: 6, life: 16 });
      window.setTimeout(() => {
        fxStage.burst({ x: to.x, y: to.y, count: 14, colors: [COL.ember, COL.gold], speed: 5, size: 4, shape: "spark" });
        ctx.shake("small");
      }, 260);
      return;
    }

    case "PEEK_SWAPPED": {
      play("shutterSwap");
      if (ctx.reduced) return;
      ctx.flash(COL.cream, 0.18);
      fxStage.burst({ x: center.x, y: center.y, count: 10, colors: [COL.gold, COL.cream], speed: 3, size: 4, shape: "star" });
      return;
    }

    case "BUNKER_SET": {
      play("shieldHum");
      if (ctx.reduced) return;
      const at = seatOr(ev.playerId);
      fxStage.overlay(<ShieldDome cx={at.x} cy={at.y} />, 1100);
      fxStage.ring({ x: at.x, y: at.y, color: COL.earth, maxR: 120, life: 30, width: 4 });
      return;
    }

    case "BUNKER_SAVED": {
      play("shieldHum");
      play("defuse");
      if (ctx.reduced) return;
      const at = seatOr(ev.playerId);
      ctx.flash(COL.earth, 0.2);
      fxStage.overlay(<ShieldDome cx={at.x} cy={at.y} />, 900);
      fxStage.burst({ x: at.x, y: at.y, count: 16, colors: [COL.earth, COL.cream], speed: 4, size: 5 });
      return;
    }

    case "STEAL_RANDOM":
    case "STEAL_NAMED": {
      play("sneakGrab");
      if (ctx.reduced) return;
      const from = seatOr(ev.targetId);
      const to = seatOr(ev.actorId);
      fxStage.beam(from, to, { color: COL.gold, size: 6, life: 22 });
      window.setTimeout(
        () => fxStage.burst({ x: to.x, y: to.y, count: 12, colors: [COL.gold, COL.cream], speed: 3, size: 4, shape: "star" }),
        360,
      );
      return;
    }

    case "STEAL_NONE": {
      play("whiff");
      if (ctx.reduced) return;
      const at = seatOr(ev.targetId);
      fxStage.burst({ x: at.x, y: at.y, count: 10, colors: ["#CFCFCF", COL.cream], speed: 2.5, size: 5, shape: "smoke", gravity: -0.03 });
      return;
    }

    case "HANDS_SWAPPED": {
      play("shuffle");
      if (ctx.reduced) return;
      const a = seatOr(ev.actorId);
      const b = seatOr(ev.targetId);
      fxStage.beam(a, b, { color: COL.storm, size: 6, life: 24 });
      fxStage.beam(b, a, { color: COL.gold, size: 6, life: 24 });
      return;
    }

    case "RAID": {
      play("comboBig");
      if (ctx.reduced) return;
      const to = seatOr(ev.actorId);
      fxStage.ring({ x: to.x, y: to.y, color: COL.gold, maxR: 210, life: 34, width: 4 });
      fxStage.burst({ x: to.x, y: to.y, count: 26, colors: [COL.gold, COL.magma, COL.cream], speed: 4.5, size: 5, shape: "star" });
      return;
    }

    case "LOCKED": {
      play("lockSlam");
      if (ctx.reduced) return;
      const at = seatOr(ev.targetId);
      ctx.flash(COL.storm, 0.2);
      fxStage.overlay(<LockStamp cx={at.x} cy={at.y} />, 1000);
      return;
    }

    case "FLOOD_STARTED": {
      play("wave");
      if (ctx.reduced) return;
      ctx.flash(COL.ice, 0.18);
      fxStage.overlay(<FloodOverlay />, 1500);
      return;
    }

    case "FLOOD_DISCARDED": {
      play("deal");
      if (ctx.reduced) return;
      const at = seatOr(ev.playerId);
      fxStage.burst({ x: at.x, y: at.y, count: 8, colors: [COL.ice, COL.cream], speed: 2.5, size: 4, shape: "drop", gravity: 0.3 });
      return;
    }

    case "TIME_WARPED": {
      play("rewind");
      if (ctx.reduced) return;
      const disc = ctx.anchor("discard") ?? center;
      const to = seatOr(ev.actorId);
      fxStage.beam(disc, to, { color: COL.storm, size: 6, life: 26 });
      fxStage.ring({ x: disc.x, y: disc.y, color: COL.storm, maxR: 120, life: 30, width: 3 });
      return;
    }

    case "BUCKET_PLACED": {
      play("select");
      if (ctx.reduced) return;
      const deck = ctx.anchor("deck") ?? center;
      fxStage.burst({ x: deck.x, y: deck.y, count: 10, colors: [COL.ice, COL.cream], speed: 2.5, size: 4, shape: "drop", gravity: 0.3 });
      return;
    }

    // Win/lose celebration + its fanfare are owned by GameOver.
    case "WIN":
    case "PLAYER_AWAY":
    case "PLAYER_DISCONNECTED":
    case "PLAYER_RECONNECTED":
    case "AUTO_PLAYED":
      return;
  }
}

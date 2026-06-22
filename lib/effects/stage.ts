"use client";
import type { ReactNode } from "react";

// ============================================================
// EFFECT STAGE — a tiny, capped canvas particle engine.
// ============================================================
// A module-level singleton that holds particle / ring / beam / vignette
// queues. The <EffectStage> component drives a single rAF loop that steps
// physics and paints these onto one full-viewport canvas. The effect
// registry (lib/effects/registry.ts) spawns into it via these helpers,
// anchoring to seat / stage DOM rects (viewport coordinates).
//
// Everything is bounded (a hard particle cap) and mobile-aware (counts halve
// on coarse pointers). Nothing here runs under reduced motion — callers in the
// registry gate on `ctx.reduced` and simply don't spawn.
// ============================================================

export type ParticleShape = "circle" | "shard" | "drop" | "smoke" | "spark" | "star";

export interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  size: number; color: string; shape: ParticleShape;
  gravity: number; drag: number; rot: number; spin: number; fade: number;
}
export interface Ring {
  x: number; y: number; r: number; maxR: number;
  life: number; maxLife: number; color: string; width: number;
}
export interface Beam {
  x: number; y: number; sx: number; sy: number; tx: number; ty: number;
  life: number; maxLife: number; color: string; size: number;
  trail: { x: number; y: number }[];
}
export interface Vignette {
  life: number; maxLife: number; color: string; strength: number;
}

export interface BurstOpts {
  x: number; y: number;
  count?: number;
  colors: string[];
  /** base speed (px/frame at 60fps) */
  speed?: number;
  spread?: number;      // radians of the cone full-width (default 2π)
  angle?: number;       // cone center, radians (default -π/2 = up)
  gravity?: number;
  size?: number;
  shape?: ParticleShape;
  life?: number;        // frames
  drag?: number;        // 0..1 velocity retention per frame (default 0.98)
}

export interface BeamOpts {
  color: string;
  size?: number;
  life?: number;        // frames to travel
  shape?: ParticleShape;
}

const TAU = Math.PI * 2;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = (arr: string[]) => arr[(Math.random() * arr.length) | 0];

class EffectStageImpl {
  particles: Particle[] = [];
  rings: Ring[] = [];
  beams: Beam[] = [];
  vignettes: Vignette[] = [];
  mobile = false;
  cap = 240;
  /** Registered by <EffectStage> to mount transient DOM overlays. */
  overlayMount: ((node: ReactNode, ms: number) => void) | null = null;

  private scale(n: number) {
    return this.mobile ? Math.max(1, Math.ceil(n / 2)) : n;
  }
  private room() {
    return Math.max(0, this.cap - this.particles.length);
  }

  burst(o: BurstOpts) {
    const n = Math.min(this.scale(o.count ?? 24), this.room());
    const speed = o.speed ?? 4.2;
    const spread = o.spread ?? TAU;
    const angle = o.angle ?? -Math.PI / 2;
    const gravity = o.gravity ?? 0.12;
    const baseSize = o.size ?? 5;
    const shape = o.shape ?? "circle";
    const life = o.life ?? 46;
    const drag = o.drag ?? 0.98;
    for (let i = 0; i < n; i++) {
      const a = angle + rand(-spread / 2, spread / 2);
      const sp = speed * rand(0.45, 1.15);
      const ml = life * rand(0.7, 1.1);
      this.particles.push({
        x: o.x, y: o.y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: ml, maxLife: ml,
        size: baseSize * rand(0.6, 1.25),
        color: pick(o.colors), shape,
        gravity, drag, rot: rand(0, TAU), spin: rand(-0.3, 0.3), fade: 1,
      });
    }
  }

  /** A continuous emitter for `ms` milliseconds (e.g. flowing lava / water). */
  stream(o: BurstOpts & { ms: number; rate?: number }) {
    const end = performance.now() + o.ms;
    const rate = o.rate ?? 3;
    const tick = () => {
      if (performance.now() > end) return;
      this.burst({ ...o, count: rate });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  ring(o: { x: number; y: number; color: string; maxR?: number; life?: number; width?: number }) {
    this.rings.push({
      x: o.x, y: o.y, r: 4, maxR: o.maxR ?? 160,
      life: o.life ?? 34, maxLife: o.life ?? 34,
      color: o.color, width: o.width ?? 4,
    });
  }

  beam(from: { x: number; y: number }, to: { x: number; y: number }, o: BeamOpts) {
    this.beams.push({
      x: from.x, y: from.y, sx: from.x, sy: from.y, tx: to.x, ty: to.y,
      life: o.life ?? 26, maxLife: o.life ?? 26,
      color: o.color, size: o.size ?? 7, trail: [],
    });
  }

  vignette(o: { color: string; strength?: number; life?: number }) {
    this.vignettes.push({
      life: o.life ?? 40, maxLife: o.life ?? 40,
      color: o.color, strength: o.strength ?? 0.5,
    });
  }

  overlay(node: ReactNode, ms: number) {
    this.overlayMount?.(node, ms);
  }

  clear() {
    this.particles.length = 0;
    this.rings.length = 0;
    this.beams.length = 0;
    this.vignettes.length = 0;
  }

  /** Advance one frame. Called by <EffectStage>'s rAF loop. */
  step() {
    const ps = this.particles;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.vy += p.gravity;
      p.vx *= p.drag; p.vy *= p.drag;
      p.x += p.vx; p.y += p.vy;
      p.rot += p.spin;
      p.life--;
      if (p.life <= 0) ps.splice(i, 1);
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      const t = 1 - r.life / r.maxLife;
      r.r = 4 + (r.maxR - 4) * (1 - (1 - t) * (1 - t)); // ease-out
      r.life--;
      if (r.life <= 0) this.rings.splice(i, 1);
    }
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      const t = 1 - b.life / b.maxLife;
      b.x = b.sx + (b.tx - b.sx) * t;
      b.y = b.sy + (b.ty - b.sy) * t;
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > 10) b.trail.shift();
      b.life--;
      if (b.life <= 0) this.beams.splice(i, 1);
    }
    for (let i = this.vignettes.length - 1; i >= 0; i--) {
      this.vignettes[i].life--;
      if (this.vignettes[i].life <= 0) this.vignettes.splice(i, 1);
    }
  }

  get isIdle() {
    return (
      this.particles.length === 0 && this.rings.length === 0 &&
      this.beams.length === 0 && this.vignettes.length === 0
    );
  }
}

export const fxStage = new EffectStageImpl();

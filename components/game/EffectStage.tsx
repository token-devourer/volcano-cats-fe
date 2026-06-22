"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { fxStage, type Particle } from "@/lib/effects/stage";

// ============================================================
// <EffectStage> — one full-viewport canvas + a DOM overlay root.
// ============================================================
// Drives a single requestAnimationFrame loop that steps + paints the fxStage
// particle/ring/beam/vignette queues, and renders transient React overlays
// (frost, flood line, shield dome, lock, "NOPE" stamp) pushed via
// fxStage.overlay(node, ms). Mount this once inside the playing screen, above
// the table but below modals.
// ============================================================

interface OverlayItem {
  id: number;
  node: ReactNode;
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const a = Math.min(1, p.life / p.maxLife);
  ctx.globalAlpha = a;
  ctx.fillStyle = p.color;
  ctx.strokeStyle = p.color;
  switch (p.shape) {
    case "shard": {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillRect(-p.size * 0.22, -p.size * 0.8, p.size * 0.44, p.size * 1.6);
      ctx.restore();
      break;
    }
    case "drop": {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }
    case "smoke": {
      const grow = p.size * (1.4 + (1 - a) * 2.2);
      ctx.globalAlpha = a * 0.34;
      ctx.beginPath();
      ctx.arc(p.x, p.y, grow, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "spark": {
      ctx.lineWidth = Math.max(1, p.size * 0.4);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2);
      ctx.stroke();
      break;
    }
    case "star": {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.lineWidth = Math.max(1, p.size * 0.3);
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.stroke();
      ctx.restore();
      break;
    }
    default: {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function EffectStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);
  const overlayId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    fxStage.mobile =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches || window.innerWidth < 720);

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mount transient overlays via the singleton.
    fxStage.overlayMount = (node, ms) => {
      const id = ++overlayId.current;
      setOverlays((list) => [...list, { id, node }]);
      window.setTimeout(() => {
        setOverlays((list) => list.filter((o) => o.id !== id));
      }, ms);
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (fxStage.isIdle) return;

      fxStage.step();
      ctx.globalCompositeOperation = "lighter";

      for (const p of fxStage.particles) drawParticle(ctx, p);

      for (const r of fxStage.rings) {
        ctx.globalAlpha = Math.min(1, r.life / r.maxLife);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = r.width;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const b of fxStage.beams) {
        ctx.globalAlpha = Math.min(1, b.life / b.maxLife);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.size * 0.5;
        ctx.beginPath();
        b.trail.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
        ctx.stroke();
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      for (const v of fxStage.vignettes) {
        const a = (v.life / v.maxLife) * v.strength;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.28, w / 2, h / 2, Math.max(w, h) * 0.72);
        g.addColorStop(0, "transparent");
        g.addColorStop(1, v.color);
        ctx.globalAlpha = a;
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      fxStage.overlayMount = null;
      fxStage.clear();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-banner"
      />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-banner">
        {overlays.map((o) => (
          <div key={o.id}>{o.node}</div>
        ))}
      </div>
    </>
  );
}

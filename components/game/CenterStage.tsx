"use client";
import { Card } from "@/components/ui";
import { cardName, t } from "@/lib/i18n";
import type { Card as CardT } from "@/lib/shared";
import clsx from "clsx";
import { useEffect, useState } from "react";

interface CenterStageProps {
  deckCount: number;
  topDiscard?: CardT;
  canDraw: boolean;
  onDraw: () => void;
}

/**
 * The heart of the table: the deck + discard, ringed by a warm "stage" pool
 * where played cards fly in and their signature effects resolve. Listens to
 * the global `vc:stage-pulse` event (fired by EffectsController on turn starts
 * + card plays) and flashes the lava halo + glow ring in response.
 */
export function CenterStage({ deckCount, topDiscard, canDraw, onDraw }: CenterStageProps) {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const onPulse = () => {
      setPulse((p) => p + 1);
      window.setTimeout(() => setPulse((p) => Math.max(0, p - 1)), 900);
    };
    window.addEventListener("vc:stage-pulse", onPulse as EventListener);
    return () => window.removeEventListener("vc:stage-pulse", onPulse as EventListener);
  }, []);
  const active = pulse > 0;

  return (
    <div className="relative flex flex-col items-center">
      {/* Molten caldera pool — hot lava center fading to ember underglow. */}
      <div
        data-stage
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute left-1/2 top-1/2 h-[clamp(13rem,38vw,20rem)] w-[clamp(13rem,38vw,20rem)] -translate-x-1/2 -translate-y-1/2 rounded-full animate-lava-pulse transition-transform duration-500",
          active && "scale-110",
        )}
        style={{
          background:
            "radial-gradient(circle, rgba(255,138,61,0.55) 0%, rgba(255,87,34,0.35) 28%, rgba(255,46,110,0.18) 56%, rgba(74,18,7,0) 78%)",
          filter: active ? "blur(2px) brightness(1.4) saturate(1.25)" : "blur(2px)",
          transition: "filter 400ms ease-out, transform 500ms ease-out",
        }}
      />
      {/* Heat shimmer ring */}
      <div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute left-1/2 top-1/2 h-[clamp(8rem,24vw,13rem)] w-[clamp(8rem,24vw,13rem)] -translate-x-1/2 -translate-y-1/2 rounded-full animate-glow-pulse transition-opacity duration-300",
        )}
        style={{
          background:
            "radial-gradient(circle, rgba(255,192,46,0.25) 0%, rgba(255,87,34,0.10) 50%, transparent 75%)",
          opacity: active ? 1 : 0.7,
        }}
      />

      <div className="relative flex items-end justify-center gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-2" data-anchor="discard">
          <span className="text-xs uppercase tracking-widest text-ink-soft">{t("game.discard")}</span>
          {topDiscard ? (
            <Card card={topDiscard} name={cardName(topDiscard.type)} size="md" />
          ) : (
            <div className="grid h-[clamp(7rem,22vw,9rem)] w-[clamp(5rem,16vw,6.5rem)] place-items-center rounded-2xl border border-dashed border-panel-line text-ink-soft/50">
              —
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2" data-anchor="deck">
          <span className="text-xs uppercase tracking-widest text-ink-soft">
            {t("game.deck")} · {deckCount}
          </span>
          <Card
            card={{ id: "deck", type: "LAVA_CAT" }}
            name={t("game.deck")}
            faceDown
            size="md"
            disabled={!canDraw}
            onActivate={canDraw ? onDraw : undefined}
            className={clsx(canDraw && "ring-2 ring-lava ring-offset-2 ring-offset-wood shadow-lava-glow")}
          />
        </div>
      </div>
    </div>
  );
}

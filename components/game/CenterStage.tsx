"use client";
import { Card } from "@/components/ui";
import { cardName, t } from "@/lib/i18n";
import type { Card as CardT } from "@/lib/shared";
import clsx from "clsx";

interface CenterStageProps {
  deckCount: number;
  topDiscard?: CardT;
  canDraw: boolean;
  onDraw: () => void;
}

/**
 * The heart of the table: the deck + discard, ringed by a warm "stage" pool
 * where played cards fly in and their signature effects resolve. The pool is
 * tagged `data-stage` so the effect engine (EffectStage / registry) can anchor
 * bursts to the table center; the deck and discard carry `data-anchor` so card
 * travel (draw → hand, play → discard) can target them.
 */
export function CenterStage({ deckCount, topDiscard, canDraw, onDraw }: CenterStageProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Resolve halo — sits behind the piles (DOM order keeps it underneath). */}
      <div
        data-stage
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[clamp(11rem,34vw,17rem)] w-[clamp(11rem,34vw,17rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,247,226,0.85) 0%, rgba(255,230,176,0.35) 42%, rgba(255,230,176,0) 72%)",
        }}
      />

      <div className="relative flex items-end justify-center gap-6 sm:gap-10">
        {/* Discard */}
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

        {/* Deck */}
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

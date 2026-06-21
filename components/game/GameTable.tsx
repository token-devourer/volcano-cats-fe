"use client";
import { Card, Button } from "@/components/ui";
import { PlayerSeat } from "./PlayerSeat";
import { useGame } from "@/store/game";
import { send } from "@/lib/net/client";
import { cardName, t } from "@/lib/i18n";
import clsx from "clsx";

/**
 * The shared table: opponents arranged in a responsive wrap (no fixed-radius
 * arc that breaks on mobile), the deck + discard in the center, and the draw
 * affordance. Reads game state directly; sends only the DRAW command.
 */
export function GameTable() {
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  if (!state) return null;

  const currentId = state.turnOrder[state.currentTurnIndex];
  const isMyTurn = currentId === myId;
  const canDraw = isMyTurn && state.phase.kind === "turn";
  const currentName = state.players.find((p) => p.id === currentId)?.name ?? "";
  const opponents = state.players.filter((p) => p.id !== myId);
  const topDiscard = state.discardTop[state.discardTop.length - 1];

  return (
    <section className="relative flex flex-1 flex-col items-center justify-between gap-4 px-4 pb-4 pt-3">
      {/* Opponents */}
      <div className="flex w-full max-w-3xl flex-wrap items-start justify-center gap-x-5 gap-y-3">
        {opponents.map((p) => (
          <PlayerSeat key={p.id} player={p} isCurrent={p.id === currentId} isMe={false} compact />
        ))}
      </div>

      {/* Turn banner */}
      <div className="text-center" aria-live="polite">
        <p
          className={clsx(
            "font-display text-lg",
            isMyTurn ? "text-cream drop-shadow-[0_0_14px_rgba(214,58,11,0.55)]" : "text-cream/85",
          )}
        >
          {isMyTurn ? t("game.yourTurn") : `${t("status.turn")} ${currentName}`}
        </p>
        {state.turnsRemaining > 1 && (
          <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-0.5 text-sm font-semibold text-ink ring-1 ring-gold/60">
            {currentName} · {state.turnsRemaining}× giliran
          </p>
        )}
      </div>

      {/* Deck + discard */}
      <div className="flex items-end justify-center gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-cream/80">{t("game.discard")}</span>
          {topDiscard ? (
            <Card card={topDiscard} name={cardName(topDiscard.type)} size="md" />
          ) : (
            <div className="grid h-[clamp(7rem,22vw,9rem)] w-[clamp(5rem,16vw,6.5rem)] place-items-center rounded-2xl border border-dashed border-panel-line text-cream/40">
              —
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-cream/80">
            {t("game.deck")} · {state.deckCount}
          </span>
          <Card
            card={{ id: "deck", type: "LAVA_CAT" }}
            name={t("game.deck")}
            faceDown
            size="md"
            disabled={!canDraw}
            onActivate={canDraw ? () => send({ t: "DRAW" }) : undefined}
            className={clsx(canDraw && "ring-2 ring-lava ring-offset-2 ring-offset-wood shadow-lava-glow")}
          />
        </div>
      </div>

      {/* Draw button (primary affordance when it's your turn) */}
      <div className="h-12">
        {canDraw && (
          <Button variant="primary" size="lg" onClick={() => send({ t: "DRAW" })} className="animate-slide-up">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="3" width="11" height="15" rx="2" />
              <path d="M20 8v11a2 2 0 0 1-2 2H9" opacity={0.6} />
              <path d="M9.5 11.5 9.5 7M7.5 9 9.5 11.5 11.5 9" />
            </svg>
            {t("action.draw")}
          </Button>
        )}
      </div>
    </section>
  );
}

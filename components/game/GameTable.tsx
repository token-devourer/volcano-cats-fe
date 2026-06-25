"use client";
import { Button } from "@/components/ui";
import { PlayerSeat } from "./PlayerSeat";
import { PlayerRoster } from "./PlayerRoster";
import { CenterStage } from "./CenterStage";
import { useTableLayout } from "@/lib/useTableLayout";
import { useGame } from "@/store/game";
import { send } from "@/lib/net/client";
import { t } from "@/lib/i18n";
import clsx from "clsx";

/**
 * The shared table. On phones (or before measurement) it's a safe stacked
 * layout: opponents wrap across the top, the center stage below. On wider
 * screens `useTableLayout` seats opponents on an arc around the CenterStage —
 * deck, discard and the effect "stage" at the heart of the table. A
 * PlayerRoster panel docks to the side as a clear scoreboard.
 */
export function GameTable() {
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  const opponents = state ? state.players.filter((p) => p.id !== myId) : [];
  const layout = useTableLayout(opponents.length);
  if (!state) return null;


  const currentId = state.turnOrder[state.currentTurnIndex];
  const isMyTurn = currentId === myId;
  const canDraw = isMyTurn && state.phase.kind === "turn";
  const currentName = state.players.find((p) => p.id === currentId)?.name ?? "";
  const topDiscard = state.discardTop[state.discardTop.length - 1];
  const draw = () => send({ t: "DRAW" });

  const turnBanner = (
    <div className="text-center" aria-live="polite">
      <p
        className={clsx(
          "font-display text-lg",
          isMyTurn ? "text-lava drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]" : "text-ink-soft",
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
  );

  const drawButton = canDraw && (
    <Button variant="primary" size="lg" onClick={draw} className="animate-slide-up">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="3" width="11" height="15" rx="2" />
        <path d="M20 8v11a2 2 0 0 1-2 2H9" opacity={0.6} />
        <path d="M9.5 11.5 9.5 7M7.5 9 9.5 11.5 11.5 9" />
      </svg>
      {t("action.draw")}
    </Button>
  );

  const stage = (
    <CenterStage deckCount={state.deckCount} topDiscard={topDiscard} canDraw={canDraw} onDraw={draw} />
  );

  return (
    <section ref={layout.ref} data-table className="relative flex-1">
      {layout.compact ? (
        // --- Stacked / wrap (phones, or pre-measurement) ---
        <div className="flex h-full flex-col items-center justify-between gap-4 px-4 pb-4 pt-3">
          <div className="flex w-full max-w-3xl flex-wrap items-start justify-center gap-x-5 gap-y-3">
            {opponents.map((p) => (
              <PlayerSeat key={p.id} player={p} isCurrent={p.id === currentId} isMe={false} compact />
            ))}
          </div>
          {turnBanner}
          {stage}
          <div className="h-12">{drawButton}</div>
        </div>
      ) : (
        // --- Arc around the center stage (tablet / desktop) ---
        <div className="relative h-full min-h-[22rem]">
          {opponents.map((p, i) => {
            const pos = layout.seats[i];
            return (
              <div
                key={p.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.leftPct}%`, top: `${pos.topPct}%` }}
              >
                <PlayerSeat player={p} isCurrent={p.id === currentId} isMe={false} compact />
              </div>
            );
          })}

          <div className="absolute inset-x-0 top-2 flex justify-center">{turnBanner}</div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{stage}</div>

          <div className="absolute inset-x-0 bottom-3 flex h-12 justify-center">{drawButton}</div>
        </div>
      )}
    </section>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { useGame } from "@/store/game";
import { send } from "@/lib/net/client";
import { cardName, t } from "@/lib/i18n";

const WINDOW_MS = 4000;

/**
 * Top banner shown while an action sits in the freeze window. Anyone holding
 * a Freeze can cancel the pending action before the countdown ends. The bar
 * drains using the server-provided `endsAt` timestamp.
 */
export function FreezeBanner() {
  const state = useGame((s) => s.state);
  const hand = useGame((s) => s.hand);
  const myId = useGame((s) => s.myId);
  const [now, setNow] = useState(() => Date.now());

  const inWindow = state?.phase.kind === "nope_window";

  useEffect(() => {
    if (!inWindow) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [inWindow]);

  if (!state || state.phase.kind !== "nope_window") return null;

  const { pending, endsAt } = state.phase;
  const remaining = Math.max(0, endsAt - now);
  const pct = Math.min(100, Math.max(0, (remaining / WINDOW_MS) * 100));
  const actorName = state.players.find((p) => p.id === pending.actorId)?.name ?? "Pemain";
  const hasFreeze = hand.some((c) => c.type === "FREEZE");
  const canFreeze = hasFreeze && pending.actorId !== myId;
  const negated = state.phase.freezeCount % 2 === 1;

  return (
    <div className="fixed left-1/2 top-[max(0.75rem,env(safe-area-inset-top))] z-banner w-[min(92vw,28rem)] -translate-x-1/2 animate-slide-up">
      <div className="overflow-hidden rounded-2xl border border-gang-ice/60 bg-panel/95 shadow-panel backdrop-blur">
        <div className="h-1.5 bg-gang-ice/20">
          <div className="h-full bg-gang-ice transition-[width] duration-100 ease-linear" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center gap-3 p-3">
          <span className="text-2xl" aria-hidden="true">❄️</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">
              {actorName} · {cardName(pending.cardType)}
            </p>
            <p className="text-xs text-ink-soft">
              {negated ? "Akan dibatalkan!" : t("game.freezeWindow")}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            disabled={!canFreeze}
            onClick={() => send({ t: "FREEZE" })}
          >
            {t("action.freeze")}
          </Button>
        </div>
      </div>
    </div>
  );
}

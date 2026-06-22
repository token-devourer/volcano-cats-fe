"use client";
import { useEffect } from "react";
import { Button, Avatar } from "@/components/ui";
import { useGame } from "@/store/game";
import { send } from "@/lib/net/client";
import { play } from "@/lib/sound";
import { celebrate } from "@/lib/motion/confetti";
import { t } from "@/lib/i18n";
import clsx from "clsx";

export function GameOver({ onLeave }: { onLeave: () => void }) {
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  const iWon = state?.winnerId === myId && !!state?.winnerId;

  // Fanfare + confetti on arrival (confetti no-ops under reduced motion).
  useEffect(() => {
    if (iWon) {
      play("win");
      celebrate();
    } else {
      play("lose");
    }
  }, [iWon]);

  if (!state) return null;

  const winner = state.players.find((p) => p.id === state.winnerId);
  const me = state.players.find((p) => p.id === myId);
  const isHost = me?.isHost ?? false;
  const standings = [...state.players].sort((a, b) => Number(b.id === state.winnerId) - Number(a.id === state.winnerId));

  return (
    <div className="fixed inset-0 z-modal grid place-items-center overflow-hidden bg-ink/45 px-4 backdrop-blur-md">
      <div className="relative z-modal w-full max-w-md animate-slide-up rounded-3xl border border-panel-line bg-panel/95 p-6 text-center shadow-panel">
        <div className="mb-2 text-7xl" aria-hidden="true">{iWon ? "🏆" : "💀"}</div>
        <h1 className={clsx(
          "font-display text-3xl",
          iWon
            ? "bg-gold-gradient bg-clip-text text-transparent [filter:drop-shadow(0_2px_3px_rgba(150,95,0,0.4))]"
            : "text-ember",
        )}>
          {iWon ? t("over.youWin") : winner ? t("over.winner", { name: winner.name }) : t("over.noWinner")}
        </h1>
        {!iWon && <p className="mt-1 text-sm text-ink-soft">{t("over.youLose")}</p>}

        <ul className="mt-6 space-y-2 rounded-2xl border border-panel-line bg-panel-2 p-4 text-left">
          {standings.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <Avatar name={p.name} size="sm" />
              <span className="flex-1 truncate text-ink">{p.name}</span>
              <span aria-hidden="true">{p.id === state.winnerId ? "🏆" : "💀"}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          {isHost && (
            <Button variant="primary" size="lg" fullWidth onClick={() => send({ t: "REMATCH" })}>
              🔁 {t("action.rematch")}
            </Button>
          )}
          <Button variant="ghost" size="lg" fullWidth onClick={onLeave}>
            {t("action.leave")}
          </Button>
        </div>
      </div>
    </div>
  );
}

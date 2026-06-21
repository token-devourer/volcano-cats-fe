"use client";
import { Button, Avatar } from "@/components/ui";
import { EmberParticles } from "@/components/animations/EmberParticles";
import { useGame } from "@/store/game";
import { send } from "@/lib/net/client";
import { t } from "@/lib/i18n";
import clsx from "clsx";

export function GameOver({ onLeave }: { onLeave: () => void }) {
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  if (!state) return null;

  const winner = state.players.find((p) => p.id === state.winnerId);
  const iWon = state.winnerId === myId;
  const me = state.players.find((p) => p.id === myId);
  const isHost = me?.isHost ?? false;
  const standings = [...state.players].sort((a, b) => Number(b.id === state.winnerId) - Number(a.id === state.winnerId));

  return (
    <div className="fixed inset-0 z-modal grid place-items-center overflow-hidden bg-wood-deep/85 px-4 backdrop-blur-md">
      {iWon && <EmberParticles count={28} />}
      <div className="relative z-modal w-full max-w-md animate-slide-up text-center">
        <div className="mb-2 text-7xl" aria-hidden="true">{iWon ? "🏆" : "💀"}</div>
        <h1 className={clsx("font-display text-3xl", iWon ? "text-gold drop-shadow-[0_2px_8px_rgba(230,163,23,0.5)]" : "text-ember")}>
          {iWon ? t("over.youWin") : winner ? t("over.winner", { name: winner.name }) : t("over.noWinner")}
        </h1>
        {!iWon && <p className="mt-1 text-sm text-cream/80">{t("over.youLose")}</p>}

        <ul className="mt-6 space-y-2 rounded-2xl border border-panel-line bg-panel p-4 text-left">
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

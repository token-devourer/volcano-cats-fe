"use client";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduce = useReducedMotion();

  const pop = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, scale: 0.85, y: 18 }, animate: { opacity: 1, scale: 1, y: 0 } };

  return (
    <div className="fixed inset-0 z-modal grid place-items-center overflow-hidden bg-ink/45 px-4 backdrop-blur-md">
      <motion.div
        {...pop}
        transition={{ type: reduce ? "tween" : "spring", stiffness: 320, damping: 22, duration: reduce ? 0.2 : undefined }}
        className={clsx(
          "relative z-modal w-full max-w-md rounded-3xl border bg-panel/95 p-6 text-center shadow-panel",
          iWon ? "border-gold/50 shadow-gold-glow" : "border-panel-line",
        )}
      >
        <motion.div
          className="mb-2 text-7xl"
          aria-hidden="true"
          initial={reduce ? undefined : { scale: 0, rotate: -20 }}
          animate={reduce ? undefined : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.12 }}
        >
          {iWon ? "🏆" : "💀"}
        </motion.div>
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
          {standings.map((p) => {
            const won = p.id === state.winnerId;
            return (
              <li
                key={p.id}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-2 py-1.5",
                  won && "bg-gold/20 ring-1 ring-gold/50",
                )}
              >
                <Avatar name={p.name} size="sm" ring={won} />
                <span className={clsx("flex-1 truncate", won ? "font-semibold text-ink" : "text-ink-soft")}>{p.name}</span>
                <span aria-hidden="true">{won ? "👑" : "💀"}</span>
              </li>
            );
          })}
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
      </motion.div>
    </div>
  );
}

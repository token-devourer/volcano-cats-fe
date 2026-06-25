"use client";
import type { ClientPlayer } from "@/lib/shared";
import { t } from "@/lib/i18n";
import clsx from "clsx";

interface PlayerRosterProps {
  players: ClientPlayer[];
  currentId: string | undefined;
  myId: string | null;
  turnsRemaining: number;
}

/**
 * Caldera roster — a compact "who's at the table" panel. Lists every seat with
 * name, hand count, and live status (turn, host, you, bunker, locked, away,
 * offline, eliminated). The active seat lights up in lava-orange so the table
 * order is obvious without scanning the arc layout.
 */
export function PlayerRoster({ players, currentId, myId, turnsRemaining }: PlayerRosterProps) {
  return (
    <aside
      aria-label="Daftar pemain"
      className="rounded-2xl border border-panel-line/70 bg-panel/80 p-3 shadow-lg backdrop-blur"
    >
      <header className="mb-2 flex items-center justify-between px-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
          🌋 Kursi Kawah
        </span>
        <span className="rounded-full bg-magma/15 px-2 py-0.5 text-[10px] font-semibold text-ember ring-1 ring-magma/30">
          {players.filter((p) => p.alive).length}/{players.length}
        </span>
      </header>
      <ol className="flex flex-col gap-1">
        {players.map((p, i) => {
          const isCurrent = p.id === currentId;
          const isMe = p.id === myId;
          return (
            <li
              key={p.id}
              className={clsx(
                "relative flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-all",
                isCurrent && p.alive
                  ? "border-lava/60 bg-[linear-gradient(90deg,rgba(255,87,34,0.22),rgba(255,138,61,0.06))] shadow-lava-glow"
                  : "border-transparent",
                !p.alive && "opacity-50 grayscale",
              )}
            >
              {isCurrent && p.alive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-lava shadow-lava-glow animate-lava-pulse"
                />
              )}
              <span
                className={clsx(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                  isCurrent && p.alive
                    ? "bg-lava text-cream"
                    : "bg-panel-2 text-ink-soft ring-1 ring-panel-line",
                )}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={clsx(
                      "truncate text-sm font-semibold",
                      isCurrent && p.alive ? "text-cream" : "text-ink",
                    )}
                  >
                    {p.name}
                  </span>
                  {isMe && (
                    <span className="rounded bg-gold/20 px-1 text-[9px] font-bold uppercase tracking-wider text-gold ring-1 ring-gold/30">
                      {t("status.you")}
                    </span>
                  )}
                  {p.isHost && (
                    <span className="text-[10px]" aria-label={t("status.host")}>👑</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-ink-soft">
                  {!p.alive ? (
                    <span className="font-semibold text-ember">💀 {t("status.dead")}</span>
                  ) : (
                    <>
                      <span aria-label={t("game.deckCount", { count: p.handCount })}>
                        🂠 {p.handCount}
                      </span>
                      {p.hasBunker && <span title={t("status.bunker")}>🛡️</span>}
                      {p.locked && <span title={t("status.locked")}>🔒</span>}
                      {!p.connected && <span className="text-ember" title={t("status.offline")}>● off</span>}
                      {p.connected && p.away && <span title={t("status.away")}>😴</span>}
                      {isCurrent && (
                        <span className="ml-auto rounded-full bg-lava/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-lava ring-1 ring-lava/40 animate-glow-pulse">
                          {turnsRemaining > 1 ? `Giliran ×${turnsRemaining}` : "Giliran"}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

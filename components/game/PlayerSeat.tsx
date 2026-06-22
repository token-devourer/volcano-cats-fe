"use client";
import { Avatar, StatusBadge } from "@/components/ui";
import type { ClientPlayer } from "@/lib/shared";
import { t } from "@/lib/i18n";
import clsx from "clsx";

interface PlayerSeatProps {
  player: ClientPlayer;
  isCurrent: boolean;
  isMe: boolean;
  compact?: boolean;
}

/**
 * One opponent (or self) around the table: avatar with an active-turn ring,
 * name, status badges (always icon + text), and hand count. Dead players are
 * dimmed but still legible.
 */
export function PlayerSeat({ player, isCurrent, isMe, compact }: PlayerSeatProps) {
  return (
    <div
      data-seat-id={player.id}
      className={clsx(
        "flex flex-col items-center gap-1 transition-opacity duration-300",
        !player.alive && "opacity-40",
      )}
    >
      <Avatar
        name={player.name}
        size={compact ? "sm" : "md"}
        ring={isCurrent && player.alive}
        aria-label={player.name}
      />
      <div className="flex max-w-[88px] items-center gap-1">
        <span className="truncate text-xs font-semibold text-ink">{player.name}</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        {!player.alive ? (
          <StatusBadge variant="dead" label={t("status.dead")} />
        ) : (
          <>
            {player.isHost && <StatusBadge variant="host" label={t("status.host")} />}
            {isMe && <StatusBadge variant="you" label={t("status.you")} />}
            {player.hasBunker && <StatusBadge variant="bunker" label={t("status.bunker")} />}
            {player.locked && <StatusBadge variant="locked" label={t("status.locked")} />}
            {!player.connected && <StatusBadge variant="offline" label={t("status.offline")} />}
            {player.connected && player.away && <StatusBadge variant="away" label={t("status.away")} />}
          </>
        )}
      </div>

      {player.alive && (
        <span className="text-[11px] text-ink-soft" aria-label={t("game.deckCount", { count: player.handCount })}>
          🂠 {player.handCount}
        </span>
      )}
    </div>
  );
}

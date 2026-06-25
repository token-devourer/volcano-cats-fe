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
 * One player around the caldera. Active player gets a pulsing ember ring
 * and a heat-glow plaque; eliminated players turn ash-cold; the seat sits
 * on the dark volcanic table so all text uses the (now-light) ink token.
 */
export function PlayerSeat({ player, isCurrent, isMe, compact }: PlayerSeatProps) {
  return (
    <div
      data-seat-id={player.id}
      className={clsx(
        "relative flex flex-col items-center gap-1 rounded-2xl px-3 py-2 transition-all duration-300",
        isCurrent && player.alive &&
          "bg-[radial-gradient(circle_at_50%_30%,rgba(255,87,34,0.28),rgba(255,87,34,0)_70%)] shadow-lava-glow ring-1 ring-lava/60 animate-lava-pulse",
        !player.alive && "opacity-50 grayscale",
      )}
    >
      {/* Active turn aura behind avatar */}
      {isCurrent && player.alive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 rounded-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,138,61,0.35) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      )}

      <Avatar
        name={player.name}
        size={compact ? "sm" : "md"}
        ring={isCurrent && player.alive}
        aria-label={player.name}
      />
      <div className="relative flex max-w-[88px] items-center gap-1">
        <span
          className={clsx(
            "truncate text-xs font-semibold",
            isCurrent && player.alive ? "text-cream drop-shadow-[0_0_6px_rgba(255,87,34,0.7)]" : "text-ink",
          )}
        >
          {player.name}
        </span>
      </div>
      <div className="relative flex flex-wrap items-center justify-center gap-1">
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
        <span className="relative text-[11px] text-ink-soft" aria-label={t("game.deckCount", { count: player.handCount })}>
          🂠 {player.handCount}
        </span>
      )}
    </div>
  );
}

"use client";
import clsx from "clsx";
import { t } from "@/lib/i18n";

export type StatusVariant =
  | "host"
  | "you"
  | "away"
  | "locked"
  | "bunker"
  | "dead"
  | "offline";

export interface StatusBadgeProps {
  variant: StatusVariant;
  /** Override the localized label if needed. */
  label?: string;
  className?: string;
}

interface StatusStyle {
  icon: string;
  /** i18n key for the label text. */
  key: string;
  /** Tailwind tint classes — sanctioned palette only. */
  tint: string;
}

const STYLES: Record<StatusVariant, StatusStyle> = {
  host:    { icon: "👑", key: "status.host",    tint: "bg-gold/15 text-gold border-gold/40" },
  you:     { icon: "🫵", key: "status.you",     tint: "bg-lava/15 text-lava border-lava/40" },
  away:    { icon: "💤", key: "status.away",    tint: "bg-obsidian-2 text-ash-light border-card-border" },
  locked:  { icon: "🔒", key: "status.locked",  tint: "bg-gang-storm/15 text-gang-storm border-gang-storm/40" },
  bunker:  { icon: "🛡️", key: "status.bunker",  tint: "bg-gang-earth/15 text-gang-earth border-gang-earth/40" },
  dead:    { icon: "💀", key: "status.dead",    tint: "bg-ember/20 text-cream border-ember/60" },
  offline: { icon: "📵", key: "status.offline", tint: "bg-obsidian-2 text-ash-light border-card-border" },
};

/**
 * Small status pill that ALWAYS shows both an icon and text (never icon-only
 * — accessibility). Sized to sit in a row of badges without overlapping.
 */
export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const s = STYLES[variant];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
        "font-body text-[11px] font-medium leading-none whitespace-nowrap",
        s.tint,
        className,
      )}
    >
      <span aria-hidden="true">{s.icon}</span>
      <span>{label ?? t(s.key)}</span>
    </span>
  );
}

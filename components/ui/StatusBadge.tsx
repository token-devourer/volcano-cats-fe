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
  host:    { icon: "👑", key: "status.host",    tint: "bg-gold text-ink border-gold/60" },
  you:     { icon: "🫵", key: "status.you",     tint: "bg-lava text-cream border-lava/60" },
  away:    { icon: "💤", key: "status.away",    tint: "bg-wood-deep text-cream/85 border-wood-deep" },
  locked:  { icon: "🔒", key: "status.locked",  tint: "bg-gang-storm text-cream border-gang-storm/60" },
  bunker:  { icon: "🛡️", key: "status.bunker",  tint: "bg-gang-earth text-cream border-gang-earth/60" },
  dead:    { icon: "💀", key: "status.dead",    tint: "bg-ember text-cream border-ember/60" },
  offline: { icon: "📵", key: "status.offline", tint: "bg-wood-deep text-cream/85 border-wood-deep" },
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

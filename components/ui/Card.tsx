"use client";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import type { CardType } from "@/lib/shared";
import { getCardTheme } from "@/lib/cardTheme";
import { useTilt } from "@/lib/motion/useTilt";
import { play } from "@/lib/sound";
import { CardArt, CardPip, CardBackArt } from "./CardArt";

export type CardSize = "sm" | "md" | "lg" | "responsive";

export interface CardProps {
  card: { id: string; type: CardType };
  /** Localized display name (from i18n — this component does not look it up). */
  name: string;
  /** Localized short description for the aria-label + tooltip. */
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  faceDown?: boolean;
  size?: CardSize;
  /** Pointer click handler. */
  onClick?: () => void;
  /** Keyboard activation (Enter/Space). Falls back to onClick if omitted. */
  onActivate?: () => void;
  className?: string;
}

/** Each size is just a `--card-width`; every interior measure derives from it. */
const CARD_WIDTH: Record<CardSize, string> = {
  sm: "4rem", // 64px
  md: "6rem", // 96px
  lg: "8rem", // 128px
  responsive: "clamp(3.75rem, 17vw, 7rem)",
};

/** Corner pips only earn their keep above the tiny hand size. */
const SHOW_CORNERS: Record<CardSize, boolean> = {
  sm: false, md: true, lg: true, responsive: true,
};

/** Stable 0–3s shine offset from the card id, so the hand glints out of phase. */
function shineDelay(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 30) / 10;
}

interface TipPos { x: number; y: number; place: "top" | "bottom" }

/**
 * The playing-card primitive. A single cream face tinted by the card's
 * accent (`lib/cardTheme`), carrying bespoke SVG art (`CardArt`) — never
 * emoji. Interactive cards are real buttons (keyboard + focus ring); the
 * description tooltip renders in a fixed-position portal so it escapes the
 * hand's horizontal scroll container instead of being clipped by it.
 */
export function Card({
  card, name, description, selected = false, disabled = false,
  faceDown = false, size = "md", onClick, onActivate, className,
}: CardProps) {
  const theme = getCardTheme(card.type);
  const interactive = !!(onClick || onActivate);
  const playable = interactive && !disabled;

  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [tip, setTip] = useState<TipPos | null>(null);
  useEffect(() => setMounted(true), []);

  // Pointer-driven 3D tilt + shine (fine-pointer, motion-on only).
  useTilt(ref, { enabled: interactive && !faceDown, max: 9 });

  const activate = () => {
    if (!playable) return;
    play("select");
    (onActivate ?? onClick)?.();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (!playable) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
  };

  const showTip = () => {
    const el = ref.current;
    if (!el || faceDown || !description) return;
    const r = el.getBoundingClientRect();
    const place: "top" | "bottom" = r.top < 140 ? "bottom" : "top";
    setTip({
      x: Math.min(Math.max(r.left + r.width / 2, 96), window.innerWidth - 96),
      y: place === "top" ? r.top - 10 : r.bottom + 10,
      place,
    });
  };
  const hideTip = () => setTip(null);

  const showCorners = SHOW_CORNERS[size] && !faceDown;
  const ariaLabel = description ? `${name}, ${description}` : name;

  const style: CSSProperties = {
    // Custom props the CSS reads. (Type cast keeps TS happy about `--vars`.)
    ["--card-width" as string]: CARD_WIDTH[size],
    ["--card-accent" as string]: theme.color,
  };

  const content = (
    <>
      {faceDown ? (
        <div className="vc-card__art"><CardBackArt /></div>
      ) : (
        <>
          <div className="vc-card__art"><CardArt type={card.type} /></div>
          {showCorners && (
            <>
              <span className="vc-card__corner vc-card__corner--tl"><CardPip type={card.type} /></span>
              <span className="vc-card__corner vc-card__corner--br"><CardPip type={card.type} /></span>
            </>
          )}
          <span className="vc-card__name">{name}</span>
        </>
      )}
      {playable && !selected && (
        <span className="vc-card__shine" style={{ animationDelay: `${shineDelay(card.id)}s` }} aria-hidden="true" />
      )}
    </>
  );

  const classes = clsx(
    "vc-card",
    faceDown && "vc-card--back",
    selected && "vc-card--selected",
    playable && !selected && "vc-card--playable",
    interactive && disabled && "vc-card--disabled",
    className,
  );

  const onEnter = () => {
    if (playable) play("hover");
    showTip();
  };
  const handlers = {
    onMouseEnter: onEnter,
    onMouseLeave: hideTip,
    onFocus: showTip,
    onBlur: hideTip,
    title: !faceDown && description ? `${name} — ${description}` : undefined,
  };

  return (
    <>
      {interactive ? (
        <button
          ref={ref as React.RefObject<HTMLButtonElement>}
          type="button"
          aria-label={ariaLabel}
          aria-disabled={!playable || undefined}
          aria-pressed={selected || undefined}
          onClick={playable ? activate : undefined}
          onKeyDown={onKeyDown}
          className={classes}
          style={style}
          {...handlers}
        >
          {content}
        </button>
      ) : (
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          aria-label={description ? ariaLabel : undefined}
          className={classes}
          style={style}
          {...handlers}
        >
          {content}
        </div>
      )}

      {/* Description tooltip — portalled to <body> and fixed-positioned so the
          hand's overflow-x scroll container can never clip it. */}
      {mounted && createPortal(
        <AnimatePresence>
          {tip && description && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              // Keep the centering translate while framer-motion drives scale.
              transformTemplate={(_, generated) =>
                `translate(-50%, ${tip.place === "top" ? "-100%" : "0"}) ${generated}`}
              style={{
                left: tip.x,
                top: tip.y,
                zIndex: 60,
                transformOrigin: tip.place === "top" ? "bottom center" : "top center",
                borderColor: `${theme.color}66`,
              }}
              className="pointer-events-none fixed w-44 max-w-[60vw] rounded-xl border bg-panel/95 px-3 py-2 text-center backdrop-blur-sm"
            >
              <p className="font-display text-sm leading-tight text-ink">{name}</p>
              <p className="mt-0.5 text-xs leading-snug text-ink-soft">{description}</p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

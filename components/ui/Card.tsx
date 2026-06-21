"use client";
import { useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { CardType } from "@/lib/shared";
import { getCardTheme } from "@/lib/cardTheme";

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

/**
 * Fixed widths use a 2:3 aspect ratio. The `responsive` size scales with the
 * viewport via clamp() and never overflows a 320px phone (min 56px).
 */
const SIZE_STYLE: Record<CardSize, CSSProperties> = {
  sm: { width: "4rem" }, // 64px
  md: { width: "6rem" }, // 96px
  lg: { width: "8rem" }, // 128px
  responsive: { width: "clamp(3.5rem, 18vw, 7rem)" },
};

/** Emoji scales with the card; clamp keeps it sane on the responsive size. */
const EMOJI_STYLE: Record<CardSize, string> = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
  responsive: "text-[clamp(1.5rem,7vw,2.75rem)]",
};

const NAME_STYLE: Record<CardSize, string> = {
  sm: "text-[8px]",
  md: "text-[10px]",
  lg: "text-xs",
  responsive: "text-[clamp(7px,2.6vw,11px)]",
};

/**
 * The playing-card primitive. Renders a custom image (with a legible gradient
 * name overlay) when `lib/cardTheme` provides one, otherwise an emoji on the
 * card's gradient. Always falls back to emoji if an image fails to load.
 *
 * Interactive cards are real <button>s (keyboard-activatable, focus ring,
 * aria-label = name + description). Tooltip shows on hover AND focus.
 * No coupling to any store.
 */
export function Card({
  card, name, description, selected = false, disabled = false,
  faceDown = false, size = "md", onClick, onActivate, className,
}: CardProps) {
  const theme = getCardTheme(card.type);
  const [imgFailed, setImgFailed] = useState(false);
  const [active, setActive] = useState(false); // hovered OR focused → tooltip + accent

  const interactive = !disabled && (!!onClick || !!onActivate);
  const showImage = !faceDown && !!theme.image && !imgFailed;
  const ariaLabel = description ? `${name}, ${description}` : name;

  const activate = () => {
    (onActivate ?? onClick)?.();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  };

  // Border + shadow per state. Disabled desaturates the border (not opacity
  // alone); selected gets a lava lift + glow; default uses the card accent.
  const borderColor = disabled
    ? "#2E2E44"
    : selected
      ? "#FF5C1A"
      : active
        ? theme.color
        : "#2E2E44";
  const boxShadow = selected
    ? `0 -6px 24px ${theme.glow}, 0 0 28px rgba(255,92,26,0.55)`
    : active && !disabled
      ? `0 8px 24px rgba(0,0,0,0.6), 0 0 12px ${theme.glow}`
      : "0 4px 12px rgba(0,0,0,0.5)";

  return (
    <div
      className={clsx("relative select-none", interactive && "group", className)}
      style={SIZE_STYLE[size]}
    >
      <button
        type="button"
        disabled={!interactive}
        aria-label={ariaLabel}
        aria-pressed={onClick || onActivate ? selected : undefined}
        onClick={interactive ? activate : undefined}
        onKeyDown={interactive ? onKeyDown : undefined}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className={clsx(
          "relative block w-full overflow-hidden rounded-2xl border text-left",
          "transition-[transform,box-shadow,border-color,filter] duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-lava focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian",
          interactive && "cursor-pointer",
          // Lift on hover/focus and when selected (no-ops under reduced motion via global CSS)
          interactive && !selected && "hover:-translate-y-2 focus-visible:-translate-y-2",
          selected && "-translate-y-4",
          // Disabled: dim + desaturate (state, not just opacity)
          disabled && "cursor-not-allowed opacity-60 saturate-50",
        )}
        style={{
          aspectRatio: "2 / 3",
          borderColor,
          boxShadow,
        }}
      >
        {faceDown ? (
          <CardBack emojiClass={EMOJI_STYLE[size]} />
        ) : showImage ? (
          <ImageFace
            src={theme.image!}
            name={name}
            accent={theme.color}
            nameClass={NAME_STYLE[size]}
            sizeKey={size}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <EmojiFace
            emoji={theme.emoji}
            name={name}
            gradient={theme.gradient}
            accent={theme.color}
            emojiClass={EMOJI_STYLE[size]}
            nameClass={NAME_STYLE[size]}
          />
        )}
      </button>

      {/* Tooltip — on hover AND focus (not hover-only). Centered above the
          card; uses tooltip z-index. `title` attr is the always-available
          fallback for assistive tech / clipped viewports. */}
      {!faceDown && description && active && (
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-tooltip w-44 max-w-[60vw]
                     -translate-x-1/2 rounded-lg border bg-obsidian-3 px-3 py-2 text-center shadow-xl"
          style={{ borderColor: `${theme.color}66` }}
        >
          <p className="font-display text-sm" style={{ color: theme.color }}>{name}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ash-light">{description}</p>
        </div>
      )}
    </div>
  );
}

function ImageFace({
  src, name, accent, nameClass, sizeKey, onError,
}: {
  src: string;
  name: string;
  accent: string;
  nameClass: string;
  sizeKey: CardSize;
  onError: () => void;
}) {
  // Hint the browser at the rendered width per size (responsive uses the max).
  const sizes =
    sizeKey === "sm" ? "64px"
    : sizeKey === "lg" ? "128px"
    : sizeKey === "responsive" ? "(max-width: 640px) 18vw, 112px"
    : "96px";

  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
        // Custom uploaded art may have odd dimensions — don't fail the build.
        unoptimized
        onError={onError}
      />
      {/* Bottom gradient so the name stays legible over any art. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
      <div className="absolute inset-x-1.5 bottom-1.5 text-center">
        <p className={clsx("font-display uppercase leading-tight tracking-wide drop-shadow-md", nameClass)}
           style={{ color: "#F0EAD6" }}>
          {name}
        </p>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset"
            style={{ boxShadow: `inset 0 0 0 1px ${accent}33` }} aria-hidden="true" />
    </div>
  );
}

function EmojiFace({
  emoji, name, gradient, accent, emojiClass, nameClass,
}: {
  emoji: string;
  name: string;
  gradient: string;
  accent: string;
  emojiClass: string;
  nameClass: string;
}) {
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between p-2"
      style={{ background: gradient }}
    >
      {/* Subtle top sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      <div className={clsx("my-auto text-center drop-shadow", emojiClass)} aria-hidden="true">
        {emoji}
      </div>
      <p className={clsx("relative text-center font-display uppercase leading-tight tracking-wide", nameClass)}
         style={{ color: "#F0EAD6" }}>
        {name}
      </p>
      {/* Accent hairline at the bottom (full-width, not a side-stripe). */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5" style={{ background: accent }} aria-hidden="true" />
    </div>
  );
}

/** The lava-stripe card back. */
function CardBack({ emojiClass }: { emojiClass: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-card-gradient">
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(45deg, rgba(255,92,26,0.06) 0px, rgba(255,92,26,0.06) 2px, transparent 2px, transparent 10px)",
        }}
        aria-hidden="true"
      />
      <span className={clsx("relative", emojiClass)} aria-hidden="true">🌋</span>
    </div>
  );
}

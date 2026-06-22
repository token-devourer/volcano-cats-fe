import type { ReactNode } from "react";
import type { CardType } from "@/lib/shared";

// ============================================================
// CARD ART — bespoke inline-SVG identity for every card.
// ============================================================
// Replaces emoji with a coherent, hand-built icon set drawn in the
// volcanic line-art style: bold rounded strokes on a 64×64 grid,
// coloured entirely through `currentColor` so the Card primitive can
// tint each glyph with the card's accent. No external assets, no
// network, crisp at any size, theme-able from one place.
//
// Recognisability over realism — each glyph leans on a single strong
// silhouette so it still reads at the 12px corner-pip size.
// ============================================================

const G = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Filled accent at a soft opacity — used for "glow fills" inside a glyph. */
const SOFT = { fill: "currentColor", stroke: "none", opacity: 0.16 } as const;
const DOT = { fill: "currentColor", stroke: "none" } as const;

const GLYPHS: Record<CardType, ReactNode> = {
  // ---------------- DANGER ----------------
  // An angry cat head crowned by a spark burst — the exploding kitten.
  LAVA_CAT: (
    <>
      <path {...SOFT} d="M17 27C13 43 21 53 32 53s19-10 15-26l-15-5z" />
      <g {...G}>
        <path d="M19 27 14 12l14 9" />
        <path d="M45 27 50 12 36 21" />
        <path d="M17 27c-4 16 4 26 15 26s19-10 15-26" />
        <path d="M24 35l5 2M40 35l-5 2" />
        <path d="M32 41v3" />
        <path d="M22 43l-6-1M42 43l6-1" />
      </g>
      <g {...G} strokeWidth={2.2}>
        <path d="M32 9V4M25 11l-3-5M39 11l3-5" />
      </g>
    </>
  ),
  // A pail of water with a falling droplet — the antidote.
  WATER_BUCKET: (
    <>
      <path {...SOFT} d="M19 31h26l-3 21a3 3 0 0 1-3 3H25a3 3 0 0 1-3-3z" />
      <g {...G}>
        <path d="M32 7c4 6 7 9 7 13a7 7 0 0 1-14 0c0-4 3-7 7-13z" />
        <path d="M19 31h26l-3 21a3 3 0 0 1-3 3H25a3 3 0 0 1-3-3z" />
        <path d="M22 31a10 8 0 0 1 20 0" />
        <path d="M24 40h16" opacity={0.6} />
      </g>
    </>
  ),

  // ---------------- CLASSIC ACTIONS ----------------
  // Crescent moon + a "Z" — skip / nap.
  NAP_TIME: (
    <>
      <path {...SOFT} d="M40 14a17 17 0 1 0 6 30 14 14 0 0 1-6-30z" />
      <g {...G}>
        <path d="M40 14a17 17 0 1 0 6 30 14 14 0 0 1-6-30z" />
        <path d="M42 13h8l-8 8h8" strokeWidth={2.2} />
      </g>
    </>
  ),
  // Erupting volcano with a plume — attack / pass the heat on.
  ERUPTION: (
    <>
      <path {...SOFT} d="M14 51 26 27h12l12 24z" />
      <g {...G}>
        <path d="M14 51 26 27h12l12 24z" />
        <path d="M26 27q6 6 12 0" />
        <path d="M32 23V11M24 25l-5-9M40 25l5-9" />
        <path d="M22 51h20" opacity={0.5} />
      </g>
    </>
  ),
  // Binoculars — see the future.
  SPY_CAT: (
    <g {...G}>
      <circle cx="22" cy="39" r="8" />
      <circle cx="42" cy="39" r="8" />
      <path d="M30 39h4" />
      <path d="M16 32l3-11h6l1 10" />
      <path d="M48 32l-3-11h-6l-1 10" />
      <circle cx="22" cy="39" r="2.4" {...DOT} />
      <circle cx="42" cy="39" r="2.4" {...DOT} />
    </g>
  ),
  // Cracked, trembling ground — shuffle.
  EARTHQUAKE: (
    <g {...G}>
      <path d="M12 33l8-6 4 9 8-11 6 9 8-7" />
      <path d="M10 23q-3 6 0 13" opacity={0.5} />
      <path d="M54 23q3 6 0 13" opacity={0.5} />
      <path d="M16 49h32" />
      <path d="M28 49l3-6 4 6" opacity={0.6} />
    </g>
  ),
  // Snowflake — the counter (Nope).
  FREEZE: (
    <g {...G} strokeWidth={2.4}>
      <path d="M32 10v44M13.4 21 50.6 43M13.4 43 50.6 21" />
      <path d="M32 10l-4 5M32 10l4 5M32 54l-4-5M32 54l4-5" />
      <path d="M13.4 21l.3 6.4M13.4 21l6.2-1.4M50.6 43l-.3-6.4M50.6 43l-6.2 1.4" />
      <path d="M13.4 43l6.2 1.4M13.4 43l.3-6.4M50.6 21l-6.2-1.4M50.6 21l-.3 6.4" />
      <circle cx="32" cy="32" r="2.4" {...DOT} />
    </g>
  ),
  // Wrapped gift box — favour.
  BRIBE: (
    <>
      <path {...SOFT} d="M16 30h32v22a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2z" />
      <g {...G}>
        <rect x="16" y="30" width="32" height="24" rx="2" />
        <path d="M13 30h38v6H13z" />
        <path d="M32 24v30" />
        <path d="M32 25c-3-7-12-6-9 0 4 3 9 0 9 0z" />
        <path d="M32 25c3-7 12-6 9 0-4 3-9 0-9 0z" />
      </g>
    </>
  ),

  // ---------------- NEW MECHANICS ----------------
  // Two arrows looping back — reverse turn order.
  REVERSE: (
    <g {...G}>
      <path d="M17 26A16 16 0 0 1 45 22" />
      <path d="M48 38A16 16 0 0 1 20 42" />
      <path d="M17 26l-1-7M17 26l7-1" />
      <path d="M48 38l1 7M48 38l-7 1" />
    </g>
  ),
  // Crosshair — sniper, pick your shot.
  SNIPER: (
    <g {...G}>
      <circle cx="32" cy="32" r="15" />
      <path d="M32 9v9M32 46v9M9 32h9M46 32h9" />
      <circle cx="32" cy="32" r="3" {...DOT} />
    </g>
  ),
  // Eye over a two-way swap — peek and swap.
  PEEK_AND_SWAP: (
    <>
      <g {...G}>
        <path d="M14 25q18-13 36 0-18 13-36 0z" />
        <circle cx="32" cy="25" r="5.5" />
        <circle cx="32" cy="25" r="2" {...DOT} />
        <path d="M23 47h18M37 43l4 4-4 4" />
        <path d="M41 55H23M27 51l-4 4 4 4" />
      </g>
    </>
  ),
  // Shield with a check — bunker / defend.
  BUNKER: (
    <>
      <path {...SOFT} d="M32 9 50 17v14c0 12-8 18-18 23-10-5-18-11-18-23V17z" />
      <g {...G}>
        <path d="M32 9 50 17v14c0 12-8 18-18 23-10-5-18-11-18-23V17z" />
        <path d="M24 32l6 6 11-13" />
      </g>
    </>
  ),
  // A coin flying from a wallet — pickpocket / steal.
  PICKPOCKET: (
    <>
      <path {...SOFT} d="M13 31h28v20a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2z" />
      <g {...G}>
        <rect x="13" y="31" width="28" height="22" rx="3" />
        <path d="M34 38h7v8h-7a4 4 0 0 1 0-8z" />
        <circle cx="38" cy="42" r="1.6" {...DOT} />
        <circle cx="48" cy="17" r="6" />
        <path d="M48 14v6M45.6 17h4.8" strokeWidth={2} />
        <path d="M40 23l4-3M42 27l5-2" opacity={0.5} />
      </g>
    </>
  ),
  // Stacked waves — flood.
  FLOOD: (
    <g {...G}>
      <path d="M10 25q6-6 12 0t12 0 12 0 8-2" />
      <path d="M10 35q6-6 12 0t12 0 12 0 8-2" />
      <path d="M10 45q6-6 12 0t12 0 12 0 8-2" />
    </g>
  ),
  // Clock under a warping arrow — time warp.
  TIME_WARP: (
    <>
      <circle cx="32" cy="36" r="14" {...SOFT} />
      <g {...G}>
        <circle cx="32" cy="36" r="14" />
        <path d="M32 36V27M32 36l7 4" />
        <path d="M19 16a18 18 0 0 1 27-1" />
        <path d="M46 15l-1-6M46 15l6-1" />
      </g>
    </>
  ),
  // Padlock — lockdown.
  LOCKDOWN: (
    <>
      <rect x="16" y="30" width="32" height="24" rx="4" {...SOFT} />
      <g {...G}>
        <rect x="16" y="30" width="32" height="24" rx="4" />
        <path d="M22 30v-6a10 10 0 0 1 20 0v6" />
        <circle cx="32" cy="40" r="3" {...DOT} />
        <path d="M32 43v5" />
      </g>
    </>
  ),

  // ---------------- GANG (elemental) ----------------
  GANG_FIRE: (
    <>
      <path {...SOFT} d="M32 8c8 10 14 14 14 26a14 14 0 0 1-28 0C18 24 26 22 26 14c4 4 6 6 6-6z" />
      <g {...G}>
        <path d="M32 8c8 10 14 14 14 26a14 14 0 0 1-28 0C18 24 26 22 26 14c4 4 6 6 6-6z" />
        <path d="M32 31c4 4 5 8 0 13-5-5-4-9 0-13z" />
      </g>
    </>
  ),
  GANG_ICE: (
    <>
      <path {...SOFT} d="M32 7 47 20 41 49H23L17 20z" />
      <g {...G}>
        <path d="M32 7 47 20 41 49H23L17 20z" />
        <path d="M17 20h30M32 7v42M23 49l9-19 9 19M17 20l15 10 15-10" opacity={0.75} />
      </g>
    </>
  ),
  GANG_STORM: (
    <>
      <path {...SOFT} d="M35 6 18 36h12l-4 22 20-32H33z" />
      <path {...G} d="M35 6 18 36h12l-4 22 20-32H33z" />
    </>
  ),
  GANG_EARTH: (
    <>
      <path {...SOFT} d="M32 35c-9 0-15-7-15-16 11 0 15 7 15 16z" />
      <path {...SOFT} d="M32 31c8 0 14-6 14-15-10 0-14 6-14 15z" />
      <g {...G}>
        <path d="M32 55V28" />
        <path d="M32 35c-9 0-15-7-15-16 11 0 15 7 15 16z" />
        <path d="M32 31c8 0 14-6 14-15-10 0-14 6-14 15z" />
        <path d="M26 55h12" />
      </g>
    </>
  ),
  GANG_SHADOW: (
    <>
      <path {...SOFT} d="M40 11a18 18 0 1 0 6 32 14 14 0 0 1-6-32z" />
      <g {...G}>
        <path d="M40 11a18 18 0 1 0 6 32 14 14 0 0 1-6-32z" />
      </g>
      <path {...DOT} d="m51 15 1.4 4 4 1.4-4 1.4L51 26l-1.4-4-4-1.4 4-1.4z" />
    </>
  ),
};

/** The volcano sigil printed on every face-down card / the deck. */
export function CardBackArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" role="presentation">
      <g {...G}>
        <path d="M12 52 26 25h12l14 27z" />
        <path d="M26 25q6 6 12 0" />
        <path d="M32 21V9M23 23l-5-9M41 23l5-9" />
      </g>
      <path {...SOFT} d="M12 52 26 25h12l14 27z" />
    </svg>
  );
}

export interface CardArtProps {
  type: CardType;
  className?: string;
}

/**
 * The card's accent GLYPH (line-art), inheriting colour from `currentColor`.
 * Used for the corner pips — a small, bold mechanic icon that reads even at
 * ~16px. The big card face uses the full-colour illustration (`CardArt`).
 */
export function CardPip({ type, className }: CardArtProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" role="presentation">
      {GLYPHS[type]}
    </svg>
  );
}

// ============================================================
// CARD ART — full-colour illustrated CAT character per card.
// ============================================================
// A cohesive "sticker" cat: bold ink outline, flat fills + light shading,
// element-tinted fur and a per-card expression. Accent parts (inner ears,
// cheeks, nose) use `currentColor` so each illustration stays colour-matched
// to its card accent / border / name. Crisp at any size, no assets. The
// specific mechanic is conveyed by the corner pip (CardPip) + the name plate.
// A raster override (lib/cardTheme CARD_IMAGES) can still replace this later.
// ============================================================

const OUT = "#2A1C14"; // sticker outline (ink)

type Eyes = "normal" | "angry" | "sleepy" | "wide" | "wink" | "focused" | "x" | "spiral" | "star" | "cool";
type Mouth = "smile" | "open" | "flat" | "fang" | "omega";

interface Fur { fur: string; fur2: string; ear: string; }
const TABBY: Fur = { fur: "#FFB46B", fur2: "#EE9A45", ear: "#FFDDB4" };
const FIRE: Fur = { fur: "#FF8348", fur2: "#EA4A1C", ear: "#FFC09A" };
const ICE: Fur = { fur: "#86E6F2", fur2: "#27B7D2", ear: "#CFF6FB" };
const STORM: Fur = { fur: "#9F92FF", fur2: "#6D5CFF", ear: "#DAD3FF" };
const EARTH: Fur = { fur: "#74E0A8", fur2: "#2FCB7E", ear: "#C8F4DD" };
const SHADO: Fur = { fur: "#C79BEE", fur2: "#A968E0", ear: "#E7D4F7" };
const GOLD: Fur = { fur: "#FFD27A", fur2: "#F0A800", ear: "#FFE9BE" };

interface CatCfg extends Fur { eyes: Eyes; mouth: Mouth; }
const CATS: Record<CardType, CatCfg> = {
  LAVA_CAT:      { ...FIRE,  eyes: "angry",   mouth: "fang" },
  WATER_BUCKET:  { ...ICE,   eyes: "normal",  mouth: "smile" },
  NAP_TIME:      { ...TABBY, eyes: "sleepy",  mouth: "smile" },
  ERUPTION:      { ...FIRE,  eyes: "angry",   mouth: "open" },
  SPY_CAT:       { ...GOLD,  eyes: "wide",    mouth: "smile" },
  EARTHQUAKE:    { ...TABBY, eyes: "spiral",  mouth: "open" },
  FREEZE:        { ...ICE,   eyes: "wide",    mouth: "flat" },
  BRIBE:         { ...GOLD,  eyes: "wink",    mouth: "smile" },
  REVERSE:       { ...TABBY, eyes: "cool",    mouth: "smile" },
  SNIPER:        { ...TABBY, eyes: "focused", mouth: "flat" },
  PEEK_AND_SWAP: { ...GOLD,  eyes: "wide",    mouth: "omega" },
  BUNKER:        { ...EARTH, eyes: "normal",  mouth: "smile" },
  PICKPOCKET:    { ...TABBY, eyes: "cool",    mouth: "omega" },
  FLOOD:         { ...ICE,   eyes: "wide",    mouth: "open" },
  TIME_WARP:     { ...STORM, eyes: "spiral",  mouth: "omega" },
  LOCKDOWN:      { ...TABBY, eyes: "focused", mouth: "flat" },
  GANG_FIRE:     { ...FIRE,  eyes: "normal",  mouth: "omega" },
  GANG_ICE:      { ...ICE,   eyes: "normal",  mouth: "omega" },
  GANG_STORM:    { ...STORM, eyes: "normal",  mouth: "omega" },
  GANG_EARTH:    { ...EARTH, eyes: "normal",  mouth: "omega" },
  GANG_SHADOW:   { ...SHADO, eyes: "cool",    mouth: "omega" },
};

function star(cx: number, cy: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 4.6 : 1.9;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return <polygon points={pts.join(" ")} fill="currentColor" stroke={OUT} strokeWidth={0.8} />;
}

function renderEyes(style: Eyes) {
  const dot = (cx: number, cy: number, r = 4.8) => (
    <>
      <circle cx={cx} cy={cy} r={r} fill={OUT} />
      <circle cx={cx + 1.7} cy={cy - 1.7} r={r * 0.34} fill="#fff" />
    </>
  );
  switch (style) {
    case "angry":
      return (<>{dot(24, 33)}{dot(40, 33)}<path d="M18 27 29 30M46 27 35 30" stroke={OUT} strokeWidth={2.6} strokeLinecap="round" /></>);
    case "sleepy":
      return (<g stroke={OUT} strokeWidth={2.6} fill="none" strokeLinecap="round"><path d="M19 33q5 4 10 0M35 33q5 4 10 0" /></g>);
    case "wide":
      return (<>
        <circle cx={24} cy={33} r={6} fill="#fff" stroke={OUT} strokeWidth={2} />
        <circle cx={40} cy={33} r={6} fill="#fff" stroke={OUT} strokeWidth={2} />
        <circle cx={24.6} cy={33.6} r={2.8} fill={OUT} /><circle cx={40.6} cy={33.6} r={2.8} fill={OUT} />
      </>);
    case "wink":
      return (<>{dot(24, 33)}<path d="M35 34q5 4 10 0" stroke={OUT} strokeWidth={2.6} fill="none" strokeLinecap="round" /></>);
    case "focused":
      return (<>{dot(24, 33, 3.4)}{dot(40, 33, 3.4)}<path d="M19 29 29 30M45 29 35 30" stroke={OUT} strokeWidth={2} strokeLinecap="round" /></>);
    case "x":
      return (<g stroke={OUT} strokeWidth={2.6} strokeLinecap="round"><path d="M20 29l8 8M28 29l-8 8M36 29l8 8M44 29l-8 8" /></g>);
    case "spiral":
      return (<>
        <circle cx={24} cy={33} r={5} fill="#fff" stroke={OUT} strokeWidth={2} />
        <circle cx={40} cy={33} r={5} fill="#fff" stroke={OUT} strokeWidth={2} />
        <path d="M24 33m-3 0a3 3 0 1 0 3-3M40 33m-3 0a3 3 0 1 0 3-3" fill="none" stroke={OUT} strokeWidth={1.5} />
      </>);
    case "star":
      return (<>{star(24, 33)}{star(40, 33)}</>);
    case "cool":
      return (<>
        <rect x={16} y={29} width={32} height={8.5} rx={4.2} fill={OUT} />
        <rect x={18.5} y={30.5} width={9} height={2} rx={1} fill="#fff" opacity={0.45} />
      </>);
    default:
      return (<>{dot(24, 33)}{dot(40, 33)}</>);
  }
}

function renderMouth(style: Mouth) {
  switch (style) {
    case "open":
      return (<>
        <path d="M27 43q5 8 10 0q-5 2-10 0Z" fill="#8A3A3A" stroke={OUT} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M30 47q2 2 4 0" fill="#FF8AA0" />
      </>);
    case "flat":
      return <path d="M28 45h8" stroke={OUT} strokeWidth={2.4} strokeLinecap="round" />;
    case "fang":
      return (<>
        <path d="M26 43q6 5 12 0" stroke={OUT} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        <path d="M29 44l1.4 3.4 1.4-3.4ZM33 44l1.4 3.4 1.4-3.4Z" fill="#fff" stroke={OUT} strokeWidth={0.8} strokeLinejoin="round" />
      </>);
    case "omega":
      return <path d="M27 43q3 4 5.5 0q2.5 4 5.5 0" stroke={OUT} strokeWidth={2.4} fill="none" strokeLinecap="round" />;
    default:
      return <path d="M26 43q6 6 12 0" stroke={OUT} strokeWidth={2.4} fill="none" strokeLinecap="round" />;
  }
}

/**
 * The card's full-colour illustrated cat. The Card primitive sets
 * `color: accent` on the wrapper, which currentColor (ears/cheeks/nose) picks
 * up so every cat is colour-matched to its card.
 */
export function CardArt({ type, className }: CardArtProps) {
  const c = CATS[type];
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" role="presentation">
      {/* ears */}
      <path d="M14 26 18 8 31 21Z" fill={c.fur} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
      <path d="M50 26 46 8 33 21Z" fill={c.fur} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
      <path d="M18.5 22 20 12 26.5 19Z" fill="currentColor" opacity={0.85} />
      <path d="M45.5 22 44 12 37.5 19Z" fill="currentColor" opacity={0.85} />
      {/* head */}
      <ellipse cx={32} cy={36} rx={21} ry={19} fill={c.fur} stroke={OUT} strokeWidth={2} />
      <ellipse cx={26} cy={27} rx={9} ry={6} fill="#fff" opacity={0.16} />
      {/* forehead tabby stripes */}
      <path d="M27 22q1 4 0 7M32 21v8M37 22q-1 4 0 7" stroke={c.fur2} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.65} />
      {/* muzzle */}
      <ellipse cx={32} cy={43} rx={13} ry={9.5} fill={c.ear} opacity={0.55} />
      {/* cheeks (accent) */}
      <ellipse cx={18.5} cy={41} rx={4} ry={2.6} fill="currentColor" opacity={0.45} />
      <ellipse cx={45.5} cy={41} rx={4} ry={2.6} fill="currentColor" opacity={0.45} />
      {/* whiskers */}
      <g stroke={OUT} strokeWidth={1.3} strokeLinecap="round" opacity={0.65}>
        <path d="M11 38h10M11 42h10M53 38H43M53 42H43" />
      </g>
      {renderEyes(c.eyes)}
      {/* nose (accent) */}
      <path d="M30 38h4l-2 3Z" fill="currentColor" stroke={OUT} strokeWidth={0.7} strokeLinejoin="round" />
      {renderMouth(c.mouth)}
    </svg>
  );
}

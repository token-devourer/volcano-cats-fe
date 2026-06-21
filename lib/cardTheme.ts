import { CardType, CARD_SPECS } from "@/lib/shared";

// ============================================================
// CARD THEME — visual identity for each playing card
// ============================================================
// Pure PRESENTATION. This file decides how a card *looks* (gradient,
// accent color, glow, emoji, optional custom image). It does NOT define
// mechanics (that's the engine, via the shared catalog) and it does NOT
// define text — names/descriptions/flavor live in the i18n table
// (`lib/i18n`), keyed by each card's `i18nKey`.
//
// The theme is DERIVED from the shared catalog so it cannot drift:
//   • emoji            ← CARD_SPECS[type].emoji  (single source of truth)
//   • gradient / color ← assigned by role + family from the sanctioned
//                         palette below (no off-system hues — see DESIGN.md)
//
// CARA GANTI GAMBAR KARTU (custom art):
//   1. Taruh file di /public/cards/ (mis. /public/cards/lava-cat.png)
//   2. Tambahkan entri di CARD_IMAGES di bawah, mis. LAVA_CAT: "/cards/lava-cat.png"
//   3. Kosongkan / hapus entri untuk fallback ke emoji + gradient.
//   Rasio potret ~3:4 (mis. 300x400), PNG/WebP, akan di-crop object-cover.
// ============================================================

/** The sanctioned palette (mirror of DESIGN.md / tailwind tokens). */
const PALETTE = {
  lava:       "#D63A0B",
  lavaDim:    "#B02E08",
  ember:      "#D0332A",
  gold:       "#E6A317",
  goldDim:    "#B07A0E",
  ink:        "#2A1A10",
  inkSoft:    "#7A5A40",
  cardBase:   "#FBE8CF", // cream card face base
  gangFire:   "#D63A0B",
  gangIce:    "#2BB7C4",
  gangStorm:  "#7A3FC4",
  gangEarth:  "#2E8B3A",
  gangShadow: "#7A5BE0",
} as const;

export interface CardTheme {
  /** CSS gradient for the card face background. */
  gradient: string;
  /** The card's accent color (border tint, name text on the face). */
  color: string;
  /** rgba glow used for the selected/active state. */
  glow: string;
  /** Emoji identifier, pulled from the shared catalog. */
  emoji: string;
  /** Optional custom art (path under /public). Falls back to emoji when absent. */
  image?: string;
}

/** Build a 145deg face gradient from an accent over the cream card base. */
function faceGradient(accent: string): string {
  return `linear-gradient(145deg, ${accent} 0%, ${PALETTE.cardBase} 100%)`;
}

/** rgba glow string at the given alpha for an accent hex. */
function glowFor(hex: string, alpha = 0.7): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Accent color per card type, drawn ONLY from the sanctioned palette and
 * assigned by role / family:
 *   • danger      → lava / ember (heat = threat)
 *   • gang        → its own elemental color
 *   • classic/new → gold or ash-light family (calm, non-heat) so danger and
 *                   gang moments stay the loudest things on the table.
 *
 * Cold effects (Freeze, Flood) use gang-ice; Time Warp uses gang-storm —
 * per DESIGN.md's "no off-system blue/purple" rule.
 */
const ACCENTS: Record<CardType, string> = {
  // --- DANGER ---
  LAVA_CAT:     PALETTE.lava,   // the threat — hottest color
  WATER_BUCKET: PALETTE.gangIce, // its antidote is water/cold

  // --- CLASSIC ACTIONS ---
  NAP_TIME:   PALETTE.inkSoft, // calm / passive
  ERUPTION:   PALETTE.lavaDim,  // aggressive heat (but not pure lava)
  SPY_CAT:    PALETTE.gold,     // information / reward feel
  EARTHQUAKE: PALETTE.goldDim,  // disruptive but neutral
  FREEZE:     PALETTE.gangIce,  // THE cold/counter accent
  BRIBE:      PALETTE.gold,     // a gift / favor

  // --- NEW MECHANICS ---
  REVERSE:    PALETTE.inkSoft,
  SNIPER:     PALETTE.ember,    // targeted danger
  PEEK_AND_SWAP: PALETTE.gold,  // peek = information
  BUNKER:     PALETTE.gangEarth, // defense / safety (success-green family)
  PICKPOCKET: PALETTE.goldDim,  // theft of value
  FLOOD:      PALETTE.gangIce,  // water / cold
  TIME_WARP:  PALETTE.gangStorm, // THE warp accent
  LOCKDOWN:   PALETTE.inkSoft,

  // --- GANG (elemental) ---
  GANG_FIRE:   PALETTE.gangFire,
  GANG_ICE:    PALETTE.gangIce,
  GANG_STORM:  PALETTE.gangStorm,
  GANG_EARTH:  PALETTE.gangEarth,
  GANG_SHADOW: PALETTE.gangShadow,
};

/**
 * Optional custom art overrides. Add a path here once art exists in
 * /public/cards. Absent / undefined ⇒ emoji + gradient fallback.
 */
const CARD_IMAGES: Partial<Record<CardType, string>> = {
  // LAVA_CAT: "/cards/lava-cat.png",
};

/**
 * Resolve the full visual theme for a card type. Emoji always comes from
 * the shared catalog so it can never disagree with the engine.
 */
export function getCardTheme(type: CardType): CardTheme {
  const accent = ACCENTS[type] ?? PALETTE.inkSoft;
  const spec = CARD_SPECS[type];
  return {
    gradient: faceGradient(accent),
    color: accent,
    glow: glowFor(accent),
    emoji: spec?.emoji ?? "❔",
    image: CARD_IMAGES[type],
  };
}

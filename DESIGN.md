# Design

Visual system for **Volcano Cats**. A warm, cheerful "wooden table" game UI — bright cream
cards on a wood-plank table, vivid saturated accents, friendly and fun. This is the **ceria**
(warm/cheerful) identity, deliberately reversing the earlier cold obsidian direction on the
owner's instruction: the volcano/lava/cats identity is kept (lava red stays), only the cold
funereal surfaces change to warm wood + cream. See `PRODUCT.md` for strategy.

## Theme

Light-mode table. The player is at a sunlit wooden table with a warm pool of light at the
center: a wood-plank surface (mid-brown `wood` deepening to `wood-deep` at the edges), cream
printed cards and panels on top, molten orange as the energy color, gold as reward/secondary
(on dark plaques), ember red as danger/death. The look is a bright party game on a table —
cream cards pop against warm wood, cats are vivid and saturated. Light INK text reads on cream;
CREAM text reads on wood and inside solid dark accents (lava/ember/gang).

## Colors

Hex is canonical. Roles, not raw values, drive usage. Accent values are AA-tuned so dark INK
reads on cream AND light CREAM reads on the accent.

### Warm wood surfaces (the table)
- `wood`        `#8A5A2E` — table base plank
- `wood-deep`   `#5E3A1C` — vignette / grain shadow / dark plaque (room-code sign)
- `wood-glow`   `#A9712F` — warm light pool at table center

### Cream panels / cards
- `panel`       `#FFF6E9` — cream panel/surface (cards, modals, inputs container)
- `panel-2`     `#FBEAD2` — raised/inset cream (input fills, hovers, sub-panels)
- `panel-line`  `#E3C7A0` — soft brown hairline border (1px only)

### Ink (dark text on cream)
- `ink`         `#2A1A10` — primary text on cream (~15:1 AA)
- `ink-soft`    `#7A5A40` — muted/secondary on cream (~6:1 AA)
- `cream`       `#FFF7EC` — light text ON wood / dark accents only (NOT on cream panels)

### Heat accents (AA-tuned: cream-on-accent ≥ 4.5:1)
- `lava`       `#D63A0B` — primary action, "draw", danger highlight, focus ring
- `lava-dim`   `#B02E08` — pressed/gradient end
- `gold`       `#E6A317` — reward / win / room-code plaque (use on dark surfaces; for gold
  text on cream use `gold-dim`)
- `gold-dim`   `#B07A0E` — gold text on cream (~4.7:1 AA)
- `ember`      `#D0332A` — error, elimination, destructive

### Gang (elemental) colors — also the only sanctioned "extra" hues
- `gang-fire`   `#D63A0B` (= lava)   🔥
- `gang-ice`    `#2BB7C4`            🧊  — also the **Freeze / cold-effect** accent (decorative:
  bars/borders; not body text on cream)
- `gang-storm`  `#7A3FC4`            ⚡  — also the **Time Warp** accent (cream-on-it AA as solid bg)
- `gang-earth`  `#2E8B3A`            🌿  — also `success` (cream-on-it AA as solid bg)
- `gang-shadow` `#7A5BE0`            🌑  — decorative card art

**Rule:** the palette above is the whole palette. No ad-hoc Tailwind `blue-400` / `purple-400`.
Cold effects use `gang-ice`; warp uses `gang-storm`; success uses `gang-earth`. Legacy aliases
(`obsidian*`, `ash-light`, `card-border`) are re-pointed to the warm tokens so any unmigrated
usage still renders warm — but prefer the canonical names above.

### Gradients & glows (used sparingly, for heat only)
- `lava-gradient` `linear-gradient(135deg,#E8470A,#B02E08)` — primary buttons, lava moments
- `gold-gradient` `linear-gradient(135deg,#F4BE2E,#D4900E)` — win / join (text = `ink`, not cream)
- `card-gradient` `linear-gradient(145deg,#FFFDF7,#FFF1DC,#FBE8CF)` — cream card faces
- `table-wood`    `radial-gradient(ellipse at 50% 38%,#A9712F,#8A5A2E 42%,#5E3A1C 100%)` — the table
- Glows: `lava-glow`, `gold-glow` — reserved for the active turn, the deck on your turn, and
  win/danger moments. Not on idle elements. Shadows are warm brown-tinted (`rgba(60,30,10,…)`).

## Typography

Two families on a contrast axis (display vs. body) — never two similar sans.
- **Display:** `Righteous` (single weight) — logo, headings, card names, room code, turn banner.
  Used at large sizes only; letter-spacing ≥ -0.02em; `text-wrap: balance` on headings.
- **Body / UI:** `Hanken Grotesk` (400/500/600/700/800) — all running text, labels, buttons, log, tooltips.
- Scale (clamp, mobile→desktop): display hero ≤ `clamp(2.5rem,8vw,4.5rem)` (never above ~6rem);
  h2 `clamp(1.5rem,4vw,2rem)`; body `0.95–1rem`; small/meta `0.8rem` (never below 12px for
  meaningful text). Body line-length ≤ 70ch. `text-wrap: pretty` on prose (rules overlay).

## Spacing & layout

- 4px base scale (Tailwind default). Vary rhythm — generous around the table center, tight within
  card clusters. Section padding `clamp(1rem,4vw,2rem)`.
- Radii: `rounded-xl` (12px) inputs/buttons, `rounded-2xl` (16px) cards/modals, full for avatars.
- **Layout method:** flex for 1D (hand, toolbars, lists), grid for 2D (rules card grid, standings).
  The player arc is computed (radius from container size), with a stacked/compact layout below the
  `sm` breakpoint. Honor `env(safe-area-inset-bottom)` on the fixed hand.
- **Semantic z-index scale** (replaces ad-hoc 30/40/50/60):
  `table:0 · hand:10 · toast-region:20 · banner:30 · modal-backdrop:40 · modal:50 · tooltip:60`.

## Components (design-system primitives)

- **Card** — responsive size via `clamp()` (no fixed px that overflow mobile); face = emoji+gradient
  fallback or custom image with legible name overlay; states: default / selected (lava glow + lift)
  / disabled (dimmed + desaturated border, not just opacity) / face-down (lava-stripe back).
  Keyboard-activatable, `aria-label` = card name + short effect.
- **Modal / Sheet** — one dialog primitive; centered modal on desktop, bottom **Sheet** on mobile.
  Focus trap, ESC + backdrop close, `role="dialog"` + labelled title, consistent `p-6` / `gap-4`.
- **Button** — primary (lava-gradient), secondary (gold or outline), ghost; min 44px touch target;
  visible `focus-visible` ring in lava; `active:scale-95`.
- **Avatar** — circular, color hashed from the **full** username (not first char); turn ring
  (lava-glow pulse); status badges (host/you/away/locked/bunker/dead) shown as **icon + text**, laid
  out so multiple states don't collide.
- **Toast** — `role="alert"`, `aria-live="polite"` (assertive for death/error), auto-dismiss with a
  timer, type tints from the sanctioned palette, icon + text (never icon-only).

## Motion

Framer Motion (already a dep) for orchestration; Tailwind keyframes for ambient loops.
- Ease-out curves (quart/expo); no bounce/elastic except the one playful "card pop" on play.
- Reserve big motion for big events (Lava Cat draw, elimination flash, Rainbow swap, win); routine
  draws/plays get small, fast feedback. Stagger lists (hand deal, log) rather than one uniform
  reflex.
- **`prefers-reduced-motion: reduce` is mandatory for every animation** — ember particles and the
  card-play overlay included — degrading to crossfade/instant. Reveals must enhance an
  already-visible default (never gate content on a transition that won't fire on a hidden tab).
- Ember particles: ambient, low-density, behind content (`z-table`), perf-friendly, paused under
  reduced motion.

## Iconography & content

- Emoji are part of the brand voice (🌋💧🔥❄️) and double as card identifiers — but always paired
  with text for state/meaning (accessibility). Card art may be swapped per `lib/cardTheme` images;
  always provide the emoji+gradient fallback.
- All user-facing strings flow through the i18n table (Indonesian default), including card
  names/descriptions — no hardcoded copy in components.

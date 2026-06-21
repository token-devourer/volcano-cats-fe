# Design

Visual system for **Volcano Cats**. Dark, molten, high-contrast game UI. This is the refined
identity for the rewrite — it **preserves** the existing obsidian/lava/gold brand and elevates
craft (contrast, hierarchy, tokens, motion discipline, responsiveness, accessibility). See
`PRODUCT.md` for strategy.

## Theme

Dark-mode only. The player is in a dim, glowing volcanic "room": a near-black obsidian field with a
warm radial glow at the table center, molten orange as the energy color, gold as reward/secondary,
ember red as danger/death. Surfaces are deep blue-tinted charcoals (not pure gray) so the warm
accents read as heat against cool stone. The look is a lit table in a dark room — focus pooled at
the center, decoration receding into the dark.

## Colors

Hex is canonical (committed brand). Roles, not raw values, drive usage.

### Core surfaces (cool blue-charcoal stone)
- `obsidian`   `#0D0D0F` — app background / base
- `obsidian-2` `#141418` — raised surface (top bar, inactive panels)
- `obsidian-3` `#1C1C24` — cards, modals, inputs
- `card-bg`    `#1E1E2E` — playing-card face base
- `card-border``#2E2E44` — hairline borders on surfaces (1px only — never as a thick side-stripe)

### Heat accents
- `lava`       `#FF5C1A` — primary action, "draw", danger highlight, focus ring
- `lava-dim`   `#CC3D00` — pressed/secondary lava
- `gold`       `#FFB547` — secondary action, win, room code, reward
- `gold-dim`   `#CC8A1A`
- `ember`      `#C0392B` — error, elimination, destructive

### Text / ink ramp
- `cream`      `#F0EAD6` — primary text (≥ 12:1 on obsidian)
- `ash-light`  `#BDBDCC` — **muted text / secondary copy** (use this, ~7:1 on obsidian-3 — AA pass)
- `ash`        `#8A8A99` — **decorative/disabled only.** Do NOT use for body or placeholder text on
  dark surfaces (≈4.2:1, borderline). Placeholders use `ash-light` at reduced opacity.

### Gang (elemental) colors — also the only sanctioned "extra" hues
- `gang-fire`   `#FF5C1A` (= lava)   🔥
- `gang-ice`    `#5CE0FF`            🧊  — also the **Freeze / cold-effect** accent (replaces the
  off-system blue currently in FreezeButton/FloodModal)
- `gang-storm`  `#B05CFF`            ⚡  — also the **Time Warp** accent (replaces off-system purple)
- `gang-earth`  `#5CFF8A`            🌿  — also `success`
- `gang-shadow` `#8A5CFF`            🌑

**Rule:** the palette above is the whole palette. No ad-hoc Tailwind `blue-400` / `purple-400`.
Cold effects use `gang-ice`; warp uses `gang-storm`; success uses `gang-earth`.

### Gradients & glows (used sparingly, for heat only)
- `lava-gradient` `linear-gradient(135deg,#FF5C1A,#C0392B)` — primary buttons, lava moments
- `gold-gradient` `linear-gradient(135deg,#FFB547,#FF8C00)` — win / join
- `card-gradient` `linear-gradient(145deg,#1E1E2E,#14141C)` — card faces
- `table-felt`    `radial-gradient(ellipse at center,#1A1A2E,#0D0D0F 70%)` — the table backdrop
- Glows: `lava-glow`, `gold-glow` — reserved for the active turn, the deck on your turn, and
  win/danger moments. Not on idle elements.

## Typography

Two families on a contrast axis (display vs. body) — never two similar sans.
- **Display:** `Righteous` (single weight) — logo, headings, card names, room code, turn banner.
  Used at large sizes only; letter-spacing ≥ -0.02em; `text-wrap: balance` on headings.
- **Body / UI:** `Inter` (400/500/600/700) — all running text, labels, buttons, log, tooltips.
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

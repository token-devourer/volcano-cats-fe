# Design

Visual system for **Volcano Cats**. A bright, alive "tropical-island volcano" game UI — bold
sticker cards on a fresh aqua→seafoam→warm-sand surface, candy-saturated accents, friendly and
fun. This is the **Tropic Pop** identity: a brand-new bright direction (supersedes the earlier
"Sunny Daylight" peach and the older warm-wood/obsidian directions) on the owner's standing
instruction ("no dark colors that make playing uncomfortable"). The volcano/lava/cats identity
is kept (hot coral-lava stays as the energy color, with a magenta **magma** reserved for the
loudest moments); the surface moves from peach to a tropical lagoon-meets-beach table. See
`PRODUCT.md` for strategy.

## Theme

Light-mode, daylight. The player is at a sunny beach table on a tropic island: an aqua→seafoam→
warm-sand gradient surface (`sky-1`→`sky-2`→`sky-3`) with a warm sand light-pool (`sun`) at the
center stage, bold sticker cards and panels on top, hot coral-lava as the energy color, magenta
magma for the biggest beats, sunshine gold as reward/secondary, ember red as danger/death. Cards
read as printed "stickers" (bold outline + soft drop shadow) and pop against the bright surface;
cats are vivid and saturated. **Dark INK text is the default everywhere** (on cream panels AND on
the bright surfaces); CREAM text is reserved for text sitting ON solid accents (lava/ember/gang
buttons & badges) — never on a bright/cream surface.

## Colors

Hex is canonical. Roles, not raw values, drive usage. Accent values are AA-tuned so dark INK
reads on cream/bright AND light CREAM reads on the solid accent.

### Bright surfaces (the sky / page / table)
- `sky-1`       `#86E5E0` — tropic aqua (gradient top)
- `sky-2`       `#C7F0D8` — seafoam (gradient mid)
- `sky-3`       `#FFE6B0` — warm sand (gradient bottom / table)
- `sun`         `#FFF7E2` — warm sand light-pool at table center
- Legacy `wood` `#FFE6B0`, `wood-deep` `#F7D38C` (deeper sand, **not** brown), `wood-glow`
  `#FFF7E2` — re-pointed so any unmigrated usage still renders bright.

### Sticker panels / cards
- `panel`       `#FFFCF6` — warm near-white panel/surface (cards, modals, inputs container)
- `panel-2`     `#FFF3DF` — raised/inset cream (input fills, hovers, sub-panels)
- `panel-line`  `#EFD9B2` — soft sandy hairline border (1px only)
- card face base `#FFF8EC` (CSS `--card-face`)

### Ink (dark text on cream / bright surfaces)
- `ink`         `#2A1C14` — primary text (~14:1 AA on cream)
- `ink-soft`    `#5C4632` — muted/secondary (~8:1 on cream, ~6:1 on bright surfaces)
- `cream`       `#FFF7EC` — light text ON solid accents only (NOT on cream/bright surfaces)

### Heat / reward accents
- `lava`       `#F5481E` — primary action, "draw", danger highlight, focus ring
- `lava-dim`   `#D8390F` — pressed / gradient end
- `magma`      `#FF3D8B` — magenta-hot; the LOUDEST moments (Lava Cat eruption, win spectacle).
  Decorative / effect colour; if ever chipped, use `ink` text on it (not cream).
- `gold`       `#FFC02E` — reward / win / plaque (solid bg with `ink` text; for gold TEXT on
  cream use `gold-dim`)
- `gold-dim`   `#946400` — gold text on cream (~4.8:1 AA)
- `ember`      `#EE3B34` — error, elimination, destructive

### Gang (elemental) colors — also the only sanctioned "extra" hues
- `gang-fire`   `#FF6A2B`            🔥
- `gang-ice`    `#22C7E0`            🧊  — also the **Freeze / cold-effect** accent (decorative:
  bars/borders; not body text on cream)
- `gang-storm`  `#6D5CFF`            ⚡  — also the **Time Warp** accent
- `gang-earth`  `#2FCB7E`            🌿  — also `success`
- `gang-shadow` `#B06BE6`            🌑  — decorative card art

**Rule:** the palette above is the whole palette. No ad-hoc Tailwind `blue-400` / `purple-400`.
Cold effects use `gang-ice`; warp uses `gang-storm`; success uses `gang-earth`; the biggest
beats use `magma`. Legacy aliases (`obsidian*`, `ash-light`, `card-border`) are re-pointed to the
bright tokens so any unmigrated usage still renders bright — but prefer the canonical names above.

### Gradients & glows
- `lava-gradient` `linear-gradient(135deg,#FF6A2B,#E23A12)` — primary buttons, lava moments
  (ends kept AA-safe so cream button text stays legible across the gradient)
- `magma-gradient` `linear-gradient(135deg,#FF5BA8,#F5481E)` — the loudest spectacle moments
- `gold-gradient` `linear-gradient(135deg,#FFD24D,#F2A100)` — win / join (text = `ink`, not cream)
- `card-gradient` sticker card faces (base `#FFF8EC`)
- `table-sky` / `table-wood` `linear|radial` aqua→seafoam→sand — the tropic beach table
- Glows: `lava-glow`, `gold-glow`, `magma-glow` — reserved for the active turn, the deck on your
  turn, and win/danger moments. Not on idle elements. Shadows are warm amber-tinted
  (`rgba(90,60,25,…)`).

## Typography

Two families on a contrast axis (display vs. body) — never two similar sans.
- **Display:** `Fredoka` (400–700; rounded, friendly, sticker-y) — logo, headings, card names,
  room code, turn banner. Used at large sizes/heavier weights; letter-spacing ≈ -0.01em;
  `text-wrap: balance` on headings. (Replaces the earlier `Righteous`, kept as fallback.)
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

**GSAP** drives orchestrated timelines + big-moment effects; **Framer Motion** handles component
mount/unmount + tooltips; Tailwind keyframes drive ambient loops. `canvas-confetti` for wins.
Helpers live in `lib/motion/` (`gsap.ts` reduced-motion-safe wrappers, `useTilt.ts` pointer 3D).
- Ease-out curves (quart/expo); no bounce/elastic except the one playful "card pop" on play.
- **3D:** cards get a pointer-driven tilt + shine that follows the cursor (`--tilt-x/-y`,
  `--shine-x` on `.vc-card`, set by `useTilt`; fine-pointer only). Card-play arcs to the discard
  with a rotateY flip. No WebGL.
- Reserve big motion for big events (Lava Cat draw → shake + flash, elimination, win → confetti);
  routine draws/plays get small, fast feedback. Stagger lists (hand deal, log). Big-moment weight
  is chosen from `EVENT_TONE` (`lib/shared/events.ts`) in `EffectsController`, fed by `state.log`.
- **`prefers-reduced-motion: reduce` is mandatory for every animation** — sparkles, tilt, confetti
  and the card-play overlay included — degrading to crossfade/instant. Reveals must enhance an
  already-visible default (never gate content on a transition that won't fire on a hidden tab).
- Ambient sunny sparkles: low-density, behind content (`z-table`), perf-friendly, paused under
  reduced motion (the `EmberParticles` component, re-skinned to sunny motes).

## Sound

Web Audio, built in `lib/sound/` — **synth recipes now, drop-in files later**. The engine
(`engine.ts`) prefers a preloaded `/public/sfx/<name>.{ogg,mp3}` and falls back to a synth recipe
(`recipes.ts`) when the file is absent, so pro SFX can be added with zero code change. State
(`store/sound.ts`: `muted`/`volume`/`music`) persists to `localStorage`; `hooks/useSound.ts`
exposes `play`. Sound is unlocked on the first user gesture (autoplay policy) and **music is off
by default**. A `SoundToggle` (icon + text) lives in the home + room header.
- SFX is independent of reduced-motion (it conveys state without motion), but the **big visual
  effects** it co-triggers are not. Event SFX are mapped `GameEvent.kind → SfxName` in
  `EffectsController`, mirroring `EVENT_TONE`. Direct UI SFX: button click, card hover/select.

## Iconography & content

- Emoji are part of the brand voice (🌋💧🔥❄️) and double as card identifiers — but always paired
  with text for state/meaning (accessibility). Card art may be swapped per `lib/cardTheme` images;
  always provide the emoji+gradient fallback.
- All user-facing strings flow through the i18n table (Indonesian default), including card
  names/descriptions — no hardcoded copy in components.

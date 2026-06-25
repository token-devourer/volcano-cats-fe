
# Volcano Cats — UI/UX + SFX/VFX Overhaul

Goal: make the table feel like a live volcanic arena — dark obsidian + molten lava palette, clear "whose turn / what just happened" readability, dramatic feedback on big moments. Keep legibility-first per PRODUCT.md.

## 1. Volcano color system (`app/globals.css` + `tailwind.config.js`)

Replace the current theme tokens with a molten palette:

- `--obsidian`: near-black basalt background `#0b0608`
- `--magma-deep`: `#1a0a0c` panel surface
- `--ember`: primary glow `#ff6b1a`
- `--lava`: hot accent `#ff2e1f`
- `--sulfur`: secondary/highlight `#ffc24a`
- `--ash`: muted text `#c9bdb5` (raised contrast to pass AA on obsidian)
- `--steam`: cool counter `#7fb8c9` for Water Bucket / safe states
- Gradients: `--grad-magma` (lava → ember → sulfur), `--grad-crust` (obsidian → magma-deep) for surfaces
- Shadows: `--glow-ember`, `--glow-lava` for active turn / danger states

Apply tokens via shadcn-style semantic mapping (`bg-background`, `text-foreground`, `bg-primary` = ember) so no component hardcodes hex.

## 2. Table layout redesign (`components/game/GameTable.tsx`, `CenterStage.tsx`, `PlayerSeat.tsx`)

Redesign as a real round "caldera" table:

```text
            ┌───────── Seat ─────────┐
   Seat                                      Seat
        ┌────────────────────────────┐
        │  DECK   ↻ turn ring  DISCARD│
        │     (center stage / log)    │
        └────────────────────────────┘
   Seat                                      Seat
            └───────── Seat (me) ─────┘
```

- Seats arranged on an elliptical orbit around the center; 2–10 player support via angular distribution.
- Active player seat: pulsing ember ring, name tag glows, subtle floating embers above avatar.
- Eliminated players: ash-gray, cracked-stone treatment, slight tilt.
- Frozen/locked players: steam-blue ice overlay with frost border.
- Center stage: deck stack (with "lava cracks" intensifying as cards remaining drops), discard pile fanned out, current turn timer ring, and inline last-action log fade.
- Own hand stays as a bottom dock; raise contrast, larger tap targets, single primary CTA per PRODUCT principle #5 (remove the duplicate Gang-play affordance).
- Mobile: collapse to vertical stack with seats in a horizontal scroller above the center stage; keep all of: turn indicator, last action, primary action, visible without scroll.

## 3. VFX layer (extend `lib/effects/` + `components/animations/`)

Dial up using existing GSAP + framer-motion + canvas-confetti, plus a new lightweight WebGL-free particle layer:

- **Ambient**: persistent low-density ember particles drifting upward across the whole table (already partially in `EmberParticles.tsx` — tune density + add heat shimmer overlay using CSS filter on center stage).
- **Draw card**: card rises from deck with motion trail; safe cards = soft sulfur shimmer, Lava Cat = screen flash red, screen shake, ember burst from card, deep rumble SFX.
- **Defuse with Water Bucket**: steam burst (steam-blue particles + cooling SFX), card cools from red to blue.
- **Elimination**: full-screen lava splash transition, seat shatters into ash, "K.O." stamp; respects `prefers-reduced-motion` → quick fade + text only.
- **Reverse / Skip / Attack**: directional swoosh arrow tracing the turn order ring.
- **Peek & Swap / Pickpocket**: spotlight beam between affected seats.
- **Flood**: blue overlay washes across the table briefly.
- **Time Warp / Lockdown / Freeze**: clock hands + ice crystals overlay reusing existing `FreezeBanner`.
- **Game over winner**: confetti recolored to ember/sulfur/lava + slow zoom on winning seat.

All effects routed through the existing `EffectStage` / `EffectsController` registry so server events stay the source of truth.

## 4. SFX layer (`lib/sound/`)

Use existing `engine.ts` + `recipes.ts` (WebAudio synth — no asset downloads needed):

- Rebuild recipes around volcano palette: deep sub-rumble (draw), crackle/sizzle (play card), hiss/steam (defuse), boom + shake (lava cat), low chime (your turn), shimmer (peek), thump + reverse swoosh (reverse), ice tinkle (freeze), big boom (elimination), triumphant chord (win).
- Add subtle ambient bed: low volcanic rumble loop (very quiet, duckable) gated behind the existing `SoundToggle`.
- Ducking + cooldowns to prevent overlap chaos; respect mute and reduced-motion (reduced-motion also reduces ambient volume).
- Wire each game event in `EffectsController` to its SFX recipe alongside the VFX.

## 5. Readability + a11y polish

- Raise ash text contrast to ≥ 4.5:1 on obsidian.
- Turn indicator: color + ring + text label ("Giliran: Andi") + `aria-live=polite`.
- All new effects gated by `prefers-reduced-motion` (crossfade fallback).
- Keyboard focus rings recolored to ember, never removed.
- Keep one primary CTA per decision point; deduplicate Gang play controls in `PlayerHand.tsx`.

## 6. Out of scope

- No backend / protocol / server changes — events emitted by the server stay unchanged; only the client's mapping from event → VFX/SFX changes.
- No new cards or rules.
- No asset downloads required; particles are CSS/Canvas, SFX are WebAudio synth.

## Technical notes

- New files: `lib/effects/volcano/*` (ember, shimmer, shake, splash helpers), `lib/sound/recipes.volcano.ts`, `components/game/TurnRing.tsx`, `components/game/CalderaTable.tsx` (replaces inner layout of `GameTable`).
- Modified: `app/globals.css`, `tailwind.config.js`, `components/game/GameTable.tsx`, `PlayerSeat.tsx`, `CenterStage.tsx`, `EffectsController.tsx`, `PlayerHand.tsx`, `components/animations/EmberParticles.tsx`, `lib/sound/recipes.ts`.
- All animations use existing GSAP / framer-motion / canvas-confetti — no new heavy deps.
- Verify with a quick Playwright pass on `/` and a room route to capture before/after screenshots and confirm no console errors.

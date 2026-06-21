# Product

## Register

product

## Users

Casual players — friend groups who already know each other and hop into a quick game together,
often while on a voice or video call. They join private rooms via a shareable room code (no
accounts, no matchmaking). They span phones and laptops, play in short bursts, and care about
*fun and momentum*, not depth or settings. Primary language is Indonesian.

The job to be done: "get my friends into a fast, chaotic, social card game in seconds, and make
every turn legible and exciting even when I'm half-watching." On any given screen the player needs
to instantly know whose turn it is, what just happened, and what they can do right now.

## Product Purpose

Volcano Cats is a real-time multiplayer card game — an Exploding Kittens–style "press your luck"
game reskinned around a volcano/lava/cats theme and extended with extra cards (Reverse, Sniper,
Peek & Swap, Bunker, Pickpocket, Flood, Time Warp, Lockdown) and five elemental "Gang" sets.
2–10 players draw from a shared deck; drawing a Lava Cat without a Water Bucket eliminates you;
last player standing wins. The design exists to make this social party game feel alive, fair, and
effortless to follow in the browser. Success = a group can start and finish a game with zero
confusion, every action reads clearly in the moment, and it works as well on a phone as a laptop.

## Brand Personality

Playful-chaotic volcanic danger. High-energy and a little menacing, but never grim — it's cats and
lava, a party game with teeth. Voice is warm, casual Indonesian with light humor (the existing copy
calls cards things like "berbahaya! 😈"). Three words: **molten, mischievous, momentous**. The
interface should evoke anticipation and delight — the thrill of "do I draw?" — and make eliminations
feel dramatic but funny, not punishing.

## Anti-references

- **Generic SaaS / dashboard UI** — flat, corporate, blue-and-gray, card-grid product chrome. This
  is a game, not a tool.
- **Childish / kiddie-app aesthetic** — primary-color bubbly toddler look that would undercut the
  dark molten menace.
- **Gambling / casino glitz** — slot-machine sparkle, coin showers, aggressive reward cues.
- **Overstimulating clutter** — so many simultaneous glows, particles, and animations that the
  actual game state becomes hard to read. Energy must never cost legibility.

## Design Principles

1. **Legibility under chaos.** Whose turn, what just happened, what I can do now — always answerable
   at a glance, even mid-animation and even on a phone. Motion serves comprehension first.
2. **The table is the story.** The shared table (players, deck, discard, turn flow) is the emotional
   center; decoration orbits it and never competes with it.
3. **Drama is earned, not constant.** Big moments (draw a Lava Cat, an elimination, a Rainbow swap)
   get the spotlight; routine turns stay calm. Reserve the loudest motion for the loudest events.
4. **Fair by construction.** Players can only see what they're entitled to see; the UI never leaks
   hidden information, and every state the server can produce has a clear, non-dead-end screen.
5. **One obvious action.** At any decision point there is a single clear primary affordance; avoid
   redundant or competing controls (today's hand has two overlapping ways to play a Gang — pick one).

## Accessibility & Inclusion

- Target **WCAG 2.1 AA**. Body text ≥ 4.5:1, large/UI text ≥ 3:1 against its surface (the current
  muted `ash` on dark obsidian is borderline and must be corrected).
- Never rely on color or emoji alone to convey state (turn, dead, locked, frozen, away): pair with
  text and shape.
- Full keyboard operability for playing cards, choosing targets, and dismissing modals; visible
  focus states; focus trapping in dialogs; `aria-live` for turn changes, the log, and toasts.
- Respect `prefers-reduced-motion` for **every** animation (ember particles and card-play
  animations included), degrading to crossfade/instant.
- Responsive from ~320px phones to desktop; honor `env(safe-area-inset-*)`.

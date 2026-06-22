# Sound effects (drop-in slot)

The game ships with **synthesized** Web Audio effects (no files needed). To
upgrade to richer, hand-picked audio, drop files here — the engine prefers a
file over the synth recipe automatically, **no code change required**.

## How it works

`lib/sound/engine.ts` `play(name)` looks for `/sfx/<name>.ogg` then
`/sfx/<name>.mp3`. If found, it plays that file; otherwise it falls back to the
synth recipe in `lib/sound/recipes.ts`. Prefer `.ogg` (smaller); add `.mp3` for
Safari if needed.

## File names (one per effect)

| file            | when it fires                                   |
|-----------------|-------------------------------------------------|
| `click.ogg`     | button press                                    |
| `hover.ogg`     | hovering a playable card                         |
| `select.ogg`    | selecting a card / gang card                     |
| `deal.ogg`      | a card dealt into a hand                         |
| `draw.ogg`      | drawing from the deck                            |
| `play.ogg`      | a card played to the discard                     |
| `gang.ogg`      | a gang combo played                             |
| `yourTurn.ogg`  | your turn begins                                 |
| `lavaAlarm.ogg` | a Lava Cat is drawn (not defused)               |
| `defuse.ogg`    | Lava Cat defused / Water Bucket save / bunker   |
| `freeze.ogg`    | Freeze / Flood (cold effects)                   |
| `steal.ogg`     | steal / pickpocket / favor                      |
| `shuffle.ogg`   | deck shuffled                                    |
| `win.ogg`       | win / victory fanfare                           |
| `lose.ogg`      | you lost (game over, not winner)                |
| `eliminate.ogg` | a player is eliminated                           |
| `error.ogg`     | an invalid action / error                       |
| `toast.ogg`     | a toast notification appears                     |

## Background music (optional)

Add `music.ogg` (or `.mp3`) to enable the looped background track. It stays
**off by default**; players turn it on from the sound control. With no file,
the music toggle is silent.

Keep effects short (< 0.6s) and normalized. Use royalty-free / CC0 sources.

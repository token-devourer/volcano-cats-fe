// Public surface for the sound engine. Import `play` anywhere to fire an SFX;
// it is a no-op when muted or before the audio context is unlocked.
export { play, unlock, armUnlock, startMusic, stopMusic } from "./engine";
export type { SfxName } from "./recipes";

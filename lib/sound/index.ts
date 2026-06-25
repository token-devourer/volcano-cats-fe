// Public surface for the sound engine. Import `play` anywhere to fire an SFX;
// it is a no-op when muted or before the audio context is unlocked.
export { play, unlock, armUnlock, isUnlocked, onFirstUnlock, startMusic, stopMusic } from "./engine";
export { setMusicTrack, stopAllMusic, currentTrack } from "./music";
export type { MusicTrack } from "./music";
export type { SfxName } from "./recipes";

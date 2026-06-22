// Sound preferences — mute / master volume / background-music toggle.
// Persisted to localStorage so the player's choice survives reloads. This is
// the single source of truth the audio engine (lib/sound/engine) reads + the
// SoundToggle control writes. None of this is game state.
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SoundState {
  /** Master mute. When true the engine plays nothing (SFX + music). */
  muted: boolean;
  /** Master volume 0..1. */
  volume: number;
  /** Background-music loop on/off. Off by default (needs a /public/sfx file). */
  music: boolean;

  toggleMute: () => void;
  setVolume: (v: number) => void;
  toggleMusic: () => void;
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      muted: false,
      volume: 0.7,
      music: false,
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      setVolume: (v) => set({ volume: Math.min(1, Math.max(0, v)) }),
      toggleMusic: () => set((s) => ({ music: !s.music })),
    }),
    {
      name: "vc_sound",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

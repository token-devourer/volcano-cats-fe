// Convenience hook: a stable `play` plus the current mute state. Components
// that only need to fire effects can import `play` from "@/lib/sound" directly;
// use this when you also want to react to the mute toggle. Arms the autoplay
// unlock on mount as a belt-and-braces (the engine also arms at module load).
"use client";
import { useCallback, useEffect } from "react";
import { play as enginePlay, armUnlock, type SfxName } from "@/lib/sound";
import { useSoundStore } from "@/store/sound";

export function useSound() {
  const muted = useSoundStore((s) => s.muted);
  useEffect(() => armUnlock(), []);
  const play = useCallback((name: SfxName) => enginePlay(name), []);
  return { play, muted };
}

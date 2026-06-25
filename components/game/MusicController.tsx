// ============================================================
// MUSIC CONTROLLER — switches between lobby/game tracks + volcanic ambience.
// ============================================================
// Mount once on a page. Pass an explicit `track` (e.g. "lobby" on the home
// screen) or omit it inside the room to auto-pick by game phase. Respects
// the user's mute + music toggle in the sound store, and only starts after
// the audio context is unlocked (first user gesture).
// ============================================================
"use client";
import { useEffect } from "react";
import { setMusicTrack, stopAllMusic, type MusicTrack } from "@/lib/sound";
import { useSoundStore } from "@/store/sound";
import { useGame } from "@/store/game";

interface Props {
  /** Force a track. When omitted, picks based on game phase. */
  track?: MusicTrack;
}

export function MusicController({ track }: Props) {
  const muted = useSoundStore((s) => s.muted);
  const music = useSoundStore((s) => s.music);
  const phase = useGame((s) => s.state?.phase?.kind ?? null);

  useEffect(() => {
    if (muted || !music) {
      stopAllMusic();
      return;
    }
    const desired: MusicTrack | null =
      track ?? (phase === null || phase === "lobby" || phase === "finished" ? "lobby" : "game");

    // Wait for the audio context to unlock (first user gesture).
    let cancelled = false;
    const tryStart = () => {
      if (cancelled) return;
      setMusicTrack(desired);
    };
    tryStart();
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart"];
    const onGesture = () => { if (!cancelled) tryStart(); };
    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    return () => {
      cancelled = true;
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };
  }, [muted, music, track, phase]);

  useEffect(() => () => stopAllMusic(), []);

  return null;
}

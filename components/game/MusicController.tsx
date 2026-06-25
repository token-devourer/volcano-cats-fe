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
import { setMusicTrack, stopAllMusic, onFirstUnlock, type MusicTrack } from "@/lib/sound";
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

    let cancelled = false;

    // Only start music once the AudioContext is actually running.
    // getAudio() returns null when suspended, so synth nodes won't be
    // scheduled on a frozen timeline (which would die before Chrome resumes).
    const tryStart = () => {
      if (cancelled) return;
      setMusicTrack(desired);
    };

    // If already unlocked, start immediately.
    tryStart();

    // Otherwise wait for the first unlock event.
    const unsub = onFirstUnlock(tryStart);
    return () => {
      cancelled = true;
      unsub();
    };
  }, [muted, music, track, phase]);

  useEffect(() => () => stopAllMusic(), []);

  return null;
}

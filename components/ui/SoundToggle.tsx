"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useSoundStore } from "@/store/sound";
import { play } from "@/lib/sound";

/**
 * Mute / unmute control (icon + text — never icon-only). Reads + writes the
 * persisted sound store; gives a click of audible feedback when turning sound
 * back on (which also serves as the autoplay unlock gesture).
 */
export function SoundToggle({ className }: { className?: string }) {
  const muted = useSoundStore((s) => s.muted);
  const toggleMute = useSoundStore((s) => s.toggleMute);
  // The persisted store can rehydrate to a non-default value on the client;
  // render the default until mounted so SSR + first client paint match.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isMuted = mounted && muted;

  return (
    <button
      type="button"
      onClick={() => {
        toggleMute();
        if (muted) play("click"); // was muted → now on: confirm with a click
      }}
      aria-pressed={isMuted}
      aria-label={isMuted ? "Nyalakan suara" : "Matikan suara"}
      className={clsx(
        "inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium",
        "text-ink transition-colors hover:bg-ink/5",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-lava",
        className,
      )}
    >
      <span aria-hidden="true">{isMuted ? "🔇" : "🔊"}</span>
      <span className="hidden sm:inline">{isMuted ? "Bisu" : "Suara"}</span>
    </button>
  );
}

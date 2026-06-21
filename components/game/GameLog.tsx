"use client";
import { useEffect, useRef } from "react";
import { useGame } from "@/store/game";
import { useUI } from "@/store/ui";
import { formatEvent } from "@/lib/i18n";
import { EVENT_TONE, type EventTone } from "@/lib/shared";
import clsx from "clsx";

const TONE_COLOR: Record<EventTone, string> = {
  info: "text-ash-light",
  action: "text-cream",
  danger: "text-ember",
  win: "text-gold",
};

/** Slide-in activity log, rendered from the structured event stream. */
export function GameLog() {
  const state = useGame((s) => s.state);
  const open = useUI((s) => s.showLog);
  const toggle = useUI((s) => s.toggleLog);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "end" });
  }, [open, state?.log.length]);

  if (!state) return null;
  const nameOf = (id: string) => state.players.find((p) => p.id === id)?.name ?? "Pemain";

  return (
    <>
      {open && (
        <button
          aria-label="Tutup log"
          className="fixed inset-0 z-modal-backdrop bg-black/40 sm:hidden"
          onClick={toggle}
        />
      )}
      <aside
        role="log"
        aria-live="polite"
        className={clsx(
          "fixed right-0 top-0 z-modal flex h-[100dvh] w-80 max-w-[85vw] flex-col border-l border-card-border bg-obsidian-2 shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-card-border px-4 py-3">
          <h2 className="font-display text-lava">📜 Log</h2>
          <button onClick={toggle} className="text-ash-light hover:text-cream" aria-label="Tutup">✕</button>
        </header>
        <div className="flex-1 space-y-1.5 overflow-y-auto px-4 py-3 text-sm [scrollbar-width:thin]">
          {state.log.map((e, i) => (
            <p key={i} className={clsx("leading-snug", TONE_COLOR[EVENT_TONE[e.kind]])}>
              {formatEvent(e, nameOf)}
            </p>
          ))}
          <div ref={endRef} />
        </div>
      </aside>
    </>
  );
}

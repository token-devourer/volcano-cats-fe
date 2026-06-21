"use client";
import { useState } from "react";
import { Button, Avatar, StatusBadge } from "@/components/ui";
import { EmberParticles } from "@/components/animations/EmberParticles";
import { useGame } from "@/store/game";
import { useUI } from "@/store/ui";
import { send } from "@/lib/net/client";
import { t } from "@/lib/i18n";

export function Lobby({ roomId }: { roomId: string }) {
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  const setRules = useUI((s) => s.setRules);
  const [copied, setCopied] = useState(false);
  if (!state) return null;

  const me = state.players.find((p) => p.id === myId);
  const isHost = me?.isHost ?? false;
  const canStart = isHost && state.players.length >= 2;

  function copy() {
    navigator.clipboard?.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-10">
      <EmberParticles count={14} />
      <div className="relative z-banner flex w-full max-w-md flex-col gap-6">
        <header className="text-center">
          <h1 className="font-display text-3xl text-cream drop-shadow-[0_2px_8px_rgba(214,58,11,0.4)]">🌋 {t("lobby.title")}</h1>
        </header>

        {/* Room code — the hero: an engraved wooden sign, gold on dark wood. */}
        <section
          className="rounded-2xl border-2 border-panel-line bg-wood-deep p-6 text-center shadow-[0_10px_30px_rgba(40,20,10,0.5),inset_0_0_0_1px_rgba(227,199,160,0.25)]"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-cream/70">{t("lobby.roomCode")}</p>
          <p className="my-3 break-all font-display text-5xl tracking-[0.25em] text-gold drop-shadow-[0_2px_6px_rgba(230,163,23,0.45)]">
            {roomId}
          </p>
          <p className="mb-4 text-xs text-cream/70">{t("lobby.shareHint")}</p>
          <Button variant="ghost" size="sm" onClick={copy}>
            📋 {copied ? t("action.copied") : t("action.copy")}
          </Button>
        </section>

        {/* Players */}
        <section className="rounded-2xl border border-panel-line bg-panel p-5 shadow-panel">
          <p className="mb-3 text-xs uppercase tracking-widest text-ink-soft">
            {t("lobby.players")} · {state.players.length}/10
          </p>
          <ul className="space-y-2">
            {state.players.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <Avatar name={p.name} size="sm" />
                <span className="flex-1 truncate text-ink">{p.name}</span>
                {p.isHost && <StatusBadge variant="host" label={t("status.host")} />}
                {p.id === myId && <StatusBadge variant="you" label={t("status.you")} />}
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" fullWidth disabled={!canStart} onClick={() => send({ t: "START_GAME" })}>
            🚀 {t("lobby.start")}
          </Button>
          {!canStart && (
            <p className="text-center text-xs text-cream/80">
              {isHost ? t("lobby.needMorePlayers") : t("lobby.hostOnly")}
            </p>
          )}
          <Button variant="ghost" size="md" fullWidth onClick={() => setRules(true)}>
            📖 Aturan Main
          </Button>
        </div>
      </div>
    </main>
  );
}

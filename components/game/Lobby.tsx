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
          <h1 className="font-display text-3xl text-lava">🌋 {t("lobby.title")}</h1>
        </header>

        {/* Room code */}
        <section className="rounded-2xl border border-card-border bg-obsidian-3 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-ash-light">{t("lobby.roomCode")}</p>
          <p className="my-2 break-all font-display text-2xl tracking-[0.15em] text-gold">{roomId}</p>
          <p className="mb-3 text-xs text-ash-light">{t("lobby.shareHint")}</p>
          <Button variant="outline" size="sm" onClick={copy}>
            📋 {copied ? t("action.copied") : t("action.copy")}
          </Button>
        </section>

        {/* Players */}
        <section className="rounded-2xl border border-card-border bg-obsidian-3 p-5">
          <p className="mb-3 text-xs uppercase tracking-widest text-ash-light">
            {t("lobby.players")} · {state.players.length}/10
          </p>
          <ul className="space-y-2">
            {state.players.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <Avatar name={p.name} size="sm" />
                <span className="flex-1 truncate text-cream">{p.name}</span>
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
            <p className="text-center text-xs text-ash-light">
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

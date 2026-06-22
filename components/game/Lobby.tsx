"use client";
import { useState } from "react";
import { Button, Avatar, StatusBadge } from "@/components/ui";
import { CardArt } from "@/components/ui/CardArt";
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
        <header className="flex flex-col items-center gap-2 text-center">
          <div
            className="grid h-16 w-16 animate-float place-items-center rounded-full border border-panel-line bg-panel shadow-panel"
            style={{ color: "#F5481E" }}
            aria-hidden="true"
          >
            <CardArt type="GANG_FIRE" className="h-11 w-11" />
          </div>
          <h1 className="font-display text-3xl text-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]">{t("lobby.title")}</h1>
        </header>

        {/* Room code — the hero: a sunny gold plaque, dark ink on bright gold. */}
        <section
          className="rounded-2xl border border-gold/50 bg-gold-gradient p-6 text-center shadow-gold-glow"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/70">{t("lobby.roomCode")}</p>
          <p className="my-3 break-all font-display text-5xl tracking-[0.25em] text-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
            {roomId}
          </p>
          <p className="mb-4 text-xs text-ink/70">{t("lobby.shareHint")}</p>
          <Button key={copied ? "c" : "u"} variant={copied ? "secondary" : "outline"} size="sm" onClick={copy} className={copied ? "animate-slide-up" : ""}>
            {copied ? `✅ ${t("action.copied")}` : `📋 ${t("action.copy")}`}
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
          {state.players.length < 2 && (
            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-ink-soft">
              <span className="h-2 w-2 animate-glow-pulse rounded-full bg-gang-earth" aria-hidden="true" />
              {t("lobby.waiting")}
            </p>
          )}
        </section>

        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" fullWidth disabled={!canStart} onClick={() => send({ t: "START_GAME" })}>
            🚀 {t("lobby.start")}
          </Button>
          {!canStart && (
            <p className="text-center text-xs text-ink-soft">
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

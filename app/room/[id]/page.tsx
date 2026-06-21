"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import clsx from "clsx";
import { Button, Spinner, ToastRegion } from "@/components/ui";
import { EmberParticles } from "@/components/animations/EmberParticles";
import { Lobby } from "@/components/game/Lobby";
import { GameTable } from "@/components/game/GameTable";
import { PlayerHand } from "@/components/game/PlayerHand";
import { PhaseController } from "@/components/game/PhaseController";
import { CardPlayAnimation } from "@/components/game/CardPlayAnimation";
import { GameLog } from "@/components/game/GameLog";
import { GameOver } from "@/components/game/GameOver";
import RulesOverlay from "@/components/game/RulesOverlay";
import { useRoom } from "@/hooks/useRoom";
import { useConnection } from "@/store/connection";
import { useGame } from "@/store/game";
import { useUI } from "@/store/ui";
import { leave as netLeave, send } from "@/lib/net/client";
import { t } from "@/lib/i18n";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const urlRoomId = params.id as string;
  const isCreating = urlRoomId === "_new";

  const [username, setUsername] = useState<string | null>(null);
  const [needsName, setNeedsName] = useState(false);
  const [resolved, setResolved] = useState(false); // has the localStorage check run?
  useEffect(() => {
    let name = "";
    try {
      name = localStorage.getItem("vc_username") ?? "";
    } catch {
      /* ignore */
    }
    if (name) setUsername(name);
    // A visitor opening a shared link has no saved name. Don't bounce them to
    // the home screen (which loses the room code) — let them name themselves
    // and join this room right here.
    else if (!isCreating) setNeedsName(true);
    else router.replace("/");
    setResolved(true);
  }, [router, isCreating]);

  function submitName(raw: string) {
    const name = raw.trim();
    if (!name) return;
    try {
      localStorage.setItem("vc_username", name);
    } catch {
      /* ignore */
    }
    setUsername(name);
    setNeedsName(false);
  }

  useRoom({ roomId: isCreating ? undefined : urlRoomId, username: username ?? "", enabled: !!username });

  const status = useConnection((s) => s.status);
  const state = useGame((s) => s.state);
  const myId = useGame((s) => s.myId);
  const toasts = useUI((s) => s.toasts);
  const dismissToast = useUI((s) => s.dismissToast);
  const toggleLog = useUI((s) => s.toggleLog);
  const setRules = useUI((s) => s.setRules);

  // Fix the URL once a created room reports its real id (no React remount).
  useEffect(() => {
    if (isCreating && state?.roomId) {
      window.history.replaceState(null, "", `/room/${state.roomId}`);
    }
  }, [isCreating, state?.roomId]);

  const displayRoomId = state?.roomId ?? (isCreating ? "…" : urlRoomId);

  function leaveToMenu() {
    netLeave();
    useGame.getState().reset();
    useUI.getState().reset();
    useConnection.getState().reset();
    router.push("/");
  }

  const globals = (
    <>
      <ToastRegion toasts={toasts} onDismiss={dismissToast} />
      <RulesOverlay />
    </>
  );

  // ---- resolving identity (localStorage read pending) — avoids a misleading
  //      "connecting" flash before we know whether a name is needed ----
  if (!resolved) {
    return (
      <Centered>
        <Spinner size="lg" label={t("game.loading")} />
        {globals}
      </Centered>
    );
  }

  // ---- name gate (shared-link visitor with no saved name) ----
  if (needsName) {
    return (
      <Centered>
        <EmberParticles count={16} />
        <NameGate roomId={urlRoomId} onSubmit={submitName} />
        {globals}
      </Centered>
    );
  }

  // ---- connection gates ----
  if (!username || status === "idle" || status === "connecting") {
    return (
      <Centered>
        <Spinner size="lg" label={t("conn.connecting")} />
        <p className="mt-4 text-cream/80">{t("conn.connecting")}</p>
        {globals}
      </Centered>
    );
  }
  if (status === "error" || (status === "disconnected" && !state)) {
    return (
      <Centered>
        <div className="rounded-2xl border border-ember/40 bg-panel p-6">
          <div className="text-6xl" aria-hidden="true">📡</div>
          <h2 className="mt-3 font-display text-2xl text-ember">{t("conn.disconnected")}</h2>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">{t("conn.lost")}</p>
          <Button variant="primary" size="lg" className="mt-6" onClick={leaveToMenu}>
            {t("action.back")}
          </Button>
        </div>
        {globals}
      </Centered>
    );
  }
  if (!state || !myId) {
    return (
      <Centered>
        <Spinner size="lg" label={t("game.loading")} />
        {globals}
      </Centered>
    );
  }

  // ---- lobby ----
  if (state.status === "lobby") {
    return (
      <>
        <Lobby roomId={displayRoomId} />
        {globals}
      </>
    );
  }

  // ---- finished ----
  if (state.status === "finished") {
    return (
      <>
        <GameOver onLeave={leaveToMenu} />
        {globals}
      </>
    );
  }

  // ---- playing ----
  const me = state.players.find((p) => p.id === myId);
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-table-wood">
      <EmberParticles count={8} />

      {/* Top bar */}
      <header className="relative z-banner flex items-center justify-between px-4 py-3">
        <span className="font-display text-sm text-cream/90">🌋 {displayRoomId}</span>
        <div className="flex items-center gap-2">
          {me?.alive && (
            <Button
              variant={me.away ? "secondary" : "ghost"}
              size="sm"
              onClick={() => send({ t: "TOGGLE_AWAY", away: !me.away })}
            >
              {me.away ? `😴 ${t("status.away")}` : `💤 ${t("status.away")}`}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setRules(true)}>📖</Button>
          <Button variant="ghost" size="sm" onClick={toggleLog}>📜</Button>
        </div>
      </header>

      <GameTable />
      <CardPlayAnimation />

      {me?.alive ? (
        <PlayerHand />
      ) : (
        <div
          className="fixed inset-x-0 bottom-0 z-hand border-t border-ember/30 bg-panel p-5 text-center"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <p className="font-display text-ember">💀 Kamu tereliminasi. Tonton sampai selesai!</p>
        </div>
      )}

      <PhaseController />
      <GameLog />
      {globals}
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className={clsx("relative grid min-h-[100dvh] place-items-center overflow-hidden bg-wood-deep px-4 text-center")}>
      <div className="flex flex-col items-center">{children}</div>
    </main>
  );
}

/**
 * Name-entry gate for people arriving via a shared room link. Keeps the room
 * code in view and joins this exact room the moment they pick a name — no trip
 * back to the home screen, no lost code.
 */
function NameGate({ roomId, onSubmit }: { roomId: string; onSubmit: (n: string) => void }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  function go() {
    if (!name.trim()) return setErr(t("lobby.enterName"));
    onSubmit(name);
  }

  const inputClass =
    "w-full rounded-xl border border-panel-line bg-panel-2 px-4 py-3 text-ink " +
    "placeholder:text-ink-soft/60 transition-all duration-200 focus:outline-none " +
    "focus:border-lava focus:shadow-[0_0_0_3px_rgba(214,58,11,0.18)]";

  return (
    <div className="relative z-banner w-full max-w-sm">
      <header className="mb-6 select-none">
        <div className="mb-2 text-6xl" aria-hidden="true">🌋</div>
        <h1 className="font-display text-2xl text-cream drop-shadow-[0_2px_8px_rgba(214,58,11,0.4)]">
          {t("invite.title")}
        </h1>
        <p className="mt-2 text-sm text-cream/80">{t("invite.subtitle")}</p>
        <p className="mt-1 font-display text-xl tracking-[0.25em] text-gold drop-shadow-[0_2px_6px_rgba(230,163,23,0.4)]">{roomId}</p>
      </header>

      <section className="rounded-2xl border border-panel-line bg-panel p-6">
        <label htmlFor="join-name" className="mb-2 block text-left text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {t("lobby.enterName")}
        </label>
        <input
          id="join-name"
          autoFocus
          value={name}
          maxLength={20}
          placeholder="Nama panggilanmu…"
          onChange={(e) => {
            setName(e.target.value);
            setErr("");
          }}
          onKeyDown={(e) => e.key === "Enter" && go()}
          className={`${inputClass} mb-4`}
        />
        {err && (
          <p className="mb-3 text-center text-sm text-ember" role="alert">
            ⚠️ {err}
          </p>
        )}
        <Button variant="primary" size="lg" fullWidth onClick={go}>
          {t("invite.cta")}
        </Button>
      </section>
    </div>
  );
}

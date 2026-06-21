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
  useEffect(() => {
    let name = "";
    try {
      name = localStorage.getItem("vc_username") ?? "";
    } catch {
      /* ignore */
    }
    if (!name) router.replace("/");
    else setUsername(name);
  }, [router]);

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

  // ---- connection gates ----
  if (!username || status === "idle" || status === "connecting") {
    return (
      <Centered>
        <Spinner size="lg" label={t("conn.connecting")} />
        <p className="mt-4 text-ash-light">{t("conn.connecting")}</p>
        {globals}
      </Centered>
    );
  }
  if (status === "error" || (status === "disconnected" && !state)) {
    return (
      <Centered>
        <div className="text-6xl" aria-hidden="true">📡</div>
        <h2 className="mt-3 font-display text-2xl text-ember">{t("conn.disconnected")}</h2>
        <p className="mt-2 max-w-xs text-sm text-ash-light">{t("conn.lost")}</p>
        <Button variant="primary" size="lg" className="mt-6" onClick={leaveToMenu}>
          {t("action.back")}
        </Button>
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
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-table-felt">
      <EmberParticles count={8} />

      {/* Top bar */}
      <header className="relative z-banner flex items-center justify-between px-4 py-3">
        <span className="font-display text-sm text-lava">🌋 {displayRoomId}</span>
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
          className="fixed inset-x-0 bottom-0 z-hand border-t border-ember/30 bg-obsidian-2 p-5 text-center"
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
    <main className={clsx("relative grid min-h-[100dvh] place-items-center bg-obsidian px-4 text-center")}>
      <div className="flex flex-col items-center">{children}</div>
    </main>
  );
}

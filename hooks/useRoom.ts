// ============================================================
// useRoom — connect to a room and route server messages into stores
// ============================================================
// The single integration point between the net client and the Zustand
// stores. Connects once (the net client is a singleton that survives
// remounts), translates each ServerMessage into store updates, and
// derives death/win toasts from state transitions.
// ============================================================
"use client";
import { useEffect, useRef } from "react";
import { connect, send as netSend, leave, type NetStatus } from "@/lib/net/client";
import type { ServerMessage, ClientGameState } from "@/lib/shared";
import { useConnection } from "@/store/connection";
import { useGame } from "@/store/game";
import { useUI } from "@/store/ui";
import { formatEvent, t } from "@/lib/i18n";

function diffToToasts(prev: ClientGameState | null, next: ClientGameState) {
  const nameOf = (id: string) => next.players.find((p) => p.id === id)?.name ?? "Pemain";
  const ui = useUI.getState();

  if (prev) {
    for (const np of next.players) {
      const pp = prev.players.find((p) => p.id === np.id);
      if (pp?.alive && !np.alive) {
        ui.pushToast("danger", formatEvent({ kind: "ELIMINATED", playerId: np.id }, nameOf), "💀");
      }
    }
  }
  if (!prev?.winnerId && next.winnerId) {
    ui.pushToast("success", formatEvent({ kind: "WIN", playerId: next.winnerId }, nameOf), "🏆");
  }
}

function handleMessage(msg: ServerMessage) {
  const game = useGame.getState();
  switch (msg.t) {
    case "WELCOME":
      game.setMyId(msg.playerId);
      break;
    case "STATE":
      diffToToasts(game.state, msg.state);
      game.setState(msg.state);
      useConnection.getState().setRoomId(msg.state.roomId);
      break;
    case "HAND":
      game.setHand(msg.cards);
      break;
    case "PEEK":
      useUI.getState().openPeek(msg.mode, msg.cards);
      break;
    case "ERROR":
      useConnection.getState().setError(msg.code);
      useUI.getState().pushToast("danger", t(`error.${msg.code}`), "⚠️");
      break;
  }
}

export function useRoom(opts: { roomId?: string; username: string; enabled: boolean }) {
  const started = useRef(false);

  useEffect(() => {
    if (!opts.enabled || !opts.username || started.current) return;
    started.current = true;

    connect({
      roomId: opts.roomId,
      username: opts.username,
      onMessage: handleMessage,
      onStatus: (status: NetStatus) => useConnection.getState().setStatus(status),
    })
      .then((room) => useConnection.getState().setRoomId(room.roomId))
      .catch(() => useConnection.getState().setStatus("error"));
  }, [opts.enabled, opts.username, opts.roomId]);

  return { send: netSend, leave };
}

// Game state mirror — the authoritative ClientGameState from the server,
// plus the viewer's own private hand and id. Read-only from the UI's view;
// only the net layer writes here.
"use client";
import { create } from "zustand";
import type { Card, ClientGameState, ClientPlayer, Phase } from "@/lib/shared";

interface GameStore {
  myId: string | null;
  state: ClientGameState | null;
  hand: Card[];

  setMyId: (id: string) => void;
  setState: (state: ClientGameState) => void;
  setHand: (hand: Card[]) => void;
  reset: () => void;

  // ---- derived selectors ----
  me: () => ClientPlayer | null;
  currentId: () => string | null;
  isMyTurn: () => boolean;
  phase: () => Phase | null;
  playerName: (id: string) => string;
}

export const useGame = create<GameStore>((set, get) => ({
  myId: null,
  state: null,
  hand: [],

  setMyId: (myId) => set({ myId }),
  setState: (state) => set({ state }),
  setHand: (hand) => set({ hand }),
  reset: () => set({ state: null, hand: [] }),

  me: () => {
    const { state, myId } = get();
    return state?.players.find((p) => p.id === myId) ?? null;
  },
  currentId: () => {
    const s = get().state;
    return s ? s.turnOrder[s.currentTurnIndex] ?? null : null;
  },
  isMyTurn: () => {
    const { state, myId } = get();
    if (!state) return false;
    return state.turnOrder[state.currentTurnIndex] === myId;
  },
  phase: () => get().state?.phase ?? null,
  playerName: (id) => get().state?.players.find((p) => p.id === id)?.name ?? "Pemain",
}));

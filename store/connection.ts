// Connection state — the WebSocket lifecycle, separate from game state.
"use client";
import { create } from "zustand";
import type { NetStatus } from "@/lib/net/client";
import type { ErrorCode } from "@/lib/shared";

interface ConnectionState {
  status: NetStatus | "idle";
  roomId: string | null;
  lastError: ErrorCode | null;
  setStatus: (status: NetStatus | "idle") => void;
  setRoomId: (roomId: string | null) => void;
  setError: (code: ErrorCode | null) => void;
  reset: () => void;
}

export const useConnection = create<ConnectionState>((set) => ({
  status: "idle",
  roomId: null,
  lastError: null,
  setStatus: (status) => set({ status }),
  setRoomId: (roomId) => set({ roomId }),
  setError: (lastError) => set({ lastError }),
  reset: () => set({ status: "idle", roomId: null, lastError: null }),
}));

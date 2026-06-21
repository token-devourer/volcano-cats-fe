// ============================================================
// Net client — typed singleton wrapper over colyseus.js
// ============================================================
// Module-level singletons (not React state) so the live WebSocket
// survives component remounts. Handles create vs. join, persists the
// Colyseus reconnection token to sessionStorage so a browser refresh
// rejoins the live game, and routes the single "s" server channel to a
// typed handler.
// ============================================================

import { Client, Room } from "colyseus.js";
import type { ClientCommand, ServerMessage } from "@/lib/shared";

const ENDPOINT = process.env.NEXT_PUBLIC_SERVER_URL || "ws://localhost:3001";
const ROOM_NAME = "volcano_cats";
const MAX_RECONNECT_ATTEMPTS = 4;

export type NetStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

export interface ConnectOpts {
  /** Existing room id to join; omit to create a new room. */
  roomId?: string;
  username: string;
  onMessage: (msg: ServerMessage) => void;
  onStatus: (status: NetStatus) => void;
}

let client: Client | null = null;
let room: Room | null = null;
let connecting: Promise<Room> | null = null;
let handlers: Pick<ConnectOpts, "onMessage" | "onStatus"> | null = null;
let lastUsername = "";

function getClient(): Client {
  if (!client) client = new Client(ENDPOINT);
  return client;
}

function tokenKey(roomId: string): string {
  return `vc_rtoken_${roomId}`;
}

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function persistToken(r: Room) {
  safeSet(tokenKey(r.roomId), r.reconnectionToken);
}

function wire(r: Room) {
  r.onMessage("s", (msg: ServerMessage) => {
    persistToken(r); // token rotates on every message; keep the freshest
    handlers?.onMessage(msg);
  });
  r.onError(() => handlers?.onStatus("error"));
  r.onLeave((code) => {
    // 1000 = normal; 4000–4099 = our explicit server rejects. Anything else
    // (e.g. 1006 abnormal close) is a candidate for token reconnection.
    if (code === 1000 || (code >= 4000 && code < 4100)) {
      handlers?.onStatus("disconnected");
      return;
    }
    void attemptReconnect(r.roomId);
  });
  persistToken(r);
}

async function attemptReconnect(roomId: string) {
  const token = safeGet(tokenKey(roomId));
  if (!token) {
    handlers?.onStatus("disconnected");
    return;
  }
  handlers?.onStatus("reconnecting");
  for (let attempt = 0; attempt < MAX_RECONNECT_ATTEMPTS; attempt++) {
    try {
      const r = await getClient().reconnect(token);
      room = r;
      wire(r);
      handlers?.onStatus("connected");
      return;
    } catch {
      await new Promise((res) => setTimeout(res, 600 * (attempt + 1)));
    }
  }
  handlers?.onStatus("disconnected");
}

export async function connect(opts: ConnectOpts): Promise<Room> {
  handlers = { onMessage: opts.onMessage, onStatus: opts.onStatus };
  lastUsername = opts.username;

  // Reuse a live room if it matches the requested target.
  if (room && (!opts.roomId || room.roomId === opts.roomId)) return room;
  // Switching rooms: drop the old one first.
  if (room && opts.roomId && room.roomId !== opts.roomId) {
    try {
      await room.leave(true);
    } catch {
      /* ignore */
    }
    room = null;
  }
  if (connecting) return connecting;

  opts.onStatus("connecting");
  connecting = (async () => {
    const c = getClient();
    let r: Room | null = null;

    if (opts.roomId) {
      const token = safeGet(tokenKey(opts.roomId));
      if (token) {
        try {
          r = await c.reconnect(token);
        } catch {
          r = null;
        }
      }
      if (!r) r = await c.joinById(opts.roomId, { username: opts.username });
    } else {
      r = await c.create(ROOM_NAME, { username: opts.username });
    }

    room = r;
    wire(r);
    opts.onStatus("connected");
    return r;
  })();

  try {
    return await connecting;
  } catch (err) {
    opts.onStatus("error");
    throw err;
  } finally {
    connecting = null;
  }
}

export function send(cmd: ClientCommand) {
  room?.send("c", cmd);
}

export function currentRoomId(): string | null {
  return room?.roomId ?? null;
}

export function leave() {
  try {
    void room?.leave(true);
  } catch {
    /* ignore */
  }
  room = null;
  handlers = null;
}

export { lastUsername };

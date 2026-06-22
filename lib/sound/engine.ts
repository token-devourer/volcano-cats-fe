// ============================================================
// SOUND ENGINE — Web Audio singleton (synth now, files later)
// ============================================================
// One AudioContext for the whole app. `play(name)` prefers a preloaded file
// buffer from /public/sfx/<name>.{ogg,mp3} and falls back to the synth recipe
// when the file is absent, so pro SFX drop in with zero code change. Browser
// autoplay policy: the context is unlocked on the first user gesture (armed
// at module load). Mute/volume come from the persisted sound store; music is
// an optional looped file (silent if no file present).
// ============================================================
"use client";
import { RECIPES, type SfxName } from "./recipes";
import { useSoundStore } from "@/store/sound";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let subscribed = false;

// name → AudioBuffer (file present) | null (known-missing → use synth).
// A key existing means "already attempted"; absent means "not tried yet".
const buffers = new Map<string, AudioBuffer | null>();

const FILE_BASE = "/sfx";
const EXTS = ["ogg", "mp3"] as const;

function masterLevel(): number {
  const { muted, volume } = useSoundStore.getState();
  return muted ? 0 : volume;
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;

  const AC: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;

  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = masterLevel();
  master.connect(ctx.destination);

  if (!subscribed) {
    subscribed = true;
    // Keep the master level + music in sync with the persisted preferences.
    useSoundStore.subscribe((s) => {
      if (master) master.gain.value = s.muted ? 0 : s.volume;
      if (s.muted || !s.music) stopMusic();
      else void startMusic();
    });
  }
  return ctx;
}

/** Resume a suspended context + mark unlocked. Safe to call repeatedly. */
export function unlock(): void {
  const c = ensureCtx();
  if (c && c.state === "suspended") void c.resume().catch(() => {});
}

/** Try to load a file buffer for `name`. Resolves null when no file exists. */
async function loadBuffer(name: string): Promise<AudioBuffer | null> {
  const c = ensureCtx();
  if (!c) return null;
  for (const ext of EXTS) {
    try {
      const res = await fetch(`${FILE_BASE}/${name}.${ext}`, { cache: "force-cache" });
      if (!res.ok) continue;
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("text/html")) continue; // dev 404 fallback page
      const arr = await res.arrayBuffer();
      if (arr.byteLength < 64) continue;
      return await c.decodeAudioData(arr);
    } catch {
      /* try next ext */
    }
  }
  return null;
}

function playBuffer(c: AudioContext, out: AudioNode, buf: AudioBuffer): void {
  const src = c.createBufferSource();
  src.buffer = buf;
  src.connect(out);
  src.start();
}

/** Play one effect. No-op when muted or before the context exists. */
export function play(name: SfxName): void {
  if (useSoundStore.getState().muted) return;
  const c = ensureCtx();
  if (!c || !master) return;
  if (c.state === "suspended") void c.resume().catch(() => {});

  const cached = buffers.get(name);
  if (cached) {
    playBuffer(c, master, cached);
    return;
  }
  // Synth immediately; if we haven't probed for a file yet, do it in the
  // background and prefer the file on subsequent plays.
  RECIPES[name]?.(c, master);
  if (!buffers.has(name)) {
    buffers.set(name, null);
    void loadBuffer(name).then((buf) => {
      if (buf) buffers.set(name, buf);
    });
  }
}

// ---- optional background music (file only; silent if /public/sfx/music.* absent) ----
let musicSrc: AudioBufferSourceNode | null = null;
let musicGain: GainNode | null = null;
let musicBuf: AudioBuffer | null | undefined = undefined; // undefined = not probed

export async function startMusic(): Promise<void> {
  const c = ensureCtx();
  if (!c || !master || musicSrc) return;
  if (musicBuf === undefined) musicBuf = await loadBuffer("music");
  if (!musicBuf) return; // no file → silence (synth fallback is intentionally none)

  musicGain = c.createGain();
  musicGain.gain.value = 0.25;
  musicGain.connect(master);
  musicSrc = c.createBufferSource();
  musicSrc.buffer = musicBuf;
  musicSrc.loop = true;
  musicSrc.connect(musicGain);
  musicSrc.start();
}

export function stopMusic(): void {
  if (musicSrc) {
    try {
      musicSrc.stop();
    } catch {
      /* already stopped */
    }
    musicSrc.disconnect();
    musicSrc = null;
  }
}

/** Arm the one-time autoplay unlock on the first user gesture. */
export function armUnlock(): void {
  if (typeof window === "undefined") return;
  const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart"];
  const arm = () => {
    unlock();
    if (useSoundStore.getState().music) void startMusic();
    events.forEach((e) => window.removeEventListener(e, arm));
  };
  events.forEach((e) => window.addEventListener(e, arm, { once: true, passive: true }));
}

// Arm immediately on the client so the very first interaction unlocks audio,
// even if no React effect has run yet.
if (typeof window !== "undefined") armUnlock();

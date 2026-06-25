// ============================================================
// VOLCANO MUSIC + AMBIENCE — synth, zero asset files
// ============================================================
// Two looped "tracks" plus a continuous volcanic ambient bed.
//   - ambient: low rumble drone + filtered noise wind + occasional distant boom
//   - lobby:   slow cozy minor-pentatonic theme with pizzicato "kitty" plucks
//   - game:    tense ostinato bass + ember marimba lead, ~110 bpm
// Each track schedules notes in 8-second windows ahead of time using the
// AudioContext clock for jitter-free looping; a setInterval keeps the buffer
// filled. Stopping a track cancels future windows and fades the bus out.
// ============================================================
"use client";

import { getAudio } from "./engine";

export type MusicTrack = "lobby" | "game";

interface VoiceBus {
  gain: GainNode;
  stop(): void;
}

interface ActiveTrack {
  track: MusicTrack;
  bus: VoiceBus;
  scheduler: ReturnType<typeof setInterval>;
  nextTime: number;
  step: number;
}

let ambient: VoiceBus | null = null;
let active: ActiveTrack | null = null;

// ---------- shared helpers ------------------------------------------------

function note(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  freq: number,
  dur: number,
  type: OscillatorType,
  gain: number,
  attack = 0.01,
  release?: number,
): void {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + (release ?? 0));
  osc.connect(g);
  g.connect(out);
  osc.start(t);
  osc.stop(t + dur + (release ?? 0) + 0.05);
}

function noiseBurst(
  ctx: AudioContext,
  out: AudioNode,
  t: number,
  dur: number,
  freq: number,
  q: number,
  gain: number,
): void {
  const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(out);
  src.start(t);
  src.stop(t + dur + 0.02);
}

// ---------- AMBIENT (always under any track) ------------------------------

function startAmbient(): VoiceBus | null {
  const audio = getAudio();
  if (!audio) return null;
  const { ctx, master } = audio;

  const bus = ctx.createGain();
  bus.gain.setValueAtTime(0.0001, ctx.currentTime);
  bus.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 1.5);
  bus.connect(master);

  // Sub rumble: two detuned low sines.
  const subA = ctx.createOscillator();
  subA.type = "sine";
  subA.frequency.value = 48;
  const subB = ctx.createOscillator();
  subB.type = "sine";
  subB.frequency.value = 55;
  const subG = ctx.createGain();
  subG.gain.value = 0.55;
  subA.connect(subG);
  subB.connect(subG);
  subG.connect(bus);
  subA.start();
  subB.start();

  // Slow LFO on sub gain for "breathing" magma.
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  const lfoG = ctx.createGain();
  lfoG.gain.value = 0.35;
  lfo.connect(lfoG);
  lfoG.connect(subG.gain);
  lfo.start();

  // Filtered noise wind (constant brown-ish hiss).
  const len = ctx.sampleRate * 4;
  const nb = ctx.createBuffer(1, len, ctx.sampleRate);
  const nch = nb.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    last = (last + 0.02 * w) / 1.02;
    nch[i] = last * 3;
  }
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = nb;
  noiseSrc.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  lp.Q.value = 0.7;
  const noiseG = ctx.createGain();
  noiseG.gain.value = 0.18;
  noiseSrc.connect(lp);
  lp.connect(noiseG);
  noiseG.connect(bus);
  noiseSrc.start();

  // Occasional distant boom.
  let boomTimer: ReturnType<typeof setTimeout> | null = null;
  const scheduleBoom = () => {
    const audio2 = getAudio();
    if (!audio2) return;
    const c = audio2.ctx;
    const t = c.currentTime + 0.05;
    note(c, bus, t, 38, 1.4, "sine", 0.6, 0.05, 0.4);
    noiseBurst(c, bus, t, 1.2, 90, 1.2, 0.25);
    boomTimer = setTimeout(scheduleBoom, 9000 + Math.random() * 14000);
  };
  boomTimer = setTimeout(scheduleBoom, 4000 + Math.random() * 6000);

  return {
    gain: bus,
    stop() {
      if (boomTimer) clearTimeout(boomTimer);
      const c = ctx;
      const now = c.currentTime;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(bus.gain.value, now);
      bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        try {
          subA.stop();
          subB.stop();
          lfo.stop();
          noiseSrc.stop();
        } catch {
          /* ignore */
        }
        bus.disconnect();
      }, 900);
    },
  };
}

// ---------- TRACKS --------------------------------------------------------

function createMusicBus(level: number): VoiceBus | null {
  const audio = getAudio();
  if (!audio) return null;
  const { ctx, master } = audio;
  const bus = ctx.createGain();
  bus.gain.setValueAtTime(0.0001, ctx.currentTime);
  bus.gain.linearRampToValueAtTime(level * 1.8, ctx.currentTime + 1.2);
  bus.connect(master);
  return {
    gain: bus,
    stop() {
      const now = ctx.currentTime;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(bus.gain.value, now);
      bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      setTimeout(() => bus.disconnect(), 700);
    },
  };
}

// A minor scale (A2 root) — mournful + warm, fits "volcanic cat".
const A_MINOR_PENT = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33];
// Lower octave bass tones.
const BASS = [55.0, 65.41, 73.42, 82.41, 110.0];

function scheduleLobbyBar(ctx: AudioContext, out: AudioNode, t0: number, step: number): number {
  // 4 beats * 0.75s = 3s per bar at ~80bpm-ish, cozy + slow.
  const beat = 0.75;
  // Soft pad chord (Am): A2, E3, A3 — sustained sines.
  note(ctx, out, t0, 110.0, 2.6, "sine", 0.28, 0.4, 0.4);
  note(ctx, out, t0, 164.81, 2.6, "sine", 0.22, 0.5, 0.4);
  note(ctx, out, t0 + 1.5, 220.0, 1.6, "sine", 0.20, 0.3, 0.3);

  // Pizzicato "kitty paw" melody — triangle plucks with quick decay.
  const phrases: number[][] = [
    [0, 2, 4, 3, 2],
    [0, 4, 3, 5, 4, 2],
    [4, 5, 4, 2, 0],
    [2, 4, 5, 7, 5, 4, 2, 0],
  ];
  const phrase = phrases[step % phrases.length];
  for (let i = 0; i < phrase.length; i++) {
    const t = t0 + i * (beat / 1.5);
    const f = A_MINOR_PENT[phrase[i]];
    note(ctx, out, t, f, 0.28, "triangle", 0.35, 0.005, 0.15);
    // Tiny upward bend on the first note of the phrase = soft "meow".
    if (i === 0) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f * 0.88, t);
      osc.frequency.exponentialRampToValueAtTime(f * 1.08, t + 0.22);
      osc.frequency.exponentialRampToValueAtTime(f * 0.92, t + 0.42);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.connect(g);
      g.connect(out);
      osc.start(t);
      osc.stop(t + 0.55);
    }
  }
  return 4 * beat; // bar length
}

function scheduleGameBar(ctx: AudioContext, out: AudioNode, t0: number, step: number): number {
  // Faster, more driving ~110bpm. 8 sixteenths of 0.13s ≈ 1.05s per half-bar.
  const sixteenth = 0.135;
  const beats = 8;

  // Driving bass ostinato (root, fifth, root, sixth pattern).
  const bassPattern = [0, 0, 2, 0, 1, 0, 2, 3];
  for (let i = 0; i < beats; i++) {
    const t = t0 + i * sixteenth;
    note(ctx, out, t, BASS[bassPattern[i % bassPattern.length]], sixteenth * 0.9, "sawtooth", 0.22, 0.003, 0.02);
  }

  // Ember marimba lead (triangle with quick body).
  const leads: number[][] = [
    [0, 2, 4, 5, 4, 2, 4, 7],
    [4, 5, 7, 5, 4, 2, 0, 2],
    [0, 4, 7, 6, 4, 2, 4, 0],
    [7, 6, 4, 5, 4, 2, 0, -1],
  ];
  const lead = leads[step % leads.length];
  for (let i = 0; i < lead.length; i++) {
    const idx = lead[i];
    if (idx < 0) continue;
    const t = t0 + i * sixteenth;
    const f = A_MINOR_PENT[idx] * 2;
    note(ctx, out, t, f, 0.18, "triangle", 0.30, 0.004, 0.06);
  }

  // Rumble swell on the downbeat every 4 bars for tension.
  if (step % 4 === 0) {
    noiseBurst(ctx, out, t0, beats * sixteenth, 140, 0.9, 0.07);
  }

  return beats * sixteenth;
}

function startTrack(track: MusicTrack): ActiveTrack | null {
  const bus = createMusicBus(track === "lobby" ? 0.35 : 0.30);
  if (!bus) return null;
  const audio = getAudio();
  if (!audio) {
    bus.stop();
    return null;
  }
  const { ctx } = audio;

  const state: ActiveTrack = {
    track,
    bus,
    scheduler: 0 as unknown as ReturnType<typeof setInterval>,
    nextTime: ctx.currentTime + 0.15,
    step: 0,
  };

  const fill = () => {
    const a = getAudio();
    if (!a) return;
    const horizon = a.ctx.currentTime + 2.0;
    while (state.nextTime < horizon) {
      const dur =
        track === "lobby"
          ? scheduleLobbyBar(a.ctx, bus.gain, state.nextTime, state.step)
          : scheduleGameBar(a.ctx, bus.gain, state.nextTime, state.step);
      state.nextTime += dur;
      state.step++;
    }
  };
  fill();
  state.scheduler = setInterval(fill, 500);
  return state;
}

// ---------- public API ----------------------------------------------------

export function setMusicTrack(track: MusicTrack | null): void {
  if (active && active.track === track) return;
  if (active) {
    clearInterval(active.scheduler);
    active.bus.stop();
    active = null;
  }
  if (!ambient && track) ambient = startAmbient();
  if (track) active = startTrack(track);
}

export function stopAllMusic(): void {
  if (active) {
    clearInterval(active.scheduler);
    active.bus.stop();
    active = null;
  }
  if (ambient) {
    ambient.stop();
    ambient = null;
  }
}

export function currentTrack(): MusicTrack | null {
  return active?.track ?? null;
}

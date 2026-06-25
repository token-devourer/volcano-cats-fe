// ============================================================
// SYNTH SFX RECIPES — Web Audio, zero asset files
// ============================================================
// Each recipe schedules a few oscillators / noise bursts to make a short,
// cheerful sound effect entirely in code. The engine (engine.ts) prefers a
// real file from /public/sfx/<name>.{ogg,mp3} and falls back to these recipes
// when the file is absent — so pro SFX can be dropped in later with no code
// change. Keep them short, bright and low-gain (they layer over each other).
// ============================================================

export type SfxName =
  | "click"
  | "hover"
  | "select"
  | "deal"
  | "draw"
  | "play"
  | "gang"
  | "yourTurn"
  | "lavaAlarm"
  | "defuse"
  | "freeze"
  | "steal"
  | "shuffle"
  | "win"
  | "lose"
  | "eliminate"
  | "error"
  | "toast"
  // --- signature per-card effects (Tropic Pop redesign) ---
  | "eruptBoom"
  | "steam"
  | "yawn"
  | "impact"
  | "scan"
  | "rumble"
  | "freezeCrack"
  | "ribbon"
  | "reverseWhoosh"
  | "shot"
  | "shutterSwap"
  | "shieldHum"
  | "sneakGrab"
  | "wave"
  | "rewind"
  | "lockSlam"
  | "comboBig"
  | "rainbowPop"
  | "crumble"
  | "whiff";

interface ToneOpts {
  freq: number;
  type?: OscillatorType;
  dur?: number;
  when?: number;
  gain?: number;
  attack?: number;
  /** Glide the pitch to this frequency across the note. */
  glideTo?: number;
}

/** A single enveloped oscillator note. */
function tone(ctx: AudioContext, out: AudioNode, o: ToneOpts): void {
  const { freq, type = "sine", dur = 0.12, when = 0, gain = 0.2, attack = 0.005, glideTo } = o;
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), t0 + dur);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(g);
  g.connect(out);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

interface NoiseOpts {
  dur?: number;
  when?: number;
  gain?: number;
  filterFreq?: number;
  filterType?: BiquadFilterType;
  q?: number;
}

/** A short filtered white-noise burst (whooshes, shuffles, poofs). */
function noise(ctx: AudioContext, out: AudioNode, o: NoiseOpts): void {
  const { dur = 0.2, when = 0, gain = 0.2, filterFreq, filterType = "lowpass", q } = o;
  const t0 = ctx.currentTime + when;
  const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  if (filterFreq) {
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.value = filterFreq;
    if (q) f.Q.value = q;
    src.connect(f);
    f.connect(g);
  } else {
    src.connect(g);
  }
  g.connect(out);
  src.start(t0);
  src.stop(t0 + dur);
}

/** Synth recipe per effect. Bright, major-key, happy. */
export const RECIPES: Record<SfxName, (ctx: AudioContext, out: AudioNode) => void> = {
  click: (c, o) => tone(c, o, { freq: 520, type: "triangle", dur: 0.06, gain: 0.16 }),
  hover: (c, o) => tone(c, o, { freq: 680, type: "sine", dur: 0.04, gain: 0.06 }),
  select: (c, o) => {
    // Volcanic flint-strike: bright sulfur ping that drops onto a warm ember pad.
    tone(c, o, { freq: 920, glideTo: 1240, type: "triangle", dur: 0.06, gain: 0.14 });
    tone(c, o, { freq: 540, when: 0.04, dur: 0.12, type: "sine", gain: 0.12 });
    noise(c, o, { when: 0.02, dur: 0.05, gain: 0.05, filterFreq: 5200, filterType: "highpass" });
  },
  deal: (c, o) => {
    // Stone-on-stone shuffle: short brushed-rock noise + soft basalt thud.
    noise(c, o, { dur: 0.1, gain: 0.09, filterFreq: 2400, filterType: "bandpass", q: 1.2 });
    noise(c, o, { when: 0.06, dur: 0.08, gain: 0.07, filterFreq: 1500, filterType: "bandpass", q: 1.4 });
    tone(c, o, { freq: 150, glideTo: 90, type: "sine", dur: 0.12, gain: 0.09 });
  },

  draw: (c, o) => {
    noise(c, o, { dur: 0.14, gain: 0.1, filterFreq: 1800 });
    tone(c, o, { freq: 300, glideTo: 540, type: "sine", dur: 0.16, gain: 0.12 });
  },
  play: (c, o) => {
    tone(c, o, { freq: 500, glideTo: 780, type: "triangle", dur: 0.14, gain: 0.17 });
    noise(c, o, { dur: 0.08, gain: 0.05, filterFreq: 3000, filterType: "highpass" });
  },
  gang: (c, o) => [392, 494, 587, 784].forEach((f, i) =>
    tone(c, o, { freq: f, when: i * 0.04, dur: 0.13, type: "triangle", gain: 0.13 })),
  yourTurn: (c, o) => [523, 659, 784].forEach((f, i) =>
    tone(c, o, { freq: f, when: i * 0.08, dur: 0.2, type: "sine", gain: 0.16 })),
  lavaAlarm: (c, o) => {
    for (let i = 0; i < 3; i++) {
      tone(c, o, { freq: 880, when: i * 0.16, dur: 0.1, type: "sawtooth", gain: 0.15 });
      tone(c, o, { freq: 620, when: i * 0.16 + 0.08, dur: 0.08, type: "sawtooth", gain: 0.13 });
    }
  },
  defuse: (c, o) => {
    tone(c, o, { freq: 392, glideTo: 784, type: "sine", dur: 0.3, gain: 0.16 });
    tone(c, o, { freq: 587, when: 0.12, dur: 0.26, type: "sine", gain: 0.12 });
  },
  freeze: (c, o) => {
    tone(c, o, { freq: 1200, glideTo: 520, type: "sine", dur: 0.4, gain: 0.12 });
    noise(c, o, { dur: 0.3, gain: 0.04, filterFreq: 6000, filterType: "highpass" });
  },
  steal: (c, o) => tone(c, o, { freq: 720, glideTo: 300, type: "triangle", dur: 0.18, gain: 0.14 }),
  shuffle: (c, o) => {
    for (let i = 0; i < 5; i++)
      noise(c, o, { when: i * 0.05, dur: 0.05, gain: 0.07, filterFreq: 2500, filterType: "bandpass", q: 2 });
  },
  win: (c, o) => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(c, o, { freq: f, when: i * 0.12, dur: 0.4, type: "triangle", gain: 0.18 }));
    tone(c, o, { freq: 1568, when: 0.5, dur: 0.5, type: "sine", gain: 0.13 });
  },
  lose: (c, o) => [440, 349, 262].forEach((f, i) =>
    tone(c, o, { freq: f, when: i * 0.14, dur: 0.3, type: "sine", gain: 0.13 })),
  eliminate: (c, o) => {
    tone(c, o, { freq: 300, glideTo: 80, type: "sawtooth", dur: 0.4, gain: 0.15 });
    noise(c, o, { dur: 0.3, gain: 0.09, filterFreq: 1000 });
  },
  error: (c, o) => tone(c, o, { freq: 160, type: "square", dur: 0.18, gain: 0.1 }),
  toast: (c, o) => tone(c, o, { freq: 880, type: "sine", dur: 0.08, gain: 0.09 }),

  // --- signature per-card effects ---
  eruptBoom: (c, o) => {
    tone(c, o, { freq: 140, glideTo: 38, type: "sawtooth", dur: 0.5, gain: 0.2 });
    tone(c, o, { freq: 90, glideTo: 30, when: 0.02, type: "square", dur: 0.42, gain: 0.12 });
    noise(c, o, { dur: 0.5, gain: 0.12, filterFreq: 800 });
  },
  steam: (c, o) => {
    noise(c, o, { dur: 0.5, gain: 0.08, filterFreq: 5200, filterType: "highpass" });
    tone(c, o, { freq: 900, glideTo: 280, type: "sine", dur: 0.32, gain: 0.05 });
  },
  yawn: (c, o) => {
    tone(c, o, { freq: 300, glideTo: 520, type: "sine", dur: 0.25, gain: 0.1 });
    tone(c, o, { freq: 520, glideTo: 240, when: 0.22, type: "sine", dur: 0.3, gain: 0.09 });
  },
  impact: (c, o) => {
    tone(c, o, { freq: 200, glideTo: 60, type: "square", dur: 0.16, gain: 0.18 });
    noise(c, o, { dur: 0.12, gain: 0.1, filterFreq: 1500 });
  },
  scan: (c, o) => {
    tone(c, o, { freq: 1200, type: "sine", dur: 0.08, gain: 0.1 });
    tone(c, o, { freq: 1500, when: 0.1, type: "sine", dur: 0.08, gain: 0.1 });
    noise(c, o, { dur: 0.2, gain: 0.03, filterFreq: 6000, filterType: "highpass" });
  },
  rumble: (c, o) => {
    noise(c, o, { dur: 0.6, gain: 0.16, filterFreq: 220 });
    tone(c, o, { freq: 58, type: "sine", dur: 0.6, gain: 0.12 });
  },
  freezeCrack: (c, o) => {
    tone(c, o, { freq: 1400, glideTo: 500, type: "sine", dur: 0.35, gain: 0.1 });
    noise(c, o, { when: 0.18, dur: 0.12, gain: 0.1, filterFreq: 4000, filterType: "highpass" });
  },
  ribbon: (c, o) => [659, 880, 1175].forEach((f, i) =>
    tone(c, o, { freq: f, when: i * 0.05, dur: 0.12, type: "triangle", gain: 0.12 })),
  reverseWhoosh: (c, o) => {
    tone(c, o, { freq: 800, glideTo: 300, type: "sawtooth", dur: 0.18, gain: 0.1 });
    tone(c, o, { freq: 300, glideTo: 820, when: 0.18, type: "sawtooth", dur: 0.18, gain: 0.1 });
  },
  shot: (c, o) => {
    tone(c, o, { freq: 1800, glideTo: 200, type: "square", dur: 0.08, gain: 0.16 });
    noise(c, o, { dur: 0.1, gain: 0.12, filterFreq: 3000, filterType: "highpass" });
  },
  shutterSwap: (c, o) => {
    noise(c, o, { dur: 0.05, gain: 0.12, filterFreq: 2000 });
    tone(c, o, { freq: 600, glideTo: 900, when: 0.08, type: "triangle", dur: 0.12, gain: 0.1 });
  },
  shieldHum: (c, o) => {
    tone(c, o, { freq: 220, type: "sine", dur: 0.4, gain: 0.12 });
    tone(c, o, { freq: 440, type: "sine", dur: 0.4, gain: 0.08 });
    tone(c, o, { freq: 880, when: 0.15, type: "sine", dur: 0.3, gain: 0.07 });
  },
  sneakGrab: (c, o) => {
    tone(c, o, { freq: 500, glideTo: 900, type: "sine", dur: 0.14, gain: 0.08 });
    noise(c, o, { when: 0.14, dur: 0.06, gain: 0.1, filterFreq: 2500, filterType: "bandpass", q: 2 });
  },
  wave: (c, o) => {
    noise(c, o, { dur: 0.5, gain: 0.1, filterFreq: 900 });
    tone(c, o, { freq: 200, glideTo: 120, type: "sine", dur: 0.5, gain: 0.08 });
  },
  rewind: (c, o) => {
    for (let i = 0; i < 4; i++)
      tone(c, o, { freq: 300 + i * 200, glideTo: 200 + i * 200, when: i * 0.06, type: "sine", dur: 0.1, gain: 0.08 });
  },
  lockSlam: (c, o) => {
    tone(c, o, { freq: 160, glideTo: 58, type: "square", dur: 0.14, gain: 0.16 });
    noise(c, o, { when: 0.04, dur: 0.1, gain: 0.12, filterFreq: 800 });
  },
  comboBig: (c, o) => [392, 523, 659, 784, 1047].forEach((f, i) =>
    tone(c, o, { freq: f, when: i * 0.05, dur: 0.18, type: "triangle", gain: 0.13 })),
  rainbowPop: (c, o) => [523, 587, 659, 784, 880, 1047, 1319].forEach((f, i) =>
    tone(c, o, { freq: f, when: i * 0.04, dur: 0.14, type: "triangle", gain: 0.12 })),
  crumble: (c, o) => {
    for (let i = 0; i < 5; i++)
      noise(c, o, { when: i * 0.05, dur: 0.08, gain: 0.08, filterFreq: 600 + i * 110 });
  },
  whiff: (c, o) => {
    noise(c, o, { dur: 0.18, gain: 0.07, filterFreq: 1200, filterType: "bandpass", q: 1 });
    tone(c, o, { freq: 400, glideTo: 200, type: "sine", dur: 0.18, gain: 0.06 });
  },
};

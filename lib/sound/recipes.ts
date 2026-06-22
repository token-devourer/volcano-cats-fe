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
  | "toast";

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
    tone(c, o, { freq: 440, type: "triangle", dur: 0.07, gain: 0.15 });
    tone(c, o, { freq: 660, when: 0.05, dur: 0.09, type: "triangle", gain: 0.13 });
  },
  deal: (c, o) => noise(c, o, { dur: 0.12, gain: 0.1, filterFreq: 2200, filterType: "bandpass", q: 1 }),
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
};

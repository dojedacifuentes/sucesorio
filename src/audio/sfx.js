// Sonido sintetizado con WebAudio: sin archivos que cargar ni fallar.
// El contexto se crea tras la primera acción del jugador, se suspende al
// ocultar la pestaña y todo sonido es redundante con un cambio visual.

const RECIPES = {
  tap: [{ type: "sine", f: 660, to: 720, dur: 0.05, gain: 0.12 }],
  select: [{ type: "triangle", f: 520, to: 780, dur: 0.08, gain: 0.14 }],
  place: [
    { type: "triangle", f: 300, to: 240, dur: 0.07, gain: 0.18 },
    { type: "sine", f: 900, dur: 0.05, gain: 0.06, at: 0.02 },
  ],
  connect: [
    { type: "sine", f: 520, dur: 0.09, gain: 0.12 },
    { type: "sine", f: 780, dur: 0.12, gain: 0.12, at: 0.07 },
  ],
  page: [{ type: "sine", f: 420, to: 460, dur: 0.05, gain: 0.07 }],
  open: [{ type: "sine", f: 360, to: 620, dur: 0.12, gain: 0.08 }],
  close: [{ type: "sine", f: 620, to: 360, dur: 0.1, gain: 0.07 }],
  confirm: [
    { type: "triangle", f: 440, dur: 0.08, gain: 0.14 },
    { type: "triangle", f: 660, dur: 0.12, gain: 0.12, at: 0.06 },
  ],
  success: [
    { type: "triangle", f: 523.25, dur: 0.14, gain: 0.13 },
    { type: "triangle", f: 659.25, dur: 0.14, gain: 0.12, at: 0.09 },
    { type: "triangle", f: 783.99, dur: 0.26, gain: 0.12, at: 0.18 },
  ],
  error: [
    { type: "sawtooth", f: 196, to: 150, dur: 0.18, gain: 0.07, filter: 900 },
    { type: "square", f: 98, dur: 0.16, gain: 0.04, filter: 600, at: 0.04 },
  ],
  damage: [{ type: "sawtooth", f: 160, to: 70, dur: 0.28, gain: 0.1, filter: 700 }],
  hit: [
    { type: "square", f: 220, to: 440, dur: 0.08, gain: 0.08, filter: 2400 },
    { type: "triangle", f: 880, dur: 0.12, gain: 0.1, at: 0.05 },
  ],
  combo: [
    { type: "sine", f: 880, dur: 0.06, gain: 0.08 },
    { type: "sine", f: 1175, dur: 0.1, gain: 0.08, at: 0.05 },
  ],
  tick: [{ type: "square", f: 1200, dur: 0.025, gain: 0.03, filter: 3000 }],
  solve: [
    { type: "triangle", f: 392, dur: 0.18, gain: 0.12 },
    { type: "triangle", f: 523.25, dur: 0.18, gain: 0.12, at: 0.12 },
    { type: "triangle", f: 659.25, dur: 0.18, gain: 0.12, at: 0.24 },
    { type: "sine", f: 1046.5, dur: 0.5, gain: 0.08, at: 0.36 },
  ],
  phase: [
    { type: "sawtooth", f: 110, to: 220, dur: 0.5, gain: 0.07, filter: 1200 },
    { type: "sine", f: 440, dur: 0.3, gain: 0.06, at: 0.3 },
  ],
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.volume = 0.6;
    this.muted = false;
    this.ambienceOn = false;
    this.ambience = null;
    this.unlocked = false;
    this.onVisibility = () => {
      if (!this.ctx) return;
      if (document.visibilityState === "hidden") this.ctx.suspend().catch(() => {});
      else this.ctx.resume().catch(() => {});
    };
  }

  /** Se llama desde un gesto del jugador. */
  unlock() {
    if (this.unlocked) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    try {
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
      this.unlocked = true;
      document.addEventListener("visibilitychange", this.onVisibility);
      if (this.ambienceOn) this.startAmbience();
    } catch {
      this.ctx = null;
    }
  }

  configure({ volume, muted, ambience }) {
    if (typeof volume === "number") this.volume = Math.max(0, Math.min(1, volume));
    if (typeof muted === "boolean") this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.03);
    }
    if (typeof ambience === "boolean" && ambience !== this.ambienceOn) {
      this.ambienceOn = ambience;
      if (ambience) this.startAmbience();
      else this.stopAmbience();
    }
  }

  play(name) {
    if (!this.ctx || this.muted || this.ctx.state !== "running") return;
    const recipe = RECIPES[name];
    if (!recipe) return;
    const now = this.ctx.currentTime;
    for (const voice of recipe) {
      const start = now + (voice.at ?? 0);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = voice.type;
      osc.frequency.setValueAtTime(voice.f, start);
      if (voice.to) osc.frequency.exponentialRampToValueAtTime(voice.to, start + voice.dur);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(voice.gain, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + voice.dur);
      let node = osc;
      if (voice.filter) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = voice.filter;
        osc.connect(filter);
        node = filter;
      }
      node.connect(gain);
      gain.connect(this.master);
      osc.start(start);
      osc.stop(start + voice.dur + 0.05);
    }
  }

  startAmbience() {
    if (!this.ctx || this.ambience) return;
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.setTargetAtTime(0.035, ctx.currentTime, 1.5);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    const voices = [55, 82.41, 110.3].map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 1 ? "triangle" : "sawtooth";
      osc.frequency.value = f;
      osc.detune.value = i * 4 - 4;
      osc.connect(filter);
      osc.start();
      return osc;
    });
    filter.connect(out);
    out.connect(this.master);
    lfo.start();
    this.ambience = { out, voices, lfo };
  }

  stopAmbience() {
    if (!this.ambience || !this.ctx) return;
    const { out, voices, lfo } = this.ambience;
    this.ambience = null;
    out.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
    window.setTimeout(() => {
      voices.forEach((v) => v.stop());
      lfo.stop();
      out.disconnect();
    }, 1800);
  }
}

export const audio = new AudioEngine();

export function playSfx(name) {
  audio.play(name);
}

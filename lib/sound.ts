"use client";
let ctx: AudioContext | null = null;

/** Soft paper rustle made from filtered noise — no audio files needed. */
export function playFlip(enabled = true) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ||= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const dur = 0.55;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      // crackly noise with a few paper "ticks"
      const tick = Math.random() < 0.004 ? (Math.random() - 0.5) * 3 : 0;
      d[i] = ((Math.random() * 2 - 1) * (0.6 + 0.4 * Math.sin(t * 40)) + tick) * Math.pow(Math.sin(Math.PI * t), 1.6);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.7;
    const now = ctx.currentTime;
    bp.frequency.setValueAtTime(900, now);
    bp.frequency.exponentialRampToValueAtTime(3800, now + dur * 0.6);
    bp.frequency.exponentialRampToValueAtTime(1600, now + dur);
    const g = ctx.createGain();
    g.gain.value = 0.16;
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start();
  } catch {}
}

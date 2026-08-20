// Small Web Audio synthesizer for the console's UI sound effects — every sound
// is generated at runtime (oscillators + filtered noise), not a shipped audio
// file. That's a deliberate choice, not a shortcut: Sony's actual PS1 startup
// chime and drive sounds are copyrighted, so this reaches for the same mechanical
// character (disc thunk, drive spin-up whirr, chime) without reproducing them.

type SoundName = 'click' | 'insert' | 'reading' | 'loaded' | 'eject' | 'power'

interface ToneOptions {
  type?: OscillatorType
  peak?: number
  delay?: number
  freqEnd?: number // optional pitch glide, for mechanical "spin" character
}

function playTone(ctx: AudioContext, dest: AudioNode, freq: number, duration: number, opts: ToneOptions = {}) {
  const { type = 'sine', peak = 0.2, delay = 0, freqEnd } = opts
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  const t0 = ctx.currentTime + delay
  osc.frequency.setValueAtTime(freq, t0)
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + duration)
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain)
  gain.connect(dest)
  osc.start(t0)
  osc.stop(t0 + duration + 0.03)
}

interface NoiseSweepOptions {
  startFreq: number
  endFreq: number
  duration: number
  peak?: number
  delay?: number
  q?: number
}

function playNoiseSweep(ctx: AudioContext, dest: AudioNode, opts: NoiseSweepOptions) {
  const { startFreq, endFreq, duration, peak = 0.1, delay = 0, q = 5 } = opts
  const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration))
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = q
  const t0 = ctx.currentTime + delay
  filter.frequency.setValueAtTime(startFreq, t0)
  filter.frequency.exponentialRampToValueAtTime(endFreq, t0 + duration)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(peak, t0 + duration * 0.2)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(dest)
  noise.start(t0)
  noise.stop(t0 + duration + 0.03)
}

// A sustained, slightly wobbling drive-motor hum — two detuned saw oscillators
// through a lowpass, with an LFO wobbling the filter cutoff for mechanical texture.
function playMotorWhirr(ctx: AudioContext, dest: AudioNode, duration: number, delay = 0) {
  const t0 = ctx.currentTime + delay
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(0.14, t0 + duration * 0.18)
  gain.gain.linearRampToValueAtTime(0.1, t0 + duration * 0.7)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.Q.value = 1.2
  filter.frequency.setValueAtTime(220, t0)
  filter.frequency.exponentialRampToValueAtTime(720, t0 + duration * 0.6)

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 14
  lfoGain.gain.value = 60
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  for (const [freq, detune] of [
    [110, -6],
    [110, 6],
  ] as const) {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, t0)
    osc.frequency.exponentialRampToValueAtTime(freq * 2.4, t0 + duration * 0.55)
    osc.detune.value = detune
    osc.connect(filter)
    osc.start(t0)
    osc.stop(t0 + duration + 0.03)
  }

  filter.connect(gain)
  gain.connect(dest)
  lfo.start(t0)
  lfo.stop(t0 + duration + 0.03)
}

export class ConsoleSoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null

  private ensure() {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.85
      // Several sounds can overlap (e.g. insert + reading fire back to back) — a
      // limiter keeps that from summing into clipping/distortion that can read as
      // one sound "winning" and the rest going silent or garbled.
      const compressor = this.ctx.createDynamicsCompressor()
      compressor.threshold.value = -20
      compressor.knee.value = 10
      compressor.ratio.value = 8
      compressor.attack.value = 0.002
      compressor.release.value = 0.15
      this.master.connect(compressor)
      compressor.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})
    return { ctx: this.ctx, master: this.master! }
  }

  play(name: SoundName) {
    try {
      const { ctx, master } = this.ensure()
      switch (name) {
        case 'click':
          // short, high confirm blip — picking a disc off the shelf
          playTone(ctx, master, 1568, 0.05, { type: 'square', peak: 0.14 })
          break
        case 'insert':
          // low mechanical thunk, like a disc dropping into the tray — kept short
          // and simple so it doesn't bury the spin-up whirr that follows right after
          playTone(ctx, master, 85, 0.18, { type: 'sine', peak: 0.3, freqEnd: 55 })
          playNoiseSweep(ctx, master, { startFreq: 1400, endFreq: 260, duration: 0.05, peak: 0.16, q: 2 })
          break
        case 'reading':
          // sustained spin-up whirr, entering just as the thunk finishes so the two
          // read as separate events instead of one blurred hit
          playMotorWhirr(ctx, master, 0.62, 0.16)
          break
        case 'loaded':
          // bright four-note resolving chime
          playTone(ctx, master, 587.33, 0.13, { peak: 0.22 })
          playTone(ctx, master, 739.99, 0.13, { peak: 0.22, delay: 0.08 })
          playTone(ctx, master, 932.33, 0.15, { peak: 0.22, delay: 0.16 })
          playTone(ctx, master, 1174.66, 0.26, { peak: 0.24, delay: 0.25 })
          break
        case 'eject':
          playTone(ctx, master, 200, 0.14, { type: 'triangle', peak: 0.2, freqEnd: 340 })
          playNoiseSweep(ctx, master, { startFreq: 500, endFreq: 1200, duration: 0.06, peak: 0.12, q: 3 })
          break
        case 'power':
          playTone(ctx, master, 196, 0.16, { peak: 0.2 })
          playTone(ctx, master, 392, 0.24, { peak: 0.2, delay: 0.1 })
          break
      }
    } catch {
      // Audio can fail to init in some environments (autoplay policy, no audio
      // device, etc.) — the console still fully works without sound.
    }
  }
}

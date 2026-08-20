import { ArrowRight, Trophy, Sparkles, Mic, Eye, Award } from 'lucide-react'
import Reveal from './Reveal'
import PSGlyph from './PSGlyph'
import { awaaz } from '../data/content'

export default function Awaaz() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/30 p-8 sm:p-12">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald/[0.06] blur-[110px]" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan/[0.06] blur-[110px]" />

            <div className="relative grid lg:grid-cols-12 gap-10 items-center">
              {/* Left Details */}
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-md border border-cyan/30 bg-cyan/10 px-3 py-1.5 font-mono text-[11px] tracking-wide text-cyan uppercase glow-cyan">
                  <Trophy size={13} className="text-amber-400" />
                  {awaaz.badge}
                </span>

                <h2 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-text leading-tight">
                  {awaaz.title}
                </h2>

                <p className="mt-5 text-muted text-base sm:text-lg leading-relaxed">{awaaz.description}</p>

                <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {awaaz.features.map((f, i) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted">
                      <PSGlyph index={i} size={9} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-ink/60 p-4 font-mono text-xs text-muted overflow-x-auto">
                  {awaaz.flow.map((step, i) => (
                    <span key={step} className="flex items-center gap-2 shrink-0">
                      <span className="rounded-md border border-line bg-surface px-3 py-1.5 text-text">{step}</span>
                      {i < awaaz.flow.length - 1 && <ArrowRight size={12} className="text-line" />}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right VR HUD Visual Showcase */}
              <div className="lg:col-span-5">
                <div className="rainbow-card rounded-xl border border-emerald/40 bg-ink/80 p-6 font-mono text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-line/60 pb-3">
                    <span className="flex items-center gap-2 text-emerald font-semibold">
                      <Sparkles size={14} />
                      VR Audience HUD
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                      <Award size={11} />
                      1st Place Winner
                    </span>
                  </div>

                  {/* VR Audience Sentiment Gauge */}
                  <div className="rounded-lg border border-line bg-surface/70 p-4 space-y-2.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted flex items-center gap-1.5">
                        <Eye size={13} className="text-cyan" />
                        Simulated Audience Attention
                      </span>
                      <span className="text-emerald font-bold">94% Attentive</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-ink overflow-hidden">
                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-cyan to-emerald" />
                    </div>
                  </div>

                  {/* Speech Waveform Analysis */}
                  <div className="rounded-lg border border-line bg-surface/70 p-4 space-y-2.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted flex items-center gap-1.5">
                        <Mic size={13} className="text-emerald" />
                        Real-Time Speech Coaching
                      </span>
                      <span className="text-cyan font-bold">Pace: 135 wpm</span>
                    </div>

                    {/* Waveform bars */}
                    <div className="flex items-center justify-between gap-1.5 h-10 pt-1">
                      {[40, 75, 90, 60, 100, 85, 45, 95, 65, 80, 50, 90, 70, 40].map((h, idx) => (
                        <span
                          key={idx}
                          style={{ height: `${h}%` }}
                          className="w-1.5 rounded-full bg-gradient-to-t from-cyan/40 to-emerald"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-line/60 pt-3 text-center text-[11px] text-muted">
                    Code2Create '25 · 500+ competing engineering teams
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import { ArrowRight, Trophy } from 'lucide-react'
import Reveal from './Reveal'
import { awaaz } from '../data/content'

export default function Awaaz() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/30 p-9 sm:p-14">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald/[0.05] blur-[110px]" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan/[0.05] blur-[110px]" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 font-mono text-[11px] tracking-wide text-cyan uppercase">
                <Trophy size={13} />
                {awaaz.badge}
              </span>

              <h2 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-text max-w-2xl leading-tight">
                {awaaz.title}
              </h2>

              <p className="mt-5 text-muted text-base sm:text-lg max-w-xl leading-relaxed">{awaaz.description}</p>

              <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-2.5 max-w-2xl">
                {awaaz.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted">
                    <span className="h-1 w-1 rounded-full bg-emerald shrink-0" />
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
          </div>
        </Reveal>
      </div>
    </section>
  )
}

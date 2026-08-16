import Reveal from './Reveal'
import { focusAreas } from '../data/content'

export default function Focus() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {focusAreas.map((area, i) => (
          <Reveal key={area.id} delay={i * 0.06}>
            <div className="rainbow-card group h-full rounded-xl border border-line bg-surface/40 p-7 transition-transform hover:-translate-y-0.5">
              <span className="font-mono text-xs text-muted group-hover:text-cyan transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display font-semibold text-text">{area.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{area.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

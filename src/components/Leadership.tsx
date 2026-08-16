import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { leadership } from '../data/content'

export default function Leadership() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading label="Beyond Engineering" title="Beyond Engineering" />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {leadership.map((role, i) => (
            <Reveal key={role.id} delay={i * 0.06}>
              <div className="rainbow-card h-full rounded-xl border border-line bg-surface/40 p-7 transition-transform hover:-translate-y-0.5">
                <span className="font-mono text-xs text-muted">{role.period}</span>
                <h3 className="mt-3 font-display font-semibold text-lg text-text">{role.role}</h3>
                <p className="mt-1 text-sm text-emerald">{role.org}</p>
                <p className="mt-3 text-sm text-muted leading-relaxed">{role.focus}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

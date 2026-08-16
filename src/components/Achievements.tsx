import { Trophy, FileText, ScrollText, GraduationCap } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'
import { achievements } from '../data/content'

const icons: Record<string, typeof Trophy> = {
  trophy: Trophy,
  'file-text': FileText,
  scroll: ScrollText,
  'graduation-cap': GraduationCap,
}

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading number="06" label="Achievements" title="Achievements" />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievements.map((a, i) => {
            const Icon = icons[a.icon]
            return (
              <Reveal key={a.id} delay={i * 0.06}>
                <div className="rainbow-card group h-full rounded-xl border border-line bg-surface/40 p-7 transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                    <Icon size={16} className="text-muted transition-colors group-hover:text-cyan" />
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-text">{a.title}</h3>
                  <p className="mt-1 text-sm font-medium text-emerald">{a.highlight}</p>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{a.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
